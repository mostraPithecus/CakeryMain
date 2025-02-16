import React, { useState } from 'react';
import {
  Phone,
  Instagram,
  MessageCircle,
  Leaf,
  Palette,
  Truck,
  Award,
  Star,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useStore } from './lib/store';
import { Toaster } from 'react-hot-toast';
import type { Order } from './lib/database.types';

interface Cake {
  name: string;
  price: string;
  image: string;
}

const cakes: Cake[] = [
  {
    name: 'Classic Wedding Cake',
    price: '299',
    image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5eea?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Birthday Celebration',
    price: '149',
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Chocolate Dream',
    price: '179',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Fresh Fruit Paradise',
    price: '199',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Elegant Anniversary',
    price: '249',
    image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Special Occasion',
    price: '169',
    image: 'https://images.unsplash.com/photo-1562777717-dc6984f65a63?auto=format&fit=crop&q=80&w=800',
  },
];

const features = [
  {
    icon: <Leaf className="w-8 h-8" />,
    title: '100% Natural Ingredients',
    description: 'Only the finest, freshest ingredients in every cake',
  },
  {
    icon: <Palette className="w-8 h-8" />,
    title: 'Custom Designs',
    description: 'Unique creations for every special occasion',
  },
  {
    icon: <Truck className="w-8 h-8" />,
    title: 'Reliable Delivery',
    description: 'On-time delivery to your specified location',
  },
  {
    icon: <Award className="w-8 h-8" />,
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

function App() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [formData, setFormData] = useState<Omit<Order, 'id' | 'status' | 'created_at' | 'updated_at'> & { comments?: string }>({
    customer_name: '',
    phone: '',
    email: null,
    whatsapp: null,
    instagram: null,
    facebook: null,
    comments: ''
  });
  const submitOrder = useStore(state => state.submitOrder);
  const addToCart = useStore(state => state.addToCart);
  const removeFromCart = useStore(state => state.removeFromCart);
  const updateCartItem = useStore(state => state.updateCartItem);
  const cart = useStore(state => state.cart);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitOrder({
        customer_name: formData.customer_name,
        phone: formData.phone,
        email: formData.email || null,
        whatsapp: formData.whatsapp || null,
        instagram: formData.instagram || null,
        facebook: formData.facebook || null,
        comments: formData.comments || null,
      });
      
      // Reset form after successful submission
      setFormData({
        customer_name: '',
        phone: '',
        email: null,
        whatsapp: null,
        instagram: null,
        facebook: null,
        comments: ''
      });
    } catch (error) {
      console.error('Failed to submit order:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8148B5] to-[#E57D8D]">
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="fixed w-full bg-white/90 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#8148B5]">Sweet Creations</h2>
          <div className="flex items-center gap-6">
            <a href="tel:+1234567890" className="flex items-center gap-2 hover:text-[#8148B5]">
              <Phone className="w-5 h-5" />
              <span className="hidden md:inline">(123) 456-7890</span>
            </a>
            <a href="https://wa.me/1234567890" className="flex items-center gap-2 hover:text-[#8148B5]">
              <MessageCircle className="w-5 h-5" />
              <span className="hidden md:inline">WhatsApp</span>
            </a>
            <a href="https://instagram.com" className="flex items-center gap-2 hover:text-[#8148B5]">
              <Instagram className="w-5 h-5" />
              <span className="hidden md:inline">Instagram</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative pt-20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 text-center text-white relative">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Perfect Custom Cakes for Any Occasion</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">Fresh, natural, and incredibly delicious cakes tailored just for you</p>
          <button
            onClick={() => document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-[#8148B5] px-8 py-3 rounded-full text-lg font-semibold hover:bg-opacity-90 transition-all"
          >
            Order Now
          </button>
        </div>
      </section>

      {/* Cake Catalog */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Best Sellers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cakes.map((cake, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img src={cake.image} alt={cake.name} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{cake.name}</h3>
                  <p className="text-[#8148B5] font-bold mb-4">${cake.price}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        addToCart({
                          id: crypto.randomUUID(),
                          name: cake.name,
                          price: parseFloat(cake.price),
                          description: '',
                          image_url: cake.image,
                          category_id: crypto.randomUUID(),
                          created_at: new Date().toISOString(),
                          updated_at: new Date().toISOString(),
                        }, 1);
                        setIsCartOpen(true);
                      }}
                      className="flex-1 bg-[#8148B5] text-white py-2 rounded-md hover:bg-opacity-90 transition-all"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="text-[#8148B5] mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Cart Button */}
      <button 
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 bg-[#8148B5] text-white p-4 rounded-full shadow-lg hover:bg-opacity-90 transition-all z-50 flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {totalItems > 0 && (
          <span className="bg-white text-[#8148B5] px-2 py-1 rounded-full text-sm font-bold">
            {totalItems}
          </span>
        )}
      </button>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-lg p-6 transform transition-transform">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Cart</h2>
              <button 
                onClick={() => setIsCartOpen(false)} 
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close cart"
                title="Close cart"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {cart.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                Your cart is empty
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                      <img src={item.product.image_url} alt={item.product.name} className="w-20 h-20 object-cover rounded" />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.product.name}</h3>
                        <p className="text-[#8148B5]">${item.product.price * item.quantity}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button 
                            onClick={() => updateCartItem(item.product.id, Math.max(0, item.quantity - 1), item.notes)}
                            className="bg-gray-200 text-gray-700 w-8 h-8 rounded flex items-center justify-center hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartItem(item.product.id, item.quantity + 1, item.notes)}
                            className="bg-gray-200 text-gray-700 w-8 h-8 rounded flex items-center justify-center hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-500 hover:text-red-700"
                        aria-label={`Remove ${item.product.name} from cart`}
                        title={`Remove ${item.product.name} from cart`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Total:</span>
                    <span className="text-xl font-bold text-[#8148B5]">${totalPrice}</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full bg-[#8148B5] text-white py-3 rounded-lg hover:bg-opacity-90 transition-all"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Test Supabase Connection */}
      <div className="fixed bottom-4 left-4 text-xs text-gray-500">
        DB URL: {import.meta.env.VITE_SUPABASE_URL ? '✅' : '❌'}
        <br />
        Anon Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅' : '❌'}
      </div>

      {/* Order Form */}
      <section id="order-form" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Place Your Order</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {cart.length === 0 ? (
              <div className="text-red-500 text-center mb-4">
                Please add at least one cake to your cart before submitting the order.
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h3 className="font-semibold mb-2">Order Summary:</h3>
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-medium">{item.product.name}</span>
                      <span className="text-gray-500 text-sm ml-2">x {item.quantity}</span>
                    </div>
                    <span>${item.product.price * item.quantity}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <strong>Total:</strong>
                    <strong className="text-[#8148B5]">${totalPrice}</strong>
                  </div>
                </div>
              </div>
            )}
            <div>
              <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                id="customer_name"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#8148B5] focus:border-[#8148B5]"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#8148B5] focus:border-[#8148B5]"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
              <input
                type="email"
                id="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value || null })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#8148B5] focus:border-[#8148B5]"
              />
            </div>
            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">WhatsApp (Optional)</label>
              <input
                type="tel"
                id="whatsapp"
                value={formData.whatsapp || ''}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value || null })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#8148B5] focus:border-[#8148B5]"
              />
            </div>
            <div>
              <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">Instagram (Optional)</label>
              <input
                type="text"
                id="instagram"
                value={formData.instagram || ''}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value || null })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#8148B5] focus:border-[#8148B5]"
              />
            </div>
            <div>
              <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-1">Facebook (Optional)</label>
              <input
                type="text"
                id="facebook"
                value={formData.facebook || ''}
                onChange={(e) => setFormData({ ...formData, facebook: e.target.value || null })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#8148B5] focus:border-[#8148B5]"
              />
            </div>
            <div>
              <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">Additional Comments</label>
              <textarea
                id="comments"
                value={formData.comments || ''}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#8148B5] focus:border-[#8148B5] h-32 resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#8148B5] text-white px-8 py-3 rounded-md font-semibold hover:bg-opacity-90 transition-all"
            >
              Place Order
            </button>
          </form>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="max-w-3xl mx-auto relative">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-semibold text-lg">{testimonials[currentTestimonial].name}</h3>
                  <div className="flex text-yellow-400">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">{testimonials[currentTestimonial].text}</p>
            </div>
            <button
              aria-label="Previous testimonial"
              onClick={() => setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              aria-label="Next testimonial"
              onClick={() => setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#8148B5] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
              <div className="space-y-2">
                <a href="tel:+1234567890" className="flex items-center gap-2 hover:text-gray-200">
                  <Phone className="w-5 h-5" />
                  (123) 456-7890
                </a>
                <a href="https://wa.me/1234567890" className="flex items-center gap-2 hover:text-gray-200">
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </a>
                <a href="https://instagram.com" className="flex items-center gap-2 hover:text-gray-200">
                  <Instagram className="w-5 h-5" />
                  @sweetcreations
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Hours</h3>
              <p>Monday - Friday: 9am - 6pm</p>
              <p>Saturday: 10am - 4pm</p>
              <p>Sunday: Closed</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Location</h3>
              <p>123 Baker Street</p>
              <p>Sweet City, SC 12345</p>
              <p>United States</p>
            </div>
          </div>
          <div className="text-center mt-12 pt-8 border-t border-white/20">
            <p>&copy; 2025 Sweet Creations. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;