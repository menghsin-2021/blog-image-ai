# 提示詞最佳化助手功能規格

## 功能概述
為 BlogImageAI 新增智慧提示詞最佳化助手，幫助使用者針對不同類型的部落格圖片需求，產生優化的 AI 圖片生成提示詞。

## 功能目標
- 提升圖片生成品質與相關性
- 降低使用者學習門檻
- 針對部落格內容特性最佳化
- 提供直觀的使用流程

## 使用情境分析

### 1. 首頁橫幅圖片
**特徵**:
- 吸引眼球，代表整篇文章主題
- 需要與標題和內容摘要呼應
- 視覺衝擊力強，但不失專業感
- 通常為橫式比例 (16:9 或 3:2)

**最佳化策略**:
- 提取文章關鍵字和主題
- 加入視覺風格指引 (簡潔、現代、專業)
- 避免過多細節，聚焦主要概念

### 2. 文章段落說明圖片
**特徵**:
- 輔助說明特定概念或流程
- 簡單明瞭，易於理解
- 通常為方形或直式比例
- 避免干擾閱讀體驗

**最佳化策略**:
- 聚焦單一概念或流程
- 使用圖示化、示意圖風格
- 加入清晰的視覺層次
- 避免文字元素

### 3. 內容總結末尾圖片
**特徵**:
- 呼應文章整體主題
- 給讀者留下深刻印象
- 可包含結論或啟發性元素
- 平衡視覺與概念表達

**最佳化策略**:
- 整合文章核心概念
- 使用象徵性或比喻性元素
- 營造完整感和總結感

## 技術規格

### 元件結構
```typescript
// 新增元件
src/components/PromptOptimizer/
├── PromptOptimizer.tsx          // 主要元件
├── PurposeSelector.tsx          // 圖片用途選擇器
├── ContentInput.tsx             // 部落格內容輸入
├── OptimizedPromptDisplay.tsx   // 最佳化提示詞顯示
└── PromptTemplates.tsx          // 提示詞模板管理

// 相關服務
src/services/
├── promptOptimizer.ts           // 提示詞最佳化邏輯
└── contentAnalyzer.ts           // 內容分析服務

// 新增類型定義
src/types/
└── promptOptimizer.ts           // 相關型別定義
```

### 核心介面設計

#### 1. 圖片用途選擇器 (PurposeSelector)
```typescript
interface ImagePurpose {
  id: 'banner' | 'illustration' | 'summary';
  title: string;
  description: string;
  icon: React.ReactNode;
  aspectRatios: string[];
  styleGuidelines: string[];
}
```

#### 2. 內容輸入區 (ContentInput)
```typescript
interface ContentInput {
  title?: string;           // 文章標題
  content: string;          // 主要內容
  keywords?: string[];      // 關鍵字 (可選)
  targetAudience?: string;  // 目標讀者 (可選)
}
```

#### 3. 提示詞最佳化結果
```typescript
interface OptimizedPrompt {
  original: string;         // 原始提示詞
  optimized: {              // 最佳化後提示詞 (雙語)
    chinese: string;        // 中文版本
    english: string;        // 英文版本
  };
  suggestions: string[];    // 最佳化建議
  styleModifiers: string[]; // 風格修飾詞
  technicalParams: {        // 技術參數建議
    aspectRatio: string;
    quality: string;
    style?: string;
  };
  confidence: number;       // 最佳化信心度 (0-1)
  analysis: {               // GPT-4o 分析結果
    keywords: string[];     // 提取的關鍵字
    topic: string;          // 主題分類
    sentiment: string;      // 情感分析
    complexity: string;     // 內容複雜度
  };
  exportData: {             // 匯出資料
    markdown: string;       // Markdown 格式
    timestamp: string;      // 建立時間
    purpose: ImagePurposeType; // 圖片用途
  };
}
```

## 使用者體驗流程

### 階段 1: 用途選擇
1. 使用者選擇圖片用途 (首頁橫幅/段落說明/內容總結)
2. 系統顯示該用途的特徵說明和建議比例
3. 自動預設適合的技術參數

### 階段 2: 內容分析
1. 使用者輸入部落格相關內容
   - 文章標題 (必填)
   - 相關段落或全文 (必填)
   - 關鍵字 (選填)
