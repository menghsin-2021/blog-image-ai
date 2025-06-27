import React, { useState, useCallback } from 'react';
import {
  ImagePurposeType,
  ContentInput as ContentInputType,
  OptimizedPrompt,
} from '../../types/promptOptimizer';
import { validateContentInput } from '../../services/contentAnalyzer';
import { usePromptOptimizationCache } from '../../hooks/usePromptOptimizationCache';
import { useLoadingState, PROMPT_OPTIMIZATION_PHASES } from '../../hooks/useLoadingState';
import { PurposeSelector } from './PurposeSelector';
import { ContentInput } from './ContentInput';
import { OptimizedPromptDisplay } from './OptimizedPromptDisplay';

interface PromptOptimizerProps {
  onOptimizedPrompt?: (prompt: OptimizedPrompt) => void;
  onApplyPrompt?: (prompt: string) => void;
}

export const PromptOptimizer: React.FC<PromptOptimizerProps> = ({
  onOptimizedPrompt,
  onApplyPrompt,
}) => {
  // 狀態管理
  const [currentStep, setCurrentStep] = useState<'purpose' | 'content' | 'result'>('purpose');
  const [selectedPurpose, setSelectedPurpose] = useState<ImagePurposeType | null>(null);
  const [contentInput, setContentInput] = useState<ContentInputType>({
    title: '',
    content: '',
    keywords: [],
    targetAudience: '',
  });
  const [optimizedPrompt, setOptimizedPrompt] = useState<OptimizedPrompt | null>(null);

  // 快取和載入狀態管理
  const { optimizePromptWithCache } = usePromptOptimizationCache();
  const loadingState = useLoadingState(PROMPT_OPTIMIZATION_PHASES);

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

    loadingState.startLoading();

    try {
      // 階段 1: 驗證輸入
      loadingState.updatePhase('validate');
      const validation = validateContentInput(contentInput);
      if (!validation.isValid) {
        console.error('輸入驗證失敗:', validation.errors);
        loadingState.failLoading(new Error('輸入驗證失敗'));
        return;
      }

      // 階段 2: 分析內容
      loadingState.updatePhase('analyze');
      await new Promise(resolve => setTimeout(resolve, 500)); // 模擬分析時間

      // 階段 3: 生成最佳化提示詞
      loadingState.updatePhase('generate');
      const result = await optimizePromptWithCache(contentInput, selectedPurpose);

      // 階段 4: 格式化結果
      loadingState.updatePhase('format');
      await new Promise(resolve => setTimeout(resolve, 300)); // 模擬格式化時間

      setOptimizedPrompt(result);
      setCurrentStep('result');
      onOptimizedPrompt?.(result);

      loadingState.completeLoading();
    } catch (error) {
      console.error('最佳化失敗:', error);
      loadingState.failLoading(error as Error);
    }
  }, [selectedPurpose, contentInput, onOptimizedPrompt, loadingState, optimizePromptWithCache]);

  // 重新開始流程
  const handleRestart = useCallback(() => {
    setCurrentStep('purpose');
    setSelectedPurpose(null);
    setContentInput({
      title: '',
      content: '',
      keywords: [],
      targetAudience: '',
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
        <h3 className="text-xl font-semibold text-gray-900 mb-2">提示詞最佳化助手</h3>
        <p className="text-gray-600">針對部落格圖片需求，智慧分析內容並生成最佳化的圖片提示詞</p>
      </div>

      {/* 進度指示器 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-center space-x-8">
          <div
            className={`flex items-center ${currentStep === 'purpose' ? 'text-blue-600' : currentStep === 'content' || currentStep === 'result' ? 'text-green-600' : 'text-gray-400'}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'purpose' ? 'bg-blue-100' : currentStep === 'content' || currentStep === 'result' ? 'bg-green-100' : 'bg-gray-100'}`}
            >
              1
            </div>
            <span className="ml-2 text-sm font-medium">選擇用途</span>
          </div>

          <div
            className={`flex items-center ${currentStep === 'content' ? 'text-blue-600' : currentStep === 'result' ? 'text-green-600' : 'text-gray-400'}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'content' ? 'bg-blue-100' : currentStep === 'result' ? 'bg-green-100' : 'bg-gray-100'}`}
            >
              2
            </div>
            <span className="ml-2 text-sm font-medium">輸入內容</span>
          </div>

          <div
            className={`flex items-center ${currentStep === 'result' ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'result' ? 'bg-blue-100' : 'bg-gray-100'}`}
            >
              3
            </div>
            <span className="ml-2 text-sm font-medium">最佳化結果</span>
          </div>
        </div>
      </div>

      {/* 主要內容區域 */}
      <div className="p-6 relative">
        {/* 載入狀態覆蓋 */}
        {loadingState.isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">處理中...</h3>
                <p className="text-gray-600 mb-4">{loadingState.loadingData.phase}</p>

                {/* 進度條 */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${loadingState.loadingData.progress}%` }}
                  />
                </div>

                {/* 階段指示器 */}
                <div className="space-y-2 text-left">
                  {loadingState.loadingData.phases.map(phase => (
                    <div
                      key={phase.id}
                      className={`flex items-center text-sm ${
                        phase.completed ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center ${
                          phase.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                        }`}
                      >
                        {phase.completed && (
                          <svg
                            className="w-2 h-2 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      {phase.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 錯誤狀態 */}
        {loadingState.isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-red-600 mr-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-red-800 font-medium">處理失敗</h3>
                <p className="text-red-700 text-sm">
                  {loadingState.loadingData.error?.message || '發生未知錯誤，請重試'}
                </p>
              </div>
              <button
                onClick={loadingState.resetLoading}
                className="ml-4 px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded"
              >
                重試
              </button>
            </div>
          </div>
        )}
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
            isAnalyzing={loadingState.isLoading}
          />
        )}

        {currentStep === 'result' && optimizedPrompt && (
          <OptimizedPromptDisplay
            result={optimizedPrompt}
            onApplyPrompt={onApplyPrompt || (() => {})}
            onEditPrompt={editedPrompt => {
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
