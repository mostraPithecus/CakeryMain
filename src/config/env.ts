import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  supabase: {
    url: process.env.VITE_SUPABASE_URL || '',
    anonKey: process.env.VITE_SUPABASE_ANON_KEY || ''
  },
  telegram: {
    botToken: process.env.VITE_TELEGRAM_BOT_TOKEN || '',
    chatId: process.env.VITE_TELEGRAM_CHAT_ID || '',
    webhookUrl: process.env.VITE_APP_URL || ''
  }
};
