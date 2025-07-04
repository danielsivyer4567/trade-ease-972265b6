-- Script to upgrade specific user to Skeleton Key subscription tier
-- User ID: 7463a3ad-5193-4dee-b59f-307a8c1da359

-- First, ensure the subscription columns exist (from our previous migration)
-- If these columns don't exist yet, run the migration first:
-- supabase/migrations/20250125000000_fix_user_profiles_columns.sql

-- Update the user_profiles table
UPDATE user_profiles 
SET 
    subscription_tier = 'skeleton_key',
    subscription_status = 'active',
    max_organizations = 999, -- Unlimited for skeleton key
    max_team_members = 999, -- Unlimited for skeleton key
    subscription_features = jsonb_build_object(
        'unlimited_organizations', true,
        'unlimited_team_members', true,
        'all_features_enabled', true,
        'ncc_voice_search', true,
        'qbcc_voice_search', true,
        'timber_queensland_voice_search', true,
        'priority_support', true,
        'api_access', true,
        'white_label', true,
        'advanced_reporting', true,
        'custom_branding', true,
        'bulk_operations', true
    ),
    subscription_started_at = NOW(),
    subscription_ends_at = NULL, -- No expiration for skeleton key
    updated_at = NOW()
WHERE user_id = '7463a3ad-5193-4dee-b59f-307a8c1da359';

-- If user_subscriptions table exists, update it too
UPDATE user_subscriptions
SET
    subscription_tier = 'skeleton_key',
    is_active = true,
    updated_at = NOW()
WHERE user_id = '7463a3ad-5193-4dee-b59f-307a8c1da359';

-- Grant access to all features in subscription_features table
-- This ensures all feature checks pass
INSERT INTO user_subscriptions (user_id, subscription_tier, is_active, created_at, updated_at)
VALUES ('7463a3ad-5193-4dee-b59f-307a8c1da359', 'skeleton_key', true, NOW(), NOW())
ON CONFLICT (user_id) 
DO UPDATE SET 
    subscription_tier = 'skeleton_key',
    is_active = true,
    updated_at = NOW();

-- Verify the update
SELECT 
    up.user_id,
    up.email,
    up.subscription_tier,
    up.subscription_status,
    up.max_organizations,
    up.max_team_members,
    up.subscription_features,
    us.is_active as subscription_active
FROM user_profiles up
LEFT JOIN user_subscriptions us ON up.user_id = us.user_id
WHERE up.user_id = '7463a3ad-5193-4dee-b59f-307a8c1da359';

-- Check feature access
SELECT 
    feature_key,
    feature_name,
    enabled
FROM subscription_features
WHERE tier = 'skeleton_key'
ORDER BY feature_key; 