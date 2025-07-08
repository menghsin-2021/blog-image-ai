# {{PROJECT_NAME}}

{{PROJECT_DESCRIPTION}}

## ✨ 模板功能特色

這是一個完整的 AI 協作開發專案模板，整合了所有對 Agent 開發需求有幫助的檔案和配置。

### 🎯 已完成功能

#### 🤖 AI 協作開發支援
- ✅ **GitHub Copilot 指令模板** - 完整的 AI 協作指令和開發規範
- ✅ **AI 提示詞範本** - 標準化的 AI 協作提示詞
- ✅ **開發工作流程** - Git 工作流程、Commit 規範、功能規格模板

#### 📋 變更記錄系統
- ✅ **修復報告範本** - 標準化的 Bug 修復記錄格式
- ✅ **部署摘要範本** - 完整的部署過程記錄模板
- ✅ **功能更新範本** - 新功能開發的詳細記錄格式
- ✅ **Change Log 管理** - 統一的變更記錄管理系統

#### 🔧 開發工具整合
- ✅ **VS Code 設定** - 編輯器配置和任務定義
- ✅ **程式碼品質工具** - ESLint、Prettier、TypeScript 配置
- ✅ **測試框架** - Vitest、Playwright E2E 測試配置
- ✅ **自動化腳本** - Git 工作流程自動化腳本

#### 🐳 容器化支援
- ✅ **Docker 配置** - 多階段建構的 Dockerfile
- ✅ **Docker Compose** - 多服務編排配置
- ✅ **部署配置** - Vercel、Netlify、自主部署支援

#### 🔒 安全性和品質保證
- ✅ **安全性政策** - 完整的漏洞回報和處理流程
- ✅ **授權管理** - 多種授權條款選擇和指南
- ✅ **貢獻指南** - 標準化的開源專案貢獻流程
- ✅ **變更日誌** - Keep a Changelog 格式的版本管理

#### 🚀 部署和 CI/CD
- ✅ **GitHub Actions** - 完整的 CI/CD 工作流程
- ✅ **多平台部署** - 支援多種雲端平台部署
- ✅ **環境配置** - 完整的環境變數管理
- ✅ **監控配置** - 效能監控和錯誤追蹤設定

### 🎨 變數化設計
所有模板檔案使用 `{{變數}}` 格式，方便快速自訂：
- `{{PROJECT_NAME}}` - 專案名稱
- `{{PROJECT_DESCRIPTION}}` - 專案描述
- `{{AUTHOR_NAME}}` - 作者資訊
- `{{GITHUB_REPO_URL}}` - GitHub 倉庫連結
- 以及更多可自訂變數...

### 📁 完整模板結構
```
PROJECT_TEMPLATE/
├── .github/                    # GitHub 相關設定
│   ├── copilot-instructions.md    # AI 協作指令模板
│   ├── change_log/                 # 變更記錄範本系統
│   ├── instructions/               # 開發指令和工作流程
│   ├── prompts/                    # AI 提示詞模板
│   ├── scripts/                    # 自動化腳本
│   └── workflows/                  # CI/CD 工作流程
├── .vscode/                    # VS Code 設定
├── 配置檔案 (20+ 種)            # 完整的開發配置檔案
├── 文件模板 (8 種)              # 專業的專案文件模板
└── 部署配置                     # 多平台部署支援
```

## 🚀 快速開始

### 前置需求

- Node.js 18+
- npm 或 yarn
- Docker (可選)
- {{ADDITIONAL_REQUIREMENTS}}

### 安裝

1. 複製專案
```bash
git clone https://github.com/{{USERNAME}}/{{PROJECT_NAME}}.git
cd {{PROJECT_NAME}}
```

2. 安裝相依性
```bash
npm install
```

3. 設定環境變數
```bash
cp .env.example .env
# 編輯 .env 檔案，填入必要的設定值
```

4. 啟動開發伺服器
```bash
npm run dev
```

## 📁 專案結構

### 🎯 模板資料夾結構
```
PROJECT_TEMPLATE/                # 專案模板根目錄
├── .github/                    # GitHub 相關設定和自動化
│   ├── copilot-instructions.md    # AI 協作指令模板
│   ├── change_log/                 # 變更記錄範本系統
│   │   ├── README.md               # Change Log 使用說明
│   │   ├── FIX-REPORT-TEMPLATE.md  # 修復報告範本
│   │   ├── DEPLOYMENT-SUMMARY-TEMPLATE.md # 部署摘要範本
│   │   └── FEATURE-UPDATE-TEMPLATE.md # 功能更新範本
│   ├── instructions/               # 開發指令和工作流程
│   ├── prompts/                    # AI 提示詞模板
│   ├── scripts/                    # 自動化腳本
│   └── workflows/                  # CI/CD 工作流程
├── .vscode/                    # VS Code 編輯器設定
├── 配置檔案/ (20+ 種)           # 完整的開發工具配置
├── 容器化配置/                  # Docker 相關配置
├── 部署配置/                    # 多平台部署支援
├── 專案文件/ (8 種)             # 完整的專案文件模板
└── 使用指南/                    # 模板使用說明
```

