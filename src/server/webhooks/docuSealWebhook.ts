import express from 'express';
import bodyParser from 'body-parser';
import { processWebhookEvent } from '../../services/docuSealService';

const router = express.Router();

// Parse JSON bodies
router.use(bodyParser.json());

// Webhook endpoint
router.post('/webhooks/docuseal', async (req, res) => {
  try {
    // Verify webhook signature if DocuSeal provides one
    const signature = req.headers['x-docuseal-signature'];
    
    if (!signature || typeof signature !== 'string') {
      return res.status(401).send('Invalid signature');
    }
    
    const event = req.body;
    
    // Process the webhook event
    await processWebhookEvent(event, signature);
    
    // Acknowledge receipt of the webhook
    res.status(200).send('Webhook received');
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).send('Error processing webhook');
  }
});

export default router; 