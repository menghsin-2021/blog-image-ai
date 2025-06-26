import React, { useState } from 'react';
import { 
  AspectRatio, 
  ImageGenerationRequest, 
  ImageEditRequest,
  ImageVariationRequest,
  DalleModel,
  ImageQuality,
  ImageStyle
} from './types';
import { ASPECT_RATIOS, DEFAULT_SETTINGS, getAspectRatiosForModel } from './utils/constants';
import { useImageGeneration } from './hooks/useImageGeneration';
import { useImageHistory } from './hooks/useImageHistory';
import { Button } from './components/Button';
import { PromptInput } from './components/PromptInput';
import { AspectRatioSelector } from './components/AspectRatioSelector';
import { ImagePreview } from './components/ImagePreview';
import { ModelSettings } from './components/ModelSettings';
// import DebugInfo from './components/DebugInfo';

/**
 * 主應用程式元件
 */
function App() {
  // 狀態管理
  const [prompt, setPrompt] = useState('');
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>(ASPECT_RATIOS[0]);
  const [selectedModel, setSelectedModel] = useState<DalleModel>(DEFAULT_SETTINGS.model);
  const [selectedQuality, setSelectedQuality] = useState<ImageQuality>(DEFAULT_SETTINGS.quality);
  const [selectedStyle, setSelectedStyle] = useState<ImageStyle>(DEFAULT_SETTINGS.style);
  
  // Hooks
  const { 
    generatedImage,
    revisedPrompt,
    isLoading, 
    isSuccess, 
    error, 
    generateImage,
    editImage,
    createVariation,
    reset 
  } = useImageGeneration();
  
  const { addToHistory } = useImageHistory();

  // 當模型改變時，確保選擇的比例在新模型中可用
  React.useEffect(() => {
    const availableRatios = getAspectRatiosForModel(selectedModel);
    if (!availableRatios.some(ratio => ratio.value === selectedRatio.value)) {
      setSelectedRatio(availableRatios[0]);
    }
  }, [selectedModel, selectedRatio.value]);

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

  // 處理圖片編輯
  const handleEdit = async (editedImage: File, mask: File, editPrompt: string) => {
    const request: ImageEditRequest = {
      image: editedImage,
      mask: mask,
      prompt: editPrompt,
      n: 1,
      size: selectedRatio.value
    };

    await editImage(request);
  };

  // 處理圖片變化
  const handleVariation = async (imageFile: File) => {
    const request: ImageVariationRequest = {
      image: imageFile,
      n: 1,
      size: selectedRatio.value
    };

    await createVariation(request);
  };

  // 當圖片生成成功時，加入歷史記錄
  React.useEffect(() => {
    if (isSuccess && generatedImage) {
      addToHistory({
        prompt,
        originalPrompt: prompt,
        revisedPrompt: revisedPrompt || undefined,
        imageUrl: generatedImage,
        aspectRatio: selectedRatio,
        model: selectedModel,
        quality: selectedQuality,
        style: selectedStyle,
        type: 'generation'
      });
    }
  }, [isSuccess, generatedImage, prompt, revisedPrompt, selectedRatio, selectedModel, selectedQuality, selectedStyle, addToHistory]);

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 控制面板 */}
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

            {/* 主要內容區域 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 提示詞輸入 */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  描述你想要的圖片
                </h3>
                <PromptInput
                  value={prompt}
                  onChange={setPrompt}
                  placeholder="描述你想生成的技術插圖，例如：一個現代的雲端架構圖，顯示微服務之間的連接..."
                  disabled={isLoading}
                />
                
                {/* 生成按鈕 */}
                <div className="mt-4 flex gap-3">
                  <Button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isLoading}
                    loading={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? '生成中...' : '生成圖片'}
                  </Button>
                  
                  {(generatedImage || error) && (
                    <Button
                      onClick={reset}
                      variant="outline"
                      disabled={isLoading}
                    >
                      重置
                    </Button>
                  )}
                </div>
              </div>

              {/* 錯誤訊息 */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        生成錯誤
                      </h3>
                      <div className="mt-1 text-sm text-red-700">
                        {error}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 圖片預覽區域 */}
              {generatedImage && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    生成結果
                  </h3>
                  <ImagePreview
                    imageUrl={generatedImage}
                    prompt={prompt}
                    revisedPrompt={revisedPrompt || undefined}
                    model={selectedModel}
                    onEdit={handleEdit}
                    onVariation={handleVariation}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 頁尾 */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>
            Powered by OpenAI DALL·E | 
            <a 
              href="https://github.com/menghsin/blog-image-ai" 
              className="ml-1 text-indigo-600 hover:text-indigo-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </p>
        </footer>
      </div>
      
      {/* 偵錯元件 - 暫時停用 */}
      {/* <DebugInfo /> */}
    </div>
  );
}

export default App;
