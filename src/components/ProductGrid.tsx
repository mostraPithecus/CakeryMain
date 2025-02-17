import React from 'react';
import { useProductStore } from '../stores/productStore';
import { ProductCard } from './ProductCard';
import { CategoryList } from './CategoryList';
import { TagList } from './TagList';
import { Search, SlidersHorizontal } from 'lucide-react';

export function ProductGrid() {
  const {
    products,
    loading,
    filters,
    setFilter,
    resetFilters,
    filteredProducts,
    fetchProducts,
    fetchCategories,
    fetchTags
  } = useProductStore();

  const [showFilters, setShowFilters] = React.useState(false);

  React.useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchTags();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ search: e.target.value });
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseFloat(value) || 0;
    setFilter({ [type === 'min' ? 'minPrice' : 'maxPrice']: numValue });
  };

  const filtered = filteredProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filter Toggle */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search cakes..."
            value={filters.search}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 rounded-lg bg-purple-100 text-purple-700 flex items-center gap-2 hover:bg-purple-200"
        >
          <SlidersHorizontal size={20} />
          Filters
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md space-y-6">
          {/* Categories */}
          <CategoryList />

          {/* Tags */}
          <TagList />

          {/* Price Range */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Price Range</h2>
            <div className="flex gap-4 items-center">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ''}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                className="w-24 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ''}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                className="w-24 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end border-t">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered && filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {(!filtered || filtered.length === 0) && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found matching your criteria.</p>
          <p className="text-sm text-gray-400 mt-2">Try adjusting your filters or adding products via Telegram bot.</p>
        </div>
      )}
    </div>
  );
}