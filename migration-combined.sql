-- Migration: 001_create_custom_templates_table.sql
-- Create custom_templates table for storing template metadata
CREATE TABLE IF NOT EXISTS public.custom_templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'My Templates',
    price DECIMAL(10,2) DEFAULT 0.00,
    project_data JSONB NOT NULL DEFAULT '{}',
    checklist JSONB NOT NULL DEFAULT '[]',
    background_image_url TEXT,
    background_image_path TEXT,
    background_file_name TEXT,
    background_opacity INTEGER DEFAULT 30,
    image_controls JSONB DEFAULT '{"size": 100, "posX": 50, "posY": 50, "fitMode": "contain"}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER custom_templates_updated_at
    BEFORE UPDATE ON public.custom_templates
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_custom_templates_user_id ON public.custom_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_templates_category ON public.custom_templates(category);
CREATE INDEX IF NOT EXISTS idx_custom_templates_created_at ON public.custom_templates(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.custom_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view their own templates
CREATE POLICY "Users can view own templates" ON public.custom_templates
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Users can insert their own templates
CREATE POLICY "Users can insert own templates" ON public.custom_templates
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Users can update their own templates
CREATE POLICY "Users can update own templates" ON public.custom_templates
    FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

-- Users can delete their own templates
CREATE POLICY "Users can delete own templates" ON public.custom_templates
    FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);

-- Create storage bucket for template images
INSERT INTO storage.buckets (id, name, public)
VALUES ('template-images', 'template-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for template images
CREATE POLICY "Anyone can view template images" ON storage.objects
    FOR SELECT USING (bucket_id = 'template-images');

CREATE POLICY "Users can upload template images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'template-images');

CREATE POLICY "Users can update their template images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'template-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their template images" ON storage.objects
    FOR DELETE USING (bucket_id = 'template-images' AND auth.uid()::text = (storage.foldername(name))[1]); 

-- Migration: 20231002_customer_journey.sql
-- Create customer-related tables for our journey workflow

-- Ensure extensions are available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zipCode TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Site Audits table
CREATE TABLE IF NOT EXISTS site_audits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending',
  notes TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Photos table
CREATE TABLE IF NOT EXISTS audit_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  audit_id UUID REFERENCES site_audits(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer Photos table (for photos linked directly to customer profiles)
CREATE TABLE IF NOT EXISTS customer_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT,
  audit_id UUID REFERENCES site_audits(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  audit_id UUID REFERENCES site_audits(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  amount DECIMAL(10, 2) DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expiry_date TIMESTAMP WITH TIME ZONE,
  job_id UUID -- Will be linked after job creation
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'scheduled',
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  assigned_to TEXT[] -- Array of user IDs
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'draft',
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  payment_date TIMESTAMP WITH TIME ZONE
);

-- Add foreign key constraints for circular references
ALTER TABLE quotes
ADD CONSTRAINT fk_quotes_job_id
FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL;

-- Create storage bucket for audit photos if it doesn't exist
-- Note: This is typically done in the Supabase dashboard or using the Supabase CLI

-- Create indexes for better query performance
CREATE INDEX idx_site_audits_customer_id ON site_audits(customer_id);
CREATE INDEX idx_audit_photos_audit_id ON audit_photos(audit_id);
CREATE INDEX idx_audit_photos_customer_id ON audit_photos(customer_id);
CREATE INDEX idx_customer_photos_customer_id ON customer_photos(customer_id);
CREATE INDEX idx_quotes_customer_id ON quotes(customer_id);
CREATE INDEX idx_quotes_audit_id ON quotes(audit_id);
CREATE INDEX idx_jobs_customer_id ON jobs(customer_id);
CREATE INDEX idx_jobs_quote_id ON jobs(quote_id);
CREATE INDEX idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX idx_invoices_job_id ON invoices(job_id);
CREATE INDEX idx_invoices_quote_id ON invoices(quote_id);

-- Create RLS policies
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can view their own customers"
  ON customers FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can view their own site audits"
  ON site_audits FOR SELECT
  USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

-- Add more policies as needed for each table

-- Create triggers to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_audits_updated_at
  BEFORE UPDATE ON site_audits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 

-- Migration: 20240000000000_workflow_nodes.sql
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

-- Migration: 20240320000000_create_integration_configs.sql
-- Create the integration_configs table
create table if not exists public.integration_configs (
  id uuid default uuid_generate_v4() primary key,
  integration_name text not null,
  api_key text,
  client_id text,
  status text default 'connected',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.integration_configs enable row level security;

-- Create policies
create policy "Users can view their own organization's integration configs"
  on public.integration_configs
  for select
  using (auth.uid() is not null);

create policy "Users can insert integration configs"
  on public.integration_configs
  for insert
  with check (auth.uid() is not null);

create policy "Users can update their own organization's integration configs"
  on public.integration_configs
  for update
  using (auth.uid() is not null);

-- Grant access to authenticated users
grant all on public.integration_configs to authenticated;
grant all on public.integration_configs to service_role; 

-- Migration: 20240320000000_email_system.sql
-- Create enum types
CREATE TYPE email_status AS ENUM ('draft', 'scheduled', 'sent', 'failed');
CREATE TYPE campaign_status AS ENUM ('draft', 'active', 'paused', 'completed');
CREATE TYPE contact_status AS ENUM ('active', 'unsubscribed', 'bounced', 'complained');

-- Email Templates Table
CREATE TABLE email_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    html_content TEXT NOT NULL,
    text_content TEXT,
    variables JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    is_active BOOLEAN DEFAULT true
);

-- Campaigns Table
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status campaign_status DEFAULT 'draft',
    template_id UUID REFERENCES email_templates(id),
    schedule_time TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    metadata JSONB
);

-- Contact Lists Table
CREATE TABLE contact_lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    metadata JSONB
);

-- Contacts Table
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    status contact_status DEFAULT 'active',
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_contacted_at TIMESTAMPTZ
);

-- Contact List Members Table
CREATE TABLE contact_list_members (
    contact_id UUID REFERENCES contacts(id),
    list_id UUID REFERENCES contact_lists(id),
    added_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (contact_id, list_id)
);

-- Email Tracking Table
CREATE TABLE email_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id),
    contact_id UUID REFERENCES contacts(id),
    template_id UUID REFERENCES email_templates(id),
    message_id VARCHAR(255),
    status email_status DEFAULT 'sent',
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    delivered_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    error_message TEXT,
    metadata JSONB
);

-- Email Events Table
CREATE TABLE email_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_id UUID REFERENCES email_tracking(id),
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics Table
CREATE TABLE email_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id),
    date DATE NOT NULL,
    sent_count INTEGER DEFAULT 0,
    delivered_count INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    clicked_count INTEGER DEFAULT 0,
    bounced_count INTEGER DEFAULT 0,
    unsubscribed_count INTEGER DEFAULT 0,
    complained_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(campaign_id, date)
);

-- Create indexes
CREATE INDEX idx_email_tracking_campaign_id ON email_tracking(campaign_id);
CREATE INDEX idx_email_tracking_contact_id ON email_tracking(contact_id);
CREATE INDEX idx_email_events_tracking_id ON email_events(tracking_id);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_campaigns_status ON campaigns(status);

-- Create RLS policies
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_list_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own templates"
    ON email_templates FOR SELECT
    USING (auth.uid() = created_by);

CREATE POLICY "Users can create their own templates"
    ON email_templates FOR INSERT
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own templates"
    ON email_templates FOR UPDATE
    USING (auth.uid() = created_by);

-- Similar policies for other tables... 

-- Migration: 20240320_make_job_number_required.sql
-- Make job_number required and add a unique constraint
ALTER TABLE jobs
ALTER COLUMN job_number SET NOT NULL,
ADD CONSTRAINT jobs_job_number_unique UNIQUE (job_number);

-- Add an index for faster lookups
CREATE INDEX idx_jobs_job_number ON jobs(job_number); 

-- Migration: 20240321000000_add_client_secret_to_integration_configs.sql
-- Add client_secret column to integration_configs table
ALTER TABLE integration_configs
ADD COLUMN client_secret TEXT;

-- Update RLS policy to include client_secret
ALTER POLICY "Users can only access their own integration configs" ON integration_configs
USING (auth.uid() = user_id); 

-- Migration: 20240321000000_create_workflow_tables.sql
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

-- Migration: 20240321000001_add_xero_token_fields.sql
-- Add token fields to integration_configs table
ALTER TABLE integration_configs
ADD COLUMN access_token TEXT,
ADD COLUMN refresh_token TEXT,
ADD COLUMN token_expires_at TIMESTAMP WITH TIME ZONE; 

-- Migration: 20240321000001_create_logs_table.sql
-- Create logs table
CREATE TABLE IF NOT EXISTS logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_logs_level ON logs(level);
CREATE INDEX idx_logs_timestamp ON logs(timestamp);

-- Enable Row Level Security
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

-- Create policy for logs
CREATE POLICY "Service role can manage logs"
  ON logs FOR ALL
  USING (auth.role() = 'service_role');

-- Grant access to service role
GRANT ALL ON logs TO service_role; 

-- Migration: 20240321000001_create_workflow_executions.sql
-- Create workflow_executions table
CREATE TABLE IF NOT EXISTS workflow_executions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id uuid NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  started_at timestamptz,
  completed_at timestamptz,
  error_message text,
  execution_data jsonb,
  result_data jsonb,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_workflow_executions_workflow_id ON workflow_executions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_status ON workflow_executions(status);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_user_id ON workflow_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_created_at ON workflow_executions(created_at);

-- Enable Row Level Security
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;

-- Create policies for workflow executions
CREATE POLICY "Users can view executions of their workflows"
  ON workflow_executions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workflows
      WHERE workflows.id = workflow_executions.workflow_id
      AND workflows.user_id = auth.uid()
    ) 
    OR workflow_executions.user_id = auth.uid()
  );

CREATE POLICY "Users can create workflow executions"
  ON workflow_executions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workflows
      WHERE workflows.id = workflow_executions.workflow_id
      AND workflows.user_id = auth.uid()
    )
    OR workflow_executions.user_id = auth.uid()
  );

CREATE POLICY "Users can update workflow executions"
  ON workflow_executions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workflows
      WHERE workflows.id = workflow_executions.workflow_id
      AND workflows.user_id = auth.uid()
    )
    OR workflow_executions.user_id = auth.uid()
  );

CREATE POLICY "Users can delete workflow executions"
  ON workflow_executions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM workflows
      WHERE workflows.id = workflow_executions.workflow_id
      AND workflows.user_id = auth.uid()
    )
    OR workflow_executions.user_id = auth.uid()
  );

-- Grant access to authenticated users
GRANT ALL ON workflow_executions TO authenticated; 

-- Migration: 20240321000002_create_workflow_schedules_table.sql
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

