// These type definitions are for NextJS API routes
type NextApiRequest = {
  method: string;
  body: any;
};

type NextApiResponse = {
  status: (code: number) => {
    json: (data: any) => void;
  };
};

// Import twilio with require since the module is already installed
const twilio = require('twilio');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, message, credentials } = req.body;

    if (!to || !message || !credentials) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const { accountSid, authToken, phoneNumber } = credentials;

    // Initialize Twilio client
    const client = twilio(accountSid, authToken);

    // Send SMS
    const result = await client.messages.create({
      body: message,
      to: to,
      from: phoneNumber
    });

    return res.status(200).json({ 
      success: true, 
      messageId: result.sid 
    });
  } catch (error) {
    console.error('Error sending SMS:', error);
    return res.status(500).json({ 
      error: 'Failed to send SMS',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 