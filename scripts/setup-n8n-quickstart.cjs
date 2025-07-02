#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up n8n for Trade Ease...\n');

// Check if Docker is available
function checkDocker() {
  try {
    execSync('docker --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Create n8n data directory
const n8nDataDir = path.join(__dirname, '..', 'n8n-data');
if (!fs.existsSync(n8nDataDir)) {
  fs.mkdirSync(n8nDataDir, { recursive: true });
  console.log('✅ Created n8n-data directory');
}

// Create docker-compose file for n8n
const dockerComposeContent = `version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: trade-ease-n8n
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      - GENERIC_TIMEZONE=America/New_York
      - TZ=America/New_York
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=tradeease123
      - N8N_ENCRYPTION_KEY=your-secret-encryption-key-change-this
    volumes:
      - ./n8n-data:/home/node/.n8n
    networks:
      - trade-ease-network

networks:
  trade-ease-network:
    driver: bridge
`;

const dockerComposePath = path.join(__dirname, '..', 'docker-compose.n8n.yml');
fs.writeFileSync(dockerComposePath, dockerComposeContent);
console.log('✅ Created docker-compose.n8n.yml');

// Create environment template
const envTemplate = `# n8n Configuration
VITE_N8N_URL=http://localhost:5678
VITE_N8N_API_KEY=n8n_api_6209b969611232dbcf1350a6cf8b4258a82a2c43903cbe44c694c06a35032ecb16603d8c6e75f1e1
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook

# Add these to your existing .env file
`;

const envPath = path.join(__dirname, '..', '.env.n8n.template');
fs.writeFileSync(envPath, envTemplate);
console.log('✅ Created .env.n8n.template');

// Create sample workflow
const sampleWorkflow = {
  name: "Trade Ease - New Customer Welcome",
  nodes: [
    {
      id: "webhook-trigger",
      name: "New Customer Webhook",
      type: "n8n-nodes-base.webhook",
      typeVersion: 1,
      position: [100, 100],
      parameters: {
        path: "new-customer",
        options: {}
      }
    },
    {
      id: "send-welcome-email",
      name: "Send Welcome Email",
      type: "n8n-nodes-base.emailSend",
      typeVersion: 1,
      position: [300, 100],
      parameters: {
        toEmail: "={{ $json.customer.email }}",
        subject: "Welcome to Trade Ease!",
        text: "Hi {{ $json.customer.name }}, welcome to our platform! We're excited to help you with your trade needs."
      }
    },
    {
      id: "create-task",
      name: "Create Initial Task",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 1,
      position: [500, 100],
      parameters: {
        url: "{{ $env.VITE_SUPABASE_URL }}/rest/v1/tasks",
        method: "POST",
        headers: {
          "apikey": "{{ $env.VITE_SUPABASE_ANON_KEY }}",
          "Authorization": "Bearer {{ $env.VITE_SUPABASE_ANON_KEY }}",
          "Content-Type": "application/json"
        },
        body: {
          "customer_id": "={{ $json.customer.id }}",
          "title": "Initial Consultation",
          "description": "Schedule initial consultation with new customer",
          "status": "pending"
        }
      }
    }
  ],
  connections: {
    "webhook-trigger": {
      "main": [["send-welcome-email"]]
    },
    "send-welcome-email": {
      "main": [["create-task"]]
    }
  },
  active: false,
  settings: {},
  staticData: null
};

const workflowDir = path.join(__dirname, '..', 'n8n-workflows');
if (!fs.existsSync(workflowDir)) {
  fs.mkdirSync(workflowDir, { recursive: true });
}

const workflowPath = path.join(workflowDir, 'new-customer-welcome.json');
fs.writeFileSync(workflowPath, JSON.stringify(sampleWorkflow, null, 2));
console.log('✅ Created sample workflow: n8n-workflows/new-customer-welcome.json');

// Create package.json scripts
const packageJsonPath = path.join(__dirname, '..', 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }
  
  packageJson.scripts['n8n:start'] = 'docker-compose -f docker-compose.n8n.yml up -d';
  packageJson.scripts['n8n:stop'] = 'docker-compose -f docker-compose.n8n.yml down';
  packageJson.scripts['n8n:logs'] = 'docker-compose -f docker-compose.n8n.yml logs -f n8n';
  packageJson.scripts['n8n:restart'] = 'docker-compose -f docker-compose.n8n.yml restart n8n';
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Added n8n scripts to package.json');
}

console.log('\n🎉 n8n setup complete!');
console.log('\n📋 Next steps:');
console.log('1. Add n8n environment variables to your .env file:');
console.log('   VITE_N8N_URL=http://localhost:5678');
console.log('   VITE_N8N_API_KEY=n8n_api_76b5e64e09005adc3ff4af8d060ecb69776ec9990729513358e124f9950c6475179898da10115024');
console.log('   VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook');
console.log('\n2. Start n8n: npm run n8n:start');
console.log('\n3. Access n8n at: http://localhost:5678');
console.log('   Username: admin');
console.log('   Password: tradeease123');
console.log('\n4. Import the sample workflow from n8n-workflows/new-customer-welcome.json');
console.log('\n5. Test the integration in your app at /workflow');
console.log('\n📚 For more details, see N8N_INTEGRATION_GUIDE.md'); 