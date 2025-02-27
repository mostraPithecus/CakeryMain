import React, { useState, useMemo } from 'react';
import { ShoppingCart, Info, Check } from 'lucide-react';
import { useStore } from '../lib/store';
import type { Product } from '../lib/database.types';
import { toast } from 'react-hot-toast';
import ConsultationButton from './ConsultationButton';

// Cake base options
const cakeBases = [
  { id: '', name: 'Select cake base', price: 0 },
  { id: 'vanilla', name: 'Vanilla Sponge', price: 10 },
  { id: 'chocolate', name: 'Chocolate Sponge', price: 12 },
  { id: 'redVelvet', name: 'Red Velvet', price: 15 },
  { id: 'carrot', name: 'Carrot Cake', price: 14 },
  { id: 'lemon', name: 'Lemon Sponge', price: 13 }
];

// Filling options
const cakeFillings = [
  { id: '', name: 'Select filling', price: 0 },
  { id: 'cream', name: 'Cream Cheese', price: 8 },
  { id: 'chocolate', name: 'Chocolate Ganache', price: 10 },
  { id: 'fruit', name: 'Fresh Fruits', price: 12 },
  { id: 'caramel', name: 'Salted Caramel', price: 11 },
  { id: 'berry', name: 'Berry Compote', price: 12 }
];

// Size options
const cakeSizes = [
  { id: '', name: 'Select size', price: 0, weight: 0 },
  { id: 'small', name: 'Small (1 kg, 6-8 servings)', price: 0, weight: 1 },
  { id: 'medium', name: 'Medium (2 kg, 10-12 servings)', price: 15, weight: 2 },
  { id: 'large', name: 'Large (3 kg, 16-20 servings)', price: 30, weight: 3 }
];

// Decorations
const cakeDecorations = [
  { id: '', name: 'Select decoration', price: 0 },
  { id: 'none', name: 'Simple Decoration', price: 0 },
  { id: 'fruits', name: 'Fresh Fruits', price: 8 },
  { id: 'chocolate', name: 'Chocolate Decoration', price: 10 },
  { id: 'flowers', name: 'Edible Flowers', price: 12 },
  { id: 'custom', name: 'Custom Theme', price: 15 }
];

interface CakeConstructorProps {
  onAddToCart: (product: Product) => void;
}

