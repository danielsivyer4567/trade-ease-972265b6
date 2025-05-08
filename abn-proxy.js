const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 4000; // You can change this port if needed

app.use(cors());

const ABN_GUID = 'YOUR_ABN_GUID_HERE'; // TODO: Replace with your real ABN Lookup API GUID

app.get('/api/abn-lookup', async (req, res) => {
  const abn = req.query.abn;
  if (!abn) return res.status(400).json({ error: 'ABN is required' });

  try {
    const url = `https://abr.business.gov.au/json/AbnDetails.aspx?abn=${abn}&guid=${ABN_GUID}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ABN details', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`ABN proxy server running on port ${PORT}`);
}); 