-- Migration: 20240321000002_fix_rls_policies.sql
-- Drop existing policies
DROP POLICY IF EXISTS "Users can only access their own integration configs" ON integration_configs;
DROP POLICY IF EXISTS "Users can view their own organization's integration configs" ON integration_configs;
DROP POLICY IF EXISTS "Users can insert integration configs" ON integration_configs;
DROP POLICY IF EXISTS "Users can update their own organization's integration configs" ON integration_configs;

-- Create unified policies
CREATE POLICY "Users can view their own integration configs"
  ON public.integration_configs
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert their own integration configs"
  ON public.integration_configs
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own integration configs"
  ON public.integration_configs
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Ensure proper grants are in place
GRANT ALL ON public.integration_configs TO authenticated;
GRANT ALL ON public.integration_configs TO service_role; 

-- Migration: 20240321000003_create_integrations_table.sql
-- Create integrations table
CREATE TABLE IF NOT EXISTS integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  credentials JSONB NOT NULL,
  settings JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_integrations_user_id ON integrations(user_id);
CREATE INDEX idx_integrations_type ON integrations(type);

-- Enable Row Level Security
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- Create policies for integrations
CREATE POLICY "Users can view their own integrations"
  ON integrations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own integrations"
  ON integrations FOR ALL
  USING (auth.uid() = user_id);

-- Grant access to authenticated users
GRANT ALL ON integrations TO authenticated; 

-- Migration: 20240321000004_create_webhooks_table.sql
-- Create webhooks table
CREATE TABLE IF NOT EXISTS webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  events TEXT[] NOT NULL,
  secret TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS webhooks_user_id_idx ON webhooks(user_id);
CREATE INDEX IF NOT EXISTS webhooks_events_idx ON webhooks USING GIN(events);

-- Enable Row Level Security
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own webhooks"
  ON webhooks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own webhooks"
  ON webhooks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own webhooks"
  ON webhooks FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own webhooks"
  ON webhooks FOR DELETE
  USING (auth.uid() = user_id);

-- Grant access to authenticated users
GRANT ALL ON webhooks TO authenticated; 

-- Migration: 20240321000005_create_user_configuration_trigger.sql
-- Create function to handle new user configuration
CREATE OR REPLACE FUNCTION public.handle_new_user_configuration()
RETURNS TRIGGER AS $$
BEGIN
  -- Create configuration entry for the new user
  INSERT INTO public.users_configuration (
    id,
    automation_enabled,
    messaging_enabled,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    false,  -- Default automation_enabled to false
    false,  -- Default messaging_enabled to false
    NOW(),  -- Set created_at to current timestamp
    NOW()   -- Set updated_at to current timestamp
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user configuration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_configuration();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.users_configuration TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user_configuration() TO authenticated; 

-- Migration: 20240420000000_create_roles_system.sql
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

-- Migration: 20240501000000_create_two_factor_auth.sql
-- Add phone_number and two_factor_enabled columns to user profiles table
ALTER TABLE IF EXISTS user_profiles 
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE;

-- Create two_factor_auth table to store verification codes
CREATE TABLE IF NOT EXISTS two_factor_auth (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  verification_code TEXT NOT NULL,
  verification_link TEXT NOT NULL,
  verification_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  UNIQUE(verification_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_two_factor_auth_user_id ON two_factor_auth(user_id);
CREATE INDEX IF NOT EXISTS idx_two_factor_auth_verification_id ON two_factor_auth(verification_id);

-- Row Level Security
ALTER TABLE two_factor_auth ENABLE ROW LEVEL SECURITY;

-- Only the authenticated user or service role can see their 2FA data
CREATE POLICY "Users can view their own 2FA data" 
  ON two_factor_auth
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Only the authenticated user or service role can insert 2FA data
CREATE POLICY "Users can create their own 2FA data" 
  ON two_factor_auth
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Only the authenticated user or service role can update their 2FA data
CREATE POLICY "Users can update their own 2FA data" 
  ON two_factor_auth
  FOR UPDATE
  USING (auth.uid() = user_id); 

-- Migration: 20240520000001_create_docuseal_submissions_table.sql
-- Create docuseal_submissions table for tracking electronic signature requests
CREATE TABLE IF NOT EXISTS docuseal_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_id TEXT NOT NULL,
  submission_id TEXT NOT NULL,
  signer_email TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'partially_signed', 'completed')),
  document_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  last_viewed_at TIMESTAMP WITH TIME ZONE,
  last_signed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS docuseal_submissions_quote_id_idx ON docuseal_submissions(quote_id);
CREATE INDEX IF NOT EXISTS docuseal_submissions_submission_id_idx ON docuseal_submissions(submission_id);
CREATE INDEX IF NOT EXISTS docuseal_submissions_status_idx ON docuseal_submissions(status);

-- Enable Row Level Security
ALTER TABLE docuseal_submissions ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can view documents" 
  ON docuseal_submissions FOR SELECT 
  USING (true);

-- Insert, update, delete limited to authenticated users
CREATE POLICY "Authenticated users can insert documents" 
  ON docuseal_submissions FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update documents" 
  ON docuseal_submissions FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Grant access to authenticated users
GRANT ALL ON docuseal_submissions TO authenticated;
GRANT SELECT ON docuseal_submissions TO anon; 

-- Migration: 20240522000001_create_join_requests.sql
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

-- Migration: 20240522000002_create_join_request_functions.sql
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

-- Migration: 20240601000000_create_user_profiles_table.sql
-- Create user_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  phone_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  organization_id UUID,
  preferences JSONB DEFAULT '{}'::jsonb,
  settings JSONB DEFAULT '{}'::jsonb,
  UNIQUE(user_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own profile
CREATE POLICY "Users can read their own profile"
ON user_profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Create policy for users to update their own profile
CREATE POLICY "Users can update their own profile"
ON user_profiles
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create policy for service roles to manage all profiles
CREATE POLICY "Service role can manage all profiles"
ON user_profiles
USING (auth.role() = 'service_role');

-- Grant access to authenticated users
GRANT SELECT, INSERT, UPDATE ON user_profiles TO authenticated;

-- Create a trigger to automatically create a profile when a user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add trigger to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create default user_profiles for existing users if they don't have one yet
INSERT INTO public.user_profiles (user_id, email)
SELECT id, email FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.user_profiles); 

-- Migration: 20240601_add_customer_addresses.sql
-- Migration: Add customer_addresses table for multiple job site addresses per customer
CREATE TABLE IF NOT EXISTS customer_addresses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
    label text,
    address text NOT NULL,
    city text NOT NULL,
    state text NOT NULL,
    zipcode text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Index for faster lookup
CREATE INDEX IF NOT EXISTS idx_customer_addresses_customer_id ON customer_addresses(customer_id);

ALTER TABLE customer_addresses ADD COLUMN IF NOT EXISTS is_default boolean DEFAULT false; 

-- Migration: 20240608_user_profiles.sql
-- Create the check_table_exists function
CREATE OR REPLACE FUNCTION public.check_table_exists(table_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  table_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = $1
  ) INTO table_exists;
  
  RETURN table_exists;
END;
$$;

-- Create function to create user_profiles table
CREATE OR REPLACE FUNCTION public.create_user_profiles_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    email TEXT,
    name TEXT,
    avatar_url TEXT,
    two_factor_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
  );
  
  -- Create RLS policies
  ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
  
  -- Policy for users to see only their own profile
  CREATE POLICY "Users can view own profile" 
    ON public.user_profiles 
    FOR SELECT 
    USING (auth.uid() = user_id);
  
  -- Policy for users to update only their own profile
  CREATE POLICY "Users can update own profile" 
    ON public.user_profiles 
    FOR UPDATE 
    USING (auth.uid() = user_id);
  
  -- Policy to allow insert on user creation
  CREATE POLICY "New users can insert profile" 
    ON public.user_profiles 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
END;
$$; 

-- Migration: 20240701_add_customer_id.sql
-- Migration: Add customer_code field to customers and set up auto-increment starting from a12001
-- Add customer_code column if it doesn't exist
ALTER TABLE customers ADD COLUMN IF NOT EXISTS customer_code TEXT UNIQUE;

-- Create a sequence for customer codes
CREATE SEQUENCE IF NOT EXISTS customer_code_seq START 12001;

-- Function to generate customer code in format a{number}
CREATE OR REPLACE FUNCTION generate_customer_code()
RETURNS TRIGGER AS $$
DECLARE
  next_val INTEGER;
BEGIN
  -- Get next value from sequence
  SELECT nextval('customer_code_seq') INTO next_val;
  
  -- Set customer_code in format a{number}
  NEW.customer_code := 'a' || next_val;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate customer_code for new customers
CREATE TRIGGER set_customer_code
BEFORE INSERT ON customers
FOR EACH ROW
WHEN (NEW.customer_code IS NULL)
EXECUTE FUNCTION generate_customer_code();

-- Update existing customers with sequential codes
DO $$
DECLARE
  customer_record RECORD;
  current_val INTEGER := 12001;
BEGIN
  FOR customer_record IN 
    SELECT id FROM customers 
    WHERE customer_code IS NULL
    ORDER BY created_at
  LOOP
    UPDATE customers 
    SET customer_code = 'a' || current_val
    WHERE id = customer_record.id;
    
    current_val := current_val + 1;
  END LOOP;
  
  -- Set the sequence to the next value after processing all existing customers
  IF current_val > 12001 THEN
    PERFORM setval('customer_code_seq', current_val);
  END IF;
END;
$$;

-- Create an index on customer_code for faster lookup
CREATE INDEX IF NOT EXISTS idx_customers_customer_code ON customers(customer_code); 

-- Migration: 20250122000000_multi_business_system.sql
-- Multi-Business/Multi-Tenant System Migration
-- This migration adds support for premium users with multiple businesses
-- and agency users who can manage their clients' businesses

-- First, ensure we have the organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  business_type TEXT,
  abn TEXT,
  acn TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'Australia',
  phone TEXT,
  email TEXT,
  website TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create organization_members table if not exists
CREATE TABLE IF NOT EXISTS organization_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  permissions JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  invited_by UUID REFERENCES auth.users(id),
  accepted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(organization_id, user_id)
);

-- Add subscription/plan information to user_profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free_starter' CHECK (subscription_tier IN ('free_starter', 'growing_pain_relief', 'premium_edge', 'skeleton_key')),
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS max_organizations INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS max_users INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS current_organization_id UUID REFERENCES organizations(id),
ADD COLUMN IF NOT EXISTS subscription_features JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS affiliate_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS affiliate_earnings DECIMAL(10,2) DEFAULT 0;

-- Create agency_client_relationships table for agency users
CREATE TABLE IF NOT EXISTS agency_client_relationships (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  agency_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  client_organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  client_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  permissions JSONB DEFAULT '{
    "view_all": true,
    "edit_settings": false,
    "manage_users": false,
    "manage_billing": false,
    "create_content": true,
    "delete_content": false,
    "export_data": true
  }'::jsonb,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'terminated')),
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(agency_user_id, client_organization_id)
);

