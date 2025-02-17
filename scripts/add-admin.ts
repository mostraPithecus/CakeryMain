import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addAdmin(telegramId: string) {
  try {
    const { data, error } = await supabase
      .from('telegram_admins')
      .upsert([
        {
          telegram_id: telegramId,
          username: 'admin',
          is_active: true
        }
      ])
      .select();

    if (error) throw error;
    console.log('✅ Admin added successfully:', data);
  } catch (error) {
    console.error('❌ Error adding admin:', error);
  } finally {
    process.exit();
  }
}

const telegramId = process.argv[2];
if (!telegramId) {
  console.error('❌ Please provide a Telegram ID');
  process.exit(1);
}

addAdmin(telegramId);
