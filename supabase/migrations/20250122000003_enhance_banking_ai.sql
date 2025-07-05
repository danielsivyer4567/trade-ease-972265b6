-- Enhanced Banking System with AI Features
-- This migration adds AI-powered accounting capabilities

-- Add AI-related columns to bank_transactions
ALTER TABLE public.bank_transactions ADD COLUMN IF NOT EXISTS vendor VARCHAR(255);
ALTER TABLE public.bank_transactions ADD COLUMN IF NOT EXISTS subcategory VARCHAR(100);
ALTER TABLE public.bank_transactions ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(15,2) DEFAULT 0.00;
ALTER TABLE public.bank_transactions ADD COLUMN IF NOT EXISTS tax_rate DECIMAL(5,2) DEFAULT 0.00;
ALTER TABLE public.bank_transactions ADD COLUMN IF NOT EXISTS is_billable BOOLEAN DEFAULT false;
ALTER TABLE public.bank_transactions ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL;
ALTER TABLE public.bank_transactions ADD COLUMN IF NOT EXISTS confidence_score DECIMAL(3,2) DEFAULT 0.00;
ALTER TABLE public.bank_transactions ADD COLUMN IF NOT EXISTS ai_processed BOOLEAN DEFAULT false;
ALTER TABLE public.bank_transactions ADD COLUMN IF NOT EXISTS document_url TEXT;
ALTER TABLE public.bank_transactions ADD COLUMN IF NOT EXISTS extracted_text TEXT;
ALTER TABLE public.bank_transactions ADD COLUMN IF NOT EXISTS integration_source VARCHAR(50);
ALTER TABLE public.bank_transactions ADD COLUMN IF NOT EXISTS external_id VARCHAR(100);

