import { UnifiedOptimizationResult } from '../../types/promptOptimizer';

interface UnifiedResultDisplayProps {
  result: UnifiedOptimizationResult | null;
  isLoading: boolean;
  onExport?: () => void;
  onCopyPrompt?: (prompt: string, language: 'chinese' | 'english') => void;
}

/**
 * 統一最佳化結果顯示元件
 * 支援 OpenAI 和 Perplexity 兩種服務的結果展示
 */
export function UnifiedResultDisplay({
  result,
  isLoading,
  onExport,
  onCopyPrompt,
}: UnifiedResultDisplayProps) {
  if (isLoading) {
    return (
      <div className="mt-6 p-6 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">正在最佳化提示詞...</span>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'openai':
        return '🤖';
      case 'perplexity':
        return '🌐';
      default:
        return '✨';
    }
  };

  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'openai':
        return 'OpenAI GPT-4o';
      case 'perplexity':
        return 'Perplexity AI';
      default:
        return provider;
    }
  };

  return (
    <div className="mt-6 space-y-6">
      {/* 服務提供商標頭 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-2xl mr-3">{getProviderIcon(result.provider)}</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {getProviderName(result.provider)}
            </h3>
            <p className="text-sm text-gray-500">
              模型: {result.model} | 信心度: {Math.round((result.confidence || 0.8) * 100)}%
            </p>
          </div>
        </div>
        <div className="text-sm text-gray-400">
          {new Date(result.timestamp).toLocaleString('zh-TW')}
        </div>
      </div>

      {/* 最佳化結果 */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">最佳化提示詞</h4>
        </div>

        <div className="p-6 space-y-4">
          {/* 中文版本 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">中文版本</label>
              <button
                onClick={() => onCopyPrompt?.(result.optimized.chinese, 'chinese')}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                複製
              </button>
            </div>
            <div className="p-3 bg-gray-50 rounded border text-sm">{result.optimized.chinese}</div>
          </div>

          {/* 英文版本 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">英文版本</label>
              <button
                onClick={() => onCopyPrompt?.(result.optimized.english, 'english')}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                複製
              </button>
            </div>
            <div className="p-3 bg-gray-50 rounded border text-sm">{result.optimized.english}</div>
          </div>
        </div>
      </div>

      {/* 分析與建議 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 改善建議 */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h4 className="text-lg font-medium text-gray-900">改善建議</h4>
          </div>
          <div className="p-6">
            {result.improvements.length > 0 ? (
              <ul className="space-y-2">
                {result.improvements.map((improvement: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span className="text-sm text-gray-700">{improvement}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">暫無改善建議</p>
            )}
          </div>
        </div>

        {/* 技術參數 */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h4 className="text-lg font-medium text-gray-900">技術建議</h4>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {result.suggestedStyle && (
                <div>
                  <span className="text-sm font-medium text-gray-700">建議風格：</span>
                  <span className="text-sm text-gray-600 ml-2">{result.suggestedStyle}</span>
                </div>
              )}
              {result.technicalTips && (
                <div>
                  <span className="text-sm font-medium text-gray-700">技術提示：</span>
                  <span className="text-sm text-gray-600 ml-2">{result.technicalTips}</span>
                </div>
              )}
              {result.styleModifiers.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-700">風格標籤：</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {result.styleModifiers.map((modifier: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                      >
                        {modifier}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Perplexity 特有的引用來源 */}
      {result.provider === 'perplexity' && result.citations && result.citations.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h4 className="text-lg font-medium text-gray-900">參考來源</h4>
          </div>
          <div className="p-6">
            <ul className="space-y-2">
              {result.citations.map((citation: any, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">[{index + 1}]</span>
                  <a
                    href={citation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    {citation.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Perplexity 特有的成本資訊 */}
      {result.provider === 'perplexity' && result.cost && (
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h4 className="text-lg font-medium text-gray-900">成本資訊</h4>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-700">總成本：</span>
                <span className="font-medium ml-2">${result.cost.totalCost.toFixed(4)} USD</span>
              </div>
              <div>
                <span className="text-gray-700">搜尋成本：</span>
                <span className="font-medium ml-2">${result.cost.searchCost.toFixed(4)}</span>
              </div>
              <div>
                <span className="text-gray-700">輸入成本：</span>
                <span className="font-medium ml-2">${result.cost.inputCost.toFixed(4)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 操作按鈕 */}
      <div className="flex justify-end space-x-3">
        {onExport && (
          <button
            onClick={onExport}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            匯出結果
          </button>
        )}
        <button
          onClick={() => onCopyPrompt?.(result.optimized.chinese, 'chinese')}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          複製中文提示詞
        </button>
      </div>
    </div>
  );
}
