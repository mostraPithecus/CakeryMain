import { create } from 'zustand';
import { supabase } from './supabase';
import { notifyNewOrder } from './telegram';
import toast from 'react-hot-toast';
import type { Product, Category, Tag, Order } from './database.types';

interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

interface StoreState {
  products: Product[];
  categories: Category[];
  tags: Tag[];
  cart: CartItem[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchTags: () => Promise<void>;
  addToCart: (product: Product, quantity: number, notes?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartItem: (productId: string, quantity: number, notes?: string) => void;
  clearCart: () => void;
  submitOrder: (customerInfo: Omit<Order, 'id' | 'status' | 'created_at' | 'updated_at'>) => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  products: [],
  categories: [],
  tags: [],
  cart: [],
  isLoading: false,
  error: null,

  // Fetch all products with their categories and tags
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          tags:product_tags(tag:tags(*))
        `);
      
      if (error) throw error;
      set({ products: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  // Fetch all product categories
  fetchCategories: async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (error) throw error;
      set({ categories: data });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  // Fetch all product tags
  fetchTags: async () => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*');
      
      if (error) throw error;
      set({ tags: data });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  // Add a product to the shopping cart
  addToCart: (product, quantity, notes) => {
    const cart = get().cart;
    const existingItem = cart.find(item => item.product.id === product.id);

    if (existingItem) {
      set({
        cart: cart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity, notes }
            : item
        ),
      });
    } else {
      set({ cart: [...cart, { product, quantity, notes }] });
    }

    // Show success message
    toast.success(`Added ${product.name} to cart`);
  },

  // Remove a product from the cart
  removeFromCart: (productId) => {
    set({ cart: get().cart.filter(item => item.product.id !== productId) });
  },

  // Update quantity or notes for a cart item
  updateCartItem: (productId, quantity, notes) => {
    set({
      cart: get().cart.map(item =>
        item.product.id === productId
          ? { ...item, quantity, notes }
          : item
      ),
    });
  },

  // Clear the entire shopping cart
  clearCart: () => {
    set({ cart: [] });
  },

  // Submit an order and send notification to Telegram
  submitOrder: async (customerInfo) => {
    const cart = get().cart;
    if (cart.length === 0) {
      throw new Error('Cart is empty');
    }

    try {
      // Test database connection first
      const { data: testData, error: testError } = await supabase
        .from('orders')
        .select('*')
        .limit(1);

      if (testError) {
        console.error('Database connection test error:', testError);
        throw new Error(`Database connection failed: ${testError.message}`);
      }
      console.log('Database connection successful, found orders:', testData);

      // 1. Create the order in the database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          ...customerInfo,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error:', orderError);
        throw new Error(`Failed to create order: ${orderError.message}`);
      }

      if (!order) {
        throw new Error('Order was not created');
      }

      // 2. Create order items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        notes: item.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Order items creation error:', itemsError);
        throw new Error(`Failed to create order items: ${itemsError.message}`);
      }

      // 3. Send notification to Telegram bot
      try {
        await notifyNewOrder(order, cart, customerInfo);
      } catch (notifyError) {
        console.error('Telegram notification error:', notifyError);
        // Don't throw here, as the order was still created successfully
      }

      // 4. Show success message and clear cart
      toast.success('Order submitted successfully!');
      get().clearCart();
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit order. Please try again.');
      throw error;
    }
  },
}));