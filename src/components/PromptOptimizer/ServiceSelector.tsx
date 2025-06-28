import React from 'react';
import { OptimizationProvider } from '../../types/promptOptimizer';

interface ServiceOption {
  provider: OptimizationProvider;
  icon: string;
  title: string;
  description: string;
  features: string[];
  cost: string;
  isRecommended?: boolean;
}

interface ServiceSelectorProps {
  selectedService: OptimizationProvider | null;
  onServiceSelect: (provider: OptimizationProvider) => void;
  className?: string;
}

const SERVICE_OPTIONS: ServiceOption[] = [
  {
    provider: 'openai',
    icon: '🤖',
    title: 'OpenAI GPT-4o',
    description: '深度內容分析，詳細技術參數建議',
    features: ['內容分析', '技術參數', '風格建議'],
    cost: '免費使用',
    isRecommended: true,
  },
  {
    provider: 'perplexity',
    icon: '🌐',
    title: 'Perplexity AI',
    description: '即時網路資訊，最新趨勢整合',
    features: ['網路搜尋', '引用來源', '即時資訊'],
    cost: '依使用量計費',
  },
];

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  selectedService,
  onServiceSelect,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">選擇 AI 最佳化服務</h2>
        <p className="text-gray-600">選擇最適合您需求的提示詞最佳化服務</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SERVICE_OPTIONS.map(option => (
          <ServiceOptionCard
            key={option.provider}
            option={option}
            isSelected={selectedService === option.provider}
            onSelect={() => onServiceSelect(option.provider)}
          />
        ))}
      </div>
    </div>
  );
};

interface ServiceOptionCardProps {
  option: ServiceOption;
  isSelected: boolean;
  onSelect: () => void;
}

const ServiceOptionCard: React.FC<ServiceOptionCardProps> = ({ option, isSelected, onSelect }) => {
  return (
    <div
      className={`
        relative p-6 rounded-lg border-2 cursor-pointer transition-all duration-200
        ${
          isSelected
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
        }
      `}
      onClick={onSelect}
    >
      {/* 推薦標籤 */}
      {option.isRecommended && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
          推薦
        </div>
      )}

      {/* 已選擇指示器 */}
      {isSelected && (
        <div className="absolute top-4 right-4">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      )}

      {/* 服務資訊 */}
      <div className="flex items-start space-x-4">
        <div className="text-4xl">{option.icon}</div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{option.title}</h3>

          <p className="text-gray-600 text-sm mb-3">{option.description}</p>

          {/* 功能特色 */}
          <div className="flex flex-wrap gap-2 mb-3">
            {option.features.map((feature, index) => (
              <span
                key={index}
                className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
              >
                {feature}
              </span>
            ))}
          </div>

          {/* 成本資訊 */}
          <div className="flex items-center">
            <span className="text-xs text-gray-500">成本：</span>
            <span className="text-sm font-medium text-gray-700 ml-1">{option.cost}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
