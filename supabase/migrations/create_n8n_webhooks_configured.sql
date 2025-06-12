-- Enable the pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a function to send webhooks to n8n
CREATE OR REPLACE FUNCTION send_n8n_webhook()
RETURNS trigger AS $$
DECLARE
  webhook_payload json;
  webhook_url text;
  webhook_secret text;
BEGIN
  -- Your n8n webhook URL with tunnel
  webhook_url := 'https://yeathgp1pgxkfrt2yfgrpxrv.hooks.n8n.cloud/webhook/trade-webhook';
  webhook_secret := 'your-webhook-secret-key-123'; -- Change this to a secure secret
  
  -- Build the webhook payload
  webhook_payload = json_build_object(
    'table', TG_TABLE_NAME,
    'action', TG_OP,
    'old', CASE WHEN TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END,
    'new', CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN row_to_json(NEW) ELSE NULL END,
    'timestamp', NOW(),
    'schema', TG_TABLE_SCHEMA
  );
  
  -- Send the webhook using pg_net
  PERFORM net.http_post(
    url := webhook_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'X-Webhook-Secret', webhook_secret
    ),
    body := webhook_payload::text
  );
  
  -- Return the appropriate value
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for the trades table
DROP TRIGGER IF EXISTS trades_n8n_insert_webhook ON trades;
CREATE TRIGGER trades_n8n_insert_webhook
AFTER INSERT ON trades
FOR EACH ROW EXECUTE FUNCTION send_n8n_webhook();

DROP TRIGGER IF EXISTS trades_n8n_update_webhook ON trades;
CREATE TRIGGER trades_n8n_update_webhook
AFTER UPDATE ON trades
FOR EACH ROW EXECUTE FUNCTION send_n8n_webhook();

DROP TRIGGER IF EXISTS trades_n8n_delete_webhook ON trades;
CREATE TRIGGER trades_n8n_delete_webhook
AFTER DELETE ON trades
FOR EACH ROW EXECUTE FUNCTION send_n8n_webhook(); 