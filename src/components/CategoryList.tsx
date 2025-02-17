import React from 'react';
import { useProductStore } from '../stores/productStore';
import { Tag } from 'lucide-react';

export function CategoryList() {
  const { categories, filters, setFilter } = useProductStore();

  const toggleCategory = (categoryId: string) => {
    const currentCategories = new Set(filters.categories);
    if (currentCategories.has(categoryId)) {
      currentCategories.delete(categoryId);
    } else {
      currentCategories.add(categoryId);
    }
    setFilter({ categories: Array.from(currentCategories) });
  };

  if (categories.length === 0) {
    return (
      <div className="text-center p-4 bg-purple-50 rounded-lg">
        <Tag className="w-6 h-6 text-purple-500 mx-auto mb-2" />
        <p className="text-purple-700">No categories yet.</p>
        <p className="text-sm text-purple-600">
          Use /addcategory in Telegram to add categories.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Tag className="w-5 h-5" />
        Categories
      </h2>
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => toggleCategory(category.id)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${
                filters.categories.includes(category.id)
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
              }
            `}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
