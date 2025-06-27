// import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            BlogImageAI - 測試版
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            基於 OpenAI DALL·E 的 AI 圖片生成助手
          </p>
        </header>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">應用程式正在載入...</h3>
            <p>如果你看到這個訊息，表示基本的 React 應用程式正在運行。</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
