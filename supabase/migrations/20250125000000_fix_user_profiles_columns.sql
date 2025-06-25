-- Fix missing columns in user_profiles table
-- This migration adds the subscription-related columns that were missing

-- Add subscription_tier column
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free_starter' 
  CHECK (subscription_tier IN ('free_starter', 'growing_pain_relief', 'premium_edge', 'skeleton_key'));

-- Add subscription_status column
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active';

-- Add max_organizations column
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS max_organizations INTEGER DEFAULT 1;

-- Add max_team_members column
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS max_team_members INTEGER DEFAULT 5;

-- Add current_organization_id column
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS current_organization_id UUID REFERENCES organizations(id);

-- Add subscription_features column
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS subscription_features JSONB DEFAULT '{}'::jsonb;

-- Add subscription_started_at column
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS subscription_started_at TIMESTAMPTZ DEFAULT now();

-- Add subscription_ends_at column
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMPTZ;

-- Create index for current organization
CREATE INDEX IF NOT EXISTS idx_user_profiles_current_org 
ON user_profiles(current_organization_id);

-- Grant necessary permissions
GRANT SELECT, UPDATE ON user_profiles TO authenticated;

-- Update existing user profiles with default values if needed
UPDATE user_profiles 
SET 
  subscription_tier = COALESCE(subscription_tier, 'free_starter'),
  subscription_status = COALESCE(subscription_status, 'active'),
  max_organizations = COALESCE(max_organizations, 1),
  max_team_members = COALESCE(max_team_members, 5),
  subscription_features = COALESCE(subscription_features, '{}'::jsonb)
WHERE subscription_tier IS NULL 
   OR subscription_status IS NULL 
   OR max_organizations IS NULL 
   OR max_team_members IS NULL 
   OR subscription_features IS NULL; 