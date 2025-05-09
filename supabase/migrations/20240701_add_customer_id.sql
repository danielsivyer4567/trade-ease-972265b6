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