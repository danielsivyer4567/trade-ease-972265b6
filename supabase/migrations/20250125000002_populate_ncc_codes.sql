-- Populate NCC codes table with comprehensive data
-- This adds more NCC codes across all sections

-- Clear existing sample data first (optional - remove if you want to keep existing)
-- DELETE FROM ncc_codes WHERE true;

-- Section A - General Requirements
INSERT INTO ncc_codes (code, title, description, category, subcategory, section, volume, part, clause, keywords) VALUES
('A1.3', 'Application of the NCC', 'Application of the NCC to a particular building or structure.', 'General', 'Application', 'A', '1', 'A', '1.3', ARRAY['application', 'scope', 'building types']),
('A1.4', 'Referenced documents', 'Documents referenced in the NCC and their application.', 'General', 'References', 'A', '1', 'A', '1.4', ARRAY['references', 'standards', 'documents']),
('A1.5', 'Documentation of design and construction', 'Requirements for documentation of Performance Solutions.', 'General', 'Documentation', 'A', '1', 'A', '1.5', ARRAY['documentation', 'performance solutions', 'records']),
('A1.6', 'Building classification', 'Classification of buildings and structures.', 'General', 'Classification', 'A', '1', 'A', '1.6', ARRAY['classification', 'building class', 'occupancy']),
('A1.7', 'United buildings', 'Requirements for buildings that are united.', 'General', 'United Buildings', 'A', '1', 'A', '1.7', ARRAY['united', 'connected', 'buildings']);

-- Section B - Structure
INSERT INTO ncc_codes (code, title, description, category, subcategory, section, volume, part, clause, keywords) VALUES
('B1.3', 'Loads on buildings', 'Requirements for loads on buildings including dead, live, wind and earthquake loads.', 'Structure', 'Loads', 'B', '1', 'B', '1.3', ARRAY['loads', 'dead load', 'live load', 'wind', 'earthquake']),
('B1.4', 'Determination of structural resistance', 'Methods for determining structural resistance of materials and forms of construction.', 'Structure', 'Resistance', 'B', '1', 'B', '1.4', ARRAY['resistance', 'capacity', 'strength']),
('B1.5', 'Structural software', 'Requirements for structural design software.', 'Structure', 'Software', 'B', '1', 'B', '1.5', ARRAY['software', 'computer', 'design', 'analysis']),
('B2.1', 'Earthwork', 'Requirements for earthwork including excavation and filling.', 'Structure', 'Earthwork', 'B', '1', 'B', '2.1', ARRAY['earthwork', 'excavation', 'filling', 'soil']),
('B2.2', 'Footings and slabs', 'Requirements for footings and slabs.', 'Structure', 'Footings', 'B', '1', 'B', '2.2', ARRAY['footings', 'slabs', 'foundations']);

-- Section C - Fire Resistance
INSERT INTO ncc_codes (code, title, description, category, subcategory, section, volume, part, clause, keywords) VALUES
('C1.3', 'Buildings of multiple classification', 'Fire resistance requirements for buildings with multiple classifications.', 'Fire', 'Multiple Classification', 'C', '1', 'C', '1.3', ARRAY['fire', 'multiple', 'classification']),
('C1.4', 'Mixed types of construction', 'Requirements for buildings with mixed types of construction.', 'Fire', 'Mixed Construction', 'C', '1', 'C', '1.4', ARRAY['mixed', 'construction', 'fire resistance']),
('C1.5', 'Two-storey Class 1 buildings', 'Concessions for two-storey Class 1 buildings.', 'Fire', 'Class 1', 'C', '1', 'C', '1.5', ARRAY['two-storey', 'class 1', 'residential']),
('C2.1', 'Fire-isolated exits', 'Requirements for fire-isolated exits.', 'Fire', 'Exits', 'C', '1', 'C', '2.1', ARRAY['exits', 'fire-isolated', 'egress']),
('C2.2', 'Construction of exits', 'Construction requirements for exits.', 'Fire', 'Exit Construction', 'C', '1', 'C', '2.2', ARRAY['exit', 'construction', 'fire doors']);