-- Create organization_invitations table
CREATE TABLE IF NOT EXISTS organization_invitations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  invitation_type TEXT DEFAULT 'member' CHECK (invitation_type IN ('member', 'agency')),
  invited_by UUID REFERENCES auth.users(id),
  token TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit log for organization activities
CREATE TABLE IF NOT EXISTS organization_audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_organization_members_user_id ON organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_org_id ON organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_agency_relationships_agency_user ON agency_client_relationships(agency_user_id);
CREATE INDEX IF NOT EXISTS idx_agency_relationships_client_org ON agency_client_relationships(client_organization_id);
CREATE INDEX IF NOT EXISTS idx_org_audit_logs_org_id ON organization_audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_audit_logs_user_id ON organization_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_org_invitations_token ON organization_invitations(token);
CREATE INDEX IF NOT EXISTS idx_user_profiles_current_org ON user_profiles(current_organization_id);

-- Enable RLS on all new tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_client_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations
CREATE POLICY "Users can view organizations they belong to"
ON organizations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM organization_members 
    WHERE organization_members.organization_id = organizations.id 
    AND organization_members.user_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM agency_client_relationships
    WHERE agency_client_relationships.client_organization_id = organizations.id
    AND agency_client_relationships.agency_user_id = auth.uid()
    AND agency_client_relationships.status = 'active'
  )
);

CREATE POLICY "Organization owners can update their organizations"
ON organizations FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM organization_members 
    WHERE organization_members.organization_id = organizations.id 
    AND organization_members.user_id = auth.uid()
    AND organization_members.role IN ('owner', 'admin')
  )
);

CREATE POLICY "Users can create organizations based on their subscription"
ON organizations FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
    AND (
      (user_profiles.subscription_tier IN ('free_starter', 'growing_pain_relief') AND 
       (SELECT COUNT(*) FROM organization_members WHERE user_id = auth.uid()) < 1)
      OR
      (user_profiles.subscription_tier = 'premium_edge' AND
       (SELECT COUNT(*) FROM organization_members WHERE user_id = auth.uid()) < COALESCE(user_profiles.max_organizations, 5))
      OR
      (user_profiles.subscription_tier = 'skeleton_key')
    )
  )
);

-- RLS Policies for organization_members
CREATE POLICY "Members can view their organization members"
ON organization_members FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
  )
  OR
  organization_id IN (
    SELECT client_organization_id FROM agency_client_relationships 
    WHERE agency_user_id = auth.uid() AND status = 'active'
  )
);

CREATE POLICY "Organization admins can manage members"
ON organization_members FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM organization_members om
    WHERE om.organization_id = organization_members.organization_id
    AND om.user_id = auth.uid()
    AND om.role IN ('owner', 'admin')
  )
);

-- RLS Policies for agency_client_relationships
CREATE POLICY "Users can view their agency relationships"
ON agency_client_relationships FOR SELECT
USING (
  agency_user_id = auth.uid() 
  OR 
  client_user_id = auth.uid()
);

CREATE POLICY "Agency users can manage their client relationships"
ON agency_client_relationships FOR ALL
USING (
  agency_user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid()
    AND subscription_tier = 'skeleton_key'
  )
);

