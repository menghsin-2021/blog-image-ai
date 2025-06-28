# 統一提示詞最佳化功能開發規格書

## 📋 專案概述

**功能名稱**: 統一提示詞最佳化 (Unified Prompt Optimizer)  
**開發分支**: `feature/unified-prompt-optimizer`  
**優先級**: 高  
**預計開發時間**: 1-2 週  
**狀態**: 📝 規格制定中

## 🎯 功能目標

整合現有的 OpenAI GPT-4o 和 Perplexity AI 兩種提示詞最佳化服務到單一介面中，提供使用者統一的操作體驗，並支援動態服務選擇和結果展示。

## 📊 現狀分析

### 目前實作狀況
- ✅ **OpenAI 最佳化**: `PromptOptimizer` 元件 (傳統版本)
- ✅ **Perplexity 最佳化**: `EnhancedPromptOptimizer` 元件
- ✅ **分離頁籤**: 在 App.tsx 中有 'optimize' 和 'perplexity' 兩個頁籤
- ✅ **各自完整功能**: 兩個服務都有完整的實作

### 需要整合的元件
- `src/components/PromptOptimizer/PromptOptimizer.tsx` (OpenAI)
- `src/components/PromptOptimizer/EnhancedPromptOptimizer.tsx` (Perplexity)
- `src/components/PromptOptimizer/OptimizedPromptDisplay.tsx` (OpenAI 結果展示)
- `src/components/PromptOptimizer/EnhancedOptimizedPromptDisplay.tsx` (Perplexity 結果展示)

## 🔧 技術規格

### 新元件架構

```
src/components/PromptOptimizer/
├── UnifiedPromptOptimizer.tsx        # 主要統一介面元件
├── ServiceSelector.tsx               # 服務選擇器 (OpenAI vs Perplexity)  
├── UnifiedOptimizedPromptDisplay.tsx # 統一結果展示元件
├── PurposeSelector.tsx              # ✅ 已存在 - 共用用途選擇器
├── ContentInput.tsx                 # ✅ 已存在 - 共用內容輸入
├── ProviderSelector.tsx             # ✅ 已存在 - 提供商選擇器
└── providers/
    ├── OpenAIOptimizationProvider.tsx  # OpenAI 服務包裝
    └── PerplexityOptimizationProvider.tsx # Perplexity 服務包裝
```

### 需要重構的現有元件
- `PromptOptimizer.tsx` → 整合到 `UnifiedPromptOptimizer`
- `EnhancedPromptOptimizer.tsx` → 移除（保留邏輯整合）
- `EnhancedPromptOptimizer2.tsx` → 移除重複檔案
- `OptimizedPromptDisplay.tsx` + `EnhancedOptimizedPromptDisplay.tsx` → 合併為 `UnifiedOptimizedPromptDisplay.tsx`

### 工作流程設計

#### 五步驟統一流程
1. **服務選擇** - 選擇 OpenAI 或 Perplexity（第一步）
2. **用途選擇** - 選擇圖片用途 (橫幅/插圖/總結)
3. **內容輸入** - 輸入部落格內容和相關資訊
4. **模型與參數** - 根據選擇的服務動態顯示可用模型
5. **結果展示** - 根據服務類型展示對應格式的結果

#### 預設設定
- **預設服務**: OpenAI GPT-4o (考慮到穩定性和已有實作)
- **預設用途**: illustration (段落說明圖片 - 最常用)
- **OpenAI 預設模型**: GPT-4o (固定選項)
- **Perplexity 預設模型**: Sonar (成本最佳化)

## 🎨 使用者介面設計

### 服務選擇器 (第一步)
```tsx
// 設計概念
<ServiceSelector>
  <ServiceOption 
    service="openai" 
    icon="🤖" 
    title="OpenAI GPT-4o"
    description="深度內容分析，詳細技術參數建議"
    features={["內容分析", "技術參數", "風格建議"]}
    cost="免費使用"
  />
  <ServiceOption 
    service="perplexity" 
    icon="🌐" 
    title="Perplexity AI"
    description="即時網路資訊，最新趨勢整合"
    features={["網路搜尋", "引用來源", "即時資訊"]}
    cost="依使用量計費"
  />
</ServiceSelector>
```

### 動態模型選擇
- **OpenAI**: 只顯示 GPT-4o，無需選擇
- **Perplexity**: 顯示 Sonar、Sonar Pro、Sonar Reasoning 選項

### 統一結果展示
- **條件式渲染**: 根據使用的服務顯示對應的結果格式
- **OpenAI 結果**: 詳細分析、技術參數、風格建議
- **Perplexity 結果**: 引用來源、成本明細、網路資訊

## 📱 頁籤整合方案

### 移除現有頁籤
- ❌ 移除 'optimize' 頁籤 (OpenAI 傳統最佳化)
- ❌ 移除 'perplexity' 頁籤 (Perplexity 最佳化)
- ✅ 新增 'optimize' 頁籤 (統一最佳化介面)

