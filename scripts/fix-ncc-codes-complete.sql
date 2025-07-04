-- Complete fix for NCC codes table and data

-- First, create the table if it doesn't exist
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

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_ncc_codes_code ON ncc_codes(code);
CREATE INDEX IF NOT EXISTS idx_ncc_codes_category ON ncc_codes(category);
CREATE INDEX IF NOT EXISTS idx_ncc_codes_keywords ON ncc_codes USING GIN(keywords);

-- Enable RLS
ALTER TABLE ncc_codes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate
DROP POLICY IF EXISTS "Allow read access to NCC codes for authorized users" ON ncc_codes;
DROP POLICY IF EXISTS "Allow read access to all authenticated users" ON ncc_codes;

-- Create a simple policy that allows all authenticated users to read
CREATE POLICY "Allow read access to all authenticated users" ON ncc_codes
    FOR SELECT
    TO authenticated
    USING (true);

-- Create the search function
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
        1.0 as relevance_score  -- Simplified relevance score
    FROM ncc_codes nc
    WHERE nc.is_active = true
    AND (
        nc.code ILIKE '%' || search_query || '%'
        OR nc.title ILIKE '%' || search_query || '%'
        OR nc.category ILIKE '%' || search_query || '%'
        OR COALESCE(nc.description, '') ILIKE '%' || search_query || '%'
    )
    ORDER BY nc.code ASC
    LIMIT 50;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Clear existing data to avoid duplicates
DELETE FROM ncc_codes WHERE true;

-- Insert comprehensive NCC codes data
INSERT INTO ncc_codes (code, title, description, category, subcategory, section, volume, part, clause, keywords) VALUES
-- Section A - General Requirements
('A1.1', 'Interpretation', 'Provisions for interpreting the NCC, including definitions, references, and acceptability of design solutions.', 'General', 'Interpretation', 'A', '1', 'A', '1.1', ARRAY['interpretation', 'definitions', 'references', 'design solutions']),
('A1.2', 'Compliance with the NCC', 'Requirements for demonstrating compliance with the NCC.', 'General', 'Compliance', 'A', '1', 'A', '1.2', ARRAY['compliance', 'requirements', 'demonstrating']),
('A1.3', 'Application of the NCC', 'Application of the NCC to a particular building or structure.', 'General', 'Application', 'A', '1', 'A', '1.3', ARRAY['application', 'scope', 'building types']),
('A1.4', 'Referenced documents', 'Documents referenced in the NCC and their application.', 'General', 'References', 'A', '1', 'A', '1.4', ARRAY['references', 'standards', 'documents']),
('A1.5', 'Documentation of design and construction', 'Requirements for documentation of Performance Solutions.', 'General', 'Documentation', 'A', '1', 'A', '1.5', ARRAY['documentation', 'performance solutions', 'records']),

-- Section B - Structure
('B1.1', 'Structure', 'General structural requirements for buildings and structures.', 'Structure', 'General', 'B', '1', 'B', '1.1', ARRAY['structure', 'structural', 'buildings', 'requirements']),
('B1.2', 'Structural reliability', 'Requirements for structural reliability and safety.', 'Structure', 'Reliability', 'B', '1', 'B', '1.2', ARRAY['reliability', 'safety', 'structural safety']),
('B1.3', 'Loads on buildings', 'Requirements for loads on buildings including dead, live, wind and earthquake loads.', 'Structure', 'Loads', 'B', '1', 'B', '1.3', ARRAY['loads', 'dead load', 'live load', 'wind', 'earthquake']),
('B1.4', 'Determination of structural resistance', 'Methods for determining structural resistance of materials and forms of construction.', 'Structure', 'Resistance', 'B', '1', 'B', '1.4', ARRAY['resistance', 'capacity', 'strength']),

