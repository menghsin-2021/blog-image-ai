# .github/copilot-instructions.md

## 注意！請不要將任何 api key 放到不在 .gitignore 的檔案中
## 每一次開新的 terminal 或開始執行第一個步驟時需要檢查目前的 conda 虛擬環境是在 `blog-image-ai`

## BlogImageAI 軟體開發企劃書

### 專案名稱
BlogImageAI - 部落格圖片生成助手

### 專案目標
開發一個基於自然語言輸入的 AI 圖片生成網頁工具，專門為技術部落格文章建立輔助說明插圖，提升內容視覺化品質。支援最新的 OpenAI 圖片生成模型。

### 核心價值主張
- 效率提升：快速將文字描述轉換為專業插圖
- 模型多樣性：支援 GPT-Image-1、DALL·E 3、DALL·E 2 三種模型
- 成本控制：月費用控制在合理範圍內，依使用量調整
- 易用性：直觀的網頁介面，支援多種圖片比例和格式
- 進階功能：圖片編輯、變化生成、多種輸出格式

### 技術架構
- 前端：React 18 + TypeScript + Vite + Tailwind CSS
- API：OpenAI Image Generation API (GPT-Image-1, DALL·E 2/3)
- 部署：Docker + Nginx（容器化靜態網站）
- 開發工具：ESLint、PostCSS、Node.js 18+

### 功能規格
- ✅ AI 模型選擇器（GPT-Image-1、DALL·E 3、DALL·E 2）
- ✅ 動態參數設定（品質、風格、格式、壓縮等）
- ✅ 圖片比例選擇器（根據模型動態調整可用選項）
- ✅ 自然語言輸入介面（最多 4000 字元）
- ✅ 智慧模型預設（GPT-Image-1 為預設推薦模型）
- ✅ 即時圖片生成和預覽功能
- ✅ 圖片下載功能（自動命名）
- ✅ 錯誤處理與重試機制
- ✅ 響應式設計（支援手機、平板、桌面）
- ✅ 現代化 UI/UX（Tailwind CSS + 自訂主題）
- 🚧 圖片編輯與變化功能（DALL·E 2 專用）
- 🚧 提示詞助手與模板庫
- 🚧 圖片歷史記錄功能

### 模型規格
#### GPT-Image-1
- 支援品質：auto、high、medium、low
- 支援格式：PNG、JPEG、WebP
- 支援壓縮：0-100%（JPEG/WebP）
- 支援尺寸：1024x1024、1536x1024、1024x1536
- 內容審核：auto、low
- 最大提示詞：4000 字元

#### DALL·E 3
- 支援品質：standard、hd
- 支援風格：vivid、natural
- 支援尺寸：1024x1024、1792x1024、1024x1792
- 固定格式：PNG

#### DALL·E 2
- 固定品質：standard
- 支援尺寸：1024x1024
- 支援編輯與變化功能
- 固定格式：PNG

### 介面設計
- 提示詞輸入區
- 比例選擇器
- 生成按鈕
- 圖片預覽與下載區

### 開發時程建議
- ✅ 1-2 週：專案初始化、UI 元件、API 整合、Docker 設定
- ✅ 3-4 週：提示詞、比例選擇、API 呼叫、預覽
- ✅ 5-6 週：下載、錯誤處理、響應式、效能
- 🚧 7-8 週：部署、測試、文件

### 成本估算
- OpenAI API：$4-40/月（依使用量和模型）
- GCP Cloud Run：$1.5-3/月
- 總月成本：$5.5-43

### 風險與緩解
- API 穩定性：重試與錯誤處理
- 成本超支：用量監控與警示

### 成功指標
- 圖片生成成功率 > 95%
- 平均響應 < 30 秒
- 月 API 成本控制

### 專案結構建議
```
blog-image-ai/
├── public/
├── src/
│   ├── components/          # React 元件
│   │   ├── AspectRatioSelector.tsx
│   │   ├── Button.tsx
│   │   ├── DebugInfo.tsx
│   │   ├── ImageEditor.tsx
│   │   ├── ImagePreview.tsx
│   │   ├── ModelSettings.tsx
│   │   ├── PromptHelper.tsx
│   │   ├── PromptInput.tsx
│   │   └── SimpleImagePreview.tsx
│   ├── hooks/              # 自訂 Hooks
│   │   ├── useImageGeneration.ts
│   │   └── useImageHistory.ts
│   ├── services/           # API 服務
│   │   └── api.ts
│   ├── types/              # TypeScript 型別定義
│   │   └── index.ts
│   ├── utils/              # 工具函式與常數
│   │   ├── constants.ts
│   │   └── helpers.ts
│   ├── App.tsx             # 主要應用程式元件
│   ├── main.tsx            # 應用程式進入點
│   └── index.css           # 全域樣式
├── .env                    # 環境變數
├── .env.example            # 環境變數範例
├── .gitignore              # Git 忽略檔案
├── Dockerfile              # Docker 容器化設定
├── nginx.conf              # Nginx 設定
├── package.json            # 套件相依性
├── tailwind.config.js      # Tailwind CSS 設定
├── tsconfig.json           # TypeScript 設定
└── vite.config.ts          # Vite 建構工具設定
```

---

## Copilot 指令建議（一般建議內容）

