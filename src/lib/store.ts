import { create } from 'zustand';
import type { Product, Category, Tag } from './database.types';
import { v4 as uuidv4 } from 'uuid';

// Import data from TypeScript file
import { products as productData, categories as categoryData, tags as tagData } from '../data/data';

// Helper function to convert numeric or string IDs to deterministic format
function convertToUUID(id: string): string {
  // If it's already a UUID, return it
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return id;
  }
  
  // Return the original ID
  return id;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Store {
  // State
  products: Product[];
  categories: Category[];
  tags: Tag[];
  cart: CartItem[];
  isLoading: boolean;
  error: string | null;

  // Cart actions
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartItem: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Data fetching
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchTags: () => Promise<void>;

  // Order submission
  submitOrder: (orderData: any) => Promise<void>;
}

export const useStore = create<Store>((set, get) => ({
  // Initial state
  products: [],
  categories: [],
  tags: [],
  cart: [],
  isLoading: false,
  error: null,

  // Cart actions
  addToCart: (product) => {
    const { cart } = get();
    const existingItem = cart.find(item => item.product.id === product.id);

    if (existingItem) {
      set({
        cart: cart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      set({ cart: [...cart, { product, quantity: 1 }] });
    }
  },

  removeFromCart: (productId) => {
    const { cart } = get();
    set({
      cart: cart.filter(item => item.product.id !== productId),
    });
  },

  updateCartItem: (productId, quantity) => {
    const { cart } = get();
    if (quantity === 0) {
      set({
        cart: cart.filter(item => item.product.id !== productId),
      });
    } else {
      set({
        cart: cart.map(item =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        ),
      });
    }
  },

  clearCart: () => {
    set({ cart: [] });
  },

  // Fetch products
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const now = new Date().toISOString();
      
      // Add timestamps and convert IDs to UUIDs
      const products = productData.map(product => ({
        ...product,
        id: convertToUUID(product.id),
        category_id: convertToUUID(product.category_id),
        created_at: now,
        updated_at: now
      }));

      set({ products, isLoading: false });
    } catch (error) {
      console.error('Error loading products:', error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  // Fetch categories
  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const now = new Date().toISOString();
      
      // Add timestamps and convert IDs to UUIDs
      const categories = categoryData.map(category => ({
        ...category,
        id: convertToUUID(category.id),
        created_at: now,
        updated_at: now
      }));

      set({ categories, isLoading: false });
    } catch (error) {
      console.error('Error loading categories:', error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  // Fetch tags
  fetchTags: async () => {
    set({ isLoading: true, error: null });
    try {
      const now = new Date().toISOString();
      
      // Add timestamps and convert IDs to UUIDs
      const tags = tagData.map(tag => ({
        ...tag,
        id: convertToUUID(tag.id),
        created_at: now,
        updated_at: now
      }));

      set({ tags, isLoading: false });
    } catch (error) {
      console.error('Error loading tags:', error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  // Submit order
  submitOrder: async (orderData) => {
    set({ isLoading: true, error: null });
    try {
      const { cart } = get();
      
      // Generate order ID
      const orderId = uuidv4();
      
      // Create order items from cart
      const orderItems = cart.map(item => ({
        id: uuidv4(),
        order_id: orderId,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      }));

      // Here you would typically send this to your backend
      console.log('Order submitted:', { orderId, orderData, orderItems });
      
      // Clear the cart after successful order
      get().clearCart();
      
      set({ isLoading: false });
    } catch (error) {
      console.error('Error submitting order:', error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));