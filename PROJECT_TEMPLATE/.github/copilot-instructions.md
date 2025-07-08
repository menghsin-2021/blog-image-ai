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
5. **容器化測試** - 使用容器環境進行測試
6. **CI 風格檢查** - 執行程式碼格式和品質檢查
7. **記錄變更** - 建立變更記錄檔案到 `.github/change_log/`
8. **提交變更** - 遵循 commit 訊息規範提交程式碼

### 🔍 CI 品質檢查規則 (上版前必須執行)
- **程式碼格式檢查**：執行格式檢查指令
- **程式碼風格修正**：如有格式問題，執行風格修正指令
- **Lint 檢查**：執行 lint 確保程式碼品質
- **型別檢查**：執行型別檢查確保正確性
- **測試執行**：執行測試確保功能正常
- **建構驗證**：執行建構確保專案可正常建構
- **⚠️ 重要**：所有 CI 檢查必須通過後才能建立 Pull Request 或合併程式碼

---

## {{PROJECT_NAME}} 軟體開發企劃書

### 專案名稱
{{PROJECT_NAME}} - {{PROJECT_DESCRIPTION}}

### 專案目標
{{PROJECT_GOALS}}

### 核心價值主張
- {{VALUE_PROPOSITION_1}}
- {{VALUE_PROPOSITION_2}}
- {{VALUE_PROPOSITION_3}}
- {{VALUE_PROPOSITION_4}}

### 技術架構
- 前端：{{FRONTEND_STACK}}
- 後端：{{BACKEND_STACK}}
- 資料庫：{{DATABASE_STACK}}
- 部署：{{DEPLOYMENT_STACK}}
- 開發工具：{{DEV_TOOLS}}

### 功能規格
- ✅ {{COMPLETED_FEATURE_1}}
- ✅ {{COMPLETED_FEATURE_2}}
- 🚧 {{IN_PROGRESS_FEATURE_1}}
- 🚧 {{IN_PROGRESS_FEATURE_2}}
- 📋 {{PLANNED_FEATURE_1}}

### 專案結構建議
```
{{project-name}}/
├── {{FRONTEND_DIR}}/              # 前端程式碼
│   ├── components/                # React/Vue 元件
│   ├── hooks/                     # 自訂 Hooks
│   ├── services/                  # API 服務
│   ├── types/                     # TypeScript 型別定義
│   └── utils/                     # 工具函式與常數
├── {{BACKEND_DIR}}/               # 後端程式碼
│   ├── controllers/               # 控制器
│   ├── models/                    # 資料模型
│   ├── routes/                    # 路由定義
│   ├── services/                  # 商業邏輯服務
│   └── utils/                     # 工具函式
├── {{DATABASE_DIR}}/              # 資料庫相關
│   ├── migrations/                # 資料庫遷移
│   ├── seeds/                     # 測試資料
│   └── schemas/                   # 資料庫結構定義
├── .env                           # 環境變數
├── .env.example                   # 環境變數範例
├── .gitignore                     # Git 忽略檔案
├── docker-compose.yml             # Docker Compose 設定
└── README.md                      # 專案說明文件
```

---

## Copilot 指令建議

### 前端開發指令
- 請優先產生 {{FRONTEND_FRAMEWORK}} + TypeScript 程式碼片段
- 介面元件請拆分為小型可重用元件
- 請遵循專案結構建議，將元件、服務、hooks、型別、工具分開
- 產生的程式碼需考慮響應式設計與易用性
- 產生的程式碼需包含錯誤處理與 loading 狀態
- 產生的程式碼請盡量使用現代語法與最佳實踐

### 後端開發指令
- 請優先產生 {{BACKEND_FRAMEWORK}} + TypeScript 程式碼片段
- API 設計請遵循 RESTful 或 GraphQL 最佳實踐
- 包含適當的錯誤處理和驗證邏輯
- 實作適當的認證和授權機制
- 考慮資料庫效能和查詢最佳化

### 資料庫開發指令
- 設計正規化的資料庫結構
- 包含適當的索引和約束條件
- 提供資料庫遷移腳本
- 考慮資料安全性和備份策略

### 通用開發指令
- 產生的註解、變數、介面名稱請以英文為主
- 產生的程式碼片段需可直接複製到專案中使用
- 若有不確定需求，請先詢問使用者
- API 呼叫請將 API 金鑰設為環境變數

---

## 專案文件管理規則

### Change Log 資料夾管理
- **位置**: `.github/change_log/`
- **用途**: 存放所有專案變更記錄、修復報告、部署摘要等總結檔案
- **檔案類型**: 所有 `*.md` 格式的總結和報告檔案

### Change Log 檔案命名規則
- **修復報告**: `{FEATURE}-FIX-REPORT.md`
- **更新記錄**: `{FEATURE}-UPDATE.md`
- **部署摘要**: `DEPLOYMENT-SUMMARY.md`
- **設定報告**: `{COMPONENT}-{ACTION}-report.md`
- **環境修復**: `{ENVIRONMENT}-environment-fix.md`

### Git 工作流程指令

#### 分支管理規則
1. **主要分支**:
   - `main`: 生產環境，穩定版本
   - `develop`: 開發主分支，最新功能整合

2. **功能分支**:
   - `feature/*`: 新功能開發
   - `bugfix/*`: Bug 修復
   - `hotfix/*`: 緊急修復

#### Commit 訊息規範
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

---

## AI Rules for {{PROJECT_NAME}}

### 前端開發指引

#### {{FRONTEND_FRAMEWORK}}_CODING_STANDARDS
- {{FRONTEND_BEST_PRACTICE_1}}
- {{FRONTEND_BEST_PRACTICE_2}}
- {{FRONTEND_BEST_PRACTICE_3}}

#### 樣式指引
- {{STYLING_FRAMEWORK}}_GUIDELINES
- {{STYLING_BEST_PRACTICE_1}}
- {{STYLING_BEST_PRACTICE_2}}

### 後端開發指引

#### {{BACKEND_FRAMEWORK}}_CODING_STANDARDS
- {{BACKEND_BEST_PRACTICE_1}}
- {{BACKEND_BEST_PRACTICE_2}}
- {{BACKEND_BEST_PRACTICE_3}}

#### 資料庫指引
- {{DATABASE_BEST_PRACTICE_1}}
- {{DATABASE_BEST_PRACTICE_2}}
- {{DATABASE_BEST_PRACTICE_3}}

---

## 目前實作狀態 ({{CURRENT_DATE}})

### 已完成功能 ✅
1. **{{COMPLETED_CATEGORY_1}}**
   - {{COMPLETED_ITEM_1}}
   - {{COMPLETED_ITEM_2}}

### 開發中功能 🚧
1. **{{IN_PROGRESS_CATEGORY_1}}**
   - {{IN_PROGRESS_ITEM_1}}
   - {{IN_PROGRESS_ITEM_2}}

### 下一階段規劃 📋
1. **{{PLANNED_CATEGORY_1}}**
   - {{PLANNED_ITEM_1}}
   - {{PLANNED_ITEM_2}}

---

如需調整請直接修改本文件。
