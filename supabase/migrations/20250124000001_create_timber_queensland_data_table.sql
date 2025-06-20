-- Create Timber Queensland technical data sheets table
CREATE TABLE IF NOT EXISTS timber_queensland_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    data_code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    timber_type VARCHAR(100),
    grade VARCHAR(50),
    dimensions VARCHAR(100),
    properties JSONB,
    specifications TEXT,
    notes TEXT,
    keywords TEXT[],
    external_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_timber_queensland_data_code ON timber_queensland_data(data_code);
CREATE INDEX IF NOT EXISTS idx_timber_queensland_category ON timber_queensland_data(category);
CREATE INDEX IF NOT EXISTS idx_timber_queensland_keywords ON timber_queensland_data USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_timber_queensland_search ON timber_queensland_data USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(specifications, '') || ' ' || COALESCE(notes, '')));
CREATE INDEX IF NOT EXISTS idx_timber_queensland_properties ON timber_queensland_data USING GIN(properties);

-- Create RLS policies
ALTER TABLE timber_queensland_data ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users with Timber Queensland voice search feature
CREATE POLICY "Allow read access to Timber Queensland data for authorized users" ON timber_queensland_data
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_subscriptions us
            JOIN subscription_features sf ON us.subscription_tier = sf.subscription_tier
            WHERE us.user_id = auth.uid()
            AND sf.feature_key = 'timber_queensland_voice_search'
            AND sf.enabled = true
            AND us.is_active = true
        )
    );

