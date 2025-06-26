import React from 'react';
import { DalleModel, ImageQuality, ImageStyle } from '../types';
import { 
  DALLE_MODELS, 
  IMAGE_QUALITIES, 
  IMAGE_STYLES
} from '../utils/constants';

interface ModelSettingsProps {
  model: DalleModel;
  quality: ImageQuality;
  style: ImageStyle;
  onModelChange: (model: DalleModel) => void;
  onQualityChange: (quality: ImageQuality) => void;
  onStyleChange: (style: ImageStyle) => void;
  className?: string;
}

/**
 * AI 模型設定元件
 */
export const ModelSettings: React.FC<ModelSettingsProps> = ({
  model,
  quality,
  style,
  onModelChange,
  onQualityChange,
  onStyleChange,
  className = ''
}) => {
  // 根據模型篩選可用的品質選項
  const availableQualities = IMAGE_QUALITIES.filter(q => 
    q.models.includes(model)
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 模型選擇 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          AI 模型
        </label>
        <div className="space-y-2">
          {DALLE_MODELS.map((modelOption) => (
            <div key={modelOption.value} className="flex items-start">
              <input
                id={`model-${modelOption.value}`}
                name="model"
                type="radio"
                checked={model === modelOption.value}
                onChange={() => onModelChange(modelOption.value)}
                className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <div className="ml-3">
                <label
                  htmlFor={`model-${modelOption.value}`}
                  className="block text-sm font-medium text-gray-900 cursor-pointer"
                >
                  {modelOption.label}
                </label>
                <p className="text-xs text-gray-500">
                  {modelOption.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 品質設定 */}
      {availableQualities.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            圖片品質
          </label>
          <select
            value={quality}
            onChange={(e) => onQualityChange(e.target.value as ImageQuality)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
          >
            {availableQualities.map((qualityOption) => (
              <option key={qualityOption.value} value={qualityOption.value}>
                {qualityOption.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 風格設定 (僅 DALL·E 3 支援，GPT-image-1 不支援) */}
      {model === 'dall-e-3' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            圖片風格
          </label>
          <div className="space-y-2">
            {IMAGE_STYLES.map((styleOption) => (
              <div key={styleOption.value} className="flex items-start">
                <input
                  id={`style-${styleOption.value}`}
                  name="style"
                  type="radio"
                  checked={style === styleOption.value}
                  onChange={() => onStyleChange(styleOption.value)}
                  className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <div className="ml-3">
                  <label
                    htmlFor={`style-${styleOption.value}`}
                    className="block text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    {styleOption.label}
                  </label>
                  <p className="text-xs text-gray-500">
                    {styleOption.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSettings;
