/**
 * src/index.js
 * Basic Express server for a WhatsApp bot platform.
 *
 * Install: npm install express dotenv body-parser
 * Run:    node src/index.js
 *
 * This file is a minimal starting point — replace sendMessage() with
 * your WhatsApp provider's API implementation (WhatsApp Cloud API, Twilio, etc.)
 */

const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('WhatsApp bot platform is running');
});

// Webhook endpoint for incoming messages from your WhatsApp provider
app.post('/webhook', async (req, res) => {
  const payload = req.body;
  console.log('Received webhook payload:', JSON.stringify(payload, null, 2));

  // Basic examples — adapt to the shape your provider sends
  const messages = payload?.messages || payload?.entry || null;

  // Example: message extraction (may differ per provider)
  const from = payload?.from || (messages && messages[0]?.from);
  const text = payload?.text?.body || (messages && messages[0]?.text?.body) || '';

  // Simple echo handler (replace with your logic)
  if (from && text) {
    try {
      await sendMessage(from, `Echo: ${text}`);
    } catch (err) {
      console.error('sendMessage error:', err);
    }
  }

  // Respond quickly to webhook provider
  res.sendStatus(200);
});

// Placeholder sendMessage — implement using your WhatsApp provider API
async function sendMessage(to, text) {
  // Example: WhatsApp Cloud API / Twilio integration should go here.
  // Keep this function async and return a promise.
  console.log(`(placeholder) sendMessage to=${to} text=${text}`);
  return Promise.resolve({ ok: true });
}

app.listen(PORT, () => {
  console.log(`WhatsApp bot platform listening on port ${PORT}`);
});