-- Create function to search Timber Queensland data
CREATE OR REPLACE FUNCTION search_timber_queensland_data(search_query TEXT)
RETURNS TABLE (
    id UUID,
    data_code VARCHAR(50),
    title VARCHAR(255),
    description TEXT,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    timber_type VARCHAR(100),
    grade VARCHAR(50),
    dimensions VARCHAR(100),
    properties JSONB,
    specifications TEXT,
    notes TEXT,
    keywords TEXT[],
    external_url VARCHAR(500),
    relevance_score FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tqd.id,
        tqd.data_code,
        tqd.title,
        tqd.description,
        tqd.category,
        tqd.subcategory,
        tqd.timber_type,
        tqd.grade,
        tqd.dimensions,
        tqd.properties,
        tqd.specifications,
        tqd.notes,
        tqd.keywords,
        tqd.external_url,
        ts_rank(
            to_tsvector('english', tqd.title || ' ' || COALESCE(tqd.description, '') || ' ' || COALESCE(tqd.specifications, '') || ' ' || COALESCE(tqd.notes, '')),
            plainto_tsquery('english', search_query)
        ) as relevance_score
    FROM timber_queensland_data tqd
    WHERE tqd.is_active = true
    AND (
        to_tsvector('english', tqd.title || ' ' || COALESCE(tqd.description, '') || ' ' || COALESCE(tqd.specifications, '') || ' ' || COALESCE(tqd.notes, '')) @@ plainto_tsquery('english', search_query)
        OR tqd.data_code ILIKE '%' || search_query || '%'
        OR tqd.title ILIKE '%' || search_query || '%'
        OR tqd.category ILIKE '%' || search_query || '%'
        OR tqd.subcategory ILIKE '%' || search_query || '%'
        OR tqd.timber_type ILIKE '%' || search_query || '%'
        OR tqd.grade ILIKE '%' || search_query || '%'
        OR tqd.dimensions ILIKE '%' || search_query || '%'
        OR tqd.keywords && string_to_array(lower(search_query), ' ')
    )
    ORDER BY relevance_score DESC, tqd.data_code ASC
    LIMIT 50;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample Timber Queensland technical data
INSERT INTO timber_queensland_data (data_code, title, description, category, subcategory, timber_type, grade, dimensions, properties, specifications, keywords, external_url) VALUES
('TQ-001', 'MGP10 Structural Pine', 'Machine Graded Pine structural timber grade MGP10', 'Structural Timber', 'Pine', 'Radiata Pine', 'MGP10', '140x45mm', '{"bending_strength": 10, "tension_strength": 6.5, "compression_strength": 8.5, "modulus_of_elasticity": 9000}', 'Structural grade pine suitable for framing and general construction', ARRAY['mgp10', 'pine', 'structural', 'framing'], 'https://www.timberqueensland.com.au/mgp10-specifications'),
('TQ-002', 'MGP12 Structural Pine', 'Machine Graded Pine structural timber grade MGP12', 'Structural Timber', 'Pine', 'Radiata Pine', 'MGP12', '140x45mm', '{"bending_strength": 12, "tension_strength": 7.5, "compression_strength": 9.5, "modulus_of_elasticity": 10000}', 'Higher strength structural grade pine for demanding applications', ARRAY['mgp12', 'pine', 'structural', 'high-strength'], 'https://www.timberqueensland.com.au/mgp12-specifications'),
('TQ-003', 'F7 Hardwood', 'F7 grade hardwood structural timber', 'Structural Timber', 'Hardwood', 'Mixed Hardwood', 'F7', '140x45mm', '{"bending_strength": 14, "tension_strength": 8.5, "compression_strength": 12, "modulus_of_elasticity": 12000}', 'F7 grade hardwood for structural applications', ARRAY['f7', 'hardwood', 'structural'], 'https://www.timberqueensland.com.au/f7-hardwood-specifications'),
('TQ-004', 'F8 Hardwood', 'F8 grade hardwood structural timber', 'Structural Timber', 'Hardwood', 'Mixed Hardwood', 'F8', '140x45mm', '{"bending_strength": 16, "tension_strength": 10, "compression_strength": 14, "modulus_of_elasticity": 14000}', 'F8 grade hardwood for high-strength structural applications', ARRAY['f8', 'hardwood', 'structural', 'high-strength'], 'https://www.timberqueensland.com.au/f8-hardwood-specifications'),
('TQ-005', 'Treated Pine H3', 'H3 treated pine for above ground applications', 'Treated Timber', 'Pine', 'Radiata Pine', 'H3', '140x45mm', '{"treatment_level": "H3", "chemical": "Copper Chrome Arsenate", "above_ground": true}', 'H3 treated pine suitable for above ground applications', ARRAY['h3', 'treated', 'pine', 'above-ground'], 'https://www.timberqueensland.com.au/h3-treated-pine'),
('TQ-006', 'Treated Pine H4', 'H4 treated pine for in-ground applications', 'Treated Timber', 'Pine', 'Radiata Pine', 'H4', '140x45mm', '{"treatment_level": "H4", "chemical": "Copper Chrome Arsenate", "in_ground": true}', 'H4 treated pine suitable for in-ground applications', ARRAY['h4', 'treated', 'pine', 'in-ground'], 'https://www.timberqueensland.com.au/h4-treated-pine'),
('TQ-007', 'Spotted Gum Decking', 'Spotted Gum decking timber', 'Decking', 'Hardwood', 'Spotted Gum', 'Select Grade', '140x19mm', '{"density": 1010, "janka_hardness": 11, "durability_class": "Class 1"}', 'Premium spotted gum decking with excellent durability', ARRAY['spotted-gum', 'decking', 'hardwood', 'premium'], 'https://www.timberqueensland.com.au/spotted-gum-decking'),
('TQ-008', 'Blackbutt Decking', 'Blackbutt decking timber', 'Decking', 'Hardwood', 'Blackbutt', 'Select Grade', '140x19mm', '{"density": 900, "janka_hardness": 9.1, "durability_class": "Class 1"}', 'Classic blackbutt decking with natural appeal', ARRAY['blackbutt', 'decking', 'hardwood'], 'https://www.timberqueensland.com.au/blackbutt-decking'),
('TQ-009', 'Merbau Decking', 'Merbau decking timber', 'Decking', 'Hardwood', 'Merbau', 'Select Grade', '140x19mm', '{"density": 840, "janka_hardness": 7.8, "durability_class": "Class 1"}', 'Merbau decking with rich red-brown color', ARRAY['merbau', 'decking', 'hardwood', 'red-brown'], 'https://www.timberqueensland.com.au/merbau-decking'),
('TQ-010', 'Treated Pine Decking', 'H3 treated pine decking', 'Decking', 'Pine', 'Radiata Pine', 'H3', '140x19mm', '{"treatment_level": "H3", "chemical": "Copper Chrome Arsenate", "above_ground": true}', 'H3 treated pine decking for above ground use', ARRAY['treated-pine', 'decking', 'h3'], 'https://www.timberqueensland.com.au/treated-pine-decking'),
('TQ-011', 'Plywood Structural', 'Structural plywood for construction', 'Plywood', 'Structural', 'Mixed Species', 'F8', '2400x1200x12mm', '{"bending_strength": 16, "modulus_of_elasticity": 14000, "layers": 7}', 'Structural plywood for formwork and construction', ARRAY['plywood', 'structural', 'formwork'], 'https://www.timberqueensland.com.au/structural-plywood'),
('TQ-012', 'Plywood Marine', 'Marine grade plywood', 'Plywood', 'Marine', 'Mixed Species', 'Marine', '2400x1200x12mm', '{"water_resistance": "Marine", "glue_type": "Phenolic", "layers": 7}', 'Marine grade plywood for water-resistant applications', ARRAY['plywood', 'marine', 'water-resistant'], 'https://www.timberqueensland.com.au/marine-plywood'),
('TQ-013', 'MDF Standard', 'Standard Medium Density Fibreboard', 'Panel Products', 'MDF', 'Mixed Wood Fibres', 'Standard', '2400x1200x16mm', '{"density": 750, "moisture_resistance": "Standard"}', 'Standard MDF for interior applications', ARRAY['mdf', 'standard', 'interior'], 'https://www.timberqueensland.com.au/standard-mdf'),
('TQ-014', 'MDF Moisture Resistant', 'Moisture resistant MDF', 'Panel Products', 'MDF', 'Mixed Wood Fibres', 'Moisture Resistant', '2400x1200x16mm', '{"density": 750, "moisture_resistance": "Moisture Resistant"}', 'Moisture resistant MDF for wet areas', ARRAY['mdf', 'moisture-resistant', 'wet-areas'], 'https://www.timberqueensland.com.au/moisture-resistant-mdf'),
('TQ-015', 'Particleboard', 'Standard particleboard', 'Panel Products', 'Particleboard', 'Mixed Wood Particles', 'Standard', '2400x1200x16mm', '{"density": 650, "moisture_resistance": "Standard"}', 'Standard particleboard for general use', ARRAY['particleboard', 'standard', 'general'], 'https://www.timberqueensland.com.au/particleboard'),
('TQ-016', 'OSB Structural', 'Oriented Strand Board structural panel', 'Panel Products', 'OSB', 'Mixed Wood Strands', 'Structural', '2400x1200x18mm', '{"bending_strength": 12, "modulus_of_elasticity": 10000}', 'Structural OSB for sheathing and flooring', ARRAY['osb', 'structural', 'sheathing', 'flooring'], 'https://www.timberqueensland.com.au/structural-osb'),
('TQ-017', 'LVL Beam', 'Laminated Veneer Lumber beam', 'Engineered Timber', 'LVL', 'Mixed Veneers', 'F8', '240x45mm', '{"bending_strength": 16, "modulus_of_elasticity": 14000, "length": "up to 12m"}', 'LVL beam for long span applications', ARRAY['lvl', 'beam', 'long-span', 'engineered'], 'https://www.timberqueensland.com.au/lvl-beams'),
('TQ-018', 'Glulam Beam', 'Glued Laminated Timber beam', 'Engineered Timber', 'Glulam', 'Mixed Laminations', 'F8', '240x90mm', '{"bending_strength": 16, "modulus_of_elasticity": 14000, "length": "up to 20m"}', 'Glulam beam for large span applications', ARRAY['glulam', 'beam', 'large-span', 'engineered'], 'https://www.timberqueensland.com.au/glulam-beams'),
('TQ-019', 'I-Joist', 'Timber I-joist for floor and roof systems', 'Engineered Timber', 'I-Joist', 'Mixed Components', 'F8', '240mm depth', '{"bending_strength": 16, "modulus_of_elasticity": 14000, "span": "up to 6m"}', 'I-joist for efficient floor and roof systems', ARRAY['i-joist', 'floor', 'roof', 'engineered'], 'https://www.timberqueensland.com.au/i-joists'),
('TQ-020', 'CLT Panel', 'Cross Laminated Timber panel', 'Engineered Timber', 'CLT', 'Mixed Laminations', 'F8', '2400x1200x90mm', '{"bending_strength": 16, "modulus_of_elasticity": 14000, "layers": 5}', 'CLT panel for wall and floor systems', ARRAY['clt', 'panel', 'wall', 'floor', 'engineered'], 'https://www.timberqueensland.com.au/clt-panels');

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_timber_queensland_data_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_timber_queensland_data_updated_at
    BEFORE UPDATE ON timber_queensland_data
    FOR EACH ROW
    EXECUTE FUNCTION update_timber_queensland_data_updated_at(); 