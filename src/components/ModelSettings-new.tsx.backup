import React from 'react';
import { DalleModel, ImageQuality, ImageStyle, OutputFormat, ModerationLevel } from '../types';
import { 
  DALLE_MODELS, 
  IMAGE_QUALITIES, 
  IMAGE_STYLES, 
  OUTPUT_FORMATS, 
  MODERATION_LEVELS 
} from '../utils/constants';

interface ModelSettingsProps {
  model: DalleModel;
  quality: ImageQuality;
  style: ImageStyle;
  outputFormat?: OutputFormat;
  compression?: number;
  moderation?: ModerationLevel;
  onModelChange: (model: DalleModel) => void;
  onQualityChange: (quality: ImageQuality) => void;
  onStyleChange: (style: ImageStyle) => void;
  onOutputFormatChange?: (format: OutputFormat) => void;
  onCompressionChange?: (compression: number) => void;
  onModerationChange?: (moderation: ModerationLevel) => void;
  className?: string;
}

/**
 * AI 模型設定元件
 */
export const ModelSettings: React.FC<ModelSettingsProps> = ({
  model,
  quality,
  style,
  outputFormat = 'png',
  compression = 100,
  moderation = 'auto',
  onModelChange,
  onQualityChange,
  onStyleChange,
  onOutputFormatChange,
  onCompressionChange,
  onModerationChange,
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

      {/* 風格設定 (僅 DALL·E 3) */}
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

      {/* GPT-Image-1 專用設定 */}
      {model === 'gpt-image-1' && (
        <>
          {/* 輸出格式 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              輸出格式
            </label>
            <select
              value={outputFormat}
              onChange={(e) => onOutputFormatChange?.(e.target.value as OutputFormat)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
            >
              {OUTPUT_FORMATS.map((format) => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </select>
          </div>

          {/* 壓縮等級 (僅 JPEG/WebP) */}
          {(outputFormat === 'jpeg' || outputFormat === 'webp') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                壓縮等級：{compression}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={compression}
                onChange={(e) => onCompressionChange?.(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>最小檔案</span>
                <span>最高品質</span>
              </div>
            </div>
          )}

          {/* 內容審核 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              內容審核
            </label>
            <div className="space-y-2">
              {MODERATION_LEVELS.map((moderationOption) => (
                <div key={moderationOption.value} className="flex items-start">
                  <input
                    id={`moderation-${moderationOption.value}`}
                    name="moderation"
                    type="radio"
                    checked={moderation === moderationOption.value}
                    onChange={() => onModerationChange?.(moderationOption.value)}
                    className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <div className="ml-3">
                    <label
                      htmlFor={`moderation-${moderationOption.value}`}
                      className="block text-sm font-medium text-gray-900 cursor-pointer"
                    >
                      {moderationOption.label}
                    </label>
                    <p className="text-xs text-gray-500">
                      {moderationOption.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ModelSettings;
