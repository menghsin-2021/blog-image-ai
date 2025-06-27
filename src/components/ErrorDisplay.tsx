import React from 'react';

interface ErrorDisplayProps {
  error: Error | string | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  type?: 'api' | 'validation' | 'network' | 'general';
  showDetails?: boolean;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
  type = 'general',
  showDetails = false,
}) => {
  if (!error) return null;

  const errorMessage = typeof error === 'string' ? error : error.message;

  const getErrorConfig = () => {
    switch (type) {
      case 'api':
        return {
          icon: '🔌',
          title: 'API 連線錯誤',
          description: '無法連接到服務器，請檢查網路連線',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-700',
          buttonColor: 'bg-red-600 hover:bg-red-700',
        };
      case 'validation':
        return {
          icon: '⚠️',
          title: '輸入驗證失敗',
          description: '請檢查輸入的內容格式',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-700',
          buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
        };
      case 'network':
        return {
          icon: '📡',
          title: '網路連線問題',
          description: '請檢查您的網路連線狀態',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          textColor: 'text-orange-700',
          buttonColor: 'bg-orange-600 hover:bg-orange-700',
        };
      default:
        return {
          icon: '❌',
          title: '發生錯誤',
          description: '處理過程中出現問題',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-700',
          buttonColor: 'bg-red-600 hover:bg-red-700',
        };
    }
  };

  const config = getErrorConfig();

  return (
    <div className={`rounded-lg p-4 border ${config.bgColor} ${config.borderColor}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 text-2xl mr-3">{config.icon}</div>
        <div className="flex-1">
          <h3 className={`text-sm font-medium ${config.textColor} mb-1`}>{config.title}</h3>
          <p className={`text-sm ${config.textColor} opacity-90 mb-2`}>{config.description}</p>

          {showDetails && (
            <details className="mb-3">
              <summary className={`text-xs ${config.textColor} cursor-pointer hover:underline`}>
                顯示詳細錯誤資訊
              </summary>
              <pre
                className={`text-xs ${config.textColor} mt-2 bg-white p-2 rounded border overflow-auto`}
              >
                {errorMessage}
              </pre>
            </details>
          )}

          <div className="flex gap-2">
            {onRetry && (
              <button
                onClick={onRetry}
                className={`text-white px-3 py-1 rounded text-sm font-medium transition-colors ${config.buttonColor}`}
              >
                重試
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className={`${config.textColor} px-3 py-1 rounded text-sm font-medium hover:bg-white transition-colors`}
              >
                關閉
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// 專用於提示詞最佳化的錯誤處理
interface PromptOptimizerErrorProps {
  error: Error | string | null;
  stage: 'content-analysis' | 'prompt-optimization' | 'template-loading' | 'general';
  onRetry?: () => void;
  onReset?: () => void;
}

export const PromptOptimizerError: React.FC<PromptOptimizerErrorProps> = ({
  error,
  stage,
  onRetry,
  onReset,
}) => {
  if (!error) return null;

  const getStageConfig = () => {
    switch (stage) {
      case 'content-analysis':
        return {
          title: '內容分析失敗',
          suggestions: [
            '檢查文章內容是否完整',
            '確認文字長度在合理範圍內',
            '嘗試簡化複雜的內容結構',
          ],
        };
      case 'prompt-optimization':
        return {
          title: '提示詞最佳化失敗',
          suggestions: ['確認 API 金鑰設定正確', '檢查網路連線狀態', '嘗試降低內容複雜度'],
        };
      case 'template-loading':
        return {
          title: '模板載入失敗',
          suggestions: ['重新整理頁面', '清除瀏覽器快取', '檢查模板設定檔案'],
        };
      default:
        return {
          title: '處理失敗',
          suggestions: ['請稍後再試', '檢查網路連線', '聯繫技術支援'],
        };
    }
  };

  const config = getStageConfig();

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <div className="text-center mb-4">
        <div className="text-4xl mb-2">😞</div>
        <h3 className="text-lg font-semibold text-red-700 mb-2">{config.title}</h3>
        <p className="text-red-600 text-sm">{typeof error === 'string' ? error : error.message}</p>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-red-700 mb-2">建議解決方案：</h4>
        <ul className="space-y-1">
          {config.suggestions.map((suggestion, index) => (
            <li key={index} className="text-sm text-red-600 flex items-start">
              <span className="text-red-400 mr-2">•</span>
              {suggestion}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            重新嘗試
          </button>
        )}
        {onReset && (
          <button
            onClick={onReset}
            className="text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            重置設定
          </button>
        )}
      </div>
    </div>
  );
};

// 網路狀態監控元件
export const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white p-2 text-center text-sm font-medium z-50">
      <div className="flex items-center justify-center">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        網路連線中斷，部分功能可能無法使用
      </div>
    </div>
  );
};
