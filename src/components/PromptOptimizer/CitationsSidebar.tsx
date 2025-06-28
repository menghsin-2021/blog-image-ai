import React, { useState } from 'react';
import { PerplexityCitation } from '../../services/perplexityOptimizer';

interface CitationsSidebarProps {
  citations: PerplexityCitation[];
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export const CitationsSidebar: React.FC<CitationsSidebarProps> = ({
  citations,
  isOpen,
  onToggle,
  className = '',
}) => {
  const [expandedCitations, setExpandedCitations] = useState<Set<number>>(new Set());

  const toggleCitation = (citationNumber: number) => {
    const newExpanded = new Set(expandedCitations);
    if (newExpanded.has(citationNumber)) {
      newExpanded.delete(citationNumber);
    } else {
      newExpanded.add(citationNumber);
    }
    setExpandedCitations(newExpanded);
  };

  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  };

  return (
    <>
      {/* 側邊欄切換按鈕 */}
      <button
        onClick={onToggle}
        className={`
          fixed top-1/2 right-0 transform -translate-y-1/2 z-50
          bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-l-lg
          transition-all duration-300 shadow-lg
          ${isOpen ? 'translate-x-0' : 'translate-x-0'}
        `}
        aria-label="切換引用來源側邊欄"
      >
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">
            {citations.length} 來源
          </span>
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </button>

      {/* 側邊欄內容 */}
      <div
        className={`
          fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          ${className}
        `}
      >
        <div className="h-full flex flex-col">
          {/* 標題欄 */}
          <div className="p-4 border-b border-gray-200 bg-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  引用來源
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  基於即時網路搜尋結果
                </p>
              </div>
              <button
                onClick={onToggle}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                aria-label="關閉側邊欄"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* 引用列表 */}
          <div className="flex-1 overflow-y-auto p-4">
            {citations.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <p className="text-gray-500">暫無引用來源</p>
                <p className="text-xs text-gray-400 mt-1">
                  使用 Perplexity 最佳化時會顯示相關來源
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {citations.map((citation) => {
                  const isExpanded = expandedCitations.has(citation.number);
                  
                  return (
                    <div
                      key={citation.number}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {/* 引用標題 */}
                      <div
                        className="p-3 cursor-pointer hover:bg-gray-50"
                        onClick={() => toggleCitation(citation.number)}
                      >
                        <div className="flex items-start space-x-3">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-medium flex-shrink-0">
                            {citation.number}
                          </span>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                              {citation.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatUrl(citation.url)}
                            </p>
                          </div>
                          <svg
                            className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>

                      {/* 展開內容 */}
                      {isExpanded && (
                        <div className="px-3 pb-3 border-t border-gray-100">
                          {citation.snippet && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-600 line-clamp-4">
                                {citation.snippet}
                              </p>
                            </div>
                          )}
                          
                          <div className="mt-3 flex items-center justify-between">
                            <a
                              href={citation.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 font-medium"
                            >
                              查看來源
                              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(citation.url);
                              }}
                              className="inline-flex items-center text-xs text-gray-500 hover:text-gray-700"
                              title="複製連結"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 底部資訊 */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>共 {citations.length} 個引用來源</span>
              <span className="flex items-center space-x-1">
                <span>🌐</span>
                <span>即時網路資訊</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 背景遮罩 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-30"
          onClick={onToggle}
        />
      )}
    </>
  );
};
