import React, { useState } from 'react';
import { 
  AspectRatio, 
  ImageGenerationRequest,
  DalleModel,
  ImageQuality,
  ImageStyle
} from './types';
import { ASPECT_RATIOS, DEFAULT_SETTINGS, getAspectRatiosForModel } from './utils/constants';
import { useImageGeneration } from './hooks/useImageGeneration';
import { AspectRatioSelector } from './components/AspectRatioSelector';
import { ModelSettings } from './components/ModelSettings';
import { SimpleImagePreview } from './components/SimpleImagePreview';

function App() {
  // 基本狀態
  const [prompt, setPrompt] = useState('');
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>(ASPECT_RATIOS[0]);
  const [selectedModel, setSelectedModel] = useState<DalleModel>(DEFAULT_SETTINGS.model);
  const [selectedQuality, setSelectedQuality] = useState<ImageQuality>(DEFAULT_SETTINGS.quality);
  const [selectedStyle, setSelectedStyle] = useState<ImageStyle>(DEFAULT_SETTINGS.style);

  // 圖片生成 Hook
  const { 
    generatedImage,
    revisedPrompt,
    isLoading, 
    error, 
    generateImage
  } = useImageGeneration();

  // 處理圖片生成
  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    const request: ImageGenerationRequest = {
      prompt: prompt.trim(),
      aspectRatio: selectedRatio,
      model: selectedModel,
      quality: selectedQuality,
      style: selectedStyle,
      n: 1
    };

    await generateImage(request);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* 標題區域 */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            BlogImageAI
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            基於 OpenAI DALL·E 的 AI 圖片生成助手，專為技術部落格文章建立專業插圖
          </p>
        </header>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左側控制面板 */}
            <div className="lg:col-span-1 space-y-6">
              {/* 模型設定 */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  模型設定
                </h3>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  圖片比例
                </h3>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  描述你想要的圖片
                </h3>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
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
        </div>
      </div>
    </div>
  );
}

export default App;
