# BlogImageAI

BlogImageAI 是一個智慧 AI 圖片生成平台，支援多模型與提示詞最佳化，專為部落格打造專業插圖。整合 OpenAI 最新的 GPT-Image-1、DALL·E 3 和 DALL·E 2 模型。

## ✨ 功能特色

### 🤖 AI 圖片生成核心
- **多模型支援** - GPT-Image-1（推薦）、DALL·E 3、DALL·E 2 三種 AI 模型
- **智慧參數調整** - 根據選擇的模型動態顯示可用選項
- **圖片編輯** - 基於畫布的遮罩編輯功能（DALL·E 2）
- **圖片變化** - 建立現有圖片的變化版本（DALL·E 2）
- **動態比例選擇** - 根據模型自動調整可用圖片比例
- **多種格式支援** - PNG、JPEG、WebP 格式選擇（GPT-Image-1）
- **品質控制** - 多種品質等級和壓縮選項

### � AI 提示詞最佳化（新功能）
- **雙 AI 引擎** - 支援 Perplexity（預設）和 OpenAI GPT-4o
- **即時網路搜尋** - Perplexity 整合最新網路資訊
- **多種 Sonar 模型** - Sonar、Sonar Pro、Sonar Reasoning
- **引用來源追蹤** - 透明的資訊來源展示
- **即時成本估算** - 透明的 API 使用成本計算
- **智慧內容分析** - 自動關鍵字提取和主題分類

### 📝 提示詞工具
- **內建模板庫** - 15+ 專業圖片生成模板
- **自訂提示詞建構器** - 視覺化提示詞編輯器
- **多語言支援** - 中英文提示詞生成
- **用途導向最佳化** - 針對橫幅、插圖、總結圖片最佳化

### � 使用者體驗
- **響應式設計** - 優化的行動裝置體驗
- **現代介面** - 使用 Tailwind CSS 建構的美觀 UI
- **下載功能** - 支援多種格式下載
- **快取系統** - 智慧快取提升效能

## 🚀 快速啟動

### 使用 Shell Script（推薦）

```bash
# 複製專案並進入目錄
git clone https://github.com/menghsin-2021/blog-image-ai.git
cd blog-image-ai

# 設定環境變數（請編輯 .env 檔案設定您的 OpenAI API 金鑰）
cp .env.example .env

# 賦予執行權限並啟動開發伺服器
chmod +x start-server.sh
./start-server.sh dev
```

開啟瀏覽器存取：http://localhost:3000

### 可用指令

```bash
./start-server.sh dev      # 啟動開發伺服器（預設）
./start-server.sh prod     # 啟動生產伺服器
./start-server.sh stop     # 停止所有服務
./start-server.sh status   # 查看容器狀態
./start-server.sh logs     # 查看容器記錄檔
./start-server.sh clean    # 清理容器和映像檔
./start-server.sh help     # 顯示幫助訊息
```

詳細的建構和部署指南請參考：[.github/prompts/build-server.prompt.md](.github/prompts/build-server.prompt.md)

## 🚀 技術架構

- **前端**: React 18 + TypeScript + Vite
- **樣式**: Tailwind CSS + 自訂主題
- **API**: OpenAI Image Generation API
- **部署**: Docker + Nginx
- **開發工具**: ESLint + PostCSS

## 🤖 支援的 AI 模型

### GPT-Image-1 (推薦)
- **品質選項**: auto、high、medium、low
- **輸出格式**: PNG、JPEG、WebP
- **壓縮控制**: 0-100%（JPEG/WebP）
- **支援尺寸**: 1024×1024、1536×1024、1024×1536
- **內容審核**: 標準、寬鬆
- **提示詞長度**: 最多 4000 字元

### DALL·E 3
- **品質選項**: 標準、HD
- **風格選項**: Vivid（鮮明）、Natural（自然）
- **支援尺寸**: 1024×1024、1792×1024、1024×1792
- **輸出格式**: PNG（固定）

### DALL·E 2
- **功能**: 圖片編輯、變化生成
- **支援尺寸**: 1024×1024（固定）
- **輸出格式**: PNG（固定）
- **特色**: 成本最低，支援進階編輯

## 📦 快速開始

### 前置需求

- Node.js 18+ 
- npm 或 yarn
- OpenAI API 金鑰

### 建立虛擬環境（推薦）

#### 使用 Conda 環境

1. **建立並激活 Conda 環境**
   ```bash
   # 建立包含 Node.js 18 的環境
   conda create -n blog-image-ai nodejs=18 -c conda-forge -y
   
   # 激活環境
   conda activate blog-image-ai
   ```

2. **驗證環境設定**
   ```bash
   # 確認 Node.js 版本
   node --version  # 應顯示 v18.x.x
   npm --version   # 應顯示 10.x.x
   ```