-- Function to switch organization context
CREATE OR REPLACE FUNCTION switch_organization_context(target_org_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  has_access BOOLEAN;
BEGIN
  -- Check if user has access to the organization
  SELECT EXISTS (
    SELECT 1 FROM organization_members 
    WHERE organization_id = target_org_id 
    AND user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM agency_client_relationships
    WHERE client_organization_id = target_org_id
    AND agency_user_id = auth.uid()
    AND status = 'active'
  ) INTO has_access;

  IF has_access THEN
    -- Update user's current organization
    UPDATE user_profiles 
    SET current_organization_id = target_org_id,
        updated_at = NOW()
    WHERE user_id = auth.uid();
    
    -- Log the switch
    INSERT INTO organization_audit_logs (
      organization_id, 
      user_id, 
      action, 
      entity_type, 
      entity_id
    ) VALUES (
      target_org_id,
      auth.uid(),
      'switch_context',
      'organization',
      target_org_id
    );
    
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's accessible organizations
CREATE OR REPLACE FUNCTION get_user_organizations()
RETURNS TABLE (
  organization_id UUID,
  organization_name TEXT,
  role TEXT,
  access_type TEXT,
  is_current BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  -- Get organizations where user is a member
  SELECT 
    o.id,
    o.name,
    om.role,
    'member'::TEXT as access_type,
    (up.current_organization_id = o.id) as is_current
  FROM organizations o
  JOIN organization_members om ON o.id = om.organization_id
  LEFT JOIN user_profiles up ON up.user_id = auth.uid()
  WHERE om.user_id = auth.uid()
  AND o.is_active = true
  
  UNION
  
  -- Get organizations where user has agency access
  SELECT 
    o.id,
    o.name,
    'agency'::TEXT as role,
    'agency'::TEXT as access_type,
    (up.current_organization_id = o.id) as is_current
  FROM organizations o
  JOIN agency_client_relationships acr ON o.id = acr.client_organization_id
  LEFT JOIN user_profiles up ON up.user_id = auth.uid()
  WHERE acr.agency_user_id = auth.uid()
  AND acr.status = 'active'
  AND o.is_active = true
  
  ORDER BY is_current DESC, organization_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT ALL ON organizations TO authenticated;
GRANT ALL ON organization_members TO authenticated;
GRANT ALL ON agency_client_relationships TO authenticated;
GRANT ALL ON organization_invitations TO authenticated;
GRANT ALL ON organization_audit_logs TO authenticated;
GRANT EXECUTE ON FUNCTION switch_organization_context TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_organizations TO authenticated;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organization_members_updated_at BEFORE UPDATE ON organization_members
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agency_relationships_updated_at BEFORE UPDATE ON agency_client_relationships
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 

-- Migration: 20250122000001_subscription_features.sql
-- Add subscription features tracking
-- This migration adds detailed feature tracking for different subscription tiers

-- Create subscription_features table to define what each tier includes
CREATE TABLE IF NOT EXISTS subscription_features (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tier TEXT NOT NULL CHECK (tier IN ('free_starter', 'growing_pain_relief', 'premium_edge', 'skeleton_key')),
  feature_key TEXT NOT NULL,
  feature_value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tier, feature_key)
);

-- Insert default features for each tier
INSERT INTO subscription_features (tier, feature_key, feature_value, description) VALUES
-- Free Starter features
('free_starter', 'max_organizations', '1', 'Maximum number of organizations'),
('free_starter', 'max_users', '1', 'Maximum users per organization'),
('free_starter', 'invoicing', 'true', 'Access to invoicing features'),
('free_starter', 'quoting', 'true', 'Access to quoting features'),
('free_starter', 'calendar', 'true', 'Access to calendar features'),
('free_starter', 'automations', '0', 'Number of automations allowed'),
('free_starter', 'automated_texts', '0', 'Number of automated texts per month'),
('free_starter', 'automated_emails', '0', 'Number of automated emails per month'),
('free_starter', 'view_all_features', 'true', 'Can view all features (but not use)'),
('free_starter', 'affiliate_commission', '0.40', '40% affiliate commission'),
('free_starter', 'support_tier', '"standard"', 'Standard ticket support'),

-- Growing Pain Relief features
('growing_pain_relief', 'max_organizations', '1', 'Maximum number of organizations'),
('growing_pain_relief', 'max_users', '3', 'Maximum users per organization'),
('growing_pain_relief', 'web_enquiry_forwarding', 'true', 'Auto forward web enquiries'),
('growing_pain_relief', 'abn_verification', 'true', 'Automatic ABN verification'),
('growing_pain_relief', 'internal_communications', 'true', 'Internal comms and tagging'),
('growing_pain_relief', 'addon_automated_texts', '{"enabled": true, "monthly_fee": 20, "per_text": 0.10}', 'Text automation add-on pricing'),
('growing_pain_relief', 'addon_ai_agents', 'true', 'AI agents available as add-on'),
('growing_pain_relief', 'addon_workflows', 'true', 'Workflows available as add-on'),
('growing_pain_relief', 'affiliate_commission', '0.40', '40% affiliate commission'),
('growing_pain_relief', 'support_tier', '"standard"', 'Standard ticket support'),

-- Premium Edge features
('premium_edge', 'max_organizations', '5', 'Maximum number of organizations'),
('premium_edge', 'max_users', '15', 'Maximum users included'),
('premium_edge', 'all_features_unlocked', 'true', 'Access to all features'),
('premium_edge', 'unlimited_texts', 'true', 'Unlimited free texts'),
('premium_edge', 'unlimited_automations', 'true', 'Unlimited automations'),
('premium_edge', 'unlimited_review_requests', 'true', 'Unlimited automatic review requests'),
('premium_edge', 'dedicated_phone_number', 'true', 'Dedicated phone number included'),
('premium_edge', 'basic_workflow_setup', '"free"', 'Free basic workflow setup'),
('premium_edge', 'advanced_workflows', '"extra_cost"', 'Advanced workflows at additional cost'),
('premium_edge', 'affiliate_commission', '0.40', '40% affiliate commission'),
('premium_edge', 'support_tier', '"priority"', 'Priority ticket support'),

-- Skeleton Key features
('skeleton_key', 'max_organizations', '"unlimited"', 'Unlimited organizations'),
('skeleton_key', 'white_label', 'true', 'Full white-label branding'),
('skeleton_key', 'setup_videos', 'true', 'Step-by-step setup videos'),
('skeleton_key', 'resell_platform', 'true', 'Can resell to clients'),
('skeleton_key', 'keep_client_fees', '1.0', 'Keep 100% of client fees'),
('skeleton_key', 'client_management', 'true', 'Full client management tools'),
('skeleton_key', 'sell_workflows', 'true', 'Can sell custom workflows'),
('skeleton_key', 'all_features_included', 'true', 'All features with no restrictions'),
('skeleton_key', 'support_tier', '"highest"', 'Highest priority support'),
('skeleton_key', 'dedicated_developer', '"optional"', 'Optional dedicated developer')
ON CONFLICT (tier, feature_key) DO UPDATE 
SET feature_value = EXCLUDED.feature_value,
    description = EXCLUDED.description,
    updated_at = NOW();

-- Create affiliate_referrals table
CREATE TABLE IF NOT EXISTS affiliate_referrals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  referrer_id UUID REFERENCES auth.users(id),
  referred_user_id UUID REFERENCES auth.users(id),
  referral_code TEXT NOT NULL,
  subscription_tier TEXT,
  commission_rate DECIMAL(3,2) DEFAULT 0.40,
  commission_earned DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'paid', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  activated_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_subscription_features_tier ON subscription_features(tier);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_referrer ON affiliate_referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_code ON affiliate_referrals(referral_code);

-- Enable RLS
ALTER TABLE subscription_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_referrals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_features (read-only for all authenticated users)
CREATE POLICY "Users can view subscription features"
ON subscription_features FOR SELECT
USING (true);

-- RLS Policies for affiliate_referrals
CREATE POLICY "Users can view their own referrals"
ON affiliate_referrals FOR SELECT
USING (referrer_id = auth.uid() OR referred_user_id = auth.uid());

CREATE POLICY "System can manage referrals"
ON affiliate_referrals FOR ALL
USING (auth.role() = 'service_role');

-- Function to check if user has access to a feature
CREATE OR REPLACE FUNCTION has_feature_access(feature_key TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_tier TEXT;
  feature_enabled BOOLEAN;
BEGIN
  -- Get user's subscription tier
  SELECT subscription_tier INTO user_tier
  FROM user_profiles
  WHERE user_id = auth.uid();
  
  -- Check if feature is enabled for this tier
  SELECT (feature_value::text = 'true' OR 
          (feature_value::text ~ '^\d+$' AND feature_value::int > 0) OR
          feature_value::text = '"unlimited"')
  INTO feature_enabled
  FROM subscription_features
  WHERE tier = user_tier AND subscription_features.feature_key = has_feature_access.feature_key;
  
  RETURN COALESCE(feature_enabled, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get feature limit
CREATE OR REPLACE FUNCTION get_feature_limit(feature_key TEXT)
RETURNS INTEGER AS $$
DECLARE
  user_tier TEXT;
  feature_val TEXT;
BEGIN
  -- Get user's subscription tier
  SELECT subscription_tier INTO user_tier
  FROM user_profiles
  WHERE user_id = auth.uid();
  
  -- Get feature value
  SELECT feature_value::text INTO feature_val
  FROM subscription_features
  WHERE tier = user_tier AND subscription_features.feature_key = get_feature_limit.feature_key;
  
  -- Return numeric limit or -1 for unlimited
  IF feature_val = '"unlimited"' THEN
    RETURN -1;
  ELSIF feature_val ~ '^\d+$' THEN
    RETURN feature_val::integer;
  ELSE
    RETURN 0;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT SELECT ON subscription_features TO authenticated;
GRANT SELECT ON affiliate_referrals TO authenticated;
GRANT EXECUTE ON FUNCTION has_feature_access TO authenticated;
GRANT EXECUTE ON FUNCTION get_feature_limit TO authenticated; 

-- Migration: 20250122000002_create_user_subscriptions_table.sql
-- Create user_subscriptions table to track user subscription status
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_tier TEXT NOT NULL CHECK (subscription_tier IN ('free_starter', 'growing_pain_relief', 'premium_edge', 'skeleton_key')),
    is_active BOOLEAN DEFAULT true,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_tier ON user_subscriptions(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_active ON user_subscriptions(is_active);

-- Enable RLS
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own subscription"
ON user_subscriptions FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "System can manage subscriptions"
ON user_subscriptions FOR ALL
USING (auth.role() = 'service_role');

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_subscriptions_updated_at
    BEFORE UPDATE ON user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_user_subscriptions_updated_at();

-- Grant permissions
GRANT SELECT ON user_subscriptions TO authenticated;

-- Insert default free_starter subscription for existing users
INSERT INTO user_subscriptions (user_id, subscription_tier, is_active)
SELECT 
    up.user_id,
    COALESCE(up.subscription_tier, 'free_starter') as subscription_tier,
    true as is_active
FROM user_profiles up
WHERE NOT EXISTS (
    SELECT 1 FROM user_subscriptions us WHERE us.user_id = up.user_id
); 

-- Migration: 20250122000002_enhance_subscription_features.sql
-- Enhance subscription features to support new frontend features
-- This migration adds missing feature flags and tables for the updated subscription plans

-- Add missing feature flags for trade calculators and external calendar integration
INSERT INTO subscription_features (tier, feature_key, feature_value, description) VALUES
-- Trade specific calculators and features
('free_starter', 'trade_calculators', 'false', 'Access to trade specific calculators'),
('growing_pain_relief', 'trade_calculators', 'true', 'Access to trade specific calculators'),
('premium_edge', 'trade_calculators', 'true', 'Access to trade specific calculators'),
('skeleton_key', 'trade_calculators', 'true', 'Access to trade specific calculators'),

-- External calendar integration
('free_starter', 'external_calendar_integration', 'false', 'Integration with external calendars'),
('growing_pain_relief', 'external_calendar_integration', 'true', 'Integration with external calendars'),
('premium_edge', 'external_calendar_integration', 'true', 'Integration with external calendars'),
('skeleton_key', 'external_calendar_integration', 'true', 'Integration with external calendars'),

-- Feature request system
('free_starter', 'feature_requests', 'false', 'Can request new trade specific features'),
('growing_pain_relief', 'feature_requests', 'true', 'Can request new trade specific features'),
('premium_edge', 'feature_requests', 'true', 'Can request new trade specific features'),
('skeleton_key', 'feature_requests', 'true', 'Can request new trade specific features'),

-- Unlimited notification texts
('free_starter', 'unlimited_notification_texts', 'false', 'Unlimited notification texts to customers and staff'),
('growing_pain_relief', 'unlimited_notification_texts', 'false', 'Unlimited notification texts to customers and staff'),
('premium_edge', 'unlimited_notification_texts', 'true', 'Unlimited notification texts to customers and staff'),
('skeleton_key', 'unlimited_notification_texts', 'true', 'Unlimited notification texts to customers and staff'),

-- Unlimited calendars
('free_starter', 'unlimited_calendars', 'false', 'Unlimited calendar management'),
('growing_pain_relief', 'unlimited_calendars', 'false', 'Unlimited calendar management'),
('premium_edge', 'unlimited_calendars', 'true', 'Unlimited calendar management'),
('skeleton_key', 'unlimited_calendars', 'true', 'Unlimited calendar management'),

-- Accounting software integration
('free_starter', 'accounting_integration', 'true', 'Integration with Xero, MYOB, QuickBooks + 50 more'),
('growing_pain_relief', 'accounting_integration', 'true', 'Integration with Xero, MYOB, QuickBooks + 50 more'),
('premium_edge', 'accounting_integration', 'true', 'Integration with Xero, MYOB, QuickBooks + 50 more'),
('skeleton_key', 'accounting_integration', 'true', 'Integration with Xero, MYOB, QuickBooks + 50 more'),

-- Business structure layout map
('free_starter', 'business_structure_map', 'false', 'Business structure layout map'),
('growing_pain_relief', 'business_structure_map', 'false', 'Business structure layout map (available as add-on)'),
('premium_edge', 'business_structure_map', 'true', 'Business structure layout map'),
('skeleton_key', 'business_structure_map', 'true', 'Business structure layout map'),

-- NCC Code Search via Voice
('free_starter', 'ncc_voice_search', 'false', 'NCC Code Search via Voice'),
('growing_pain_relief', 'ncc_voice_search', 'false', 'NCC Code Search via Voice (available as add-on)'),
('premium_edge', 'ncc_voice_search', 'true', 'NCC Code Search via Voice'),
('skeleton_key', 'ncc_voice_search', 'true', 'NCC Code Search via Voice')
ON CONFLICT (tier, feature_key) DO UPDATE 
SET feature_value = EXCLUDED.feature_value,
    description = EXCLUDED.description,
    updated_at = NOW();

-- Create feature_requests table to track user feature requests
CREATE TABLE IF NOT EXISTS feature_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  trade_type TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected', 'in_development', 'completed')),
  admin_notes TEXT,
  estimated_effort_hours INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- Create index for feature requests
CREATE INDEX IF NOT EXISTS idx_feature_requests_user_id ON feature_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_feature_requests_organization_id ON feature_requests(organization_id);
CREATE INDEX IF NOT EXISTS idx_feature_requests_status ON feature_requests(status);

-- Enable RLS for feature_requests
ALTER TABLE feature_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for feature_requests
CREATE POLICY "Users can view their own feature requests"
ON feature_requests FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can create feature requests"
ON feature_requests FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own feature requests"
ON feature_requests FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all feature requests"
ON feature_requests FOR ALL
USING (auth.role() = 'service_role');

-- Create function to check if user can request features
CREATE OR REPLACE FUNCTION can_request_features()
RETURNS BOOLEAN AS $$
DECLARE
  user_tier TEXT;
  can_request BOOLEAN;
BEGIN
  -- Get user's subscription tier
  SELECT subscription_tier INTO user_tier
  FROM user_profiles
  WHERE user_id = auth.uid();
  
  -- Check if feature requests are enabled for this tier
  SELECT (feature_value::text = 'true')
  INTO can_request
  FROM subscription_features
  WHERE tier = user_tier AND feature_key = 'feature_requests';
  
  RETURN COALESCE(can_request, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user's feature request limit
CREATE OR REPLACE FUNCTION get_feature_request_limit()
RETURNS INTEGER AS $$
DECLARE
  user_tier TEXT;
  request_count INTEGER;
  max_requests INTEGER;
BEGIN
  -- Get user's subscription tier
  SELECT subscription_tier INTO user_tier
  FROM user_profiles
  WHERE user_id = auth.uid();
  
  -- Count current pending requests
  SELECT COUNT(*) INTO request_count
  FROM feature_requests
  WHERE user_id = auth.uid() AND status IN ('pending', 'reviewing');
  
  -- Set limits based on tier
  CASE user_tier
    WHEN 'free_starter' THEN max_requests := 0;
    WHEN 'growing_pain_relief' THEN max_requests := 5;
    WHEN 'premium_edge' THEN max_requests := 20;
    WHEN 'skeleton_key' THEN max_requests := -1; -- unlimited
    ELSE max_requests := 0;
  END CASE;
  
  -- Return remaining requests (or -1 for unlimited)
  IF max_requests = -1 THEN
    RETURN -1;
  ELSE
    RETURN GREATEST(0, max_requests - request_count);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON feature_requests TO authenticated;
GRANT EXECUTE ON FUNCTION can_request_features TO authenticated;
GRANT EXECUTE ON FUNCTION get_feature_request_limit TO authenticated;

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_feature_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_feature_requests_updated_at
  BEFORE UPDATE ON feature_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_feature_requests_updated_at(); 

-- Migration: 20250123000000_create_ncc_codes_table.sql
-- Create NCC codes table for storing National Construction Code data
CREATE TABLE IF NOT EXISTS ncc_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    section VARCHAR(50),
    volume VARCHAR(20),
    part VARCHAR(20),
    clause VARCHAR(20),
    notes TEXT,
    keywords TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_ncc_codes_code ON ncc_codes(code);
CREATE INDEX IF NOT EXISTS idx_ncc_codes_category ON ncc_codes(category);
CREATE INDEX IF NOT EXISTS idx_ncc_codes_keywords ON ncc_codes USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_ncc_codes_search ON ncc_codes USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(notes, '')));

-- Create RLS policies
ALTER TABLE ncc_codes ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users with NCC voice search feature
CREATE POLICY "Allow read access to NCC codes for authorized users" ON ncc_codes
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_subscriptions us
            JOIN subscription_features sf ON us.subscription_tier = sf.tier
            WHERE us.user_id = auth.uid()
            AND sf.feature_key = 'ncc_voice_search'
            AND sf.feature_value::text = 'true'
            AND us.is_active = true
        )
    );

-- Create function to search NCC codes
CREATE OR REPLACE FUNCTION search_ncc_codes(search_query TEXT)
RETURNS TABLE (
    id UUID,
    code VARCHAR(50),
    title VARCHAR(255),
    description TEXT,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    section VARCHAR(50),
    volume VARCHAR(20),
    part VARCHAR(20),
    clause VARCHAR(20),
    notes TEXT,
    keywords TEXT[],
    relevance_score FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        nc.id,
        nc.code,
        nc.title,
        nc.description,
        nc.category,
        nc.subcategory,
        nc.section,
        nc.volume,
        nc.part,
        nc.clause,
        nc.notes,
        nc.keywords,
        ts_rank(
            to_tsvector('english', nc.title || ' ' || COALESCE(nc.description, '') || ' ' || COALESCE(nc.notes, '')),
            plainto_tsquery('english', search_query)
        ) as relevance_score
    FROM ncc_codes nc
    WHERE nc.is_active = true
    AND (
        to_tsvector('english', nc.title || ' ' || COALESCE(nc.description, '') || ' ' || COALESCE(nc.notes, '')) @@ plainto_tsquery('english', search_query)
        OR nc.code ILIKE '%' || search_query || '%'
        OR nc.title ILIKE '%' || search_query || '%'
        OR nc.category ILIKE '%' || search_query || '%'
        OR nc.subcategory ILIKE '%' || search_query || '%'
        OR nc.keywords && string_to_array(lower(search_query), ' ')
    )
    ORDER BY relevance_score DESC, nc.code ASC
    LIMIT 50;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert some sample NCC codes for testing
INSERT INTO ncc_codes (code, title, description, category, subcategory, section, volume, part, clause, keywords) VALUES
('A1.1', 'Interpretation', 'Provisions for interpreting the NCC, including definitions, references, and acceptability of design solutions.', 'General', 'Interpretation', 'A', '1', 'A', '1.1', ARRAY['interpretation', 'definitions', 'references', 'design solutions']),
('A1.2', 'Compliance with the NCC', 'Requirements for demonstrating compliance with the NCC.', 'General', 'Compliance', 'A', '1', 'A', '1.2', ARRAY['compliance', 'requirements', 'demonstrating']),
('B1.1', 'Structure', 'General structural requirements for buildings and structures.', 'Structure', 'General', 'B', '1', 'B', '1.1', ARRAY['structure', 'structural', 'buildings', 'requirements']),
('B1.2', 'Structural reliability', 'Requirements for structural reliability and safety.', 'Structure', 'Reliability', 'B', '1', 'B', '1.2', ARRAY['reliability', 'safety', 'structural safety']),
('C1.1', 'Fire resistance', 'Fire resistance requirements for building elements.', 'Fire', 'Resistance', 'C', '1', 'C', '1.1', ARRAY['fire', 'resistance', 'building elements']),
('C1.2', 'Fire hazard properties', 'Fire hazard properties of building materials and elements.', 'Fire', 'Hazard Properties', 'C', '1', 'C', '1.2', ARRAY['fire hazard', 'materials', 'properties']),
('D1.1', 'Access and egress', 'Requirements for access and egress from buildings.', 'Access', 'General', 'D', '1', 'D', '1.1', ARRAY['access', 'egress', 'buildings', 'entry']),
('D1.2', 'Access for people with disabilities', 'Access requirements for people with disabilities.', 'Access', 'Disability', 'D', '1', 'D', '1.2', ARRAY['disability', 'accessibility', 'wheelchair']),
('E1.1', 'Sound transmission', 'Sound transmission and insulation requirements.', 'Services and Equipment', 'Sound', 'E', '1', 'E', '1.1', ARRAY['sound', 'transmission', 'insulation', 'acoustic']),
('E1.2', 'Sound absorption', 'Sound absorption requirements for building elements.', 'Services and Equipment', 'Sound', 'E', '1', 'E', '1.2', ARRAY['sound', 'absorption', 'acoustic']),
('F1.1', 'Natural ventilation', 'Natural ventilation requirements for habitable rooms.', 'Health and Amenity', 'Ventilation', 'F', '1', 'F', '1.1', ARRAY['ventilation', 'natural', 'habitable', 'rooms']),
('F1.2', 'Mechanical ventilation', 'Mechanical ventilation and air conditioning requirements.', 'Health and Amenity', 'Ventilation', 'F', '1', 'F', '1.2', ARRAY['mechanical', 'ventilation', 'air conditioning']),
('G1.1', 'Sanitary facilities', 'Requirements for sanitary facilities in buildings.', 'Health and Amenity', 'Sanitary', 'G', '1', 'G', '1.1', ARRAY['sanitary', 'facilities', 'bathrooms', 'toilets']),
('G1.2', 'Laundry facilities', 'Requirements for laundry facilities in buildings.', 'Health and Amenity', 'Laundry', 'G', '1', 'G', '1.2', ARRAY['laundry', 'facilities', 'washing']),
('H1.1', 'Energy efficiency', 'Energy efficiency requirements for buildings.', 'Energy Efficiency', 'General', 'H', '1', 'H', '1.1', ARRAY['energy', 'efficiency', 'sustainability']),
('H1.2', 'Building fabric', 'Energy efficiency requirements for building fabric.', 'Energy Efficiency', 'Fabric', 'H', '1', 'H', '1.2', ARRAY['fabric', 'insulation', 'energy']),
('J1.1', 'Stormwater drainage', 'Stormwater drainage requirements for buildings.', 'Ancillary Provisions', 'Drainage', 'J', '1', 'J', '1.1', ARRAY['stormwater', 'drainage', 'water']),
('J1.2', 'Site drainage', 'Site drainage requirements for building sites.', 'Ancillary Provisions', 'Drainage', 'J', '1', 'J', '1.2', ARRAY['site', 'drainage', 'landscaping']),
('K1.1', 'Glazing', 'Glazing requirements for buildings.', 'Ancillary Provisions', 'Glazing', 'K', '1', 'K', '1.1', ARRAY['glazing', 'glass', 'windows', 'doors']),
('K1.2', 'Glazing in buildings', 'Specific glazing requirements for different building types.', 'Ancillary Provisions', 'Glazing', 'K', '1', 'K', '1.2', ARRAY['glazing', 'buildings', 'types']);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_ncc_codes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_ncc_codes_updated_at
    BEFORE UPDATE ON ncc_codes
    FOR EACH ROW
    EXECUTE FUNCTION update_ncc_codes_updated_at(); 

-- Migration: 20250124000000_create_qbcc_forms_table.sql
-- Create QBCC forms table for storing Queensland Building and Construction Commission forms data
CREATE TABLE IF NOT EXISTS qbcc_forms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    form_code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    form_type VARCHAR(50),
    version VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    notes TEXT,
    keywords TEXT[],
    external_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_qbcc_forms_form_code ON qbcc_forms(form_code);
CREATE INDEX IF NOT EXISTS idx_qbcc_forms_category ON qbcc_forms(category);
CREATE INDEX IF NOT EXISTS idx_qbcc_forms_keywords ON qbcc_forms USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_qbcc_forms_search ON qbcc_forms USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(notes, '')));

