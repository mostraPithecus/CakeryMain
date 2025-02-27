import React, { useState, useEffect, useMemo } from 'react';
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
  ShoppingCart,
  Minus,
  X,
  ShoppingBag,
  Heart
} from 'lucide-react';
import { useStore } from './lib/store';
import { Toaster, toast } from 'react-hot-toast';
import type { Order, Product, Category, Tag } from './lib/database.types';
import { sendToTelegram } from './lib/telegram';
import ProductGrid from './components/ProductGrid';
import { PortfolioGrid } from './components/PortfolioGrid';
import DeliverySection from './components/DeliverySection';
import ConsultationCakeModal from './components/ConsultationCake';
import { portfolioItems, portfolioCategories } from './data/portfolio';

interface OrderFormData extends Omit<Order, 'id' | 'status' | 'created_at' | 'updated_at'> {
  contactMethod: 'phone' | 'telegram' | 'whatsapp' | 'social';
  deliveryMethod: 'pickup' | 'delivery' | null;
  deliveryAddress: string | null;
  deliveryCost: number;
  deliveryDistance: number;
  isAddressConfirmed: boolean;
}

interface CartItem {
  product: Product;
  quantity: number;
}

type SortOption = 'name' | 'price-asc' | 'price-desc';

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
    composition: 'Vanilla sponge layers\nVanilla buttercream\nFondant roses\nSugar flowers\nEdible pearls',
    price: 299,
    image_url: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5eea?auto=format&fit=crop&q=80&w=800',
    slice_image_url: 'https://images.unsplash.com/photo-1546379782-7b9235cf24ae?auto=format&fit=crop&q=80&w=800',
    category_id: 'wedding',
    tags: ['classic', 'wedding', 'fondant'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_custom_order: false,
    weight_kg: 4.5
  },
  {
    id: '2',
    name: 'Birthday Celebration',
    description: 'Colorful birthday cake with sprinkles and buttercream frosting',
    composition: 'Vanilla sponge cake\nButtercream frosting\nRainbow sprinkles\nFondant decorations\nEdible glitter',
    price: 149,
    image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800',
    slice_image_url: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&q=80&w=800',
    category_id: 'birthday',
    tags: ['birthday', 'colorful', 'buttercream'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_custom_order: false,
    weight_kg: 2.5
  },
  {
    id: '3',
    name: 'Chocolate Dream',
    description: 'Rich chocolate cake with ganache and chocolate shavings',
    composition: 'Moist chocolate sponge cake\nRich chocolate ganache\nDark chocolate shavings\nEdible gold dust',
    price: 179,
    image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800',
    slice_image_url: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&q=80&w=800',
    category_id: 'specialty',
    tags: ['chocolate', 'ganache', 'rich'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_custom_order: false,
    weight_kg: 2
  },
  {
    id: '4',
    name: 'Fresh Fruit Paradise',
    description: 'Light sponge cake topped with fresh seasonal fruits',
    composition: 'Light vanilla sponge cake\nFresh seasonal fruits\nWhipped cream\nEdible flowers',
    price: 199,
    image_url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=800',
    slice_image_url: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&q=80&w=800',
    category_id: 'fruit',
    tags: ['fruit', 'light', 'fresh'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_custom_order: false,
    weight_kg: 1.8
  },
  {
    id: '5',
    name: 'Elegant Anniversary',
    description: 'Sophisticated two-tier cake with gold accents and roses',
    composition: 'Moist vanilla sponge cake\nButtercream frosting\nFondant roses\nGold accents\nEdible pearls',
    price: 249,
    image_url: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=800',
    slice_image_url: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&q=80&w=800',
    category_id: 'anniversary',
    tags: ['elegant', 'roses', 'gold'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_custom_order: false,
    weight_kg: 3
  },
];

function App() {
  const { products, categories, tags, cart, addToCart, removeFromCart, updateCartItem, updateCartItemProduct, clearCart, submitOrder } = useStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('name');
  const [formData, setFormData] = useState<OrderFormData>({
    customer_name: '',
    phone: '',
    email: null,
    whatsapp: null,
    telegram: null,
    instagram: null,
    facebook: null,
    comments: null,
    contactMethod: 'phone',
    deliveryMethod: null,
    deliveryAddress: '',
    deliveryCost: 0,
    deliveryDistance: 0,
    isAddressConfirmed: false
  });
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

  // Handle delivery method change
  const handleDeliveryMethodChange = (
    method: 'pickup' | 'delivery' | null, 
    deliveryCost?: number,
    distance?: number
  ) => {
    setFormData(prev => ({
      ...prev,
      deliveryMethod: method,
      deliveryAddress: method === 'pickup' ? '' : prev.deliveryAddress,
      deliveryCost: deliveryCost || 0,
      deliveryDistance: distance || 0,
      isAddressConfirmed: false
    }));
  };

  const handleAddressConfirm = (address: string, isConfirmed: boolean) => {
    setFormData(prev => ({
      ...prev,
      deliveryAddress: address,
      isAddressConfirmed: isConfirmed
    }));
  };

  useEffect(() => {
    console.log('App mounted, fetching data...');
    useStore.getState().fetchProducts();
    useStore.getState().fetchCategories();
    useStore.getState().fetchTags();
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) + (formData.deliveryCost || 0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error('Please add items to your cart before submitting the order.');
      return;
    }

    if (!formData.deliveryMethod) {
      toast.error('Please select a delivery method.');
      return;
    }

    // Валидация контактных данных
    if (!formData.customer_name) {
      toast.error('Please enter your name.');
      return;
    }

    if (formData.contactMethod === 'phone' && !formData.phone) {
      toast.error('Please enter your phone number.');
      return;
    }

    if (formData.contactMethod === 'telegram' && !formData.telegram) {
      toast.error('Please enter your Telegram username.');
      return;
    }

    if (formData.contactMethod === 'whatsapp' && !formData.whatsapp) {
      toast.error('Please enter your WhatsApp number.');
      return;
    }

    try {
      // Prepare the order data
      const orderData = {
        customer_name: formData.customer_name,
        phone: formData.contactMethod === 'phone' ? formData.phone : '',
        email: formData.email,
        whatsapp: formData.contactMethod === 'whatsapp' ? formData.whatsapp : null,
        telegram: formData.contactMethod === 'telegram' ? formData.telegram : null,
        instagram: formData.contactMethod === 'social' ? formData.instagram : null,
        facebook: formData.contactMethod === 'social' ? formData.facebook : null,
        comments: formData.comments,
        deliveryMethod: formData.deliveryMethod || 'pickup',
        deliveryAddress: formData.deliveryMethod === 'delivery' ? formData.deliveryAddress : '',
        deliveryCost: formData.deliveryMethod === 'delivery' ? formData.deliveryCost : 0,
        items: cart.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        }))
      };

      // Submit the order
      await submitOrder(orderData);

      // Clear the cart and form
      clearCart();
      setFormData({
        customer_name: '',
        phone: '',
        email: null,
        whatsapp: null,
        telegram: null,
        instagram: null,
        facebook: null,
        comments: null,
        contactMethod: 'phone',
        deliveryMethod: null,
        deliveryAddress: '',
        deliveryCost: 0,
        deliveryDistance: 0,
        isAddressConfirmed: false
      });

      // Show success message
      toast.success('Order submitted successfully!');
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Failed to submit order. Please try again.');
    }
  };

  // Add to cart function
  const addItemToCart = (product: Product, quantity: number = 1) => {
    addToCart(product);
    
    // Показываем уведомление
    toast.success(`${product.name} added to cart`);
    // Открываем корзину
    setIsCartOpen(true);
  };

  // Функция для переключения тегов
  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  // Фильтрация и сортировка продуктов
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Фильтрация по категории
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category_id === selectedCategory);
    }

    // Фильтрация по тегам
    if (selectedTags.length > 0) {
      filtered = filtered.filter(product => 
        product.tags?.some(tagId => selectedTags.includes(tagId))
      );
    }

    // Сортировка
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8148B5] to-[#E57D8D]">
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-[#8148B5] via-[#B671D1] to-[#E57D8D] text-white shadow-md z-50">
        <div className="absolute inset-0 backdrop-blur-sm bg-white/10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="h-20 flex items-center justify-between gap-8">
            <h1 className="text-2xl font-bold text-white hover:text-white/90 transition-colors">Sweet Creations</h1>
            
            {/* Move cart button to the right side */}
            <div className="flex items-center gap-6">
              <a href="tel:+1234567890" className="flex items-center gap-2 text-white/90 hover:text-white transition-colors">
                <Phone className="w-5 h-5" />
                <span className="hidden md:inline">(123) 456-7890</span>
              </a>
              <a href="https://wa.me/1234567890" className="flex items-center gap-2 text-white/90 hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span className="hidden md:inline">WhatsApp</span>
              </a>
              <a href="https://instagram.com" className="flex items-center gap-2 text-white/90 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
                <span className="hidden md:inline">Instagram</span>
              </a>
              
              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all duration-200 border border-white/20"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden md:inline">Cart</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-[#E57D8D] text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-lg font-semibold">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Modal */}
      {isCartOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]" 
            onClick={() => setIsCartOpen(false)}
          />
          <div 
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-[101]" 
            onClick={e => e.stopPropagation()}
          >
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Shopping Cart</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <p className="text-center text-gray-500 mt-4">Your cart is empty</p>
                ) : (
                  <>
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.product.id} className="flex items-center gap-4">
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium">{item.product.name}</h3>
                            <p className="text-gray-500">&euro;{item.product.price}</p>
                            
                            {/* Display consultation notes for custom orders */}
                            {item.product.is_custom_order && (
                              <div className="mt-2">
                                <details className="text-sm" open>
                                  <summary className="cursor-pointer text-[#8148B5] font-medium">
                                    {item.product.customer_notes ? "Your Notes for Baker" : "Add Notes for Baker"}
                                  </summary>
                                  <div className="mt-2 p-2 bg-gray-50 rounded-md">
                                    <textarea
                                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                      placeholder="Share your cake ideas, preferences, or requirements..."
                                      defaultValue={item.product.customer_notes || ''}
                                      rows={3}
                                      onChange={(e) => {
                                        // Update the product with the new notes
                                        const updatedProduct = {
                                          ...item.product,
                                          customer_notes: e.target.value,
                                          composition: `This is a custom cake that will be designed through consultation with our baker.\n\nAdditional notes: ${e.target.value || 'No notes provided'}\n\nOur team will contact you to discuss details.`
                                        };
                                        
                                        // Update item in cart
                                        updateCartItemProduct(item.product.id, updatedProduct);
                                      }}
                                    />
                                  </div>
                                </details>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newQuantity = Math.max(0, item.quantity - 1);
                                  if (newQuantity === 0) {
                                    removeFromCart(item.product.id);
                                    toast.success('Item removed from cart');
                                  } else {
                                    updateCartItem(item.product.id, newQuantity);
                                    toast.success('Cart updated');
                                  }
                                }}
                                className="p-1 rounded-full hover:bg-gray-100"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span>{item.quantity}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateCartItem(item.product.id, item.quantity + 1);
                                  toast.success('Cart updated');
                                }}
                                className="p-1 rounded-full hover:bg-gray-100"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromCart(item.product.id);
                              toast.success('Item removed from cart');
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-6 border-t">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span>&euro;{cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2)}</span>
                      </div>
                      <button
                        onClick={() => {
                          setIsCartOpen(false);
                          document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="w-full mt-4 bg-[#8148B5] text-white px-6 py-3 rounded-md font-semibold hover:bg-opacity-90 transition-all"
                      >
                        Proceed to Order
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </> 
      )}

      {/* Mobile cart controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-[#8148B5] via-[#B671D1] to-[#E57D8D] backdrop-blur-sm shadow-lg sm:hidden z-50 flex items-center justify-between p-3 gap-3">
        <button
          onClick={() => document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex-1 bg-white/20 hover:bg-white/30 text-white px-4 py-2.5 rounded-full font-medium transition-colors flex items-center justify-center gap-2 border border-white/20"
        >
          <Heart className="w-5 h-5" />
          <span>Place Order</span>
        </button>
        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative flex-1 bg-white/20 hover:bg-white/30 text-white px-4 py-2.5 rounded-full font-medium transition-colors flex items-center justify-center gap-2 border border-white/20"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Cart</span>
          {cart.length > 0 && (
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white text-[#E57D8D] flex items-center justify-center text-xs font-bold">
              {cart.length}
            </div>
          )}
        </button>
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative pt-20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1621303837174-89787a7d4729?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#8148B5] to-[#E57D8D] opacity-80"></div>
        <div className="container mx-auto px-4 text-center text-white relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Perfect Custom Cakes for Any Occasion</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">Fresh, natural, and incredibly delicious cakes tailored just for you</p>
          <button
            onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-[#8148B5] px-8 py-3 rounded-full text-lg font-semibold hover:bg-opacity-90 transition-all"
          >
            View Our Cakes
          </button>
        </div>
      </section>

      {/* Full Product Catalog */}
      <section id="catalog" className="py-24 relative">
        {/* Remove the decorative section divider at top */}
        
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <div className="inline-block bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl shadow-lg border border-purple-100">
              <span className="inline-block px-4 py-1 bg-purple-100 text-[#8148B5] rounded-full text-sm font-medium mb-3">GALLERY</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Our Cake Collection</h2>
              <p className="text-gray-600 mt-2 max-w-xl mx-auto">Browse our showcase of stunning cake designs for inspiration</p>
            </div>
          </div>
          {/* Always show portfolio */}
          <PortfolioGrid
            items={portfolioItems}
            categories={portfolioCategories}
            onSwitchToProducts={() => {}} // Empty function since we want to hide constructor
          />
          
          {/* Add prominent consultation cake section */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-lg overflow-hidden border border-purple-100">
              <div className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
                <div className="w-full md:w-7/12">
                  <span className="inline-block px-4 py-1 bg-purple-100 text-[#8148B5] rounded-full text-sm font-medium mb-3">CUSTOM ORDER</span>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">Need a Special Custom Cake?</h3>
                  <p className="text-gray-600 mb-6">
                    Skip the designer and work directly with our pastry chef to create your dream cake. 
                    We'll discuss all details including flavor, design, decorations, and special requirements.
                  </p>
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-start gap-2">
                      <div className="mt-1 text-green-500">✓</div>
                      <div>
                        <h4 className="font-medium">Professional Consultation</h4>
                        <p className="text-sm text-gray-500">Direct communication with our pastry chef</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="mt-1 text-green-500">✓</div>
                      <div>
                        <h4 className="font-medium">Custom Design</h4>
                        <p className="text-sm text-gray-500">Tailored to your preferences and occasion</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      // Open the consultation modal instead of directly adding to cart
                      setIsConsultationModalOpen(true);
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-[#8148B5] to-[#B671D1] text-white rounded-lg shadow-md hover:bg-opacity-90 transition-all duration-300 flex items-center gap-2 font-medium"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Discuss with Baker</span>
                  </button>
                </div>
                <div className="w-full md:w-5/12 flex justify-center">
                  <img 
                    src="https://imgur.com/qGTIKWX.jpg" 
                    alt="Our Confectioner" 
                    className="rounded-lg shadow-lg max-w-full md:max-w-xs h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Add visual divider at bottom of section */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSI3MHB4IiB2aWV3Qm94PSIwIDAgMTI4MCAxNDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTEyODAgMy40QzEwNTAuNTkgMTggMTAxOS40IDg0Ljg5IDczNC40MiA4NC44OWMtMzIwIDAtMzIwLTg0LjMtNjQwLTg0LjNDNTkuNC41OSAyOC4yIDEuNiAwIDMuNFYxNDBoMTI4MHoiIGZpbGwtb3BhY2l0eT0iLjMiLz48cGF0aCBkPSJNMCAyNC4zMWM0My40Ni01LjY5IDk0LjU2LTkuMjUgMTU4LjQyLTkuMjUgMzIwIDAgMzIwIDg5LjI0IDY0MCA4OS4yNCAyNTYuMTMgMCAzMDcuMjgtNTcuMTYgNDgxLjU4LTgwVjE0MEgweiIgZmlsbC1vcGFjaXR5PSIuNSIvPjxwYXRoIGQ9Ik0xMjgwIDUxLjc2Yy0yMDEgMTIuNDktMjQyLjQzIDUzLjQtNTEzLjU4IDUzLjQtMzIwIDAtMzIwLTU3LTY0MC01Ny00OC44NS4wMS05MC4yMSAxLjM1LTEyNi40MiAzLjZWMTQwaDEyODB6Ii8+PC9nPjwvc3ZnPg==')]"></div>
      </section>

      {/* Order Form */}
      <section id="order-section" className="py-16 bg-gradient-to-b from-white to-pink-50 relative">
        {/* Add decorative elements to make this section stand out */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-5 pointer-events-none">
          <div className="absolute -right-10 top-10 w-72 h-72 bg-[#E57D8D] rounded-full"></div>
          <div className="absolute -left-20 top-40 w-80 h-80 bg-[#8148B5] rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 max-w-2xl relative">
          <div className="mb-12 text-center">
            <span className="inline-block px-4 py-1 bg-pink-100 text-[#E57D8D] rounded-full text-sm font-medium mb-3">ORDER NOW</span>
            <h2 className="text-3xl md:text-4xl font-bold">Place Your Order</h2>
            <p className="text-gray-600 mt-2 max-w-xl mx-auto">Fill out the form below to order your perfect cake</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
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

              <div className="mb-8">
                <DeliverySection
                  onDeliveryMethodChange={handleDeliveryMethodChange}
                  onAddressConfirm={handleAddressConfirm}
                  googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                />
              </div>

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
                          ? 'bg-[#8148B5] text-white'
                          : 'bg-white/20 hover:bg-white/30 border-gray-300'
                      } transition-colors duration-200`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

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

            <div className="space-y-3 mb-4">
              {cart.length === 0 && (
                <div className="flex items-center justify-between gap-4 text-red-500">
                  <span>Please add at least one cake to your cart</span>
                  <button
                    type="button"
                    onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-[#8148B5] text-white px-4 py-2 rounded-full text-sm hover:bg-opacity-90 transition-colors whitespace-nowrap"
                  >
                    Design Your Cake
                  </button>
                </div>
              )}
              {cart.length > 0 && (!formData.deliveryMethod || (formData.deliveryMethod === 'delivery' && !formData.isAddressConfirmed)) && (
                <div className="flex items-center justify-between gap-4 text-red-500">
                  <span>
                    {!formData.deliveryMethod 
                      ? "Please select a delivery method"
                      : "Please confirm delivery address"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const deliveryMethodHeader = document.getElementById('delivery-method-header');
                      if (deliveryMethodHeader) {
                        deliveryMethodHeader.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      } else {
                        document.getElementById('delivery-section')?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="bg-[#8148B5] text-white px-4 py-2 rounded-full text-sm hover:bg-opacity-90 transition-colors whitespace-nowrap"
                  >
                    Choose Delivery
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!formData.deliveryMethod || (formData.deliveryMethod === 'delivery' && !formData.isAddressConfirmed)}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                (!formData.deliveryMethod || (formData.deliveryMethod === 'delivery' && !formData.isAddressConfirmed))
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#8148B5] text-white hover:bg-opacity-90'
              }`}
            >
              Place Order
            </button>

            {/* Order Summary */}
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.product.name}</span>
                    <span>&euro;{(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>&euro;{cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2)}</span>
                  </div>
                  
                  {formData.deliveryMethod === 'delivery' && formData.isAddressConfirmed && (
                    <>
                      <div className="flex justify-between text-sm mt-2">
                        <span>Delivery ({(formData.deliveryDistance / 1000).toFixed(1)} km)</span>
                        <span>&euro;{formData.deliveryCost.toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        &euro;2/km, minimum &euro;5
                      </div>
                    </>
                  )}
                  
                  <div className="flex justify-between font-semibold text-base mt-2 pt-2 border-t">
                    <span>Total</span>
                    <span>&euro;{(cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0) + formData.deliveryCost).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="mt-4 flex items-center justify-center gap-2 w-full bg-white border border-[#8148B5] text-[#8148B5] py-2 px-4 rounded-lg hover:bg-purple-50 transition-colors duration-300"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Review Cart</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-b from-pink-100 to-purple-100">
        <div className="container mx-auto px-4 max-w-4xl">
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

      {/* Features */}
      <section className="py-16 bg-gradient-to-b from-pink-100 to-purple-100">
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

      {/* Footer */}
      <div id="footer-section" className="pb-20 sm:pb-0">
        <footer className="py-8 bg-gradient-to-b from-purple-100 to-[#8148B5]">
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

      {/* Add the consultation modal */}
      <ConsultationCakeModal 
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        onAddToCart={addToCart}
      />
    </div>
  );
}

export default App;