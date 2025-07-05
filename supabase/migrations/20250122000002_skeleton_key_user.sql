-- Migration to add skeleton key user support
-- User ID: 7463a3ad-5193-4dee-b59f-307a8c1da359 gets access to all features

-- Update the has_feature_access function to include skeleton key logic
CREATE OR REPLACE FUNCTION has_feature_access(feature_key TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_tier TEXT;
  feature_enabled BOOLEAN;
  current_user_id UUID;
BEGIN
  -- Get current user ID
  current_user_id := auth.uid();
  
  -- Check if user is the skeleton key user (has access to all features)
  IF current_user_id = '7463a3ad-5193-4dee-b59f-307a8c1da359'::UUID THEN
    RETURN TRUE;
  END IF;
  
  -- Get user's subscription tier
  SELECT subscription_tier INTO user_tier
  FROM user_profiles
  WHERE user_id = current_user_id;
  
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

-- Update the get_feature_limit function to include skeleton key logic
CREATE OR REPLACE FUNCTION get_feature_limit(feature_key TEXT)
RETURNS INTEGER AS $$
DECLARE
  user_tier TEXT;
  feature_val TEXT;
  current_user_id UUID;
BEGIN
  -- Get current user ID
  current_user_id := auth.uid();
  
  -- Check if user is the skeleton key user (unlimited access)
  IF current_user_id = '7463a3ad-5193-4dee-b59f-307a8c1da359'::UUID THEN
    RETURN -1; -- -1 indicates unlimited
  END IF;
  
  -- Get user's subscription tier
  SELECT subscription_tier INTO user_tier
  FROM user_profiles
  WHERE user_id = current_user_id;
  
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

-- Update the can_request_features function to include skeleton key logic
CREATE OR REPLACE FUNCTION can_request_features()
RETURNS BOOLEAN AS $$
DECLARE
  user_tier TEXT;
  can_request BOOLEAN;
  current_user_id UUID;
BEGIN
  -- Get current user ID
  current_user_id := auth.uid();
  
  -- Check if user is the skeleton key user (can request features)
  IF current_user_id = '7463a3ad-5193-4dee-b59f-307a8c1da359'::UUID THEN
    RETURN TRUE;
  END IF;
  
  -- Get user's subscription tier
  SELECT subscription_tier INTO user_tier
  FROM user_profiles
  WHERE user_id = current_user_id;
  
  -- Check if feature requests are enabled for this tier
  SELECT (feature_value::text = 'true')
  INTO can_request
  FROM subscription_features
  WHERE tier = user_tier AND feature_key = 'feature_requests';
  
  RETURN COALESCE(can_request, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the get_feature_request_limit function to include skeleton key logic
CREATE OR REPLACE FUNCTION get_feature_request_limit()
RETURNS INTEGER AS $$
DECLARE
  user_tier TEXT;
  request_count INTEGER;
  max_requests INTEGER;
  current_user_id UUID;
BEGIN
  -- Get current user ID
  current_user_id := auth.uid();
  
  -- Check if user is the skeleton key user (unlimited requests)
  IF current_user_id = '7463a3ad-5193-4dee-b59f-307a8c1da359'::UUID THEN
    RETURN -1; -- -1 indicates unlimited
  END IF;
  
  -- Get user's subscription tier
  SELECT subscription_tier INTO user_tier
  FROM user_profiles
  WHERE user_id = current_user_id;
  
  -- Get current request count
  SELECT COUNT(*) INTO request_count
  FROM feature_requests
  WHERE user_id = current_user_id
  AND created_at > NOW() - INTERVAL '30 days';
  
  -- Get max requests for tier
  SELECT COALESCE(
    (SELECT feature_value::integer 
     FROM subscription_features 
     WHERE tier = user_tier AND feature_key = 'feature_request_limit'),
    0
  ) INTO max_requests;
  
  RETURN GREATEST(max_requests - request_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 