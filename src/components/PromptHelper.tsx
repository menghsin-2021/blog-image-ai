import React, { useState } from 'react';
import { PROMPT_TEMPLATES, PROMPT_BUILDERS, PromptTemplate } from '../utils/constants';

interface PromptHelperProps {
  onSelectTemplate: (template: string) => void;
  className?: string;
}

/**
 * Prompt 輔助工具元件
 */
export const PromptHelper: React.FC<PromptHelperProps> = ({
  onSelectTemplate,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'builder'>('templates');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState('');

  // 取得所有類別
  const categories = ['all', ...Array.from(new Set(PROMPT_TEMPLATES.map(t => t.category)))];

  // 篩選範本
  const filteredTemplates = selectedCategory === 'all' 
    ? PROMPT_TEMPLATES 
    : PROMPT_TEMPLATES.filter(t => t.category === selectedCategory);

  // 使用範本
  const handleUseTemplate = (template: PromptTemplate) => {
    onSelectTemplate(template.template);
  };

  // 建構自訂 Prompt
  const buildCustomPrompt = () => {
    const parts = [];
    
    if (selectedStyle) parts.push(selectedStyle);
    if (selectedColor) parts.push(`使用${selectedColor}`);
    parts.push('的[主題描述]');
    if (selectedPurpose) parts.push(`適合${selectedPurpose}使用`);
    parts.push('背景簡潔，整體專業美觀');

    const customPrompt = parts.join('，');
    onSelectTemplate(customPrompt);
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* 標籤頁 */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === 'templates'
              ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📋 範本庫
        </button>
        <button
          onClick={() => setActiveTab('builder')}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === 'builder'
              ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          🛠️ 自訂建構
        </button>
      </div>

      <div className="p-4">
        {activeTab === 'templates' && (
          <div className="space-y-4">
            {/* 類別篩選 */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category === 'all' ? '全部' : category}
                </button>
              ))}
            </div>

            {/* 範本列表 */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{template.title}</h4>
                      <p className="text-xs text-gray-500">{template.description}</p>
                    </div>
                    <button
                      onClick={() => handleUseTemplate(template)}
                      className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      使用
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {template.template}
                  </p>
                  
                  <div className="flex flex-wrap gap-1">
                    {template.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'builder' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              選擇不同選項來建構您的專屬 Prompt：
            </p>

            {/* 風格選擇 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🎨 風格
              </label>
              <div className="flex flex-wrap gap-2">
                {PROMPT_BUILDERS.styles.map((style) => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(selectedStyle === style ? '' : style)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      selectedStyle === style
                        ? 'bg-purple-100 text-purple-700 border border-purple-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* 配色選擇 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🌈 配色
              </label>
              <div className="flex flex-wrap gap-2">
                {PROMPT_BUILDERS.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(selectedColor === color ? '' : color)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      selectedColor === color
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* 用途選擇 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🎯 用途
              </label>
              <div className="flex flex-wrap gap-2">
                {PROMPT_BUILDERS.purposes.map((purpose) => (
                  <button
                    key={purpose}
                    onClick={() => setSelectedPurpose(selectedPurpose === purpose ? '' : purpose)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      selectedPurpose === purpose
                        ? 'bg-orange-100 text-orange-700 border border-orange-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {purpose}
                  </button>
                ))}
              </div>
            </div>

            {/* 預覽和建構 */}
            <div className="pt-3 border-t border-gray-200">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📝 預覽
                </label>
                <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                  {selectedStyle || selectedColor || selectedPurpose ? (
                    <>
                      {selectedStyle && <span>{selectedStyle}</span>}
                      {selectedColor && <span>{selectedStyle ? '，' : ''}使用{selectedColor}</span>}
                      <span>的[主題描述]</span>
                      {selectedPurpose && <span>，適合{selectedPurpose}使用</span>}
                      <span>，背景簡潔，整體專業美觀</span>
                    </>
                  ) : (
                    '請選擇上方選項來預覽 Prompt...'
                  )}
                </div>
              </div>
              
              <button
                onClick={buildCustomPrompt}
                disabled={!selectedStyle && !selectedColor && !selectedPurpose}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                🚀 使用此 Prompt
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
