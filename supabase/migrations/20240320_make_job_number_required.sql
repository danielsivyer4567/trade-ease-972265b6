-- Make job_number required and add a unique constraint
ALTER TABLE jobs
ALTER COLUMN job_number SET NOT NULL,
ADD CONSTRAINT jobs_job_number_unique UNIQUE (job_number);

-- Add an index for faster lookups
CREATE INDEX idx_jobs_job_number ON jobs(job_number); 