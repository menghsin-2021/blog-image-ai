import React, { useState, useCallback } from 'react';
import { ImagePurposeType, ContentInput as ContentInputType, OptimizedPrompt } from '../../types/promptOptimizer';
import { validateContentInput } from '../../services/contentAnalyzer';
import { gpt4oOptimizationService } from '../../services/gpt4oOptimizer';
import { PurposeSelector } from './PurposeSelector';
import { ContentInput } from './ContentInput';
import { OptimizedPromptDisplay } from './OptimizedPromptDisplay';

interface PromptOptimizerProps {
  onOptimizedPrompt?: (prompt: OptimizedPrompt) => void;
  onApplyPrompt?: (prompt: string) => void;
}

export const PromptOptimizer: React.FC<PromptOptimizerProps> = ({
  onOptimizedPrompt,
  onApplyPrompt
}) => {
  // 狀態管理
  const [currentStep, setCurrentStep] = useState<'purpose' | 'content' | 'result'>('purpose');
  const [selectedPurpose, setSelectedPurpose] = useState<ImagePurposeType | null>(null);
  const [contentInput, setContentInput] = useState<ContentInputType>({
    title: '',
    content: '',
    keywords: [],
    targetAudience: ''
  });
  const [optimizedPrompt, setOptimizedPrompt] = useState<OptimizedPrompt | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 處理用途選擇
  const handlePurposeSelect = useCallback((purpose: ImagePurposeType) => {
    setSelectedPurpose(purpose);
    setCurrentStep('content');
  }, []);

  // 處理內容分析
  const handleAnalyze = useCallback(async () => {
    if (!selectedPurpose || !contentInput.title?.trim() || !contentInput.content.trim()) {
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // 驗證輸入
      const validation = validateContentInput(contentInput);
      if (!validation.isValid) {
        console.error('輸入驗證失敗:', validation.errors);
        // TODO: 顯示錯誤訊息
        return;
      }

      // 使用 GPT-4o 進行真實的最佳化
      const result = await gpt4oOptimizationService.optimizePrompt(contentInput, selectedPurpose);
      
      setOptimizedPrompt(result);
      setCurrentStep('result');
      onOptimizedPrompt?.(result);
      
    } catch (error) {
      console.error('最佳化失敗:', error);
      // TODO: 加入錯誤處理 UI
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedPurpose, contentInput, onOptimizedPrompt]);

  // 重新開始流程
  const handleRestart = useCallback(() => {
    setCurrentStep('purpose');
    setSelectedPurpose(null);
    setContentInput({
      title: '',
      content: '',
      keywords: [],
      targetAudience: ''
    });
    setOptimizedPrompt(null);
  }, []);

  // 返回上一步
  const handleBack = useCallback(() => {
    if (currentStep === 'content') {
      setCurrentStep('purpose');
    } else if (currentStep === 'result') {
      setCurrentStep('content');
    }
  }, [currentStep]);

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* 標題區域 */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          提示詞最佳化助手
        </h3>
        <p className="text-gray-600">
          針對部落格圖片需求，智慧分析內容並生成最佳化的圖片提示詞
        </p>
      </div>

      {/* 進度指示器 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-center space-x-8">
          <div className={`flex items-center ${currentStep === 'purpose' ? 'text-blue-600' : currentStep === 'content' || currentStep === 'result' ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'purpose' ? 'bg-blue-100' : currentStep === 'content' || currentStep === 'result' ? 'bg-green-100' : 'bg-gray-100'}`}>
              1
            </div>
            <span className="ml-2 text-sm font-medium">選擇用途</span>
          </div>
          
          <div className={`flex items-center ${currentStep === 'content' ? 'text-blue-600' : currentStep === 'result' ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'content' ? 'bg-blue-100' : currentStep === 'result' ? 'bg-green-100' : 'bg-gray-100'}`}>
              2
            </div>
            <span className="ml-2 text-sm font-medium">輸入內容</span>
          </div>
          
          <div className={`flex items-center ${currentStep === 'result' ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'result' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              3
            </div>
            <span className="ml-2 text-sm font-medium">最佳化結果</span>
          </div>
        </div>
      </div>

      {/* 主要內容區域 */}
      <div className="p-6">
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
            isAnalyzing={isAnalyzing}
          />
        )}

        {currentStep === 'result' && optimizedPrompt && (
          <OptimizedPromptDisplay
            result={optimizedPrompt}
            onApplyPrompt={onApplyPrompt || (() => {})}
            onEditPrompt={(editedPrompt) => {
              // 編輯功能暫時留空，因為需要知道是哪個語言版本被編輯
              console.log('編輯提示詞:', editedPrompt);
            }}
            onReset={handleRestart}
          />
        )}

        {/* 導航按鈕 */}
        <div className="mt-8 flex justify-between">
          <div>
            {currentStep !== 'purpose' && (
              <button
                onClick={handleBack}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← 上一步
              </button>
            )}
          </div>
          
          <div className="space-x-3">
            {currentStep === 'result' && (
              <button
                onClick={handleRestart}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                重新開始
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
