// 提示詞最佳化相關類型定義

// 圖片用途類型
export type ImagePurposeType = 'banner' | 'illustration' | 'summary';

// 圖片用途介面
export interface ImagePurpose {
  id: ImagePurposeType;
  title: string;
  description: string;
  icon: string;
  aspectRatios: string[];
  styleGuidelines: string[];
  examples: string[];
}

// 內容輸入介面
export interface ContentInput {
  title?: string; // 文章標題
  content: string; // 主要內容
  keywords?: string[]; // 關鍵字 (可選)
  targetAudience?: string; // 目標讀者 (可選)
}

// 提示詞最佳化結果
export interface OptimizedPrompt {
  original?: string; // 原始提示詞
  originalPrompt?: string; // 原始提示詞 (保持相容性)
  optimized: {
    chinese: string; // 中文版最佳化提示詞
    english: string; // 英文版最佳化提示詞
  };
  optimizedPrompt?: string; // 單一最佳化提示詞 (保持相容性)
  improvements: string[]; // 改善點列表
  reasoning: string; // 最佳化理由
  suggestedStyle: string; // 建議的視覺風格
  technicalTips: string; // 技術建議
  confidence: number; // 信心度 (0-1)
  analysis: {
    keywords: string[]; // 關鍵字
    topic: string; // 主題
    sentiment: 'positive' | 'neutral' | 'professional'; // 情感
    complexity: 'simple' | 'moderate' | 'complex'; // 複雜度
  };
  technicalParams: {
    aspectRatio: string;
    quality: string;
    style?: string;
  };
  styleModifiers: string[]; // 風格修飾詞
  suggestions: string[]; // 建議
  exportData: {
    markdown: string; // Markdown 格式匯出
  };
  timestamp: number; // 生成時間戳
}

// 內容分析結果
export interface ContentAnalysis {
  keywords: string[]; // 提取的關鍵字
  topic: string; // 主題分類
  sentiment: 'positive' | 'neutral' | 'professional'; // 情感分析
  complexity: 'simple' | 'moderate' | 'complex'; // 複雜度
  technicalTerms: string[]; // 技術術語
}

// 提示詞模板
export interface PromptTemplate {
  id: string;
  name: string;
  purpose: ImagePurposeType;
  template: string;
  placeholders: string[];
  styleModifiers: string[];
}

// 最佳化選項
export interface OptimizationOptions {
  purpose: ImagePurposeType;
  enhanceKeywords: boolean;
  addStyleGuides: boolean;
  simplifyLanguage: boolean;
  includeTechnicalTerms: boolean;
}

// GPT-4o API 相關類型
export interface GPT4oRequest {
  model: 'gpt-4o' | 'gpt-4o-mini';
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
}

export interface GPT4oResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// 語言偏好
export type LanguagePreference = 'chinese' | 'english' | 'both';

// Markdown 匯出選項
export interface ExportOptions {
  includeAnalysis: boolean;
  includeTimestamp: boolean;
  includeTechnicalParams: boolean;
  language: LanguagePreference;
}

// === 統一提示詞最佳化型別系統 ===

// 最佳化服務提供商
export type OptimizationProvider = 'openai' | 'perplexity';

// 統一的最佳化結果介面 (整合 OptimizedPrompt 和 PerplexityOptimizationResult)
export interface UnifiedOptimizationResult {
  // 基本識別
  provider: OptimizationProvider;
  model: string;
  timestamp: number;

  // 統一提示詞格式
  original: string;
  originalPrompt: string; // 向後相容性
  optimized: {
    chinese: string;
    english: string;
  };
  optimizedPrompt: string; // 向後相容性，通常使用 chinese 版本

  // 分析結果
  improvements: string[];
  reasoning: string;
  suggestedStyle: string;
  technicalTips: string;
  confidence: number;

  // 分析資訊
  analysis: {
    keywords: string[];
    topic: string;
    sentiment: 'positive' | 'neutral' | 'professional';
    complexity: 'simple' | 'moderate' | 'complex';
  };

  // 技術參數
  technicalParams: {
    aspectRatio: string;
    quality: string;
    style?: string;
  };

  // 共同欄位
  styleModifiers: string[];
  suggestions: string[]; // 與 improvements 相同，保持相容性

  // 匯出資料
  exportData: {
    markdown: string;
  };

  // 條件式欄位 - Perplexity 專用
  citations?: PerplexityCitation[];
  cost?: {
    inputCost: number;
    outputCost: number;
    searchCost: number;
    totalCost: number;
  };
  searchQueries?: number;
}

// Perplexity 引用來源 (從 perplexityOptimizer.ts 移到這裡統一管理)
export interface PerplexityCitation {
  number: number;
  url: string;
  title: string;
  snippet?: string;
}

// 統一的最佳化提供商介面
export interface OptimizationProviderInterface {
  name: string;
  provider: OptimizationProvider;
  optimize(
    content: ContentInput,
    purpose: ImagePurposeType,
    options?: any
  ): Promise<UnifiedOptimizationResult>;
  getAvailableModels(): ModelOption[];
  estimateCost?(content: string, model?: string): Promise<number>;
}

// 模型選項
export interface ModelOption {
  value: string;
  label: string;
  description: string;
  cost?: string;
  features?: string[];
}

// 統一最佳化請求
export interface UnifiedOptimizationRequest {
  provider: OptimizationProvider;
  content: ContentInput;
  purpose: ImagePurposeType;
  model?: string;
  options?: {
    temperature?: number;
    maxTokens?: number;
    // 其他提供商特定選項
  };
}
