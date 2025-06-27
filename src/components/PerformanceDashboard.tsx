import React, { useState } from 'react';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';

export const PerformanceDashboard: React.FC = () => {
  const {
    metrics,
    events,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    getPerformanceScore,
    getPerformanceRecommendations
  } = usePerformanceMonitor();

  const [isExpanded, setIsExpanded] = useState(false);

  const performanceScore = getPerformanceScore();
  const recommendations = getPerformanceRecommendations();

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatTime = (time: number | undefined) => {
    if (!time) return 'N/A';
    return time < 1000 ? `${Math.round(time)}ms` : `${(time / 1000).toFixed(2)}s`;
  };

  const formatMemory = (memory: number | undefined) => {
    if (!memory) return 'N/A';
    return `${memory.toFixed(1)} MB`;
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors flex items-center"
        >
          📊 效能監控
          <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getScoreColor(performanceScore)}`}>
            {Math.round(performanceScore)}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-xl border max-w-md w-96">
      {/* 標題列 */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">效能監控</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              isMonitoring
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {isMonitoring ? '停止' : '開始'}
          </button>
          <button
            onClick={() => setIsExpanded(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="p-4 max-h-96 overflow-y-auto">
        {/* 總體評分 */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">總體評分</span>
            <span className={`px-2 py-1 rounded text-sm font-medium ${getScoreColor(performanceScore)}`}>
              {Math.round(performanceScore)}/100
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                performanceScore >= 90 ? 'bg-green-500' :
                performanceScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${performanceScore}%` }}
            />
          </div>
        </div>

        {/* 核心指標 */}
        <div className="space-y-3 mb-4">
          <h4 className="text-sm font-medium text-gray-900">核心指標</h4>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <MetricCard
              label="FCP"
              value={formatTime(metrics.firstContentfulPaint)}
              good={!metrics.firstContentfulPaint || metrics.firstContentfulPaint < 1800}
            />
            <MetricCard
              label="LCP"
              value={formatTime(metrics.largestContentfulPaint)}
              good={!metrics.largestContentfulPaint || metrics.largestContentfulPaint < 2500}
            />
            <MetricCard
              label="API 回應"
              value={formatTime(metrics.apiResponseTime)}
              good={metrics.apiResponseTime < 1000}
            />
            <MetricCard
              label="快取命中率"
              value={`${Math.round(metrics.cacheHitRate)}%`}
              good={metrics.cacheHitRate > 80}
            />
          </div>
        </div>

        {/* 應用程式指標 */}
        <div className="space-y-3 mb-4">
          <h4 className="text-sm font-medium text-gray-900">應用程式指標</h4>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <MetricCard
              label="提示詞最佳化"
              value={formatTime(metrics.promptOptimizationTime)}
              good={metrics.promptOptimizationTime < 3000}
            />
            <MetricCard
              label="圖片生成"
              value={formatTime(metrics.imageGenerationTime)}
              good={metrics.imageGenerationTime < 30000}
            />
            <MetricCard
              label="記憶體使用"
              value={formatMemory(metrics.memoryUsage)}
              good={!metrics.memoryUsage || metrics.memoryUsage < 100}
            />
            <MetricCard
              label="渲染時間"
              value={formatTime(metrics.renderTime)}
              good={metrics.renderTime < 100}
            />
          </div>
        </div>

        {/* 最佳化建議 */}
        {recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">最佳化建議</h4>
            <ul className="space-y-1">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="text-xs text-gray-600 flex items-start">
                  <span className="text-yellow-500 mr-1">⚠️</span>
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 最近事件 */}
        {events.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-medium text-gray-900 mb-2">最近事件</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {events.slice(-5).reverse().map((event, index) => (
                <div key={index} className="text-xs text-gray-600 flex items-center justify-between">
                  <span className="truncate">{event.name}</span>
                  <span className="font-mono ml-2">{formatTime(event.duration)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 指標卡片元件
interface MetricCardProps {
  label: string;
  value: string;
  good: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, good }) => (
  <div className={`p-2 rounded border ${good ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
    <div className="text-xs text-gray-500">{label}</div>
    <div className={`font-mono text-sm ${good ? 'text-green-700' : 'text-red-700'}`}>
      {value}
    </div>
  </div>
);
