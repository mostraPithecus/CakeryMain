import React, { useState, useEffect, useMemo } from 'react';
import { Product, Category } from '../lib/database.types';
import { Filter, ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import CakeConstructor from './CakeConstructor';

interface ProductGridProps {
  products: Product[];
  categories?: Category[];
  onAddToCart: (product: Product) => void;
  onSwitchToPortfolio?: () => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, categories, onAddToCart, onSwitchToPortfolio }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showFloatingSwitch, setShowFloatingSwitch] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Определяем, является ли устройство мобильным
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint is 768px in Tailwind
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Handle scroll for floating switch
  useEffect(() => {
    const handleScroll = () => {
      const catalogSection = document.getElementById('catalog-section');
      const orderSection = document.getElementById('order-section');
      
      if (catalogSection && orderSection) {
        const catalogTop = catalogSection.getBoundingClientRect().top;
        const catalogBottom = catalogSection.getBoundingClientRect().bottom;
        const orderTop = orderSection.getBoundingClientRect().top;
        
        // Show floating switch when catalog is in view but not at the top
        // and hide it when order section comes into view or when we're at the bottom of catalog
        setIsScrolled(window.scrollY > 100);
        
        // Show floating switch when:
        // 1. We've scrolled past the top of the catalog section
        // 2. We haven't reached the bottom of the catalog section yet
        // 3. The order section is not yet visible
        const shouldShowFloating = 
          catalogTop < 0 && 
          catalogBottom > window.innerHeight * 0.5 && 
          orderTop > window.innerHeight;
          
        setShowFloatingSwitch(shouldShowFloating);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative min-h-screen animate-fadeIn">
      {/* Background with Depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(52,211,153,0.15),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(6,182,212,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.5)_0%,transparent_40%,transparent_60%,rgba(255,255,255,0.5)_100%)]" />
      
      {/* Floating Switch Button (Mobile Only) */}
      {showFloatingSwitch && (
        <div className="fixed bottom-6 right-6 z-10">
          <button
            onClick={() => {
              onSwitchToPortfolio?.();
              // Scroll to the top of the catalog section
              document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-3 bg-gradient-to-r from-[#B681F9] to-[#8148B5] text-white rounded-md shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 border border-purple-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span>Portfolio</span>
          </button>
        </div>
      )}
      
      {/* Content */}
      <div className="relative">
        {/* Catalog Controls */}
        <div id="catalog-section" className={`sticky top-[64px] z-30 bg-white/95 backdrop-blur-sm border-b shadow-sm transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
          <div className="container mx-auto px-4">
            {/* Mode Switch */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Cake Constructor</h2>
            </div>

            {/* Bottom Switch Button */}
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => {
                  onSwitchToPortfolio?.();
                  // Scroll to the top of the catalog section
                  document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-gradient-to-r from-[#B681F9] to-[#8148B5] text-white rounded-md shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2 border border-purple-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span>Portfolio</span>
              </button>
            </div>
          </div>
        </div>

        {/* Cake Constructor */}
        <div id="catalog" className="container mx-auto px-4 py-6">
          <CakeConstructor onAddToCart={onAddToCart} />
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;