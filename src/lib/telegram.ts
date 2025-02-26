import type { Order } from './database.types';

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  console.error('Telegram configuration is missing. Please check your .env file.');
}

// Rate limiting configuration
const RATE_LIMIT = 20; // messages per minute
const RATE_WINDOW = 60 * 1000; // 1 minute in milliseconds
let messageCount = 0;
let windowStart = Date.now();

// Check if we're within rate limits
const checkRateLimit = (): boolean => {
  const now = Date.now();
  if (now - windowStart > RATE_WINDOW) {
    // Reset window
    messageCount = 0;
    windowStart = now;
  }
  return messageCount < RATE_LIMIT;
};

// Format cart items for Telegram message
const formatCartItems = (cart: Array<{ product: { name: string; price: number; is_custom_order?: boolean; composition?: string }; quantity: number }>) => {
  return cart
    .map(item => {
      const baseText = `${item.quantity}x ${item.product.name} (€${(item.product.price * item.quantity).toFixed(2)})`;
      
      // Check if it's a custom cake and add details
      if (item.product.is_custom_order && item.product.composition) {
        const compositionLines = item.product.composition.split('\n');
        return `${baseText}\n   📝 Custom Cake Details:\n   ${compositionLines.map(line => `   - ${line}`).join('\n')}`;
      }
      
      return baseText;
    })
    .join('\n\n');
};

// Calculate total price
const calculateTotal = (cart: Array<{ product: { price: number }; quantity: number }>) => {
  return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
};

// Send message to Telegram
export const sendToTelegram = async (
  order: Omit<Order, 'id' | 'status' | 'created_at' | 'updated_at'>,
  cart: Array<{ product: { name: string; price: number; is_custom_order?: boolean; composition?: string }; quantity: number }>
): Promise<boolean> => {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('Telegram configuration is missing');
    return false;
  }

  if (!checkRateLimit()) {
    console.error('Rate limit exceeded');
    return false;
  }

  const items = cart.map((item) => ({
    name: item.product.name,
    quantity: item.quantity,
    price: item.product.price * item.quantity
  }));

  const total = calculateTotal(cart) + (order.deliveryCost || 0);

  const message = `
🎂 New Order!

👤 Customer: ${order.customer_name}
📞 Contact: ${order.phone || order.telegram || order.whatsapp || order.instagram || order.facebook || 'Not provided'}

🚚 Delivery: ${order.deliveryMethod}
${order.deliveryMethod === 'delivery' ? `📍 Address: ${order.deliveryAddress}\n💰 Delivery Cost: €${order.deliveryCost}` : ''}

🛒 Order Items:
${formatCartItems(cart)}

💶 Subtotal: €${calculateTotal(cart)}
${order.deliveryCost ? `🚚 Delivery: €${order.deliveryCost}` : ''}
💰 Total: €${total}

${order.comments ? `💭 Comments: ${order.comments}` : ''}`;

  try {
    messageCount++;
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Telegram API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData.description || 'Unknown error'
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to send Telegram message');
    return false;
  }
};

export { checkRateLimit, formatCartItems, calculateTotal };