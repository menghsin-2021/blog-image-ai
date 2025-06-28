import { FC, useState } from 'react';
import { Download, RefreshCw, Copy, Check, Image } from 'lucide-react';

interface SimpleImagePreviewProps {
  imageUrl: string | null;
  revisedPrompt?: string | null;
  originalPrompt: string;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export const SimpleImagePreview: FC<SimpleImagePreviewProps> = ({
  imageUrl,
  revisedPrompt,
  originalPrompt,
  isLoading,
  error,
  onRetry,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);
  const [imageCopied, setImageCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!imageUrl) return;

    setIsDownloading(true);
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `blog-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('下載失敗:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyPrompt = async () => {
    const textToCopy = revisedPrompt || originalPrompt;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setPromptCopied(true);
      setCopyError(null);
      setTimeout(() => setPromptCopied(false), 2000);
    } catch (err) {
      console.error('複製提示詞失敗:', err);
      setCopyError('複製提示詞失敗，請手動複製');
      setTimeout(() => setCopyError(null), 3000);
    }
  };

  const handleCopyImage = async () => {
    if (!imageUrl) return;

    try {
      // 檢查瀏覽器是否支援 Clipboard API
      if (!navigator.clipboard || !ClipboardItem) {
        throw new Error('瀏覽器不支援圖片複製功能');
      }

      // 下載圖片並轉換為 Blob
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error('無法載入圖片');
      }

      const blob = await response.blob();
      
      // 檢查圖片格式
      if (!blob.type.startsWith('image/')) {
        throw new Error('不支援的圖片格式');
      }

      // 複製到剪貼簿
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);

      setImageCopied(true);
      setCopyError(null);
      setTimeout(() => setImageCopied(false), 2000);
    } catch (err) {
      console.error('複製圖片失敗:', err);
      const errorMessage = err instanceof Error ? err.message : '複製圖片失敗';
      setCopyError(errorMessage);
      setTimeout(() => setCopyError(null), 5000);
    }
  };

  // Loading 狀態
  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600 text-lg">正在生成圖片...</p>
          <p className="text-gray-400 text-sm mt-2">這可能需要 10-30 秒</p>
        </div>
      </div>
    );
  }

  // 錯誤狀態
  if (error) {
    return (
      <div className="p-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-700 mb-2">生成失敗</h3>
          <p className="text-red-600 text-center mb-6 max-w-md">{error}</p>
          <button
            onClick={onRetry}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            重新嘗試
          </button>
        </div>
      </div>
    );
  }

  // 無圖片狀態
  if (!imageUrl) {
    return (
      <div className="p-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-gray-400 text-6xl mb-4">🖼️</div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">等待生成圖片</h3>
          <p className="text-gray-500 text-center">輸入提示詞並點擊生成按鈕開始</p>
        </div>
      </div>
    );
  }

  // 顯示生成的圖片
  return (
    <div className="overflow-hidden">
      {/* 圖片預覽 */}
      <div className="relative group">
        <img
          src={imageUrl}
          alt="Generated image"
          className="w-full h-auto object-contain max-h-[600px]"
          loading="lazy"
        />

        {/* 懸停時顯示的操作按鈕 */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 disabled:opacity-50"
              title="下載圖片"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={handleCopyImage}
              className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200"
              title="複製圖片"
            >
              {imageCopied ? <Check className="w-5 h-5 text-green-500" /> : <Image className="w-5 h-5" />}
            </button>
            <button
              onClick={handleCopyPrompt}
              className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200"
              title="複製提示詞"
            >
              {promptCopied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 提示詞資訊 */}
      <div className="p-4 border-t border-gray-100">
        {/* 錯誤訊息顯示 */}
        {copyError && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{copyError}</p>
            <p className="text-xs text-red-500 mt-1">
              提示：您可以右鍵點擊圖片選擇「複製圖片」作為替代方案
            </p>
          </div>
        )}

        {revisedPrompt && revisedPrompt !== originalPrompt && (
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-700 mb-1">優化後的提示詞:</h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded italic">"{revisedPrompt}"</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex-1 mr-4">
            <h4 className="text-sm font-medium text-gray-700 mb-1">原始提示詞:</h4>
            <p className="text-sm text-gray-600">"{originalPrompt}"</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopyImage}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              title="複製圖片到剪貼簿"
            >
              {imageCopied ? <Check className="w-4 h-4" /> : <Image className="w-4 h-4" />}
              {imageCopied ? '已複製圖片' : '複製圖片'}
            </button>
            
            <button
              onClick={handleCopyPrompt}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              title="複製提示詞到剪貼簿"
            >
              {promptCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {promptCopied ? '已複製提示詞' : '複製提示詞'}
            </button>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              {isDownloading ? '下載中...' : '下載'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
