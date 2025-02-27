import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import ConsultationCakeModal from './ConsultationCake';
import { Product } from '../lib/database.types';

interface ConsultationButtonProps {
  onAddToCart: (product: Product) => void;
  className?: string;
}

const ConsultationButton: React.FC<ConsultationButtonProps> = ({ 
  onAddToCart,
  className = ''
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
        <div className="p-5 border-l-4 border-[#8148B5] flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0 md:mr-4">
            <h3 className="text-xl font-semibold text-gray-800">Need a Special Cake?</h3>
            <p className="text-gray-600 mt-1">
              Let our professional baker help you create your dream cake - it's free to discuss your ideas!
            </p>
          </div>
          
          <button 
            onClick={openModal}
            className="px-5 py-3 bg-[#8148B5] hover:bg-[#6a3a99] text-white rounded-lg shadow-sm transition-colors duration-200 flex items-center whitespace-nowrap"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Discuss with Baker
          </button>
        </div>
      </div>
      
      <ConsultationCakeModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddToCart={onAddToCart}
      />
    </>
  );
};

export default ConsultationButton;
