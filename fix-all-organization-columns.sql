-- Comprehensive fix for organization-related tables and columns
-- This ensures all required tables and columns exist

-- 1. First, ensure the organizations table exists with all columns
CREATE TABLE IF NOT EXISTS organizations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  business_type TEXT,
  abn TEXT,
  acn TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'Australia',
  phone TEXT,
  email TEXT,
  website TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 2. Add is_active column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'organizations' 
        AND column_name = 'is_active'
    ) THEN
        ALTER TABLE organizations 
        ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
END $$;

-- 3. Ensure organization_members table exists
CREATE TABLE IF NOT EXISTS organization_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  permissions JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  invited_by UUID REFERENCES auth.users(id),
  accepted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(organization_id, user_id)
);

-- 4. Add current_organization_id to user_profiles if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles' 
        AND column_name = 'current_organization_id'
    ) THEN
        ALTER TABLE user_profiles 
        ADD COLUMN current_organization_id UUID REFERENCES organizations(id);
    END IF;
END $$;

-- 5. Ensure agency_client_relationships table exists
CREATE TABLE IF NOT EXISTS agency_client_relationships (
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

-- 6. Enable RLS on tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_client_relationships ENABLE ROW LEVEL SECURITY;

-- 7. Create or replace the get_user_organizations function
CREATE OR REPLACE FUNCTION get_user_organizations()
RETURNS TABLE (
  organization_id UUID,
  organization_name TEXT,
  role TEXT,
  access_type TEXT,
  is_current BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  -- Get organizations where user is a member
  SELECT 
    o.id,
    o.name,
    om.role,
    'member'::TEXT as access_type,
    (up.current_organization_id = o.id) as is_current
  FROM organizations o
  JOIN organization_members om ON o.id = om.organization_id
  LEFT JOIN user_profiles up ON up.user_id = auth.uid()
  WHERE om.user_id = auth.uid()
  AND o.is_active = true
  
  UNION
  
  -- Get organizations where user has agency access
  SELECT 
    o.id,
    o.name,
    'agency'::TEXT as role,
    'agency'::TEXT as access_type,
    (up.current_organization_id = o.id) as is_current
  FROM organizations o
  JOIN agency_client_relationships acr ON o.id = acr.client_organization_id
  LEFT JOIN user_profiles up ON up.user_id = auth.uid()
  WHERE acr.agency_user_id = auth.uid()
  AND acr.status = 'active'
  AND o.is_active = true
  
  ORDER BY is_current DESC, organization_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Grant permissions
GRANT ALL ON organizations TO authenticated;
GRANT ALL ON organization_members TO authenticated;
GRANT ALL ON agency_client_relationships TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_organizations TO authenticated;

-- 9. Verify the setup
SELECT 
    'organizations table' as item,
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'organizations') as exists,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'organizations' AND column_name = 'is_active') as has_is_active
UNION ALL
SELECT 
    'user_profiles.current_organization_id' as item,
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'current_organization_id') as exists,
    NULL as has_is_active
UNION ALL
SELECT 
    'get_user_organizations function' as item,
    EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'get_user_organizations') as exists,
    NULL as has_is_active; 