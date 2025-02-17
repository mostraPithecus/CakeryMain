import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface Tag {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  categories: Category[];
  tags: Tag[];
}

interface Filter {
  categories: string[];
  tags: string[];
  search: string;
  minPrice: number;
  maxPrice: number;
}

interface ProductStore {
  products: Product[];
  categories: Category[];
  tags: Tag[];
  filters: Filter;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchTags: () => Promise<void>;
  setFilter: (filter: Partial<Filter>) => void;
  resetFilters: () => void;
  
  // Computed
  filteredProducts: () => Product[];
}

const initialFilters: Filter = {
  categories: [],
  tags: [],
  search: '',
  minPrice: 0,
  maxPrice: 1000,
};

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  categories: [],
  tags: [],
  filters: initialFilters,
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select(`
          *,
          product_categories (
            category_id
          ),
          product_tags (
            tag_id
          )
        `);

      if (error) throw error;

      // Get all category IDs and tag IDs from the relationships
      const categoryIds = new Set(products.flatMap(p => p.product_categories.map((pc: any) => pc.category_id)));
      const tagIds = new Set(products.flatMap(p => p.product_tags.map((pt: any) => pt.tag_id)));

      // Fetch categories and tags in parallel
      const [categoriesResponse, tagsResponse] = await Promise.all([
        supabase.from('categories').select('*').in('id', Array.from(categoryIds)),
        supabase.from('tags').select('*').in('id', Array.from(tagIds))
      ]);

      if (categoriesResponse.error) throw categoriesResponse.error;
      if (tagsResponse.error) throw tagsResponse.error;

      // Create lookup maps for categories and tags
      const categoriesMap = new Map(categoriesResponse.data.map(c => [c.id, c]));
      const tagsMap = new Map(tagsResponse.data.map(t => [t.id, t]));

      // Transform products with their relationships
      const transformedProducts = products.map(product => ({
        ...product,
        categories: product.product_categories
          .map((pc: any) => categoriesMap.get(pc.category_id))
          .filter(Boolean),
        tags: product.product_tags
          .map((pt: any) => tagsMap.get(pt.tag_id))
          .filter(Boolean),
      }));

      set({ 
        products: transformedProducts,
        categories: categoriesResponse.data,
        tags: tagsResponse.data
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (error) throw error;
      set({ categories: data });
    } catch (error) {
      console.error('Error fetching categories:', error);
      set({ error: (error as Error).message });
    }
  },

  fetchTags: async () => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*');
      
      if (error) throw error;
      set({ tags: data });
    } catch (error) {
      console.error('Error fetching tags:', error);
      set({ error: (error as Error).message });
    }
  },

  setFilter: (filter: Partial<Filter>) => {
    set(state => ({
      filters: { ...state.filters, ...filter }
    }));
  },

  resetFilters: () => {
    set({ filters: initialFilters });
  },

  filteredProducts: () => {
    const { products, filters } = get();
    
    return products.filter(product => {
      // Category filter
      if (filters.categories.length > 0) {
        const hasCategory = product.categories.some(category =>
          filters.categories.includes(category.id)
        );
        if (!hasCategory) return false;
      }

      // Tag filter
      if (filters.tags.length > 0) {
        const hasTag = product.tags.some(tag =>
          filters.tags.includes(tag.id)
        );
        if (!hasTag) return false;
      }

      // Price filter
      if (product.price < filters.minPrice || product.price > filters.maxPrice) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.categories.some(cat => cat.name.toLowerCase().includes(searchLower)) ||
          product.tags.some(tag => tag.name.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      return true;
    });
  },
}));
