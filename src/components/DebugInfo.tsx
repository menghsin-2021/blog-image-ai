import React from 'react';

/**
 * 偵錯元件 - 顯示環境變數資訊
 */
export const DebugInfo: React.FC = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg text-xs max-w-md">
      <h3 className="font-bold mb-2">偵錯資訊</h3>
      <div>
        <strong>API 金鑰狀態:</strong> {apiKey ? '已設定' : '未設定'}
      </div>
      <div>
        <strong>金鑰前綴:</strong> {apiKey ? apiKey.substring(0, 12) + '...' : 'None'}
      </div>
      <div>
        <strong>是否為佔位符:</strong> {apiKey?.includes('your_openai_api_key_here') ? '是' : '否'}
      </div>
      <div className="mt-2 text-yellow-300">
        {!apiKey && '⚠️ 請檢查 .env 檔案中的 VITE_OPENAI_API_KEY'}
        {apiKey?.includes('your_openai_api_key_here') && '⚠️ 請在 .env 檔案中設定真實的 API 金鑰'}
      </div>
    </div>
  );
};

export default DebugInfo;
