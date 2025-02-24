import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow text-center">
        <div className="text-green-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4">Заказ успешно оформлен!</h2>
        <p className="text-gray-600 mb-6">
          Мы свяжемся с вами в ближайшее время для подтверждения заказа.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600 transition-colors"
        >
          Вернуться на главную
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
