import React from 'react';
import { useStore } from '../lib/store';
import { ProductCard } from './ProductCard';

export function ProductGrid() {
  const { products, categories, tags, isLoading } = useStore();
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [selectedTags, setSelectedTags] = React.useState<Set<string>>(new Set());

  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
    const matchesTags = selectedTags.size === 0 || 
      product.tags?.some(({ tag }) => selectedTags.has(tag.id));
    return matchesCategory && matchesTags;
  });

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => {
      const next = new Set(prev);
      if (next.has(tagId)) {
        next.delete(tagId);
      } else {
        next.add(tagId);
      }
      return next;
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-wrap gap-4 mb-4">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full ${
              !selectedCategory
                ? 'bg-[#8148B5] text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === category.id
                  ? 'bg-[#8148B5] text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <button
              key={tag.id}
              onClick={() => toggleTag(tag.id)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedTags.has(tag.id)
                  ? 'bg-[#E57D8D] text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}