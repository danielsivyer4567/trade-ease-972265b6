-- Enhance subscription features to support new frontend features
-- This migration adds missing feature flags and tables for the updated subscription plans

-- Add missing feature flags for trade calculators and external calendar integration
INSERT INTO subscription_features (tier, feature_key, feature_value, description) VALUES
-- Trade specific calculators and features
('free_starter', 'trade_calculators', 'false', 'Access to trade specific calculators'),
('growing_pain_relief', 'trade_calculators', 'true', 'Access to trade specific calculators'),
('premium_edge', 'trade_calculators', 'true', 'Access to trade specific calculators'),
('skeleton_key', 'trade_calculators', 'true', 'Access to trade specific calculators'),

-- External calendar integration
('free_starter', 'external_calendar_integration', 'false', 'Integration with external calendars'),
('growing_pain_relief', 'external_calendar_integration', 'true', 'Integration with external calendars'),
('premium_edge', 'external_calendar_integration', 'true', 'Integration with external calendars'),
('skeleton_key', 'external_calendar_integration', 'true', 'Integration with external calendars'),

-- Feature request system
('free_starter', 'feature_requests', 'false', 'Can request new trade specific features'),
('growing_pain_relief', 'feature_requests', 'true', 'Can request new trade specific features'),
('premium_edge', 'feature_requests', 'true', 'Can request new trade specific features'),
('skeleton_key', 'feature_requests', 'true', 'Can request new trade specific features'),

-- Unlimited notification texts
('free_starter', 'unlimited_notification_texts', 'false', 'Unlimited notification texts to customers and staff'),
('growing_pain_relief', 'unlimited_notification_texts', 'false', 'Unlimited notification texts to customers and staff'),
('premium_edge', 'unlimited_notification_texts', 'true', 'Unlimited notification texts to customers and staff'),
('skeleton_key', 'unlimited_notification_texts', 'true', 'Unlimited notification texts to customers and staff'),

-- Unlimited calendars
('free_starter', 'unlimited_calendars', 'false', 'Unlimited calendar management'),
('growing_pain_relief', 'unlimited_calendars', 'false', 'Unlimited calendar management'),
('premium_edge', 'unlimited_calendars', 'true', 'Unlimited calendar management'),
('skeleton_key', 'unlimited_calendars', 'true', 'Unlimited calendar management'),

-- Accounting software integration
('free_starter', 'accounting_integration', 'true', 'Integration with Xero, MYOB, QuickBooks + 50 more'),
('growing_pain_relief', 'accounting_integration', 'true', 'Integration with Xero, MYOB, QuickBooks + 50 more'),
('premium_edge', 'accounting_integration', 'true', 'Integration with Xero, MYOB, QuickBooks + 50 more'),
('skeleton_key', 'accounting_integration', 'true', 'Integration with Xero, MYOB, QuickBooks + 50 more'),

-- Business structure layout map
('free_starter', 'business_structure_map', 'false', 'Business structure layout map'),
('growing_pain_relief', 'business_structure_map', 'false', 'Business structure layout map (available as add-on)'),
('premium_edge', 'business_structure_map', 'true', 'Business structure layout map'),
('skeleton_key', 'business_structure_map', 'true', 'Business structure layout map'),

-- NCC Code Search via Voice
('free_starter', 'ncc_voice_search', 'false', 'NCC Code Search via Voice'),
('growing_pain_relief', 'ncc_voice_search', 'false', 'NCC Code Search via Voice (available as add-on)'),
('premium_edge', 'ncc_voice_search', 'true', 'NCC Code Search via Voice'),
('skeleton_key', 'ncc_voice_search', 'true', 'NCC Code Search via Voice')
ON CONFLICT (tier, feature_key) DO UPDATE 
SET feature_value = EXCLUDED.feature_value,
    description = EXCLUDED.description,
    updated_at = NOW();

-- Create feature_requests table to track user feature requests
CREATE TABLE IF NOT EXISTS feature_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  trade_type TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected', 'in_development', 'completed')),
  admin_notes TEXT,
  estimated_effort_hours INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- Create index for feature requests
CREATE INDEX IF NOT EXISTS idx_feature_requests_user_id ON feature_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_feature_requests_organization_id ON feature_requests(organization_id);
CREATE INDEX IF NOT EXISTS idx_feature_requests_status ON feature_requests(status);

-- Enable RLS for feature_requests
ALTER TABLE feature_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for feature_requests
CREATE POLICY "Users can view their own feature requests"
ON feature_requests FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can create feature requests"
ON feature_requests FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own feature requests"
ON feature_requests FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all feature requests"
ON feature_requests FOR ALL
USING (auth.role() = 'service_role');

-- Create function to check if user can request features
CREATE OR REPLACE FUNCTION can_request_features()
RETURNS BOOLEAN AS $$
DECLARE
  user_tier TEXT;
  can_request BOOLEAN;
BEGIN
  -- Get user's subscription tier
  SELECT subscription_tier INTO user_tier
  FROM user_profiles
  WHERE user_id = auth.uid();
  
  -- Check if feature requests are enabled for this tier
  SELECT (feature_value::text = 'true')
  INTO can_request
  FROM subscription_features
  WHERE tier = user_tier AND feature_key = 'feature_requests';
  
  RETURN COALESCE(can_request, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user's feature request limit
CREATE OR REPLACE FUNCTION get_feature_request_limit()
RETURNS INTEGER AS $$
DECLARE
  user_tier TEXT;
  request_count INTEGER;
  max_requests INTEGER;
BEGIN
  -- Get user's subscription tier
  SELECT subscription_tier INTO user_tier
  FROM user_profiles
  WHERE user_id = auth.uid();
  
  -- Count current pending requests
  SELECT COUNT(*) INTO request_count
  FROM feature_requests
  WHERE user_id = auth.uid() AND status IN ('pending', 'reviewing');
  
  -- Set limits based on tier
  CASE user_tier
    WHEN 'free_starter' THEN max_requests := 0;
    WHEN 'growing_pain_relief' THEN max_requests := 5;
    WHEN 'premium_edge' THEN max_requests := 20;
    WHEN 'skeleton_key' THEN max_requests := -1; -- unlimited
    ELSE max_requests := 0;
  END CASE;
  
  -- Return remaining requests (or -1 for unlimited)
  IF max_requests = -1 THEN
    RETURN -1;
  ELSE
    RETURN GREATEST(0, max_requests - request_count);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON feature_requests TO authenticated;
GRANT EXECUTE ON FUNCTION can_request_features TO authenticated;
GRANT EXECUTE ON FUNCTION get_feature_request_limit TO authenticated;

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_feature_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_feature_requests_updated_at
  BEFORE UPDATE ON feature_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_feature_requests_updated_at(); 