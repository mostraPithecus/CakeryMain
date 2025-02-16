// This file handles all Telegram bot related functionality
const TELEGRAM_BOT_TOKEN = '7617668048:AAG1qcaJCURdN9LNOOYGw8qu-Ck_vV-4VR4';
const TELEGRAM_CHAT_ID = '537190136';

// Rate limiting configuration
const RATE_LIMIT = {
  maxRequests: 20, // Maximum requests allowed
  timeWindow: 60 * 60 * 1000, // Time window in milliseconds (1 hour)
  requests: [] as number[] // Array to store timestamp of requests
};

// Function to check if we're within rate limits
function checkRateLimit(): boolean {
  const now = Date.now();
  // Remove old requests outside the time window
  RATE_LIMIT.requests = RATE_LIMIT.requests.filter(
    timestamp => now - timestamp < RATE_LIMIT.timeWindow
  );
  
  // Check if we're at the limit
  if (RATE_LIMIT.requests.length >= RATE_LIMIT.maxRequests) {
    const oldestRequest = RATE_LIMIT.requests[0];
    const timeToWait = (oldestRequest + RATE_LIMIT.timeWindow - now) / 1000;
    console.warn(`Rate limit exceeded. Try again in ${Math.ceil(timeToWait)} seconds`);
    return false;
  }
  
  // Add current request
  RATE_LIMIT.requests.push(now);
  return true;
}

// Function to format order details into a readable message
function formatOrderMessage(order: any, items: any[], customer: any) {
  const itemsList = items
    .map(item => {
      const price = item.product.price * item.quantity;
      return `- ${item.quantity}x ${item.product.name} ($${price})${item.notes ? `\n  Note: ${item.notes}` : ''}`;
    })
    .join('\n');

  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return `
🎂 New Order Received!

👤 Customer Details:
Name: ${customer.customer_name}
Phone: ${customer.phone}
${customer.email ? `Email: ${customer.email}` : ''}
${customer.whatsapp ? `WhatsApp: ${customer.whatsapp}` : ''}
${customer.instagram ? `Instagram: ${customer.instagram}` : ''}
${customer.facebook ? `Facebook: ${customer.facebook}` : ''}
${customer.comments ? `\n💬 Additional Comments:\n${customer.comments}` : ''}

🛒 Order Items:
${itemsList}

💰 Total: $${total.toFixed(2)}

📅 Order Date: ${new Date().toLocaleString()}
🔑 Order ID: ${order.id}

Status: ${order.status.toUpperCase()}
`;
}

// Function to send message to Telegram bot
export async function sendTelegramMessage(message: string) {
  // Check rate limit before sending
  if (!checkRateLimit()) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to send Telegram message');
    }
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    throw error;
  }
}

// Main function to notify about new orders
export async function notifyNewOrder(order: any, items: any[], customer: any) {
  const message = formatOrderMessage(order, items, customer);
  await sendTelegramMessage(message);
}