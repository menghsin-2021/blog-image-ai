import { PromptTemplate, TemplateLibrary } from '../types/promptTemplates';

// 內建提示詞模板資料
export const BUILTIN_TEMPLATES: PromptTemplate[] = [
  // 部落格橫幅類別
  {
    id: 'blog-header-tech',
    name: '技術部落格橫幅',
    description: '為技術部落格文章建立吸引人的橫幅圖片',
    category: 'blog-header',
    template: `建立一個現代化的技術部落格橫幅圖片，主題是「{{title}}」。

設計要求：
- 風格：{{style}}
- 色調：{{colorScheme}}
- 包含元素：{{elements}}
- 版面配置：橫式比例，適合部落格頭圖

技術要素：
- 顯示相關的程式碼片段或圖示
- 現代化的設計風格
- 專業且吸引眼球
- 適合 {{techStack}} 技術主題`,
    variables: [
      {
        name: 'title',
        description: '文章標題',
        type: 'text',
        required: true,
        placeholder: '例如：React 18 新功能介紹'
      },
      {
        name: 'style',
        description: '設計風格',
        type: 'select',
        required: true,
        options: ['極簡現代', '科技感', '專業商務', '創意插畫', '漸層設計'],
        defaultValue: '極簡現代'
      },
      {
        name: 'colorScheme',
        description: '色彩配置',
        type: 'select',
        required: true,
        options: ['藍色系', '紫色系', '綠色系', '橙色系', '黑白灰'],
        defaultValue: '藍色系'
      },
      {
        name: 'elements',
        description: '視覺元素',
        type: 'text',
        required: false,
        placeholder: '例如：程式碼、圖表、圖示',
        defaultValue: '程式碼、圖示'
      },
      {
        name: 'techStack',
        description: '技術堆疊',
        type: 'text',
        required: false,
        placeholder: '例如：React, TypeScript, Node.js'
      }
    ],
    tags: ['部落格', '橫幅', '技術', '標題'],
    usageCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    isBuiltIn: true,
    isPublic: true
  },

  // 段落說明類別
  {
    id: 'blog-section-concept',
    name: '概念說明插圖',
    description: '為部落格段落建立概念說明圖片',
    category: 'blog-section',
    template: `建立一個清晰的概念說明插圖，解釋「{{concept}}」。

插圖要求：
- 插圖風格：{{illustrationStyle}}
- 複雜程度：{{complexity}}
- 目標受眾：{{audience}}

內容說明：
{{description}}

視覺化需求：
- 使用簡潔的圖形和圖示
- 清楚展示概念的關聯性
- 適合嵌入文章段落中
- 比例：{{aspectRatio}}`,
    variables: [
      {
        name: 'concept',
        description: '要解釋的概念',
        type: 'text',
        required: true,
        placeholder: '例如：函式組合、狀態管理'
      },
      {
        name: 'description',
        description: '概念詳細說明',
        type: 'multiline',
        required: true,
        placeholder: '詳細描述這個概念的內容和重要性',
        validation: { minLength: 50, maxLength: 500 }
      },
      {
        name: 'illustrationStyle',
        description: '插圖風格',
        type: 'select',
        required: true,
        options: ['線條圖解', '流程圖', '示意圖', '圖示組合', '思維導圖'],
        defaultValue: '線條圖解'
      },
      {
        name: 'complexity',
        description: '複雜程度',
        type: 'select',
        required: true,
        options: ['簡單', '中等', '複雜'],
        defaultValue: '中等'
      },
      {
        name: 'audience',
        description: '目標受眾',
        type: 'select',
        required: true,
        options: ['初學者', '中級開發者', '高級開發者', '技術主管'],
        defaultValue: '中級開發者'
      },
      {
        name: 'aspectRatio',
        description: '圖片比例',
        type: 'select',
        required: true,
        options: ['正方形 1:1', '橫式 16:9', '橫式 4:3', '直式 3:4'],
        defaultValue: '橫式 16:9'
      }
    ],
    tags: ['概念', '說明', '插圖', '教學'],
    usageCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    isBuiltIn: true,
    isPublic: true
  },

  // 技術插圖類別
  {
    id: 'technical-architecture',
    name: '系統架構圖',
    description: '建立清晰的系統架構示意圖',
    category: 'technical',
    template: `建立一個專業的系統架構圖，展示「{{systemName}}」的架構設計。

系統資訊：
- 系統類型：{{systemType}}
- 主要組件：{{components}}
- 技術堆疊：{{techStack}}
- 部署環境：{{deployment}}

視覺化要求：
- 使用專業的架構圖標準符號
- 清楚標示各組件間的連接關係
- 包含資料流向指示
- 色彩編碼不同類型的組件
- 風格：{{diagramStyle}}`,
    variables: [
      {
        name: 'systemName',
        description: '系統名稱',
        type: 'text',
        required: true,
        placeholder: '例如：電商平台、微服務架構'
      },
      {
        name: 'systemType',
        description: '系統類型',
        type: 'select',
        required: true,
        options: ['Web 應用程式', '微服務', 'API 系統', '資料平台', '行動應用'],
        defaultValue: 'Web 應用程式'
      },
      {
        name: 'components',
        description: '主要組件',
        type: 'multiline',
        required: true,
        placeholder: '列出系統的主要組件，例如：前端、後端、資料庫、快取等',
        validation: { minLength: 30 }
      },
      {
        name: 'techStack',
        description: '技術堆疊',
        type: 'text',
        required: false,
        placeholder: '例如：React, Node.js, PostgreSQL, Redis'
      },
      {
        name: 'deployment',
        description: '部署環境',
        type: 'select',
        required: false,
        options: ['本地開發', '雲端部署', '容器化', '無伺服器', '混合雲'],
        defaultValue: '雲端部署'
      },
      {
        name: 'diagramStyle',
        description: '圖表風格',
        type: 'select',
        required: true,
        options: ['極簡線條', '立體方塊', '流程圖風格', '雲端圖標風格'],
        defaultValue: '極簡線條'
      }
    ],
    tags: ['架構', '系統', '技術', '設計'],
    usageCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    isBuiltIn: true,
    isPublic: true
  },

  // 流程圖表類別
  {
    id: 'diagram-workflow',
    name: '工作流程圖',
    description: '建立清晰的工作流程示意圖',
    category: 'diagram',
    template: `建立一個清晰的工作流程圖，描述「{{processName}}」的完整流程。

流程資訊：
- 流程類型：{{processType}}
- 起始點：{{startPoint}}
- 結束點：{{endPoint}}
- 主要步驟：{{steps}}

流程特徵：
- 決策點：{{decisionPoints}}
- 並行處理：{{parallelProcesses}}
- 異常處理：{{errorHandling}}

視覺設計：
- 使用標準流程圖符號
- 清楚的箭頭指向
- 不同類型步驟使用不同顏色
- 風格：{{flowchartStyle}}`,
    variables: [
      {
        name: 'processName',
        description: '流程名稱',
        type: 'text',
        required: true,
        placeholder: '例如：用戶註冊流程、訂單處理流程'
      },
      {
        name: 'processType',
        description: '流程類型',
        type: 'select',
        required: true,
        options: ['業務流程', '技術流程', '使用者流程', '資料流程'],
        defaultValue: '業務流程'
      },
      {
        name: 'startPoint',
        description: '流程起始點',
        type: 'text',
        required: true,
        placeholder: '例如：使用者點擊註冊按鈕'
      },
      {
        name: 'endPoint',
        description: '流程結束點',
        type: 'text',
        required: true,
        placeholder: '例如：註冊成功，發送確認郵件'
      },
      {
        name: 'steps',
        description: '主要步驟',
        type: 'multiline',
        required: true,
        placeholder: '列出流程的主要步驟，每行一個步驟',
        validation: { minLength: 50 }
      },
      {
        name: 'decisionPoints',
        description: '決策點',
        type: 'text',
        required: false,
        placeholder: '流程中需要做決策的關鍵點'
      },
      {
        name: 'parallelProcesses',
        description: '並行處理',
        type: 'text',
        required: false,
        placeholder: '可以同時進行的步驟'
      },
      {
        name: 'errorHandling',
        description: '異常處理',
        type: 'text',
        required: false,
        placeholder: '錯誤情況的處理方式'
      },
      {
        name: 'flowchartStyle',
        description: '流程圖風格',
        type: 'select',
        required: true,
        options: ['標準流程圖', '現代扁平風格', '手繪風格', '立體風格'],
        defaultValue: '現代扁平風格'
      }
    ],
    tags: ['流程', '圖表', '工作流', '步驟'],
    usageCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    isBuiltIn: true,
    isPublic: true
  }
];

