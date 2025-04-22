-- Create enum types for role and status
CREATE TYPE public.organization_role AS ENUM ('OWNER', 'ADMIN', 'MEMBER');
CREATE TYPE public.organization_member_status AS ENUM ('ACTIVE', 'PENDING', 'INACTIVE');

-- Create organizations table
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    metadata JSONB DEFAULT '{}'::JSONB,
    settings JSONB DEFAULT '{}'::JSONB,
    CONSTRAINT organizations_name_length CHECK (CHAR_LENGTH(name) >= 1 AND CHAR_LENGTH(name) <= 255),
    CONSTRAINT organizations_slug_length CHECK (CHAR_LENGTH(slug) >= 1 AND CHAR_LENGTH(slug) <= 255)
);

-- Create organization members table
CREATE TABLE IF NOT EXISTS public.organization_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role organization_role NOT NULL DEFAULT 'MEMBER',
    status organization_member_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    metadata JSONB DEFAULT '{}'::JSONB,
    UNIQUE(organization_id, user_id)
);

-- Create organization invites table
CREATE TABLE IF NOT EXISTS public.organization_invites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role organization_role NOT NULL DEFAULT 'MEMBER',
    invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token UUID DEFAULT gen_random_uuid() NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW() + INTERVAL '7 days') NOT NULL,
    UNIQUE(organization_id, email)
);

-- Create function to check organization access
CREATE OR REPLACE FUNCTION public.has_organization_access(
    user_id UUID,
    organization_id UUID
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, auth
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.organization_members
        WHERE user_id = $1 
        AND organization_id = $2
        AND status = 'ACTIVE'
    );
END;
$$;

-- Create function to check organization admin access
CREATE OR REPLACE FUNCTION public.has_organization_admin_access(
    user_id UUID,
    organization_id UUID
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, auth
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.organization_members
        WHERE user_id = $1 
        AND organization_id = $2
        AND role IN ('ADMIN', 'OWNER')
        AND status = 'ACTIVE'
    );
END;
$$;

-- Create function to get user's organizations
CREATE OR REPLACE FUNCTION public.get_user_organizations(user_id UUID)
RETURNS TABLE (
    organization_id UUID,
    organization_name TEXT,
    organization_slug TEXT,
    member_role organization_role,
    member_status organization_member_status
)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, auth
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.id as organization_id,
        o.name as organization_name,
        o.slug as organization_slug,
        om.role as member_role,
        om.status as member_status
    FROM public.organizations o
    JOIN public.organization_members om ON o.id = om.organization_id
    WHERE om.user_id = $1;
END;
$$;

-- Create RLS policies
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_invites ENABLE ROW LEVEL SECURITY;

-- Organizations policies
CREATE POLICY "Users can view organizations they are members of" ON public.organizations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.organization_members
            WHERE organization_id = organizations.id
            AND user_id = auth.uid()
            AND status = 'ACTIVE'
        )
    );

CREATE POLICY "Organization admins can update their organizations" ON public.organizations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.organization_members
            WHERE organization_id = organizations.id
            AND user_id = auth.uid()
            AND role IN ('ADMIN', 'OWNER')
            AND status = 'ACTIVE'
        )
    );

-- Organization members policies
CREATE POLICY "Users can view members of their organizations" ON public.organization_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.organization_members
            WHERE organization_id = organization_members.organization_id
            AND user_id = auth.uid()
            AND status = 'ACTIVE'
        )
    );

CREATE POLICY "Organization admins can manage members" ON public.organization_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.organization_members
            WHERE organization_id = organization_members.organization_id
            AND user_id = auth.uid()
            AND role IN ('ADMIN', 'OWNER')
            AND status = 'ACTIVE'
        )
    );

-- Organization invites policies
CREATE POLICY "Organization admins can manage invites" ON public.organization_invites
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.organization_members
            WHERE organization_id = organization_invites.organization_id
            AND user_id = auth.uid()
            AND role IN ('ADMIN', 'OWNER')
            AND status = 'ACTIVE'
        )
    );

-- Create indexes for better performance
CREATE INDEX idx_organization_members_user_id ON public.organization_members(user_id);
CREATE INDEX idx_organization_members_organization_id ON public.organization_members(organization_id);
CREATE INDEX idx_organization_invites_organization_id ON public.organization_invites(organization_id);
CREATE INDEX idx_organization_invites_email ON public.organization_invites(email);
CREATE INDEX idx_organizations_slug ON public.organizations(slug);

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON public.organizations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_organization_members_updated_at
    BEFORE UPDATE ON public.organization_members
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column(); 