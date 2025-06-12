# Supabase + n8n Integration Setup Guide

## Prerequisites
- Supabase project with API keys
- n8n instance running
- Node.js environment

## 1. Environment Configuration

### Create a `.env` file for n8n:
```bash
# n8n Configuration
N8N_PORT=5678
N8N_PROTOCOL=http
N8N_HOST=localhost
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your_password_here

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret

# Database
DATABASE_TYPE=postgresdb
DATABASE_POSTGRESDB_HOST=db.your-project.supabase.co
DATABASE_POSTGRESDB_PORT=5432
DATABASE_POSTGRESDB_DATABASE=postgres
DATABASE_POSTGRESDB_USER=postgres
DATABASE_POSTGRESDB_PASSWORD=your-db-password
```

## 2. n8n Credentials Setup

### Supabase API Credentials (HTTP Request Node)
```json
{
  "name": "Supabase API",
  "type": "httpBasicAuth",
  "data": {
    "url": "https://your-project.supabase.co",
    "headers": {
      "apikey": "your-anon-key",
      "Authorization": "Bearer your-anon-key",
      "Content-Type": "application/json"
    }
  }
}
```

### Supabase Database Credentials (Postgres Node)
```json
{
  "name": "Supabase Database",
  "type": "postgres",
  "data": {
    "host": "db.your-project.supabase.co",
    "port": 5432,
    "database": "postgres",
    "user": "postgres",
    "password": "your-db-password",
    "ssl": {
      "rejectUnauthorized": false
    }
  }
}
```

## 3. Example n8n Workflows

### Workflow 1: Insert Data into Supabase
```json
{
  "name": "Insert to Supabase",
  "nodes": [
    {
      "parameters": {
        "method": "POST",
        "url": "={{$credentials.supabase.url}}/rest/v1/your_table",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "apikey",
              "value": "={{$credentials.supabase.apikey}}"
            },
            {
              "name": "Authorization",
              "value": "Bearer {{$credentials.supabase.apikey}}"
            },
            {
              "name": "Content-Type",
              "value": "application/json"
            },
            {
              "name": "Prefer",
              "value": "return=representation"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "column1",
              "value": "value1"
            },
            {
              "name": "column2",
              "value": "value2"
            }
          ]
        }
      },
      "name": "HTTP Request",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 3,
      "position": [250, 300]
    }
  ]
}
```

### Workflow 2: Query Supabase Data
```json
{
  "name": "Query Supabase",
  "nodes": [
    {
      "parameters": {
        "method": "GET",
        "url": "={{$credentials.supabase.url}}/rest/v1/your_table?select=*&limit=10",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "apikey",
              "value": "={{$credentials.supabase.apikey}}"
            },
            {
              "name": "Authorization",
              "value": "Bearer {{$credentials.supabase.apikey}}"
            }
          ]
        }
      },
      "name": "HTTP Request",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 3,
      "position": [250, 300]
    }
  ]
}
```

### Workflow 3: Realtime Subscription Handler
```json
{
  "name": "Supabase Webhook Handler",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "supabase-webhook",
        "responseMode": "onReceived",
        "responseData": "success"
      },
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300],
      "webhookId": "supabase-changes"
    },
    {
      "parameters": {
        "functionCode": "// Parse Supabase webhook payload\nconst payload = items[0].json;\nconst { type, table, record, old_record } = payload;\n\n// Process based on event type\nswitch(type) {\n  case 'INSERT':\n    return [{\n      json: {\n        action: 'created',\n        table: table,\n        data: record\n      }\n    }];\n  case 'UPDATE':\n    return [{\n      json: {\n        action: 'updated',\n        table: table,\n        old: old_record,\n        new: record\n      }\n    }];\n  case 'DELETE':\n    return [{\n      json: {\n        action: 'deleted',\n        table: table,\n        data: old_record\n      }\n    }];\n  default:\n    return items;\n}"
      },
      "name": "Process Webhook",
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [450, 300]
    }
  ]
}
```

## 4. Helper Functions for n8n

### Supabase Auth Helper
```javascript
// Function node code for generating Supabase JWT
const jwt = require('jsonwebtoken');

const supabaseUrl = $env.SUPABASE_URL;
const supabaseAnonKey = $env.SUPABASE_ANON_KEY;
const supabaseServiceKey = $env.SUPABASE_SERVICE_KEY;

// Generate custom JWT for service role
function generateServiceToken(userId) {
  const payload = {
    aud: 'authenticated',
    exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
    sub: userId,
    role: 'service_role'
  };
  
  return jwt.sign(payload, $env.SUPABASE_JWT_SECRET);
}

// Make authenticated request
async function supabaseRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'Content-Type': 'application/json'
    }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(`${supabaseUrl}/rest/v1/${endpoint}`, options);
  return response.json();
}

// Example usage
const users = await supabaseRequest('users?select=*');
return [{ json: { users } }];
```

### RPC Function Caller
```javascript
// Function node for calling Supabase RPC functions
const rpcFunctionName = 'your_function_name';
const params = {
  param1: 'value1',
  param2: 'value2'
};

const response = await $http.post({
  url: `${$env.SUPABASE_URL}/rest/v1/rpc/${rpcFunctionName}`,
  headers: {
    'apikey': $env.SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${$env.SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json'
  },
  body: params
});

return [{ json: response }];
```

## 5. Docker Compose Setup

### docker-compose.yml
```yaml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - N8N_HOST=localhost
      - WEBHOOK_URL=http://localhost:5678/
      - GENERIC_TIMEZONE=America/New_York
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=${N8N_BASIC_AUTH_USER}
      - N8N_BASIC_AUTH_PASSWORD=${N8N_BASIC_AUTH_PASSWORD}
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_KEY=${SUPABASE_SERVICE_KEY}
    volumes:
      - n8n_data:/home/node/.n8n
      - ./workflows:/workflows
    networks:
      - n8n-network

volumes:
  n8n_data:

networks:
  n8n-network:
    driver: bridge
```

## 6. Common Use Cases

### 1. User Registration Flow
```javascript
// Webhook receives registration data
// Insert into Supabase auth.users
// Send welcome email
// Update user metadata
```

### 2. Data Sync Pipeline
```javascript
// Schedule trigger every hour
// Query external API
// Transform data
// Upsert to Supabase tables
```

### 3. File Upload Handler
```javascript
// Receive file via webhook
// Upload to Supabase Storage
// Save metadata to database
// Return public URL
```

## 7. Security Best Practices

1. **Use Service Role Key only in n8n backend**
2. **Implement Row Level Security (RLS) in Supabase**
3. **Validate all webhook payloads**
4. **Use environment variables for sensitive data**
5. **Implement rate limiting on webhooks**
6. **Regular key rotation**

## 8. Troubleshooting

### Common Issues:
1. **401 Unauthorized**: Check API keys and headers
2. **CORS errors**: Configure Supabase CORS settings
3. **Connection timeout**: Check firewall and network settings
4. **SSL errors**: Use proper SSL configuration in Postgres node

### Debug Tips:
- Enable n8n debug mode: `N8N_LOG_LEVEL=debug`
- Check Supabase logs in dashboard
- Use HTTP Request node's "Full Response" option
- Test with Postman/curl first 