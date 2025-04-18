-- Add token fields to integration_configs table
ALTER TABLE integration_configs
ADD COLUMN access_token TEXT,
ADD COLUMN refresh_token TEXT,
ADD COLUMN token_expires_at TIMESTAMP WITH TIME ZONE; 