#### 使用 NVM（替代方案）

```bash
# 安裝並使用 Node.js 18
nvm install 18
nvm use 18
nvm alias default 18
```

### 安裝步驟

1. **複製專案**
   ```bash
   git clone https://github.com/your-username/blog-image-ai.git
   cd blog-image-ai
   ```

2. **清理並安裝相依套件**
   ```bash
   # 清理舊的安裝（如果存在）
   rm -rf node_modules package-lock.json
   
   # 重新安裝套件
   npm install
   ```

3. **設定環境變數**
   ```bash
   cp .env.example .env
   ```
   
   編輯 `.env` 檔案並加入你的 OpenAI API 金鑰：
   ```bash
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **啟動開發伺服器**
   ```bash
   npm run dev
   ```

5. **開啟瀏覽器**
   
   前往 `http://localhost:3000` 開始使用！

### 環境問題疑難排解

如果遇到環境設定問題，請參考詳細指南：
📋 [完整環境建立指南](.github/prompts/create-env.prompt.md)

## 🔧 可用指令

```bash
# 開發模式
npm run dev

# 建構生產版本
npm run build

# 預覽生產版本
npm run preview

# 程式碼檢查
npm run lint
```

## 🐳 Docker 部署

```bash
# 建構 Docker 映像
docker build -t blog-image-ai .

# 執行容器
docker run -p 80:80 blog-image-ai
```

## 💰 成本估算

### OpenAI API 價格（2024年）

| 模型 | 價格 | 特色 |
|------|------|------|
| **GPT-Image-1** | 視品質而定 | 最新模型，多格式支援 |
| **DALL·E 3 Standard** | $0.040 / 圖片 | 高品質，風格控制 |
| **DALL·E 3 HD** | $0.080 / 圖片 | 最高品質 |
| **DALL·E 2** | $0.020 / 圖片 | 最經濟，支援編輯 |

### 月度使用量估算
- 200 張圖片/月：$4-16
- 500 張圖片/月：$10-40
- 1000 張圖片/月：$20-80

### GCP Cloud Run 費用
- 每月約 $1.5-3（低流量使用）

### 總成本預估
- 輕度使用：$5.5-15/月
- 中度使用：$15-30/月  
- 重度使用：$30-50/月

## 📝 使用指南

### 基本使用

1. **選擇 AI 模型** - 從 GPT-Image-1、DALL·E 3 或 DALL·E 2 中選擇
2. **設定參數** - 根據選擇的模型調整品質、格式等選項
3. **選擇圖片比例** - 系統會根據模型自動篩選可用比例
4. **輸入提示詞** - 描述你想要的圖片（最多 4000 字元）
5. **生成圖片** - 點擊生成按鈕
6. **下載或編輯** - 下載結果或進行進一步編輯

### 模型選擇建議

- **GPT-Image-1**: 追求最新技術和多種格式支援（推薦）
- **DALL·E 3**: 需要高品質插圖，在意視覺風格
- **DALL·E 2**: 預算有限或需要圖片編輯功能

### 圖片編輯（DALL·E 2）

1. 使用 DALL·E 2 生成初始圖片
2. 點擊「編輯圖片」按鈕
3. 使用畫筆工具在想要修改的區域畫遮罩
4. 輸入編輯描述
5. 生成編輯後的圖片

### 提示詞最佳實踐

- 包含具體的視覺細節
- 指定藝術風格（例如：插畫、攝影、3D 渲染）
- 描述色彩和氛圍
- 提及目標用途（技術部落格、教學等）
- 充分利用 GPT-Image-1 的 4000 字元限制

### 範例提示詞

```
一個現代扁平風格的雲端架構圖，顯示微服務之間的 API 連接，
藍色和綠色配色方案，包含伺服器圖示、資料庫和網路流量線，
背景是漸層藍色，整體風格簡潔專業，適合技術部落格使用，
具有清晰的標籤和連接線，體現現代軟體架構的複雜性與美感
```

## 🛠️ 專案結構

```
blog-image-ai/
├── public/              # 靜態資源
├── src/
│   ├── components/      # React 元件
│   │   ├── ModelSettings.tsx        # 模型設定元件
│   │   ├── AspectRatioSelector.tsx  # 比例選擇器
│   │   ├── SimpleImagePreview.tsx   # 圖片預覽元件
│   │   ├── ImageEditor.tsx          # 圖片編輯元件
│   │   ├── PromptHelper.tsx         # 提示詞助手
│   │   └── ...
│   ├── hooks/          # 自訂 Hooks
│   │   ├── useImageGeneration.ts    # 圖片生成邏輯
│   │   └── useImageHistory.ts       # 歷史記錄管理
│   ├── services/       # API 服務
│   │   └── api.ts                   # OpenAI API 整合
│   ├── types/          # TypeScript 型別
│   │   └── index.ts                 # 型別定義
│   ├── utils/          # 工具函式
│   │   ├── constants.ts             # 常數與設定
│   │   └── helpers.ts               # 輔助函式
│   ├── App.tsx         # 主要應用程式
│   └── main.tsx        # 應用程式進入點
├── Dockerfile          # Docker 設定
├── nginx.conf          # Nginx 設定
├── package.json        # 套件相依性
├── tailwind.config.js  # Tailwind 設定
├── tsconfig.json       # TypeScript 設定
└── vite.config.ts      # Vite 設定
```