### App.tsx 修改
```tsx
// 舊的頁籤
type TabType = 'generate' | 'optimize' | 'perplexity' | 'cacheTest';

// 新的頁籤 (移除 perplexity)
type TabType = 'generate' | 'optimize' | 'cacheTest';
```

## 🔄 分階段開發計劃

### Phase 1: 核心架構建立 (3-4 天)
1. **建立統一型別系統**
   - 建立 `UnifiedOptimizationResult` 型別
   - 更新 `types/promptOptimizer.ts`
   - 確保向後相容性

2. **建立 UnifiedPromptOptimizer 元件**
   - 基本架構和狀態管理
   - 五步驟流程導航
   - 服務選擇邏輯

3. **建立 ServiceSelector 元件**
   - 視覺化服務選擇器（重用 ProviderSelector 概念）
   - 服務特色展示
   - 預設服務設定

### Phase 2: 服務整合 (3-4 天)
1. **建立服務提供商抽象層**
   - `OpenAIOptimizationProvider` 
   - `PerplexityOptimizationProvider`
   - 統一 `optimize()` 方法回傳 `UnifiedOptimizationResult`

2. **重構現有服務邏輯**
   - 從 `PromptOptimizer` 抽取 OpenAI 邏輯
   - 從 `EnhancedPromptOptimizer` 抽取 Perplexity 邏輯
   - 確保結果格式統一

3. **建立統一結果展示**
   - `UnifiedOptimizedPromptDisplay` 元件
   - 條件式渲染邏輯（基於 provider）
   - 整合現有的兩種展示格式

### Phase 3: 整合與清理 (2-3 天)
1. **App.tsx 整合**
   - 移除 'perplexity' 頁籤
   - 更新 'optimize' 頁籤使用新元件
   - 簡化型別處理

2. **清理舊檔案**
   - 移除 `EnhancedPromptOptimizer.tsx`
   - 移除 `EnhancedPromptOptimizer2.tsx` 
   - 移除重複的 Display 元件
   - 更新 `index.ts` 匯出

3. **測試與文件**
   - 確保所有功能正常運作
   - 更新元件文件
   - E2E 測試調整

## 📊 資料流程設計

### 統一狀態管理
```tsx
interface UnifiedOptimizerState {
  // 流程控制
  currentStep: 'service' | 'purpose' | 'content' | 'model' | 'result';
  
  // 服務選擇
  selectedService: 'openai' | 'perplexity';
  
  // 共用狀態 (使用現有類型)
  selectedPurpose: ImagePurposeType | null;
  contentInput: ContentInput;
  
  // 服務特定狀態
  selectedModel: string; // 'gpt-4o' 或 PerplexityModel
  
  // 結果狀態 (統一回傳格式)
  optimizedResult: UnifiedOptimizationResult | null;
  isLoading: boolean;
  error: string | null;
  
  // 成本狀態 (Perplexity 專用)
  estimatedCost?: number;
}
```

### API 統一介面
```tsx
// 新增統一回傳格式
interface UnifiedOptimizationResult {
  // 基本識別
  provider: 'openai' | 'perplexity';
  model: string;
  timestamp: number;
  
  // 統一提示詞格式
  original: string;
  optimized: {
    chinese: string;
    english: string;
  };
  optimizedPrompt: string; // 向後相容性
  
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
  
  // 條件式欄位
  citations?: PerplexityCitation[]; // Perplexity 專用
  cost?: number; // Perplexity 專用
  styleModifiers?: string[]; // OpenAI 專用
  
  // 匯出資料
  exportData: {
    markdown: string;
  };
}
```

## 🧪 測試策略

### 單元測試
- UnifiedPromptOptimizer 元件測試
- ServiceSelector 互動測試
- 服務包裝器邏輯測試
- 統一結果展示測試

### 整合測試
- 完整工作流程測試
- 服務切換測試
- 錯誤處理測試
- 快取機制測試

### E2E 測試
- 使用者完整操作流程
- 不同服務選擇情境
- 頁籤整合測試

## 🔧 技術實作細節

### 服務抽象層
```tsx
// 統一的最佳化提供商介面
interface OptimizationProvider {
  name: string;
  optimize(content: ContentInput, purpose: ImagePurposeType, model?: string): Promise<UnifiedOptimizationResult>;
  getAvailableModels(): ModelOption[];
  estimateCost?(content: string, model?: string): Promise<number>;
}

// OpenAI 實作
class OpenAIOptimizationProvider implements OptimizationProvider {
  async optimize(content: ContentInput, purpose: ImagePurposeType): Promise<UnifiedOptimizationResult> {
    // 重用現有的 gpt4oOptimizer 邏輯
    // 轉換結果為 UnifiedOptimizationResult 格式
  }
  
  getAvailableModels() {
    return [{ value: 'gpt-4o', label: 'GPT-4o', description: '強大的多模態模型' }];
  }
}

// Perplexity 實作  
class PerplexityOptimizationProvider implements OptimizationProvider {
  async optimize(content: ContentInput, purpose: ImagePurposeType, model = 'sonar'): Promise<UnifiedOptimizationResult> {
    // 重用現有的 PerplexityOptimizer 邏輯
    // 轉換結果為 UnifiedOptimizationResult 格式
  }
  
  getAvailableModels() {
    return [
      { value: 'sonar', label: 'Sonar', description: '快速且經濟' },
      { value: 'sonar-pro', label: 'Sonar Pro', description: '深度分析' },
      // ...
    ];
  }
  
  async estimateCost(content: string, model?: string): Promise<number> {
    // 重用現有的成本計算邏輯
  }
}
```

