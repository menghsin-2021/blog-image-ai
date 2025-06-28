import React, { useState, useCallback } from 'react';
import { OptimizedPrompt } from '../../types/promptOptimizer';
import { PerplexityOptimizationResult } from '../../services/perplexityOptimizer';
import { Button } from '../Button';
import { CitationsSidebar } from './CitationsSidebar';

interface OptimizedPromptDisplayProps {
  result: OptimizedPrompt | PerplexityOptimizationResult;
  onApplyPrompt: (prompt: string) => void;
  onEditPrompt?: (prompt: string) => void;
  onReset?: () => void;
  className?: string;
}

const isPerplexityResult = (result: any): result is PerplexityOptimizationResult => {
  return 'provider' in result && result.provider === 'perplexity';
};

export const EnhancedOptimizedPromptDisplay: React.FC<OptimizedPromptDisplayProps> = ({
  result,
  onApplyPrompt,
  onEditPrompt,
  onReset,
  className = '',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState(result.optimizedPrompt);
  const [showComparison, setShowComparison] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [showCitations, setShowCitations] = useState(false);

  const isPerplexity = isPerplexityResult(result);

  // 處理編輯模式切換
  const handleEditToggle = useCallback(() => {
    if (isEditing) {
      if (editedPrompt) {
        onEditPrompt?.(editedPrompt);
      }
    } else {
      const promptToEdit = result.optimizedPrompt || (isPerplexity ? result.optimizedPrompt : '');
      setEditedPrompt(promptToEdit);
    }
    setIsEditing(!isEditing);
  }, [isEditing, editedPrompt, onEditPrompt, result.optimizedPrompt, isPerplexity]);

  // 處理應用提示詞
  const handleApplyPrompt = useCallback(() => {
    const promptToApply = isEditing ? editedPrompt : result.optimizedPrompt;
    if (promptToApply) {
      onApplyPrompt(promptToApply);
    }
  }, [isEditing, editedPrompt, result.optimizedPrompt, onApplyPrompt]);

  // 複製到剪貼板
  const copyToClipboard = useCallback(async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (error) {
      console.error('複製失敗:', error);
    }
  }, []);

  // 格式化時間戳
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-TW');
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 標題和提供商資訊 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">
              {isPerplexity ? '🌐' : '🤖'}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                提示詞最佳化結果
              </h2>
              <p className="text-sm text-gray-600">
                {isPerplexity ? 'Perplexity AI' : 'OpenAI GPT-4o'} • {formatTimestamp(result.timestamp)}
              </p>
            </div>
          </div>
          
          {isPerplexity && (
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                即時網路資訊
              </span>
              {result.citations.length > 0 && (
                <button
                  onClick={() => setShowCitations(!showCitations)}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                >
                  {result.citations.length} 個來源
                </button>
              )}
            </div>
          )}
        </div>

        {/* 成本資訊 (僅 Perplexity) */}
        {isPerplexity && result.cost && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-blue-600">💰</span>
                <span className="text-sm font-medium text-blue-900">
                  總成本: ${result.cost.totalCost.toFixed(4)}
                </span>
              </div>
              <div className="text-xs text-blue-700">
                搜尋: ${result.cost.searchCost.toFixed(4)} | 
                輸入: ${result.cost.inputCost.toFixed(4)} | 
                輸出: ${result.cost.outputCost.toFixed(4)}
              </div>
            </div>
          </div>
        )}

        {/* 控制按鈕 */}
        <div className="flex items-center space-x-3 mb-6">
          <Button
            onClick={handleApplyPrompt}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            應用此提示詞
          </Button>
          
          <Button
            onClick={handleEditToggle}
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            {isEditing ? '儲存編輯' : '編輯提示詞'}
          </Button>
          
          <Button
            onClick={() => setShowComparison(!showComparison)}
            variant="outline"
            className="border-gray-600 text-gray-600 hover:bg-gray-50"
          >
            {showComparison ? '隱藏比較' : '顯示比較'}
          </Button>
          
          {onReset && (
            <Button
              onClick={onReset}
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50"
            >
              重新最佳化
            </Button>
          )}
        </div>

        {/* 提示詞內容 */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                {isEditing ? '編輯提示詞' : '最佳化後的提示詞'}
              </label>
              <button
                onClick={() => {
                  const textToCopy = isEditing ? editedPrompt : result.optimizedPrompt;
                  if (textToCopy) {
                    copyToClipboard(textToCopy, 'optimized');
                  }
                }}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>{copySuccess === 'optimized' ? '已複製!' : '複製'}</span>
              </button>
            </div>
            
            {isEditing ? (
              <textarea
                value={editedPrompt}
                onChange={(e) => setEditedPrompt(e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="編輯您的提示詞..."
              />
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900 whitespace-pre-wrap">
                  {result.optimizedPrompt}
                </p>
              </div>
            )}
          </div>

          {/* 比較模式 */}
          {showComparison && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  原始提示詞
                </label>
                <button
                  onClick={() => {
                    if (result.originalPrompt) {
                      copyToClipboard(result.originalPrompt, 'original');
                    }
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>{copySuccess === 'original' ? '已複製!' : '複製'}</span>
                </button>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-gray-900 whitespace-pre-wrap">
                  {result.originalPrompt}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 分析結果 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          最佳化分析
        </h3>
        
        <div className="space-y-4">
          {/* 改善點 */}
          {result.improvements && result.improvements.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">主要改善點</h4>
              <ul className="space-y-1">
                {result.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-sm text-gray-600">{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 理由 */}
          {result.reasoning && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">最佳化理由</h4>
              <p className="text-sm text-gray-600">{result.reasoning}</p>
            </div>
          )}

          {/* 建議風格 */}
          {result.suggestedStyle && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">建議視覺風格</h4>
              <p className="text-sm text-gray-600">{result.suggestedStyle}</p>
            </div>
          )}

          {/* 技術建議 */}
          {result.technicalTips && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">技術建議</h4>
              <p className="text-sm text-gray-600">{result.technicalTips}</p>
            </div>
          )}
        </div>
      </div>

      {/* Perplexity 引用來源側邊欄 */}
      {isPerplexity && (
        <CitationsSidebar
          citations={result.citations}
          isOpen={showCitations}
          onToggle={() => setShowCitations(!showCitations)}
        />
      )}
    </div>
  );
};
