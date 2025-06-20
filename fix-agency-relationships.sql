-- Fix for missing client_organization_id column in agency_client_relationships table

-- First, check if the table exists and has the correct structure
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'agency_client_relationships'
ORDER BY ordinal_position;

-- Drop and recreate the table if it exists with wrong structure
DROP TABLE IF EXISTS agency_client_relationships CASCADE;

-- Create the table with the correct structure
CREATE TABLE agency_client_relationships (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  agency_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  client_organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  client_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  permissions JSONB DEFAULT '{
    "view_all": true,
    "edit_settings": false,
    "manage_users": false,
    "manage_billing": false,
    "create_content": true,
    "delete_content": false,
    "export_data": true
  }'::jsonb,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'terminated')),
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(agency_user_id, client_organization_id)
);

-- Enable RLS
ALTER TABLE agency_client_relationships ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their agency relationships"
ON agency_client_relationships FOR SELECT
USING (
  agency_user_id = auth.uid() 
  OR 
  client_user_id = auth.uid()
);

CREATE POLICY "Agency users can manage their client relationships"
ON agency_client_relationships FOR ALL
USING (
  agency_user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid()
    AND subscription_tier = 'skeleton_key'
  )
);

-- Grant permissions
GRANT ALL ON agency_client_relationships TO authenticated;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_agency_relationships_agency_user ON agency_client_relationships(agency_user_id);
CREATE INDEX IF NOT EXISTS idx_agency_relationships_client_org ON agency_client_relationships(client_organization_id);

-- Verify the table structure
SELECT 
    'agency_client_relationships' as table_name,
    COUNT(*) as column_count,
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agency_client_relationships' AND column_name = 'client_organization_id') as has_client_organization_id
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'agency_client_relationships'; 