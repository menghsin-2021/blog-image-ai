import React from 'react';

interface SkeletonProps {
  className?: string;
  height?: string | number;
  width?: string | number;
  rounded?: boolean;
  animated?: boolean;
}

// 基礎骨架元件
export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  height = '1rem',
  width = '100%',
  rounded = false,
  animated = true,
}) => {
  const baseClasses = 'bg-gray-200';
  const animationClasses = animated ? 'animate-pulse' : '';
  const roundedClasses = rounded ? 'rounded-full' : 'rounded';

  const style = {
    height: typeof height === 'number' ? `${height}px` : height,
    width: typeof width === 'number' ? `${width}px` : width,
  };

  return (
    <div
      className={`${baseClasses} ${animationClasses} ${roundedClasses} ${className}`}
      style={style}
    />
  );
};

// 文字行骨架
export const SkeletonText: React.FC<{
  lines?: number;
  className?: string;
}> = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} height="1rem" width={index === lines - 1 ? '75%' : '100%'} />
      ))}
    </div>
  );
};

// 提示詞最佳化載入骨架
export const PromptOptimizerSkeleton: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* 標題骨架 */}
      <div className="text-center space-y-3">
        <Skeleton height="2rem" width="60%" className="mx-auto" />
        <Skeleton height="1rem" width="80%" className="mx-auto" />
      </div>

      {/* 進度指示器骨架 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <Skeleton height="1rem" width="30%" />
          <Skeleton height="1rem" width="15%" />
        </div>
        <Skeleton height="0.5rem" width="100%" rounded />
      </div>

      {/* 內容分析骨架 */}
      <div className="bg-blue-50 rounded-lg p-5">
        <div className="space-y-3">
          <Skeleton height="1.5rem" width="40%" />
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton height="1rem" width="50%" />
              <SkeletonText lines={3} />
            </div>
            <div className="space-y-2">
              <Skeleton height="1rem" width="40%" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} height="1.5rem" width={`${60 + index * 10}px`} rounded />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 最佳化提示詞骨架 */}
      <div className="bg-white border rounded-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <Skeleton height="1.5rem" width="30%" />
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Skeleton height="2rem" width="60px" rounded />
              <Skeleton height="2rem" width="80px" rounded className="ml-1" />
            </div>
            <div className="flex space-x-2">
              <Skeleton height="1rem" width="60px" />
              <Skeleton height="1rem" width="40px" />
              <Skeleton height="1rem" width="50px" />
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <SkeletonText lines={4} />
          </div>
        </div>
      </div>

      {/* 風格建議骨架 */}
      <div className="bg-purple-50 rounded-lg p-5">
        <Skeleton height="1.5rem" width="30%" className="mb-3" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-start">
              <Skeleton height="1rem" width="1rem" className="mr-2 mt-0.5" rounded />
              <Skeleton height="1rem" width={`${70 + index * 10}%`} />
            </div>
          ))}
        </div>
      </div>

      {/* 操作按鈕骨架 */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
        <Skeleton height="3rem" className="flex-1" rounded />
        <Skeleton height="3rem" className="flex-1" rounded />
      </div>
    </div>
  );
};

// 內容輸入載入骨架
export const ContentInputSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <Skeleton height="1rem" width="80%" />

      {/* 文章標題骨架 */}
      <div>
        <Skeleton height="1rem" width="20%" className="mb-2" />
        <Skeleton height="2.5rem" width="100%" rounded />
      </div>

      {/* 文章內容骨架 */}
      <div>
        <Skeleton height="1rem" width="25%" className="mb-2" />
        <Skeleton height="8rem" width="100%" rounded />
      </div>

      {/* 關鍵字骨架 */}
      <div>
        <Skeleton height="1rem" width="15%" className="mb-2" />
        <Skeleton height="2.5rem" width="100%" rounded />
        <Skeleton height="0.75rem" width="60%" className="mt-1" />
      </div>

      {/* 進階選項按鈕骨架 */}
      <Skeleton height="1.5rem" width="30%" />

      {/* 分析按鈕骨架 */}
      <Skeleton height="3rem" width="100%" rounded />
    </div>
  );
};
