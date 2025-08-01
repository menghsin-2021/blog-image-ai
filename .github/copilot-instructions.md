# .github/copilot-instructions.md

## ⚠️ 開發流程重要提醒 ⚠️

### 🔐 安全性規則
- **絕對禁止**：不要將任何 API key 放到不在 .gitignore 的檔案中
- **環境變數**：所有敏感資訊必須使用 .env 檔案管理
- **版本控制**：確保 .env 檔案已加入 .gitignore

### 🌿 分支管理規則
- **開始新任務前**：必須確認目前在正確的分支上
- **新功能開發**：必須建立 `feature/*` 分支進行開發
- **功能完成後**：建立 Pull Request 合併回 develop 分支

### 📋 功能開發流程 (必須依序執行)
1. **建立功能分支** - 從 develop 建立 feature 分支
2. **制定功能規格** - 建立詳細的 spec 文件到 `.github/instructions/`
3. **更新專案狀態** - 在本檔案中記錄功能為開發中狀態
4. **分階段實作** - 按照 Phase 1, 2, 3 逐步開發和測試
5. **容器化測試** - 使用 `./start-server.sh dev` 啟動容器測試
6. **CI 風格檢查** - 執行 `npm run format:check` 確保程式碼格式正確
7. **記錄變更** - 建立變更記錄檔案到 `.github/change_log/`
8. **提交變更** - 遵循 commit 訊息規範提交程式碼

### 🐍 Python 環境檢查 (如需要)
- **每次開新 terminal**：檢查 conda 虛擬環境是否在 `blog-image-ai`
- **環境啟動**：`conda activate blog-image-ai`

### 🐳 容器化開發
- **推薦測試方式**：使用 Docker 容器進行開發和測試
- **啟動指令**：`./start-server.sh dev` (開發模式)
- **服務地址**：http://localhost:3000 (開發環境)

### 🔍 CI 品質檢查規則 (上版前必須執行)
- **程式碼格式檢查**：執行 `npm run format:check` 或 `npx prettier --check "src/**/*.{ts,tsx,js,jsx,json,css,md}"`
- **程式碼風格修正**：如有格式問題，執行 `npm run format` 或 `npx prettier --write "src/**/*.{ts,tsx,js,jsx,json,css,md}"`
- **ESLint 檢查**：執行 `npm run lint` 確保程式碼品質
- **TypeScript 檢查**：執行 `npm run type-check` 確保型別正確性
- **測試執行**：執行 `npm run test` 確保所有測試通過
- **建構驗證**：執行 `npm run build` 確保專案可正常建構
- **⚠️ 重要**：所有 CI 檢查必須通過後才能建立 Pull Request 或合併程式碼

---

## 注意！請不要將任何 api key 放到不在 .gitignore 的檔案中
## 每一次開新的 terminal 或開始執行第一個步驟時需要檢查目前的 conda 虛擬環境是在 `blog-image-ai`
## 每次開啟新任務需確認是否在正確的分支上，或詢問是否建立新分支進行這次的改動
## 每次開發新 feature 時應該先建立該需求的規格說明，再開始執行任務
## 你應該需要先建立分支，並先幫我完成這個 feature 的 spec，更新在 instruction

## BlogImageAI 軟體開發企劃書

### 專案名稱
BlogImageAI - 智慧 AI 圖片生成平台

### 專案目標
開發一個智慧 AI 圖片生成平台，整合多模型支援與提示詞最佳化功能，專為部落格文章建立專業插圖，提升內容視覺化品質。支援最新的 OpenAI 圖片生成模型。

### 核心價值主張
- 智慧最佳化：提示詞分析與自動最佳化，提升圖片生成品質
- 多模型整合：支援 GPT-Image-1、DALL·E 3、DALL·E 2 三種先進模型
- 工作流程優化：從內容分析到圖片生成的完整解決方案
- 易用性：直觀的網頁介面，支援多種圖片比例和格式
- 專業化：針對部落格和技術文章場景深度最佳化

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

7. **提示詞最佳化助手 Phase 1** ✅ NEW
   - `PromptOptimizer` 主要元件完成
   - `PurposeSelector` 圖片用途選擇器 (首頁橫幅/段落說明/內容總結)
   - `ContentInput` 部落格內容分析輸入介面
   - 三階段使用流程：用途選擇 → 內容輸入 → 結果展示
   - 頁籤整合到主應用程式
   - Docker 容器化測試完成

### 開發中功能 🚧
1. **提示詞最佳化助手 Phase 2** ⭐ 優先開發
   - `OptimizedPromptDisplay` 真實最佳化邏輯
   - 智慧內容分析與提示詞最佳化演算法
   - 針對部落格圖片的專業化最佳化策略
   - 內容分析服務 (`contentAnalyzer.ts`)
   - 提示詞最佳化服務 (`promptOptimizer.ts`)

2. **圖片編輯功能**
   - `ImageEditor` 元件基礎架構
   - 畫布遮罩編輯功能 (DALL·E 2)
   - 圖片變化生成

3. **提示詞助手** (傳統)
   - `PromptHelper` 元件
   - 預設模板庫
   - 智慧建議系統

4. **歷史記錄系統**
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
   - 🎯 **優先**: 完成提示詞最佳化助手 (feature/prompt-optimizer)
   - 完成圖片編輯功能
   - 實作傳統提示詞助手
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

---

## 專案文件管理規則

### Change Log 資料夾管理
- **位置**: `.github/change_log/`
- **用途**: 存放所有專案變更記錄、修復報告、部署摘要等總結檔案
- **檔案類型**: 所有 `*.md` 格式的總結和報告檔案