### 錯誤處理策略
- **網路錯誤**: 統一錯誤訊息和重試機制
- **API 限制**: 清楚的限制說明和解決方案
- **服務切換**: 無縫的降級機制

### 效能最佳化
- **懶載入**: 按需載入服務提供商
- **記憶化**: 快取昂貴的計算結果
- **防抖動**: 避免頻繁的 API 呼叫

## 📝 文件更新需求

### 使用者文件
- 更新 README.md 的功能說明
- 建立統一最佳化使用指南
- 更新環境變數設定說明

### 開發者文件
- 更新元件結構文件
- API 整合指南更新
- 測試指南更新

## 🚀 部署與發布

### 分支策略
1. **開發分支**: `feature/unified-prompt-optimizer`
2. **測試合併**: 合併到 `develop` 分支
3. **生產發布**: 經測試後合併到 `main` 分支

### 版本控制
- **語義版本**: v1.1.0 (新功能整合)
- **變更記錄**: 詳細記錄統一功能的變更
- **遷移指南**: 為現有使用者提供功能遷移說明

## 📊 成功指標

### 功能指標
- ✅ 單一介面整合完成
- ✅ 兩種服務無縫切換
- ✅ 結果展示準確性 100%
- ✅ 所有現有功能保持完整

### 效能指標
- 📈 介面響應時間 < 200ms
- 📈 API 呼叫成功率 > 95%
- 📈 使用者操作流暢度改善
- 📈 程式碼重複度降低 > 30%

### 使用者體驗指標
- 👥 操作步驟從 8 步簡化到 5 步
- 👥 學習曲線降低
- 👥 功能發現性提升
- 👥 整體滿意度提升

## ⚠️ 風險評估與緩解

### 技術風險
1. **型別相容性**: 統一 `OptimizedPrompt` 和 `PerplexityOptimizationResult`
   - **緩解**: 建立 `UnifiedOptimizationResult` 作為中間格式，保持向後相容

2. **現有功能破壞**: 重構可能影響現有使用者
   - **緩解**: 保留現有 API 介面，逐步遷移

3. **效能影響**: 新的統一層可能增加複雜度
   - **緩解**: 保持輕量級包裝，重用現有邏輯

### 實作風險
1. **狀態管理複雜性**: 五步驟流程的狀態同步
   - **緩解**: 使用成熟的狀態管理模式，清晰的狀態機

2. **現有檔案清理**: 可能遺漏相依性
   - **緩解**: 系統性檢查所有 import 和 export

### 使用者風險
1. **學習成本**: 統一介面可能與使用者習慣不同
   - **緩解**: 保持現有操作邏輯，漸進式整合

2. **功能發現性**: 合併後功能可能較難找到
   - **緩解**: 清晰的服務選擇引導和說明

## 📅 開發時程表

### 週次安排
- **Week 1 (Day 1-3)**: Phase 1 - 核心架構
- **Week 1 (Day 4-5)**: Phase 2 開始 - 服務整合
- **Week 2 (Day 1-3)**: Phase 2 完成 - 服務整合
- **Week 2 (Day 4-5)**: Phase 3 - 整合與最佳化

### 里程碑檢查點
- **Day 3**: 核心架構完成，基本介面可運行
- **Day 7**: 服務整合完成，兩種服務都可使用
- **Day 10**: 完整功能實作完成，進入測試階段

---

## 🎉 預期成果

完成此功能後，BlogImageAI 將擁有：

1. **統一的提示詞最佳化介面** - 簡化使用者體驗
2. **彈性的服務選擇** - 根據需求選擇最適合的 AI 服務
3. **最佳化的程式碼結構** - 減少重複，提高維護性
4. **增強的功能發現性** - 使用者更容易找到和使用功能
5. **為未來擴展奠定基礎** - 容易新增更多 AI 服務

這個整合將大幅提升 BlogImageAI 的使用者體驗和競爭力，為平台的持續發展奠定堅實基礎。

---

**開發團隊**: GitHub Copilot + 使用者協作  
**建立時間**: 2025年6月28日  
**狀態**: 📝 等待開發批准  
**預計完成**: 2025年7月中旬
