import React from 'react';

interface LoadingProgressProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'optimizing' | 'analyzing';
}

export const LoadingProgress: React.FC<LoadingProgressProps> = ({
  progress,
  label,
  showPercentage = true,
  variant = 'default'
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'optimizing':
        return {
          bg: 'bg-gradient-to-r from-purple-500 to-pink-500',
          text: 'text-purple-700',
          container: 'bg-purple-50 border-purple-200'
        };
      case 'analyzing':
        return {
          bg: 'bg-gradient-to-r from-blue-500 to-cyan-500',
          text: 'text-blue-700',
          container: 'bg-blue-50 border-blue-200'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-indigo-500 to-blue-500',
          text: 'text-indigo-700',
          container: 'bg-indigo-50 border-indigo-200'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`rounded-lg p-4 border ${styles.container}`}>
      <div className="flex items-center justify-between mb-2">
        {label && (
          <span className={`text-sm font-medium ${styles.text}`}>
            {label}
          </span>
        )}
        {showPercentage && (
          <span className={`text-sm font-medium ${styles.text}`}>
            {Math.round(progress)}%
          </span>
        )}
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-300 ease-out ${styles.bg}`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
};

interface LoadingStageProps {
  stages: {
    name: string;
    status: 'pending' | 'active' | 'complete' | 'error';
  }[];
  currentStage?: number;
}

export const LoadingStages: React.FC<LoadingStageProps> = ({ stages }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return (
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'active':
        return (
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
          </div>
        );
      case 'error':
        return (
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return <div className="w-6 h-6 bg-gray-300 rounded-full" />;
    }
  };

  return (
    <div className="space-y-3">
      {stages.map((stage, index) => (
        <div key={index} className="flex items-center">
          {getStatusIcon(stage.status)}
          <span className={`ml-3 text-sm ${
            stage.status === 'active' ? 'text-blue-700 font-medium' :
            stage.status === 'complete' ? 'text-green-700' :
            stage.status === 'error' ? 'text-red-700' :
            'text-gray-500'
          }`}>
            {stage.name}
          </span>
        </div>
      ))}
    </div>
  );
};

// 智慧載入動畫 - 基於內容類型調整動畫
interface SmartLoadingProps {
  type: 'content-analysis' | 'prompt-optimization' | 'template-loading';
  message?: string;
}

export const SmartLoading: React.FC<SmartLoadingProps> = ({ type, message }) => {
  const getLoadingConfig = () => {
    switch (type) {
      case 'content-analysis':
        return {
          icon: '🔍',
          defaultMessage: '正在分析內容結構...',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50'
        };
      case 'prompt-optimization':
        return {
          icon: '✨',
          defaultMessage: '正在最佳化提示詞...',
          color: 'text-purple-600',
          bgColor: 'bg-purple-50'
        };
      case 'template-loading':
        return {
          icon: '📋',
          defaultMessage: '正在載入模板...',
          color: 'text-green-600',
          bgColor: 'bg-green-50'
        };
      default:
        return {
          icon: '⏳',
          defaultMessage: '處理中...',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50'
        };
    }
  };

  const config = getLoadingConfig();

  return (
    <div className={`flex items-center justify-center p-8 rounded-lg ${config.bgColor}`}>
      <div className="text-center">
        <div className="text-4xl mb-3 animate-bounce">
          {config.icon}
        </div>
        <p className={`${config.color} font-medium`}>
          {message || config.defaultMessage}
        </p>
        <div className="flex justify-center mt-3">
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${config.color.replace('text-', 'bg-')} animate-pulse`}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
