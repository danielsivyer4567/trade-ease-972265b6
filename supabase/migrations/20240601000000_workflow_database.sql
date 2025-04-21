-- Create workflow-related tables and integrate with customer journey

-- Ensure extensions are available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Workflows table - Stores user-created workflows
CREATE TABLE IF NOT EXISTS workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  data JSONB NOT NULL, -- Stores the flow configuration (nodes, edges, etc.)
  is_template BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automation workflow connections table - Links automations to workflows and targets
CREATE TABLE IF NOT EXISTS automation_workflow_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
  automation_id INTEGER NOT NULL, -- ID of the automation
  target_type TEXT, -- Type of target (e.g., 'customer', 'job', 'quote')
  target_id TEXT, -- ID of the target
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflow logs table - Tracks execution of workflows
CREATE TABLE IF NOT EXISTS workflow_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id UUID REFERENCES workflows(id) ON DELETE SET NULL,
  status TEXT NOT NULL, -- 'success', 'error', 'in_progress'
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_by UUID REFERENCES auth.users(id),
  context JSONB -- Additional context about the workflow execution
);

-- Workflow action logs - Tracks individual actions in a workflow execution
CREATE TABLE IF NOT EXISTS workflow_action_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_log_id UUID REFERENCES workflow_logs(id) ON DELETE CASCADE,
  node_id TEXT NOT NULL, -- ID of the node in the workflow
  node_type TEXT NOT NULL, -- Type of node (e.g., 'customerNode', 'jobNode')
  action TEXT NOT NULL, -- Action performed
  status TEXT NOT NULL, -- 'success', 'error', 'skipped'
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  data JSONB -- Additional data about the action
);

-- Customer workflow stages - Tracks customer progress through workflows
CREATE TABLE IF NOT EXISTS customer_workflow_stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  workflow_id UUID REFERENCES workflows(id) ON DELETE SET NULL,
  current_stage TEXT NOT NULL, -- Current stage in the workflow
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'in_progress', -- 'in_progress', 'completed', 'cancelled'
  metadata JSONB -- Additional metadata about the customer's progress
);

-- Job workflow stages - Tracks job progress through workflows
CREATE TABLE IF NOT EXISTS job_workflow_stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  workflow_id UUID REFERENCES workflows(id) ON DELETE SET NULL,
  current_stage TEXT NOT NULL, -- Current stage in the workflow
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'in_progress', -- 'in_progress', 'completed', 'cancelled'
  metadata JSONB -- Additional metadata about the job's progress
);

-- Quote workflow stages - Tracks quote progress through workflows
CREATE TABLE IF NOT EXISTS quote_workflow_stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
  workflow_id UUID REFERENCES workflows(id) ON DELETE SET NULL,
  current_stage TEXT NOT NULL, -- Current stage in the workflow
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'in_progress', -- 'in_progress', 'completed', 'cancelled'
  metadata JSONB -- Additional metadata about the quote's progress
);

-- Automation definitions - Stores predefined automation templates
CREATE TABLE IF NOT EXISTS automation_definitions (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  triggers JSONB,
  actions JSONB,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_workflows_user_id ON workflows(user_id);
CREATE INDEX idx_workflows_is_template ON workflows(is_template);
CREATE INDEX idx_automation_workflow_connections_workflow_id ON automation_workflow_connections(workflow_id);
CREATE INDEX idx_automation_workflow_connections_target_id ON automation_workflow_connections(target_id);
CREATE INDEX idx_workflow_logs_workflow_id ON workflow_logs(workflow_id);
CREATE INDEX idx_workflow_action_logs_workflow_log_id ON workflow_action_logs(workflow_log_id);
CREATE INDEX idx_customer_workflow_stages_customer_id ON customer_workflow_stages(customer_id);
CREATE INDEX idx_customer_workflow_stages_workflow_id ON customer_workflow_stages(workflow_id);
CREATE INDEX idx_job_workflow_stages_job_id ON job_workflow_stages(job_id);
CREATE INDEX idx_job_workflow_stages_workflow_id ON job_workflow_stages(workflow_id);
CREATE INDEX idx_quote_workflow_stages_quote_id ON quote_workflow_stages(quote_id);
CREATE INDEX idx_quote_workflow_stages_workflow_id ON quote_workflow_stages(workflow_id);

-- Enable Row Level Security
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_workflow_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_action_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_workflow_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_workflow_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_workflow_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_definitions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for workflows
CREATE POLICY "Users can view their own workflows"
  ON workflows FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own workflows"
  ON workflows FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own workflows"
  ON workflows FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own workflows"
  ON workflows FOR DELETE
  USING (user_id = auth.uid());

-- Create RLS policies for automation_workflow_connections
CREATE POLICY "Users can view their own automation connections"
  ON automation_workflow_connections FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own automation connections"
  ON automation_workflow_connections FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Create RLS policies for workflow_logs
CREATE POLICY "Users can view their own workflow logs"
  ON workflow_logs FOR SELECT
  USING (created_by = auth.uid());

-- Create policy for viewing templates
CREATE POLICY "Users can view all templates"
  ON workflows FOR SELECT
  USING (is_template = true);

-- Create triggers to update updated_at timestamp
CREATE TRIGGER update_workflows_updated_at
  BEFORE UPDATE ON workflows
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_workflow_stages_updated_at
  BEFORE UPDATE ON customer_workflow_stages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_workflow_stages_updated_at
  BEFORE UPDATE ON job_workflow_stages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quote_workflow_stages_updated_at
  BEFORE UPDATE ON quote_workflow_stages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some default automation definitions
INSERT INTO automation_definitions (title, description, category, triggers, actions, is_premium)
VALUES 
  ('New Job Alert', 'Send notifications when jobs are created', 'team',
   '["New job created"]'::jsonb, '["Send notification"]'::jsonb, false),
  
  ('Quote Follow-up', 'Follow up on quotes after 3 days', 'sales',
   '["Quote age > 3 days"]'::jsonb, '["Send email"]'::jsonb, false),
  
  ('Customer Feedback Form', 'Send feedback forms after job completion', 'forms',
   '["Job marked complete"]'::jsonb, '["Send form to customer"]'::jsonb, false),
  
  ('Social Media Post', 'Post job completion to social media', 'social',
   '["Job marked complete"]'::jsonb, '["Post to social media"]'::jsonb, true),
  
  ('SMS Appointment Reminder', 'Send SMS reminder 24 hours before appointment', 'messaging',
   '["24h before appointment"]'::jsonb, '["Send SMS"]'::jsonb, true); 