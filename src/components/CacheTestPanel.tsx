import { useState } from 'react';
import { useCachePerformanceTest, useContainerResourceMonitor, CachePerformanceMetrics } from '../utils/containerCacheTest';
import { usePromptOptimizationCache } from '../hooks/usePromptOptimizationCache';

// 快取測試元件
export function CacheTestPanel() {
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testResults, setTestResults] = useState<CachePerformanceMetrics | null>(null);
  const [testLogs, setTestLogs] = useState<string[]>([]);

  const { testPromptOptimizationCache } = useCachePerformanceTest();
  const { logResourceUsage, getContainerStats } = useContainerResourceMonitor();
  const { optimizePromptWithCache, getCacheStats, clearAllCache } = usePromptOptimizationCache();

  // 測試資料集
  const testDataSet = [
    {
      content: "介紹 React Hooks 的基本概念和使用方法，包括 useState 和 useEffect 的實際應用案例。",
      purpose: "header",
      keywords: ["React", "Hooks", "useState", "useEffect"]
    },
    {
      content: "深入探討 JavaScript 閉包的運作原理，解釋作用域鏈和記憶體管理的相關概念。",
      purpose: "content",
      keywords: ["JavaScript", "閉包", "作用域", "記憶體"]
    },
    {
      content: "Docker 容器化技術的基礎教學，從安裝到部署的完整流程說明。",
      purpose: "summary",
      keywords: ["Docker", "容器化", "部署", "DevOps"]
    },
    {
      content: "TypeScript 型別系統的進階應用，泛型和條件型別的實戰演練。",
      purpose: "content",
      keywords: ["TypeScript", "泛型", "型別系統", "進階"]
    },
    {
      content: "React Hooks 的基本概念", // 重複內容，測試快取命中
      purpose: "header",
      keywords: ["React", "Hooks"]
    }
  ];

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTestLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  // 執行快取效能測試
  const runCachePerformanceTest = async () => {
    setIsTestRunning(true);
    setTestLogs([]);
    addLog('🐳 開始容器化快取效能測試...');

    try {
      // 清空快取以確保測試準確性
      clearAllCache();
      addLog('✅ 快取已清空');

      // 記錄資源使用情況
      logResourceUsage();
      const initialStats = getContainerStats();
      addLog(`初始記憶體使用: ${initialStats.memoryUsage.used}MB`);

      // 執行測試
      const results = await testPromptOptimizationCache(testDataSet);
      setTestResults(results);

      // 記錄最終資源使用情況
      const finalStats = getContainerStats();
      addLog(`最終記憶體使用: ${finalStats.memoryUsage.used}MB`);
      addLog(`記憶體增長: ${finalStats.memoryUsage.used - initialStats.memoryUsage.used}MB`);

      addLog('✅ 快取效能測試完成');

    } catch (error) {
      addLog(`❌ 測試失敗: ${error}`);
    } finally {
      setIsTestRunning(false);
    }
  };

  // 執行實際快取功能測試
  const runRealCacheTest = async () => {
    setIsTestRunning(true);
    setTestLogs([]);
    addLog('🔄 執行真實快取功能測試...');

    try {
      clearAllCache();
      
      for (let i = 0; i < testDataSet.length; i++) {
        const testItem = testDataSet[i];
        addLog(`測試項目 ${i + 1}/${testDataSet.length}: ${testItem.content.slice(0, 50)}...`);
        
        const startTime = Date.now();
        
        try {
          const result = await optimizePromptWithCache({
            content: testItem.content,
            title: `測試標題 ${i + 1}`,
            keywords: testItem.keywords
          }, testItem.purpose as any);
          
          const endTime = Date.now();
          const responseTime = endTime - startTime;
          
          // 安全檢查結果結構
          if (result && result.optimized && result.optimized.chinese) {
            addLog(`✅ 完成 - 回應時間: ${responseTime}ms`);
            addLog(`結果: ${result.optimized.chinese.slice(0, 100)}...`);
          } else {
            addLog(`⚠️ 部分成功 - 回應時間: ${responseTime}ms`);
            addLog(`警告: 回應結構不完整 - ${JSON.stringify(result)?.slice(0, 100)}...`);
          }
          
        } catch (error) {
          const endTime = Date.now();
          const responseTime = endTime - startTime;
          addLog(`❌ 錯誤 - 回應時間: ${responseTime}ms - ${error}`);
        }

        // 短暫延遲避免過快請求
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // 顯示快取統計
      const cacheStats = getCacheStats();
      addLog(`📊 快取統計 - 項目: ${cacheStats.size}, 命中: ${cacheStats.hits}, 未命中: ${cacheStats.misses}`);
      
    } catch (error) {
      addLog(`❌ 真實測試失敗: ${error}`);
    } finally {
      setIsTestRunning(false);
    }
  };

  // 清空快取和記錄
  const clearTestData = () => {
    clearAllCache();
    setTestResults(null);
    setTestLogs([]);
    addLog('🗑️ 快取和測試記錄已清空');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🐳 容器化快取系統測試面板
        </h2>
        <p className="text-gray-600">
          測試 Docker 容器環境中的快取效能和功能
        </p>
      </div>

      {/* 控制按鈕 */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={runCachePerformanceTest}
          disabled={isTestRunning}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isTestRunning ? '測試中...' : '🚀 執行效能測試'}
        </button>

        <button
          onClick={runRealCacheTest}
          disabled={isTestRunning}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isTestRunning ? '測試中...' : '🔄 真實功能測試'}
        </button>

        <button
          onClick={clearTestData}
          disabled={isTestRunning}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🗑️ 清空資料
        </button>
      </div>

      {/* 測試結果 */}
      {testResults && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">📊 效能測試結果</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded border">
              <div className="text-sm text-gray-600">快取命中率</div>
              <div className="text-2xl font-bold text-blue-600">{testResults.hitRate}%</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-sm text-gray-600">平均回應時間</div>
              <div className="text-2xl font-bold text-green-600">{testResults.averageResponseTime}ms</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-sm text-gray-600">記憶體使用</div>
              <div className="text-2xl font-bold text-orange-600">{testResults.memoryUsage}MB</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-sm text-gray-600">總操作數</div>
              <div className="text-2xl font-bold text-purple-600">{testResults.totalOperations}</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-sm text-gray-600">快取項目</div>
              <div className="text-2xl font-bold text-indigo-600">{testResults.cacheSize}</div>
            </div>
          </div>
        </div>
      )}

      {/* 測試記錄 */}
      {testLogs.length > 0 && (
        <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm">
          <h3 className="text-lg font-semibold text-white mb-3">📝 測試記錄</h3>
          <div className="max-h-96 overflow-y-auto space-y-1">
            {testLogs.map((log, index) => (
              <div key={index} className="text-sm">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 測試說明 */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">🔍 測試說明</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• <strong>效能測試</strong>: 模擬快取操作，測量回應時間和命中率</li>
          <li>• <strong>真實功能測試</strong>: 實際呼叫 GPT-4o API 和快取系統</li>
          <li>• <strong>容器環境</strong>: 所有測試在 Docker 容器中執行</li>
          <li>• <strong>效能目標</strong>: 命中率 &gt;70%, 回應時間 &lt;300ms, 記憶體 &lt;100MB</li>
        </ul>
      </div>
    </div>
  );
}

export default CacheTestPanel;
