# Complete n8n Integration Guide for Trade Ease

## 🚀 Quick Start

### 1. Install n8n

**Option A: Docker (Recommended)**
```bash
# Create n8n data directory
mkdir n8n-data

# Run n8n with Docker
docker run -it --rm \
  --name trade-ease-n8n \
  -p 5678:5678 \
  -e GENERIC_TIMEZONE="America/New_York" \
  -e TZ="America/New_York" \
  -v ./n8n-data:/home/node/.n8n \
  n8nio/n8n
```

**Option B: npm**
```bash
npm install n8n -g
n8n start
```

### 2. Environment Variables

Add these to your `.env` file:
```bash
# n8n Configuration
VITE_N8N_URL=http://localhost:5678
VITE_N8N_API_KEY=your_n8n_api_key
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook

# Supabase Configuration (if not already set)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_KEY=your_supabase_service_key
```

### 3. Access n8n

1. Open your browser to `http://localhost:5678`
2. Create your first account
3. Set up your API key in Settings > API Keys

## 🔧 Integration Components

### 1. Workflow Editor Component

Your app already has a built-in n8n workflow editor. Access it at:
- `/workflow` - Main workflow page
- `/workflow/edit/:id` - Edit specific workflow
- `/workflow/new` - Create new workflow

### 2. API Integration

The integration service provides these functions:

```javascript
import { 
  triggerN8nWorkflow, 
  setupRealtimeToN8n, 
  tradeEaseWorkflows 
} from '@/services/n8n-supabase-integration';

// Trigger a workflow
await triggerN8nWorkflow('workflow-id', { data: 'your-data' });

// Set up realtime triggers
setupRealtimeToN8n('customers', 'customer-workflow-id');

// Use pre-built trade workflows
await tradeEaseWorkflows.onNewTrade(tradeData);
await tradeEaseWorkflows.onShipmentUpdate(shipmentId, newStatus, oldStatus);
```

## 📋 Common Automation Workflows

### 1. Customer Onboarding Workflow

**Trigger**: New customer created in Supabase
**Actions**:
- Send welcome email
- Create initial tasks
- Assign to team member
- Send SMS notification

**n8n Setup**:
1. Create webhook trigger
2. Add HTTP Request node for email
3. Add Supabase node for task creation
4. Add SMS node for notification

### 2. Job Status Update Workflow

**Trigger**: Job status changes
**Actions**:
- Update customer notification
- Create follow-up tasks
- Send status report
- Update calendar events

### 3. Quote Generation Workflow

**Trigger**: New quote request
**Actions**:
- Calculate pricing
- Generate PDF quote
- Send to customer
- Create follow-up reminder

### 4. Payment Processing Workflow

**Trigger**: Payment received
**Actions**:
- Update invoice status
- Send receipt
- Create next steps
- Update financial records

## 🔗 Supabase Integration

### Database Triggers

Set up PostgreSQL triggers to automatically call n8n webhooks:

```sql
-- Example: Trigger on new customer
CREATE OR REPLACE FUNCTION trigger_n8n_customer_webhook()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM net.http_post(
    url := 'http://localhost:5678/webhook/customer-created',
    headers := '{"Content-Type": "application/json"}',
    body := json_build_object(
      'event', 'customer_created',
      'customer_id', NEW.id,
      'customer_data', row_to_json(NEW)
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER customer_n8n_trigger
  AFTER INSERT ON customers
  FOR EACH ROW
  EXECUTE FUNCTION trigger_n8n_customer_webhook();
```

### Real-time Subscriptions

Use the built-in real-time integration:

```javascript
// In your React component
import { setupRealtimeToN8n } from '@/services/n8n-supabase-integration';

useEffect(() => {
  const subscription = setupRealtimeToN8n('jobs', 'job-status-workflow');
  
  return () => {
    subscription.unsubscribe();
  };
}, []);
```

## 🎯 Example Workflows

### Workflow 1: New Customer Automation

```json
{
  "name": "New Customer Onboarding",
  "nodes": [
    {
      "id": "webhook-trigger",
      "type": "n8n-nodes-base.webhook",
      "position": [100, 100],
      "parameters": {
        "path": "new-customer",
        "options": {}
      }
    },
    {
      "id": "send-welcome-email",
      "type": "n8n-nodes-base.emailSend",
      "position": [300, 100],
      "parameters": {
        "toEmail": "={{ $json.customer.email }}",
        "subject": "Welcome to Trade Ease!",
        "text": "Hi {{ $json.customer.name }}, welcome to our platform!"
      }
    },
    {
      "id": "create-tasks",
      "type": "n8n-nodes-base.httpRequest",
      "position": [500, 100],
      "parameters": {
        "url": "{{ $env.VITE_SUPABASE_URL }}/rest/v1/tasks",
        "method": "POST",
        "headers": {
          "apikey": "{{ $env.VITE_SUPABASE_ANON_KEY }}",
          "Authorization": "Bearer {{ $env.VITE_SUPABASE_ANON_KEY }}",
          "Content-Type": "application/json"
        },
        "body": {
          "customer_id": "={{ $json.customer.id }}",
          "title": "Initial Consultation",
          "description": "Schedule initial consultation with new customer"
        }
      }
    }
  ],
  "connections": {
    "webhook-trigger": {
      "main": [["send-welcome-email"]]
    },
    "send-welcome-email": {
      "main": [["create-tasks"]]
    }
  }
}
```