### 🏗️ 實際專案結構範例 (使用此模板後)
```
{{PROJECT_NAME}}/
├── frontend/                   # 前端程式碼
│   ├── src/
│   │   ├── components/         # React 元件
│   │   ├── hooks/             # 自訂 Hooks
│   │   ├── services/          # API 服務
│   │   ├── types/             # TypeScript 型別
│   │   └── utils/             # 工具函式
│   ├── public/                # 靜態資源
│   └── package.json
├── backend/                    # 後端程式碼
│   ├── src/
│   │   ├── controllers/        # 控制器
│   │   ├── models/            # 資料模型
│   │   ├── routes/            # API 路由
│   │   ├── services/          # 商業邏輯
│   │   └── utils/             # 工具函式
│   └── package.json
├── database/                   # 資料庫相關
│   ├── migrations/            # 資料庫遷移
│   ├── seeds/                 # 測試資料
│   └── schemas/               # 資料庫結構
├── .github/                    # GitHub 設定
│   ├── workflows/             # CI/CD 工作流程
│   ├── instructions/          # 開發指令
│   └── scripts/               # 自動化腳本
├── docker-compose.yml          # Docker Compose 設定
├── .env.example               # 環境變數範例
└── README.md                  # 專案說明
```

## 🛠️ 開發指令

### 前端開發
```bash
npm run dev          # 啟動開發伺服器
npm run build        # 建構生產版本
npm run preview      # 預覽建構結果
npm run lint         # 執行 ESLint
npm run lint:fix     # 修復 ESLint 問題
npm run format       # 格式化程式碼
npm run type-check   # TypeScript 型別檢查
```

### 後端開發 (如適用)
```bash
npm run dev:server   # 啟動後端開發伺服器
npm run build:server # 建構後端程式碼
npm run start:server # 啟動生產伺服器
```

### 測試
```bash
npm run test         # 執行所有測試
npm run test:watch   # 監視模式執行測試
npm run test:coverage # 執行測試並產生覆蓋率報告
npm run test:e2e     # 執行端對端測試
```

### Docker
```bash
docker-compose up -d # 啟動所有服務
docker-compose down  # 停止所有服務
docker-compose logs  # 查看日誌
```

## 🌐 API 文件

### 基本資訊
- **Base URL**: `{{API_BASE_URL}}`
- **版本**: `v1`
- **認證**: Bearer Token (JWT)

### 主要端點

#### 使用者認證
```
POST /api/v1/auth/login      # 使用者登入
POST /api/v1/auth/register   # 使用者註冊
POST /api/v1/auth/refresh    # 更新 Token
POST /api/v1/auth/logout     # 使用者登出
```

#### {{MAIN_RESOURCE}}
```
GET    /api/v1/{{RESOURCE}}     # 取得列表
GET    /api/v1/{{RESOURCE}}/:id # 取得單一項目
POST   /api/v1/{{RESOURCE}}     # 建立新項目
PUT    /api/v1/{{RESOURCE}}/:id # 更新項目
DELETE /api/v1/{{RESOURCE}}/:id # 刪除項目
```

詳細的 API 文件請參考 [API Documentation](./docs/api.md)

## 🗄️ 資料庫

### 設定
- **類型**: {{DATABASE_TYPE}}
- **連接**: 請在 `.env` 檔案中設定 `DATABASE_URL`

### 遷移
```bash
npm run db:migrate    # 執行資料庫遷移
npm run db:seed       # 載入測試資料
npm run db:reset      # 重置資料庫
```

## 🚀 部署

### 使用 Docker
```bash
# 建構映像
docker build -t {{PROJECT_NAME}} .

# 執行容器
docker run -p 3000:3000 {{PROJECT_NAME}}
```

### 使用 Docker Compose
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 部署到雲端平台

#### Vercel (前端)
```bash
npm install -g vercel
vercel --prod
```

#### Railway (全端)
```bash
# 連接到 Railway
railway login
railway link
railway up
```

## 🧪 測試

### 測試策略
- **單元測試**: 測試個別元件和函式
- **整合測試**: 測試 API 端點和資料庫互動
- **端對端測試**: 測試完整的使用者流程

