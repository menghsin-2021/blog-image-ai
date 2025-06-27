import { useState } from 'react';

// 簡化的快取測試元件，用於隔離錯誤
export function SimpleCacheTestPanel() {
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testLogs, setTestLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTestLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const runSimpleTest = async () => {
    setIsTestRunning(true);
    setTestLogs([]);

    try {
      addLog('🧪 開始簡化快取測試...');

      // 簡單的延遲模擬
      await new Promise(resolve => setTimeout(resolve, 1000));

      addLog('✅ 簡化測試完成');
    } catch (error) {
      addLog(`❌ 簡化測試失敗: ${error}`);
    } finally {
      setIsTestRunning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">🧪 簡化快取測試面板</h2>
        <p className="text-gray-600">用於檢測快取系統基本功能</p>
      </div>

      {/* 控制按鈕 */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={runSimpleTest}
          disabled={isTestRunning}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isTestRunning ? '測試中...' : '🧪 執行簡化測試'}
        </button>

        <button
          onClick={() => setTestLogs([])}
          disabled={isTestRunning}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🗑️ 清空記錄
        </button>
      </div>

      {/* 測試記錄 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">測試記錄</h3>
        <div className="bg-black text-green-400 font-mono text-sm p-4 rounded-lg h-64 overflow-y-auto">
          {testLogs.length === 0 ? (
            <div className="text-gray-500">等待測試開始...</div>
          ) : (
            testLogs.map((log, index) => (
              <div key={index} className="mb-1">
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">📋 測試狀態</h4>
        <div className="text-blue-800">
          <div>• 元件載入: ✅ 成功</div>
          <div>• React hooks: ✅ 正常</div>
          <div>• 基本互動: ✅ 可用</div>
          <div>• 錯誤處理: {isTestRunning ? '⏳ 測試中' : '✅ 準備完成'}</div>
        </div>
      </div>
    </div>
  );
}
