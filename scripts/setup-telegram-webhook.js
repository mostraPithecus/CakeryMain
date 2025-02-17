import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Load environment variables from .env file
dotenv.config({ path: resolve(__dirname, '../.env') });
const TELEGRAM_BOT_TOKEN = process.env.VITE_TELEGRAM_BOT_TOKEN;
const WEBHOOK_URL = process.env.VITE_APP_URL ? `${process.env.VITE_APP_URL}/api/telegram/webhook` : null;
if (!TELEGRAM_BOT_TOKEN) {
    console.error('Error: VITE_TELEGRAM_BOT_TOKEN is not set in .env file');
    process.exit(1);
}
if (!WEBHOOK_URL) {
    console.error('Error: VITE_APP_URL is not set in .env file');
    process.exit(1);
}
async function setupWebhook() {
    try {
        console.log(`Setting up webhook for URL: ${WEBHOOK_URL}`);
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: WEBHOOK_URL,
                allowed_updates: ['message', 'callback_query'],
            }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(`Telegram API error: ${JSON.stringify(data)}`);
        }
        if (data.ok) {
            console.log('✅ Webhook setup successful!');
            console.log(`Webhook URL: ${WEBHOOK_URL}`);
        }
        else {
            console.error('❌ Webhook setup failed:', data.description);
        }
    }
    catch (error) {
        console.error('Error setting up webhook:', error);
        process.exit(1);
    }
}
setupWebhook();
