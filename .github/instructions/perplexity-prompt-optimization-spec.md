# 提示詞最佳化 Perplexity API 整合功能規格書

**功能名稱**: Perplexity API 提示詞最佳化服務  
**版本**: v1.0  
**建立日期**: 2025-01-27  
**狀態**: 📋 規格設計階段  

---

## 🎯 功能概述

### 目標
在現有的 GPT-4o 提示詞最佳化功能基礎上，新增 Perplexity Sonar API 作為替代選項，提供基於即時網路搜尋的提示詞最佳化服務，特別適合需要最新資訊和引用來源的部落格圖片生成需求。

### 核心價值
- **即時性**: 基於最新網路資訊進行提示詞最佳化
- **引用支持**: 提供可信來源和引用連結
- **成本優勢**: 相較於 GPT-4o 更具成本效益
- **多樣選擇**: 給使用者更多 AI 服務選項

---

## 🔍 Perplexity API 研究摘要

### API 服務概況
- **發布時間**: 2025年1月21日 (全新的 Sonar API)
- **定位**: 市場上最便宜的搜尋 AI API
- **特色**: 即時網路連接、引用來源、成本優化

### 可用模型

#### 1. **Sonar** (基礎版)
- **用途**: 輕量級、快速回答
- **價格**: 
  - Input: $1/百萬 tokens
  - Output: $1/百萬 tokens  
  - 搜尋查詢: $5/1,000 次
- **適用場景**: 簡單的提示詞最佳化

#### 2. **Sonar Pro** (進階版)
- **用途**: 複雜查詢、深度理解
- **價格**:
  - Input: $3/百萬 tokens
  - Output: $15/百萬 tokens
  - 搜尋查詢: $5/1,000 次
- **適用場景**: 專業部落格內容分析

#### 3. **Sonar Reasoning** (推理版)
- **用途**: 多步驟推理、問題解決
- **價格**:
  - Input: $1/百萬 tokens
  - Output: $5/百萬 tokens
  - 搜尋查詢: $5/1,000 次

#### 4. **Sonar Deep Research** (深度研究版)
- **用途**: 詳盡研究、專家級分析
- **價格**:
  - Input: $2/百萬 tokens
  - Inference: $3/百萬 tokens
  - Output: $8/百萬 tokens
  - 搜尋查詢: $5/1,000 次

---

## 🛠️ 技術架構設計

### API 整合方式
- **相容性**: 支援 OpenAI SDK 格式
- **端點**: `https://api.perplexity.ai/chat/completions`
- **認證**: Bearer Token (API Key)
- **格式**: 標準 REST API

### 程式碼架構
```typescript
// 新增服務檔案
src/services/
├── perplexityOptimizer.ts    // Perplexity API 最佳化服務
├── promptOptimizerFactory.ts // 統一的最佳化工廠

// 更新現有檔案
src/components/PromptOptimizer/
├── ProviderSelector.tsx      // AI 服務選擇器
├── OptimizedPromptDisplay.tsx // 支援多提供商結果

// 設定檔案
src/utils/
├── perplexityConstants.ts    // Perplexity 相關常數
```

---

## 🎨 使用者介面設計

### 1. AI 服務選擇器
```typescript
type OptimizationProvider = 'openai' | 'perplexity';

interface ProviderOption {
  id: OptimizationProvider;
  name: string;
  description: string;
  icon: string;
  pricing: string;
  features: string[];
}
```

### 2. Perplexity 模型選擇
- 根據使用場景推薦適合的模型
- 顯示預估成本和響應時間
- 提供模型特性說明

### 3. 結果展示增強
- 顯示引用來源連結
- 標示基於即時資訊的內容
- 成本透明度顯示

---

## 📊 功能規格詳細設計

### Phase 1: 基礎整合 (預估 1-2 週)

#### 1.1 Perplexity API 服務建立
```typescript
// 新增 PerplexityOptimizer 類別
class PerplexityOptimizer {
  async optimizePrompt(content: string, model: PerplexityModel): Promise<OptimizationResult>
  async analyzeBlogContent(content: string): Promise<ContentAnalysis>
}
```

#### 1.2 多提供商支援架構
```typescript
// 統一介面
interface PromptOptimizer {
  provider: 'openai' | 'perplexity';
  optimize(request: OptimizationRequest): Promise<OptimizationResult>;
}
```

#### 1.3 UI 元件更新
- 在 `PromptOptimizer` 元件中加入服務選擇器
- 更新 `OptimizedPromptDisplay` 支援引用顯示

### Phase 2: 進階功能 (預估 1-2 週)

#### 2.1 智慧模型推薦
- 根據內容類型自動推薦適合的 Perplexity 模型
- 成本效益分析和建議

#### 2.2 引用來源整合
- 解析並顯示 Perplexity 回應中的引用
- 可點擊連結到原始來源

