-- Enable RLS on banking_related table
ALTER TABLE public.banking_related ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can manage banking records"
    ON public.banking_related
    USING (auth.uid() IN (
        SELECT user_id FROM public.staff 
        WHERE role IN ('admin', 'manager', 'accountant')
    ));

-- Enable RLS on statistics_history table
ALTER TABLE public.statistics_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view statistics"
    ON public.statistics_history FOR SELECT
    USING (auth.uid() IN (
        SELECT user_id FROM public.staff
    ));

CREATE POLICY "Staff can manage statistics"
    ON public.statistics_history
    USING (auth.uid() IN (
        SELECT user_id FROM public.staff 
        WHERE role IN ('admin', 'manager')
    ));

-- Enable RLS on todos table
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their assigned todos"
    ON public.todos FOR SELECT
    USING (
        auth.uid() = assigned_to OR
        auth.uid() = created_by OR
        auth.uid() IN (
            SELECT user_id FROM public.staff 
            WHERE role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Staff can create todos"
    ON public.todos FOR INSERT
    WITH CHECK (auth.uid() IN (
        SELECT user_id FROM public.staff
    ));

CREATE POLICY "Users can update their assigned todos"
    ON public.todos FOR UPDATE
    USING (
        auth.uid() = assigned_to OR
        auth.uid() = created_by OR
        auth.uid() IN (
            SELECT user_id FROM public.staff 
            WHERE role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Staff can delete todos"
    ON public.todos FOR DELETE
    USING (
        auth.uid() = created_by OR
        auth.uid() IN (
            SELECT user_id FROM public.staff 
            WHERE role IN ('admin', 'manager')
        )
    ); 