# Supabase Database Webhooks → n8n Workflows Setup

## Overview
This guide will help you set up Supabase database webhooks that trigger n8n workflows when data changes in your database.

## Step 1: Start n8n with Tunnel (for development)

Since Supabase needs to reach your n8n instance, you'll need a public URL:

```bash
# Start n8n with tunnel
npx n8n start --tunnel

# You'll see output like:
# Tunnel URL: https://abc123def.hooks.n8n.cloud/
# n8n is now accessible via: https://abc123def.hooks.n8n.cloud/
```

Save this tunnel URL - you'll need it for Supabase webhooks.

## Step 2: Create Database Webhook in Supabase

### Option A: Using Supabase Dashboard

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **Database → Webhooks**
3. Click **"Create a new hook"**
4. Configure the webhook:
   - **Name**: `trade_changes_webhook`
   - **Table**: Select your table (e.g., `trades`)
   - **Events**: Choose events (INSERT, UPDATE, DELETE)
   - **Type**: HTTP Request
   - **URL**: `https://your-tunnel-id.hooks.n8n.cloud/webhook/trade-webhook`
   - **Method**: POST
   - **Headers**: 
     ```json
     {
       "Content-Type": "application/json",
       "X-Webhook-Secret": "your-secret-key"
     }
     ```

### Option B: Using SQL

```sql
-- Create webhook function
CREATE OR REPLACE FUNCTION notify_n8n_webhook()
RETURNS trigger AS $$
DECLARE
  payload json;
  webhook_url text;
BEGIN
  -- Set your n8n webhook URL (replace with your actual n8n tunnel URL)
  webhook_url := 'https://your-tunnel-id.hooks.n8n.cloud/webhook/trade-webhook';
  
  -- Build the payload
  payload = json_build_object(
    'table', TG_TABLE_NAME,
    'action', TG_OP,
    'old', OLD,
    'new', NEW,
    'timestamp', NOW()
  );
  
  -- Send webhook (requires pg_net extension)
  PERFORM net.http_post(
    url := webhook_url,
    headers := '{"Content-Type": "application/json", "X-Webhook-Secret": "your-secret-key"}'::jsonb,
    body := payload::text
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for trades table
CREATE TRIGGER trades_insert_webhook
AFTER INSERT ON trades
FOR EACH ROW EXECUTE FUNCTION notify_n8n_webhook();

CREATE TRIGGER trades_update_webhook
AFTER UPDATE ON trades
FOR EACH ROW EXECUTE FUNCTION notify_n8n_webhook();

CREATE TRIGGER trades_delete_webhook
AFTER DELETE ON trades
FOR EACH ROW EXECUTE FUNCTION notify_n8n_webhook();

-- Add triggers for shipments table
CREATE TRIGGER shipments_n8n_insert_webhook
AFTER INSERT ON shipments
FOR EACH ROW EXECUTE FUNCTION send_n8n_webhook();

CREATE TRIGGER shipments_n8n_update_webhook
AFTER UPDATE ON shipments
FOR EACH ROW EXECUTE FUNCTION send_n8n_webhook();

-- Add triggers for documents table
CREATE TRIGGER documents_n8n_insert_webhook
AFTER INSERT ON documents
FOR EACH ROW EXECUTE FUNCTION send_n8n_webhook();
```

## Step 3: Create n8n Webhook Workflow

Import this workflow into n8n:

