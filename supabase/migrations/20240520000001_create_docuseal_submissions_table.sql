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