-- Create RLS policies
ALTER TABLE qbcc_forms ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users with QBCC voice search feature
CREATE POLICY "Allow read access to QBCC forms for authorized users" ON qbcc_forms
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_subscriptions us
            JOIN subscription_features sf ON us.subscription_tier = sf.tier
            WHERE us.user_id = auth.uid()
            AND sf.feature_key = 'qbcc_voice_search'
            AND sf.feature_value::text = 'true'
            AND us.is_active = true
        )
    );

-- Create function to search QBCC forms
CREATE OR REPLACE FUNCTION search_qbcc_forms(search_query TEXT)
RETURNS TABLE (
    id UUID,
    form_code VARCHAR(50),
    title VARCHAR(255),
    description TEXT,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    form_type VARCHAR(50),
    version VARCHAR(20),
    status VARCHAR(20),
    notes TEXT,
    keywords TEXT[],
    external_url VARCHAR(500),
    relevance_score FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        qf.id,
        qf.form_code,
        qf.title,
        qf.description,
        qf.category,
        qf.subcategory,
        qf.form_type,
        qf.version,
        qf.status,
        qf.notes,
        qf.keywords,
        qf.external_url,
        ts_rank(
            to_tsvector('english', qf.title || ' ' || COALESCE(qf.description, '') || ' ' || COALESCE(qf.notes, '')),
            plainto_tsquery('english', search_query)
        ) as relevance_score
    FROM qbcc_forms qf
    WHERE qf.is_active = true
    AND (
        to_tsvector('english', qf.title || ' ' || COALESCE(qf.description, '') || ' ' || COALESCE(qf.notes, '')) @@ plainto_tsquery('english', search_query)
        OR qf.form_code ILIKE '%' || search_query || '%'
        OR qf.title ILIKE '%' || search_query || '%'
        OR qf.category ILIKE '%' || search_query || '%'
        OR qf.subcategory ILIKE '%' || search_query || '%'
        OR qf.keywords && string_to_array(lower(search_query), ' ')
    )
    ORDER BY relevance_score DESC, qf.form_code ASC
    LIMIT 50;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample QBCC forms data
INSERT INTO qbcc_forms (form_code, title, description, category, subcategory, form_type, version, keywords, external_url) VALUES
('QBCC-001', 'Application for a contractor licence', 'Application form for individuals seeking a contractor licence in Queensland', 'Licensing', 'Contractor', 'Application', '2024.1', ARRAY['contractor', 'licence', 'application', 'individual'], 'https://www.qbcc.qld.gov.au/contractor-licence-application'),
('QBCC-002', 'Application for a nominee supervisor', 'Application form for nominee supervisor licence', 'Licensing', 'Nominee', 'Application', '2024.1', ARRAY['nominee', 'supervisor', 'licence', 'application'], 'https://www.qbcc.qld.gov.au/nominee-supervisor-application'),
('QBCC-003', 'Application for a company licence', 'Application form for companies seeking a contractor licence', 'Licensing', 'Company', 'Application', '2024.1', ARRAY['company', 'licence', 'application', 'business'], 'https://www.qbcc.qld.gov.au/company-licence-application'),
('QBCC-004', 'Application for a partnership licence', 'Application form for partnerships seeking a contractor licence', 'Licensing', 'Partnership', 'Application', '2024.1', ARRAY['partnership', 'licence', 'application'], 'https://www.qbcc.qld.gov.au/partnership-licence-application'),
('QBCC-005', 'Application for a trust licence', 'Application form for trusts seeking a contractor licence', 'Licensing', 'Trust', 'Application', '2024.1', ARRAY['trust', 'licence', 'application'], 'https://www.qbcc.qld.gov.au/trust-licence-application'),
('QBCC-101', 'Notification of residential building work', 'Form to notify QBCC of residential building work', 'Notifications', 'Residential', 'Notification', '2024.1', ARRAY['residential', 'building', 'notification', 'work'], 'https://www.qbcc.qld.gov.au/residential-notification'),
('QBCC-102', 'Notification of commercial building work', 'Form to notify QBCC of commercial building work', 'Notifications', 'Commercial', 'Notification', '2024.1', ARRAY['commercial', 'building', 'notification', 'work'], 'https://www.qbcc.qld.gov.au/commercial-notification'),
('QBCC-201', 'Application for building approval', 'Application form for building approval', 'Building', 'Approval', 'Application', '2024.1', ARRAY['building', 'approval', 'application'], 'https://www.qbcc.qld.gov.au/building-approval'),
('QBCC-202', 'Application for development permit', 'Application form for development permit', 'Building', 'Development', 'Application', '2024.1', ARRAY['development', 'permit', 'application'], 'https://www.qbcc.qld.gov.au/development-permit'),
('QBCC-301', 'Complaint form', 'Form to submit a complaint to QBCC', 'Complaints', 'General', 'Complaint', '2024.1', ARRAY['complaint', 'submit', 'report'], 'https://www.qbcc.qld.gov.au/complaint-form'),
('QBCC-302', 'Dispute resolution application', 'Application for dispute resolution services', 'Complaints', 'Dispute', 'Application', '2024.1', ARRAY['dispute', 'resolution', 'application'], 'https://www.qbcc.qld.gov.au/dispute-resolution'),
('QBCC-401', 'Insurance certificate application', 'Application for insurance certificate', 'Insurance', 'Certificate', 'Application', '2024.1', ARRAY['insurance', 'certificate', 'application'], 'https://www.qbcc.qld.gov.au/insurance-certificate'),
('QBCC-402', 'Insurance claim form', 'Form to submit an insurance claim', 'Insurance', 'Claims', 'Claim', '2024.1', ARRAY['insurance', 'claim', 'submit'], 'https://www.qbcc.qld.gov.au/insurance-claim'),
('QBCC-501', 'Renewal application', 'Application to renew a licence', 'Licensing', 'Renewal', 'Application', '2024.1', ARRAY['renewal', 'licence', 'application'], 'https://www.qbcc.qld.gov.au/licence-renewal'),
('QBCC-502', 'Variation application', 'Application to vary licence conditions', 'Licensing', 'Variation', 'Application', '2024.1', ARRAY['variation', 'licence', 'conditions'], 'https://www.qbcc.qld.gov.au/licence-variation'),
('QBCC-601', 'Financial information form', 'Form to provide financial information', 'Financial', 'Information', 'Declaration', '2024.1', ARRAY['financial', 'information', 'declaration'], 'https://www.qbcc.qld.gov.au/financial-information'),
('QBCC-602', 'Audit report form', 'Form to submit audit reports', 'Financial', 'Audit', 'Report', '2024.1', ARRAY['audit', 'report', 'financial'], 'https://www.qbcc.qld.gov.au/audit-report'),
('QBCC-701', 'Training course approval', 'Application for training course approval', 'Training', 'Course', 'Application', '2024.1', ARRAY['training', 'course', 'approval'], 'https://www.qbcc.qld.gov.au/training-approval'),
('QBCC-702', 'Assessment application', 'Application for competency assessment', 'Training', 'Assessment', 'Application', '2024.1', ARRAY['assessment', 'competency', 'application'], 'https://www.qbcc.qld.gov.au/competency-assessment');

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_qbcc_forms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_qbcc_forms_updated_at
    BEFORE UPDATE ON qbcc_forms
    FOR EACH ROW
    EXECUTE FUNCTION update_qbcc_forms_updated_at(); 

-- Migration: 20250124000001_create_timber_queensland_data_table.sql
-- Create Timber Queensland technical data sheets table
CREATE TABLE IF NOT EXISTS timber_queensland_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    data_code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    timber_type VARCHAR(100),
    grade VARCHAR(50),
    dimensions VARCHAR(100),
    properties JSONB,
    specifications TEXT,
    notes TEXT,
    keywords TEXT[],
    external_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_timber_queensland_data_code ON timber_queensland_data(data_code);
CREATE INDEX IF NOT EXISTS idx_timber_queensland_category ON timber_queensland_data(category);
CREATE INDEX IF NOT EXISTS idx_timber_queensland_keywords ON timber_queensland_data USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_timber_queensland_search ON timber_queensland_data USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(specifications, '') || ' ' || COALESCE(notes, '')));
CREATE INDEX IF NOT EXISTS idx_timber_queensland_properties ON timber_queensland_data USING GIN(properties);

