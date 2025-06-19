-- Create enum for user roles
CREATE TYPE user_role AS ENUM (
    'SITE_STAFF',
    'TEAM_LEADER',
    'ADMIN_STAFF',
    'DIRECTOR'
);

-- Create organizations table if it doesn't exist
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, organization_id)
);

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies for organizations
CREATE POLICY "Users can view their own organizations"
    ON organizations
    FOR SELECT
    USING (
        id IN (
            SELECT organization_id 
            FROM user_roles 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Only directors can create organizations"
    ON organizations
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND role = 'DIRECTOR'
        )
    );

CREATE POLICY "Only directors can update organizations"
    ON organizations
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND role = 'DIRECTOR'
        )
    );

-- Create policies for user_roles
CREATE POLICY "Users can view their own roles"
    ON user_roles
    FOR SELECT
    USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND role IN ('ADMIN_STAFF', 'DIRECTOR')
        )
    );

CREATE POLICY "Only directors and admin staff can manage roles"
    ON user_roles
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND role IN ('ADMIN_STAFF', 'DIRECTOR')
        )
    );

-- Create function to get user's role in an organization
CREATE OR REPLACE FUNCTION get_user_role(org_id UUID)
RETURNS user_role
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN (
        SELECT role
        FROM user_roles
        WHERE user_id = auth.uid()
        AND organization_id = org_id
    );
END;
$$;

-- Create function to check if user has specific role
CREATE OR REPLACE FUNCTION has_role(org_id UUID, required_role user_role)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_role user_role;
BEGIN
    SELECT get_user_role(org_id) INTO user_role;
    
    RETURN CASE
        WHEN user_role = 'DIRECTOR' THEN TRUE
        WHEN user_role = 'ADMIN_STAFF' AND required_role != 'DIRECTOR' THEN TRUE
        WHEN user_role = 'TEAM_LEADER' AND required_role IN ('TEAM_LEADER', 'SITE_STAFF') THEN TRUE
        WHEN user_role = 'SITE_STAFF' AND required_role = 'SITE_STAFF' THEN TRUE
        ELSE FALSE
    END;
END;
$$;

-- Create function to assign role to user
CREATE OR REPLACE FUNCTION assign_user_role(
    target_user_id UUID,
    org_id UUID,
    new_role user_role
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if the current user has permission to assign roles
    IF NOT EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid()
        AND organization_id = org_id
        AND role IN ('ADMIN_STAFF', 'DIRECTOR')
    ) THEN
        RAISE EXCEPTION 'Insufficient permissions to assign roles';
    END IF;

    -- Insert or update the role
    INSERT INTO user_roles (user_id, organization_id, role)
    VALUES (target_user_id, org_id, new_role)
    ON CONFLICT (user_id, organization_id)
    DO UPDATE SET role = new_role;
END;
$$; 