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
  original: string; // 原始提示詞
  optimized: {
    // 最佳化後提示詞 (雙語)
    chinese: string; // 中文版本
    english: string; // 英文版本
  };
  suggestions: string[]; // 最佳化建議
  styleModifiers: string[]; // 風格修飾詞
  technicalParams: {
    // 技術參數建議
    aspectRatio: string;
    quality: string;
    style?: string;
  };
  confidence: number; // 最佳化信心度 (0-1)
  analysis: {
    // GPT-4o 分析結果
    keywords: string[]; // 提取的關鍵字
    topic: string; // 主題分類
    sentiment: string; // 情感分析
    complexity: string; // 內容複雜度
  };
  exportData: {
    // 匯出資料
    markdown: string; // Markdown 格式
    timestamp: string; // 建立時間
    purpose: ImagePurposeType; // 圖片用途
  };
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
