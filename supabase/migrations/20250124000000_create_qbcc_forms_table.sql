-- Create QBCC forms table for storing Queensland Building and Construction Commission forms data
CREATE TABLE IF NOT EXISTS qbcc_forms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    form_code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    form_type VARCHAR(50),
    version VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    notes TEXT,
    keywords TEXT[],
    external_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_qbcc_forms_form_code ON qbcc_forms(form_code);
CREATE INDEX IF NOT EXISTS idx_qbcc_forms_category ON qbcc_forms(category);
CREATE INDEX IF NOT EXISTS idx_qbcc_forms_keywords ON qbcc_forms USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_qbcc_forms_search ON qbcc_forms USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(notes, '')));

-- Create RLS policies
ALTER TABLE qbcc_forms ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users with QBCC voice search feature
CREATE POLICY "Allow read access to QBCC forms for authorized users" ON qbcc_forms
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_subscriptions us
            JOIN subscription_features sf ON us.subscription_tier = sf.subscription_tier
            WHERE us.user_id = auth.uid()
            AND sf.feature_key = 'qbcc_voice_search'
            AND sf.enabled = true
            AND us.is_active = true
        )
    );

-- Create function to search QBCC forms
CREATE OR REPLACE FUNCTION search_qbcc_forms(search_query TEXT)
RETURNS TABLE (
    id UUID,
    form_code VARCHAR(50),
    title VARCHAR(255),
    description TEXT,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    form_type VARCHAR(50),
    version VARCHAR(20),
    status VARCHAR(20),
    notes TEXT,
    keywords TEXT[],
    external_url VARCHAR(500),
    relevance_score FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        qf.id,
        qf.form_code,
        qf.title,
        qf.description,
        qf.category,
        qf.subcategory,
        qf.form_type,
        qf.version,
        qf.status,
        qf.notes,
        qf.keywords,
        qf.external_url,
        ts_rank(
            to_tsvector('english', qf.title || ' ' || COALESCE(qf.description, '') || ' ' || COALESCE(qf.notes, '')),
            plainto_tsquery('english', search_query)
        ) as relevance_score
    FROM qbcc_forms qf
    WHERE qf.is_active = true
    AND (
        to_tsvector('english', qf.title || ' ' || COALESCE(qf.description, '') || ' ' || COALESCE(qf.notes, '')) @@ plainto_tsquery('english', search_query)
        OR qf.form_code ILIKE '%' || search_query || '%'
        OR qf.title ILIKE '%' || search_query || '%'
        OR qf.category ILIKE '%' || search_query || '%'
        OR qf.subcategory ILIKE '%' || search_query || '%'
        OR qf.keywords && string_to_array(lower(search_query), ' ')
    )
    ORDER BY relevance_score DESC, qf.form_code ASC
    LIMIT 50;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample QBCC forms data
INSERT INTO qbcc_forms (form_code, title, description, category, subcategory, form_type, version, keywords, external_url) VALUES
('QBCC-001', 'Application for a contractor licence', 'Application form for individuals seeking a contractor licence in Queensland', 'Licensing', 'Contractor', 'Application', '2024.1', ARRAY['contractor', 'licence', 'application', 'individual'], 'https://www.qbcc.qld.gov.au/contractor-licence-application'),
('QBCC-002', 'Application for a nominee supervisor', 'Application form for nominee supervisor licence', 'Licensing', 'Nominee', 'Application', '2024.1', ARRAY['nominee', 'supervisor', 'licence', 'application'], 'https://www.qbcc.qld.gov.au/nominee-supervisor-application'),
('QBCC-003', 'Application for a company licence', 'Application form for companies seeking a contractor licence', 'Licensing', 'Company', 'Application', '2024.1', ARRAY['company', 'licence', 'application', 'business'], 'https://www.qbcc.qld.gov.au/company-licence-application'),
('QBCC-004', 'Application for a partnership licence', 'Application form for partnerships seeking a contractor licence', 'Licensing', 'Partnership', 'Application', '2024.1', ARRAY['partnership', 'licence', 'application'], 'https://www.qbcc.qld.gov.au/partnership-licence-application'),
('QBCC-005', 'Application for a trust licence', 'Application form for trusts seeking a contractor licence', 'Licensing', 'Trust', 'Application', '2024.1', ARRAY['trust', 'licence', 'application'], 'https://www.qbcc.qld.gov.au/trust-licence-application'),
('QBCC-101', 'Notification of residential building work', 'Form to notify QBCC of residential building work', 'Notifications', 'Residential', 'Notification', '2024.1', ARRAY['residential', 'building', 'notification', 'work'], 'https://www.qbcc.qld.gov.au/residential-notification'),
('QBCC-102', 'Notification of commercial building work', 'Form to notify QBCC of commercial building work', 'Notifications', 'Commercial', 'Notification', '2024.1', ARRAY['commercial', 'building', 'notification', 'work'], 'https://www.qbcc.qld.gov.au/commercial-notification'),
('QBCC-201', 'Application for building approval', 'Application form for building approval', 'Building', 'Approval', 'Application', '2024.1', ARRAY['building', 'approval', 'application'], 'https://www.qbcc.qld.gov.au/building-approval'),
('QBCC-202', 'Application for development permit', 'Application form for development permit', 'Building', 'Development', 'Application', '2024.1', ARRAY['development', 'permit', 'application'], 'https://www.qbcc.qld.gov.au/development-permit'),
('QBCC-301', 'Complaint form', 'Form to submit a complaint to QBCC', 'Complaints', 'General', 'Complaint', '2024.1', ARRAY['complaint', 'submit', 'report'], 'https://www.qbcc.qld.gov.au/complaint-form'),
('QBCC-302', 'Dispute resolution application', 'Application for dispute resolution services', 'Complaints', 'Dispute', 'Application', '2024.1', ARRAY['dispute', 'resolution', 'application'], 'https://www.qbcc.qld.gov.au/dispute-resolution'),
('QBCC-401', 'Insurance certificate application', 'Application for insurance certificate', 'Insurance', 'Certificate', 'Application', '2024.1', ARRAY['insurance', 'certificate', 'application'], 'https://www.qbcc.qld.gov.au/insurance-certificate'),
('QBCC-402', 'Insurance claim form', 'Form to submit an insurance claim', 'Insurance', 'Claims', 'Claim', '2024.1', ARRAY['insurance', 'claim', 'submit'], 'https://www.qbcc.qld.gov.au/insurance-claim'),
('QBCC-501', 'Renewal application', 'Application to renew a licence', 'Licensing', 'Renewal', 'Application', '2024.1', ARRAY['renewal', 'licence', 'application'], 'https://www.qbcc.qld.gov.au/licence-renewal'),
('QBCC-502', 'Variation application', 'Application to vary licence conditions', 'Licensing', 'Variation', 'Application', '2024.1', ARRAY['variation', 'licence', 'conditions'], 'https://www.qbcc.qld.gov.au/licence-variation'),
('QBCC-601', 'Financial information form', 'Form to provide financial information', 'Financial', 'Information', 'Declaration', '2024.1', ARRAY['financial', 'information', 'declaration'], 'https://www.qbcc.qld.gov.au/financial-information'),
('QBCC-602', 'Audit report form', 'Form to submit audit reports', 'Financial', 'Audit', 'Report', '2024.1', ARRAY['audit', 'report', 'financial'], 'https://www.qbcc.qld.gov.au/audit-report'),
('QBCC-701', 'Training course approval', 'Application for training course approval', 'Training', 'Course', 'Application', '2024.1', ARRAY['training', 'course', 'approval'], 'https://www.qbcc.qld.gov.au/training-approval'),
('QBCC-702', 'Assessment application', 'Application for competency assessment', 'Training', 'Assessment', 'Application', '2024.1', ARRAY['assessment', 'competency', 'application'], 'https://www.qbcc.qld.gov.au/competency-assessment');

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_qbcc_forms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_qbcc_forms_updated_at
    BEFORE UPDATE ON qbcc_forms
    FOR EACH ROW
    EXECUTE FUNCTION update_qbcc_forms_updated_at(); 