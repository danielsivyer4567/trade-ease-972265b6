-- Migration: Create Draggable Notifications System
-- Date: 2025-07-11
-- Description: Creates tables and functions for the advanced draggable notifications system with tagging, media attachments, and approval workflows

-- Create enum types for better type safety
CREATE TYPE IF NOT EXISTS tag_approval_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE IF NOT EXISTS attachment_type AS ENUM ('image', 'audio', 'drawing', 'video');
CREATE TYPE IF NOT EXISTS notification_types AS ENUM ('job', 'quote', 'payment', 'message', 'other', 'tag', 'comment', 'team', 'calendar', 'account', 'security');

-- Create tags table for the draggable notifications system
CREATE TABLE IF NOT EXISTS tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  comment TEXT,
  tagged_staff_ids UUID[] DEFAULT '{}',
  attachments JSONB DEFAULT '[]',
  coords JSONB NOT NULL, -- {x: number, y: number}
  timestamp BIGINT NOT NULL DEFAULT (extract(epoch from now()) * 1000)::bigint,
  drawing_data TEXT, -- Base64 encoded drawing data
  conversation_id UUID,
  reply_to_id UUID REFERENCES tags(id) ON DELETE SET NULL,
  requires_approval BOOLEAN DEFAULT FALSE,
  approval_status tag_approval_status DEFAULT 'pending',
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Add constraints
  CONSTRAINT tags_coords_format CHECK (jsonb_typeof(coords) = 'object'),
  CONSTRAINT tags_attachments_format CHECK (jsonb_typeof(attachments) = 'array')
);

-- Create tag_replies table for conversation threading
CREATE TABLE IF NOT EXISTS tag_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  timestamp BIGINT NOT NULL DEFAULT (extract(epoch from now()) * 1000)::bigint,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Add constraints
  CONSTRAINT tag_replies_attachments_format CHECK (jsonb_typeof(attachments) = 'array')
);

-- Create staff_notifications table to track which staff members were tagged
CREATE TABLE IF NOT EXISTS staff_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE NOT NULL,
  staff_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  notification_sent BOOLEAN DEFAULT FALSE,
  notification_sent_at TIMESTAMPTZ,
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure unique constraint
  UNIQUE(tag_id, staff_id)
);

-- Enhance the existing notifications table with additional fields for draggable notifications
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS sender_name VARCHAR(255);
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS sender_avatar TEXT;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS comment TEXT;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS media_type attachment_type;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS media_url TEXT;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS drawing_data TEXT;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS requires_approval BOOLEAN DEFAULT FALSE;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS approval_status tag_approval_status DEFAULT 'pending';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS approver_ids UUID[] DEFAULT '{}';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS conversation_id UUID;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS reply_count INTEGER DEFAULT 0;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS coordinates JSONB;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS notification_type notification_types;

-- Update the type column to use the new enum (migrate existing data first)
UPDATE notifications SET notification_type = 
  CASE 
    WHEN type = 'job' THEN 'job'::notification_types
    WHEN type = 'quote' THEN 'quote'::notification_types
    WHEN type = 'payment' THEN 'payment'::notification_types
    WHEN type = 'message' THEN 'message'::notification_types
    WHEN type = 'tag' THEN 'tag'::notification_types
    WHEN type = 'comment' THEN 'comment'::notification_types
    WHEN type = 'team' THEN 'team'::notification_types
    WHEN type = 'calendar' THEN 'calendar'::notification_types
    WHEN type = 'account' THEN 'account'::notification_types
    WHEN type = 'security' THEN 'security'::notification_types
    ELSE 'other'::notification_types
  END
WHERE notification_type IS NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tags_creator_id ON tags(creator_id);
CREATE INDEX IF NOT EXISTS idx_tags_conversation_id ON tags(conversation_id);
CREATE INDEX IF NOT EXISTS idx_tags_reply_to_id ON tags(reply_to_id);
CREATE INDEX IF NOT EXISTS idx_tags_approval_status ON tags(approval_status);
CREATE INDEX IF NOT EXISTS idx_tags_created_at ON tags(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tags_tagged_staff_ids ON tags USING GIN(tagged_staff_ids);

CREATE INDEX IF NOT EXISTS idx_tag_replies_tag_id ON tag_replies(tag_id);
CREATE INDEX IF NOT EXISTS idx_tag_replies_user_id ON tag_replies(user_id);
CREATE INDEX IF NOT EXISTS idx_tag_replies_created_at ON tag_replies(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_staff_notifications_tag_id ON staff_notifications(tag_id);
CREATE INDEX IF NOT EXISTS idx_staff_notifications_staff_id ON staff_notifications(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_notifications_read ON staff_notifications(read);

CREATE INDEX IF NOT EXISTS idx_notifications_sender_id ON notifications(sender_id);
CREATE INDEX IF NOT EXISTS idx_notifications_conversation_id ON notifications(conversation_id);
CREATE INDEX IF NOT EXISTS idx_notifications_notification_type ON notifications(notification_type);
CREATE INDEX IF NOT EXISTS idx_notifications_approval_status ON notifications(approval_status);

-- Enable Row Level Security for new tables
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE tag_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tags table
CREATE POLICY "Users can view tags they created or are tagged in" ON tags
  FOR SELECT USING (
    auth.uid() = creator_id OR 
    auth.uid() = ANY(tagged_staff_ids) OR
    auth.uid() IN (
      SELECT staff_id FROM staff_notifications WHERE tag_id = tags.id
    )
  );

CREATE POLICY "Users can create tags" ON tags
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own tags" ON tags
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Admins and approvers can update tag approval status" ON tags
  FOR UPDATE USING (
    auth.uid() = creator_id OR
    auth.uid() IN (
      SELECT user_id FROM user_profiles WHERE role IN ('admin', 'manager')
    )
  );

-- Create RLS policies for tag_replies table
CREATE POLICY "Users can view replies to tags they have access to" ON tag_replies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tags 
      WHERE tags.id = tag_replies.tag_id 
      AND (
        auth.uid() = tags.creator_id OR 
        auth.uid() = ANY(tags.tagged_staff_ids) OR
        auth.uid() IN (
          SELECT staff_id FROM staff_notifications WHERE tag_id = tags.id
        )
      )
    )
  );

CREATE POLICY "Users can create replies to tags they have access to" ON tag_replies
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM tags 
      WHERE tags.id = tag_replies.tag_id 
      AND (
        auth.uid() = tags.creator_id OR 
        auth.uid() = ANY(tags.tagged_staff_ids) OR
        auth.uid() IN (
          SELECT staff_id FROM staff_notifications WHERE tag_id = tags.id
        )
      )
    )
  );

