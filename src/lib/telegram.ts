// This file handles all Telegram bot related functionality
import { supabase } from './supabaseClient';
import { config } from '../config/env';

if (!config.telegram.botToken || !config.telegram.chatId) {
  throw new Error('Missing Telegram environment variables');
}

const TELEGRAM_BOT_TOKEN = config.telegram.botToken;
const TELEGRAM_CHAT_ID = config.telegram.chatId;

interface TelegramMessage {
  message_id: number;
  from: {
    id: number;
    first_name: string;
    username?: string;
  };
  chat: {
    id: number;
    type: string;
  };
  date: number;
  text?: string;
}

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

// Command handlers for product management
async function handleProductCommand(message: string): Promise<string> {
  const [command, ...args] = message.split(' ');
  
  switch (command.toLowerCase()) {
    // Product commands
    case '/addproduct':
      return handleAddProduct(args.join(' '));
    case '/editproduct':
      return handleEditProduct(args.join(' '));
    case '/deleteproduct':
      return handleDeleteProduct(args[0]);
    case '/listproducts':
      return handleListProducts();
    case '/addvariant':
      return handleAddVariant(args.join(' '));
    
    // Category commands
    case '/addcategory':
      return handleAddCategory(args.join(' '));
    case '/listcategories':
      return handleListCategories();
    case '/deletecategory':
      return handleDeleteCategory(args[0]);
    
    // Tag commands
    case '/addtag':
      return handleAddTag(args.join(' '));
    case '/listtags':
      return handleListTags();
    case '/deletetag':
      return handleDeleteTag(args[0]);
    
    // Product categorization
    case '/addproductcategory':
      return handleAddProductCategory(args[0], args[1]); // product_id, category_id
    case '/addproducttag':
      return handleAddProductTag(args[0], args[1]); // product_id, tag_id
    
    default:
      return getHelpMessage();
  }
}

function getHelpMessage(): string {
  return `🎂 <b>Cake Shop Bot Commands</b>

📝 <u>Product Management</u>:
/addproduct [name] | [price] | [description] | [image_url]
/listproducts - View all products

🏷️ <u>Category Management</u>:
/addcategory [name] | [description]
/listcategories - View all categories

🔖 <u>Tag Management</u>:
/addtag [name]
/listtags - View all tags

❓ <u>Help</u>:
/help - Show this message

<i>Use | to separate parameters in commands</i>`;
}

// Category Management
async function handleAddCategory(categoryData: string): Promise<string> {
  try {
    if (!categoryData) {
      return '❌ Please provide category data in format: [name] | [description]';
    }

    const [name, description] = categoryData.split('|').map(s => s.trim());
    
    if (!name) {
      return '❌ Category name is required';
    }

    const { data, error } = await supabase
      .from('categories')
      .insert([{
        name,
        description: description || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (error) throw error;

    return `✅ Category added successfully!\n📝 Name: ${name}\n📄 Description: ${description || 'N/A'}`;
  } catch (error) {
    console.error('Error adding category:', error);
    return '❌ Failed to add category. Please try again.';
  }
}

async function handleListCategories(): Promise<string> {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error listing categories:', error);
      return `Error listing categories: ${error.message}`;
    }

    if (!categories || categories.length === 0) {
      return 'No categories found.';
    }

    const categoryList = categories
      .map(cat => `- ${cat.name} (${cat.slug})\n  ${cat.description || 'No description'}`)
      .join('\n\n');

    return `Categories:\n\n${categoryList}`;
  } catch (error) {
    console.error('Error in handleListCategories:', error);
    return 'Error listing categories. Please try again.';
  }
}

async function handleDeleteCategory(categoryId: string): Promise<string> {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId);
      
    if (error) throw error;
    return `✅ Category deleted successfully!\nID: ${categoryId}`;
  } catch (error) {
    console.error('Error deleting category:', error);
    return '❌ Failed to delete category. Please check the format: /deletecategory id';
  }
}

