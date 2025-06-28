import { useState } from 'react';
import { AspectRatio, ImageGenerationRequest, DalleModel, ImageQuality, ImageStyle } from './types';
import { OptimizedPrompt } from './types/promptOptimizer';
import { ASPECT_RATIOS, DEFAULT_SETTINGS, getAspectRatiosForModel } from './utils/constants';
import { useImageGeneration } from './hooks/useImageGeneration';
import { AspectRatioSelector } from './components/AspectRatioSelector';
import { ModelSettings } from './components/ModelSettings';
import { SimpleImagePreview } from './components/SimpleImagePreview';
import { PromptOptimizer, EnhancedPromptOptimizer } from './components/PromptOptimizer';
// import { CacheTestPanel } from './components/CacheTestPanel';
import { SimpleCacheTestPanel } from './components/SimpleCacheTestPanel';

function App() {
  // 檢查是否為開發環境或除錯模式
  const isDevelopment = import.meta.env.DEV;
  const isDebugMode = isDevelopment || import.meta.env.VITE_DEBUG_MODE === 'true';

  // 基本狀態
  const [prompt, setPrompt] = useState('');
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>(ASPECT_RATIOS[0]);
  const [selectedModel, setSelectedModel] = useState<DalleModel>(DEFAULT_SETTINGS.model);
  const [selectedQuality, setSelectedQuality] = useState<ImageQuality>(DEFAULT_SETTINGS.quality);
  const [selectedStyle, setSelectedStyle] = useState<ImageStyle>(DEFAULT_SETTINGS.style);

  // 頁籤狀態 - 使用簡單的字串聯合類型
  type TabType = 'generate' | 'optimize' | 'perplexity' | 'cacheTest';
  const [activeTab, setActiveTab] = useState<TabType>('generate');

  // 圖片生成 Hook
  const { generatedImage, revisedPrompt, isLoading, error, generateImage } = useImageGeneration();

  // 處理圖片生成
  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    const request: ImageGenerationRequest = {
      prompt: prompt.trim(),
      aspectRatio: selectedRatio,
      model: selectedModel,
      quality: selectedQuality,
      style: selectedStyle,
      n: 1,
    };

    await generateImage(request);
  };

  // 處理提示詞最佳化結果
  const handleOptimizedPrompt = (optimized: OptimizedPrompt) => {
    console.log('Optimized prompt received:', optimized);
  };

  // 應用最佳化提示詞到生成器
  const handleApplyPrompt = (optimizedPrompt: string) => {
    setPrompt(optimizedPrompt);
    setActiveTab('generate');

    // 自動應用推薦的技術參數 (這裡可以擴展)
    // TODO: 根據最佳化結果調整比例和其他參數
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* 標題區域 */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">BlogImageAI</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            智慧 AI 圖片生成平台，支援多模型與提示詞最佳化，專為部落格打造專業插圖
          </p>
        </header>

        <div className="max-w-6xl mx-auto">
          {/* 頁籤導航 */}
          <div className="mb-6">
            <div
              className={`flex space-x-1 bg-gray-100 p-1 rounded-lg mx-auto ${
                isDebugMode ? 'max-w-2xl' : 'max-w-xl'
              }`}
            >
              <button
                onClick={() => setActiveTab('generate')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'generate'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                🎨 圖片生成
              </button>
              <button
                onClick={() => setActiveTab('optimize')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'optimize'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                ✨ 提示詞最佳化
              </button>
              <button
                onClick={() => setActiveTab('perplexity')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'perplexity'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                🔍 Perplexity 最佳化
              </button>
              {/* 只在開發環境或除錯模式下顯示快取測試頁籤 */}
              {isDebugMode && (
                <button
                  onClick={() => setActiveTab('cacheTest')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'cacheTest'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  🐳 快取測試
                </button>
              )}
            </div>

            {/* 開發環境提示 */}
            {isDebugMode && (
              <div className="text-center mt-2">
                <span className="text-xs text-gray-500 bg-yellow-100 px-2 py-1 rounded">
                  {isDevelopment ? '開發模式' : '除錯模式'} - 快取測試功能僅在開發環境中可用
                </span>
              </div>
            )}
          </div>

          {/* 內容區域 */}
          {activeTab === 'generate' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 左側控制面板 */}
              <div className="lg:col-span-1 space-y-6">
                {/* 模型設定 */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">模型設定</h3>
                  <ModelSettings
                    model={selectedModel}
                    quality={selectedQuality}
                    style={selectedStyle}
                    onModelChange={setSelectedModel}
                    onQualityChange={setSelectedQuality}
                    onStyleChange={setSelectedStyle}
                  />
                </div>

                {/* 比例選擇器 */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">圖片比例</h3>
                  <AspectRatioSelector
                    options={getAspectRatiosForModel(selectedModel)}
                    selected={selectedRatio}
                    onSelect={setSelectedRatio}
                  />
                </div>
              </div>

              {/* 右側主要內容 */}
              <div className="lg:col-span-2 space-y-6">
                {/* 輸入區域 */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">描述你想要的圖片</h3>
                  <textarea
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="描述你想生成的技術插圖，例如：一個現代的雲端架構圖，顯示微服務之間的連接..."
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={4}
                  />

                  <div className="mt-4">
                    <button
                      onClick={handleGenerate}
                      disabled={!prompt.trim() || isLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                      {isLoading ? '生成中...' : '生成圖片'}
                    </button>
                  </div>
                </div>

                {/* 圖片預覽區域 */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <SimpleImagePreview
                    imageUrl={generatedImage}
                    revisedPrompt={revisedPrompt}
                    originalPrompt={prompt}
                    isLoading={isLoading}
                    error={error}
                    onRetry={handleGenerate}
                  />
                </div>
              </div>
            </div>
          ) : activeTab === 'optimize' ? (
            /* 提示詞最佳化頁面 */
            <PromptOptimizer
              onOptimizedPrompt={handleOptimizedPrompt}
              onApplyPrompt={handleApplyPrompt}
            />
          ) : activeTab === 'perplexity' ? (
            /* Perplexity 最佳化頁面 */
            <EnhancedPromptOptimizer
              onOptimizedPrompt={(result) => {
                console.log('Perplexity 最佳化結果:', result);
                // 如果結果有 optimizedPrompt 屬性，處理為舊格式
                if ('optimizedPrompt' in result) {
                  handleOptimizedPrompt(result as OptimizedPrompt);
                }
              }}
              onApplyPrompt={handleApplyPrompt}
            />
          ) : isDebugMode ? (
            /* 快取測試頁面 - 只在開發環境或除錯模式中顯示 */
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ 開發工具:</strong>{' '}
                  此功能僅供開發人員測試快取系統效能，在生產環境中不會顯示。
                </p>
              </div>
              <SimpleCacheTestPanel />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default App;
