import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

interface TelegramResponse {
  ok: boolean;
  result?: any;
  description?: string;
  error_code?: number;
}

async function askQuestion(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  try {
    return await new Promise((resolve) => {
      rl.question(question, (answer) => {
        resolve(answer.trim().toLowerCase());
      });
    });
  } finally {
    rl.close();
  }
}

async function updateEnvUrl(newUrl: string) {
  const envPath = path.join(process.cwd(), '.env');
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Replace or add VITE_APP_URL
  if (envContent.includes('VITE_APP_URL=')) {
    envContent = envContent.replace(/VITE_APP_URL=.*/, `VITE_APP_URL=${newUrl}`);
  } else {
    envContent += `\nVITE_APP_URL=${newUrl}`;
  }
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Updated .env with new URL:', newUrl);
}

async function setupWebhook(retryCount = 0) {
  if (retryCount > 3) {
    console.error('❌ Too many retries. Please check your configuration and try again.');
    process.exit(1);
  }

  try {
    // Read env file directly
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
      throw new Error('Missing environment variables. Make sure VITE_TELEGRAM_BOT_TOKEN and VITE_APP_URL are set in .env');
    }

    console.log('\n📱 Current Configuration:');
    console.log('Bot Token:', botToken);
    console.log('App URL:', appUrl);

    const isCorrect = await askQuestion('\n❓ Is this configuration correct? (y/n): ');
    
    if (isCorrect !== 'y') {
      const newUrl = await askQuestion('\n📝 Enter your new ngrok URL: ');
      if (!newUrl) {
        console.log('❌ No URL provided. Exiting...');
        process.exit(0);
      }
      
      await updateEnvUrl(newUrl);
      console.log('🔄 Restarting setup with new URL...\n');
      return setupWebhook(retryCount + 1);
    }

    const webhookUrl = `${appUrl}/telegram-webhook`;

    // First, get webhook info
    console.log('\n🔍 Checking current webhook info...');
    const infoResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/getWebhookInfo`
    );
    const infoResult = await infoResponse.json() as TelegramResponse;
    console.log('Current webhook info:', JSON.stringify(infoResult, null, 2));

    // Delete existing webhook
    console.log('\n🗑️ Deleting existing webhook...');
    const deleteResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/deleteWebhook?drop_pending_updates=true`,
      { method: 'POST' }
    );
    const deleteResult = await deleteResponse.json() as TelegramResponse;
    
    if (!deleteResult.ok) {
      throw new Error(`Failed to delete webhook: ${deleteResult.description || 'Unknown error'}`);
    }
    
    console.log('✅ Existing webhook deleted');

    // Set up new webhook
    console.log(`\n🔄 Setting up webhook at ${webhookUrl}`);
    const response = await fetch(
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
    
    const result = await response.json() as TelegramResponse;
    
    if (result.ok) {
      console.log('✅ Webhook set up successfully');

      // Verify webhook is set correctly
      const verifyResponse = await fetch(
        `https://api.telegram.org/bot${botToken}/getWebhookInfo`
      );
      const verifyResult = await verifyResponse.json() as TelegramResponse;
      console.log('\nFinal webhook info:', JSON.stringify(verifyResult, null, 2));

      console.log('\n📋 Next steps:');
      console.log('1. Make sure your development server is running (npm run dev)');
      console.log('2. Make sure ngrok tunnel is running and points to the correct port');
      console.log('3. Try sending /help to your bot');
      console.log('\n🔍 If the bot doesn\'t respond, check:');
      console.log('- Development server console for incoming webhook requests');
      console.log('- That ngrok tunnel points to the correct port');
      console.log('- That VITE_APP_URL in .env matches the ngrok URL');
    } else {
      throw new Error(`Failed to set up webhook: ${result.description || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

setupWebhook(0);
