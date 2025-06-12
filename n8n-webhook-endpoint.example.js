// Example API endpoint for handling n8n webhooks
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
