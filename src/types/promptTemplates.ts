// 提示詞模板系統的型別定義
export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  category: PromptTemplateCategory;
  template: string;
  variables: TemplateVariable[];
  tags: string[];
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
  isBuiltIn: boolean;
  isPublic: boolean;
}

export interface TemplateVariable {
  name: string;
  description: string;
  type: 'text' | 'select' | 'multiline' | 'number';
  required: boolean;
  defaultValue?: string;
  options?: string[]; // for select type
  placeholder?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

export type PromptTemplateCategory = 
  | 'blog-header'      // 部落格橫幅
  | 'blog-section'     // 段落說明
  | 'blog-summary'     // 內容總結
  | 'technical'        // 技術插圖
  | 'conceptual'       // 概念圖解
  | 'interface'        // 介面設計
  | 'diagram'          // 流程圖表
  | 'custom';          // 自訂分類

export interface TemplateUsage {
  templateId: string;
  variables: Record<string, string>;
  timestamp: Date;
  result?: string;
}

export interface TemplateLibrary {
  templates: PromptTemplate[];
  categories: {
    [K in PromptTemplateCategory]: {
      name: string;
      description: string;
      icon: string;
    };
  };
  recentUsage: TemplateUsage[];
  favorites: string[]; // template IDs
}

// Hook 的回傳型別
export interface UsePromptTemplatesReturn {
  templates: PromptTemplate[];
  categories: TemplateLibrary['categories'];
  recentUsage: TemplateUsage[];
  favorites: string[];
  
  // 模板管理
  getTemplate: (id: string) => PromptTemplate | undefined;
  getTemplatesByCategory: (category: PromptTemplateCategory) => PromptTemplate[];
  searchTemplates: (query: string) => PromptTemplate[];
  
  // 使用記錄
  useTemplate: (templateId: string, variables: Record<string, string>) => string;
  addToFavorites: (templateId: string) => void;
  removeFromFavorites: (templateId: string) => void;
  isFavorite: (templateId: string) => boolean;
  
  // 自訂模板
  createTemplate: (template: Omit<PromptTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => void;
  updateTemplate: (id: string, updates: Partial<PromptTemplate>) => void;
  deleteTemplate: (id: string) => void;
  
  // 載入狀態
  isLoading: boolean;
  error: string | null;
}
