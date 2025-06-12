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
-- Create trades table
CREATE TABLE IF NOT EXISTS trades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trade_id VARCHAR(255) UNIQUE NOT NULL,
  buyer_id UUID REFERENCES auth.users(id),
  seller_id UUID REFERENCES auth.users(id),
  product_id UUID,
  product_name VARCHAR(255),
  quantity DECIMAL(10, 2) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  amount DECIMAL(10, 2) GENERATED ALWAYS AS (quantity * price) STORED,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'pending',
  payment_status VARCHAR(50) DEFAULT 'pending',
  shipping_status VARCHAR(50) DEFAULT 'pending',
  origin_country VARCHAR(100),
  destination_country VARCHAR(100),
  incoterm VARCHAR(10),
  payment_terms TEXT,
  delivery_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create shipments table
CREATE TABLE IF NOT EXISTS shipments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id VARCHAR(255) UNIQUE NOT NULL,
  trade_id UUID REFERENCES trades(id) ON DELETE CASCADE,
  carrier VARCHAR(255),
  tracking_number VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  origin_address JSONB,
  destination_address JSONB,
  estimated_delivery DATE,
  actual_delivery DATE,
  shipping_cost DECIMAL(10, 2),
  weight DECIMAL(10, 2),
  dimensions JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id VARCHAR(255) UNIQUE NOT NULL,
  trade_id UUID REFERENCES trades(id) ON DELETE CASCADE,
  document_type VARCHAR(100) NOT NULL,
  document_name VARCHAR(255) NOT NULL,
  file_url TEXT,
  file_size INTEGER,
  mime_type VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending',
  verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_trades_buyer_id ON trades(buyer_id);
CREATE INDEX idx_trades_seller_id ON trades(seller_id);
CREATE INDEX idx_trades_status ON trades(status);
CREATE INDEX idx_trades_created_at ON trades(created_at DESC);

CREATE INDEX idx_shipments_trade_id ON shipments(trade_id);
CREATE INDEX idx_shipments_status ON shipments(status);

CREATE INDEX idx_documents_trade_id ON documents(trade_id);
CREATE INDEX idx_documents_type ON documents(document_type);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- Enable Row Level Security
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for trades
CREATE POLICY "Users can view their own trades" ON trades
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can create trades" ON trades
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own trades" ON trades
  FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_trades_updated_at BEFORE UPDATE ON trades
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shipments_updated_at BEFORE UPDATE ON shipments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
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