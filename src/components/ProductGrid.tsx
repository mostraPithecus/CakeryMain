import React, { useState, useMemo } from 'react';
import type { Product } from '../lib/database.types';
import { Plus, Flame, X, Image as ImageIcon } from 'lucide-react';
import { useStore } from '../lib/store';
import { Dialog } from '@headlessui/react';
import { toast } from 'react-hot-toast';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

type SortOption = 'name' | 'price-asc' | 'price-desc';

const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart }) => {
  const { categories, tags } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('name');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Определяем бестселлеры (самые дорогие товары в каждой категории)
  const bestSellers = useMemo(() => {
    const bestSellersByCategory = new Map<string, Product>();
    products.forEach(product => {
      const currentBest = bestSellersByCategory.get(product.category_id);
      if (!currentBest || product.price > currentBest.price) {
        bestSellersByCategory.set(product.category_id, product);
      }
    });
    return Array.from(bestSellersByCategory.values()).map(p => p.id);
  }, [products]);

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category_id === selectedCategory);
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(product => 
        product.tags?.some(tagId => selectedTags.includes(tagId))
      );
    }

    return filtered.sort((a, b) => {
      switch (sortOption) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        default:
          return 0;
      }
    });
  }, [products, selectedCategory, selectedTags, sortOption]);

  const handleAddToCart = (product: Product) => {
    onAddToCart(product);
    toast.success('Added to cart');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-4">Categories</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === null
                  ? 'bg-[#8148B5] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
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

        <div>
          <h3 className="text-lg font-semibold mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
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

        <div>
          <h3 className="text-lg font-semibold mb-4">Sort By</h3>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-[#8148B5] focus:border-[#8148B5]"
          >
            <option value="name">Name</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {filteredAndSortedProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative"
          >
            <div className="relative">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-32 sm:h-48 object-cover"
              />
              <button
                onClick={() => setSelectedProduct(product)}
                className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg hover:bg-white transition-colors flex items-center gap-2 text-sm font-medium text-gray-700"
                title="View cake slice"
              >
                <ImageIcon className="w-4 h-4" />
                <span>See Inside</span>
              </button>
            </div>
            <div className="p-3 sm:p-4">
              {bestSellers.includes(product.id) && (
                <div className="inline-block mb-2 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5">
                  <Flame className="w-4 h-4" />
                  Most Popular
                </div>
              )}
              <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2 line-clamp-1">{product.name}</h3>
              <p className="text-gray-600 mb-2 sm:mb-4 text-xs sm:text-sm line-clamp-2">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-base sm:text-lg font-bold">€{product.price}</span>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-[#8148B5] text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-md font-semibold hover:bg-opacity-90 transition-all flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Модальное окно для просмотра фото в разрезе */}
      <Dialog
        open={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-lg bg-white rounded-xl shadow-2xl">
            <div className="relative">
              <img
                src={selectedProduct?.slice_image_url || selectedProduct?.image_url}
                alt={`${selectedProduct?.name} slice view`}
                className="w-full rounded-t-xl"
              />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-2 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <Dialog.Title className="text-lg font-semibold">
                {selectedProduct?.name} - Slice View
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-600 mt-1">
                Take a closer look at our delicious cake layers
              </Dialog.Description>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default ProductGrid;