// Perplexity API 相關常數定義

export const PERPLEXITY_API_CONFIG = {
  BASE_URL: 'https://api.perplexity.ai',
  CHAT_COMPLETIONS_ENDPOINT: '/chat/completions',
  TIMEOUT: parseInt(import.meta.env.VITE_PERPLEXITY_TIMEOUT) || 30000,
  MAX_TOKENS: parseInt(import.meta.env.VITE_PERPLEXITY_MAX_TOKENS) || 2000,
} as const;

export const PERPLEXITY_MODELS = {
  SONAR: 'sonar',
  SONAR_PRO: 'sonar-pro',
  SONAR_REASONING: 'sonar-reasoning',
} as const;

export type PerplexityModel = (typeof PERPLEXITY_MODELS)[keyof typeof PERPLEXITY_MODELS];

export const PERPLEXITY_MODEL_INFO = {
  [PERPLEXITY_MODELS.SONAR]: {
    name: 'Sonar',
    description: '輕量級、快速回答，適合簡單提示詞最佳化',
    inputCost: 1, // USD per million tokens
    outputCost: 1, // USD per million tokens
    searchCost: 5, // USD per 1000 searches
    maxTokens: 128000,
    features: ['即時網路搜尋', '基礎引用', '成本最佳化'],
    icon: '⚡',
  },
  [PERPLEXITY_MODELS.SONAR_PRO]: {
    name: 'Sonar Pro',
    description: '進階模型，適合複雜查詢和深度內容理解',
    inputCost: 3, // USD per million tokens
    outputCost: 15, // USD per million tokens
    searchCost: 5, // USD per 1000 searches
    maxTokens: 128000,
    features: ['深度分析', '詳細引用', '複雜推理'],
    icon: '🔍',
  },
  [PERPLEXITY_MODELS.SONAR_REASONING]: {
    name: 'Sonar Reasoning',
    description: '推理模型，適合多步驟分析和問題解決',
    inputCost: 1, // USD per million tokens
    outputCost: 5, // USD per million tokens
    searchCost: 5, // USD per 1000 searches
    maxTokens: 128000,
    features: ['多步驟推理', '邏輯分析', '問題解決'],
    icon: '🧠',
  },
} as const;

export const OPTIMIZATION_PROVIDERS = {
  PERPLEXITY: 'perplexity',
  OPENAI: 'openai',
} as const;

export type OptimizationProvider =
  (typeof OPTIMIZATION_PROVIDERS)[keyof typeof OPTIMIZATION_PROVIDERS];

export const PROVIDER_INFO = {
  [OPTIMIZATION_PROVIDERS.PERPLEXITY]: {
    name: 'Perplexity',
    description: '基於即時網路搜尋的 AI 最佳化服務',
    icon: '🌐',
    features: ['即時資訊', '引用來源', '成本優勢'],
    defaultModel: PERPLEXITY_MODELS.SONAR,
    isDefault: true,
  },
  [OPTIMIZATION_PROVIDERS.OPENAI]: {
    name: 'OpenAI GPT-4o',
    description: '強大的語言模型，適合複雜的文本分析',
    icon: '🤖',
    features: ['深度理解', '創意生成', '多語言支援'],
    defaultModel: 'gpt-4o',
    isDefault: false,
  },
} as const;

// 成本計算工具函式
export const calculatePerplexityCost = (
  inputTokens: number,
  outputTokens: number,
  searchQueries: number,
  model: PerplexityModel
) => {
  const modelInfo = PERPLEXITY_MODEL_INFO[model];

  const inputCost = (inputTokens / 1_000_000) * modelInfo.inputCost;
  const outputCost = (outputTokens / 1_000_000) * modelInfo.outputCost;
  const searchCost = (searchQueries / 1_000) * modelInfo.searchCost;

  return {
    inputCost,
    outputCost,
    searchCost,
    totalCost: inputCost + outputCost + searchCost,
  };
};

// 預設設定
export const DEFAULT_PERPLEXITY_CONFIG = {
  model: PERPLEXITY_MODELS.SONAR,
  provider: OPTIMIZATION_PROVIDERS.PERPLEXITY,
  maxTokens: PERPLEXITY_API_CONFIG.MAX_TOKENS,
  temperature: 0.7,
  searchDomainFilter: [], // 可選：限制搜尋網域
  searchRecencyFilter: 'month', // 可選：限制搜尋時間範圍
} as const;