-- Create accounting_categories table for AI categorization
CREATE TABLE IF NOT EXISTS public.accounting_categories (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    parent_category VARCHAR(100),
    description TEXT,
    is_expense BOOLEAN DEFAULT true,
    is_tax_deductible BOOLEAN DEFAULT false,
    expense_type VARCHAR(20) CHECK (expense_type IN ('operating', 'capital', 'cost_of_goods')) DEFAULT 'operating',
    keywords TEXT[], -- Array of keywords for AI categorization
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create integration_sync_logs table
CREATE TABLE IF NOT EXISTS public.integration_sync_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
    integration_name VARCHAR(50) NOT NULL,
    sync_type VARCHAR(20) CHECK (sync_type IN ('import', 'export', 'sync')) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
    records_processed INTEGER DEFAULT 0,
    records_successful INTEGER DEFAULT 0,
    records_failed INTEGER DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create document_processing_queue table for AI processing
CREATE TABLE IF NOT EXISTS public.document_processing_queue (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50),
    account_id uuid REFERENCES public.bank_accounts(id) ON DELETE CASCADE,
    status VARCHAR(20) CHECK (status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
    processing_started_at TIMESTAMP WITH TIME ZONE,
    processing_completed_at TIMESTAMP WITH TIME ZONE,
    extracted_text TEXT,
    ai_analysis JSONB,
    confidence_score DECIMAL(3,2),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create accounting_rules table for custom AI rules
CREATE TABLE IF NOT EXISTS public.accounting_rules (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    conditions JSONB NOT NULL, -- JSON conditions for matching transactions
    actions JSONB NOT NULL, -- JSON actions to apply (category, subcategory, etc.)
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default accounting categories
INSERT INTO public.accounting_categories (name, parent_category, description, is_expense, is_tax_deductible, expense_type, keywords) VALUES
-- Income Categories
('Sales Revenue', NULL, 'Revenue from sales of goods or services', false, false, 'operating', ARRAY['sale', 'revenue', 'income', 'payment received']),
('Service Revenue', NULL, 'Revenue from service provision', false, false, 'operating', ARRAY['service', 'consulting', 'labor']),
('Interest Income', NULL, 'Interest earned on investments or bank accounts', false, false, 'operating', ARRAY['interest', 'dividend', 'investment']),

-- Operating Expenses
('Office Supplies', 'Operating Expenses', 'General office supplies and materials', true, true, 'operating', ARRAY['office', 'supplies', 'stationary', 'paper', 'pens']),
('Equipment', 'Operating Expenses', 'Tools, machinery, and equipment purchases', true, true, 'capital', ARRAY['equipment', 'tools', 'machinery', 'computer', 'hardware']),
('Materials', 'Operating Expenses', 'Raw materials and job-specific supplies', true, true, 'cost_of_goods', ARRAY['materials', 'lumber', 'concrete', 'paint', 'supplies']),
('Vehicle Expenses', 'Operating Expenses', 'Vehicle fuel, maintenance, and related costs', true, true, 'operating', ARRAY['fuel', 'gas', 'vehicle', 'maintenance', 'repair', 'automotive']),
('Professional Services', 'Operating Expenses', 'Legal, accounting, and consulting services', true, true, 'operating', ARRAY['legal', 'accounting', 'consulting', 'professional', 'attorney', 'lawyer']),
('Marketing', 'Operating Expenses', 'Advertising and marketing expenses', true, true, 'operating', ARRAY['marketing', 'advertising', 'promotion', 'social media', 'google ads']),
('Travel', 'Operating Expenses', 'Business travel expenses', true, true, 'operating', ARRAY['travel', 'hotel', 'flight', 'mileage', 'accommodation']),
('Meals & Entertainment', 'Operating Expenses', 'Business meals and entertainment', true, true, 'operating', ARRAY['meals', 'restaurant', 'entertainment', 'client dinner']),
('Utilities', 'Operating Expenses', 'Electricity, water, internet, phone', true, true, 'operating', ARRAY['utilities', 'electricity', 'water', 'internet', 'phone', 'gas bill']),
('Insurance', 'Operating Expenses', 'Business insurance premiums', true, true, 'operating', ARRAY['insurance', 'premium', 'liability', 'workers comp']),
('Rent', 'Operating Expenses', 'Office or workspace rent', true, true, 'operating', ARRAY['rent', 'office rent', 'warehouse', 'storage']),
('Software Subscriptions', 'Operating Expenses', 'Software and SaaS subscriptions', true, true, 'operating', ARRAY['software', 'subscription', 'saas', 'cloud', 'license']),
('Bank Fees', 'Operating Expenses', 'Banking and transaction fees', true, true, 'operating', ARRAY['bank fee', 'transaction fee', 'service charge', 'banking']),
('Training & Education', 'Operating Expenses', 'Employee training and education', true, true, 'operating', ARRAY['training', 'education', 'course', 'certification', 'learning']),

-- Uncategorized
('Uncategorized', NULL, 'Transactions not yet categorized', true, false, 'operating', ARRAY['uncategorized', 'unknown', 'misc'])

ON CONFLICT (name) DO NOTHING;

-- Add indexes for AI features
CREATE INDEX IF NOT EXISTS idx_bank_transactions_ai_processed ON public.bank_transactions(ai_processed);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_confidence_score ON public.bank_transactions(confidence_score);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_vendor ON public.bank_transactions(vendor);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_subcategory ON public.bank_transactions(subcategory);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_integration_source ON public.bank_transactions(integration_source);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_external_id ON public.bank_transactions(external_id);
CREATE INDEX IF NOT EXISTS idx_accounting_categories_keywords ON public.accounting_categories USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_integration_sync_logs_status ON public.integration_sync_logs(status);
CREATE INDEX IF NOT EXISTS idx_integration_sync_logs_integration_name ON public.integration_sync_logs(integration_name);
CREATE INDEX IF NOT EXISTS idx_document_processing_queue_status ON public.document_processing_queue(status);
CREATE INDEX IF NOT EXISTS idx_accounting_rules_is_active ON public.accounting_rules(is_active);

-- Enable RLS for new tables
ALTER TABLE public.accounting_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_processing_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounting_rules ENABLE ROW LEVEL SECURITY;

-- RLS policies for accounting_categories (global read, admin write)
CREATE POLICY "Anyone can view accounting categories" ON public.accounting_categories
    FOR SELECT USING (true);

-- RLS policies for integration_sync_logs
CREATE POLICY "Users can view their own sync logs" ON public.integration_sync_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sync logs" ON public.integration_sync_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sync logs" ON public.integration_sync_logs
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for document_processing_queue
CREATE POLICY "Users can view their own document processing queue" ON public.document_processing_queue
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own document processing queue" ON public.document_processing_queue
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own document processing queue" ON public.document_processing_queue
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own document processing queue" ON public.document_processing_queue
    FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for accounting_rules
CREATE POLICY "Users can view their own accounting rules" ON public.accounting_rules
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own accounting rules" ON public.accounting_rules
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own accounting rules" ON public.accounting_rules
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own accounting rules" ON public.accounting_rules
    FOR DELETE USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_accounting_categories_updated_at BEFORE UPDATE ON public.accounting_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_processing_queue_updated_at BEFORE UPDATE ON public.document_processing_queue
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounting_rules_updated_at BEFORE UPDATE ON public.accounting_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create functions for AI categorization
CREATE OR REPLACE FUNCTION match_transaction_category(
    description TEXT,
    vendor TEXT DEFAULT NULL,
    amount DECIMAL DEFAULT NULL
) RETURNS TEXT AS $$
DECLARE
    matched_category TEXT;
    search_text TEXT;
BEGIN
    -- Combine description and vendor for search
    search_text := LOWER(COALESCE(description, '') || ' ' || COALESCE(vendor, ''));
    
    -- Try to match against category keywords
    SELECT name INTO matched_category
    FROM public.accounting_categories
    WHERE keywords && string_to_array(search_text, ' ')
    ORDER BY array_length(keywords & string_to_array(search_text, ' '), 1) DESC
    LIMIT 1;
    
    -- Return matched category or default to 'Uncategorized'
    RETURN COALESCE(matched_category, 'Uncategorized');
END;
$$ LANGUAGE plpgsql; 