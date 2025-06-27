import React, { useState, useCallback, useEffect } from 'react';
import { ContentInput as ContentInputType } from '../../types/promptOptimizer';

interface ContentInputProps {
  content: ContentInputType;
  onChange: (content: ContentInputType) => void;
  onAnalyze: () => void;
  isAnalyzing?: boolean;
}

export const ContentInput: React.FC<ContentInputProps> = ({
  content,
  onChange,
  onAnalyze,
  isAnalyzing = false,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [keywordsInputValue, setKeywordsInputValue] = useState(content.keywords?.join(', ') || '');

  // 處理輸入變更
  const handleChange = useCallback(
    (field: keyof ContentInputType, value: string | string[]) => {
      onChange({
        ...content,
        [field]: value,
      });
    },
    [content, onChange]
  );

  // 處理關鍵字輸入 - 只更新本地顯示值
  const handleKeywordsInputChange = useCallback((value: string) => {
    setKeywordsInputValue(value);
  }, []);

  // 處理關鍵字失焦 - 分割並更新實際數據
  const handleKeywordsBlur = useCallback(() => {
    const keywords = keywordsInputValue
      .split(/[,，;；]/)
      .map(k => k.trim())
      .filter(k => k.length > 0);
    handleChange('keywords', keywords);
    // 重新格式化顯示值
    setKeywordsInputValue(keywords.join(', '));
  }, [keywordsInputValue, handleChange]);

  // 當外部 content.keywords 變更時，同步更新輸入框
  useEffect(() => {
    setKeywordsInputValue(content.keywords?.join(', ') || '');
  }, [content.keywords]);

  // 自動分析內容 (當標題和內容都有值時)
  const shouldEnableAnalysis = content.title?.trim() && content.content.trim();

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-600 mb-4">
        輸入您的部落格文章內容，系統將分析並生成最適合的圖片提示詞
      </div>

      {/* 文章標題 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          文章標題 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={content.title || ''}
          onChange={e => handleChange('title', e.target.value)}
          placeholder="輸入您的部落格文章標題..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">標題將幫助系統理解文章主題，產生更相關的圖片</p>
      </div>

      {/* 文章內容 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          相關內容 <span className="text-red-500">*</span>
        </label>
        <textarea
          value={content.content}
          onChange={e => handleChange('content', e.target.value)}
          placeholder="貼上您要配圖的文章段落或全文內容..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={6}
        />
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-gray-500">建議至少 50 字以上，內容越詳細分析效果越好</p>
          <span className="text-xs text-gray-400">{content.content.length} 字元</span>
        </div>
      </div>

      {/* 關鍵字 - 移到主要區域 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          關鍵字 <span className="text-gray-400">(選填)</span>
        </label>
        <input
          type="text"
          value={keywordsInputValue}
          onChange={e => handleKeywordsInputChange(e.target.value)}
          onBlur={handleKeywordsBlur}
          placeholder="AI, 機器學習, 深度學習... (支援中英文逗號分隔)"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          支援多種分隔符：逗號 (,)、中文逗號 (，)、分號 (;)
        </p>
      </div>

      {/* 進階選項切換 */}
      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center text-sm text-blue-600 hover:text-blue-700"
        >
          <svg
            className={`w-4 h-4 mr-1 transition-transform ${showAdvanced ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          進階選項 {showAdvanced ? '(收合)' : '(展開)'}
        </button>
      </div>

      {/* 進階選項 */}
      {showAdvanced && (
        <div className="space-y-4 pl-4 border-l-2 border-gray-100">
          {/* 目標讀者 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              目標讀者 <span className="text-gray-400">(選填)</span>
            </label>
            <select
              value={content.targetAudience || ''}
              onChange={e => handleChange('targetAudience', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">請選擇目標讀者群</option>
              <option value="developer">開發者</option>
              <option value="designer">設計師</option>
              <option value="product-manager">產品經理</option>
              <option value="business">商業人士</option>
              <option value="student">學生/新手</option>
              <option value="general">一般大眾</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">指定目標讀者有助於調整圖片風格和複雜度</p>
          </div>
        </div>
      )}

      {/* 分析按鈕 */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={onAnalyze}
          disabled={!shouldEnableAnalysis || isAnalyzing}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            shouldEnableAnalysis && !isAnalyzing
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isAnalyzing ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              分析內容中...
            </div>
          ) : (
            '分析內容並最佳化提示詞'
          )}
        </button>

        {!shouldEnableAnalysis && (
          <p className="text-xs text-gray-500 text-center mt-2">
            請填寫文章標題和內容後即可開始分析
          </p>
        )}
      </div>
    </div>
  );
};
