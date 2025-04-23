-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.has_organization_access;

-- Recreate function with explicit search path
CREATE OR REPLACE FUNCTION public.has_organization_access(organization_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  has_access boolean;
BEGIN
  -- Check if the user has access to the organization
  SELECT EXISTS (
    SELECT 1
    FROM organization_members om
    WHERE om.organization_id = $1
    AND om.user_id = auth.uid()
  ) INTO has_access;

  RETURN has_access;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.has_organization_access(uuid) TO authenticated;

-- Add function comment
COMMENT ON FUNCTION public.has_organization_access(uuid) IS 'Checks if the current user has access to the specified organization'; 