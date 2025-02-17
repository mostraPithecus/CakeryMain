import express from 'express';
import type { Request, Response } from 'express';
import { handleTelegramWebhook } from '../src/lib/telegram';
import { config } from '../src/config/env';

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      username?: string;
      language_code?: string;
    };
    chat: {
      id: number;
      first_name: string;
      username?: string;
      type: string;
    };
    date: number;
    text?: string;
    entities?: Array<{
      offset: number;
      length: number;
      type: string;
    }>;
  };
}

const app = express();
app.use(express.json());

const PORT = 3000;

// Test endpoint
app.get('/telegram-webhook', (req: Request, res: Response) => {
  console.log('GET request to webhook endpoint');
  res.json({ 
    ok: true, 
    message: 'Telegram webhook endpoint is working',
    timestamp: new Date().toISOString()
  });
});

// Webhook endpoint
app.post('/telegram-webhook', async (req: Request<{}, {}, TelegramUpdate>, res: Response) => {
  console.log('🎯 Telegram webhook endpoint hit!');
  console.log('Headers:', req.headers);
  console.log('Body:', JSON.stringify(req.body, null, 2));

  try {
    const response = await handleTelegramWebhook(req.body);
    console.log('✅ Webhook response:', JSON.stringify(response, null, 2));
    res.json(response);
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({ 
      ok: false, 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Webhook server running on port ${PORT}`);
  console.log('Test URL: http://localhost:3000/telegram-webhook');
});
