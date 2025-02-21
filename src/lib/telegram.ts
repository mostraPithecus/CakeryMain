import type { Order } from './database.types';

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

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
const formatCartItems = (cart: Array<{ product: { name: string; price: number }; quantity: number }>) => {
  return cart
    .map(item => `${item.quantity}x ${item.product.name} ($${item.product.price * item.quantity})`)
    .join('\n');
};

// Calculate total price
const calculateTotal = (cart: Array<{ product: { price: number }; quantity: number }>) => {
  return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
};

// Send message to Telegram
export const sendToTelegram = async (
  order: Omit<Order, 'id' | 'status' | 'created_at' | 'updated_at'>,
  cart: Array<{ product: { name: string; price: number }; quantity: number }>
): Promise<boolean> => {
  if (!checkRateLimit()) {
    console.error('Rate limit exceeded');
    return false;
  }

  const message = `
🎂 New Order!

👤 Customer: ${order.customer_name}
📱 Phone: ${order.phone}
${order.email ? `📧 Email: ${order.email}` : ''}
${order.whatsapp ? `📱 WhatsApp: ${order.whatsapp}` : ''}
${order.instagram ? `📷 Instagram: ${order.instagram}` : ''}
${order.facebook ? `👥 Facebook: ${order.facebook}` : ''}

🛒 Order Details:
${formatCartItems(cart)}

💰 Total: $${calculateTotal(cart)}

${order.comments ? `📝 Comments: ${order.comments}` : ''}
`;

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
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
    return false;
  }
};

export { checkRateLimit, formatCartItems, calculateTotal };