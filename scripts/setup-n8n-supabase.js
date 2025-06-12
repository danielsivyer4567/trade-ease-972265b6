#!/usr/bin/env node

/**
 * Setup script for n8n-Supabase integration
 * Run this script to configure your environment
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load existing .env file
dotenv.config();

console.log('🚀 Setting up n8n-Supabase integration for Trade Ease...\n');

// Check for required environment variables
const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nPlease add these to your .env file first.');
  process.exit(1);
}

// Create n8n environment configuration
const n8nEnvContent = `# n8n Configuration
N8N_PORT=5678
N8N_PROTOCOL=http
N8N_HOST=localhost
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=changeme123
N8N_WEBHOOK_URL=https://your-tunnel-id.hooks.n8n.cloud/webhook

# Supabase Configuration (from main .env)
SUPABASE_URL=https://wxwbxupdisbofesaygqj.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4d2J4dXBkaXNib2Zlc2F5Z3FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwMDI0OTgsImV4cCI6MjA1NTU3ODQ5OH0.xhjkVsi9XZMwobUMsdYE0e1FXQeT_uNLaTHquGvRxjI
SUPABASE_SERVICE_KEY=${process.env.SUPABASE_SERVICE_KEY || eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4d2J4dXBkaXNib2Zlc2F5Z3FqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDAwMjQ5OCwiZXhwIjoyMDU1NTc4NDk4fQ.8ypq7i-y-m9xRjauPx5Fscx-nLh27PLHTPIc6LUIuDs

# Database Configuration
DATABASE_TYPE=postgresdb
DATABASE_POSTGRESDB_HOST=db.${process.env.VITE_SUPABASE_URL?.replace('https://', '').split('.')[0]}.supabase.co
DATABASE_POSTGRESDB_PORT=5432
DATABASE_POSTGRESDB_DATABASE=postgres
DATABASE_POSTGRESDB_USER=postgres
DATABASE_POSTGRESDB_PASSWORD=${process.env.DATABASE_PASSWORD || 'YOUR_DB_PASSWORD_HERE'}

# n8n Data Directory
N8N_USER_FOLDER=./n8n-data
`;

// Write n8n .env file
const n8nEnvPath = path.join(__dirname, '..', '.env.n8n');
fs.writeFileSync(n8nEnvPath, n8nEnvContent);
console.log('✅ Created .env.n8n file');

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
    env_file:
      - .env.n8n
    volumes:
      - ./n8n-data:/home/node/.n8n
      - ./n8n-workflows:/workflows
    networks:
      - trade-ease-network

networks:
  trade-ease-network:
    driver: bridge
`;

const dockerComposePath = path.join(__dirname, '..', 'docker-compose.n8n.yml');
fs.writeFileSync(dockerComposePath, dockerComposeContent);
console.log('✅ Created docker-compose.n8n.yml');

// Create package.json scripts
console.log('\n📝 Add these scripts to your package.json:');
console.log(`
  "n8n:start": "docker-compose -f docker-compose.n8n.yml up -d",
  "n8n:stop": "docker-compose -f docker-compose.n8n.yml down",
  "n8n:logs": "docker-compose -f docker-compose.n8n.yml logs -f",
  "n8n:local": "npx n8n start --tunnel"
`);

// Instructions
console.log('\n📋 Next steps:');
console.log('1. Update the SUPABASE_SERVICE_KEY in .env.n8n with your actual service key');
console.log('2. Update the DATABASE_POSTGRESDB_PASSWORD in .env.n8n with your database password');
console.log('3. Start n8n with Docker: npm run n8n:start');
console.log('4. Or start n8n locally: npm run n8n:local');
console.log('5. Access n8n at http://localhost:5678');
console.log('6. Import the workflow from n8n-workflows/trade-ease-supabase-workflow.json');
console.log('\n✨ Setup complete!');

// Create a sample API endpoint for n8n webhooks
const apiEndpointContent = `// Example API endpoint for handling n8n webhooks
// Add this to your Vite/Express server

import { handleN8nWebhook } from '../src/services/n8n-supabase-integration.js';

// Express route example
app.post('/api/n8n/webhook', handleN8nWebhook);

// Or as a Vite server plugin
export default {
  name: 'n8n-webhook-handler',
  configureServer(server) {
    server.middlewares.use('/api/n8n/webhook', async (req, res) => {
      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
          req.body = JSON.parse(body);
          await handleN8nWebhook(req, res);
        });
      }
    });
  }
};
`;

const apiEndpointPath = path.join(__dirname, '..', 'n8n-webhook-endpoint.example.js');
fs.writeFileSync(apiEndpointPath, apiEndpointContent);
console.log('\n💡 Check n8n-webhook-endpoint.example.js for webhook integration example'); 