-- Add Twilio credentials to integration_configs table
-- This migration adds the Twilio SID and Auth Token for messaging services

INSERT INTO integration_configs (integration_name, api_key, client_secret, status, created_at, updated_at)
VALUES ('twilio', 'AC73c2f0da681e3dab36cb7efe9a20d353', '23e5200bd07157c4abc9b4bfbbb31370', 'connected', NOW(), NOW());

-- Add a comment to document the credential mapping
COMMENT ON COLUMN integration_configs.api_key IS 'For Twilio: Account SID';
COMMENT ON COLUMN integration_configs.client_secret IS 'For Twilio: Auth Token'; 