2. 系統即時分析內容，提取關鍵概念

### 階段 3: 提示詞最佳化
1. 系統根據用途和內容產生最佳化提示詞
2. 顯示最佳化前後對比
3. 提供具體的改善建議說明
4. 推薦適合的技術參數

### 階段 4: 結果應用與匯出
1. **雙語結果顯示**: 同時展示中文和英文版本的最佳化提示詞
2. **語言切換**: 使用者可以選擇偏好的語言版本
3. **編輯功能**: 使用者可以進一步編輯最佳化提示詞
4. **一鍵應用**: 直接將選定的提示詞複製到主要生成介面
5. **Markdown 匯出**: 將完整的最佳化結果匯出為 Markdown 檔案
6. **重複使用**: 儲存的 Markdown 檔案可以重新匯入使用

## 最佳化演算法

### 1. GPT-4o 驅動的內容分析
- **智慧關鍵字提取**: 使用 GPT-4o 進行語義分析和關鍵概念提取
- **主題識別**: 自動分類內容類型 (技術、教學、產品、概念等)
- **情感與語調分析**: 識別內容的專業度、複雜度、目標受眾
- **多語言處理**: 優化中文和英文的語言特性

### 2. 雙語提示詞建構系統
```typescript
// GPT-4o 驅動的提示詞建構
const gpt4oPromptBuilder = {
  systemPrompt: '你是一個專業的 AI 圖片生成提示詞專家...',
  contentAnalysis: (content: string) => Promise<ContentAnalysis>,
  generatePrompts: (analysis: ContentAnalysis, purpose: ImagePurposeType) => Promise<{
    chinese: string,
    english: string,
    suggestions: string[]
  }>,
  optimizeForPurpose: (prompt: string, purpose: ImagePurposeType) => Promise<string>
};
```typescript
// 基本模板結構
const promptTemplate = {
  subject: '',      // 主要主題
  style: '',        // 視覺風格
  composition: '',  // 構圖要求
  technical: '',    // 技術規格
  restrictions: ''  // 限制條件
};
```

### 3. 風格指引庫
```typescript
const styleGuides = {
  blog: {
    banner: 'modern, clean, professional, eye-catching',
    illustration: 'simple, clear, educational, minimalist',
    summary: 'conceptual, inspiring, conclusive, memorable'
  },
  technical: 'flat design, icons, diagrams, blue and grey tones',
  educational: 'friendly, approachable, step-by-step, visual guides'
};
```

## 介面設計規範

### 視覺設計
- 使用 Tailwind CSS 保持一致性
- 採用卡片式佈局，清晰分區
- 使用漸進式揭示，避免資訊過載
- 提供即時預覽和回饋

### 響應式設計
- 手機版: 單欄式佈局，分步驟引導
- 平板版: 雙欄佈局，左側輸入右側預覽
- 桌面版: 多欄佈局，並排顯示所有資訊

### 無障礙設計
- 鍵盤導航支援
- 螢幕閱讀器相容
- 高對比色彩選項
- 清晰的標籤和說明

## 技術實作細節

### 1. 元件整合
- 整合到現有的 `App.tsx` 主介面
- 新增獨立的提示詞最佳化頁籤
- 與現有的 `PromptInput` 元件整合

### 2. 狀態管理
- 使用 React Context 或自訂 Hook
- 保存使用者的最佳化歷史
- 支援草稿儲存功能

### 3. 效能最佳化
- 內容分析使用防抖 (debounce)
- 提示詞模板預載入
- 結果快取機制

## 測試規劃

### 單元測試
- 內容分析函式
- 提示詞建構邏輯
- 元件渲染測試

### 整合測試
- 完整使用流程測試
- 不同內容類型測試
- 邊界條件測試

### 使用者測試
- 可用性測試
- 提示詞品質評估
- 使用流程順暢度

## 效能指標

### 功能指標
- 提示詞最佳化準確度 > 85%
- 使用者滿意度 > 4.0/5.0
- 功能使用率 > 60%

### 技術指標
- 內容分析回應時間 < 2 秒
- 介面載入時間 < 1 秒
- 記憶體使用量 < 10MB

## 發布計劃

### Phase 1: 核心功能 (1-2 週)
- [x] 功能規格制定
- [ ] 基礎元件開發
- [ ] 用途選擇器實作
- [ ] 內容輸入介面

### Phase 2: 最佳化邏輯 (2-3 週)
- [ ] **GPT-4o 驅動的內容分析** 🚀 NEW
  - 使用 OpenAI GPT-4o 模型進行智慧內容分析
  - 關鍵字提取、主題識別、情感分析
  - 多語言支援 (中文、英文優化)
- [ ] **雙語提示詞建構系統** 🌐 NEW
  - 同時生成中文和英文版本的最佳化提示詞
  - 基於 GPT-4o 的專業翻譯和本地化
  - 語言特定的風格調整
- [ ] **提示詞模板庫** 📚
  - 針對部落格用途的專業模板
  - GPT-4o 動態模板最佳化
- [ ] **Markdown 匯出功能** 💾 NEW
  - 提示詞結果以 Markdown 格式儲存
  - 包含中英文版本、技術參數、使用建議
  - 支援重複使用和分享

### Phase 3: 整合與最佳化 (1 週)
- [ ] 主介面整合
- [ ] 效能最佳化
- [ ] 測試與除錯
- [ ] 文件更新

## 未來擴充可能

### 進階功能
- AI 輔助內容分析 (GPT-4)
- 多語言提示詞支援
- 個人化學習與推薦
- 批次處理功能

### 社群功能
- 提示詞範本分享
- 社群評分與回饋
- 最佳實踐案例庫

---

## 開發者備註

此功能將大幅提升 BlogImageAI 的使用者體驗，特別是對於不熟悉 AI 圖片生成的使用者。實作時需要注意保持介面簡潔，避免過度複雜化，並確保與現有功能的良好整合。

最佳化邏輯應該基於實際使用資料持續改進，建議在初期版本中加入使用者回饋收集機制，以便後續迭代優化。

## Phase 2 更新 - GPT-4o 集成與雙語支援

### 新增需求 (基於使用者回饋)

#### 1. GPT-4o API 整合
- **模型**: 使用 `gpt-4o` 或 `gpt-4o-mini` 進行提示詞最佳化
- **Chat Completions API**: 利用對話式 API 進行智慧分析
- **成本控制**: 使用 `max_tokens` 參數控制回應長度
- **錯誤處理**: 完整的 API 錯誤處理和重試機制

#### 2. 使用者介面改進
- **關鍵字輸入修復**: 解決半形逗號輸入問題
- **雙語結果展示**: 中文和英文提示詞並排顯示
- **語言切換**: 快速切換查看不同語言版本
- **即時預覽**: 輸入時即時顯示格式化結果

#### 3. Markdown 匯出系統
```markdown
# 提示詞最佳化結果

