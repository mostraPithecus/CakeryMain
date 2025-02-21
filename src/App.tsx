import React, { useState, useEffect } from 'react';
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
  Plus,
} from 'lucide-react';
import { useStore } from './lib/store';
import { Toaster, toast } from 'react-hot-toast';
import type { Order, Product } from './lib/database.types';
import { sendToTelegram } from './lib/telegram';
import ProductGrid from './components/ProductGrid';

interface OrderFormData extends Omit<Order, 'id' | 'status' | 'created_at' | 'updated_at'> {
  contactMethod: 'phone' | 'telegram' | 'whatsapp' | 'social';
}

interface CartItem {
  product: Product;
  quantity: number;
  notes?: string | null;
}

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

const products: Product[] = [
  {
    id: '1',
    name: 'Classic Wedding Cake',
    description: 'Elegant three-tier wedding cake with white fondant and sugar flowers',
    price: 299,
    image_url: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5eea?auto=format&fit=crop&q=80&w=800',
    category_id: 'wedding',
    tags: ['classic', 'wedding', 'fondant'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Birthday Celebration',
    description: 'Colorful birthday cake with sprinkles and buttercream frosting',
    price: 149,
    image_url: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=800',
    category_id: 'birthday',
    tags: ['birthday', 'colorful', 'buttercream'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Chocolate Dream',
    description: 'Rich chocolate cake with ganache and chocolate shavings',
    price: 179,
    image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800',
    category_id: 'specialty',
    tags: ['chocolate', 'ganache', 'rich'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Fresh Fruit Paradise',
    description: 'Light sponge cake topped with fresh seasonal fruits',
    price: 199,
    image_url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=800',
    category_id: 'fruit',
    tags: ['fruit', 'light', 'fresh'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Elegant Anniversary',
    description: 'Sophisticated two-tier cake with gold accents and roses',
    price: 249,
    image_url: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=800',
    category_id: 'anniversary',
    tags: ['elegant', 'roses', 'gold'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

function App() {
  const { products, cart, addToCart, removeFromCart, updateCartItem, clearCart, submitOrder, fetchProducts, fetchCategories, fetchTags } = useStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [formData, setFormData] = useState<OrderFormData>({
    customer_name: '',
    phone: '',
    email: null,
    whatsapp: null,
    telegram: null,
    instagram: null,
    facebook: null,
    comments: null,
    contactMethod: 'phone'
  });
  
  useEffect(() => {
    console.log('App mounted, fetching data...');
    fetchProducts();
    fetchCategories();
    fetchTags();
  }, [fetchProducts, fetchCategories, fetchTags]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error('Please add items to your cart first');
      return;
    }

    try {
      // Prepare order data by omitting contactMethod
      const { contactMethod, ...orderData } = formData;

      // Validate required fields based on contact method
      if (contactMethod === 'phone' && !orderData.phone) {
        toast.error('Please enter your phone number');
        return;
      }
      if (contactMethod === 'telegram' && !orderData.telegram) {
        toast.error('Please enter your Telegram username');
        return;
      }
      if (contactMethod === 'whatsapp' && !orderData.whatsapp) {
        toast.error('Please enter your WhatsApp number');
        return;
      }
      if (contactMethod === 'social' && !orderData.instagram && !orderData.facebook) {
        toast.error('Please enter at least one social media contact');
        return;
      }

      // Create order with only the selected contact method
      const order: Omit<Order, 'id' | 'status' | 'created_at' | 'updated_at'> = {
        customer_name: orderData.customer_name,
        phone: contactMethod === 'phone' ? orderData.phone : '',
        email: orderData.email,
        telegram: contactMethod === 'telegram' ? orderData.telegram : null,
        whatsapp: contactMethod === 'whatsapp' ? orderData.whatsapp : null,
        instagram: contactMethod === 'social' ? orderData.instagram : null,
        facebook: contactMethod === 'social' ? orderData.facebook : null,
        comments: orderData.comments
      };

      await submitOrder(order);
      
      // Reset form
      setFormData({
        customer_name: '',
        phone: '',
        email: null,
        whatsapp: null,
        telegram: null,
        instagram: null,
        facebook: null,
        comments: null,
        contactMethod: 'phone'
      });
      
      // Show success message
      toast.success('Order submitted successfully!');
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Failed to submit order. Please try again.');
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

      {/* Best Sellers Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Best Sellers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.slice(0, 3).map((product) => {
              console.log('Best Seller product:', product.id, typeof product.id);
              return (
                <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
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
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-[#8148B5] text-white px-4 py-2 rounded-md font-semibold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Full Product Catalog */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Full Catalog</h2>
          <ProductGrid
            products={products}
            onAddToCart={(product) => addToCart(product)}
          />
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
                            onClick={() => updateCartItem(item.product.id, Math.max(0, item.quantity - 1))}
                            className="bg-gray-200 text-gray-700 w-8 h-8 rounded flex items-center justify-center hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartItem(item.product.id, item.quantity + 1)}
                            className="bg-gray-200 text-gray-700 w-8 h-8 rounded flex items-center justify-center hover:bg-gray-300"
                          >
                            +
                          </button>
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
                      </div>
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
                <h3 className="font-semibold mb-4">Order Summary:</h3>
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-center mb-4 bg-white p-3 rounded-md shadow-sm">
                    <div className="flex items-center gap-4">
                      <img 
                        src={item.product.image_url} 
                        alt={item.product.name} 
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div>
                        <div className="font-medium">{item.product.name}</div>
                        <div className="text-gray-500 text-sm">
                          ${item.product.price} × {item.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="font-semibold">${item.product.price * item.quantity}</div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateCartItem(item.product.id, Math.max(0, item.quantity - 1))}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateCartItem(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id)}
                          className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center text-lg">
                    <strong>Total:</strong>
                    <strong className="text-xl font-bold text-[#8148B5]">${totalPrice}</strong>
                  </div>
                </div>
              </div>
            )}
            
            {/* Contact Information */}
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.customer_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, customer_name: e.target.value }))}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#8148B5] focus:border-[#8148B5]"
                />
              </div>

              {/* Contact Method Selection */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Preferred Contact Method
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: 'phone' as const, icon: 'phone', label: 'Phone' },
                    { id: 'telegram' as const, icon: 'send', label: 'Telegram' },
                    { id: 'whatsapp' as const, icon: 'message-circle', label: 'WhatsApp' },
                    { id: 'social' as const, icon: 'users', label: 'Social Media' }
                  ].map(method => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          contactMethod: method.id,
                          // Reset other contact fields when switching method
                          phone: method.id === 'phone' ? prev.phone : '',
                          whatsapp: method.id === 'whatsapp' ? prev.whatsapp : null,
                          telegram: method.id === 'telegram' ? prev.telegram : null,
                          instagram: method.id === 'social' ? prev.instagram : null,
                          facebook: method.id === 'social' ? prev.facebook : null
                        }));
                      }}
                      className={`p-3 rounded-lg border ${
                        formData.contactMethod === method.id
                          ? 'border-[#8148B5] bg-[#8148B5] text-white'
                          : 'border-gray-300 hover:border-[#8148B5]'
                      } transition-colors duration-200`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Contact Field */}
              {formData.contactMethod === 'phone' && (
                <div>
                  <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#8148B5] focus:border-[#8148B5]"
                    placeholder="+1234567890"
                  />
                </div>
              )}

              {formData.contactMethod === 'telegram' && (
                <div>
                  <label htmlFor="telegram" className="block text-gray-700 font-medium mb-2">
                    Telegram Username
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">@</span>
                    <input
                      type="text"
                      id="telegram"
                      name="telegram"
                      value={formData.telegram || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, telegram: e.target.value }))}
                      required
                      className="w-full px-4 py-2 pl-8 border border-gray-300 rounded-md focus:ring-[#8148B5] focus:border-[#8148B5]"
                      placeholder="username"
                    />
                  </div>
                </div>
              )}

              {formData.contactMethod === 'whatsapp' && (
                <div>
                  <label htmlFor="whatsapp" className="block text-gray-700 font-medium mb-2">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    id="whatsapp"
                    name="whatsapp"
                    value={formData.whatsapp || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#8148B5] focus:border-[#8148B5]"
                    placeholder="+1234567890"
                  />
                </div>
              )}

              {formData.contactMethod === 'social' && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="instagram" className="block text-gray-700 font-medium mb-2">
                      Instagram Username
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">@</span>
                      <input
                        type="text"
                        id="instagram"
                        name="instagram"
                        value={formData.instagram || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
                        className="w-full px-4 py-2 pl-8 border border-gray-300 rounded-md focus:ring-[#8148B5] focus:border-[#8148B5]"
                        placeholder="username"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="facebook" className="block text-gray-700 font-medium mb-2">
                      Facebook Profile URL
                    </label>
                    <input
                      type="url"
                      id="facebook"
                      name="facebook"
                      value={formData.facebook || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, facebook: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#8148B5] focus:border-[#8148B5]"
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="comments" className="block text-gray-700 font-medium mb-2">
                  Additional Comments
                </label>
                <textarea
                  id="comments"
                  name="comments"
                  value={formData.comments || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#8148B5] focus:border-[#8148B5]"
                  placeholder="Any special requests or notes..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={cart.length === 0}
              className={`w-full py-3 rounded-lg text-white font-semibold ${
                cart.length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#8148B5] hover:bg-opacity-90'
              } transition-colors duration-200`}
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