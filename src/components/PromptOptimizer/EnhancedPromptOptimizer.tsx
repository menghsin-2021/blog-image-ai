import React, { useState, useCallback, useEffect } from 'react';
import {
  ImagePurposeType,
  ContentInput as ContentInputType,
  OptimizedPrompt,
} from '../../types/promptOptimizer';
import {
  OPTIMIZATION_PROVIDERS,
  OptimizationProvider,
  PERPLEXITY_MODELS,
  PerplexityModel,
} from '../../utils/perplexityConstants';
import {
  PerplexityOptimizer,
  PerplexityOptimizationResult,
} from '../../services/perplexityOptimizer';
import { PurposeSelector } from './PurposeSelector';
import { ContentInput } from './ContentInput';
import { ProviderSelector } from './ProviderSelector';
import { EnhancedOptimizedPromptDisplay } from './EnhancedOptimizedPromptDisplay';

interface EnhancedPromptOptimizerProps {
  onOptimizedPrompt?: (prompt: OptimizedPrompt | PerplexityOptimizationResult) => void;
  onApplyPrompt?: (prompt: string) => void;
  className?: string;
}

export const EnhancedPromptOptimizer: React.FC<EnhancedPromptOptimizerProps> = ({
  onOptimizedPrompt,
  onApplyPrompt,
  className = '',
}) => {
  // 狀態管理
  const [currentStep, setCurrentStep] = useState<'purpose' | 'content' | 'provider' | 'result'>(
    'purpose'
  );
  const [selectedPurpose, setSelectedPurpose] = useState<ImagePurposeType | null>(null);
  const [contentInput, setContentInput] = useState<ContentInputType>({
    title: '',
    content: '',
    keywords: [],
    targetAudience: '',
  });
  const [selectedProvider, setSelectedProvider] = useState<OptimizationProvider>(
    OPTIMIZATION_PROVIDERS.PERPLEXITY
  );
  const [selectedModel, setSelectedModel] = useState<PerplexityModel | string>(
    PERPLEXITY_MODELS.SONAR
  );
  const [optimizedResult, setOptimizedResult] = useState<
    OptimizedPrompt | PerplexityOptimizationResult | null
  >(null);
  const [estimatedCost, setEstimatedCost] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 服務初始化
  const [perplexityOptimizer] = useState(() => {
    try {
      return new PerplexityOptimizer();
    } catch (error) {
      console.warn('Perplexity optimizer initialization failed:', error);
      return null;
    }
  });

  // 處理用途選擇
  const handlePurposeSelect = useCallback((purpose: ImagePurposeType) => {
    setSelectedPurpose(purpose);
    setCurrentStep('content');
  }, []);

  // 處理內容分析 (舊的 ContentInput 介面)
  const handleAnalyze = useCallback(() => {
    if (contentInput.content.trim()) {
      setCurrentStep('provider');
    }
  }, [contentInput]);

  // 處理提供商選擇
  const handleProviderSelect = useCallback((provider: OptimizationProvider) => {
    setSelectedProvider(provider);

    // 設定預設模型
    if (provider === OPTIMIZATION_PROVIDERS.PERPLEXITY) {
      setSelectedModel(PERPLEXITY_MODELS.SONAR);
    } else {
      setSelectedModel('gpt-4o');
    }
  }, []);

  // 估算成本 (當內容或模型變化時)
  useEffect(() => {
    if (
      selectedProvider === OPTIMIZATION_PROVIDERS.PERPLEXITY &&
      perplexityOptimizer &&
      contentInput.content
    ) {
      perplexityOptimizer
        .analyzeBlogContent(contentInput.content)
        .then(analysis => {
          setEstimatedCost(analysis.estimatedCost);
        })
        .catch(error => {
          console.warn('Cost estimation failed:', error);
          setEstimatedCost(undefined);
        });
    } else {
      setEstimatedCost(undefined);
    }
  }, [selectedProvider, selectedModel, contentInput.content, perplexityOptimizer]);

  // 處理最佳化
  const handleOptimize = useCallback(async () => {
    if (!selectedPurpose || !contentInput.content.trim()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let result: OptimizedPrompt | PerplexityOptimizationResult;

      const purposeText = {
        banner: '首頁橫幅圖片',
        illustration: '段落說明圖片',
        summary: '內容總結圖片',
      }[selectedPurpose];

      if (selectedProvider === OPTIMIZATION_PROVIDERS.PERPLEXITY && perplexityOptimizer) {
        // 使用 Perplexity 最佳化
        result = await perplexityOptimizer.optimizePrompt(
          contentInput.content,
          purposeText,
          selectedModel as PerplexityModel
        );
      } else {
        throw new Error('選擇的 AI 服務不可用，請檢查 API 金鑰設定');
      }

      setOptimizedResult(result);
      setCurrentStep('result');
      onOptimizedPrompt?.(result);
    } catch (error) {
      console.error('Optimization error:', error);
      setError(error instanceof Error ? error.message : '提示詞最佳化失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedPurpose,
    contentInput,
    selectedProvider,
    selectedModel,
    perplexityOptimizer,
    onOptimizedPrompt,
  ]);

  // 處理應用提示詞
  const handleApplyPrompt = useCallback(
    (prompt: string) => {
      onApplyPrompt?.(prompt);
    },
    [onApplyPrompt]
  );

  // 處理重置
  const handleReset = useCallback(() => {
    setCurrentStep('purpose');
    setSelectedPurpose(null);
    setContentInput({
      title: '',
      content: '',
      keywords: [],
      targetAudience: '',
    });
    setOptimizedResult(null);
    setEstimatedCost(undefined);
    setError(null);
  }, []);

  // 處理返回上一步
  const handleBack = useCallback(() => {
    switch (currentStep) {
      case 'content':
        setCurrentStep('purpose');
        break;
      case 'provider':
        setCurrentStep('content');
        break;
      case 'result':
        setCurrentStep('provider');
        break;
    }
  }, [currentStep]);

  // 渲染步驟指示器
  const renderStepIndicator = () => {
    const steps = [
      { id: 'purpose', name: '選擇用途' },
      { id: 'content', name: '輸入內容' },
      { id: 'provider', name: '選擇服務' },
      { id: 'result', name: '查看結果' },
    ];

    const currentIndex = steps.findIndex(step => step.id === currentStep);

    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex items-center">
              <div
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                  ${index <= currentIndex ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}
                `}
              >
                {index + 1}
              </div>
              <span
                className={`
                  ml-2 text-sm font-medium
                  ${index <= currentIndex ? 'text-blue-600' : 'text-gray-500'}
                `}
              >
                {step.name}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`
                  mx-4 h-0.5 w-12
                  ${index < currentIndex ? 'bg-blue-600' : 'bg-gray-200'}
                `}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className={`max-w-4xl mx-auto p-6 ${className}`}>
      {renderStepIndicator()}

      {/* 載入狀態 */}
      {isLoading && (
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 mb-6">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <div>
              <p className="text-blue-900 font-medium">正在最佳化提示詞...</p>
              <p className="text-blue-700 text-sm">
                使用{' '}
                {selectedProvider === OPTIMIZATION_PROVIDERS.PERPLEXITY ? 'Perplexity' : 'OpenAI'}{' '}
                分析您的內容
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 錯誤狀態 */}
      {error && (
        <div className="bg-red-50 rounded-lg border border-red-200 p-6 mb-6">
          <div className="flex items-center space-x-3">
            <div className="text-red-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-red-900 font-medium">最佳化失敗</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* 步驟內容 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {currentStep === 'purpose' && (
          <PurposeSelector
            selectedPurpose={selectedPurpose}
            onPurposeSelect={handlePurposeSelect}
          />
        )}

        {currentStep === 'content' && (
          <ContentInput
            content={contentInput}
            onChange={setContentInput}
            onAnalyze={handleAnalyze}
            isAnalyzing={false}
          />
        )}

        {currentStep === 'provider' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">選擇 AI 最佳化服務</h2>
              <p className="text-gray-600">選擇適合的 AI 服務來最佳化您的提示詞</p>
            </div>

            <ProviderSelector
              selectedProvider={selectedProvider}
              selectedModel={selectedModel}
              onProviderChange={handleProviderSelect}
              onModelChange={setSelectedModel}
              estimatedCost={estimatedCost}
              className="mb-6"
            />

            <div className="flex items-center space-x-3">
              <button
                onClick={handleBack}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                上一步
              </button>
              <button
                onClick={handleOptimize}
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? '最佳化中...' : '開始最佳化'}
              </button>
            </div>
          </div>
        )}

        {currentStep === 'result' && optimizedResult && (
          <div>
            <EnhancedOptimizedPromptDisplay
              result={optimizedResult}
              onApplyPrompt={handleApplyPrompt}
              onReset={handleReset}
            />
          </div>
        )}
      </div>
    </div>
  );
};
