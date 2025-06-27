import React from 'react';
import { ImagePurpose, ImagePurposeType } from '../../types/promptOptimizer';

interface PurposeSelectorProps {
  selectedPurpose: ImagePurposeType | null;
  onPurposeSelect: (purpose: ImagePurposeType) => void;
}

// 圖片用途選項資料
const IMAGE_PURPOSES: ImagePurpose[] = [
  {
    id: 'banner',
    title: '首頁橫幅',
    description: '吸引眼球的主題圖片，代表整篇文章的核心概念',
    icon: '🎯',
    aspectRatios: ['16:9', '3:2', '4:3'],
    styleGuidelines: ['現代', '專業', '視覺衝擊', '簡潔'],
    examples: ['科技趨勢文章的未來感插圖', '教學指南的概念性橫幅', '產品評測的產品展示圖'],
  },
  {
    id: 'illustration',
    title: '段落說明',
    description: '輔助解釋特定概念或流程的說明圖片',
    icon: '📋',
    aspectRatios: ['1:1', '4:5', '3:4'],
    styleGuidelines: ['簡單', '清晰', '教學', '圖示化'],
    examples: ['工作流程示意圖', '技術架構說明圖', '步驟指引插圖'],
  },
  {
    id: 'summary',
    title: '內容總結',
    description: '文章結尾的總結圖片，呼應主題並留下深刻印象',
    icon: '🎨',
    aspectRatios: ['16:9', '1:1', '4:5'],
    styleGuidelines: ['概念性', '啟發性', '總結感', '記憶點'],
    examples: ['知識總結的視覺比喻', '未來展望的象徵圖像', '結論重點的藝術表現'],
  },
];

export const PurposeSelector: React.FC<PurposeSelectorProps> = ({
  selectedPurpose,
  onPurposeSelect,
}) => {
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        選擇您要生成的圖片用途，系統將根據不同用途提供專業的最佳化建議
      </div>

      <div className="grid gap-4">
        {IMAGE_PURPOSES.map(purpose => (
          <div
            key={purpose.id}
            className={`
              border-2 rounded-lg p-4 cursor-pointer transition-all duration-200
              ${
                selectedPurpose === purpose.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }
            `}
            onClick={() => onPurposeSelect(purpose.id)}
          >
            <div className="flex items-start space-x-3">
              <div className="text-2xl">{purpose.icon}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">{purpose.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{purpose.description}</p>

                {/* 建議比例 */}
                <div className="mb-2">
                  <span className="text-xs font-medium text-gray-500">建議比例：</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {purpose.aspectRatios.map(ratio => (
                      <span
                        key={ratio}
                        className="px-2 py-1 bg-gray-100 text-xs rounded-md text-gray-600"
                      >
                        {ratio}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 風格指引 */}
                <div className="mb-2">
                  <span className="text-xs font-medium text-gray-500">風格特點：</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {purpose.styleGuidelines.map(style => (
                      <span
                        key={style}
                        className="px-2 py-1 bg-blue-100 text-xs rounded-md text-blue-600"
                      >
                        {style}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 範例 */}
                {selectedPurpose === purpose.id && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <span className="text-xs font-medium text-gray-500">常見範例：</span>
                    <ul className="mt-1 space-y-1">
                      {purpose.examples.map((example, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-center">
                          <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPurpose && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-green-700 font-medium">
              已選擇：{IMAGE_PURPOSES.find(p => p.id === selectedPurpose)?.title}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// 導出用途資料供其他元件使用
export { IMAGE_PURPOSES };