-- Create RLS policies for staff_notifications table
CREATE POLICY "Staff can view their own notifications" ON staff_notifications
  FOR SELECT USING (auth.uid() = staff_id);

CREATE POLICY "Tag creators and system can create staff notifications" ON staff_notifications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM tags 
      WHERE tags.id = staff_notifications.tag_id 
      AND auth.uid() = tags.creator_id
    )
  );

CREATE POLICY "Staff can update their own notification read status" ON staff_notifications
  FOR UPDATE USING (auth.uid() = staff_id);

-- Create trigger functions
CREATE OR REPLACE FUNCTION update_tag_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to automatically create staff notifications when a tag is created
CREATE OR REPLACE FUNCTION create_staff_notifications()
RETURNS TRIGGER AS $$
DECLARE
  staff_id UUID;
BEGIN
  -- Create notification entries for each tagged staff member
  IF NEW.tagged_staff_ids IS NOT NULL THEN
    FOREACH staff_id IN ARRAY NEW.tagged_staff_ids
    LOOP
      INSERT INTO staff_notifications (tag_id, staff_id)
      VALUES (NEW.id, staff_id)
      ON CONFLICT (tag_id, staff_id) DO NOTHING;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update reply count when replies are added/removed
CREATE OR REPLACE FUNCTION update_tag_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE tags 
    SET updated_at = NOW()
    WHERE id = NEW.tag_id;
    
    -- Also update reply count in notifications table if exists
    UPDATE notifications
    SET reply_count = reply_count + 1
    WHERE conversation_id = NEW.tag_id::text;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE tags 
    SET updated_at = NOW()
    WHERE id = OLD.tag_id;
    
    -- Also update reply count in notifications table if exists
    UPDATE notifications
    SET reply_count = GREATEST(reply_count - 1, 0)
    WHERE conversation_id = OLD.tag_id::text;
    
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_tags_updated_at 
  BEFORE UPDATE ON tags
  FOR EACH ROW 
  EXECUTE FUNCTION update_tag_updated_at();

CREATE TRIGGER create_staff_notifications_trigger
  AFTER INSERT ON tags
  FOR EACH ROW
  EXECUTE FUNCTION create_staff_notifications();

CREATE TRIGGER update_tag_reply_count_trigger
  AFTER INSERT OR DELETE ON tag_replies
  FOR EACH ROW
  EXECUTE FUNCTION update_tag_reply_count();

-- Create a view for easy querying of tags with related data
CREATE OR REPLACE VIEW tags_with_details AS
SELECT 
  t.*,
  creator.email as creator_email,
  creator_profile.first_name || ' ' || creator_profile.last_name as creator_name,
  creator_profile.avatar_url as creator_avatar,
  (
    SELECT COUNT(*)::int 
    FROM tag_replies tr 
    WHERE tr.tag_id = t.id
  ) as reply_count,
  (
    SELECT COUNT(*)::int 
    FROM staff_notifications sn 
    WHERE sn.tag_id = t.id AND sn.read = false
  ) as unread_count,
  (
    SELECT array_agg(
      jsonb_build_object(
        'id', u.id,
        'email', u.email,
        'name', up.first_name || ' ' || up.last_name,
        'avatar', up.avatar_url
      )
    )
    FROM unnest(t.tagged_staff_ids) as staff_id
    LEFT JOIN auth.users u ON u.id = staff_id
    LEFT JOIN user_profiles up ON up.user_id = staff_id
  ) as tagged_staff_details
FROM tags t
LEFT JOIN auth.users creator ON creator.id = t.creator_id
LEFT JOIN user_profiles creator_profile ON creator_profile.user_id = t.creator_id;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON TABLE tags TO authenticated;
GRANT ALL ON TABLE tag_replies TO authenticated;
GRANT ALL ON TABLE staff_notifications TO authenticated;
GRANT SELECT ON TABLE tags_with_details TO authenticated;

-- Add helpful comments
COMMENT ON TABLE tags IS 'Stores draggable tag annotations with coordinates, media attachments, and approval workflows';
COMMENT ON TABLE tag_replies IS 'Stores threaded replies to tags for conversation functionality';
COMMENT ON TABLE staff_notifications IS 'Tracks which staff members were notified about tags and their read status';
COMMENT ON VIEW tags_with_details IS 'Comprehensive view of tags with creator info, reply counts, and tagged staff details';

-- Create storage bucket for tag attachments if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('tag-attachments', 'tag-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for tag attachments
CREATE POLICY "Anyone can view tag attachments" ON storage.objects
  FOR SELECT USING (bucket_id = 'tag-attachments');

CREATE POLICY "Authenticated users can upload tag attachments" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'tag-attachments' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own tag attachments" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'tag-attachments' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own tag attachments" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'tag-attachments' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );