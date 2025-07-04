-- Comprehensive fix for "Error loading organizations" 
-- This fixes the "invalid UNION/INTERSECT/EXCEPT ORDER BY clause" error

-- Step 1: Ensure organizations table exists
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

-- Step 2: Ensure organization_members table exists
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

-- Step 3: Ensure agency_client_relationships table exists
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

-- Step 4: Add current_organization_id to user_profiles if missing
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

-- Step 5: Drop the existing function if it exists
DROP FUNCTION IF EXISTS get_user_organizations();

-- Step 6: Create the CORRECTED function (with proper ORDER BY handling)
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
  WITH all_organizations AS (
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
  )
  SELECT * FROM all_organizations
  ORDER BY is_current DESC, name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 7: Enable RLS on tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_client_relationships ENABLE ROW LEVEL SECURITY;

-- Step 8: Grant permissions
GRANT ALL ON organizations TO authenticated;
GRANT ALL ON organization_members TO authenticated;
GRANT ALL ON agency_client_relationships TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_organizations TO authenticated;

-- Step 9: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_organization_members_user_id ON organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_org_id ON organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_agency_relationships_agency_user ON agency_client_relationships(agency_user_id);
CREATE INDEX IF NOT EXISTS idx_agency_relationships_client_org ON agency_client_relationships(client_organization_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_current_org ON user_profiles(current_organization_id);

-- Step 10: Verify the fix
SELECT 
    'organizations table' as item,
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'organizations') as exists
UNION ALL
SELECT 
    'organization_members table' as item,
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'organization_members') as exists
UNION ALL
SELECT 
    'agency_client_relationships table' as item,
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'agency_client_relationships') as exists
UNION ALL
SELECT 
    'user_profiles.current_organization_id column' as item,
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'current_organization_id') as exists
UNION ALL
SELECT 
    'get_user_organizations function' as item,
    EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'get_user_organizations') as exists; 