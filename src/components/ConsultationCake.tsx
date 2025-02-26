import React, { useState } from 'react';
import { Clock, MessageCircle, ShoppingCart, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { Product } from '../lib/database.types';

interface ConsultationCakeModalProps {
  onAddToCart: (product: Product) => void;
  isOpen: boolean;
  onClose: () => void;
}

const ConsultationCakeModal: React.FC<ConsultationCakeModalProps> = ({ 
  onAddToCart, 
  isOpen, 
  onClose 
}) => {
  const [notes, setNotes] = useState('');
  
  if (!isOpen) return null;
  
  const handleAddToCart = () => {
    const consultationCake: Product = {
      id: `consultation-cake-${Date.now()}`,
      name: 'Custom Consultation Cake',
      description: 'A fully custom cake designed through consultation with our baker',
      composition: `This is a custom cake that will be designed through consultation with our baker.\n\nAdditional notes: ${notes || 'No notes provided'}\n\nOur team will contact you to discuss details.`,
      price: 20, // Base consultation fee
      image_url: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=2036&auto=format&fit=crop",
      category_id: "custom-cakes",
      tags: ["custom", "consultation", "cake"],
      is_custom_order: true,
      weight_kg: 0 // Weight will be determined during consultation
    };
    
    onAddToCart(consultationCake);
    toast.success(
      <div className="flex items-center gap-2">
        <ShoppingCart className="h-5 w-5 text-green-500" />
        <div>
          <p className="font-medium">Consultation cake added to cart!</p>
          <p className="text-sm">Our team will contact you to discuss details</p>
        </div>
      </div>
    );
    
    // Reset form and close modal
    setNotes('');
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-[#8148B5] to-[#E57D8D] py-6 px-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-white hover:text-white/80 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <h3 className="text-2xl font-bold">Consultation Cake</h3>
          <p className="text-white text-opacity-90 mt-2">
            Can't decide? Let's design your dream cake together!
          </p>
        </div>
        
        <div className="p-6">
          <div className="flex items-start space-x-3 mb-4">
            <Clock className="h-5 w-5 text-[#8148B5] mt-0.5" />
            <p className="text-gray-700">
              <span className="font-semibold">Skip the constructor</span> and discuss all details directly with our professional baker
            </p>
          </div>
          
          <div className="flex items-start space-x-3 mb-6">
            <MessageCircle className="h-5 w-5 text-[#8148B5] mt-0.5" />
            <p className="text-gray-700">
              <span className="font-semibold">Share your vision</span> and we'll bring it to life with our expertise
            </p>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Any initial ideas? (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Brief description of your cake idea, occasion, or preferences..."
              className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8148B5] focus:border-[#8148B5] min-h-[100px]"
            />
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Starting from</p>
              <p className="text-2xl font-bold text-[#8148B5]">€20.00</p>
              <p className="text-xs text-gray-500">Consultation fee, final price determined after discussion</p>
            </div>
            
            <button
              onClick={handleAddToCart}
              className="px-6 py-3 bg-gradient-to-r from-[#82D616] to-[#16A34A] text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationCakeModal;
