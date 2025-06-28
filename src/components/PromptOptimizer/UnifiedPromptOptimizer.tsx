import React, { useState, useCallback } from 'react';
import { 
  OptimizationProvider, 
  ImagePurposeType, 
  ContentInput, 
  UnifiedOptimizationResult 
} from '../../types/promptOptimizer';
import { ServiceSelector } from './ServiceSelector';
import { PurposeSelector } from './PurposeSelector';
import { ContentInput as ContentInputComponent } from './ContentInput';

// 工作流程步驟類型
type WorkflowStep = 'service' | 'purpose' | 'content' | 'model' | 'result';

interface UnifiedPromptOptimizerProps {
  onOptimizedPrompt?: (result: UnifiedOptimizationResult) => void;
  onApplyPrompt?: (prompt: string) => void;
  className?: string;
}

interface UnifiedOptimizerState {
  // 流程控制
  currentStep: WorkflowStep;
  
  // 服務選擇
  selectedService: OptimizationProvider | null;
  
  // 共用狀態
  selectedPurpose: ImagePurposeType | null;
  contentInput: ContentInput;
  
  // 服務特定狀態
  selectedModel: string | null;
  
  // 結果狀態
  optimizedResult: UnifiedOptimizationResult | null;
  isLoading: boolean;
  error: string | null;
  
  // 成本狀態 (Perplexity 專用)
  estimatedCost?: number;
}

