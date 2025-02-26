import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderSuccess: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-rose-50 to-amber-50">
      <div className="max-w-lg w-full bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          
          {/* Success Message */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Order Successfully Placed!</h2>
            <p className="text-gray-600 mb-6">
              We will contact you shortly to confirm your order.
            </p>
            
            {/* Return Button */}
            <Link 
              to="/"
              className="bg-[#D23369] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#A32651] transition-colors"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