**生成時間**: {timestamp}  
**圖片用途**: {purpose}  
**信心度**: {confidence}%

## 原始內容
- **標題**: {title}
- **關鍵字**: {keywords}

## 最佳化提示詞

### 中文版本
{chinese_prompt}

### 英文版本  
{english_prompt}

## 技術參數建議
- **比例**: {aspectRatio}
- **品質**: {quality}
- **風格**: {style}

## 最佳化建議
{suggestions}
```

#### 4. 檔案管理功能
- **本地儲存**: 使用瀏覽器 File API 下載 Markdown 檔案
- **檔案命名**: 自動生成有意義的檔案名稱
- **重新匯入**: 支援上傳 Markdown 檔案恢復設定
- **歷史記錄**: 本地儲存最近的最佳化結果

#### 5. 技術實作重點
- **API 金鑰安全**: 確保 GPT-4o API 金鑰的安全使用
- **請求最佳化**: 減少不必要的 API 呼叫
- **快取機制**: 相同內容的結果快取
- **使用者體驗**: 載入狀態、進度指示、錯誤提示

#### 6. 品質保證
- **輸入驗證**: 全面的表單驗證和錯誤提示
- **響應式設計**: 在各種裝置上的最佳表現
- **無障礙性**: 鍵盤導航、螢幕閱讀器支援
- **效能監控**: API 呼叫時間、成功率追蹤

---
