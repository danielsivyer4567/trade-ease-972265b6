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