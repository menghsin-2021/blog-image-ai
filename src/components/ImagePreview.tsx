import React, { useState } from 'react';
import { Button } from './Button';
import { ImageEditor } from './ImageEditor';
import { downloadImage, formatFileName, copyToClipboard } from '../utils/helpers';
import { DownloadFormat, DalleModel } from '../types';

interface ImagePreviewProps {
  imageUrl: string;
  prompt: string;
  revisedPrompt?: string;
  model: DalleModel;
  isLoading?: boolean;
  onRegenerate?: () => void;
  onEdit?: (editedImage: File, mask: File, editPrompt: string) => void;
  onVariation?: (imageFile: File) => void;
  className?: string;
}

/**
 * 圖片預覽元件
 */
export const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageUrl,
  prompt,
  revisedPrompt,
  model,
  isLoading = false,
  onRegenerate,
  onEdit,
  onVariation,
  className = ''
}) => {
  const [downloadFormat, setDownloadFormat] = useState<DownloadFormat>('png');
  const [isDownloading, setIsDownloading] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const fileName = formatFileName(prompt, downloadFormat);
      await downloadImage(imageUrl, fileName, downloadFormat);
    } catch (error) {
      console.error('下載失敗:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyUrl = async () => {
    try {
      await copyToClipboard(imageUrl);
      // 這裡可以加入通知使用者複製成功的 toast
    } catch (error) {
      console.error('複製連結失敗:', error);
    }
  };

  const handleCopyPrompt = async () => {
    try {
      await copyToClipboard(revisedPrompt || prompt);
      // 這裡可以加入通知使用者複製成功的 toast
    } catch (error) {
      console.error('複製提示詞失敗:', error);
    }
  };

  const handleEditSave = (editedImage: File, mask: File) => {
    if (onEdit && editPrompt.trim()) {
      onEdit(editedImage, mask, editPrompt);
      setIsEditing(false);
      setEditPrompt('');
    }
  };

  const handleVariation = async () => {
    if (!onVariation) return;
    
    try {
      // 將圖片 URL 轉換為 File
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'image.png', { type: 'image/png' });
      onVariation(file);
    } catch (error) {
      console.error('生成變化失敗:', error);
    }
  };

  if (isEditing) {
    return (
      <div className={className}>
        <ImageEditor
          imageUrl={imageUrl}
          onSave={handleEditSave}
          onCancel={() => setIsEditing(false)}
        />
        
        {/* 編輯提示詞輸入 */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            編輯描述 (描述您想要在標記區域看到的內容)
          </label>
          <textarea
            value={editPrompt}
            onChange={(e) => setEditPrompt(e.target.value)}
            placeholder="例如：一朵藍色的雲朵，現代風格"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`card p-6 ${className}`}>
      <div className="space-y-4">
        {/* 圖片標題 */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">生成結果</h3>
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>

        {/* 圖片顯示區 */}
        <div className="relative group">
          <div className="relative rounded-lg overflow-hidden bg-gray-100">
            <img
              src={imageUrl}
              alt={prompt}
              className="w-full h-auto max-h-96 object-contain"
              onLoad={() => setShowActions(true)}
            />
            
            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  <span className="text-sm text-gray-600">正在生成圖片...</span>
                </div>
              </div>
            )}
          </div>

          {/* 滑鼠懸停時的快速動作 */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex space-x-2">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                title="下載圖片"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
              
              <button
                onClick={handleCopyUrl}
                className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                title="複製圖片連結"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* 提示詞顯示 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">提示詞</span>
            <button
              onClick={handleCopyPrompt}
              className="text-xs text-gray-500 hover:text-gray-700 flex items-center space-x-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>複製</span>
            </button>
          </div>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            {prompt}
          </p>
          
          {/* DALL·E 3 的修訂提示詞 */}
          {revisedPrompt && revisedPrompt !== prompt && (
            <>
              <div className="text-sm font-medium text-gray-700 mt-3">
                AI 修訂後的提示詞
              </div>
              <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                {revisedPrompt}
              </p>
            </>
          )}
        </div>

        {/* 動作按鈕區 */}
        {showActions && (
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
            {/* 下載設定 */}
            <div className="flex items-center space-x-3 flex-1">
              <label className="text-sm text-gray-600">格式:</label>
              <select
                value={downloadFormat}
                onChange={(e) => setDownloadFormat(e.target.value as DownloadFormat)}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
                <option value="webp">WebP</option>
              </select>
            </div>

            {/* 按鈕群組 */}
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleDownload}
                loading={isDownloading}
                disabled={isDownloading}
                variant="primary"
                size="sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                下載圖片
              </Button>
              
              {/* DALL·E 2 編輯功能 */}
              {model === 'dall-e-2' && onEdit && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="secondary"
                  size="sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  編輯圖片
                </Button>
              )}
              
              {/* DALL·E 2 變化功能 */}
              {model === 'dall-e-2' && onVariation && (
                <Button
                  onClick={handleVariation}
                  variant="secondary"
                  size="sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  生成變化
                </Button>
              )}
              
              {onRegenerate && (
                <Button
                  onClick={onRegenerate}
                  variant="secondary"
                  size="sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  重新生成
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
