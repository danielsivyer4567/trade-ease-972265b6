-- Create enum for notification types
CREATE TYPE notification_type AS ENUM ('notification', 'email', 'sms', 'whatsapp');

-- Create enum for redirect pages
CREATE TYPE redirect_page AS ENUM ('contact', 'dashboard', 'jobs', 'quotes');

-- Create enum for roles
CREATE TYPE workflow_role AS ENUM ('admin', 'manager', 'employee', 'customer');

-- Create workflow nodes table
CREATE TABLE workflow_nodes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    node_id TEXT NOT NULL,
    action_name TEXT NOT NULL,
    notification_type notification_type NOT NULL DEFAULT 'notification',
    title TEXT,
    message TEXT,
    redirect_page redirect_page DEFAULT 'dashboard',
    assigned_role workflow_role,
    assigned_user UUID REFERENCES auth.users(id),
    position_x FLOAT NOT NULL,
    position_y FLOAT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE workflow_nodes ENABLE ROW LEVEL SECURITY;

-- Policy for select
CREATE POLICY "Users can view their own workflow nodes"
    ON workflow_nodes
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy for insert
CREATE POLICY "Users can insert their own workflow nodes"
    ON workflow_nodes
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy for update
CREATE POLICY "Users can update their own workflow nodes"
    ON workflow_nodes
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy for delete
CREATE POLICY "Users can delete their own workflow nodes"
    ON workflow_nodes
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_workflow_nodes_updated_at
    BEFORE UPDATE ON workflow_nodes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create index for faster queries
CREATE INDEX workflow_nodes_workflow_id_idx ON workflow_nodes(workflow_id);
CREATE INDEX workflow_nodes_user_id_idx ON workflow_nodes(user_id); 