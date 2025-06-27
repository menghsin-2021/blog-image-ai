import React from 'react';
import { AspectRatio as AspectRatioType } from '../types';

interface AspectRatioSelectorProps {
  options: AspectRatioType[];
  selected: AspectRatioType;
  onSelect: (ratio: AspectRatioType) => void;
  className?: string;
}

/**
 * 圖片比例選擇器元件
 */
export const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({
  options,
  selected,
  onSelect,
  className = '',
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">圖片比例</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {options.map(option => (
          <button
            key={option.value}
            onClick={() => onSelect(option)}
            className={`
              relative p-4 rounded-lg border-2 transition-all duration-200 text-left
              ${
                selected.value === option.value
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
              }
            `}
          >
            <div className="flex flex-col">
              <span className="font-medium text-sm">{option.label}</span>
              <span className="text-xs text-gray-500 mt-1">
                {option.width} × {option.height}
              </span>
            </div>

            {/* 視覺化比例預覽 */}
            <div className="mt-3 flex justify-center">
              <div
                className={`
                  border-2 rounded-sm
                  ${selected.value === option.value ? 'border-primary-400' : 'border-gray-300'}
                `}
                style={{
                  width: `${Math.min(option.ratio * 20, 40)}px`,
                  height: `${Math.min(20 / option.ratio, 40)}px`,
                  maxWidth: '40px',
                  maxHeight: '40px',
                }}
              />
            </div>

            {selected.value === option.value && (
              <div className="absolute top-2 right-2">
                <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
