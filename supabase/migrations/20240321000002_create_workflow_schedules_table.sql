-- Create workflow schedules table
CREATE TABLE IF NOT EXISTS workflow_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
  schedule_config JSONB NOT NULL,
  last_run_at TIMESTAMP WITH TIME ZONE,
  next_run_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_workflow_schedules_workflow_id ON workflow_schedules(workflow_id);
CREATE INDEX idx_workflow_schedules_next_run_at ON workflow_schedules(next_run_at);

-- Enable Row Level Security
ALTER TABLE workflow_schedules ENABLE ROW LEVEL SECURITY;

-- Create policies for workflow schedules
CREATE POLICY "Users can view their workflow schedules"
  ON workflow_schedules FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM workflows
    WHERE workflows.id = workflow_schedules.workflow_id
    AND workflows.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their workflow schedules"
  ON workflow_schedules FOR ALL
  USING (EXISTS (
    SELECT 1 FROM workflows
    WHERE workflows.id = workflow_schedules.workflow_id
    AND workflows.user_id = auth.uid()
  ));

-- Grant access to authenticated users
GRANT ALL ON workflow_schedules TO authenticated; 