// 快取系統容器化測試工具
// 專門用於在 Docker 環境中測試快取效能和功能

// 快取效能測試介面
export interface CachePerformanceMetrics {
  hitRate: number;          // 快取命中率
  averageResponseTime: number; // 平均回應時間 (ms)
  memoryUsage: number;      // 記憶體使用 (MB)
  totalOperations: number;  // 總操作次數
  cacheSize: number;        // 快取項目數量
}

// 容器環境快取測試類別
export class ContainerCacheTest {
  private startTime: number = 0;
  private operations: number = 0;
  private hits: number = 0;
  private misses: number = 0;
  private responseTimes: number[] = [];

  // 開始效能測試
  startPerformanceTest(): void {
    this.startTime = Date.now();
    this.operations = 0;
    this.hits = 0;
    this.misses = 0;
    this.responseTimes = [];
    console.log('🐳 開始容器化快取效能測試...');
  }

  // 記錄快取操作
  recordCacheOperation(isHit: boolean, responseTime: number): void {
    this.operations++;
    this.responseTimes.push(responseTime);
    
    if (isHit) {
      this.hits++;
      console.log(`✅ 快取命中 - 回應時間: ${responseTime}ms`);
    } else {
      this.misses++;
      console.log(`❌ 快取未命中 - 回應時間: ${responseTime}ms`);
    }
  }

  // 取得效能報告
  getPerformanceReport(): CachePerformanceMetrics {
    const averageResponseTime = this.responseTimes.length > 0 
      ? this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length 
      : 0;

    const hitRate = this.operations > 0 ? (this.hits / this.operations) * 100 : 0;

    const memoryUsage = this.estimateMemoryUsage();

    return {
      hitRate: Math.round(hitRate * 100) / 100,
      averageResponseTime: Math.round(averageResponseTime * 100) / 100,
      memoryUsage: Math.round(memoryUsage * 100) / 100,
      totalOperations: this.operations,
      cacheSize: this.hits + this.misses
    };
  }

  // 估算記憶體使用量 (粗略計算)
  private estimateMemoryUsage(): number {
    // 假設每個快取項目約佔用 10KB
    const avgItemSize = 10; // KB
    const totalItems = this.hits + this.misses;
    return (totalItems * avgItemSize) / 1024; // 轉換為 MB
  }

  // 輸出詳細測試報告
  printDetailedReport(): void {
    const report = this.getPerformanceReport();
    const testDuration = (Date.now() - this.startTime) / 1000;

    console.log('\n🐳 容器化快取效能測試報告');
    console.log('================================');
    console.log(`測試時長: ${testDuration}s`);
    console.log(`總操作數: ${report.totalOperations}`);
    console.log(`快取命中率: ${report.hitRate}%`);
    console.log(`平均回應時間: ${report.averageResponseTime}ms`);
    console.log(`估計記憶體使用: ${report.memoryUsage}MB`);
    console.log(`快取項目數: ${report.cacheSize}`);
    
    // 效能評級
    const performanceGrade = this.calculatePerformanceGrade(report);
    console.log(`效能評級: ${performanceGrade}`);
    console.log('================================\n');
  }

  // 計算效能評級
  private calculatePerformanceGrade(metrics: CachePerformanceMetrics): string {
    let score = 0;

    // 命中率評分 (40%)
    if (metrics.hitRate >= 80) score += 40;
    else if (metrics.hitRate >= 60) score += 30;
    else if (metrics.hitRate >= 40) score += 20;
    else score += 10;

    // 回應時間評分 (40%)
    if (metrics.averageResponseTime <= 100) score += 40;
    else if (metrics.averageResponseTime <= 300) score += 30;
    else if (metrics.averageResponseTime <= 500) score += 20;
    else score += 10;

    // 記憶體使用評分 (20%)
    if (metrics.memoryUsage <= 50) score += 20;
    else if (metrics.memoryUsage <= 100) score += 15;
    else if (metrics.memoryUsage <= 200) score += 10;
    else score += 5;

    if (score >= 90) return 'A+ (優秀)';
    if (score >= 80) return 'A (良好)';
    if (score >= 70) return 'B (普通)';
    if (score >= 60) return 'C (需改善)';
    return 'D (不及格)';
  }
}

// Hook 用於在 React 元件中使用快取測試
export function useCachePerformanceTest() {
  const cacheTest = new ContainerCacheTest();

  // 測試提示詞最佳化快取
  const testPromptOptimizationCache = async (testData: Array<{
    content: string;
    purpose: string;
    keywords?: string[];
  }>) => {
    cacheTest.startPerformanceTest();

    for (let i = 0; i < testData.length; i++) {
      const testItem = testData[i];
      const startTime = Date.now();
      
      try {
        // 這裡會實際呼叫快取系統
        // const result = await optimizePromptWithCache(testItem);
        const responseTime = Date.now() - startTime;
        
        // 模擬快取命中/未命中 (實際使用時會由快取系統回報)
        // 第一次請求通常是未命中，後續相同請求應該命中
        const isHit = i > 0 && Math.random() > 0.3; // 70% 命中率模擬
        cacheTest.recordCacheOperation(isHit, responseTime);
        
        console.log(`測試項目 ${i + 1}/${testData.length}: ${testItem.purpose} - ${testItem.content.slice(0, 50)}...`);
        
      } catch (error) {
        const responseTime = Date.now() - startTime;
        cacheTest.recordCacheOperation(false, responseTime);
        console.error('快取測試錯誤:', error);
      }

      // 避免過於快速的請求
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    cacheTest.printDetailedReport();
    return cacheTest.getPerformanceReport();
  };

  return {
    testPromptOptimizationCache,
    getPerformanceReport: () => cacheTest.getPerformanceReport()
  };
}

// 容器環境資源監控
export function useContainerResourceMonitor() {
  const getContainerStats = () => {
    // 在真實環境中，這會與 Docker API 整合
    // 這裡提供模擬數據結構
    return {
      memoryUsage: {
        used: 256, // MB
        limit: 512, // MB
        percentage: 50
      },
      cpuUsage: {
        percentage: 25
      },
      networkIO: {
        bytesReceived: 1024 * 1024, // 1MB
        bytesSent: 512 * 1024 // 512KB
      }
    };
  };

  const logResourceUsage = () => {
    const stats = getContainerStats();
    console.log('🐳 容器資源使用情況:');
    console.log(`記憶體: ${stats.memoryUsage.used}MB / ${stats.memoryUsage.limit}MB (${stats.memoryUsage.percentage}%)`);
    console.log(`CPU: ${stats.cpuUsage.percentage}%`);
    console.log(`網路 I/O: ↓${(stats.networkIO.bytesReceived / 1024 / 1024).toFixed(2)}MB ↑${(stats.networkIO.bytesSent / 1024 / 1024).toFixed(2)}MB`);
  };

  return {
    getContainerStats,
    logResourceUsage
  };
}

export default ContainerCacheTest;
