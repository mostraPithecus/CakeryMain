import React from 'react';
import { Leaf, Award, Clock, ThumbsUp, Phone, Instagram } from 'lucide-react';
import ProductGrid from './ProductGrid';
import { Product } from '../lib/database.types';

interface MainPageProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
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

const testimonials = [
  {
    name: 'Sarah Johnson',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
    text: 'The wedding cake exceeded our expectations! Absolutely stunning and delicious.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    text: "Best birthday cake I've ever had. The attention to detail was incredible.",
    rating: 5,
  },
  {
    name: 'Emma Williams',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    text: 'Professional service and amazing results. Will definitely order again!',
    rating: 5,
  },
];

export default function MainPage({ products, onAddToCart }: MainPageProps) {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-purple-100 to-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 text-[#8148B5]">Sweet Delights</h1>
          <p className="text-xl text-gray-600 mb-8">Creating unforgettable moments with our delicious cakes</p>
          <a href="#products" className="inline-block bg-[#8148B5] text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors">
            View Our Cakes
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg bg-gray-50">
                <div className="inline-block p-3 bg-purple-100 rounded-full mb-4 text-[#8148B5]">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Cakes</h2>
          <ProductGrid products={products} onAddToCart={onAddToCart} />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <div className="flex text-yellow-400">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Contact Us</h2>
          <p className="text-xl text-gray-600 mb-8">
            Have questions? We're here to help!
          </p>
          <div className="flex justify-center space-x-6">
            <a
              href="tel:+1234567890"
              className="flex items-center text-gray-600 hover:text-[#8148B5]"
            >
              <Phone className="w-5 h-5 mr-2" />
              <span>+1 234 567 890</span>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-600 hover:text-[#8148B5]"
            >
              <Instagram className="w-5 h-5 mr-2" />
              <span>@sweetdelights</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
