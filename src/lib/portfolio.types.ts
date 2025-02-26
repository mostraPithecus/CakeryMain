import { UUID } from './database.types';

export interface PortfolioItem {
  id: UUID;
  name: string;
  description: string;
  composition: string;
  price: number;
  images: string[];
  category_id: UUID;
  tags: string[];
  weight_kg: number;
  completion_date: string;
  customer_review?: {
    rating: number;
    text: string;
    customer_name: string;
    review_date: string;
  };
  order_details?: {
    special_requests?: string;
    occasion?: string;
    serving_size?: number;
  };
  created_at: string;
  updated_at: string;
}

export interface PortfolioCategory {
  id: UUID;
  name: string;
  description?: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      portfolio_items: {
        Row: PortfolioItem;
        Insert: Omit<PortfolioItem, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<PortfolioItem, 'id'>>;
      };
      portfolio_categories: {
        Row: PortfolioCategory;
        Insert: Omit<PortfolioCategory, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<PortfolioCategory, 'id'>>;
      };
    };
  };
}