-- Section C - Fire Resistance
('C1.1', 'Fire resistance', 'Fire resistance requirements for building elements.', 'Fire', 'Resistance', 'C', '1', 'C', '1.1', ARRAY['fire', 'resistance', 'building elements']),
('C1.2', 'Fire hazard properties', 'Fire hazard properties of building materials and elements.', 'Fire', 'Hazard Properties', 'C', '1', 'C', '1.2', ARRAY['fire hazard', 'materials', 'properties']),
('C1.3', 'Buildings of multiple classification', 'Fire resistance requirements for buildings with multiple classifications.', 'Fire', 'Multiple Classification', 'C', '1', 'C', '1.3', ARRAY['fire', 'multiple', 'classification']),

-- Section D - Access and Egress
('D1.1', 'Access and egress', 'Requirements for access and egress from buildings.', 'Access', 'General', 'D', '1', 'D', '1.1', ARRAY['access', 'egress', 'buildings', 'entry']),
('D1.2', 'Access for people with disabilities', 'Access requirements for people with disabilities.', 'Access', 'Disability', 'D', '1', 'D', '1.2', ARRAY['disability', 'accessibility', 'wheelchair']),
('D1.3', 'Parts of buildings to be accessible', 'Requirements for which parts of buildings must be accessible.', 'Access', 'Accessibility', 'D', '1', 'D', '1.3', ARRAY['accessible', 'parts', 'disability access']),

-- Section E - Services and Equipment
('E1.1', 'Sound transmission', 'Sound transmission and insulation requirements.', 'Services and Equipment', 'Sound', 'E', '1', 'E', '1.1', ARRAY['sound', 'transmission', 'insulation', 'acoustic']),
('E1.2', 'Sound absorption', 'Sound absorption requirements for building elements.', 'Services and Equipment', 'Sound', 'E', '1', 'E', '1.2', ARRAY['sound', 'absorption', 'acoustic']),
('E1.3', 'Fire hydrants', 'Requirements for fire hydrants.', 'Services and Equipment', 'Fire Hydrants', 'E', '1', 'E', '1.3', ARRAY['hydrants', 'fire', 'water supply']),

-- Section F - Health and Amenity
('F1.1', 'Natural ventilation', 'Natural ventilation requirements for habitable rooms.', 'Health and Amenity', 'Ventilation', 'F', '1', 'F', '1.1', ARRAY['ventilation', 'natural', 'habitable', 'rooms']),
('F1.2', 'Mechanical ventilation', 'Mechanical ventilation and air conditioning requirements.', 'Health and Amenity', 'Ventilation', 'F', '1', 'F', '1.2', ARRAY['mechanical', 'ventilation', 'air conditioning']),
('F1.3', 'Room sizes', 'Minimum room sizes in Class 1 buildings.', 'Health and Amenity', 'Room Sizes', 'F', '1', 'F', '1.3', ARRAY['room', 'sizes', 'dimensions', 'minimum']),

-- Section G - Ancillary Provisions
('G1.1', 'Sanitary facilities', 'Requirements for sanitary facilities in buildings.', 'Ancillary Provisions', 'Sanitary', 'G', '1', 'G', '1.1', ARRAY['sanitary', 'facilities', 'bathrooms', 'toilets']),
('G1.2', 'Laundry facilities', 'Requirements for laundry facilities in buildings.', 'Ancillary Provisions', 'Laundry', 'G', '1', 'G', '1.2', ARRAY['laundry', 'facilities', 'washing']),

-- Section J - Energy Efficiency
('J1.1', 'Energy efficiency', 'Energy efficiency requirements for buildings.', 'Energy Efficiency', 'General', 'J', '1', 'J', '1.1', ARRAY['energy', 'efficiency', 'sustainability']),
('J1.2', 'Building fabric', 'Energy efficiency requirements for building fabric.', 'Energy Efficiency', 'Fabric', 'J', '1', 'J', '1.2', ARRAY['fabric', 'insulation', 'energy']);

-- Grant necessary permissions
GRANT SELECT ON ncc_codes TO authenticated;
GRANT EXECUTE ON FUNCTION search_ncc_codes(TEXT) TO authenticated;

-- Verify the data was inserted
SELECT COUNT(*) as total_codes FROM ncc_codes; 