### 執行測試
```bash
# 前端測試
npm run test:frontend

# 後端測試
npm run test:backend

# 端對端測試
npm run test:e2e
```

## 🔒 安全性

### 安全措施
- JWT Token 認證
- CORS 設定
- Rate Limiting
- 輸入驗證和清理
- HTTPS (生產環境)

### 安全性檢查
```bash
npm audit              # 檢查相依性漏洞
npm run security:check # 執行安全性掃描
```

## 📊 監控和分析

### 效能監控
- 使用 {{MONITORING_SERVICE}} 進行應用程式監控
- 錯誤追蹤使用 {{ERROR_TRACKING_SERVICE}}

### 分析
- 網站分析使用 {{ANALYTICS_SERVICE}}
- 使用者行為追蹤

## 🤝 貢獻指南

### 開發流程
1. Fork 專案
2. 建立功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交變更 (`git commit -m 'feat: add amazing feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 建立 Pull Request

### 程式碼規範
- 遵循 ESLint 和 Prettier 設定
- 使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式
- 維持測試覆蓋率 > 80%

詳細的貢獻指南請參考 [CONTRIBUTING.md](./CONTRIBUTING.md)

## 📝 變更日誌

請參考 [CHANGELOG.md](./CHANGELOG.md) 查看詳細的版本變更記錄。

## 📄 授權條款

本專案使用 [MIT License](./LICENSE) 授權。

## 📞 聯絡資訊

- **作者**: {{AUTHOR_NAME}}
- **Email**: {{AUTHOR_EMAIL}}
- **GitHub**: {{GITHUB_USERNAME}}
- **網站**: {{WEBSITE}}

## 🙏 致謝

感謝以下開源專案和技術棧的貢獻：
- **前端技術**: React, TypeScript, Vite, Tailwind CSS
- **後端技術**: Node.js, Express, Prisma, PostgreSQL
- **開發工具**: ESLint, Prettier, Vitest, Playwright
- **AI 協作**: GitHub Copilot, OpenAI API
- **容器化**: Docker, Docker Compose
- **部署平台**: Vercel, Netlify, Railway
- **CI/CD**: GitHub Actions
- **程式碼品質**: Husky, lint-staged, Commitizen

### 🌟 特別感謝
- **開源社群** - 提供了豐富的開發工具和最佳實踐
- **AI 開發社群** - 推動了 AI 協作開發的進步
- **所有貢獻者** - 讓這個模板更加完善和實用

---

## 🔧 疑難排解

### 模板相關問題

#### 變數替換問題
```bash
# 使用 sed 指令批次替換變數
sed -i 's/{{PROJECT_NAME}}/your-project-name/g' **/*.md
sed -i 's/{{AUTHOR_NAME}}/Your Name/g' **/*.md
```

#### 權限問題
```bash
# 給予腳本執行權限
chmod +x setup-project.sh
chmod +x .github/scripts/git-automation.sh
```

#### 模板更新
```bash
# 更新模板到最新版本
git pull origin main
# 或重新下載模板資料夾
```

### 常見問題

#### 環境設定問題
```bash
# 清除 npm 快取
npm cache clean --force

# 重新安裝相依性
rm -rf node_modules package-lock.json
npm install
```

#### 資料庫連接問題
- 確認資料庫服務是否啟動
- 檢查環境變數設定是否正確
- 確認網路連接和防火牆設定

#### 建構問題
- 檢查 Node.js 版本是否符合需求
- 確認所有相依性都已正確安裝
- 查看建構日誌中的錯誤訊息

如果遇到其他問題，請查看 [Issues]({{GITHUB_REPO_URL}}/issues) 或建立新的 Issue。

---

**注意**: 這是一個專業的 AI 協作開發專案模板，包含完整的開發工作流程、變更記錄系統、安全性政策和多平台部署支援。所有檔案使用 `{{變數}}` 格式設計，方便快速自訂和部署。

## 🎯 模板使用建議

### 快速啟動新專案
1. 複製 PROJECT_TEMPLATE 資料夾到新專案位置
2. 執行 `./setup-project.sh` 進行自動化設定
3. 根據 `使用指南.md` 自訂專案配置
4. 開始使用 AI 協作開發功能

### 最佳實踐
- 使用 `.github/copilot-instructions.md` 指導 AI 協作
- 遵循 `.github/instructions/` 中的開發流程
- 使用 `.github/change_log/` 範本記錄所有變更
- 定期更新 `CHANGELOG.md` 和相關文件

詳細使用方法請參考 [使用指南.md](./使用指南.md)
