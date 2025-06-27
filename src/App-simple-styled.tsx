import { useState } from 'react';

function App() {
  const [prompt, setPrompt] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* 標題區域 */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            BlogImageAI
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            基於 OpenAI DALL·E 的 AI 圖片生成助手，專為技術部落格文章建立專業插圖
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          {/* 簡化的輸入區域 */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              描述你想要的圖片
            </h3>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="描述你想生成的技術插圖，例如：一個現代的雲端架構圖，顯示微服務之間的連接..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
            />
            
            <div className="mt-4">
              <button
                onClick={() => alert('功能開發中...')}
                disabled={!prompt.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                生成圖片
              </button>
            </div>
          </div>

          {/* 狀態顯示 */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  應用程式已成功載入！
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>React 應用程式、Tailwind CSS 和基本功能都正常運作。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
