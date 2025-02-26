import React, { useState } from 'react';
import type { Product } from '../lib/database.types';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    product.image_url,
    ...(product.slice_image_url ? [product.slice_image_url] : []),
    ...(product.additional_images || [])
  ];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      onClick={() => onClick(product)}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-[1.02]"
    >
      <div className="relative aspect-square">
        <img
          src={images[currentImageIndex]}
          alt={product.name}
          className="w-full h-full object-cover"
          onLoad={(e) => e.currentTarget.classList.add('opacity-100')}
          style={{ opacity: 0, transition: 'opacity 0.3s ease-in-out' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/60 backdrop-blur-sm text-gray-800 p-1 rounded-full hover:bg-white/80"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/60 backdrop-blur-sm text-gray-800 p-1 rounded-full hover:bg-white/80"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
        {product.is_custom_order && (
          <div className="absolute top-2 right-2 bg-[#E57D8D] text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">
            Индивидуальный заказ
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 w-full p-3 text-white">
          <h3 className="text-lg font-semibold text-white">{product.name}</h3>
          <div className="flex justify-between items-center mt-1">
            <div className="text-white font-semibold">
              &euro;{product.price}
              {product.weight_kg ? <span className="text-xs opacity-80 ml-1">/ {product.weight_kg}kg</span> : ''}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white p-2 rounded-full hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white">
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
        
        <div className="flex flex-wrap gap-1">
          {product.tags && product.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
          {product.tags && product.tags.length > 3 && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              +{product.tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;