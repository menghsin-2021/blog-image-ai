# Perplexity 提示詞最佳化功能使用指南

## 概述

BlogImageAI 現在整合了 Perplexity AI 作為提示詞最佳化的新選項。Perplexity 提供即時網路搜尋能力，能夠生成更準確、更具時效性的圖片生成提示詞。

## 功能特色

### 🔍 即時網路搜尋
- 使用最新的網路資訊來最佳化提示詞
- 自動搜尋相關的視覺參考和趨勢
- 提供基於最新資料的建議

### 📚 引用來源
- 顯示所有參考來源的連結
- 透明的資訊追溯
- 側邊欄展示引用詳情

### 💰 即時成本估算
- 透明的成本計算
- 按照不同模型顯示預估費用
- 無成本限制，完全透明

### 🎯 多種 Sonar 模型
- **Sonar**: 適合一般內容，速度快
- **Sonar Pro**: 適合複雜內容，品質更佳  
- **Sonar Reasoning**: 適合需要深度分析的專業內容

> **模型更新說明**: Perplexity 已簡化模型名稱，從 `llama-3.1-sonar-*-128k-online` 格式更新為簡潔的 `sonar*` 格式。

## 設定步驟

### 1. 取得 Perplexity API 金鑰

1. 前往 [Perplexity AI 官網](https://www.perplexity.ai/)
2. 註冊帳號並前往 API 設定頁面
3. 取得您的 API 金鑰

### 2. 環境變數設定

複製 `.env.example` 為 `.env` 並設定以下變數：

```bash
# Perplexity API 設定
VITE_PERPLEXITY_API_KEY=your_perplexity_api_key_here
VITE_PERPLEXITY_DEFAULT_MODEL=sonar
VITE_PERPLEXITY_MAX_TOKENS=2000
VITE_PERPLEXITY_TIMEOUT=30000
```

### 3. 重新啟動開發伺服器

```bash
npm run dev
```

## 使用方式

### 基本使用流程

1. **選擇圖片用途**
   - 首頁橫幅圖片
   - 段落說明圖片  
   - 內容總結圖片

2. **輸入部落格內容**
   - 文章標題 (可選)
   - 主要內容 (必填)
   - 關鍵字 (可選)
   - 目標讀者 (可選)

3. **選擇 AI 服務**
   - 選擇 Perplexity (預設) 或 OpenAI
   - 選擇適合的模型
   - 查看預估成本

4. **查看結果**
   - 最佳化後的提示詞
   - 引用來源 (側邊欄)
   - 成本明細
   - 應用到圖片生成

### 模型選擇建議

#### Sonar (預設)
- ✅ 適用於：一般部落格文章、基礎內容
- ⚡ 特點：快速回應、成本較低
- 💰 成本：約 $0.02-0.05 每次查詢
- 🔧 **模型名稱**: `sonar`

#### Sonar Pro  
- ✅ 適用於：複雜內容、專業文章
- 🎯 特點：更深度的分析、更準確的建議
- 💰 成本：約 $0.05-0.10 每次查詢
- 🔧 **模型名稱**: `sonar-pro`

#### Sonar Reasoning
- ✅ 適用於：技術文章、研究內容、需要深度思考的主題
- 🧠 特點：邏輯推理、多步驟分析
- 💰 成本：約 $0.10-0.20 每次查詢
- 🔧 **模型名稱**: `sonar-reasoning`

> **重要更新**: Perplexity API 已更新模型名稱格式。如果您在程式碼中直接使用模型名稱，請使用新的簡化格式（如 `sonar-pro`）而非舊格式（如 `llama-3.1-sonar-large-128k-online`）。

## 輸出格式

### 最佳化結果包含

1. **基本資訊**
   - 原始提示詞
   - 最佳化後的提示詞
   - 改善建議列表

2. **分析資料**
   - 關鍵字提取
   - 主題分類
   - 複雜度評估

3. **技術參數**
   - 建議的圖片比例
   - 品質設定
   - 風格建議

4. **Perplexity 特有功能**
   - 引用來源列表
   - 搜尋查詢次數
   - 詳細成本分析

### 引用來源格式

每個引用包含：
- 文章標題
- 來源網址
- 相關性評分
- 引用的具體內容片段

## 故障排除

### 常見問題

#### API 金鑰錯誤
```
錯誤: 無效的 Perplexity API 金鑰
解決: 檢查 .env 檔案中的 VITE_PERPLEXITY_API_KEY 設定
```

#### 請求超時
```
錯誤: 請求超時
解決: 增加 VITE_PERPLEXITY_TIMEOUT 值或檢查網路連線
```

#### 模型不可用
```
錯誤: Invalid model 'llama-3.1-sonar-large-128k-online'
解決: 使用新的模型名稱格式 (sonar, sonar-pro, sonar-reasoning)
```

#### API 格式更新
```
錯誤: 使用舊的模型名稱格式
解決: 更新為新的簡化格式：
- 舊格式: llama-3.1-sonar-large-128k-online
- 新格式: sonar-pro
```

### 偵錯模式

設定 `VITE_DEBUG_MODE=true` 可以：
- 查看詳細的 API 請求記錄
- 顯示完整的錯誤訊息
- 存取額外的測試功能

## API 限制與建議

### 使用限制
- 每分鐘最多 60 次請求
- 每次請求最多 4000 tokens
- 搜尋功能每天有配額限制

### 最佳實務
1. **內容長度控制**: 建議單次輸入不超過 1000 字
2. **模型選擇**: 根據內容複雜度選擇適當模型
3. **快取使用**: 系統會快取結果，避免重複請求
4. **錯誤處理**: 發生錯誤時會自動降級到基本模式

## 範例使用場景

### 場景 1: 科技部落格文章
```
輸入: "介紹 React 18 的新功能：Suspense 和 Concurrent Features..."
模型: Sonar Pro
輸出: 包含最新 React 18 資訊和相關視覺隱喻的提示詞
```

### 場景 2: 旅遊部落格
```
輸入: "2024年京都賞櫻攻略，推薦景點和最佳時間..."
模型: Sonar
輸出: 結合當年度賞櫻資訊的美麗視覺提示詞
```

### 場景 3: 學術研究文章
```
輸入: "機器學習在醫療診斷中的應用與挑戰..."
模型: Sonar Reasoning
輸出: 深度分析後的專業、準確的醫療相關視覺提示詞
```

## 版本更新說明

### v1.0.0 (目前版本)
- ✅ 基礎 Perplexity 整合
- ✅ 三種 Sonar 模型支援
- ✅ 即時成本估算
- ✅ 引用來源展示
- ✅ 與現有 OpenAI 功能並存

### 計劃中的功能
- 🔄 多語言提示詞產生
- 📊 使用統計和分析
- 🎨 更多視覺風格選項
- 🔗 與其他 AI 服務整合

## 技術支援

如有問題，請：
1. 檢查控制台的錯誤訊息
2. 確認環境變數設定正確
3. 查看網路連線狀態
4. 聯絡開發團隊

---

**注意**: 使用 Perplexity API 會產生費用，請根據您的使用需求選擇適當的模型和使用頻率。
