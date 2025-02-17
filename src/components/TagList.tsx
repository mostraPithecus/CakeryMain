import React from 'react';
import { useProductStore } from '../stores/productStore';
import { Hash } from 'lucide-react';

export function TagList() {
  const { tags, filters, setFilter } = useProductStore();

  const toggleTag = (tagId: string) => {
    const currentTags = new Set(filters.tags);
    if (currentTags.has(tagId)) {
      currentTags.delete(tagId);
    } else {
      currentTags.add(tagId);
    }
    setFilter({ tags: Array.from(currentTags) });
  };

  if (tags.length === 0) {
    return (
      <div className="text-center p-4 bg-blue-50 rounded-lg">
        <Hash className="w-6 h-6 text-blue-500 mx-auto mb-2" />
        <p className="text-blue-700">No tags yet.</p>
        <p className="text-sm text-blue-600">
          Use /addtag in Telegram to add tags.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Hash className="w-5 h-5" />
        Tags
      </h2>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <button
            key={tag.id}
            onClick={() => toggleTag(tag.id)}
            className={`
              px-3 py-1 rounded-full text-sm font-medium transition-colors
              ${
                filters.tags.includes(tag.id)
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }
            `}
          >
            #{tag.name}
          </button>
        ))}
      </div>
    </div>
  );
}