-- Section D - Access and Egress
INSERT INTO ncc_codes (code, title, description, category, subcategory, section, volume, part, clause, keywords) VALUES
('D1.3', 'Parts of buildings to be accessible', 'Requirements for which parts of buildings must be accessible.', 'Access', 'Accessibility', 'D', '1', 'D', '1.3', ARRAY['accessible', 'parts', 'disability access']),
('D1.4', 'Exemptions', 'Exemptions from accessibility requirements.', 'Access', 'Exemptions', 'D', '1', 'D', '1.4', ARRAY['exemptions', 'accessibility', 'exceptions']),
('D1.5', 'Access to buildings', 'Requirements for access to buildings.', 'Access', 'Building Access', 'D', '1', 'D', '1.5', ARRAY['access', 'entry', 'approach']),
('D1.6', 'Parking for people with a disability', 'Requirements for accessible parking.', 'Access', 'Parking', 'D', '1', 'D', '1.6', ARRAY['parking', 'disability', 'accessible parking']),
('D2.1', 'Number of exits required', 'Requirements for the number of exits.', 'Access', 'Exit Numbers', 'D', '1', 'D', '2.1', ARRAY['exits', 'number', 'egress']);

-- Section E - Services and Equipment
INSERT INTO ncc_codes (code, title, description, category, subcategory, section, volume, part, clause, keywords) VALUES
('E1.3', 'Fire hydrants', 'Requirements for fire hydrants.', 'Services and Equipment', 'Fire Hydrants', 'E', '1', 'E', '1.3', ARRAY['hydrants', 'fire', 'water supply']),
('E1.4', 'Fire hose reels', 'Requirements for fire hose reels.', 'Services and Equipment', 'Fire Hose', 'E', '1', 'E', '1.4', ARRAY['hose reels', 'fire', 'firefighting']),
('E1.5', 'Sprinklers', 'Requirements for automatic fire sprinkler systems.', 'Services and Equipment', 'Sprinklers', 'E', '1', 'E', '1.5', ARRAY['sprinklers', 'fire', 'suppression']),
('E1.6', 'Portable fire extinguishers', 'Requirements for portable fire extinguishers.', 'Services and Equipment', 'Extinguishers', 'E', '1', 'E', '1.6', ARRAY['extinguishers', 'portable', 'fire']),
('E2.1', 'Smoke detection and alarm systems', 'Requirements for smoke detection and alarm systems.', 'Services and Equipment', 'Smoke Alarms', 'E', '1', 'E', '2.1', ARRAY['smoke', 'detection', 'alarms']);

-- Section F - Health and Amenity
INSERT INTO ncc_codes (code, title, description, category, subcategory, section, volume, part, clause, keywords) VALUES
('F1.3', 'Room sizes', 'Minimum room sizes in Class 1 buildings.', 'Health and Amenity', 'Room Sizes', 'F', '1', 'F', '1.3', ARRAY['room', 'sizes', 'dimensions', 'minimum']),
('F1.4', 'Natural lighting', 'Requirements for natural lighting.', 'Health and Amenity', 'Lighting', 'F', '1', 'F', '1.4', ARRAY['lighting', 'natural', 'windows', 'daylight']),
('F1.5', 'Ventilation of rooms', 'Requirements for room ventilation.', 'Health and Amenity', 'Ventilation', 'F', '1', 'F', '1.5', ARRAY['ventilation', 'air', 'rooms']),
('F2.1', 'Damp and weatherproofing', 'Requirements for damp and weatherproofing.', 'Health and Amenity', 'Weatherproofing', 'F', '1', 'F', '2.1', ARRAY['damp', 'weatherproofing', 'moisture']),
('F2.2', 'Paving', 'Requirements for paving around buildings.', 'Health and Amenity', 'Paving', 'F', '1', 'F', '2.2', ARRAY['paving', 'drainage', 'ground']);