### Change Log 檔案命名規則
- **修復報告**: `{FEATURE}-FIX-REPORT.md` (例如: `GPT-IMAGE-1-FIX-REPORT.md`)
- **更新記錄**: `{FEATURE}-UPDATE.md` (例如: `GPT-IMAGE-1-UPDATE.md`)
- **部署摘要**: `DEPLOYMENT-SUMMARY.md`
- **設定報告**: `{COMPONENT}-{ACTION}-report.md` (例如: `setup-complete-report.md`)
- **環境修復**: `{ENVIRONMENT}-environment-fix.md` (例如: `conda-environment-fix.md`)

### 檔案管理指令
當建立新的總結檔案、修復報告、或專案變更記錄時：

1. **自動移動規則**: 
   - 所有總結相關的 `*.md` 檔案應放置在 `.github/change_log/` 資料夾中
   - 開發指令和工作流程文件放在 `.github/instructions/` 資料夾中
   - 不包括專案根目錄的 `README.md` 和 `.github/prompts/` 資料夾中的指南檔案

2. **檔案類型歸類**:
   - 專案變更記錄 → `.github/change_log/`
   - 開發指令與工作流程 → `.github/instructions/`
   - 使用指南和 prompt → `.github/prompts/`
   - 專案說明文件 → 根目錄 `README.md`

3. **建立新變更記錄時**:
   ```bash
   # 建立變更記錄檔案的範例路徑
   .github/change_log/NEW-FEATURE-IMPLEMENTATION-{YYYY-MM-DD}.md
   .github/change_log/BUG-FIX-{COMPONENT}-{YYYY-MM-DD}.md
   .github/change_log/DEPLOYMENT-{VERSION}-{YYYY-MM-DD}.md
   ```

4. **Git 工作流程指令**:
   ```bash
   # Git 相關指令檔案位置
   .github/instructions/git-workflow-complete.md
   .github/instructions/commit-guidelines.md
   .github/instructions/feature-branch-workflow.md
   ```

### 現有檔案清單
目前 `.github/change_log/` 資料夾包含：
- `GPT-IMAGE-1-FIX-REPORT.md` - GPT Image 1 模型修復報告
- `GPT-IMAGE-1-RESPONSE-FORMAT-FIX.md` - 回應格式修復記錄
- `GPT-IMAGE-1-UPDATE.md` - GPT Image 1 更新記錄
- `DEPLOYMENT-SUMMARY.md` - Docker 部署完成摘要
- `conda-environment-fix.md` - Conda 環境修復報告
- `setup-complete-report.md` - 專案設定完成報告

### Copilot 自動化指令
當執行專案相關的修復、更新、或部署任務時：
1. 自動建立對應的變更記錄檔案
2. 將檔案放置在 `.github/change_log/` 資料夾中
3. 使用適當的檔案命名規則
4. 包含完整的時間戳記和變更摘要

## Git 工作流程指令

### 分支管理規則
1. **主要分支**:
   - `main`: 生產環境，穩定版本
   - `develop`: 開發主分支，最新功能整合

2. **功能分支**:
   - `feature/*`: 新功能開發
   - `bugfix/*`: Bug 修復
   - `hotfix/*`: 緊急修復

3. **工作流程**:
   - 所有新功能從 `develop` 分支建立功能分支
   - 完成後建立 Pull Request 合併回 `develop`
   - 定期從 `develop` 合併到 `main` 進行發布

### Commit 訊息規範
遵循 `.github/instructions/commit-guidelines.md` 中的規範：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type 類型**:
- `feat`: 新功能
- `fix`: 修復 bug
- `docs`: 文件更新
- `style`: 程式碼格式調整
- `refactor`: 重構
- `perf`: 效能改善
- `test`: 測試相關
- `build`: 建構相關
- `ci`: CI 設定
- `chore`: 其他維護

### 自動化開發指令
```bash
# 建立新功能分支
git checkout develop
git pull origin develop
git checkout -b feature/新功能名稱

# 完成功能開發
git add .
git commit -m "feat(scope): 功能描述"
git push origin feature/新功能名稱

# 建立 Pull Request 後合併到 develop
# 最終清理功能分支
git branch -d feature/新功能名稱
git push origin --delete feature/新功能名稱
```

### Copilot 協助指令
當進行專案開發時，Copilot 應：
1. 自動建議適當的 commit 訊息格式
2. 提醒分支管理最佳實踐
3. 在完成功能時建立對應的變更記錄檔案
4. 確保所有變更都有適當的文件記錄

### 相關指令檔案
- **完整工作流程**: `.github/instructions/git-workflow-complete.md`
- **Commit 規範**: `.github/instructions/commit-guidelines.md`
- **功能分支流程**: `.github/instructions/feature-branch-workflow.md`
- **自動化 PR 工作流程**: `.github/instructions/automated-pr-workflow.md`
- **自動化腳本**: `.github/scripts/git-automation.sh`
- **指令索引**: `.github/instructions/README.md`

### 自動化 PR 指令
當需要建立 Pull Request 時，可以使用自動化指令：

```bash
# 載入自動化腳本
source .github/scripts/git-automation.sh

# 功能開發流程
create-feature-pr "功能名稱"     # 建立功能分支
finish-feature-pr              # 完成功能並準備 PR
auto-create-feature-pr         # 使用 GitHub CLI 自動建立 PR

# 版本發布流程  
create-release-pr "v1.2.0"     # 建立發布分支
finish-release-pr              # 完成發布流程
auto-create-release-pr         # 使用 GitHub CLI 自動建立發布 PR

# 輔助指令
git-help                       # 查看所有可用指令
git-status-check              # 檢查當前 Git 狀態
```
