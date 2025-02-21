import React, { useState, useMemo } from 'react';
import type { Product, Tag } from '../lib/database.types';
import { ProductCard } from './ProductCard';
import { useStore } from '../lib/store';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart }) => {
  console.log('ProductGrid render, products:', products);
  const { tags: allTags, categories: allCategories } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('price-asc');

  console.log('Current filters:', { selectedCategory, selectedTags, searchQuery });
  console.log('Available products:', products);
  console.log('All categories:', allCategories);
  console.log('All tags:', allTags);

  // Get unique categories with names
  const categories = useMemo(() => {
    console.log('Calculating categories from products:', products);
    console.log('All categories:', allCategories);
    return [
      { id: 'all', name: 'All' },
      ...allCategories
    ];
  }, [allCategories]);

  // Get unique tags with names
  const availableTags = useMemo(() => {
    console.log('Getting available tags');
    console.log('All tags:', allTags);
    return allTags.map(tag => ({
      id: tag.id,
      name: tag.name
    }));
  }, [allTags]);

  const filteredAndSortedProducts = useMemo(() => {
    console.log('Filtering products with:', {
      selectedCategory,
      selectedTags,
      searchQuery
    });

    let filtered = [...products];

    // Category filtering
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => {
        const matches = product.category_id === selectedCategory;
        console.log(`Category filter for ${product.name}:`, {
          productCategoryId: product.category_id,
          selectedCategory,
          matches
        });
        return matches;
      });
    }

    // Search filtering
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product => {
        const matches = 
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query);
        console.log(`Search filter for ${product.name}:`, { query, matches });
        return matches;
      });
    }

    // Tags filtering
    if (selectedTags.length > 0) {
      filtered = filtered.filter(product => {
        const productTags = product.tags || [];
        const matches = selectedTags.every(tagId => productTags.includes(tagId));
        console.log(`Tags filter for ${product.name}:`, {
          productTags,
          selectedTags,
          matches
        });
        return matches;
      });
    }

    console.log('Filtered products:', filtered);

    // Sorting
    return filtered.sort((a, b) => {
      switch (sortOption) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  }, [products, selectedCategory, selectedTags, searchQuery, sortOption]);

  console.log('Filtered and sorted products:', filteredAndSortedProducts);

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="space-y-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#8148B5] focus:border-[#8148B5]"
        />

        {/* Category Filter */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => {
                  console.log('Setting category:', category.id);
                  setSelectedCategory(category.id);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-[#8148B5] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tags Filter */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <button
                key={tag.id}
                onClick={() => {
                  console.log('Toggling tag:', tag.id);
                  setSelectedTags(prev =>
                    prev.includes(tag.id)
                      ? prev.filter(id => id !== tag.id)
                      : [...prev, tag.id]
                  );
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTags.includes(tag.id)
                    ? 'bg-[#E57D8D] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Sort By</h3>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-[#8148B5] focus:border-[#8148B5]"
            aria-label="Sort products"
            title="Sort products"
          >
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={() => onAddToCart(product)}
          />
        ))}
      </div>

      {/* No Results Message */}
      {filteredAndSortedProducts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No products found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;