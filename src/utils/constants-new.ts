import { AspectRatio, DalleModel, ImageQuality, ImageStyle } from '../types';

// 預設圖片比例選項 (根據模型動態調整)
export const ASPECT_RATIOS: AspectRatio[] = [
  {
    label: '1:1 (正方形)',
    value: '1024x1024',
    ratio: 1,
    width: 1024,
    height: 1024,
  },
  {
    label: '16:9 (寬螢幕)',
    value: '1792x1024',
    ratio: 16 / 9,
    width: 1792,
    height: 1024,
  },
  {
    label: '9:16 (直式)',
    value: '1024x1792',
    ratio: 9 / 16,
    width: 1024,
    height: 1792,
  },
];

// 根據模型篩選可用的比例
export const getAspectRatiosForModel = (model: DalleModel): AspectRatio[] => {
  switch (model) {
    case 'dall-e-2':
      return ASPECT_RATIOS.filter(ratio => ratio.value === '1024x1024');
    case 'dall-e-3':
      return ASPECT_RATIOS.filter(ratio =>
        ['1024x1024', '1792x1024', '1024x1792'].includes(ratio.value)
      );
    case 'gpt-image-1':
      // GPT-image-1 支援與 DALL·E 3 相同的尺寸
      return ASPECT_RATIOS.filter(ratio =>
        ['1024x1024', '1792x1024', '1024x1792'].includes(ratio.value)
      );
    default:
      return ASPECT_RATIOS;
  }
};

// AI 模型選項
export const DALLE_MODELS: { value: DalleModel; label: string; description: string }[] = [
  {
    value: 'gpt-image-1',
    label: 'GPT-image-1',
    description: '最新模型，更高精確度和逼真度（推薦）',
  },
  {
    value: 'dall-e-3',
    label: 'DALL·E 3',
    description: '高品質模型，支援 HD 和風格選項',
  },
  {
    value: 'dall-e-2',
    label: 'DALL·E 2',
    description: '經典模型，成本較低，支援編輯和變化',
  },
];

// 圖片品質選項
export const IMAGE_QUALITIES: { value: ImageQuality; label: string; models: DalleModel[] }[] = [
  { value: 'standard', label: '標準品質', models: ['dall-e-3', 'gpt-image-1'] },
  { value: 'hd', label: '高畫質 (HD)', models: ['dall-e-3', 'gpt-image-1'] },
];

// 風格選項 (僅 DALL·E 3 和 GPT-image-1 支援)
export const IMAGE_STYLES: { value: ImageStyle; label: string; description: string }[] = [
  { value: 'vivid', label: '鮮豔風格', description: '生動鮮豔的圖片效果' },
  { value: 'natural', label: '自然風格', description: '自然真實的圖片效果' },
];

// API 設定
export const API_CONFIG = {
  baseUrl: 'https://api.openai.com/v1',
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 60000,
};

// 預設設定 - 使用 GPT-image-1 作為預設模型
export const DEFAULT_SETTINGS = {
  model: 'gpt-image-1' as DalleModel,
  quality: 'standard' as ImageQuality,
  style: 'vivid' as ImageStyle,
  aspectRatio: ASPECT_RATIOS[0], // 1:1
  numberOfImages: 1,
};

// 提示詞範例
export const PROMPT_EXAMPLES = [
  {
    category: '技術圖解',
    examples: [
      '一個現代化的雲端運算架構圖，包含伺服器、資料庫和網路連接，藍色科技風格',
      '軟體開發流程圖，顯示需求分析、設計、開發、測試和部署階段，扁平化設計',
      'API 架構示意圖，展示前端、後端和資料庫的交互關係，簡潔的線條圖',
    ],
  },
];

// 錯誤訊息
export const ERROR_MESSAGES = {
  API_KEY_MISSING: 'OpenAI API 金鑰未設定，請檢查環境變數',
  PROMPT_TOO_LONG: '提示詞過長，請縮短至 4000 字元以內',
  NETWORK_ERROR: '網路連接錯誤，請檢查網路連接',
  RATE_LIMIT: 'API 呼叫頻率過高，請稍後再試',
  INVALID_PROMPT: '提示詞包含不當內容，請修改後重試',
  GENERATION_FAILED: '圖片生成失敗，請重試',
  DOWNLOAD_FAILED: '圖片下載失敗，請重試',
};
