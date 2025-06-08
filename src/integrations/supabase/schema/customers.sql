-- Customers table schema
CREATE TABLE IF NOT EXISTS "customers" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" UUID REFERENCES auth.users(id),
  "name" VARCHAR NOT NULL,
  "email" VARCHAR,
  "phone" VARCHAR,
  "address" VARCHAR,
  "city" VARCHAR,
  "state" VARCHAR,
  "zipcode" VARCHAR,
  "status" VARCHAR DEFAULT 'active',
  "business_name" VARCHAR,
  "abn" VARCHAR,
  "acn" VARCHAR,
  "state_licence_state" VARCHAR,
  "state_licence_number" VARCHAR,
  "national_certifications" JSON,
  "certification_details" JSON,
  "customer_code" VARCHAR,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS customers_user_id_idx ON customers(user_id);
CREATE INDEX IF NOT EXISTS customers_name_idx ON customers(name);
CREATE INDEX IF NOT EXISTS customers_email_idx ON customers(email);

-- RLS Policies
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to select only their own customers
CREATE POLICY IF NOT EXISTS "users_can_select_own_customers" 
ON customers FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Policy to allow users to insert their own customers
CREATE POLICY IF NOT EXISTS "users_can_insert_own_customers" 
ON customers FOR INSERT 
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Policy to allow users to update their own customers
CREATE POLICY IF NOT EXISTS "users_can_update_own_customers" 
ON customers FOR UPDATE 
TO authenticated
USING (user_id = auth.uid());

-- Policy to allow users to delete their own customers
CREATE POLICY IF NOT EXISTS "users_can_delete_own_customers" 
ON customers FOR DELETE 
TO authenticated
USING (user_id = auth.uid()); 