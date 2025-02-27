import { useStore } from '../lib/store';
import DeliverySection from './DeliverySection';
import { GOOGLE_MAPS_API_KEY } from '../config/maps';
import { useState } from 'react';
import { Edit2 as Edit } from 'lucide-react';

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
  const totalWeight = cart.reduce((sum, item) => sum + (item.product.weight_kg || 0) * item.quantity, 0);

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
      // Redirect to success page after successful order
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('An error occurred while placing your order. Please try again.');
    }
  };

  const handleAddressConfirm = (address: string, isConfirmed: boolean) => {
    setFormData(prev => ({
      ...prev,
      deliveryAddress: address,
      isAddressConfirmed: isConfirmed
    }));
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Cart is Empty</h2>
        <p>Add items to your cart to place an order.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      {/* Cart */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Your Order</h3>
          <button 
            onClick={() => window.history.back()}
            className="flex items-center text-sm text-[#8148B5] hover:text-[#6a3b96] transition-colors"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit Cart
          </button>
        </div>
        <div className="space-y-4">
          {cart.map(item => (
            <div key={item.product.id} className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">{item.product.name}</h4>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <p className="font-medium">€{(item.product.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Total:</h4>
              <p className="font-semibold text-lg">€{totalAmount.toFixed(2)}</p>
            </div>
            {formData.deliveryMethod === 'delivery' && formData.deliveryCost > 0 && (
              <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
                <span>Subtotal: €{totalAmount.toFixed(2)}</span>
                <span>Delivery: €{formData.deliveryCost.toFixed(2)}</span>
                <span>Total with delivery: €{(totalAmount + formData.deliveryCost).toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delivery Section */}
      <DeliverySection
        onDeliveryMethodChange={handleDeliveryMethodChange}
        onAddressConfirm={handleAddressConfirm}
        googleMapsApiKey={GOOGLE_MAPS_API_KEY}
        totalWeightKg={totalWeight}
      />

      {/* Checkout Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name *
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
              Phone *
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
              Order Comments
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
          Place Order
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