-- Create RLS policies
ALTER TABLE timber_queensland_data ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users with Timber Queensland voice search feature
CREATE POLICY "Allow read access to Timber Queensland data for authorized users" ON timber_queensland_data
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_subscriptions us
            JOIN subscription_features sf ON us.subscription_tier = sf.tier
            WHERE us.user_id = auth.uid()
            AND sf.feature_key = 'timber_queensland_voice_search'
            AND sf.feature_value::text = 'true'
            AND us.is_active = true
        )
    );

-- Create function to search Timber Queensland data
CREATE OR REPLACE FUNCTION search_timber_queensland_data(search_query TEXT)
RETURNS TABLE (
    id UUID,
    data_code VARCHAR(50),
    title VARCHAR(255),
    description TEXT,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    timber_type VARCHAR(100),
    grade VARCHAR(50),
    dimensions VARCHAR(100),
    properties JSONB,
    specifications TEXT,
    notes TEXT,
    keywords TEXT[],
    external_url VARCHAR(500),
    relevance_score FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tqd.id,
        tqd.data_code,
        tqd.title,
        tqd.description,
        tqd.category,
        tqd.subcategory,
        tqd.timber_type,
        tqd.grade,
        tqd.dimensions,
        tqd.properties,
        tqd.specifications,
        tqd.notes,
        tqd.keywords,
        tqd.external_url,
        ts_rank(
            to_tsvector('english', tqd.title || ' ' || COALESCE(tqd.description, '') || ' ' || COALESCE(tqd.specifications, '') || ' ' || COALESCE(tqd.notes, '')),
            plainto_tsquery('english', search_query)
        ) as relevance_score
    FROM timber_queensland_data tqd
    WHERE tqd.is_active = true
    AND (
        to_tsvector('english', tqd.title || ' ' || COALESCE(tqd.description, '') || ' ' || COALESCE(tqd.specifications, '') || ' ' || COALESCE(tqd.notes, '')) @@ plainto_tsquery('english', search_query)
        OR tqd.data_code ILIKE '%' || search_query || '%'
        OR tqd.title ILIKE '%' || search_query || '%'
        OR tqd.category ILIKE '%' || search_query || '%'
        OR tqd.subcategory ILIKE '%' || search_query || '%'
        OR tqd.timber_type ILIKE '%' || search_query || '%'
        OR tqd.grade ILIKE '%' || search_query || '%'
        OR tqd.dimensions ILIKE '%' || search_query || '%'
        OR tqd.keywords && string_to_array(lower(search_query), ' ')
    )
    ORDER BY relevance_score DESC, tqd.data_code ASC
    LIMIT 50;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample Timber Queensland technical data
INSERT INTO timber_queensland_data (data_code, title, description, category, subcategory, timber_type, grade, dimensions, properties, specifications, keywords, external_url) VALUES
('TQ-001', 'MGP10 Structural Pine', 'Machine Graded Pine structural timber grade MGP10', 'Structural Timber', 'Pine', 'Radiata Pine', 'MGP10', '140x45mm', '{"bending_strength": 10, "tension_strength": 6.5, "compression_strength": 8.5, "modulus_of_elasticity": 9000}', 'Structural grade pine suitable for framing and general construction', ARRAY['mgp10', 'pine', 'structural', 'framing'], 'https://www.timberqueensland.com.au/mgp10-specifications'),
('TQ-002', 'MGP12 Structural Pine', 'Machine Graded Pine structural timber grade MGP12', 'Structural Timber', 'Pine', 'Radiata Pine', 'MGP12', '140x45mm', '{"bending_strength": 12, "tension_strength": 7.5, "compression_strength": 9.5, "modulus_of_elasticity": 10000}', 'Higher strength structural grade pine for demanding applications', ARRAY['mgp12', 'pine', 'structural', 'high-strength'], 'https://www.timberqueensland.com.au/mgp12-specifications'),
('TQ-003', 'F7 Hardwood', 'F7 grade hardwood structural timber', 'Structural Timber', 'Hardwood', 'Mixed Hardwood', 'F7', '140x45mm', '{"bending_strength": 14, "tension_strength": 8.5, "compression_strength": 12, "modulus_of_elasticity": 12000}', 'F7 grade hardwood for structural applications', ARRAY['f7', 'hardwood', 'structural'], 'https://www.timberqueensland.com.au/f7-hardwood-specifications'),
('TQ-004', 'F8 Hardwood', 'F8 grade hardwood structural timber', 'Structural Timber', 'Hardwood', 'Mixed Hardwood', 'F8', '140x45mm', '{"bending_strength": 16, "tension_strength": 10, "compression_strength": 14, "modulus_of_elasticity": 14000}', 'F8 grade hardwood for high-strength structural applications', ARRAY['f8', 'hardwood', 'structural', 'high-strength'], 'https://www.timberqueensland.com.au/f8-hardwood-specifications'),
('TQ-005', 'Treated Pine H3', 'H3 treated pine for above ground applications', 'Treated Timber', 'Pine', 'Radiata Pine', 'H3', '140x45mm', '{"treatment_level": "H3", "chemical": "Copper Chrome Arsenate", "above_ground": true}', 'H3 treated pine suitable for above ground applications', ARRAY['h3', 'treated', 'pine', 'above-ground'], 'https://www.timberqueensland.com.au/h3-treated-pine'),
('TQ-006', 'Treated Pine H4', 'H4 treated pine for in-ground applications', 'Treated Timber', 'Pine', 'Radiata Pine', 'H4', '140x45mm', '{"treatment_level": "H4", "chemical": "Copper Chrome Arsenate", "in_ground": true}', 'H4 treated pine suitable for in-ground applications', ARRAY['h4', 'treated', 'pine', 'in-ground'], 'https://www.timberqueensland.com.au/h4-treated-pine'),
('TQ-007', 'Spotted Gum Decking', 'Spotted Gum decking timber', 'Decking', 'Hardwood', 'Spotted Gum', 'Select Grade', '140x19mm', '{"density": 1010, "janka_hardness": 11, "durability_class": "Class 1"}', 'Premium spotted gum decking with excellent durability', ARRAY['spotted-gum', 'decking', 'hardwood', 'premium'], 'https://www.timberqueensland.com.au/spotted-gum-decking'),
('TQ-008', 'Blackbutt Decking', 'Blackbutt decking timber', 'Decking', 'Hardwood', 'Blackbutt', 'Select Grade', '140x19mm', '{"density": 900, "janka_hardness": 9.1, "durability_class": "Class 1"}', 'Classic blackbutt decking with natural appeal', ARRAY['blackbutt', 'decking', 'hardwood'], 'https://www.timberqueensland.com.au/blackbutt-decking'),
('TQ-009', 'Merbau Decking', 'Merbau decking timber', 'Decking', 'Hardwood', 'Merbau', 'Select Grade', '140x19mm', '{"density": 840, "janka_hardness": 7.8, "durability_class": "Class 1"}', 'Merbau decking with rich red-brown color', ARRAY['merbau', 'decking', 'hardwood', 'red-brown'], 'https://www.timberqueensland.com.au/merbau-decking'),
('TQ-010', 'Treated Pine Decking', 'H3 treated pine decking', 'Decking', 'Pine', 'Radiata Pine', 'H3', '140x19mm', '{"treatment_level": "H3", "chemical": "Copper Chrome Arsenate", "above_ground": true}', 'H3 treated pine decking for above ground use', ARRAY['treated-pine', 'decking', 'h3'], 'https://www.timberqueensland.com.au/treated-pine-decking'),
('TQ-011', 'Plywood Structural', 'Structural plywood for construction', 'Plywood', 'Structural', 'Mixed Species', 'F8', '2400x1200x12mm', '{"bending_strength": 16, "modulus_of_elasticity": 14000, "layers": 7}', 'Structural plywood for formwork and construction', ARRAY['plywood', 'structural', 'formwork'], 'https://www.timberqueensland.com.au/structural-plywood'),
('TQ-012', 'Plywood Marine', 'Marine grade plywood', 'Plywood', 'Marine', 'Mixed Species', 'Marine', '2400x1200x12mm', '{"water_resistance": "Marine", "glue_type": "Phenolic", "layers": 7}', 'Marine grade plywood for water-resistant applications', ARRAY['plywood', 'marine', 'water-resistant'], 'https://www.timberqueensland.com.au/marine-plywood'),
('TQ-013', 'MDF Standard', 'Standard Medium Density Fibreboard', 'Panel Products', 'MDF', 'Mixed Wood Fibres', 'Standard', '2400x1200x16mm', '{"density": 750, "moisture_resistance": "Standard"}', 'Standard MDF for interior applications', ARRAY['mdf', 'standard', 'interior'], 'https://www.timberqueensland.com.au/standard-mdf'),
('TQ-014', 'MDF Moisture Resistant', 'Moisture resistant MDF', 'Panel Products', 'MDF', 'Mixed Wood Fibres', 'Moisture Resistant', '2400x1200x16mm', '{"density": 750, "moisture_resistance": "Moisture Resistant"}', 'Moisture resistant MDF for wet areas', ARRAY['mdf', 'moisture-resistant', 'wet-areas'], 'https://www.timberqueensland.com.au/moisture-resistant-mdf'),
('TQ-015', 'Particleboard', 'Standard particleboard', 'Panel Products', 'Particleboard', 'Mixed Wood Particles', 'Standard', '2400x1200x16mm', '{"density": 650, "moisture_resistance": "Standard"}', 'Standard particleboard for general use', ARRAY['particleboard', 'standard', 'general'], 'https://www.timberqueensland.com.au/particleboard'),
('TQ-016', 'OSB Structural', 'Oriented Strand Board structural panel', 'Panel Products', 'OSB', 'Mixed Wood Strands', 'Structural', '2400x1200x18mm', '{"bending_strength": 12, "modulus_of_elasticity": 10000}', 'Structural OSB for sheathing and flooring', ARRAY['osb', 'structural', 'sheathing', 'flooring'], 'https://www.timberqueensland.com.au/structural-osb'),
('TQ-017', 'LVL Beam', 'Laminated Veneer Lumber beam', 'Engineered Timber', 'LVL', 'Mixed Veneers', 'F8', '240x45mm', '{"bending_strength": 16, "modulus_of_elasticity": 14000, "length": "up to 12m"}', 'LVL beam for long span applications', ARRAY['lvl', 'beam', 'long-span', 'engineered'], 'https://www.timberqueensland.com.au/lvl-beams'),
('TQ-018', 'Glulam Beam', 'Glued Laminated Timber beam', 'Engineered Timber', 'Glulam', 'Mixed Laminations', 'F8', '240x90mm', '{"bending_strength": 16, "modulus_of_elasticity": 14000, "length": "up to 20m"}', 'Glulam beam for large span applications', ARRAY['glulam', 'beam', 'large-span', 'engineered'], 'https://www.timberqueensland.com.au/glulam-beams'),
('TQ-019', 'I-Joist', 'Timber I-joist for floor and roof systems', 'Engineered Timber', 'I-Joist', 'Mixed Components', 'F8', '240mm depth', '{"bending_strength": 16, "modulus_of_elasticity": 14000, "span": "up to 6m"}', 'I-joist for efficient floor and roof systems', ARRAY['i-joist', 'floor', 'roof', 'engineered'], 'https://www.timberqueensland.com.au/i-joists'),
('TQ-020', 'CLT Panel', 'Cross Laminated Timber panel', 'Engineered Timber', 'CLT', 'Mixed Laminations', 'F8', '2400x1200x90mm', '{"bending_strength": 16, "modulus_of_elasticity": 14000, "layers": 5}', 'CLT panel for wall and floor systems', ARRAY['clt', 'panel', 'wall', 'floor', 'engineered'], 'https://www.timberqueensland.com.au/clt-panels');

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_timber_queensland_data_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_timber_queensland_data_updated_at
    BEFORE UPDATE ON timber_queensland_data
    FOR EACH ROW
    EXECUTE FUNCTION update_timber_queensland_data_updated_at(); 

-- Migration: 20250124000002_add_qbcc_timber_voice_search_features.sql
-- Add QBCC and Timber Queensland voice search features to subscription_features table

-- Add QBCC voice search feature
INSERT INTO subscription_features (subscription_tier, feature_key, feature_name, description, enabled, created_at, updated_at) VALUES
('premium_edge', 'qbcc_voice_search', 'QBCC Forms Voice Search', 'Voice-activated search for Queensland Building and Construction Commission forms and documents', true, NOW(), NOW()),
('skeleton_key', 'qbcc_voice_search', 'QBCC Forms Voice Search', 'Voice-activated search for Queensland Building and Construction Commission forms and documents', true, NOW(), NOW()),
('basic', 'qbcc_voice_search', 'QBCC Forms Voice Search', 'Voice-activated search for Queensland Building and Construction Commission forms and documents', false, NOW(), NOW()),
('free', 'qbcc_voice_search', 'QBCC Forms Voice Search', 'Voice-activated search for Queensland Building and Construction Commission forms and documents', false, NOW(), NOW());

-- Add Timber Queensland voice search feature
INSERT INTO subscription_features (subscription_tier, feature_key, feature_name, description, enabled, created_at, updated_at) VALUES
('premium_edge', 'timber_queensland_voice_search', 'Timber Queensland Voice Search', 'Voice-activated search for Timber Queensland technical data sheets and specifications', true, NOW(), NOW()),
('skeleton_key', 'timber_queensland_voice_search', 'Timber Queensland Voice Search', 'Voice-activated search for Timber Queensland technical data sheets and specifications', true, NOW(), NOW()),
('basic', 'timber_queensland_voice_search', 'Timber Queensland Voice Search', 'Voice-activated search for Timber Queensland technical data sheets and specifications', false, NOW(), NOW()),
('free', 'timber_queensland_voice_search', 'Timber Queensland Voice Search', 'Voice-activated search for Timber Queensland technical data sheets and specifications', false, NOW(), NOW());

-- Update existing subscription features to include the new features in the features JSONB column
UPDATE subscription_features 
SET features = features || '{"qbcc_voice_search": true, "timber_queensland_voice_search": true}'::jsonb
WHERE subscription_tier IN ('premium_edge', 'skeleton_key')
AND feature_key = 'voice_search';

-- Update basic and free tiers to have the features disabled
UPDATE subscription_features 
SET features = features || '{"qbcc_voice_search": false, "timber_queensland_voice_search": false}'::jsonb
WHERE subscription_tier IN ('basic', 'free')
AND feature_key = 'voice_search'; 

-- Migration: 20250124000002_add_voice_search_features.sql
-- Add voice search features to subscription_features table
INSERT INTO subscription_features (tier, feature_key, feature_value, description) VALUES
-- Free Starter - no voice search access
('free_starter', 'ncc_voice_search', 'false', 'NCC codes voice search access'),
('free_starter', 'qbcc_voice_search', 'false', 'QBCC forms voice search access'),
('free_starter', 'timber_queensland_voice_search', 'false', 'Timber Queensland voice search access'),

-- Growing Pain Relief - basic voice search access
('growing_pain_relief', 'ncc_voice_search', 'true', 'NCC codes voice search access'),
('growing_pain_relief', 'qbcc_voice_search', 'false', 'QBCC forms voice search access'),
('growing_pain_relief', 'timber_queensland_voice_search', 'false', 'Timber Queensland voice search access'),

-- Premium Edge - all voice search access
('premium_edge', 'ncc_voice_search', 'true', 'NCC codes voice search access'),
('premium_edge', 'qbcc_voice_search', 'true', 'QBCC forms voice search access'),
('premium_edge', 'timber_queensland_voice_search', 'true', 'Timber Queensland voice search access'),

-- Skeleton Key - all voice search access
('skeleton_key', 'ncc_voice_search', 'true', 'NCC codes voice search access'),
('skeleton_key', 'qbcc_voice_search', 'true', 'QBCC forms voice search access'),
('skeleton_key', 'timber_queensland_voice_search', 'true', 'Timber Queensland voice search access')
ON CONFLICT (tier, feature_key) DO UPDATE 
SET feature_value = EXCLUDED.feature_value,
    description = EXCLUDED.description,
    updated_at = NOW(); 

-- Migration: 20250529_setup_rls_policies.sql
-- Enable Row Level Security on customers table
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Create policy for SELECT operations
-- This ensures users can only view their own customers
CREATE POLICY "customers_select_policy"
ON customers
FOR SELECT
USING (auth.uid() = user_id);

-- Create policy for INSERT operations
-- This ensures users can only insert customers linked to themselves
CREATE POLICY "customers_insert_policy"
ON customers
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create policy for UPDATE operations
-- This ensures users can only update their own customers
CREATE POLICY "customers_update_policy"
ON customers
FOR UPDATE
USING (auth.uid() = user_id);

-- Create policy for DELETE operations
-- This ensures users can only delete their own customers
CREATE POLICY "customers_delete_policy"
ON customers
FOR DELETE
USING (auth.uid() = user_id);

-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'customers';

-- List all policies on the customers table
SELECT * FROM pg_policies WHERE tablename = 'customers';

-- Note: After running this script, you should test the policies by:
-- 1. Authenticating as a user
-- 2. Trying to access data that belongs to that user (should succeed)
-- 3. Trying to access data that belongs to another user (should fail) 

-- Migration: create_n8n_webhooks.sql
-- Enable the pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a function to send webhooks to n8n
CREATE OR REPLACE FUNCTION send_n8n_webhook()
RETURNS trigger AS $$
DECLARE
  webhook_payload json;
  webhook_url text;
  webhook_secret text;
BEGIN
  -- Configure your n8n webhook URL here
  -- For development with tunnel: https://your-tunnel-id.hooks.n8n.cloud/webhook/trade-webhook
  -- For production: https://your-domain.com/webhook/trade-webhook
  webhook_url := 'https://your-tunnel-id.hooks.n8n.cloud/webhook/trade-webhook';
  webhook_secret := 'your-webhook-secret-key';
  
  -- Build the webhook payload
  webhook_payload = json_build_object(
    'table', TG_TABLE_NAME,
    'action', TG_OP,
    'old', CASE WHEN TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END,
    'new', CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN row_to_json(NEW) ELSE NULL END,
    'timestamp', NOW(),
    'schema', TG_TABLE_SCHEMA
  );
  
  -- Send the webhook using pg_net
  PERFORM net.http_post(
    url := webhook_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'X-Webhook-Secret', webhook_secret
    ),
    body := webhook_payload::text
  );
  
  -- Return the appropriate value
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for the trades table
DROP TRIGGER IF EXISTS trades_n8n_insert_webhook ON trades;
CREATE TRIGGER trades_n8n_insert_webhook
AFTER INSERT ON trades
FOR EACH ROW EXECUTE FUNCTION send_n8n_webhook();

