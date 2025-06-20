-- Create NCC codes table for storing National Construction Code data
CREATE TABLE IF NOT EXISTS ncc_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    section VARCHAR(50),
    volume VARCHAR(20),
    part VARCHAR(20),
    clause VARCHAR(20),
    notes TEXT,
    keywords TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_ncc_codes_code ON ncc_codes(code);
CREATE INDEX IF NOT EXISTS idx_ncc_codes_category ON ncc_codes(category);
CREATE INDEX IF NOT EXISTS idx_ncc_codes_keywords ON ncc_codes USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_ncc_codes_search ON ncc_codes USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(notes, '')));

-- Create RLS policies
ALTER TABLE ncc_codes ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users with NCC voice search feature
CREATE POLICY "Allow read access to NCC codes for authorized users" ON ncc_codes
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_subscriptions us
            JOIN subscription_features sf ON us.subscription_tier = sf.tier
            WHERE us.user_id = auth.uid()
            AND sf.feature_key = 'ncc_voice_search'
            AND sf.feature_value::text = 'true'
            AND us.is_active = true
        )
    );

-- Create function to search NCC codes
CREATE OR REPLACE FUNCTION search_ncc_codes(search_query TEXT)
RETURNS TABLE (
    id UUID,
    code VARCHAR(50),
    title VARCHAR(255),
    description TEXT,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    section VARCHAR(50),
    volume VARCHAR(20),
    part VARCHAR(20),
    clause VARCHAR(20),
    notes TEXT,
    keywords TEXT[],
    relevance_score FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        nc.id,
        nc.code,
        nc.title,
        nc.description,
        nc.category,
        nc.subcategory,
        nc.section,
        nc.volume,
        nc.part,
        nc.clause,
        nc.notes,
        nc.keywords,
        ts_rank(
            to_tsvector('english', nc.title || ' ' || COALESCE(nc.description, '') || ' ' || COALESCE(nc.notes, '')),
            plainto_tsquery('english', search_query)
        ) as relevance_score
    FROM ncc_codes nc
    WHERE nc.is_active = true
    AND (
        to_tsvector('english', nc.title || ' ' || COALESCE(nc.description, '') || ' ' || COALESCE(nc.notes, '')) @@ plainto_tsquery('english', search_query)
        OR nc.code ILIKE '%' || search_query || '%'
        OR nc.title ILIKE '%' || search_query || '%'
        OR nc.category ILIKE '%' || search_query || '%'
        OR nc.subcategory ILIKE '%' || search_query || '%'
        OR nc.keywords && string_to_array(lower(search_query), ' ')
    )
    ORDER BY relevance_score DESC, nc.code ASC
    LIMIT 50;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert some sample NCC codes for testing
INSERT INTO ncc_codes (code, title, description, category, subcategory, section, volume, part, clause, keywords) VALUES
('A1.1', 'Interpretation', 'Provisions for interpreting the NCC, including definitions, references, and acceptability of design solutions.', 'General', 'Interpretation', 'A', '1', 'A', '1.1', ARRAY['interpretation', 'definitions', 'references', 'design solutions']),
('A1.2', 'Compliance with the NCC', 'Requirements for demonstrating compliance with the NCC.', 'General', 'Compliance', 'A', '1', 'A', '1.2', ARRAY['compliance', 'requirements', 'demonstrating']),
('B1.1', 'Structure', 'General structural requirements for buildings and structures.', 'Structure', 'General', 'B', '1', 'B', '1.1', ARRAY['structure', 'structural', 'buildings', 'requirements']),
('B1.2', 'Structural reliability', 'Requirements for structural reliability and safety.', 'Structure', 'Reliability', 'B', '1', 'B', '1.2', ARRAY['reliability', 'safety', 'structural safety']),
('C1.1', 'Fire resistance', 'Fire resistance requirements for building elements.', 'Fire', 'Resistance', 'C', '1', 'C', '1.1', ARRAY['fire', 'resistance', 'building elements']),
('C1.2', 'Fire hazard properties', 'Fire hazard properties of building materials and elements.', 'Fire', 'Hazard Properties', 'C', '1', 'C', '1.2', ARRAY['fire hazard', 'materials', 'properties']),
('D1.1', 'Access and egress', 'Requirements for access and egress from buildings.', 'Access', 'General', 'D', '1', 'D', '1.1', ARRAY['access', 'egress', 'buildings', 'entry']),
('D1.2', 'Access for people with disabilities', 'Access requirements for people with disabilities.', 'Access', 'Disability', 'D', '1', 'D', '1.2', ARRAY['disability', 'accessibility', 'wheelchair']),
('E1.1', 'Sound transmission', 'Sound transmission and insulation requirements.', 'Services and Equipment', 'Sound', 'E', '1', 'E', '1.1', ARRAY['sound', 'transmission', 'insulation', 'acoustic']),
('E1.2', 'Sound absorption', 'Sound absorption requirements for building elements.', 'Services and Equipment', 'Sound', 'E', '1', 'E', '1.2', ARRAY['sound', 'absorption', 'acoustic']),
('F1.1', 'Natural ventilation', 'Natural ventilation requirements for habitable rooms.', 'Health and Amenity', 'Ventilation', 'F', '1', 'F', '1.1', ARRAY['ventilation', 'natural', 'habitable', 'rooms']),
('F1.2', 'Mechanical ventilation', 'Mechanical ventilation and air conditioning requirements.', 'Health and Amenity', 'Ventilation', 'F', '1', 'F', '1.2', ARRAY['mechanical', 'ventilation', 'air conditioning']),
('G1.1', 'Sanitary facilities', 'Requirements for sanitary facilities in buildings.', 'Health and Amenity', 'Sanitary', 'G', '1', 'G', '1.1', ARRAY['sanitary', 'facilities', 'bathrooms', 'toilets']),
('G1.2', 'Laundry facilities', 'Requirements for laundry facilities in buildings.', 'Health and Amenity', 'Laundry', 'G', '1', 'G', '1.2', ARRAY['laundry', 'facilities', 'washing']),
('H1.1', 'Energy efficiency', 'Energy efficiency requirements for buildings.', 'Energy Efficiency', 'General', 'H', '1', 'H', '1.1', ARRAY['energy', 'efficiency', 'sustainability']),
('H1.2', 'Building fabric', 'Energy efficiency requirements for building fabric.', 'Energy Efficiency', 'Fabric', 'H', '1', 'H', '1.2', ARRAY['fabric', 'insulation', 'energy']),
('J1.1', 'Stormwater drainage', 'Stormwater drainage requirements for buildings.', 'Ancillary Provisions', 'Drainage', 'J', '1', 'J', '1.1', ARRAY['stormwater', 'drainage', 'water']),
('J1.2', 'Site drainage', 'Site drainage requirements for building sites.', 'Ancillary Provisions', 'Drainage', 'J', '1', 'J', '1.2', ARRAY['site', 'drainage', 'landscaping']),
('K1.1', 'Glazing', 'Glazing requirements for buildings.', 'Ancillary Provisions', 'Glazing', 'K', '1', 'K', '1.1', ARRAY['glazing', 'glass', 'windows', 'doors']),
('K1.2', 'Glazing in buildings', 'Specific glazing requirements for different building types.', 'Ancillary Provisions', 'Glazing', 'K', '1', 'K', '1.2', ARRAY['glazing', 'buildings', 'types']);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_ncc_codes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_ncc_codes_updated_at
    BEFORE UPDATE ON ncc_codes
    FOR EACH ROW
    EXECUTE FUNCTION update_ncc_codes_updated_at(); 