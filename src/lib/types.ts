export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
  categories: Category[];
  tags: Tag[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  created_at: string;
}

export interface Filter {
  search: string;
  categories: string[];
  tags: string[];
  minPrice: number;
  maxPrice: number;
}