export const UnifiedPromptOptimizer: React.FC<UnifiedPromptOptimizerProps> = ({
  onOptimizedPrompt,
  onApplyPrompt,
  className = '',
}) => {
  // 狀態管理
  const [state, setState] = useState<UnifiedOptimizerState>({
    currentStep: 'service',
    selectedService: null,
    selectedPurpose: null,
    contentInput: {
      title: '',
      content: '',
      keywords: [],
      targetAudience: '',
    },
    selectedModel: null,
    optimizedResult: null,
    isLoading: false,
    error: null,
  });

  // 處理服務選擇
  const handleServiceSelect = useCallback((service: OptimizationProvider) => {
    setState(prev => ({
      ...prev,
      selectedService: service,
      currentStep: 'purpose',
      error: null,
      // 設定預設模型
      selectedModel: service === 'openai' ? 'gpt-4o' : 'sonar',
    }));
  }, []);

  // 處理用途選擇
  const handlePurposeSelect = useCallback((purpose: ImagePurposeType) => {
    setState(prev => ({
      ...prev,
      selectedPurpose: purpose,
      currentStep: 'content',
    }));
  }, []);

  // 處理內容輸入完成
  const handleContentComplete = useCallback((content: ContentInput) => {
    setState(prev => ({
      ...prev,
      contentInput: content,
      currentStep: 'model',
    }));
  }, []);

  // 處理模型選擇和最佳化
  const handleOptimize = useCallback(async (model?: string) => {
    const { selectedService, selectedPurpose, contentInput } = state;
    
    if (!selectedService || !selectedPurpose || !contentInput.content.trim()) {
      setState(prev => ({ ...prev, error: '請完成所有必要的設定' }));
      return;
    }

    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null,
      selectedModel: model || prev.selectedModel,
    }));

    try {
      // TODO: 實際的最佳化邏輯將在 Phase 2 實作
      // 這裡先建立基本架構
      console.log('Optimization request:', {
        service: selectedService,
        purpose: selectedPurpose,
        content: contentInput,
        model: model || state.selectedModel,
      });

      // 模擬 API 呼叫
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 建立模擬結果
      const mockResult: UnifiedOptimizationResult = {
        provider: selectedService,
        model: model || state.selectedModel || 'default',
        timestamp: Date.now(),
        original: contentInput.content.slice(0, 100) + '...',
        originalPrompt: contentInput.content.slice(0, 100) + '...',
        optimized: {
          chinese: '最佳化的中文提示詞 (模擬)',
          english: 'Optimized English prompt (mock)',
        },
        optimizedPrompt: '最佳化的中文提示詞 (模擬)',
        improvements: ['改善點 1', '改善點 2'],
        reasoning: '模擬的最佳化理由',
        suggestedStyle: '現代簡約',
        technicalTips: '技術建議',
        confidence: 0.85,
        analysis: {
          keywords: ['關鍵字1', '關鍵字2'],
          topic: selectedPurpose,
          sentiment: 'professional',
          complexity: 'moderate',
        },
        technicalParams: {
          aspectRatio: '16:9',
          quality: 'high',
        },
        styleModifiers: ['現代', '簡約'],
        suggestions: ['改善點 1', '改善點 2'],
        exportData: {
          markdown: '# 最佳化結果\\n\\n模擬內容',
        },
      };

      setState(prev => ({
        ...prev,
        optimizedResult: mockResult,
        currentStep: 'result',
      }));

      onOptimizedPrompt?.(mockResult);

    } catch (error) {
      console.error('Optimization error:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '最佳化失敗，請稍後再試',
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state, onOptimizedPrompt]);

  // 重置到指定步驟
  const handleReset = useCallback((step: WorkflowStep = 'service') => {
    setState({
      currentStep: step,
      selectedService: step === 'service' ? null : state.selectedService,
      selectedPurpose: ['service', 'purpose'].includes(step) ? null : state.selectedPurpose,
      contentInput: ['service', 'purpose', 'content'].includes(step) ? {
        title: '',
        content: '',
        keywords: [],
        targetAudience: '',
      } : state.contentInput,
      selectedModel: null,
      optimizedResult: null,
      isLoading: false,
      error: null,
    });
  }, [state]);

  // 渲染步驟指示器
  const renderStepIndicator = () => {
    const steps = [
      { key: 'service', label: '選擇服務', icon: '🔧' },
      { key: 'purpose', label: '選擇用途', icon: '🎯' },
      { key: 'content', label: '輸入內容', icon: '📝' },
      { key: 'model', label: '設定參數', icon: '⚙️' },
      { key: 'result', label: '查看結果', icon: '✨' },
    ];

    const currentIndex = steps.findIndex(step => step.key === state.currentStep);

    return (
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => (
            <React.Fragment key={step.key}>
              <div
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium
                  ${index <= currentIndex
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                  }
                `}
              >
                {step.icon}
              </div>
              <div className="text-xs text-gray-600 max-w-16 text-center">
                {step.label}
              </div>
              {index < steps.length - 1 && (
                <div 
                  className={`
                    w-8 h-0.5 
                    ${index < currentIndex ? 'bg-blue-500' : 'bg-gray-200'}
                  `} 
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // 渲染當前步驟內容
  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case 'service':
        return (
          <ServiceSelector
            selectedService={state.selectedService}
            onServiceSelect={handleServiceSelect}
          />
        );

      case 'purpose':
        return (
          <div>
            <PurposeSelector
              selectedPurpose={state.selectedPurpose}
              onPurposeSelect={handlePurposeSelect}
            />
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => handleReset('service')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                ← 返回選擇服務
              </button>
            </div>
          </div>
        );

      case 'content':
        return (
          <div>
            <ContentInputComponent
              content={state.contentInput}
              onChange={(content: ContentInput) => setState(prev => ({ ...prev, contentInput: content }))}
              onAnalyze={() => handleContentComplete(state.contentInput)}
              isAnalyzing={state.isLoading}
            />
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setState(prev => ({ ...prev, currentStep: 'purpose' }))}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                ← 返回選擇用途
              </button>
            </div>
          </div>
        );

      case 'model':
        return renderModelStep();

      case 'result':
        return renderResultStep();

      default:
        return null;
    }
  };

  // 渲染模型設定步驟
  const renderModelStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          模型設定
        </h2>
        <p className="text-gray-600">
          使用 {state.selectedService === 'openai' ? 'OpenAI GPT-4o' : 'Perplexity AI'} 進行最佳化
        </p>
      </div>

      {/* 模型選擇 (Perplexity 才顯示) */}
      {state.selectedService === 'perplexity' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            選擇 Perplexity 模型
          </label>
          <select 
            value={state.selectedModel || 'sonar'}
            onChange={(e) => setState(prev => ({ ...prev, selectedModel: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="sonar">Sonar - 快速且經濟</option>
            <option value="sonar-pro">Sonar Pro - 深度分析</option>
            <option value="sonar-reasoning">Sonar Reasoning - 邏輯推理</option>
          </select>
        </div>
      )}

      {/* 開始最佳化按鈕 */}
      <div className="text-center">
        <button
          onClick={() => handleOptimize()}
          disabled={state.isLoading}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state.isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              正在最佳化...
            </>
          ) : (
            <>
              ✨ 開始最佳化
            </>
          )}
        </button>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={() => setState(prev => ({ ...prev, currentStep: 'content' }))}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          ← 返回編輯內容
        </button>
      </div>
    </div>
  );

  // 渲染結果步驟
  const renderResultStep = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          最佳化結果
        </h2>
        <p className="text-gray-600">
          {state.selectedService === 'openai' ? 'OpenAI GPT-4o' : 'Perplexity AI'} 最佳化完成
        </p>
      </div>

      {/* TODO: 在 Phase 3 實作統一結果展示元件 */}
      {state.optimizedResult && (
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">最佳化提示詞</h3>
          <div className="bg-gray-50 p-4 rounded border">
            <p className="text-gray-800">{state.optimizedResult.optimizedPrompt}</p>
          </div>
          
          <div className="mt-4 flex space-x-3">
            <button
              onClick={() => onApplyPrompt?.(state.optimizedResult!.optimizedPrompt)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              應用到圖片生成
            </button>
            <button
              onClick={() => handleReset()}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              重新開始
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 步驟指示器 */}
      {renderStepIndicator()}

      {/* 錯誤訊息 */}
      {state.error && (
        <div className="max-w-2xl mx-auto mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-red-500 mr-3">⚠️</div>
              <div>
                <p className="text-red-800 font-medium">錯誤</p>
                <p className="text-red-700 text-sm">{state.error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 當前步驟內容 */}
      {renderCurrentStep()}
    </div>
  );
};