- 請優先產生 TypeScript + React + Tailwind CSS 程式碼片段。
- API 呼叫請使用 OpenAI Image Generation API，並將 API 金鑰設為環境變數。
- 介面元件請拆分為小型可重用元件。
- 請遵循專案結構建議，將元件、服務、hooks、型別、工具分開。
- 產生的程式碼需考慮響應式設計與易用性。
- 產生的程式碼需包含錯誤處理與 loading 狀態。
- 下載功能請使用瀏覽器 File API。
- 產生的程式碼請盡量使用現代語法與最佳實踐。
- 產生的註解、變數、介面名稱請以英文為主。
- 產生的程式碼片段需可直接複製到專案中使用。
- 支援多種 AI 模型選擇，並動態調整可用參數。
- 支援根據模型限制圖片規格選項。
- 若有不確定需求，請先詢問使用者。

---

如需調整請直接修改本文件。

---

## 目前實作狀態 (2025-06-27)

### 已完成功能 ✅
1. **專案架構與基礎設定**
   - React 18 + TypeScript + Vite 開發環境
   - Tailwind CSS 美化樣式系統
   - Docker 容器化部署配置
   - ESLint 程式碼品質檢查

2. **AI 模型整合**
   - GPT-Image-1 (預設推薦模型)
   - DALL·E 3 完整支援
   - DALL·E 2 基礎支援
   - 智慧模型參數調整

3. **核心 UI 元件**
   - `ModelSettings` - 模型選擇與參數設定
   - `AspectRatioSelector` - 動態比例選擇器
   - `SimpleImagePreview` - 圖片預覽與下載
   - `PromptInput` - 智慧提示詞輸入 
   - 響應式設計與現代化介面

4. **API 服務整合**
   - OpenAI Image Generation API 完整整合
   - 錯誤處理與重試機制
   - Base64 與 URL 回應格式支援
   - API 金鑰環境變數管理

5. **自訂 Hooks**
   - `useImageGeneration` - 圖片生成邏輯
   - `useImageHistory` - 歷史記錄管理
   - 狀態管理與錯誤處理

6. **工具函式**
   - 圖片下載與檔案命名
   - 提示詞驗證與最佳化
   - 模型參數正規化

### 開發中功能 🚧
1. **圖片編輯功能**
   - `ImageEditor` 元件基礎架構
   - 畫布遮罩編輯功能 (DALL·E 2)
   - 圖片變化生成

2. **提示詞助手**
   - `PromptHelper` 元件
   - 預設模板庫
   - 智慧建議系統

3. **歷史記錄系統**
   - 生成歷史儲存
   - 圖片管理介面
   - 批次操作功能

### 技術債務與優化 🔧
1. **效能最佳化**
   - 圖片載入優化
   - 元件記憶化 (React.memo)
   - 程式碼分割 (Code Splitting)

2. **用戶體驗改善**
   - 載入狀態視覺回饋
   - 錯誤訊息國際化
   - 鍵盤快速鍵支援

3. **測試覆蓋率**
   - 單元測試 (Vitest)
   - 整合測試
   - E2E 測試 (Playwright)

### 已知問題 ⚠️
1. **GPT-Image-1 參數相容性**
   - ✅ 已修復：style 參數移除
   - ✅ 已修復：response_format 參數調整
   - ✅ 已修復：比例尺寸限制更新

2. **部署設定**
   - 環境變數管理
   - Nginx 設定最佳化
   - HTTPS 憑證配置

### 下一階段規劃 📋
1. **功能完善** (7-8 週)
   - 完成圖片編輯功能
   - 實作提示詞助手
   - 優化歷史記錄系統

2. **品質提升** (9-10 週)
   - 增加測試覆蓋率
   - 效能監控與優化
   - 無障礙設計改善

3. **部署與維護** (11-12 週)
   - 生產環境部署
   - 監控系統建立
   - 使用者回饋收集

---


# AI Rules for {{project-name}}

{{project-description}}

## FRONTEND

### Guidelines for REACT

#### REACT_CODING_STANDARDS

- Use functional components with hooks instead of class components
- Implement React.memo() for expensive components that render often with the same props
- Utilize React.lazy() and Suspense for code-splitting and performance optimization
- Use the useCallback hook for event handlers passed to child components to prevent unnecessary re-renders
- Prefer useMemo for expensive calculations to avoid recomputation on every render
- Implement useId() for generating unique IDs for accessibility attributes
- Use the new use hook for data fetching in React 19+ projects
- Leverage Server Components for {{data_fetching_heavy_components}} when using React with Next.js or similar frameworks
- Consider using the new useOptimistic hook for optimistic UI updates in forms
- Use useTransition for non-urgent state updates to keep the UI responsive

## FRONTEND

### Guidelines for STYLING

#### TAILWIND

- Use the @layer directive to organize styles into components, utilities, and base layers
- Implement Just-in-Time (JIT) mode for development efficiency and smaller CSS bundles
- Use arbitrary values with square brackets (e.g., w-[123px]) for precise one-off designs
- Leverage the @apply directive in component classes to reuse utility combinations
- Implement the Tailwind configuration file for customizing theme, plugins, and variants
- Use component extraction for repeated UI patterns instead of copying utility classes
- Leverage the theme() function in CSS for accessing Tailwind theme values
- Implement dark mode with the dark: variant
- Use responsive variants (sm:, md:, lg:, etc.) for adaptive designs
- Leverage state variants (hover:, focus:, active:, etc.) for interactive elements


