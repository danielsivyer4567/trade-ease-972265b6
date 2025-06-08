-- Create workflow-related tables

-- Ensure extensions are available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Workflows table (if not already exists)
CREATE TABLE IF NOT EXISTS workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  data JSONB NOT NULL,
  category TEXT,
  is_template BOOLEAN DEFAULT false,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflow nodes table
CREATE TABLE IF NOT EXISTS workflow_nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
  node_type TEXT NOT NULL,
  node_data JSONB NOT NULL,
  position_x INTEGER NOT NULL,
  position_y INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflow edges table
CREATE TABLE IF NOT EXISTS workflow_edges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
  source_node_id UUID REFERENCES workflow_nodes(id) ON DELETE CASCADE,
  target_node_id UUID REFERENCES workflow_nodes(id) ON DELETE CASCADE,
  edge_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stored procedure for workflow_executions table creation
CREATE OR REPLACE FUNCTION create_workflow_executions_table_if_not_exists()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS workflow_executions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id text NOT NULL,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    created_at timestamptz NOT NULL DEFAULT now(),
    started_at timestamptz,
    completed_at timestamptz,
    error_message text,
    execution_data jsonb,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
  );
  
  -- Create indexes if they don't exist
  CREATE INDEX IF NOT EXISTS idx_workflow_executions_workflow_id ON workflow_executions(workflow_id);
  CREATE INDEX IF NOT EXISTS idx_workflow_executions_status ON workflow_executions(status);
  CREATE INDEX IF NOT EXISTS idx_workflow_executions_user_id ON workflow_executions(user_id);
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better query performance
CREATE INDEX idx_workflow_nodes_workflow_id ON workflow_nodes(workflow_id);
CREATE INDEX idx_workflow_edges_workflow_id ON workflow_edges(workflow_id);
CREATE INDEX idx_workflow_edges_source_node_id ON workflow_edges(source_node_id);
CREATE INDEX idx_workflow_edges_target_node_id ON workflow_edges(target_node_id);
CREATE INDEX idx_workflow_executions_workflow_id ON workflow_executions(workflow_id);
CREATE INDEX idx_workflow_executions_status ON workflow_executions(status);

-- Enable Row Level Security
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;

-- Create policies for workflows
CREATE POLICY "Users can view their own workflows"
  ON workflows FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create workflows"
  ON workflows FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workflows"
  ON workflows FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workflows"
  ON workflows FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for workflow nodes
CREATE POLICY "Users can view nodes of their workflows"
  ON workflow_nodes FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM workflows
    WHERE workflows.id = workflow_nodes.workflow_id
    AND workflows.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage nodes of their workflows"
  ON workflow_nodes FOR ALL
  USING (EXISTS (
    SELECT 1 FROM workflows
    WHERE workflows.id = workflow_nodes.workflow_id
    AND workflows.user_id = auth.uid()
  ));

-- Create policies for workflow edges
CREATE POLICY "Users can view edges of their workflows"
  ON workflow_edges FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM workflows
    WHERE workflows.id = workflow_edges.workflow_id
    AND workflows.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage edges of their workflows"
  ON workflow_edges FOR ALL
  USING (EXISTS (
    SELECT 1 FROM workflows
    WHERE workflows.id = workflow_edges.workflow_id
    AND workflows.user_id = auth.uid()
  ));

-- Create policies for workflow executions
CREATE POLICY "Users can view executions of their workflows"
  ON workflow_executions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM workflows
    WHERE workflows.id = workflow_executions.workflow_id
    AND workflows.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage executions of their workflows"
  ON workflow_executions FOR ALL
  USING (EXISTS (
    SELECT 1 FROM workflows
    WHERE workflows.id = workflow_executions.workflow_id
    AND workflows.user_id = auth.uid()
  ));

-- Grant access to authenticated users
GRANT ALL ON workflows TO authenticated;
GRANT ALL ON workflow_nodes TO authenticated;
GRANT ALL ON workflow_edges TO authenticated;
GRANT ALL ON workflow_executions TO authenticated; 