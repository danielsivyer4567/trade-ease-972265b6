-- Create invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number TEXT NOT NULL UNIQUE,
    customer_id UUID REFERENCES public.customers(id),
    job_id UUID REFERENCES public.jobs(id),
    quote_id UUID REFERENCES public.quotes(id),
    issue_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('draft', 'sent', 'paid', 'overdue')),
    items JSONB NOT NULL DEFAULT '[]'::JSONB,
    notes TEXT,
    attachments JSONB DEFAULT '[]'::JSONB,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON public.invoices
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create RLS policies
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own invoices"
    ON public.invoices FOR SELECT
    USING (auth.uid() IN (
        SELECT user_id FROM public.customers WHERE id = customer_id
        UNION
        SELECT user_id FROM public.staff WHERE role IN ('admin', 'manager', 'accountant')
    ));

CREATE POLICY "Staff can create invoices"
    ON public.invoices FOR INSERT
    WITH CHECK (auth.uid() IN (
        SELECT user_id FROM public.staff WHERE role IN ('admin', 'manager', 'accountant')
    ));

CREATE POLICY "Staff can update invoices"
    ON public.invoices FOR UPDATE
    USING (auth.uid() IN (
        SELECT user_id FROM public.staff WHERE role IN ('admin', 'manager', 'accountant')
    ));

CREATE POLICY "Staff can delete invoices"
    ON public.invoices FOR DELETE
    USING (auth.uid() IN (
        SELECT user_id FROM public.staff WHERE role IN ('admin', 'manager', 'accountant')
    )); 