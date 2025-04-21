-- Add phone_number and two_factor_enabled columns to user profiles table
ALTER TABLE IF EXISTS user_profiles 
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE;

-- Create two_factor_auth table to store verification codes
CREATE TABLE IF NOT EXISTS two_factor_auth (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  verification_code TEXT NOT NULL,
  verification_link TEXT NOT NULL,
  verification_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  UNIQUE(verification_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_two_factor_auth_user_id ON two_factor_auth(user_id);
CREATE INDEX IF NOT EXISTS idx_two_factor_auth_verification_id ON two_factor_auth(verification_id);

-- Row Level Security
ALTER TABLE two_factor_auth ENABLE ROW LEVEL SECURITY;

-- Only the authenticated user or service role can see their 2FA data
CREATE POLICY "Users can view their own 2FA data" 
  ON two_factor_auth
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Only the authenticated user or service role can insert 2FA data
CREATE POLICY "Users can create their own 2FA data" 
  ON two_factor_auth
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Only the authenticated user or service role can update their 2FA data
CREATE POLICY "Users can update their own 2FA data" 
  ON two_factor_auth
  FOR UPDATE
  USING (auth.uid() = user_id); 