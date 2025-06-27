import React, { useState, useCallback } from 'react';
import { ImagePurposeType, ContentInput as ContentInputType, OptimizedPrompt } from '../../types/promptOptimizer';
import { PurposeSelector } from './PurposeSelector';
import { ContentInput } from './ContentInput';

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
      // TODO: Phase 2 會實作真正的分析邏輯
      // 這裡先用模擬資料展示介面
      await new Promise(resolve => setTimeout(resolve, 2000)); // 模擬分析時間
      
      const mockOptimizedPrompt: OptimizedPrompt = {
        original: contentInput.content.slice(0, 100) + '...',
        optimized: generateMockOptimizedPrompt(selectedPurpose, contentInput),
        suggestions: [
          '加入專業的視覺風格指引',
          '優化技術術語的視覺表現',
          '調整構圖建議以符合部落格需求'
        ],
        styleModifiers: ['現代', '簡潔', '專業', '清晰'],
        technicalParams: {
          aspectRatio: selectedPurpose === 'banner' ? '16:9' : '1:1',
          quality: 'high',
          style: 'natural'
        },
        confidence: 0.85
      };

      setOptimizedPrompt(mockOptimizedPrompt);
      setCurrentStep('result');
      onOptimizedPrompt?.(mockOptimizedPrompt);
      
    } catch (error) {
      console.error('Analysis failed:', error);
      // TODO: 加入錯誤處理 UI
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedPurpose, contentInput, onOptimizedPrompt]);

  // 生成模擬最佳化提示詞 (Phase 2 會替換為真正的邏輯)
  const generateMockOptimizedPrompt = (purpose: ImagePurposeType, content: ContentInputType): string => {
    const basePrompt = `關於"${content.title}"的`;
    
    switch (purpose) {
      case 'banner':
        return `${basePrompt}現代專業橫幅圖片，視覺衝擊力強，簡潔設計，適合技術部落格首頁，包含相關的視覺元素和符號`;
      case 'illustration':
        return `${basePrompt}簡單清晰的說明插圖，扁平設計風格，圖示化表現，適合輔助文章段落說明概念`;
      case 'summary':
        return `${basePrompt}概念性總結圖片，象徵性設計，啟發性視覺元素，適合文章結尾總結主題`;
      default:
        return basePrompt + '專業插圖';
    }
  };

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
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600 mb-2">
                ✨ 提示詞最佳化完成！
              </div>
              <p className="text-gray-600">
                系統已根據您的內容和用途生成最佳化的圖片提示詞
              </p>
            </div>

            {/* 最佳化結果展示 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">最佳化提示詞</h4>
              <div className="bg-white rounded border p-3 text-gray-800">
                {optimizedPrompt.optimized}
              </div>
              
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <span>信心度：</span>
                  <div className="ml-2 w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${optimizedPrompt.confidence * 100}%` }}
                    ></div>
                  </div>
                  <span className="ml-2">{Math.round(optimizedPrompt.confidence * 100)}%</span>
                </div>
                
                <button
                  onClick={() => onApplyPrompt?.(optimizedPrompt.optimized)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  應用到生成器
                </button>
              </div>
            </div>

            {/* 最佳化建議 */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">最佳化建議</h4>
              <ul className="space-y-2">
                {optimizedPrompt.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-600">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          </div>
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
