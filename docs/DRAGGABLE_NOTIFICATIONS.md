# Draggable Notifications System

This document describes the complete Supabase database layout and implementation for the draggable notifications system in Trade Ease.

## Database Schema

### Core Tables

#### 1. `tags` Table
The main table for storing draggable tag annotations.

```sql
CREATE TABLE tags (
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
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2. `tag_replies` Table
For threaded conversations on tags.

```sql
CREATE TABLE tag_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  timestamp BIGINT NOT NULL DEFAULT (extract(epoch from now()) * 1000)::bigint,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3. `staff_notifications` Table
Tracks which staff members were tagged and their read status.

```sql
CREATE TABLE staff_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE NOT NULL,
  staff_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  notification_sent BOOLEAN DEFAULT FALSE,
  notification_sent_at TIMESTAMPTZ,
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tag_id, staff_id)
);
```

#### 4. Enhanced `notifications` Table
The existing notifications table has been enhanced with additional fields:

```sql
ALTER TABLE notifications ADD COLUMN sender_id UUID REFERENCES auth.users(id);
ALTER TABLE notifications ADD COLUMN sender_name VARCHAR(255);
ALTER TABLE notifications ADD COLUMN sender_avatar TEXT;
ALTER TABLE notifications ADD COLUMN comment TEXT;
ALTER TABLE notifications ADD COLUMN media_type attachment_type;
ALTER TABLE notifications ADD COLUMN media_url TEXT;
ALTER TABLE notifications ADD COLUMN drawing_data TEXT;
ALTER TABLE notifications ADD COLUMN requires_approval BOOLEAN DEFAULT FALSE;
ALTER TABLE notifications ADD COLUMN approval_status tag_approval_status DEFAULT 'pending';
ALTER TABLE notifications ADD COLUMN approver_ids UUID[] DEFAULT '{}';
ALTER TABLE notifications ADD COLUMN conversation_id UUID;
ALTER TABLE notifications ADD COLUMN reply_count INTEGER DEFAULT 0;
ALTER TABLE notifications ADD COLUMN coordinates JSONB;
ALTER TABLE notifications ADD COLUMN attachments JSONB DEFAULT '[]';
ALTER TABLE notifications ADD COLUMN notification_type notification_types;
```

### Enums

```sql
CREATE TYPE tag_approval_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE attachment_type AS ENUM ('image', 'audio', 'drawing', 'video');
CREATE TYPE notification_types AS ENUM ('job', 'quote', 'payment', 'message', 'other', 'tag', 'comment', 'team', 'calendar', 'account', 'security');
```

### Views

#### `tags_with_details` View
Provides comprehensive tag information with creator details and statistics.

```sql
CREATE VIEW tags_with_details AS
SELECT 
  t.*,
  creator.email as creator_email,
  creator_profile.first_name || ' ' || creator_profile.last_name as creator_name,
  creator_profile.avatar_url as creator_avatar,
  (SELECT COUNT(*)::int FROM tag_replies tr WHERE tr.tag_id = t.id) as reply_count,
  (SELECT COUNT(*)::int FROM staff_notifications sn WHERE sn.tag_id = t.id AND sn.read = false) as unread_count,
  -- Array of tagged staff with details
FROM tags t
LEFT JOIN auth.users creator ON creator.id = t.creator_id
LEFT JOIN user_profiles creator_profile ON creator_profile.user_id = t.creator_id;
```

### Storage

#### `tag-attachments` Bucket
Stores uploaded files (images, audio, drawings, videos).

- **Path structure**: `{user_id}/{tag_id}/{timestamp}.{extension}`
- **Public access**: Read-only for viewing attachments
- **Upload permissions**: Authenticated users can upload to their own folders

## Usage

### 1. Installing the Migration

Run the migration to create all necessary tables:

```bash
npx supabase db push
```

Or apply the specific migration:

```bash
npx supabase migration up 20250711000000_create_draggable_notifications_system
```

### 2. TypeScript Integration

Import the types and services:

```typescript
import {
  TagData,
  CreateTagPayload,
  TagWithDetails
} from '@/types/draggable-notifications';

import {
  createTag,
  fetchTags,
  fetchTagWithDetails
} from '@/services/enhancedTagService';

import {
  useTags,
  useTagReplies,
  useUnreadNotifications
} from '@/hooks/useDraggableNotifications';
```

### 3. Creating a Tag

```typescript
const payload: CreateTagPayload = {
  creatorId: user.id,
  comment: "Please review this section",
  taggedStaffIds: ["staff-id-1", "staff-id-2"],
  coords: { x: 150, y: 200 },
  attachments: [
    {
      type: 'image',
      url: 'https://example.com/image.jpg'
    }
  ],
  requiresApproval: true
};

const result = await createTag(payload);
if (result.error) {
  console.error('Failed to create tag:', result.error);
} else {
  console.log('Tag created:', result.data);
}
```

### 4. Using React Hooks

