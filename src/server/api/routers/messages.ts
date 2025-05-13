const express = require('express');
const router = express.Router();
import { MessagingService } from '@/services/MessagingService';

router.post('/send', async (req, res) => {
  const { to, body } = req.body;
  const result = await MessagingService.sendMessage({
    platform: 'sms',
    to,
    body,
    // You can add more metadata here if needed
  });
  if (result.success) {
    res.json({ success: true, message: result.message });
  } else {
    res.status(500).json({ success: false, error: result.error });
  }
});

export default router; 