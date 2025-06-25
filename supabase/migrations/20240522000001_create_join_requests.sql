-- Table for users to request to join an organization
CREATE TABLE IF NOT EXISTS public.organization_join_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT unique_pending_request UNIQUE(organization_id, user_id, status) WHERE (status = 'pending')
);

-- Index for efficient querying of user requests
CREATE INDEX IF NOT EXISTS idx_user_join_requests ON public.organization_join_requests(user_id);

-- Index for efficient querying of organization requests
CREATE INDEX IF NOT EXISTS idx_organization_join_requests ON public.organization_join_requests(organization_id);

-- Function to handle timestamp updates
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamp on row update
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON public.organization_join_requests
FOR EACH ROW
EXECUTE PROCEDURE public.trigger_set_timestamp();

COMMENT ON TABLE public.organization_join_requests IS 'Tracks user requests to join organizations.';
COMMENT ON COLUMN public.organization_join_requests.status IS 'The current status of the join request (pending, accepted, rejected).';
COMMENT ON CONSTRAINT unique_pending_request ON public.organization_join_requests IS 'Ensures a user cannot have multiple pending requests for the same organization.'; 