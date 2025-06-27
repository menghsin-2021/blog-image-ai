import React, { useState, useMemo } from 'react';
import { PromptTemplate, PromptTemplateCategory } from '../../types/promptTemplates';
import { usePromptTemplates } from '../../hooks/usePromptTemplates';

interface TemplateLibraryProps {
  onSelectTemplate: (template: PromptTemplate) => void;
  onClose?: () => void;
  selectedCategory?: PromptTemplateCategory;
}

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({
  onSelectTemplate,
  onClose,
  selectedCategory,
}) => {
  const {
    templates,
    categories,
    favorites,
    searchTemplates,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    isLoading,
  } = usePromptTemplates();

  const [activeCategory, setActiveCategory] = useState<
    PromptTemplateCategory | 'all' | 'favorites'
  >(selectedCategory || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  // 過濾模板
  const filteredTemplates = useMemo(() => {
    let result = templates;

    // 搜索過濾
    if (searchQuery.trim()) {
      result = searchTemplates(searchQuery);
    }

    // 分類過濾
    if (activeCategory === 'favorites') {
      result = result.filter(template => isFavorite(template.id));
    } else if (activeCategory !== 'all') {
      result = result.filter(template => template.category === activeCategory);
    }

    // 排序：內建模板優先，然後按使用次數
    return result.sort((a, b) => {
      if (a.isBuiltIn && !b.isBuiltIn) return -1;
      if (!a.isBuiltIn && b.isBuiltIn) return 1;
      return b.usageCount - a.usageCount;
    });
  }, [templates, searchQuery, activeCategory, searchTemplates, isFavorite]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      {/* 標題列 */}
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900">提示詞模板庫</h2>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="p-6">
        {/* 搜索欄 */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索模板..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* 分類標籤 */}
        <div className="flex flex-wrap gap-2 mb-6">
          <CategoryTab
            active={activeCategory === 'all'}
            onClick={() => setActiveCategory('all')}
            icon="📁"
            label="全部"
            count={templates.length}
          />
          <CategoryTab
            active={activeCategory === 'favorites'}
            onClick={() => setActiveCategory('favorites')}
            icon="⭐"
            label="收藏"
            count={favorites.length}
          />
          {Object.entries(categories).map(([key, category]) => {
            const categoryTemplates = templates.filter(t => t.category === key);
            return (
              <CategoryTab
                key={key}
                active={activeCategory === key}
                onClick={() => setActiveCategory(key as PromptTemplateCategory)}
                icon={category.icon}
                label={category.name}
                count={categoryTemplates.length}
              />
            );
          })}
        </div>

        {/* 模板網格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTemplates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              isFavorite={isFavorite(template.id)}
              onSelect={() => onSelectTemplate(template)}
              onToggleFavorite={() => {
                if (isFavorite(template.id)) {
                  removeFromFavorites(template.id);
                } else {
                  addToFavorites(template.id);
                }
              }}
            />
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">找不到符合條件的模板</h3>
            <p className="text-gray-500">試試調整搜索關鍵字或選擇不同的分類</p>
          </div>
        )}
      </div>
    </div>
  );
};

// 分類標籤元件
interface CategoryTabProps {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  count: number;
}

const CategoryTab: React.FC<CategoryTabProps> = ({ active, onClick, icon, label, count }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      active
        ? 'bg-blue-100 text-blue-700 border border-blue-200'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
  >
    <span className="mr-2">{icon}</span>
    {label}
    <span className="ml-2 px-1.5 py-0.5 bg-white rounded text-xs">{count}</span>
  </button>
);

// 模板卡片元件
interface TemplateCardProps {
  template: PromptTemplate;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isFavorite,
  onSelect,
  onToggleFavorite,
}) => {
  const categoryInfo = {
    'blog-header': { icon: '🖼️', color: 'bg-purple-100 text-purple-700' },
    'blog-section': { icon: '📝', color: 'bg-blue-100 text-blue-700' },
    'blog-summary': { icon: '📊', color: 'bg-green-100 text-green-700' },
    technical: { icon: '🔧', color: 'bg-orange-100 text-orange-700' },
    conceptual: { icon: '💡', color: 'bg-yellow-100 text-yellow-700' },
    interface: { icon: '🎨', color: 'bg-pink-100 text-pink-700' },
    diagram: { icon: '📈', color: 'bg-indigo-100 text-indigo-700' },
    custom: { icon: '⚙️', color: 'bg-gray-100 text-gray-700' },
  };

  const category = categoryInfo[template.category];

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${category.color}`}
          >
            {category.icon} {template.category}
          </span>
          {template.isBuiltIn && (
            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
              內建
            </span>
          )}
        </div>
        <button
          onClick={e => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`text-lg transition-colors ${
            isFavorite ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'
          }`}
        >
          ⭐
        </button>
      </div>

      <div onClick={onSelect}>
        <h3 className="font-medium text-gray-900 mb-2">{template.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{template.variables.length} 個參數</span>
          <span>使用 {template.usageCount} 次</span>
        </div>

        {template.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {template.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
              >
                {tag}
              </span>
            ))}
            {template.tags.length > 3 && (
              <span className="text-gray-400 text-xs">+{template.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