-- Section G - Ancillary Provisions
INSERT INTO ncc_codes (code, title, description, category, subcategory, section, volume, part, clause, keywords) VALUES
('G1.3', 'Cooking facilities', 'Requirements for cooking facilities.', 'Ancillary Provisions', 'Cooking', 'G', '1', 'G', '1.3', ARRAY['cooking', 'kitchen', 'facilities']),
('G2.1', 'Electricity supply', 'Requirements for electricity supply systems.', 'Ancillary Provisions', 'Electricity', 'G', '1', 'G', '2.1', ARRAY['electricity', 'power', 'supply']),
('G2.2', 'Artificial lighting', 'Requirements for artificial lighting.', 'Ancillary Provisions', 'Lighting', 'G', '1', 'G', '2.2', ARRAY['lighting', 'artificial', 'illumination']),
('G3.1', 'Atrium construction', 'Requirements for atrium construction.', 'Ancillary Provisions', 'Atrium', 'G', '1', 'G', '3.1', ARRAY['atrium', 'construction', 'void']),
('G4.1', 'Swimming pools', 'Requirements for swimming pools.', 'Ancillary Provisions', 'Swimming Pools', 'G', '1', 'G', '4.1', ARRAY['swimming', 'pools', 'safety']);

-- Section H - Special Use Buildings (Class 9 Buildings)
INSERT INTO ncc_codes (code, title, description, category, subcategory, section, volume, part, clause, keywords) VALUES
('H1.3', 'Public transport buildings', 'Special requirements for public transport buildings.', 'Special Use Buildings', 'Transport', 'H', '1', 'H', '1.3', ARRAY['transport', 'public', 'stations']),
('H1.4', 'Agricultural buildings', 'Requirements for agricultural buildings.', 'Special Use Buildings', 'Agricultural', 'H', '1', 'H', '1.4', ARRAY['agricultural', 'farm', 'buildings']);

-- Section J - Energy Efficiency (Volume One)
INSERT INTO ncc_codes (code, title, description, category, subcategory, section, volume, part, clause, keywords) VALUES
('J1.3', 'Building sealing', 'Requirements for building sealing to control air infiltration.', 'Energy Efficiency', 'Sealing', 'J', '1', 'J', '1.3', ARRAY['sealing', 'air', 'infiltration', 'energy']),
('J1.4', 'Air movement', 'Requirements for air movement control.', 'Energy Efficiency', 'Air Movement', 'J', '1', 'J', '1.4', ARRAY['air', 'movement', 'ventilation', 'energy']),
('J1.5', 'Thermal insulation', 'Requirements for thermal insulation.', 'Energy Efficiency', 'Insulation', 'J', '1', 'J', '1.5', ARRAY['insulation', 'thermal', 'R-value', 'energy']),
('J1.6', 'Thermal breaks', 'Requirements for thermal breaks in construction.', 'Energy Efficiency', 'Thermal Breaks', 'J', '1', 'J', '1.6', ARRAY['thermal', 'breaks', 'bridging', 'energy']);

-- Performance Requirements
INSERT INTO ncc_codes (code, title, description, category, subcategory, section, volume, part, clause, keywords) VALUES
('P2.1.1', 'Structural stability', 'Performance requirement for structural stability during a fire.', 'Performance Requirements', 'Structure', 'P', '1', '2', '1.1', ARRAY['performance', 'stability', 'fire', 'structure']),
('P2.2.1', 'Spread of fire', 'Performance requirement to avoid spread of fire.', 'Performance Requirements', 'Fire Spread', 'P', '1', '2', '2.1', ARRAY['performance', 'fire', 'spread', 'containment']),
('P2.3.1', 'Fire protection of openings', 'Performance requirement for protection of openings.', 'Performance Requirements', 'Openings', 'P', '1', '2', '3.1', ARRAY['performance', 'openings', 'fire', 'protection']),
('P2.4.1', 'Safe evacuation', 'Performance requirement for safe evacuation.', 'Performance Requirements', 'Evacuation', 'P', '1', '2', '4.1', ARRAY['performance', 'evacuation', 'egress', 'safety']);

-- Update the updated_at timestamp for all records
UPDATE ncc_codes SET updated_at = NOW() WHERE updated_at IS NULL; 