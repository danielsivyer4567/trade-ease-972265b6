-- Fix for get_user_organizations function
-- This fixes the "invalid UNION/INTERSECT/EXCEPT ORDER BY clause" error

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

-- Test the function
SELECT * FROM get_user_organizations(); 