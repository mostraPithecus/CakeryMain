import React, { useState } from 'react';
import type { Product } from '../lib/database.types';
import { Plus, X } from 'lucide-react';
import { useStore } from '../lib/store';

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
  isBestSeller?: boolean;
}

const ProductCard = ({ product, onAddToCart, isBestSeller }: ProductCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { tags: allTags } = useStore();
  
  // Convert tag IDs to names
  const tagNames = product.tags
    ?.map(tagId => allTags.find(t => t.id === tagId)?.name)
    .filter((name): name is string => name !== undefined) || [];

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform relative">
        {isBestSeller && (
          <div className="absolute top-4 left-4 bg-[#8148B5] text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
            Best Seller
          </div>
        )}
        <div 
          className="relative cursor-pointer" 
          onClick={() => setIsModalOpen(true)}
        >
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all flex items-center justify-center">
            <span className="text-white opacity-0 hover:opacity-100 transition-opacity">
              Click to view details
            </span>
          </div>
        </div>
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
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
            className="w-full bg-[#8148B5] text-white px-4 py-2 rounded-md font-semibold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              <div>
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <img
                  src={product.slice_image_url}
                  alt={`${product.name} slice view`}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
                <p className="text-gray-600 mb-6">{product.description}</p>
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Composition:</h3>
                  <div className="whitespace-pre-line text-gray-600">
                    {product.composition}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {tagNames.map((tagName) => (
                    <span
                      key={tagName}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                    >
                      {tagName}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl font-bold text-[#8148B5]">
                    ${product.price}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart();
                      setIsModalOpen(false);
                    }}
                    className="bg-[#8148B5] text-white px-6 py-2 rounded-md font-semibold hover:bg-opacity-90 transition-all flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;