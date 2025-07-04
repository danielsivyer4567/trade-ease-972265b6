-- Add QBCC and Timber Queensland voice search features to subscription_features table

-- Add QBCC voice search feature
INSERT INTO subscription_features (subscription_tier, feature_key, feature_name, description, enabled, created_at, updated_at) VALUES
('premium_edge', 'qbcc_voice_search', 'QBCC Forms Voice Search', 'Voice-activated search for Queensland Building and Construction Commission forms and documents', true, NOW(), NOW()),
('skeleton_key', 'qbcc_voice_search', 'QBCC Forms Voice Search', 'Voice-activated search for Queensland Building and Construction Commission forms and documents', true, NOW(), NOW()),
('basic', 'qbcc_voice_search', 'QBCC Forms Voice Search', 'Voice-activated search for Queensland Building and Construction Commission forms and documents', false, NOW(), NOW()),
('free', 'qbcc_voice_search', 'QBCC Forms Voice Search', 'Voice-activated search for Queensland Building and Construction Commission forms and documents', false, NOW(), NOW());

-- Add Timber Queensland voice search feature
INSERT INTO subscription_features (subscription_tier, feature_key, feature_name, description, enabled, created_at, updated_at) VALUES
('premium_edge', 'timber_queensland_voice_search', 'Timber Queensland Voice Search', 'Voice-activated search for Timber Queensland technical data sheets and specifications', true, NOW(), NOW()),
('skeleton_key', 'timber_queensland_voice_search', 'Timber Queensland Voice Search', 'Voice-activated search for Timber Queensland technical data sheets and specifications', true, NOW(), NOW()),
('basic', 'timber_queensland_voice_search', 'Timber Queensland Voice Search', 'Voice-activated search for Timber Queensland technical data sheets and specifications', false, NOW(), NOW()),
('free', 'timber_queensland_voice_search', 'Timber Queensland Voice Search', 'Voice-activated search for Timber Queensland technical data sheets and specifications', false, NOW(), NOW());

-- Update existing subscription features to include the new features in the features JSONB column
UPDATE subscription_features 
SET features = features || '{"qbcc_voice_search": true, "timber_queensland_voice_search": true}'::jsonb
WHERE subscription_tier IN ('premium_edge', 'skeleton_key')
AND feature_key = 'voice_search';

-- Update basic and free tiers to have the features disabled
UPDATE subscription_features 
SET features = features || '{"qbcc_voice_search": false, "timber_queensland_voice_search": false}'::jsonb
WHERE subscription_tier IN ('basic', 'free')
AND feature_key = 'voice_search'; 