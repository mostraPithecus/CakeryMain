const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  // Start ngrok and capture its output
  console.log('Starting ngrok tunnel...');
  const ngrokOutput = execSync('ngrok http 3005 --log=stdout', { encoding: 'utf8' });
  
  // Extract URL from ngrok output
  const url = ngrokOutput.match(/https:\/\/[^\.]+\.ngrok-free\.app/)[0];
  
  console.log('Ngrok URL:', url);
  
  // Update .env file
  const envPath = path.join(__dirname, '..', '.env');
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  if (envContent.includes('VITE_APP_URL=')) {
    envContent = envContent.replace(/VITE_APP_URL=.*/, `VITE_APP_URL=${url}`);
  } else {
    envContent += `\nVITE_APP_URL=${url}`;
  }
  
  fs.writeFileSync(envPath, envContent);
  console.log('Updated .env with new URL');
  
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
}