### Workflow 2: Job Status Updates

```json
{
  "name": "Job Status Notifications",
  "nodes": [
    {
      "id": "status-webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [100, 100],
      "parameters": {
        "path": "job-status-update"
      }
    },
    {
      "id": "check-status",
      "type": "n8n-nodes-base.if",
      "position": [300, 100],
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $json.new_status }}",
              "operation": "equals",
              "value2": "completed"
            }
          ]
        }
      }
    },
    {
      "id": "send-completion-email",
      "type": "n8n-nodes-base.emailSend",
      "position": [500, 50],
      "parameters": {
        "toEmail": "={{ $json.customer_email }}",
        "subject": "Job Completed!",
        "text": "Your job has been completed successfully."
      }
    },
    {
      "id": "send-follow-up",
      "type": "n8n-nodes-base.emailSend",
      "position": [500, 150],
      "parameters": {
        "toEmail": "={{ $json.customer_email }}",
        "subject": "Job Update",
        "text": "Your job status has been updated to: {{ $json.new_status }}"
      }
    }
  ],
  "connections": {
    "status-webhook": {
      "main": [["check-status"]]
    },
    "check-status": {
      "main": [
        ["send-completion-email"],
        ["send-follow-up"]
      ]
    }
  }
}
```

## 🛠️ Development Workflow

### 1. Create Workflow in n8n
1. Go to `http://localhost:5678`
2. Click "New Workflow"
3. Add your trigger (webhook, schedule, etc.)
4. Add your action nodes
5. Connect the nodes
6. Test the workflow

### 2. Integrate with Your App
1. Copy the webhook URL from n8n
2. Use it in your Supabase triggers or API calls
3. Test the integration

### 3. Monitor and Debug
- Use n8n's execution history
- Check your app's console logs
- Monitor Supabase logs

## 🔒 Security Considerations

### 1. API Key Management
- Store n8n API keys securely
- Use environment variables
- Rotate keys regularly

### 2. Webhook Security
- Use webhook signatures
- Validate incoming data
- Rate limit webhook endpoints

### 3. Data Privacy
- Only send necessary data to n8n
- Encrypt sensitive information
- Follow GDPR compliance

## 📊 Monitoring and Analytics

### 1. Workflow Execution Monitoring
```javascript
// Monitor workflow executions
const monitorWorkflow = async (workflowId) => {
  const response = await fetch(`${n8nUrl}/rest/executions?workflowId=${workflowId}`);
  const executions = await response.json();
  return executions;
};
```

### 2. Error Handling
```javascript
// Handle workflow errors
const handleWorkflowError = (error) => {
  console.error('Workflow execution failed:', error);
  // Send notification to admin
  // Log to monitoring service
  // Retry if appropriate
};
```

## 🚀 Production Deployment

### 1. n8n Production Setup
```bash
# Use Docker Compose for production
version: '3.8'
services:
  n8n:
    image: n8nio/n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=secure_password
      - N8N_ENCRYPTION_KEY=your_encryption_key
    volumes:
      - n8n_data:/home/node/.n8n
```

### 2. Environment Variables
```bash
# Production environment
VITE_N8N_URL=https://your-n8n-domain.com
VITE_N8N_API_KEY=n8n_api_76b5e64e09005adc3ff4af8d060ecb69776ec9990729513358e124f9950c6475179898da10115024
VITE_N8N_WEBHOOK_URL=https://your-n8n-domain.com/webhook
```

## 🎉 Next Steps

1. **Start with Simple Workflows**: Begin with basic email notifications
2. **Test Thoroughly**: Use n8n's test mode before activating
3. **Monitor Performance**: Watch execution times and success rates
4. **Scale Gradually**: Add more complex workflows as needed
5. **Document Your Workflows**: Keep track of what each workflow does

## 📚 Resources

- [n8n Documentation](https://docs.n8n.io/)
- [n8n Community](https://community.n8n.io/)
- [Supabase Documentation](https://supabase.com/docs)
- [Your App's Integration Service](src/services/n8n-supabase-integration.js)

## 🆘 Troubleshooting

### Common Issues:

1. **n8n not accessible**
   - Check if n8n is running on port 5678
   - Verify firewall settings
   - Check Docker container status

2. **Webhook not triggering**
   - Verify webhook URL is correct
   - Check n8n workflow is active
   - Test webhook manually

3. **CORS errors**
   - Add your app URL to n8n CORS settings
   - Check browser console for specific errors

4. **Authentication issues**
   - Verify API keys are correct
   - Check n8n authentication settings

For more help, check the n8n community forums or your app's documentation. 