## 🔒 環境變數

### 必需變數
| 變數名稱 | 必需 | 說明 |
|---------|------|------|
| `VITE_OPENAI_API_KEY` | ✅ | OpenAI API 金鑰（圖片生成功能） |

### 提示詞最佳化功能
| 變數名稱 | 必需 | 說明 |
|---------|------|------|
| `VITE_PERPLEXITY_API_KEY` | 🔍 | Perplexity API 金鑰（新功能） |
| `VITE_PERPLEXITY_DEFAULT_MODEL` | ❌ | 預設 Perplexity 模型（預設：sonar） |
| `VITE_PERPLEXITY_MAX_TOKENS` | ❌ | 最大 token 數量（預設：2000） |
| `VITE_PERPLEXITY_TIMEOUT` | ❌ | 請求逾時時間（預設：30秒） |

### 應用程式設定
| 變數名稱 | 必需 | 說明 |
|---------|------|------|
| `VITE_APP_NAME` | ❌ | 應用程式名稱（預設：BlogImageAI） |
| `VITE_APP_VERSION` | ❌ | 應用程式版本（預設：1.0.0） |
| `VITE_API_TIMEOUT` | ❌ | API 請求逾時時間（預設：60秒） |
| `VITE_MAX_RETRIES` | ❌ | API 重試次數（預設：3次） |
| `VITE_DEBUG_MODE` | ❌ | 開啟偵錯模式（true/false） |

> **💡 提示**: Perplexity API 金鑰是可選的，如果不設定，提示詞最佳化功能會退回到僅使用 OpenAI GPT-4o。詳細設定請參考 [Perplexity 使用指南](./PERPLEXITY_USAGE_GUIDE.md)。

## 🐛 疑難排解

### 環境設定問題

**Q: 套件安裝失敗**  
A: 
```bash
# 清理 npm 快取並重新安裝
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Q: Node.js 版本不正確**  
A: 確認使用正確的 Node.js 版本：
```bash
# 使用 conda 環境
conda activate blog-image-ai
node --version

# 或使用 nvm
nvm use 18
```

**Q: 環境變數問題**  
A: 檢查環境是否正確激活：
```bash
echo $CONDA_PREFIX  # conda 環境
which node          # 確認 node 路徑
```

**Q: 安全漏洞警告**  
A: 檢查並修復安全問題：
```bash
npm audit          # 檢查漏洞
npm audit fix      # 自動修復
```

### API 相關問題

**Q: API 金鑰錯誤**  
A: 確認你的 OpenAI API 金鑰正確且有效，並檢查帳戶餘額。

**Q: 圖片生成失敗**  
A: 檢查提示詞是否符合 OpenAI 內容政策，避免敏感內容。

**Q: GPT-Image-1 載入時間過長**  
A: 可嘗試降低品質設定或使用其他模型。

**Q: 編輯功能不可用**  
A: 圖片編輯功能僅支援 DALL·E 2 模型。

**Q: 比例選項受限**  
A: 每個模型支援的圖片尺寸不同，系統會自動篩選可用選項。

### 效能最佳化

- 使用適合的模型和品質設定
- 避免過於複雜的提示詞
- 監控 API 使用量以控制成本
- 選擇合適的輸出格式和壓縮等級

## 📊 專案狀態

### 已完成 ✅
- 基礎架構與 UI 元件
- 三種 AI 模型完整整合
- 動態參數調整系統
- 圖片生成與下載功能
- 響應式設計
- Docker 容器化

### 開發中 🚧  
- 圖片編輯與變化功能
- 提示詞助手與模板
- 歷史記錄系統

### 規劃中 📅
- 單元測試與 E2E 測試
- 效能監控
- PWA 支援

## 🤝 貢獻指南

歡迎貢獻！請參考以下步驟：

1. Fork 這個專案
2. 建立功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交變更 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 開啟 Pull Request

## 📄 授權條款

本專案使用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案。

## 🙏 致謝

- [OpenAI](https://openai.com/) - 提供 Image Generation API
- [Vite](https://vitejs.dev/) - 快速建構工具
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [React](https://reactjs.org/) - UI 函式庫

---

如果這個專案對你有幫助，請給它一個 ⭐！
