-- Multi-Business/Multi-Tenant System Migration
-- This migration adds support for premium users with multiple businesses
-- and agency users who can manage their clients' businesses

-- First, ensure we have the organizations table
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

-- Create organization_members table if not exists
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

-- Add subscription/plan information to user_profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free_starter' CHECK (subscription_tier IN ('free_starter', 'growing_pain_relief', 'premium_edge', 'skeleton_key')),
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS max_organizations INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS max_users INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS current_organization_id UUID REFERENCES organizations(id),
ADD COLUMN IF NOT EXISTS subscription_features JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS affiliate_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS affiliate_earnings DECIMAL(10,2) DEFAULT 0;

-- Create agency_client_relationships table for agency users
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

-- Create organization_invitations table
CREATE TABLE IF NOT EXISTS organization_invitations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  invitation_type TEXT DEFAULT 'member' CHECK (invitation_type IN ('member', 'agency')),
  invited_by UUID REFERENCES auth.users(id),
  token TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit log for organization activities
CREATE TABLE IF NOT EXISTS organization_audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_organization_members_user_id ON organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_org_id ON organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_agency_relationships_agency_user ON agency_client_relationships(agency_user_id);
CREATE INDEX IF NOT EXISTS idx_agency_relationships_client_org ON agency_client_relationships(client_organization_id);
CREATE INDEX IF NOT EXISTS idx_org_audit_logs_org_id ON organization_audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_audit_logs_user_id ON organization_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_org_invitations_token ON organization_invitations(token);
CREATE INDEX IF NOT EXISTS idx_user_profiles_current_org ON user_profiles(current_organization_id);

-- Enable RLS on all new tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_client_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations
CREATE POLICY "Users can view organizations they belong to"
ON organizations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM organization_members 
    WHERE organization_members.organization_id = organizations.id 
    AND organization_members.user_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM agency_client_relationships
    WHERE agency_client_relationships.client_organization_id = organizations.id
    AND agency_client_relationships.agency_user_id = auth.uid()
    AND agency_client_relationships.status = 'active'
  )
);

CREATE POLICY "Organization owners can update their organizations"
ON organizations FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM organization_members 
    WHERE organization_members.organization_id = organizations.id 
    AND organization_members.user_id = auth.uid()
    AND organization_members.role IN ('owner', 'admin')
  )
);

CREATE POLICY "Users can create organizations based on their subscription"
ON organizations FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
    AND (
      (user_profiles.subscription_tier IN ('free_starter', 'growing_pain_relief') AND 
       (SELECT COUNT(*) FROM organization_members WHERE user_id = auth.uid()) < 1)
      OR
      (user_profiles.subscription_tier = 'premium_edge' AND
       (SELECT COUNT(*) FROM organization_members WHERE user_id = auth.uid()) < COALESCE(user_profiles.max_organizations, 5))
      OR
      (user_profiles.subscription_tier = 'skeleton_key')
    )
  )
);

-- RLS Policies for organization_members
CREATE POLICY "Members can view their organization members"
ON organization_members FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
  )
  OR
  organization_id IN (
    SELECT client_organization_id FROM agency_client_relationships 
    WHERE agency_user_id = auth.uid() AND status = 'active'
  )
);

CREATE POLICY "Organization admins can manage members"
ON organization_members FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM organization_members om
    WHERE om.organization_id = organization_members.organization_id
    AND om.user_id = auth.uid()
    AND om.role IN ('owner', 'admin')
  )
);

-- RLS Policies for agency_client_relationships
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

-- Function to switch organization context
CREATE OR REPLACE FUNCTION switch_organization_context(target_org_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  has_access BOOLEAN;
BEGIN
  -- Check if user has access to the organization
  SELECT EXISTS (
    SELECT 1 FROM organization_members 
    WHERE organization_id = target_org_id 
    AND user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM agency_client_relationships
    WHERE client_organization_id = target_org_id
    AND agency_user_id = auth.uid()
    AND status = 'active'
  ) INTO has_access;

  IF has_access THEN
    -- Update user's current organization
    UPDATE user_profiles 
    SET current_organization_id = target_org_id,
        updated_at = NOW()
    WHERE user_id = auth.uid();
    
    -- Log the switch
    INSERT INTO organization_audit_logs (
      organization_id, 
      user_id, 
      action, 
      entity_type, 
      entity_id
    ) VALUES (
      target_org_id,
      auth.uid(),
      'switch_context',
      'organization',
      target_org_id
    );
    
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's accessible organizations
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

-- Grant necessary permissions
GRANT ALL ON organizations TO authenticated;
GRANT ALL ON organization_members TO authenticated;
GRANT ALL ON agency_client_relationships TO authenticated;
GRANT ALL ON organization_invitations TO authenticated;
GRANT ALL ON organization_audit_logs TO authenticated;
GRANT EXECUTE ON FUNCTION switch_organization_context TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_organizations TO authenticated;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organization_members_updated_at BEFORE UPDATE ON organization_members
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agency_relationships_updated_at BEFORE UPDATE ON agency_client_relationships
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 