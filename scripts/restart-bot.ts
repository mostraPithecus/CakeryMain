import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

interface TelegramResponse {
  ok: boolean;
  description?: string;
  result?: any;
}

async function restartBot() {
  try {
    // Force reload .env file
    const envPath = path.join(process.cwd(), '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars: Record<string, string> = {};
    
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    });

    const botToken = envVars.VITE_TELEGRAM_BOT_TOKEN;
    const appUrl = envVars.VITE_APP_URL;

    if (!botToken || !appUrl) {
      throw new Error('Missing environment variables. Check your .env file.');
    }

    console.log('\n🔍 Current Configuration:');
    console.log('Bot Token:', botToken);
    console.log('Webhook URL:', `${appUrl}/api/webhook`);

    // 1. Check current webhook
    console.log('\n1️⃣ Checking current webhook...');
    const infoResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/getWebhookInfo`
    );
    const currentInfo = await infoResponse.json() as TelegramResponse;
    console.log('Current webhook:', JSON.stringify(currentInfo, null, 2));

    // 2. Delete existing webhook
    console.log('\n2️⃣ Deleting existing webhook...');
    const deleteResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/deleteWebhook?drop_pending_updates=true`
    );
    const deleteResult = await deleteResponse.json() as TelegramResponse;
    
    if (!deleteResult.ok) {
      throw new Error(`Failed to delete webhook: ${deleteResult.description || 'Unknown error'}`);
    }
    console.log('✅ Old webhook deleted');

    // 3. Set up new webhook
    console.log('\n3️⃣ Setting up new webhook...');
    const webhookUrl = `${appUrl}/api/webhook`;
    const setResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/setWebhook`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: webhookUrl,
          allowed_updates: ['message', 'callback_query'],
          drop_pending_updates: true
        }),
      }
    );
    
    const setResult = await setResponse.json() as TelegramResponse;
    if (!setResult.ok) {
      throw new Error(`Failed to set webhook: ${setResult.description || 'Unknown error'}`);
    }
    console.log('✅ New webhook set up');

    // 4. Verify new webhook
    console.log('\n4️⃣ Verifying new webhook...');
    const verifyResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/getWebhookInfo`
    );
    const verifyResult = await verifyResponse.json() as TelegramResponse;
    console.log('New webhook info:', JSON.stringify(verifyResult, null, 2));

    console.log('\n✨ Bot restart complete!');
    console.log('Try sending /help to your bot to test the connection.');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

restartBot();
