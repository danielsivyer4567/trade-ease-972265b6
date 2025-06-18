-- Add subscription features tracking
-- This migration adds detailed feature tracking for different subscription tiers

-- Create subscription_features table to define what each tier includes
CREATE TABLE IF NOT EXISTS subscription_features (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tier TEXT NOT NULL CHECK (tier IN ('free_starter', 'growing_pain_relief', 'premium_edge', 'skeleton_key')),
  feature_key TEXT NOT NULL,
  feature_value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tier, feature_key)
);

-- Insert default features for each tier
INSERT INTO subscription_features (tier, feature_key, feature_value, description) VALUES
-- Free Starter features
('free_starter', 'max_organizations', '1', 'Maximum number of organizations'),
('free_starter', 'max_users', '1', 'Maximum users per organization'),
('free_starter', 'invoicing', 'true', 'Access to invoicing features'),
('free_starter', 'quoting', 'true', 'Access to quoting features'),
('free_starter', 'calendar', 'true', 'Access to calendar features'),
('free_starter', 'automations', '0', 'Number of automations allowed'),
('free_starter', 'automated_texts', '0', 'Number of automated texts per month'),
('free_starter', 'automated_emails', '0', 'Number of automated emails per month'),
('free_starter', 'view_all_features', 'true', 'Can view all features (but not use)'),
('free_starter', 'affiliate_commission', '0.40', '40% affiliate commission'),
('free_starter', 'support_tier', '"standard"', 'Standard ticket support'),

-- Growing Pain Relief features
('growing_pain_relief', 'max_organizations', '1', 'Maximum number of organizations'),
('growing_pain_relief', 'max_users', '3', 'Maximum users per organization'),
('growing_pain_relief', 'web_enquiry_forwarding', 'true', 'Auto forward web enquiries'),
('growing_pain_relief', 'abn_verification', 'true', 'Automatic ABN verification'),
('growing_pain_relief', 'internal_communications', 'true', 'Internal comms and tagging'),
('growing_pain_relief', 'addon_automated_texts', '{"enabled": true, "monthly_fee": 20, "per_text": 0.10}', 'Text automation add-on pricing'),
('growing_pain_relief', 'addon_ai_agents', 'true', 'AI agents available as add-on'),
('growing_pain_relief', 'addon_workflows', 'true', 'Workflows available as add-on'),
('growing_pain_relief', 'affiliate_commission', '0.40', '40% affiliate commission'),
('growing_pain_relief', 'support_tier', '"standard"', 'Standard ticket support'),

-- Premium Edge features
('premium_edge', 'max_organizations', '5', 'Maximum number of organizations'),
('premium_edge', 'max_users', '15', 'Maximum users included'),
('premium_edge', 'all_features_unlocked', 'true', 'Access to all features'),
('premium_edge', 'unlimited_texts', 'true', 'Unlimited free texts'),
('premium_edge', 'unlimited_automations', 'true', 'Unlimited automations'),
('premium_edge', 'unlimited_review_requests', 'true', 'Unlimited automatic review requests'),
('premium_edge', 'dedicated_phone_number', 'true', 'Dedicated phone number included'),
('premium_edge', 'basic_workflow_setup', '"free"', 'Free basic workflow setup'),
('premium_edge', 'advanced_workflows', '"extra_cost"', 'Advanced workflows at additional cost'),
('premium_edge', 'affiliate_commission', '0.40', '40% affiliate commission'),
('premium_edge', 'support_tier', '"priority"', 'Priority ticket support'),

-- Skeleton Key features
('skeleton_key', 'max_organizations', '"unlimited"', 'Unlimited organizations'),
('skeleton_key', 'white_label', 'true', 'Full white-label branding'),
('skeleton_key', 'setup_videos', 'true', 'Step-by-step setup videos'),
('skeleton_key', 'resell_platform', 'true', 'Can resell to clients'),
('skeleton_key', 'keep_client_fees', '1.0', 'Keep 100% of client fees'),
('skeleton_key', 'client_management', 'true', 'Full client management tools'),
('skeleton_key', 'sell_workflows', 'true', 'Can sell custom workflows'),
('skeleton_key', 'all_features_included', 'true', 'All features with no restrictions'),
('skeleton_key', 'support_tier', '"highest"', 'Highest priority support'),
('skeleton_key', 'dedicated_developer', '"optional"', 'Optional dedicated developer')
ON CONFLICT (tier, feature_key) DO UPDATE 
SET feature_value = EXCLUDED.feature_value,
    description = EXCLUDED.description,
    updated_at = NOW();

-- Create affiliate_referrals table
CREATE TABLE IF NOT EXISTS affiliate_referrals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  referrer_id UUID REFERENCES auth.users(id),
  referred_user_id UUID REFERENCES auth.users(id),
  referral_code TEXT NOT NULL,
  subscription_tier TEXT,
  commission_rate DECIMAL(3,2) DEFAULT 0.40,
  commission_earned DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'paid', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  activated_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_subscription_features_tier ON subscription_features(tier);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_referrer ON affiliate_referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_code ON affiliate_referrals(referral_code);

-- Enable RLS
ALTER TABLE subscription_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_referrals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_features (read-only for all authenticated users)
CREATE POLICY "Users can view subscription features"
ON subscription_features FOR SELECT
USING (true);

-- RLS Policies for affiliate_referrals
CREATE POLICY "Users can view their own referrals"
ON affiliate_referrals FOR SELECT
USING (referrer_id = auth.uid() OR referred_user_id = auth.uid());

CREATE POLICY "System can manage referrals"
ON affiliate_referrals FOR ALL
USING (auth.role() = 'service_role');

-- Function to check if user has access to a feature
CREATE OR REPLACE FUNCTION has_feature_access(feature_key TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_tier TEXT;
  feature_enabled BOOLEAN;
BEGIN
  -- Get user's subscription tier
  SELECT subscription_tier INTO user_tier
  FROM user_profiles
  WHERE user_id = auth.uid();
  
  -- Check if feature is enabled for this tier
  SELECT (feature_value::text = 'true' OR 
          (feature_value::text ~ '^\d+$' AND feature_value::int > 0) OR
          feature_value::text = '"unlimited"')
  INTO feature_enabled
  FROM subscription_features
  WHERE tier = user_tier AND subscription_features.feature_key = has_feature_access.feature_key;
  
  RETURN COALESCE(feature_enabled, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get feature limit
CREATE OR REPLACE FUNCTION get_feature_limit(feature_key TEXT)
RETURNS INTEGER AS $$
DECLARE
  user_tier TEXT;
  feature_val TEXT;
BEGIN
  -- Get user's subscription tier
  SELECT subscription_tier INTO user_tier
  FROM user_profiles
  WHERE user_id = auth.uid();
  
  -- Get feature value
  SELECT feature_value::text INTO feature_val
  FROM subscription_features
  WHERE tier = user_tier AND subscription_features.feature_key = get_feature_limit.feature_key;
  
  -- Return numeric limit or -1 for unlimited
  IF feature_val = '"unlimited"' THEN
    RETURN -1;
  ELSIF feature_val ~ '^\d+$' THEN
    RETURN feature_val::integer;
  ELSE
    RETURN 0;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT SELECT ON subscription_features TO authenticated;
GRANT SELECT ON affiliate_referrals TO authenticated;
GRANT EXECUTE ON FUNCTION has_feature_access TO authenticated;
GRANT EXECUTE ON FUNCTION get_feature_limit TO authenticated; 