// 分類資訊
export const TEMPLATE_CATEGORIES: TemplateLibrary['categories'] = {
  'blog-header': {
    name: '部落格橫幅',
    description: '為部落格文章建立吸引人的標題圖片',
    icon: '🖼️'
  },
  'blog-section': {
    name: '段落說明',
    description: '為文章段落建立說明插圖',
    icon: '📝'
  },
  'blog-summary': {
    name: '內容總結',
    description: '為文章建立總結性視覺圖像',
    icon: '📊'
  },
  'technical': {
    name: '技術插圖',
    description: '程式碼、架構、技術概念圖解',
    icon: '🔧'
  },
  'conceptual': {
    name: '概念圖解',
    description: '抽象概念的視覺化表達',
    icon: '💡'
  },
  'interface': {
    name: '介面設計',
    description: '使用者介面與互動設計',
    icon: '🎨'
  },
  'diagram': {
    name: '流程圖表',
    description: '流程圖、時序圖、關係圖',
    icon: '📈'
  },
  'custom': {
    name: '自訂模板',
    description: '使用者建立的自訂模板',
    icon: '⚙️'
  }
};

// 模板搜索關鍵字映射
export const TEMPLATE_SEARCH_KEYWORDS: Record<string, string[]> = {
  'blog-header-tech': ['橫幅', '標題', '技術', 'header', 'banner', '部落格'],
  'blog-section-concept': ['概念', '說明', '插圖', '教學', 'concept', 'explanation'],
  'technical-architecture': ['架構', '系統', '技術', 'architecture', 'system', 'technical'],
  'diagram-workflow': ['流程', '工作流', '步驟', 'workflow', 'process', 'flow']
};

// 預設模板使用建議
export const TEMPLATE_USAGE_HINTS: Record<string, string[]> = {
  'blog-header': [
    '選擇與文章主題相符的色彩配置',
    '標題要簡潔有力，避免過長',
    '技術標籤有助於讀者快速理解文章內容'
  ],
  'blog-section': [
    '概念說明要清晰易懂',
    '選擇適合目標受眾的複雜程度',
    '插圖風格應與整篇文章保持一致'
  ],
  'technical': [
    '使用標準的技術圖示和符號',
    '清楚標示組件間的關係',
    '避免過度複雜的架構圖'
  ],
  'diagram': [
    '遵循標準流程圖規範',
    '使用清晰的箭頭指向',
    '重要決策點要特別標示'
  ]
};
