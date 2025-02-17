import ngrok from 'ngrok';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

async function startTunnel() {
  try {
    // Connect to ngrok
    console.log('Starting ngrok tunnel...');
    const url = await ngrok.connect({
      addr: 3005,
      authtoken: '2tB8Pee6ZtvbHZNqIJKqPKDt2mr_5Wdbz7Na8acuvtT4Eb4wC'
    });

    console.log('✅ Ngrok tunnel established:', url);

    // Update .env file with the new URL
    const envPath = path.join(process.cwd(), '.env');
    let envContent = fs.readFileSync(envPath, 'utf-8');
    
    // Replace or add VITE_APP_URL
    if (envContent.includes('VITE_APP_URL=')) {
      envContent = envContent.replace(/VITE_APP_URL=.*/g, `VITE_APP_URL=${url}`);
    } else {
      envContent += `\nVITE_APP_URL=${url}`;
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Updated .env with new URL');

    // Keep the script running
    console.log('🚀 Tunnel is running. Press Ctrl+C to stop.');
    process.on('SIGINT', async () => {
      await ngrok.kill();
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

startTunnel();