#### 2.3 比較功能
- 同時使用 GPT-4o 和 Perplexity 生成最佳化結果
- 並列顯示比較

### Phase 3: 優化與增強 (預估 1 週)

#### 3.1 快取機制
- 類似內容的快取策略
- 降低 API 呼叫成本

#### 3.2 成本監控
- 即時成本計算和顯示
- 使用量統計和警告

---

## 💰 成本分析

### Perplexity vs GPT-4o 成本比較
| 服務 | 模型 | Input Token 成本 | Output Token 成本 | 額外費用 |
|------|------|------------------|-------------------|----------|
| **Perplexity** | Sonar | $1/M | $1/M | $5/1K 搜尋 |
| **Perplexity** | Sonar Pro | $3/M | $15/M | $5/1K 搜尋 |
| **OpenAI** | GPT-4o | $2.5/M | $10/M | - |

### 使用場景成本預估
```typescript
// 典型提示詞最佳化請求
const typicalRequest = {
  inputTokens: 1500,    // 部落格內容
  outputTokens: 800,    // 最佳化結果
  searchQueries: 3      // 搜尋次數
};

// Sonar: $0.004 per request
// GPT-4o: $0.012 per request
// 成本節省: ~67%
```

---

## ⚙️ 環境變數設定

```bash
# .env.example 新增
# Perplexity API 設定
PERPLEXITY_API_KEY=your_perplexity_api_key_here
PERPLEXITY_DEFAULT_MODEL=sonar-pro
PERPLEXITY_MAX_TOKENS=2000
PERPLEXITY_TIMEOUT=30000
```

---

## 🔒 安全性考量

### API 金鑰管理
- 確保 Perplexity API 金鑰在環境變數中
- 不在客戶端暴露 API 金鑰
- 實作 API 金鑰輪換機制

### 成本控制
- 設定每日/每月使用限額
- 實作異常使用警告
- 提供使用量儀表板

---

## 🧪 測試策略

### 單元測試
- Perplexity API 呼叫測試
- 回應解析測試
- 錯誤處理測試

### 整合測試
- 與現有提示詞最佳化流程整合
- UI 元件互動測試

### 效能測試
- 回應時間測試
- 並發請求測試
- 成本效益測試

---

## 📋 待確認需求

在開始開發前，需要確認以下細節：

### 1. **功能範圍確認**
- 是否要同時支援 GPT-4o 和 Perplexity，還是完全替換？
- 是否需要比較功能 (並列顯示兩種結果)？
- 預設建議使用哪個服務？

### 2. **模型選擇策略**
- 是否需要自動根據內容複雜度選擇 Perplexity 模型？
- 使用者是否可以手動選擇模型？
- 預設推薦哪個 Perplexity 模型？

### 3. **使用者體驗設計**
- 引用來源要如何展示？(彈窗、側邊欄、內嵌連結)
- 是否需要顯示即時成本估算？
- 是否需要保存歷史記錄以供比較？

### 4. **成本控制需求**
- 是否需要設定使用限額和警告？
- 是否需要成本追蹤儀表板？
- 如何處理 API 費用超支的情況？

### 5. **技術整合方式**
- 是否要保持現有 UI 結構，只在後端整合？
- 是否需要 A/B 測試功能來比較兩種服務效果？
- 對錯誤處理和降級機制有什麼特殊要求？

---

## 🚀 開發時程預估

| 階段 | 工作內容 | 預估時間 | 交付成果 |
|------|----------|----------|----------|
| **需求確認** | 細節討論和規格最終化 | 2-3 天 | 確定的功能規格 |
| **Phase 1** | 基礎 Perplexity API 整合 | 1-2 週 | 可用的 Perplexity 最佳化 |
| **Phase 2** | 進階功能和 UI 增強 | 1-2 週 | 完整的多提供商支援 |
| **Phase 3** | 優化、測試和部署 | 1 週 | 生產就緒版本 |

**總開發時間**: 3-5 週

---

## ✅ 需求確認結果

**基於用戶確認的需求**:

1. **功能範圍**: Perplexity 為預設，GPT-4o 作為替代選項
2. **模型策略**: 
   - 預設: `Sonar` (成本最佳化)
   - 可選: `Sonar Pro`, `Sonar Reasoning`
3. **UI 設計**:
   - 引用來源: 側邊欄展示
   - 即時成本顯示: 啟用
   - 成本控制: 不需要
4. **整合方式**: 更新 UI 展示 Perplexity 特色功能

## 📝 下一步行動

1. ✅ **已確認**: 需求細節已明確
2. **立即開始**: 建立功能分支 `feature/perplexity-optimization`
3. **開發順序**: 按 Phase 1 → 2 → 3 逐步實作

---

**備註**: 此規格書基於 2025年1月最新的 Perplexity Sonar API 資訊，實際實作時可能需要根據 API 的最新變化進行調整。
