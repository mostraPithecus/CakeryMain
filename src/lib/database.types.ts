export type UUID = string;

export interface Product {
  id: UUID;
  name: string;
  description: string;
  composition: string;
  price: number;
  image_url: string;
  slice_image_url: string;
  category_id: UUID;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: UUID;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: UUID;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: UUID;
  customer_name: string;
  phone: string;
  email?: string | null;
  telegram?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  comments?: string | null;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  deliveryMethod: 'pickup' | 'delivery' | null;
  deliveryAddress?: string | null;
  deliveryCost: number;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: UUID;
  order_id: UUID;
  product_id: UUID;
  quantity: number;
  price: number;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Product, 'id'>>;
      };
      categories: {
        Row: Category;
        Insert: Omit<Category, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Category, 'id'>>;
      };
      tags: {
        Row: Tag;
        Insert: Omit<Tag, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Tag, 'id'>>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Order, 'id'>>;
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<OrderItem, 'id'>>;
      };
    };
  };
}
