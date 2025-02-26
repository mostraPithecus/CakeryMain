import React, { useState } from 'react';
import { Leaf, Award, Clock, ThumbsUp, Phone, Instagram } from 'lucide-react';
import ProductGrid from './ProductGrid';
import { Product, Category } from '../lib/database.types';
import { toast } from 'react-hot-toast';
import ConsultationButton from './ConsultationButton';

interface MainPageProps {
  products: Product[];
  categories: Category[];
  onAddToCart: (product: Product) => void;
  onSwitchToPortfolio: () => void;
}

const features = [
  {
    icon: <Leaf className="w-8 h-8" />,
    title: '100% Natural Ingredients',
    description: 'Only the finest, freshest ingredients in every cake',
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: 'Custom Designs',
    description: 'Unique creations for every special occasion',
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: 'Reliable Delivery',
    description: 'On-time delivery to your specified location',
  },
  {
    icon: <ThumbsUp className="w-8 h-8" />,
    title: 'Expert Craftsmanship',
    description: 'Created by award-winning pastry chefs',
  },
];

const MainPage: React.FC<MainPageProps> = ({ products, categories, onAddToCart, onSwitchToPortfolio }) => {
  const handleAddToCart = (product: Product) => {
    onAddToCart(product);
    toast.success(`Added ${product.name} to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#8148B5] to-[#E57D8D] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Delicious Custom Cakes for Every Occasion
            </h1>
            <p className="text-xl mb-8">
              Handcrafted with love using the finest ingredients
            </p>
            <a
              href="#catalog"
              className="bg-white text-[#8148B5] px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all"
            >
              Design Your Cake
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-lg bg-gray-50 hover:shadow-lg transition-all"
              >
                <div className="text-[#8148B5] mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="catalog" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Delicious Creations
          </h2>
          <ProductGrid
            products={products}
            categories={categories}
            onAddToCart={handleAddToCart}
            onSwitchToPortfolio={onSwitchToPortfolio}
          />
          <div className="mt-12">
            <ConsultationButton onAddToCart={handleAddToCart} />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
            <div className="flex justify-center space-x-8">
              <a
                href="tel:+1234567890"
                className="flex items-center text-[#8148B5] hover:text-[#E57D8D] transition-colors"
              >
                <Phone className="w-6 h-6 mr-2" />
                <span>+123 456 7890</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-[#8148B5] hover:text-[#E57D8D] transition-colors"
              >
                <Instagram className="w-6 h-6 mr-2" />
                <span>Follow us on Instagram</span>
              </a>
              <button
                onClick={onSwitchToPortfolio}
                className="flex items-center text-[#8148B5] hover:text-[#E57D8D] transition-colors"
              >
                <span>Switch to Portfolio</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainPage;
