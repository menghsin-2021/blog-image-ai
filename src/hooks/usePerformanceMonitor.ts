import { useState, useEffect, useCallback, useRef } from 'react';

interface PerformanceMetrics {
  // Web Vitals
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
  firstInputDelay?: number;
  
  // 自訂指標
  loadTime: number;
  renderTime: number;
  apiResponseTime: number;
  memoryUsage?: number;
  
  // 應用程式特定指標
  promptOptimizationTime: number;
  imageGenerationTime: number;
  cacheHitRate: number;
}

interface PerformanceEvent {
  type: 'page-load' | 'component-render' | 'api-call' | 'user-interaction';
  name: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    apiResponseTime: 0,
    promptOptimizationTime: 0,
    imageGenerationTime: 0,
    cacheHitRate: 0
  });
  
  const [events, setEvents] = useState<PerformanceEvent[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  
  const observerRef = useRef<PerformanceObserver | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // 初始化效能監控
  useEffect(() => {
    if (!isMonitoring) return;

    // 監控 Web Vitals
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            setMetrics(prev => ({
              ...prev,
              loadTime: navEntry.loadEventEnd - navEntry.fetchStart
            }));
          }
          
          if (entry.entryType === 'paint') {
            if (entry.name === 'first-contentful-paint') {
              setMetrics(prev => ({
                ...prev,
                firstContentfulPaint: entry.startTime
              }));
            }
          }
          
          if (entry.entryType === 'largest-contentful-paint') {
            setMetrics(prev => ({
              ...prev,
              largestContentfulPaint: entry.startTime
            }));
          }
        });
      });

      observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
      observerRef.current = observer;
    }

    // 監控記憶體使用（如果支援）
    const monitorMemory = () => {
      if ('memory' in performance) {
        const memInfo = (performance as any).memory;
        setMetrics(prev => ({
          ...prev,
          memoryUsage: memInfo.usedJSHeapSize / 1024 / 1024 // MB
        }));
      }
    };

    const memoryInterval = setInterval(monitorMemory, 5000);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      clearInterval(memoryInterval);
    };
  }, [isMonitoring]);

  // 開始監控
  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
    startTimeRef.current = Date.now();
  }, []);

  // 停止監控
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
  }, []);

  // 記錄效能事件
  const recordEvent = useCallback((event: Omit<PerformanceEvent, 'timestamp'>) => {
    const newEvent: PerformanceEvent = {
      ...event,
      timestamp: Date.now()
    };
    
    setEvents(prev => [...prev.slice(-99), newEvent]); // 保留最近 100 個事件
  }, []);

  // 測量 API 呼叫時間
  const measureApiCall = useCallback(async <T,>(
    name: string,
    apiCall: () => Promise<T>
  ): Promise<T> => {
    const startTime = performance.now();
    
    try {
      const result = await apiCall();
      const duration = performance.now() - startTime;
      
      recordEvent({
        type: 'api-call',
        name,
        duration,
        metadata: { success: true }
      });
      
      setMetrics(prev => ({
        ...prev,
        apiResponseTime: (prev.apiResponseTime + duration) / 2 // 移動平均
      }));
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      recordEvent({
        type: 'api-call',
        name,
        duration,
        metadata: { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
      });
      
      throw error;
    }
  }, [recordEvent]);

  // 測量渲染時間
  const measureRender = useCallback((componentName: string, renderFn: () => void) => {
    const startTime = performance.now();
    
    renderFn();
    
    const duration = performance.now() - startTime;
    
    recordEvent({
      type: 'component-render',
      name: componentName,
      duration
    });
    
    setMetrics(prev => ({
      ...prev,
      renderTime: (prev.renderTime + duration) / 2
    }));
  }, [recordEvent]);

  // 測量提示詞最佳化時間
  const measurePromptOptimization = useCallback(async <T,>(
    optimizationFn: () => Promise<T>
  ): Promise<T> => {
    const startTime = performance.now();
    
    try {
      const result = await optimizationFn();
      const duration = performance.now() - startTime;
      
      recordEvent({
        type: 'api-call',
        name: 'prompt-optimization',
        duration
      });
      
      setMetrics(prev => ({
        ...prev,
        promptOptimizationTime: duration
      }));
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      recordEvent({
        type: 'api-call',
        name: 'prompt-optimization-error',
        duration,
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
      
      throw error;
    }
  }, [recordEvent]);

  // 測量圖片生成時間
  const measureImageGeneration = useCallback(async <T,>(
    generationFn: () => Promise<T>
  ): Promise<T> => {
    const startTime = performance.now();
    
    try {
      const result = await generationFn();
      const duration = performance.now() - startTime;
      
      recordEvent({
        type: 'api-call',
        name: 'image-generation',
        duration
      });
      
      setMetrics(prev => ({
        ...prev,
        imageGenerationTime: duration
      }));
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      recordEvent({
        type: 'api-call',
        name: 'image-generation-error',
        duration,
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
      
      throw error;
    }
  }, [recordEvent]);

  // 更新快取命中率
  const updateCacheHitRate = useCallback((hits: number, total: number) => {
    const hitRate = total > 0 ? (hits / total) * 100 : 0;
    
    setMetrics(prev => ({
      ...prev,
      cacheHitRate: hitRate
    }));
  }, []);

  // 取得效能評分
  const getPerformanceScore = useCallback((): number => {
    let score = 100;
    
    // LCP 評分 (< 2.5s = 好, < 4s = 需改進, >= 4s = 差)
    if (metrics.largestContentfulPaint) {
      if (metrics.largestContentfulPaint > 4000) score -= 30;
      else if (metrics.largestContentfulPaint > 2500) score -= 15;
    }
    
    // FCP 評分 (< 1.8s = 好, < 3s = 需改進, >= 3s = 差)
    if (metrics.firstContentfulPaint) {
      if (metrics.firstContentfulPaint > 3000) score -= 20;
      else if (metrics.firstContentfulPaint > 1800) score -= 10;
    }
    
    // API 回應時間評分 (< 1s = 好, < 3s = 需改進, >= 3s = 差)
    if (metrics.apiResponseTime > 3000) score -= 25;
    else if (metrics.apiResponseTime > 1000) score -= 10;
    
    // 快取命中率評分 (> 80% = 好, > 50% = 需改進, <= 50% = 差)
    if (metrics.cacheHitRate < 50) score -= 15;
    else if (metrics.cacheHitRate < 80) score -= 5;
    
    return Math.max(0, score);
  }, [metrics]);

  // 取得效能建議
  const getPerformanceRecommendations = useCallback((): string[] => {
    const recommendations: string[] = [];
    
    if (metrics.largestContentfulPaint && metrics.largestContentfulPaint > 2500) {
      recommendations.push('考慮最佳化圖片載入或使用延遲載入');
    }
    
    if (metrics.firstContentfulPaint && metrics.firstContentfulPaint > 1800) {
      recommendations.push('考慮減少關鍵渲染路徑上的資源');
    }
    
    if (metrics.apiResponseTime > 1000) {
      recommendations.push('考慮實作快取機制或最佳化 API 呼叫');
    }
    
    if (metrics.cacheHitRate < 80) {
      recommendations.push('考慮改善快取策略以提高命中率');
    }
    
    if (metrics.memoryUsage && metrics.memoryUsage > 100) {
      recommendations.push('考慮最佳化記憶體使用，避免記憶體洩漏');
    }
    
    return recommendations;
  }, [metrics]);

  return {
    metrics,
    events,
    isMonitoring,
    
    // 控制方法
    startMonitoring,
    stopMonitoring,
    
    // 測量方法
    measureApiCall,
    measureRender,
    measurePromptOptimization,
    measureImageGeneration,
    updateCacheHitRate,
    recordEvent,
    
    // 分析方法
    getPerformanceScore,
    getPerformanceRecommendations
  };
};
