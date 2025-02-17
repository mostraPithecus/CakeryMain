import { handleTelegramWebhook } from '../../../lib/telegram';
import type { APIRoute } from 'astro';

export const post: APIRoute = async ({ request }) => {
  console.log('🎯 Webhook endpoint hit!');
  console.log('Method:', request.method);
  console.log('Headers:', JSON.stringify(Object.fromEntries(request.headers), null, 2));
  
  try {
    if (!request.body) {
      console.error('❌ No request body');
      return new Response(JSON.stringify({ ok: false, error: 'No request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const update = await request.json();
    console.log('📦 Update data:', JSON.stringify(update, null, 2));

    const response = await handleTelegramWebhook(update);
    console.log('✅ Webhook response:', JSON.stringify(response, null, 2));
    
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return new Response(
      JSON.stringify({ 
        ok: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }), 
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};

// Also handle GET requests for testing
export const get: APIRoute = async ({ request }) => {
  console.log('GET request to webhook endpoint');
  console.log('URL:', request.url);
  console.log('Headers:', JSON.stringify(Object.fromEntries(request.headers), null, 2));

  return new Response(JSON.stringify({ ok: true, message: 'Webhook endpoint is working' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
