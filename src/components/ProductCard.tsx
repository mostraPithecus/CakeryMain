import React from 'react';
import type { Product } from '../lib/database.types';
import { Plus } from 'lucide-react';
import { useStore } from '../lib/store';

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { tags: allTags } = useStore();
  
  // Convert tag IDs to names
  const tagNames = product.tags
    ?.map(tagId => allTags.find(t => t.id === tagId)?.name)
    .filter((name): name is string => name !== undefined) || [];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform">
      <img
        src={product.image_url}
        alt={product.name}
        className="w-full h-64 object-cover"
      />
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{product.name}</h3>
          <span className="text-[#8148B5] font-bold">${product.price}</span>
        </div>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {tagNames.map((tagName) => (
            <span
              key={tagName}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
            >
              {tagName}
            </span>
          ))}
        </div>
        <button
          onClick={onAddToCart}
          className="w-full bg-[#8148B5] text-white px-4 py-2 rounded-md font-semibold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}