// Tag Management
async function handleAddTag(tagData: string): Promise<string> {
  try {
    if (!tagData) {
      return '❌ Please provide a tag name';
    }

    const name = tagData.trim();
    
    if (!name) {
      return '❌ Tag name is required';
    }

    const { data, error } = await supabase
      .from('tags')
      .insert([{
        name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (error) throw error;

    return `✅ Tag "${name}" added successfully!`;
  } catch (error) {
    console.error('Error adding tag:', error);
    return '❌ Failed to add tag. Please try again.';
  }
}

async function handleListTags(): Promise<string> {
  try {
    const { data: tags, error } = await supabase
      .from('tags')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error listing tags:', error);
      return `Error listing tags: ${error.message}`;
    }

    if (!tags || tags.length === 0) {
      return 'No tags found.';
    }

    const tagList = tags
      .map(tag => `- ${tag.name} (${tag.slug})`)
      .join('\n');

    return `Tags:\n\n${tagList}`;
  } catch (error) {
    console.error('Error in handleListTags:', error);
    return 'Error listing tags. Please try again.';
  }
}

async function handleDeleteTag(tagId: string): Promise<string> {
  try {
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', tagId);
      
    if (error) throw error;
    return `✅ Tag deleted successfully!\nID: ${tagId}`;
  } catch (error) {
    console.error('Error deleting tag:', error);
    return '❌ Failed to delete tag. Please check the format: /deletetag id';
  }
}

// Product Categorization
async function handleAddProductCategory(productId: string, categoryId: string): Promise<string> {
  try {
    const { error } = await supabase
      .from('product_categories')
      .insert([{
        product_id: productId,
        category_id: categoryId
      }]);
      
    if (error) throw error;
    return `✅ Product category added successfully!\nProduct ID: ${productId}\nCategory ID: ${categoryId}`;
  } catch (error) {
    console.error('Error adding product category:', error);
    return '❌ Failed to add product category. Please check the format: /addproductcategory product_id category_id';
  }
}

async function handleAddProductTag(productId: string, tagId: string): Promise<string> {
  try {
    const { error } = await supabase
      .from('product_tags')
      .insert([{
        product_id: productId,
        tag_id: tagId
      }]);
      
    if (error) throw error;
    return `✅ Product tag added successfully!\nProduct ID: ${productId}\nTag ID: ${tagId}`;
  } catch (error) {
    console.error('Error adding product tag:', error);
    return '❌ Failed to add product tag. Please check the format: /addproducttag product_id tag_id';
  }
}

async function handleAddProduct(productData: string): Promise<string> {
  try {
    // Expected format: name | price | description | image_url
    const [name, price, description, image_url] = productData.split('|').map(s => s.trim());
    
    if (!name || !price) {
      return 'Please provide product name and price. Format: /addproduct name | price | description | image_url';
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum)) {
      return 'Invalid price format. Please provide a number.';
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const { data: product, error } = await supabase
      .from('products')
      .insert({
        name,
        slug,
        price: priceNum,
        description,
        image_url,
        is_available: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding product:', error);
      return `Error adding product: ${error.message}`;
    }

    return `Product added successfully!\nID: ${product.id}\nName: ${product.name}\nPrice: ${product.price}`;
  } catch (error) {
    console.error('Error in handleAddProduct:', error);
    return 'Error adding product. Please try again.';
  }
}

async function handleEditProduct(productData: string): Promise<string> {
  try {
    // Expected format: id | name | price | description | image_url
    const [id, name, price, description, image_url] = productData.split('|').map(s => s.trim());
    
    if (!id) {
      return 'Please provide product ID. Format: /editproduct id | name | price | description | image_url';
    }

    const updates: any = {};
    
    if (name) {
      updates.name = name;
      updates.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    
    if (price) {
      const priceNum = parseFloat(price);
      if (isNaN(priceNum)) {
        return 'Invalid price format. Please provide a number.';
      }
      updates.price = priceNum;
    }
    
    if (description) {
      updates.description = description;
    }
    
    if (image_url) {
      updates.image_url = image_url;
    }

    const { data: product, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error editing product:', error);
      return `Error editing product: ${error.message}`;
    }

    return `Product updated successfully!\nID: ${product.id}\nName: ${product.name}\nPrice: ${product.price}`;
  } catch (error) {
    console.error('Error in handleEditProduct:', error);
    return 'Error editing product. Please try again.';
  }
}

async function handleDeleteProduct(productId: string): Promise<string> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', parseInt(productId));
      
    if (error) throw error;
    return `✅ Product deleted successfully!\nID: ${productId}`;
  } catch (error) {
    console.error('Error deleting product:', error);
    return '❌ Failed to delete product. Please check the format: /deleteproduct id';
  }
}

async function handleListProducts(): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select();
      
    if (error) throw error;
    return `✅ Products:\n${data.map(product => `ID: ${product.id}\nName: ${product.name}\nPrice: $${product.price}`).join('\n\n')}`;
  } catch (error) {
    console.error('Error listing products:', error);
    return '❌ Failed to list products.';
  }
}

