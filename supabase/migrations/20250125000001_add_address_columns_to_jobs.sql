-- Add address columns to jobs table
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS zip_code TEXT;

-- Create index for address searches
CREATE INDEX IF NOT EXISTS idx_jobs_address ON jobs(address);
CREATE INDEX IF NOT EXISTS idx_jobs_city ON jobs(city);

-- Update any existing jobs with address from customer_addresses if available
UPDATE jobs j
SET 
  address = ca.address,
  city = ca.city,
  state = ca.state,
  zip_code = ca.zipcode
FROM customer_addresses ca
INNER JOIN customers c ON ca.customer_id = c.id
WHERE j.customer = c.name
  AND ca.is_default = true
  AND j.address IS NULL; 