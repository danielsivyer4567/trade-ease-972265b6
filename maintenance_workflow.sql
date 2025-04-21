-- Create maintenance and follow-up workflow tables

-- Ensure extensions are available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Maintenance Plans table
CREATE TABLE IF NOT EXISTS maintenance_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  frequency TEXT NOT NULL, -- 'weekly', 'monthly', 'quarterly', 'annually'
  status TEXT DEFAULT 'active',
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Maintenance Visits table
CREATE TABLE IF NOT EXISTS maintenance_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID REFERENCES maintenance_plans(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled'
  scheduled_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  assigned_to TEXT[], -- Array of user IDs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Maintenance Items table (tasks to be performed during visits)
CREATE TABLE IF NOT EXISTS maintenance_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID REFERENCES maintenance_plans(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  estimated_time INTEGER, -- in minutes
  is_required BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Visit Items table (junction table for visits and items)
CREATE TABLE IF NOT EXISTS visit_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_id UUID REFERENCES maintenance_visits(id) ON DELETE CASCADE,
  item_id UUID REFERENCES maintenance_items(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'skipped'
  notes TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  completed_by TEXT, -- user ID
  UNIQUE(visit_id, item_id)
);

-- Visit Photos table
CREATE TABLE IF NOT EXISTS visit_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_id UUID REFERENCES maintenance_visits(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Follow-up Tasks table
CREATE TABLE IF NOT EXISTS follow_up_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  visit_id UUID REFERENCES maintenance_visits(id) ON DELETE SET NULL,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  status TEXT DEFAULT 'open', -- 'open', 'in_progress', 'completed', 'cancelled'
  due_date TIMESTAMP WITH TIME ZONE,
  assigned_to TEXT, -- user ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recurring Billings table
CREATE TABLE IF NOT EXISTS recurring_billings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES maintenance_plans(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  frequency TEXT NOT NULL, -- 'monthly', 'quarterly', 'annually'
  status TEXT DEFAULT 'active',
  next_billing_date TIMESTAMP WITH TIME ZONE NOT NULL,
  billing_day INTEGER, -- day of month
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_maintenance_plans_customer_id ON maintenance_plans(customer_id);
CREATE INDEX idx_maintenance_plans_job_id ON maintenance_plans(job_id);
CREATE INDEX idx_maintenance_visits_plan_id ON maintenance_visits(plan_id);
CREATE INDEX idx_maintenance_visits_customer_id ON maintenance_visits(customer_id);
CREATE INDEX idx_maintenance_items_plan_id ON maintenance_items(plan_id);
CREATE INDEX idx_visit_items_visit_id ON visit_items(visit_id);
CREATE INDEX idx_visit_items_item_id ON visit_items(item_id);
CREATE INDEX idx_visit_photos_visit_id ON visit_photos(visit_id);
CREATE INDEX idx_follow_up_tasks_customer_id ON follow_up_tasks(customer_id);
CREATE INDEX idx_follow_up_tasks_visit_id ON follow_up_tasks(visit_id);
CREATE INDEX idx_follow_up_tasks_job_id ON follow_up_tasks(job_id);
CREATE INDEX idx_recurring_billings_customer_id ON recurring_billings(customer_id);
CREATE INDEX idx_recurring_billings_plan_id ON recurring_billings(plan_id);

-- Create RLS policies
ALTER TABLE maintenance_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_up_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_billings ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can view their own maintenance plans"
  ON maintenance_plans FOR SELECT
  USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

CREATE POLICY "Users can view their own maintenance visits"
  ON maintenance_visits FOR SELECT
  USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

CREATE POLICY "Users can view maintenance items for their plans"
  ON maintenance_items FOR SELECT
  USING (plan_id IN (SELECT id FROM maintenance_plans WHERE customer_id IN 
         (SELECT id FROM customers WHERE user_id = auth.uid())));

-- Create triggers to update updated_at timestamp
CREATE TRIGGER update_maintenance_plans_updated_at
  BEFORE UPDATE ON maintenance_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_visits_updated_at
  BEFORE UPDATE ON maintenance_visits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_follow_up_tasks_updated_at
  BEFORE UPDATE ON follow_up_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recurring_billings_updated_at
  BEFORE UPDATE ON recurring_billings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 