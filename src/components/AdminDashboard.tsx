import React, { useState } from 'react';
import { useAuth } from '../lib/auth';
import { useStore } from '../lib/store';
import { LogOut, Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function AdminDashboard() {
  const { logout } = useAuth();
  const { products, categories, tags } = useStore();
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    selectedTags: new Set<string>(),
  });

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement product addition
    toast.success('Product added successfully!');
    setIsAddingProduct(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#8148B5]">Admin Dashboard</h1>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-gray-600 hover:text-[#8148B5]"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={() => setIsAddingProduct(true)}
            className="flex items-center gap-2 bg-[#8148B5] text-white px-4 py-2 rounded-md hover:bg-opacity-90"
          >
            <Plus className="w-5 h-5" />
            Add New Product
          </button>
        </div>

        {isAddingProduct && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  aria-label="Product name"
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  aria-label="Product description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  aria-label="Product price"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  aria-label="Product category"
                  value={newProduct.category_id}
                  onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  aria-label="Product image URL"
                  type="url"
                  value={newProduct.image_url}
                  onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => {
                        const newTags = new Set(newProduct.selectedTags);
                        if (newTags.has(tag.id)) {
                          newTags.delete(tag.id);
                        } else {
                          newTags.add(tag.id);
                        }
                        setNewProduct({ ...newProduct, selectedTags: newTags });
                      }}
                      className={`px-3 py-1 rounded-full text-sm ${
                        newProduct.selectedTags.has(tag.id)
                          ? 'bg-[#E57D8D] text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsAddingProduct(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#8148B5] text-white px-4 py-2 rounded-md hover:bg-opacity-90"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2">{product.description}</p>
                <p className="text-[#8148B5] font-bold mb-4">${product.price}</p>
                <div className="flex justify-end gap-2">
                  <button 
                    aria-label="Edit product"
                    className="p-2 text-gray-600 hover:text-[#8148B5]"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button 
                    aria-label="Delete product"
                    className="p-2 text-gray-600 hover:text-red-500"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}