-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.has_organization_access;

-- Recreate function with updated implementation
CREATE OR REPLACE FUNCTION public.has_organization_access(org_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path TO public, auth
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.organization_members 
    WHERE organization_id = org_id 
    AND user_id = auth.uid()
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.has_organization_access(uuid) TO authenticated;

-- Add function comment
COMMENT ON FUNCTION public.has_organization_access(uuid) IS 'Checks if the current user has access to the specified organization'; 