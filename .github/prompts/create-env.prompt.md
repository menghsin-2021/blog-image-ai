# BlogImageAI 虛擬環境建立指南

## 專案概述
BlogImageAI 是一個基於 React + TypeScript + Vite 的 AI 圖片生成網頁應用程式，使用 OpenAI 的圖片生成 API（GPT-Image-1、DALL·E 2/3）為技術部落格建立輔助插圖。

## 環境需求
- **Node.js**: 18.x 或以上版本
- **套件管理器**: npm 或 yarn
- **Python**: 用於 conda 環境管理（可選）

## 虛擬環境建立步驟

### 方法一：使用 Conda 環境（推薦）

#### 1. 建立 Conda 環境
```bash
# 建立包含 Node.js 18 的新環境
conda create -n blog-image-ai nodejs=18 -c conda-forge -y

# 激活環境
conda activate blog-image-ai
```

#### 2. 驗證環境
```bash
# 檢查 Node.js 版本
node --version  # 應顯示 v18.x.x

# 檢查 npm 版本
npm --version   # 應顯示 10.x.x

# 確認環境路徑
echo $CONDA_PREFIX
```

#### 3. 清理並重新安裝套件
```bash
# 清理舊的套件（如果存在）
rm -rf node_modules package-lock.json

# 安裝專案相依套件
npm install
```

#### 4. 啟動開發伺服器
```bash
# 啟動 Vite 開發伺服器
npm run dev

# 或使用 VS Code 任務
# Ctrl+Shift+P > Tasks: Run Task > 開發伺服器
```

#### 5. 驗證安裝
- 開啟瀏覽器訪問 `http://localhost:3000`
- 確認應用程式正常載入
- 檢查開發者工具是否有錯誤

### 方法二：使用 Node Version Manager (nvm)

#### 1. 安裝並切換 Node.js 版本
```bash
# 安裝 Node.js 18
nvm install 18

# 切換到 Node.js 18
nvm use 18

# 設為預設版本
nvm alias default 18
```

#### 2. 安裝套件並啟動
```bash
# 清理並重新安裝
rm -rf node_modules package-lock.json
npm install

# 啟動開發伺服器
npm run dev
```

### 方法三：使用 Docker 環境

#### 1. 建構 Docker 映像
```bash
# 建構映像
docker build -t blog-image-ai .

# 執行容器
docker run -p 3000:80 blog-image-ai
```

## 環境變數設定

### 1. 建立 .env 檔案
```bash
# 複製範例檔案
cp .env.example .env
```

### 2. 設定 OpenAI API 金鑰
```env
# .env
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_API_BASE_URL=https://api.openai.com/v1
```

⚠️ **安全警告**: 絕對不要將真實的 API 金鑰提交到版本控制系統！

## 常見問題解決

### 1. 套件安裝失敗
```bash
# 清理 npm 快取
npm cache clean --force

# 刪除 node_modules 重新安裝
rm -rf node_modules package-lock.json
npm install
```

### 2. 環境混亂問題
```bash
# 重新激活 conda 環境
conda deactivate
conda activate blog-image-ai

# 確認正確的 Node.js 路徑
which node
which npm
```

### 3. 安全漏洞警告
```bash
# 檢查漏洞詳情
npm audit

# 自動修復（注意可能有 breaking changes）
npm audit fix

# 強制修復（可能破壞相容性）
npm audit fix --force
```

### 4. 埠號衝突
```bash
# 使用其他埠號啟動
npm run dev -- --port 3001
```

## 開發工具設定

### 1. VS Code 擴充套件
推薦安裝以下擴充套件：
- **TypeScript Importer**
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **ESLint**
- **Prettier**

### 2. Git Hooks 設定
```bash
# 安裝 husky（如果專案有使用）
npm run prepare
```

## 效能最佳化建議

### 1. 套件版本更新
```bash
# 檢查過時套件
npm outdated

# 更新套件
npm update
```

### 2. 建構最佳化
```bash
# 生產環境建構
npm run build

# 預覽建構結果
npm run preview
```

## 部署準備

### 1. 環境變數檢查
- 確認所有必要的環境變數已設定
- API 金鑰設定正確
- 基礎 URL 配置無誤

### 2. 建構測試
```bash
# 建構並測試
npm run build
npm run preview

# 檢查建構產物
ls -la dist/
```

## 支援與說明

### 相關文件
- **主要說明**: [README.md](../../README.md)
- **開發指南**: [.github/copilot-instructions.md](../copilot-instructions.md)
- **API 文件**: OpenAI Image Generation API

### 故障排除
如遇到問題，請按照以下順序檢查：
1. Node.js 版本是否正確
2. 環境變數是否設定完整
3. 套件是否安裝成功
4. 網路連線是否正常
5. API 金鑰是否有效

---

**最後更新**: 2025年6月27日
**環境版本**: Node.js 18.x + React 18 + Vite 5.x
