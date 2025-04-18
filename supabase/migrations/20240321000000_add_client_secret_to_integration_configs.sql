-- Add client_secret column to integration_configs table
ALTER TABLE integration_configs
ADD COLUMN client_secret TEXT;

-- Update RLS policy to include client_secret
ALTER POLICY "Users can only access their own integration configs" ON integration_configs
USING (auth.uid() = user_id); 