```typescript
// Fetch tags with filtering
const { tags, loading, error, createTag } = useTags(
  { creatorId: user.id }, // filters
  { limit: 20, orderBy: 'created_at' } // options
);

// Manage tag replies
const { replies, createReply } = useTagReplies(selectedTagId);

// Handle unread notifications
const { notifications, markAsRead } = useUnreadNotifications(user.id);
```

### 5. File Uploads

```typescript
import { useFileUpload } from '@/hooks/useDraggableNotifications';

const { uploadFile, uploads, loading } = useFileUpload();

const handleFileSelect = async (file: File) => {
  const result = await uploadFile(file, user.id, tagId);
  if (result.url) {
    // File uploaded successfully, use result.url
  }
};
```

### 6. Real-time Updates

```typescript
import { useRealtimeNotifications } from '@/hooks/useDraggableNotifications';

const { notifications } = useRealtimeNotifications(user.id);

// notifications will automatically update when new tags are created
// or replies are added to tags the user is involved with
```

## Security

### Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

- **Tags**: Users can view tags they created or are tagged in
- **Replies**: Users can view/create replies to tags they have access to
- **Staff Notifications**: Staff can only view their own notifications
- **Storage**: Users can only upload/manage their own files

### Policies Summary

1. **Tags Table**:
   - View: Creator, tagged staff, or staff with notifications
   - Create: Authenticated users (as creator)
   - Update: Creator or admins/managers (for approvals)

2. **Tag Replies Table**:
   - View: Users with access to the parent tag
   - Create: Users with access to the parent tag

3. **Staff Notifications Table**:
   - View: Only the staff member being notified
   - Create: Tag creators and system
   - Update: Only the staff member (for read status)

## API Examples

### Fetch Tags with Filters

```typescript
const response = await fetchTags(
  {
    approvalStatus: 'pending',
    requiresApproval: true,
    dateFrom: '2025-01-01'
  },
  {
    limit: 50,
    orderBy: 'created_at',
    orderDirection: 'desc'
  }
);
```

### Create a Reply

```typescript
const replyResponse = await createTagReply({
  tagId: 'tag-uuid',
  userId: 'user-uuid',
  content: 'This looks good to me!',
  attachments: [
    {
      type: 'image',
      url: 'https://example.com/approval-screenshot.jpg'
    }
  ]
});
```

### Approve/Reject Tags

```typescript
import { updateTagApproval } from '@/services/enhancedTagService';

// Approve a tag
await updateTagApproval('tag-uuid', 'approved', 'approver-user-id');

// Reject a tag
await updateTagApproval('tag-uuid', 'rejected', 'approver-user-id');
```

## Migration from Old System

If you have existing tag data in a different format:

1. **Backup existing data** before running the migration
2. **Map old fields** to new schema:
   - `creatorId` → `creator_id`
   - `taggedStaffIds` → `tagged_staff_ids`
   - `coords` → `coords` (ensure JSON format)
   - `attachments` → `attachments` (ensure proper array format)

3. **Update component imports**:
   ```typescript
   // Old
   import { createTag } from '@/services/tagService';
   
   // New
   import { createTag } from '@/services/enhancedTagService';
   ```

## Troubleshooting

### Common Issues

1. **Permission Denied Errors**:
   - Ensure RLS policies are set up correctly
   - Check that user is authenticated
   - Verify user has appropriate role for approval operations

2. **File Upload Failures**:
   - Check storage bucket exists and has correct policies
   - Verify file size limits
   - Ensure file types are allowed

3. **Real-time Not Working**:
   - Check Supabase project settings for real-time enabled
   - Verify subscription channel names match table names
   - Ensure proper cleanup of subscriptions

### Database Debugging

```sql
-- Check tag creation
SELECT * FROM tags WHERE creator_id = 'your-user-id' ORDER BY created_at DESC LIMIT 5;

-- Check staff notifications
SELECT * FROM staff_notifications WHERE staff_id = 'your-user-id' AND read = false;

-- Check reply counts
SELECT 
  t.id, 
  t.comment, 
  COUNT(tr.id) as reply_count 
FROM tags t 
LEFT JOIN tag_replies tr ON tr.tag_id = t.id 
GROUP BY t.id, t.comment;
```

## Performance Considerations

1. **Indexes**: All tables have appropriate indexes for common queries
2. **Pagination**: Use `limit` and `offset` for large datasets
3. **Filtering**: Use specific filters to reduce query size
4. **Real-time**: Unsubscribe from channels when components unmount
5. **File Storage**: Consider file size limits and compression for uploads

## Future Enhancements

Potential improvements to consider:

1. **Push Notifications**: Integration with mobile/browser push notifications
2. **Email Notifications**: Send email summaries for important tags
3. **Advanced Filtering**: More sophisticated filtering and search capabilities
4. **Analytics**: Track tag usage and engagement metrics
5. **Bulk Operations**: Support for bulk tag operations
6. **Templates**: Pre-defined tag templates for common scenarios