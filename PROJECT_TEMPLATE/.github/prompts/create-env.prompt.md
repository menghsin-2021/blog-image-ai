# 建立開發環境 Prompt

## 🚀 任務目標
建立完整的開發環境，包括前端、後端、資料庫和必要的工具設定。

## 📋 執行步驟

### 1. 基礎環境設定
```bash
# 建立專案目錄
mkdir {{PROJECT_NAME}}
cd {{PROJECT_NAME}}

# 初始化 Git
git init
git branch -M main
```

### 2. 前端環境設定
```bash
# 前端專案初始化 (選擇適合的框架)
## React + TypeScript + Vite
npm create vite@latest frontend -- --template react-ts

## Next.js
npx create-next-app@latest frontend --typescript --tailwind --eslint

## Vue 3 + TypeScript
npm create vue@latest frontend
```

### 3. 後端環境設定
```bash
# 後端專案初始化 (選擇適合的框架)
## Node.js + Express + TypeScript
mkdir backend
cd backend
npm init -y
npm install express cors helmet morgan dotenv
npm install -D @types/node @types/express @types/cors typescript ts-node nodemon

## NestJS
npm i -g @nestjs/cli
nest new backend

## Python + FastAPI
mkdir backend
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
pip install fastapi uvicorn sqlalchemy pydantic
```

### 4. 資料庫設定
```bash
# 選擇適合的資料庫
## PostgreSQL with Docker
docker run --name postgres-dev -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres

## MongoDB with Docker
docker run --name mongo-dev -p 27017:27017 -d mongo

## MySQL with Docker
docker run --name mysql-dev -e MYSQL_ROOT_PASSWORD=password -p 3306:3306 -d mysql
```

### 5. 開發工具設定
```bash
# 複製模板設定檔案
cp -r PROJECT_TEMPLATE/.github .
cp -r PROJECT_TEMPLATE/.vscode .

# 建立環境變數檔案
cp .env.example .env
```

## 🔧 AI Assistant 指令

請幫我完成以下任務：

1. **專案初始化**
   - 根據 {{PROJECT_TYPE}} 建立對應的專案結構
   - 設定 package.json 和必要的相依性
   - 建立基本的資料夾結構

2. **開發環境設定**
   - 設定 TypeScript 配置
   - 設定 ESLint 和 Prettier
   - 設定測試環境 (Jest/Vitest)
   - 設定建構工具 (Vite/Webpack)

3. **資料庫設定**
   - 設計基本的資料庫結構
   - 建立資料庫連接設定
   - 設定 ORM/ODM (Prisma/TypeORM/Mongoose)

4. **Docker 設定**
   - 建立 Dockerfile
   - 建立 docker-compose.yml
   - 設定開發和生產環境

5. **CI/CD 設定**
   - 建立 GitHub Actions 工作流程
   - 設定自動化測試
   - 設定部署管道

## 📦 技術棧建議

### 前端選項
- **React + TypeScript + Vite + Tailwind CSS**
- **Next.js + TypeScript + Tailwind CSS**
- **Vue 3 + TypeScript + Vite + Tailwind CSS**

### 後端選項
- **Node.js + Express + TypeScript + Prisma**
- **NestJS + TypeScript + TypeORM**
- **Python + FastAPI + SQLAlchemy**

### 資料庫選項
- **PostgreSQL** (關聯式資料庫)
- **MongoDB** (文件資料庫)
- **Redis** (快取和 Session)

### 部署選項
- **Docker + Docker Compose**
- **Vercel** (前端)
- **Railway/Render** (後端)
- **AWS/GCP/Azure** (雲端服務)

## 🔍 檢查清單

完成後請確認：

- [ ] 專案結構建立完成
- [ ] 前端開發環境正常運作
- [ ] 後端開發環境正常運作
- [ ] 資料庫連接正常
- [ ] 所有必要的設定檔案都已建立
- [ ] Git 倉庫初始化完成
- [ ] 環境變數檔案設定正確
- [ ] 開發伺服器可以正常啟動
- [ ] 基本的 API 端點正常運作
- [ ] 程式碼格式化和檢查工具正常運作

## 🚨 注意事項

1. **安全性**
   - 不要將 API 金鑰和密碼提交到版本控制
   - 使用環境變數管理敏感資訊
   - 設定適當的 CORS 政策

2. **效能**
   - 設定適當的快取策略
   - 最佳化資料庫查詢
   - 考慮前端程式碼分割

3. **維護性**
   - 遵循程式碼規範和最佳實踐
   - 寫清楚的註解和文件
   - 設定適當的測試覆蓋率

---

請根據這個 prompt 幫我建立一個完整的開發環境，並確保所有設定都正確無誤。
