-- Enable all features for user danielsivyer4567@gmail.com
-- This sets the subscription tier to 'skeleton_key' which unlocks all features

-- First, ensure the user profile exists
INSERT INTO user_profiles (
  user_id,
  email,
  subscription_tier,
  max_organizations,
  subscription_features
)
VALUES (
  '7463a3ad-5193-4dee-b59f-307a8c1da359',
  'danielsivyer4567@gmail.com',
  'skeleton_key',
  999, -- Unlimited organizations
  '{
    "unlimited_organizations": true,
    "unlimited_users": true,
    "unlimited_jobs": true,
    "unlimited_customers": true,
    "unlimited_integrations": true,
    "priority_support": true,
    "advanced_analytics": true,
    "custom_branding": true,
    "api_access": true,
    "white_label": true,
    "automation_workflows": true,
    "advanced_reporting": true,
    "team_collaboration": true,
    "document_storage": "unlimited",
    "email_campaigns": true,
    "sms_messaging": true,
    "voice_calls": true,
    "property_boundaries": true,
    "ai_features": true,
    "all_calculators": true,
    "all_integrations": true
  }'::jsonb
)
ON CONFLICT (user_id) 
DO UPDATE SET
  subscription_tier = 'skeleton_key',
  max_organizations = 999,
  subscription_features = '{
    "unlimited_organizations": true,
    "unlimited_users": true,
    "unlimited_jobs": true,
    "unlimited_customers": true,
    "unlimited_integrations": true,
    "priority_support": true,
    "advanced_analytics": true,
    "custom_branding": true,
    "api_access": true,
    "white_label": true,
    "automation_workflows": true,
    "advanced_reporting": true,
    "team_collaboration": true,
    "document_storage": "unlimited",
    "email_campaigns": true,
    "sms_messaging": true,
    "voice_calls": true,
    "property_boundaries": true,
    "ai_features": true,
    "all_calculators": true,
    "all_integrations": true
  }'::jsonb,
  updated_at = NOW();

-- Also ensure the get_user_organizations function exists
-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS get_user_organizations();

-- Create the corrected function
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

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_user_organizations TO authenticated;

-- Verify the update
SELECT 
  user_id,
  email,
  subscription_tier,
  max_organizations,
  subscription_features
FROM user_profiles 
WHERE user_id = '7463a3ad-5193-4dee-b59f-307a8c1da359'; 