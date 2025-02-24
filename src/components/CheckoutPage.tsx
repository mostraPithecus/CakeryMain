import React, { useState } from 'react';
import { useStore } from '../lib/store';
import DeliverySection from './DeliverySection';
import { GOOGLE_MAPS_API_KEY } from '../config/maps';

interface CheckoutFormData {
  name: string;
  phone: string;
  email: string;
  deliveryMethod: 'pickup' | 'delivery' | null;
  deliveryCost: number;
  deliveryAddress: string;
  comments?: string;
  isAddressConfirmed?: boolean;
}

const CheckoutPage: React.FC = () => {
  const { cart, submitOrder, clearCart } = useStore();
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    phone: '',
    email: '',
    deliveryMethod: 'pickup',
    deliveryCost: 0,
    deliveryAddress: '',
    comments: ''
  });

  const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleDeliveryMethodChange = (method: 'pickup' | 'delivery' | null, cost?: number) => {
    setFormData(prev => ({
      ...prev,
      deliveryMethod: method,
      deliveryCost: cost || 0,
      deliveryAddress: method === 'pickup' ? '' : prev.deliveryAddress
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitOrder({
        ...formData,
        totalAmount,
        items: cart
      });
      clearCart();
      // Здесь можно добавить редирект на страницу успешного оформления
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте снова.');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Корзина пуста</h2>
        <p>Добавьте товары в корзину, чтобы оформить заказ.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Оформление заказа</h2>

      {/* Корзина */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Ваш заказ</h3>
        <div className="space-y-4">
          {cart.map(item => (
            <div key={item.product.id} className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">{item.product.name}</h4>
                <p className="text-gray-600">Количество: {item.quantity}</p>
              </div>
              <p className="font-medium">${item.product.price * item.quantity}</p>
            </div>
          ))}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Итого:</h4>
              <p className="font-semibold text-lg">${totalAmount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Секция доставки */}
      <DeliverySection
        onDeliveryMethodChange={handleDeliveryMethodChange}
        onAddressConfirm={(address, isConfirmed) => {
          setFormData(prev => ({
            ...prev,
            deliveryAddress: address,
            isAddressConfirmed: isConfirmed
          }));
        }}
        googleMapsApiKey={GOOGLE_MAPS_API_KEY}
      />

      {/* Форма оформления */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Контактная информация</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Имя *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#8148B5] focus:border-[#8148B5]"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Телефон *
            </label>
            <input
              type="tel"
              id="phone"
              required
              value={formData.phone}
              onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#8148B5] focus:border-[#8148B5]"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#8148B5] focus:border-[#8148B5]"
            />
          </div>

          <div>
            <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
              Комментарии к заказу
            </label>
            <textarea
              id="comments"
              rows={3}
              value={formData.comments}
              onChange={e => setFormData(prev => ({ ...prev, comments: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#8148B5] focus:border-[#8148B5]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-[#8148B5] text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
        >
          Оформить заказ
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