```json
{
  "name": "Supabase Database Webhook Handler",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "trade-webhook",
        "responseMode": "onReceived",
        "responseData": "success",
        "options": {}
      },
      "id": "webhook-receiver",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300],
      "webhookId": "trade-webhook"
    },
    {
      "parameters": {
        "functionCode": "// Validate webhook secret\nconst webhookSecret = $input.first().headers['x-webhook-secret'];\nconst expectedSecret = 'your-secret-key'; // Store this in n8n credentials\n\nif (webhookSecret !== expectedSecret) {\n  throw new Error('Invalid webhook secret');\n}\n\n// Extract webhook data\nconst { table, action, old: oldData, new: newData, timestamp } = $input.first().json;\n\n// Process based on action type\nlet processedData = {\n  table,\n  action,\n  timestamp,\n  changes: {}\n};\n\nswitch (action) {\n  case 'INSERT':\n    processedData.data = newData;\n    processedData.message = `New ${table} record created`;\n    break;\n    \n  case 'UPDATE':\n    // Calculate what changed\n    if (oldData && newData) {\n      for (const key in newData) {\n        if (oldData[key] !== newData[key]) {\n          processedData.changes[key] = {\n            old: oldData[key],\n            new: newData[key]\n          };\n        }\n      }\n    }\n    processedData.data = newData;\n    processedData.message = `${table} record updated`;\n    break;\n    \n  case 'DELETE':\n    processedData.data = oldData;\n    processedData.message = `${table} record deleted`;\n    break;\n}\n\nreturn [processedData];"
      },
      "id": "process-webhook",
      "name": "Process Webhook Data",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [450, 300]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $json.action }}",
              "operation": "equals",
              "value2": "INSERT"
            }
          ]
        }
      },
      "id": "check-action",
      "name": "Check Action Type",
      "type": "n8n-nodes-base.switch",
      "typeVersion": 1,
      "position": [650, 300]
    },
    {
      "parameters": {
        "functionCode": "// Handle new trade creation\nconst trade = $input.first().data;\n\n// Example: Send notifications\nconst notifications = [];\n\n// Notify buyer\nnotifications.push({\n  user_id: trade.buyer_id,\n  type: 'trade_created',\n  title: 'Trade Created',\n  message: `Your trade ${trade.id} has been created`,\n  data: {\n    trade_id: trade.id,\n    amount: trade.amount\n  }\n});\n\n// Notify seller\nnotifications.push({\n  user_id: trade.seller_id,\n  type: 'new_trade_order',\n  title: 'New Trade Order',\n  message: `You have a new trade order ${trade.id}`,\n  data: {\n    trade_id: trade.id,\n    amount: trade.amount\n  }\n});\n\nreturn notifications;"
      },
      "id": "handle-insert",
      "name": "Handle Insert",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [850, 200]
    },
    {
      "parameters": {
        "functionCode": "// Handle trade updates\nconst changes = $input.first().changes;\nconst trade = $input.first().data;\nconst actions = [];\n\n// Check what changed\nif (changes.status) {\n  actions.push({\n    type: 'status_change',\n    from: changes.status.old,\n    to: changes.status.new,\n    trade_id: trade.id\n  });\n  \n  // If status changed to 'completed', trigger completion workflow\n  if (changes.status.new === 'completed') {\n    actions.push({\n      type: 'trigger_completion',\n      trade_id: trade.id\n    });\n  }\n}\n\nif (changes.amount) {\n  actions.push({\n    type: 'amount_change',\n    from: changes.amount.old,\n    to: changes.amount.new,\n    trade_id: trade.id\n  });\n}\n\nreturn actions;"
      },
      "id": "handle-update",
      "name": "Handle Update",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [850, 300]
    },
    {
      "parameters": {
        "functionCode": "// Handle trade deletion\nconst trade = $input.first().data;\n\n// Clean up related data\nconst cleanupTasks = [\n  {\n    type: 'cancel_notifications',\n    trade_id: trade.id\n  },\n  {\n    type: 'archive_documents',\n    trade_id: trade.id\n  },\n  {\n    type: 'notify_deletion',\n    users: [trade.buyer_id, trade.seller_id],\n    message: `Trade ${trade.id} has been cancelled`\n  }\n];\n\nreturn cleanupTasks;"
      },
      "id": "handle-delete",
      "name": "Handle Delete",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [850, 400]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "={{ $env.SUPABASE_URL }}/rest/v1/notifications",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "apikey",
              "value": "={{ $env.SUPABASE_SERVICE_KEY }}"
            },
            {
              "name": "Authorization",
              "value": "Bearer {{ $env.SUPABASE_SERVICE_KEY }}"
            },
            {
              "name": "Content-Type",
              "value": "application/json"
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={{ JSON.stringify($json) }}"
      },
      "id": "send-notifications",
      "name": "Send to Supabase",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 3,
      "position": [1050, 300]
    }
  ],
  "connections": {
    "webhook-receiver": {
      "main": [
        [
          {
            "node": "process-webhook",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "process-webhook": {
      "main": [
        [
          {
            "node": "check-action",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "check-action": {
      "main": [
        [
          {
            "node": "handle-insert",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "handle-update",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "handle-delete",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "handle-insert": {
      "main": [
        [
          {
            "node": "send-notifications",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "handle-update": {
      "main": [
        [
          {
            "node": "send-notifications",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "handle-delete": {
      "main": [
        [
          {
            "node": "send-notifications",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

## Step 4: Test the Integration

### Test with cURL:
```bash
curl -X POST https://your-tunnel-id.hooks.n8n.cloud/webhook/trade-webhook \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: your-secret-key" \
  -d '{
    "table": "trades",
    "action": "INSERT",
    "new": {
      "id": "123",
      "buyer_id": "user1",
      "seller_id": "user2",
      "amount": 1000,
      "status": "pending"
    },
    "timestamp": "2024-01-01T00:00:00Z"
  }'
```

### Test with Supabase:
1. Insert a record into your trades table
2. Check n8n execution history
3. Verify the workflow triggered

## Step 5: Production Setup

For production, update your `.env.n8n`:

```bash
# Production webhook URL
N8N_WEBHOOK_URL=https://n8n.yourdomain.com/webhook

# Or use a reverse proxy
N8N_WEBHOOK_URL=https://api.tradease.com/n8n/webhook
```

## Security Best Practices

1. **Use webhook secrets** - Always validate the webhook secret
2. **IP whitelisting** - Restrict webhook access to Supabase IPs
3. **Rate limiting** - Implement rate limiting in n8n
4. **Error handling** - Proper error handling and logging
5. **SSL/TLS** - Always use HTTPS in production

## Common Webhook Patterns

### 1. Status Change Notifications
```javascript
if (changes.status) {
  // Send different notifications based on status
  switch (changes.status.new) {
    case 'approved':
      // Send approval notifications
      break;
    case 'shipped':
      // Send shipping notifications
      break;
    case 'completed':
      // Send completion notifications
      break;
  }
}
```

### 2. Audit Trail
```javascript
// Log all changes to audit table
const auditEntry = {
  table_name: table,
  record_id: newData.id,
  action: action,
  changes: changes,
  user_id: newData.updated_by,
  timestamp: timestamp
};
```

### 3. Data Sync
```javascript
// Sync to external systems
if (action === 'INSERT' || action === 'UPDATE') {
  // Sync to CRM
  // Sync to Analytics
  // Sync to Warehouse
}
```

## Troubleshooting

1. **Webhook not triggering**
   - Check Supabase webhook logs
   - Verify webhook URL is accessible
   - Check n8n is running

2. **Authentication errors**
   - Verify webhook secret matches
   - Check Supabase service key

3. **Data not updating**
   - Check n8n execution logs
   - Verify Supabase permissions
   - Check API rate limits 