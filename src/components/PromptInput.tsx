import React, { useState } from 'react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * 提示詞輸入元件
 */
export const PromptInput: React.FC<PromptInputProps> = ({
  value,
  onChange,
  placeholder = '請描述您想要生成的圖片...',
  disabled = false,
  className = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const characterCount = value.length;

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        圖片描述
      </label>
      
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          rows={6}
          className={`
            w-full px-4 py-3 border rounded-lg resize-y transition-all duration-200
            ${isFocused 
              ? 'border-primary-500 ring-2 ring-primary-200' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${disabled 
              ? 'bg-gray-50 text-gray-500 cursor-not-allowed' 
              : 'bg-white text-gray-900'
            }
            focus:outline-none
          `}
        />
        
        {/* 字數統計 */}
        <div className="absolute bottom-3 right-3">
          <span className="text-xs text-gray-400">
            {characterCount} 個字元
          </span>
        </div>
      </div>
      
      {/* 提示文字 */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>💡 描述建議：包含主題、風格、顏色、構圖等詳細資訊，可以盡量詳細描述</p>
        <p>📝 範例：「現代扁平風格的雲端運算示意圖，藍色調，包含伺服器、網路連線和資料傳輸元素，背景是漸層藍色，整體風格簡潔專業，適合技術部落格使用」</p>
      </div>
      
      {/* 快速建議標籤 */}
      <div className="flex flex-wrap gap-2">
        {[
          '技術示意圖',
          '程式碼概念',
          '資料流程',
          '系統架構',
          '使用者介面',
          '網路拓撲'
        ].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => {
              const newValue = value ? `${value}, ${suggestion}` : suggestion;
              onChange(newValue);
            }}
            disabled={disabled}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};