DROP TRIGGER IF EXISTS trades_n8n_update_webhook ON trades;
CREATE TRIGGER trades_n8n_update_webhook
AFTER UPDATE ON trades
FOR EACH ROW EXECUTE FUNCTION send_n8n_webhook();

DROP TRIGGER IF EXISTS trades_n8n_delete_webhook ON trades;
CREATE TRIGGER trades_n8n_delete_webhook
AFTER DELETE ON trades
FOR EACH ROW EXECUTE FUNCTION send_n8n_webhook();

-- Create triggers for the shipments table
DROP TRIGGER IF EXISTS shipments_n8n_insert_webhook ON shipments;
CREATE TRIGGER shipments_n8n_insert_webhook
AFTER INSERT ON shipments
FOR EACH ROW EXECUTE FUNCTION send_n8n_webhook();

DROP TRIGGER IF EXISTS shipments_n8n_update_webhook ON shipments;
CREATE TRIGGER shipments_n8n_update_webhook
AFTER UPDATE ON shipments
FOR EACH ROW EXECUTE FUNCTION send_n8n_webhook();

-- Create triggers for the documents table
DROP TRIGGER IF EXISTS documents_n8n_insert_webhook ON documents;
CREATE TRIGGER documents_n8n_insert_webhook
AFTER INSERT ON documents
FOR EACH ROW EXECUTE FUNCTION send_n8n_webhook();

