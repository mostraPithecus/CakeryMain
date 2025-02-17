import React from 'react';
import { useStore } from '../lib/store';
import type { Product } from '../lib/database.types';
import { Plus } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface Tag {
  id: string;
  name: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useStore(state => state.addToCart);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {product.image_url && (
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        
        {/* Categories */}
        {product.categories && product.categories.length > 0 && (
          <div className="mb-2">
            {product.categories.map(category => (
              <span
                key={category.id}
                className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full mr-2 mb-1"
              >
                {category.name}
              </span>
            ))}
          </div>
        )}
        
        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="mb-2">
            {product.tags.map(tag => (
              <span
                key={tag.id}
                className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full mr-2 mb-1"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        <p className="text-gray-600 mb-4">{product.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-purple-600">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={() => addToCart(product, 1)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700"
          >
            <Plus size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}