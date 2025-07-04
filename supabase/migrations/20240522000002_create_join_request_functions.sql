-- Function to search for organizations
CREATE OR REPLACE FUNCTION public.search_organizations(
    p_search_term TEXT
)
RETURNS TABLE (
    id UUID,
    name TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        o.id,
        o.name
    FROM
        public.organizations AS o
    WHERE
        o.name ILIKE '%' || p_search_term || '%'
        AND NOT EXISTS (
            SELECT 1
            FROM public.organization_members om
            WHERE om.organization_id = o.id
            AND om.user_id = auth.uid()
        )
    LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function for a user to request to join an organization
CREATE OR REPLACE FUNCTION public.request_to_join_organization(
    p_organization_id UUID
)
RETURNS VOID AS $$
DECLARE
    v_user_id UUID := auth.uid();
BEGIN
    -- Check if a pending request already exists to prevent duplicates
    IF EXISTS (
        SELECT 1
        FROM public.organization_join_requests
        WHERE organization_id = p_organization_id
        AND user_id = v_user_id
        AND status = 'pending'
    ) THEN
        RAISE EXCEPTION 'A pending join request for this organization already exists.';
    END IF;

    -- Insert the new join request
    INSERT INTO public.organization_join_requests (organization_id, user_id, status)
    VALUES (p_organization_id, v_user_id, 'pending');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 