DROP TRIGGER IF EXISTS documents_n8n_update_webhook ON documents;
CREATE TRIGGER documents_n8n_update_webhook
AFTER UPDATE ON documents
FOR EACH ROW EXECUTE FUNCTION send_n8n_webhook();

-- Create a function to update webhook configuration
CREATE OR REPLACE FUNCTION update_n8n_webhook_config(
  new_url text,
  new_secret text
)
RETURNS void AS $$
BEGIN
  -- This would typically update a configuration table
  -- For now, you'll need to update the send_n8n_webhook function directly
  RAISE NOTICE 'Update the webhook_url and webhook_secret in send_n8n_webhook() function';
END;
$$ LANGUAGE plpgsql;

-- Create a table to log webhook failures (optional)
CREATE TABLE IF NOT EXISTS webhook_logs (
  id BIGSERIAL PRIMARY KEY,
  table_name TEXT NOT NULL,
  action TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- Function to log webhook attempts
CREATE OR REPLACE FUNCTION log_webhook_attempt(
  p_table_name text,
  p_action text,
  p_payload jsonb
)
RETURNS BIGINT AS $$
DECLARE
  log_id BIGINT;
BEGIN
  INSERT INTO webhook_logs (table_name, action, payload)
  VALUES (p_table_name, p_action, p_payload)
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql;

-- Example: Create a more robust webhook function with error handling
CREATE OR REPLACE FUNCTION send_n8n_webhook_with_retry()
RETURNS trigger AS $$
DECLARE
  webhook_payload json;
  webhook_url text;
  webhook_secret text;
  log_id BIGINT;
BEGIN
  webhook_url := 'https://your-tunnel-id.hooks.n8n.cloud/webhook/trade-webhook';
  webhook_secret := 'your-webhook-secret-key';
  
  webhook_payload = json_build_object(
    'table', TG_TABLE_NAME,
    'action', TG_OP,
    'old', CASE WHEN TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END,
    'new', CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN row_to_json(NEW) ELSE NULL END,
    'timestamp', NOW()
  );
  
  -- Log the webhook attempt
  log_id := log_webhook_attempt(TG_TABLE_NAME, TG_OP, webhook_payload::jsonb);
  
  -- Send the webhook
  BEGIN
    PERFORM net.http_post(
      url := webhook_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'X-Webhook-Secret', webhook_secret,
        'X-Webhook-Log-Id', log_id::text
      ),
      body := webhook_payload::text
    );
    
    -- Update log status
    UPDATE webhook_logs 
    SET status = 'sent', processed_at = NOW()
    WHERE id = log_id;
    
  EXCEPTION WHEN OTHERS THEN
    -- Log the error
    UPDATE webhook_logs 
    SET status = 'failed', 
        error_message = SQLERRM,
        processed_at = NOW()
    WHERE id = log_id;
    
    -- Don't fail the transaction, just log the error
    RAISE WARNING 'Webhook failed: %', SQLERRM;
  END;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION send_n8n_webhook() TO authenticated;
GRANT EXECUTE ON FUNCTION send_n8n_webhook_with_retry() TO authenticated; 

-- Migration: create_n8n_webhooks_configured.sql
-- Enable the pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a function to send webhooks to n8n
CREATE OR REPLACE FUNCTION send_n8n_webhook()
RETURNS trigger AS $$
DECLARE
  webhook_payload json;
  webhook_url text;
  webhook_secret text;
BEGIN
  -- Your n8n webhook URL with tunnel
  webhook_url := 'https://yeathgp1pgxkfrt2yfgrpxrv.hooks.n8n.cloud/webhook/trade-webhook';
  webhook_secret := 'trade-ease-webhook-secret-2024-secure'; -- Secure webhook secret
  
  -- Build the webhook payload
  webhook_payload = json_build_object(
    'table', TG_TABLE_NAME,
    'action', TG_OP,
    'old', CASE WHEN TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END,
    'new', CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN row_to_json(NEW) ELSE NULL END,
    'timestamp', NOW(),
    'schema', TG_TABLE_SCHEMA
  );
  
  -- Send the webhook using pg_net
  PERFORM net.http_post(
    url := webhook_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'X-Webhook-Secret', webhook_secret
    ),
    body := webhook_payload::text
  );
  
  -- Return the appropriate value
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for the trades table
DROP TRIGGER IF EXISTS trades_n8n_insert_webhook ON trades;
CREATE TRIGGER trades_n8n_insert_webhook
AFTER INSERT ON trades
FOR EACH ROW EXECUTE FUNCTION send_n8n_webhook();

DROP TRIGGER IF EXISTS trades_n8n_update_webhook ON trades;
CREATE TRIGGER trades_n8n_update_webhook
AFTER UPDATE ON trades
FOR EACH ROW EXECUTE FUNCTION send_n8n_webhook();

DROP TRIGGER IF EXISTS trades_n8n_delete_webhook ON trades;
CREATE TRIGGER trades_n8n_delete_webhook
AFTER DELETE ON trades
FOR EACH ROW EXECUTE FUNCTION send_n8n_webhook(); 

-- Migration: create_trades_table.sql
-- Create trades table
CREATE TABLE IF NOT EXISTS trades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trade_id VARCHAR(255) UNIQUE NOT NULL,
  buyer_id UUID REFERENCES auth.users(id),
  seller_id UUID REFERENCES auth.users(id),
  product_id UUID,
  product_name VARCHAR(255),
  quantity DECIMAL(10, 2) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  amount DECIMAL(10, 2) GENERATED ALWAYS AS (quantity * price) STORED,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'pending',
  payment_status VARCHAR(50) DEFAULT 'pending',
  shipping_status VARCHAR(50) DEFAULT 'pending',
  origin_country VARCHAR(100),
  destination_country VARCHAR(100),
  incoterm VARCHAR(10),
  payment_terms TEXT,
  delivery_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create shipments table
CREATE TABLE IF NOT EXISTS shipments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id VARCHAR(255) UNIQUE NOT NULL,
  trade_id UUID REFERENCES trades(id) ON DELETE CASCADE,
  carrier VARCHAR(255),
  tracking_number VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  origin_address JSONB,
  destination_address JSONB,
  estimated_delivery DATE,
  actual_delivery DATE,
  shipping_cost DECIMAL(10, 2),
  weight DECIMAL(10, 2),
  dimensions JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id VARCHAR(255) UNIQUE NOT NULL,
  trade_id UUID REFERENCES trades(id) ON DELETE CASCADE,
  document_type VARCHAR(100) NOT NULL,
  document_name VARCHAR(255) NOT NULL,
  file_url TEXT,
  file_size INTEGER,
  mime_type VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending',
  verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_trades_buyer_id ON trades(buyer_id);
CREATE INDEX idx_trades_seller_id ON trades(seller_id);
CREATE INDEX idx_trades_status ON trades(status);
CREATE INDEX idx_trades_created_at ON trades(created_at DESC);

CREATE INDEX idx_shipments_trade_id ON shipments(trade_id);
CREATE INDEX idx_shipments_status ON shipments(status);

CREATE INDEX idx_documents_trade_id ON documents(trade_id);
CREATE INDEX idx_documents_type ON documents(document_type);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- Enable Row Level Security
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for trades
CREATE POLICY "Users can view their own trades" ON trades
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can create trades" ON trades
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own trades" ON trades
  FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_trades_updated_at BEFORE UPDATE ON trades
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shipments_updated_at BEFORE UPDATE ON shipments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 

