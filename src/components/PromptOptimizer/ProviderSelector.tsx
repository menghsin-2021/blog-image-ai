import React from 'react';
import {
  OPTIMIZATION_PROVIDERS,
  PROVIDER_INFO,
  PERPLEXITY_MODELS,
  PERPLEXITY_MODEL_INFO,
  OptimizationProvider,
  PerplexityModel,
} from '../../utils/perplexityConstants';

interface ProviderSelectorProps {
  selectedProvider: OptimizationProvider;
  selectedModel?: PerplexityModel | string;
  onProviderChange: (provider: OptimizationProvider) => void;
  onModelChange: (model: PerplexityModel | string) => void;
  estimatedCost?: number;
  className?: string;
}

export const ProviderSelector: React.FC<ProviderSelectorProps> = ({
  selectedProvider,
  selectedModel,
  onProviderChange,
  onModelChange,
  estimatedCost,
  className = '',
}) => {
  const renderPerplexityModelSelector = () => {
    if (selectedProvider !== OPTIMIZATION_PROVIDERS.PERPLEXITY) return null;

    return (
      <div className="mt-4 space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          選擇 Perplexity 模型
        </label>
        <div className="grid gap-3">
          {Object.values(PERPLEXITY_MODELS).map((model) => {
            const modelInfo = PERPLEXITY_MODEL_INFO[model];
            const isSelected = selectedModel === model;
            
            return (
              <div
                key={model}
                className={`
                  relative rounded-lg border-2 cursor-pointer transition-all duration-200
                  ${isSelected 
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
                onClick={() => onModelChange(model)}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{modelInfo.icon}</span>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {modelInfo.name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {modelInfo.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        輸入: ${modelInfo.inputCost}/M tokens
                      </div>
                      <div className="text-sm text-gray-500">
                        輸出: ${modelInfo.outputCost}/M tokens
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-1">
                    {modelInfo.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <div className="rounded-full bg-blue-500 p-1">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          選擇 AI 最佳化服務
        </label>
        <div className="grid gap-3">
          {Object.values(OPTIMIZATION_PROVIDERS).map((provider) => {
            const providerInfo = PROVIDER_INFO[provider];
            const isSelected = selectedProvider === provider;
            
            return (
              <div
                key={provider}
                className={`
                  relative rounded-lg border-2 cursor-pointer transition-all duration-200
                  ${isSelected 
                    ? 'border-green-500 bg-green-50 ring-2 ring-green-200' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                  ${providerInfo.isDefault ? 'ring-1 ring-blue-200' : ''}
                `}
                onClick={() => onProviderChange(provider)}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{providerInfo.icon}</span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">
                            {providerInfo.name}
                          </h4>
                          {providerInfo.isDefault && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              推薦
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {providerInfo.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-1">
                    {providerInfo.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <div className="rounded-full bg-green-500 p-1">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {renderPerplexityModelSelector()}

      {estimatedCost !== undefined && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2">
            <span className="text-blue-600">💰</span>
            <span className="text-sm font-medium text-blue-900">
              預估成本: ${estimatedCost.toFixed(4)}
            </span>
          </div>
          <p className="text-xs text-blue-700 mt-1">
            實際成本可能根據內容長度和複雜度有所變化
          </p>
        </div>
      )}
    </div>
  );
};
