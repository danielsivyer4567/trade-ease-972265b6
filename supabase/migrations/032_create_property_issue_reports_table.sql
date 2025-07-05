-- Create property_issue_reports table for storing user-submitted issue reports
CREATE TABLE IF NOT EXISTS property_issue_reports (
    id SERIAL PRIMARY KEY,
    address TEXT NOT NULL,
    issue_description TEXT NOT NULL,
    image_url TEXT,
    measurements TEXT, -- JSON string of measurements array
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'investigating', 'resolved', 'dismissed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_property_issue_reports_status ON property_issue_reports(status);
CREATE INDEX IF NOT EXISTS idx_property_issue_reports_created_at ON property_issue_reports(created_at);
CREATE INDEX IF NOT EXISTS idx_property_issue_reports_address ON property_issue_reports(address);

-- Add RLS (Row Level Security) policies
ALTER TABLE property_issue_reports ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert issue reports (for anonymous users to report issues)
CREATE POLICY "Anyone can insert issue reports" ON property_issue_reports
    FOR INSERT WITH CHECK (true);

-- Only authenticated users can view issue reports (for admin/developer access)
CREATE POLICY "Authenticated users can view issue reports" ON property_issue_reports
    FOR SELECT USING (auth.role() = 'authenticated');

-- Only authenticated users can update issue reports (for admin/developer access)
CREATE POLICY "Authenticated users can update issue reports" ON property_issue_reports
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_property_issue_reports_updated_at 
    BEFORE UPDATE ON property_issue_reports 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 