async function handleAddVariant(variantData: string): Promise<string> {
  try {
    const [productId, name, price] = variantData.split(' ');
    
    const { data, error } = await supabase
      .from('variants')
      .insert([{
        product_id: parseInt(productId),
        name,
        price: parseFloat(price),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();
      
    if (error) throw error;
    return `✅ Variant added successfully!\nID: ${data[0].id}\nProduct ID: ${productId}\nName: ${name}\nPrice: $${price}`;
  } catch (error) {
    console.error('Error adding variant:', error);
    return '❌ Failed to add variant. Please check the format: /addvariant product_id name price';
  }
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
async function sendTelegramMessage(text: string): Promise<void> {
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
          text,
          parse_mode: 'HTML'
        }),
      }
    );

    const result = await response.json();
    if (!result.ok) {
      console.error('Failed to send message:', result);
      throw new Error(result.description || 'Failed to send message');
    }
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

// Main function to notify about new orders
export async function notifyNewOrder(order: any, items: any[], customer: any) {
  const message = formatOrderMessage(order, items, customer);
  await sendTelegramMessage(message);
}

// Function to handle incoming Telegram webhook
export async function handleTelegramWebhook(update: any): Promise<{ ok: boolean; message?: string }> {
  try {
    console.log('📥 Received update:', JSON.stringify(update, null, 2));
    
    const { message } = update;
    
    if (!message) {
      console.error('No message in webhook request');
      return { ok: false, message: 'No message in request' };
    }

    // Check if user is admin
    const { data: adminData, error: adminError } = await supabase
      .from('telegram_admins')
      .select('*')
      .eq('telegram_id', message.from.id.toString())
      .single();

    if (adminError) {
      console.error('Error checking admin status:', adminError);
      await sendTelegramMessage('❌ Error checking admin status. Please try again.');
      return { ok: false, message: 'Admin check error' };
    }

    if (!adminData) {
      console.log('❌ Unauthorized access attempt from:', message.from);
      await sendTelegramMessage('❌ Sorry, you are not authorized to use this bot. Please contact the administrator.');
      return { ok: false, message: 'Unauthorized' };
    }

    if (message?.text) {
      const command = message.text.split(' ')[0].toLowerCase();
      let response = '';

      try {
        if (command === '/help') {
          response = getHelpMessage();
        } else {
          response = await handleProductCommand(message.text);
        }

        console.log('🤖 Sending response:', response);
        await sendTelegramMessage(response);
        return { ok: true, message: response };
      } catch (error) {
        console.error('Error handling command:', error);
        const errorMessage = '❌ Error processing command. Please check the format and try again.';
        await sendTelegramMessage(errorMessage);
        return { ok: false, message: errorMessage };
      }
    }

    return { ok: true };
  } catch (error) {
    console.error('Webhook error:', error);
    return { ok: false, message: error instanceof Error ? error.message : 'Internal server error' };
  }
}