const CakeConstructor: React.FC<CakeConstructorProps> = ({ onAddToCart }) => {
  // Cake configurator state
  const [selectedBase, setSelectedBase] = useState(cakeBases[0]);
  const [selectedFilling, setSelectedFilling] = useState(cakeFillings[0]);
  const [selectedSize, setSelectedSize] = useState(cakeSizes[0]);
  const [selectedDecoration, setSelectedDecoration] = useState(cakeDecorations[0]);
  const [customMessage, setCustomMessage] = useState('');
  const [customBaseInput, setCustomBaseInput] = useState('');
  const [customFillingInput, setCustomFillingInput] = useState('');
  const [otherRequests, setOtherRequests] = useState('');
  const [showOtherBase, setShowOtherBase] = useState(false);
  const [showOtherFilling, setShowOtherFilling] = useState(false);
  
  // Calculate total price
  const totalPrice = useMemo(() => {
    return (
      selectedBase.price +
      selectedFilling.price +
      selectedSize.price +
      selectedDecoration.price
    );
  }, [selectedBase, selectedFilling, selectedSize, selectedDecoration]);

  // Calculate price breakdown
  const priceBreakdown = useMemo(() => {
    return [
      { name: "Base", item: selectedBase.name, price: selectedBase.price },
      { name: "Filling", item: selectedFilling.name, price: selectedFilling.price },
      { name: "Size", item: selectedSize.name.split(' ')[0], price: selectedSize.price },
      { name: "Decoration", item: selectedDecoration.name, price: selectedDecoration.price },
    ];
  }, [selectedBase, selectedFilling, selectedSize, selectedDecoration]);

  // Track progress in cake configuration
  const progress = useMemo(() => {
    let steps = 4; // Base, Filling, Size, Decoration
    let completed = 0;

    if (selectedBase.id !== '') completed++;
    if (selectedFilling.id !== '') completed++;
    if (selectedSize.id !== '') completed++;
    if (selectedDecoration.id !== '') completed++;

    return (completed / steps) * 100;
  }, [selectedBase, selectedFilling, selectedSize, selectedDecoration]);

  // Handle add to cart with custom cake
  const handleAddToCart = () => {
    // Validate required fields
    if (selectedBase.id === '') {
      toast.error('Please select a base');
      return;
    }
    
    if (selectedFilling.id === '') {
      toast.error('Please select a filling');
      return;
    }
    
    if (selectedSize.id === '') {
      toast.error('Please select a size');
      return;
    }
    
    if (selectedDecoration.id === '') {
      toast.error('Please select a decoration');
      return;
    }
    
    if (showOtherBase && !customBaseInput.trim()) {
      toast.error('Please specify the custom base');
      return;
    }
    
    if (showOtherFilling && !customFillingInput.trim()) {
      toast.error('Please specify the custom filling');
      return;
    }

    const customCake: Product = {
      id: `custom-cake-${Date.now()}`,
      name: `Custom ${selectedBase.id === 'other' ? customBaseInput : selectedBase.name} Cake`,
      description: `Custom cake with ${selectedBase.id === 'other' ? customBaseInput : selectedBase.name} and ${selectedFilling.id === 'other' ? customFillingInput : selectedFilling.name}`,
      composition: `Base: ${selectedBase.id === 'other' ? customBaseInput : selectedBase.name}\nFilling: ${selectedFilling.id === 'other' ? customFillingInput : selectedFilling.name}\nDecoration: ${selectedDecoration.name}${customMessage ? '\nMessage: ' + customMessage : ''}${otherRequests ? '\nSpecial requests: ' + otherRequests : ''}`,
      price: totalPrice,
      image_url: "https://images.unsplash.com/photo-1562777717-dc81799a69df?q=80&w=1974&auto=format&fit=crop",
      category_id: "custom-cakes",
      tags: ["custom", "cake", selectedBase.id, selectedFilling.id],
      is_custom_order: true,
      weight_kg: selectedSize.weight
    };
    
    onAddToCart(customCake);
    toast.success(
      <div className="flex items-center gap-2">
        <Check className="h-5 w-5 text-green-500" />
        <div>
          <p className="font-medium">Cake added to cart!</p>
          <p className="text-sm">{customCake.name} - €{totalPrice.toFixed(2)}</p>
        </div>
      </div>
    );
    
    // Reset form to default values
    setSelectedBase(cakeBases[0]);
    setSelectedFilling(cakeFillings[0]);
    setSelectedSize(cakeSizes[0]);
    setSelectedDecoration(cakeDecorations[0]);
    setCustomMessage('');
    setOtherRequests('');
    setCustomBaseInput('');
    setCustomFillingInput('');
    setShowOtherBase(false);
    setShowOtherFilling(false);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Summary Card (Replaced Image with Text Summary) */}
        <div className="w-full md:w-1/2 p-6 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-4 relative">
            <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full transform rotate-12 shadow-sm">
              Best Value!
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-4">Your Cake</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Base:</span>
                <span className="text-gray-800">{showOtherBase ? customBaseInput || '[Not specified]' : selectedBase.name}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Filling:</span>
                <span className="text-gray-800">{showOtherFilling ? customFillingInput || '[Not specified]' : selectedFilling.name}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Size:</span>
                <span className="text-gray-800">{selectedSize.name.split(' ')[0]}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Decoration:</span>
                <span className="text-gray-800">{selectedDecoration.name}</span>
              </div>
              
              {customMessage && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Message:</span>
                  <span className="text-gray-800">{customMessage}</span>
                </div>
              )}
              
              {otherRequests && (
                <div className="flex flex-col">
                  <span className="font-medium text-gray-700 mb-1">Special Requests:</span>
                  <span className="text-gray-800 text-sm italic">{otherRequests}</span>
                </div>
              )}
            </div>
            
            {/* Price Breakdown */}
            <div className="pt-4 border-t border-gray-200 mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Price Breakdown:</h4>
              <div className="space-y-1 text-sm mb-3">
                {priceBreakdown.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-600">{item.name}: {item.item}</span>
                    <span className="text-gray-800 font-medium">€{item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <p className="font-semibold text-gray-800">Total Price</p>
                <p className="text-2xl font-bold text-[#8148B5]">€{totalPrice.toFixed(2)}</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="bg-gray-200 rounded-full h-2.5 mb-4">
              <div className="bg-[#8148B5] h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            
            {/* Desktop-only Submit Button */}
            <button
              onClick={handleAddToCart}
              className="hidden md:block w-full py-3 bg-gradient-to-r from-[#82D616] to-[#16A34A] text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Add to Cart</span>
            </button>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">For Customers & Bakers:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>After adding to cart, a confectioner will contact you to confirm details</li>
                  <li>Custom cake orders require minimum 48 hours notice</li>
                  <li>Final price may be adjusted based on design complexity</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Cake Configurator */}
        <div className="w-full md:w-1/2 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Create Your Cake</h3>
          
          {/* Cake Base Selection */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Base
            </label>
            <select
              value={showOtherBase ? 'other' : selectedBase.id}
              onChange={(e) => {
                if (e.target.value === 'other') {
                  setShowOtherBase(true);
                } else {
                  setShowOtherBase(false);
                  setSelectedBase(cakeBases.find(base => base.id === e.target.value) || cakeBases[0]);
                }
              }}
              className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8148B5] focus:border-[#8148B5]"
            >
              {cakeBases.map(base => (
                <option key={base.id} value={base.id}>
                  {base.name} {base.price > 0 ? `(+€${base.price.toFixed(2)})` : ''}
                </option>
              ))}
              <option value="other">Other (specify)</option>
            </select>
            
            {showOtherBase && (
              <div className="mb-5">
                <input
                  type="text"
                  value={customBaseInput}
                  onChange={(e) => setCustomBaseInput(e.target.value)}
                  placeholder="Specify base type"
                  className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8148B5] focus:border-[#8148B5]"
                />
              </div>
            )}
          </div>
          
          {/* Filling Selection */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Filling
            </label>
            <select
              value={showOtherFilling ? 'other' : selectedFilling.id}
              onChange={(e) => {
                if (e.target.value === 'other') {
                  setShowOtherFilling(true);
                } else {
                  setShowOtherFilling(false);
                  setSelectedFilling(cakeFillings.find(filling => filling.id === e.target.value) || cakeFillings[0]);
                }
              }}
              className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8148B5] focus:border-[#8148B5]"
            >
              {cakeFillings.map(filling => (
                <option key={filling.id} value={filling.id}>
                  {filling.name} {filling.price > 0 ? `(+€${filling.price.toFixed(2)})` : ''}
                </option>
              ))}
              <option value="other">Other (specify)</option>
            </select>
            
            {showOtherFilling && (
              <div className="mb-5">
                <input
                  type="text"
                  value={customFillingInput}
                  onChange={(e) => setCustomFillingInput(e.target.value)}
                  placeholder="Specify filling type"
                  className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8148B5] focus:border-[#8148B5]"
                />
              </div>
            )}
          </div>
          
          {/* Size Selection */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size *
            </label>
            <select
              value={selectedSize.id}
              onChange={(e) => {
                const selected = cakeSizes.find(size => size.id === e.target.value);
                if (selected) setSelectedSize(selected);
              }}
              className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8148B5] focus:border-[#8148B5]"
            >
              {cakeSizes.map(size => (
                <option key={size.id} value={size.id}>
                  {size.name} {size.price > 0 ? `(+€${size.price.toFixed(2)})` : ''}
                </option>
              ))}
            </select>
          </div>
          
          {/* Decoration Selection */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Decoration *
            </label>
            <select
              value={selectedDecoration.id}
              onChange={(e) => {
                const selected = cakeDecorations.find(decoration => decoration.id === e.target.value);
                if (selected) setSelectedDecoration(selected);
              }}
              className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8148B5] focus:border-[#8148B5]"
            >
              {cakeDecorations.map(decoration => (
                <option key={decoration.id} value={decoration.id}>
                  {decoration.name} {decoration.price > 0 ? `(+€${decoration.price.toFixed(2)})` : ''}
                </option>
              ))}
            </select>
          </div>
          
          {/* Custom Message */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cake Message (optional)
            </label>
            <input
              type="text"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Happy Birthday, Congratulations, etc."
              className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8148B5] focus:border-[#8148B5]"
            />
          </div>
          
          {/* Other Special Requests */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Requests (optional)
            </label>
            <textarea
              value={otherRequests}
              onChange={(e) => setOtherRequests(e.target.value)}
              placeholder="Any additional requirements"
              className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8148B5] focus:border-[#8148B5] min-h-[80px]"
            />
          </div>
          
          {/* Mobile-only Submit Button */}
          <div className="md:hidden mt-6">
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-700">Total Price:</h4>
                <p className="text-xl font-bold text-[#8148B5]">€{totalPrice.toFixed(2)}</p>
              </div>
              <div className="text-xs text-gray-500 mb-3">
                Base: €{selectedBase.price} • Filling: €{selectedFilling.price} • Size: €{selectedSize.price} • Decoration: €{selectedDecoration.price}
              </div>
              <div className="bg-gray-200 rounded-full h-2 mb-3">
                <div className="bg-[#8148B5] h-2 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
              <button
                onClick={handleAddToCart}
                className="w-full py-3 bg-gradient-to-r from-[#82D616] to-[#16A34A] text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 mb-4">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium mb-1">Order Info:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Custom orders require 48h notice</li>
                    <li>Final price may vary based on complexity</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Consultation Button */}
        <div className="mt-10">
          <ConsultationButton onAddToCart={onAddToCart} />
        </div>
      </div>
    </div>
  );
};

export default CakeConstructor;
