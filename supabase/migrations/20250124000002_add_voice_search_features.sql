-- Add voice search features to subscription_features table
INSERT INTO subscription_features (tier, feature_key, feature_value, description) VALUES
-- Free Starter - no voice search access
('free_starter', 'ncc_voice_search', 'false', 'NCC codes voice search access'),
('free_starter', 'qbcc_voice_search', 'false', 'QBCC forms voice search access'),
('free_starter', 'timber_queensland_voice_search', 'false', 'Timber Queensland voice search access'),

-- Growing Pain Relief - basic voice search access
('growing_pain_relief', 'ncc_voice_search', 'true', 'NCC codes voice search access'),
('growing_pain_relief', 'qbcc_voice_search', 'false', 'QBCC forms voice search access'),
('growing_pain_relief', 'timber_queensland_voice_search', 'false', 'Timber Queensland voice search access'),

-- Premium Edge - all voice search access
('premium_edge', 'ncc_voice_search', 'true', 'NCC codes voice search access'),
('premium_edge', 'qbcc_voice_search', 'true', 'QBCC forms voice search access'),
('premium_edge', 'timber_queensland_voice_search', 'true', 'Timber Queensland voice search access'),

-- Skeleton Key - all voice search access
('skeleton_key', 'ncc_voice_search', 'true', 'NCC codes voice search access'),
('skeleton_key', 'qbcc_voice_search', 'true', 'QBCC forms voice search access'),
('skeleton_key', 'timber_queensland_voice_search', 'true', 'Timber Queensland voice search access')
ON CONFLICT (tier, feature_key) DO UPDATE 
SET feature_value = EXCLUDED.feature_value,
    description = EXCLUDED.description,
    updated_at = NOW(); 