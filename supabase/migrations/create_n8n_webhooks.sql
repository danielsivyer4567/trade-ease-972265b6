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
  -- Configure your n8n webhook URL here
  -- For development with tunnel: https://your-tunnel-id.hooks.n8n.cloud/webhook/trade-webhook
  -- For production: https://your-domain.com/webhook/trade-webhook
  webhook_url := 'https://your-tunnel-id.hooks.n8n.cloud/webhook/trade-webhook';
  webhook_secret := 'your-webhook-secret-key';
  
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

-- Create triggers for the shipments table
DROP TRIGGER IF EXISTS shipments_n8n_insert_webhook ON shipments;
CREATE TRIGGER shipments_n8n_insert_webhook
AFTER INSERT ON shipments
FOR EACH ROW EXECUTE FUNCTION send_n8n_webhook();

DROP TRIGGER IF EXISTS shipments_n8n_update_webhook ON shipments;
CREATE TRIGGER shipments_n8n_update_webhook
AFTER UPDATE ON shipments
FOR EACH ROW EXECUTE FUNCTION send_n8n_webhook();

-- Create triggers for the documents table
DROP TRIGGER IF EXISTS documents_n8n_insert_webhook ON documents;
CREATE TRIGGER documents_n8n_insert_webhook
AFTER INSERT ON documents
FOR EACH ROW EXECUTE FUNCTION send_n8n_webhook();

DROP TRIGGER IF EXISTS documents_n8n_update_webhook ON documents;
CREATE TRIGGER documents_n8n_update_webhook
AFTER UPDATE ON documents
FOR EACH ROW EXECUTE FUNCTION send_n8n_webhook();

-- Create a function to update webhook configuration
CREATE OR REPLACE FUNCTION update_n8n_webhook_config(
  new_url text,
  new_secret text
)
RETURNS void AS $$
BEGIN
  -- This would typically update a configuration table
  -- For now, you'll need to update the send_n8n_webhook function directly
  RAISE NOTICE 'Update the webhook_url and webhook_secret in send_n8n_webhook() function';
END;
$$ LANGUAGE plpgsql;

-- Create a table to log webhook failures (optional)
CREATE TABLE IF NOT EXISTS webhook_logs (
  id BIGSERIAL PRIMARY KEY,
  table_name TEXT NOT NULL,
  action TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- Function to log webhook attempts
CREATE OR REPLACE FUNCTION log_webhook_attempt(
  p_table_name text,
  p_action text,
  p_payload jsonb
)
RETURNS BIGINT AS $$
DECLARE
  log_id BIGINT;
BEGIN
  INSERT INTO webhook_logs (table_name, action, payload)
  VALUES (p_table_name, p_action, p_payload)
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql;

-- Example: Create a more robust webhook function with error handling
CREATE OR REPLACE FUNCTION send_n8n_webhook_with_retry()
RETURNS trigger AS $$
DECLARE
  webhook_payload json;
  webhook_url text;
  webhook_secret text;
  log_id BIGINT;
BEGIN
  webhook_url := 'https://your-tunnel-id.hooks.n8n.cloud/webhook/trade-webhook';
  webhook_secret := 'your-webhook-secret-key';
  
  webhook_payload = json_build_object(
    'table', TG_TABLE_NAME,
    'action', TG_OP,
    'old', CASE WHEN TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END,
    'new', CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN row_to_json(NEW) ELSE NULL END,
    'timestamp', NOW()
  );
  
  -- Log the webhook attempt
  log_id := log_webhook_attempt(TG_TABLE_NAME, TG_OP, webhook_payload::jsonb);
  
  -- Send the webhook
  BEGIN
    PERFORM net.http_post(
      url := webhook_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'X-Webhook-Secret', webhook_secret,
        'X-Webhook-Log-Id', log_id::text
      ),
      body := webhook_payload::text
    );
    
    -- Update log status
    UPDATE webhook_logs 
    SET status = 'sent', processed_at = NOW()
    WHERE id = log_id;
    
  EXCEPTION WHEN OTHERS THEN
    -- Log the error
    UPDATE webhook_logs 
    SET status = 'failed', 
        error_message = SQLERRM,
        processed_at = NOW()
    WHERE id = log_id;
    
    -- Don't fail the transaction, just log the error
    RAISE WARNING 'Webhook failed: %', SQLERRM;
  END;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION send_n8n_webhook() TO authenticated;
GRANT EXECUTE ON FUNCTION send_n8n_webhook_with_retry() TO authenticated; 