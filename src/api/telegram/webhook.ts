import { handleTelegramWebhook } from '../../lib/telegram';
import type { APIRoute } from 'astro';

export const post: APIRoute = async ({ request }) => {
  try {
    const update = await request.json();
    console.log('Received webhook update:', update); // Debug log

    const response = await handleTelegramWebhook(update);
    console.log('Webhook response:', response); // Debug log
    
    return new Response(JSON.stringify({ ok: true, result: response }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error in Telegram webhook:', error);
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
