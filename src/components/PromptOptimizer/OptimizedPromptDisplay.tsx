import React, { useState, useCallback } from 'react';
import { OptimizedPrompt } from '../../types/promptOptimizer';
import { Button } from '../Button';

type DisplayLanguage = 'chinese' | 'english';

interface OptimizedPromptDisplayProps {
  result: OptimizedPrompt;
  onApplyPrompt: (prompt: string) => void;
  onEditPrompt?: (prompt: string) => void;
  onReset?: () => void;
}

export const OptimizedPromptDisplay: React.FC<OptimizedPromptDisplayProps> = ({
  result,
  onApplyPrompt,
  onEditPrompt,
  onReset
}) => {
  const [activeLanguage, setActiveLanguage] = useState<DisplayLanguage>('chinese');
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState(result.optimized.chinese);
  const [showComparison, setShowComparison] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  // 更新編輯的提示詞當語言切換時
  const updateEditedPrompt = useCallback((language: DisplayLanguage) => {
    setEditedPrompt(result.optimized[language]);
  }, [result.optimized]);

  // 處理語言切換
  const handleLanguageChange = useCallback((language: DisplayLanguage) => {
    setActiveLanguage(language);
    if (isEditing) {
      updateEditedPrompt(language);
    }
  }, [isEditing, updateEditedPrompt]);

  // 處理編輯模式切換
  const handleEditToggle = useCallback(() => {
    if (isEditing) {
      onEditPrompt?.(editedPrompt);
    } else {
      setEditedPrompt(result.optimized[activeLanguage]);
    }
    setIsEditing(!isEditing);
  }, [isEditing, editedPrompt, onEditPrompt, result.optimized, activeLanguage]);

  // 處理應用提示詞
  const handleApply = useCallback(() => {
    const currentPrompt = isEditing ? editedPrompt : result.optimized[activeLanguage];
    onApplyPrompt(currentPrompt);
  }, [isEditing, editedPrompt, result.optimized, activeLanguage, onApplyPrompt]);

  // 複製到剪貼板
  const copyToClipboard = useCallback(async (text: string, type: string = 'default') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('複製失敗:', err);
    }
  }, []);

  // 匯出 Markdown
  const handleExportMarkdown = useCallback(() => {
    const blob = new Blob([result.exportData.markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `optimized-prompt-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [result.exportData.markdown]);

  const currentPrompt = isEditing ? editedPrompt : result.optimized[activeLanguage];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 標題與動作列 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">✨ 提示詞最佳化完成！</h2>
          <p className="text-gray-600 mt-1">
            AI 已為您分析內容並產生最佳化的雙語提示詞
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExportMarkdown}
            className="text-sm"
          >
            📄 匯出 Markdown
          </Button>
          {onReset && (
            <Button
              variant="outline"
              onClick={onReset}
              className="text-sm"
            >
              🔄 重新開始
            </Button>
          )}
        </div>
      </div>

      {/* 信心度指示器 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">最佳化信心度</span>
          <span className="text-sm font-bold text-gray-900">
            {Math.round(result.confidence * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              result.confidence > 0.8 ? 'bg-green-500' :
              result.confidence > 0.6 ? 'bg-yellow-500' : 'bg-orange-500'
            }`}
            style={{ width: `${result.confidence * 100}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {result.confidence > 0.8 ? '高信心度 - 推薦直接使用' :
           result.confidence > 0.6 ? '中等信心度 - 可能需要微調' :
           '較低信心度 - 建議檢查並調整'}
        </p>
      </div>

      {/* 內容分析摘要 */}
      <div className="bg-blue-50 rounded-lg p-5">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">📊 內容分析</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">主題: {result.analysis.topic}</h4>
            <p className="text-sm text-blue-700 mb-3">
              複雜度: {result.analysis.complexity} | 風格: {result.analysis.sentiment}
            </p>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">關鍵字</h4>
            <div className="flex flex-wrap gap-1">
              {result.analysis.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="inline-block bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 最佳化提示詞 */}
      <div className="bg-white border rounded-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-gray-900">🚀 最佳化提示詞</h3>
          
          {/* 語言切換 */}
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleLanguageChange('chinese')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  activeLanguage === 'chinese'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                中文
              </button>
              <button
                onClick={() => handleLanguageChange('english')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  activeLanguage === 'english'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                English
              </button>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setShowComparison(!showComparison)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {showComparison ? '隱藏' : '顯示'}對比
              </button>
              <button
                onClick={() => copyToClipboard(currentPrompt, 'prompt')}
                className="text-sm text-gray-600 hover:text-gray-700"
              >
                {copySuccess === 'prompt' ? '✓ 已複製' : '📋 複製'}
              </button>
              <button
                onClick={handleEditToggle}
                className="text-sm text-gray-600 hover:text-gray-700"
              >
                {isEditing ? '💾 儲存' : '✏️ 編輯'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          {isEditing ? (
            <textarea
              value={editedPrompt}
              onChange={(e) => setEditedPrompt(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="編輯最佳化提示詞..."
            />
          ) : (
            <div className="bg-gray-50 rounded-lg p-3 text-gray-800 font-mono text-sm leading-relaxed">
              {currentPrompt}
            </div>
          )}
        </div>

        {/* 對比模式 */}
        {showComparison && result.original && (
          <div className="border-t p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">原始內容</h4>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-gray-600">
              {result.original}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              ⬆️ 原始 vs 最佳化 ({activeLanguage === 'chinese' ? '中文' : 'English'}) ⬇️
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-gray-800 mt-1">
              {currentPrompt}
            </div>
          </div>
        )}
      </div>

      {/* 技術參數建議 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-3">推薦技術參數</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <span className="text-xs text-blue-600 font-medium">圖片比例</span>
            <div className="text-sm text-blue-900 font-mono">
              {result.technicalParams.aspectRatio}
            </div>
          </div>
          <div>
            <span className="text-xs text-blue-600 font-medium">品質設定</span>
            <div className="text-sm text-blue-900 font-mono">
              {result.technicalParams.quality}
            </div>
          </div>
          {result.technicalParams.style && (
            <div>
              <span className="text-xs text-blue-600 font-medium">風格偏好</span>
              <div className="text-sm text-blue-900 font-mono">
                {result.technicalParams.style}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 風格修飾詞 */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h4 className="font-semibold text-purple-900 mb-3">應用的風格元素</h4>
        <div className="flex flex-wrap gap-2">
          {result.styleModifiers.map((modifier, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
            >
              {modifier}
            </span>
          ))}
        </div>
      </div>

      {/* 最佳化建議 */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-semibold text-amber-900 mb-3">最佳化改善說明</h4>
        <ul className="space-y-2">
          {result.suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start text-sm text-amber-800">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0" />
              {suggestion}
            </li>
          ))}
        </ul>
      </div>

      {/* 操作按鈕 */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
        <Button
          onClick={handleApply}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          🚀 應用到圖片生成器
        </Button>
        <Button
          variant="outline"
          onClick={() => copyToClipboard(currentPrompt, 'action')}
          className="flex-1"
        >
          {copySuccess === 'action' ? '✓ 已複製' : '📋 複製提示詞'}
        </Button>
      </div>

      {/* 使用提示 */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          💡 提示：您可以直接編輯最佳化提示詞，或將其應用到主要生成介面中
        </p>
      </div>
    </div>
  );
};
