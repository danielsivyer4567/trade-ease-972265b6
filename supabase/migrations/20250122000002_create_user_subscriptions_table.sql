-- Create user_subscriptions table to track user subscription status
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_tier TEXT NOT NULL CHECK (subscription_tier IN ('free_starter', 'growing_pain_relief', 'premium_edge', 'skeleton_key')),
    is_active BOOLEAN DEFAULT true,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_tier ON user_subscriptions(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_active ON user_subscriptions(is_active);

-- Enable RLS
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own subscription"
ON user_subscriptions FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "System can manage subscriptions"
ON user_subscriptions FOR ALL
USING (auth.role() = 'service_role');

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_subscriptions_updated_at
    BEFORE UPDATE ON user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_user_subscriptions_updated_at();

-- Grant permissions
GRANT SELECT ON user_subscriptions TO authenticated;

-- Insert default free_starter subscription for existing users
INSERT INTO user_subscriptions (user_id, subscription_tier, is_active)
SELECT 
    up.user_id,
    COALESCE(up.subscription_tier, 'free_starter') as subscription_tier,
    true as is_active
FROM user_profiles up
WHERE NOT EXISTS (
    SELECT 1 FROM user_subscriptions us WHERE us.user_id = up.user_id
); 