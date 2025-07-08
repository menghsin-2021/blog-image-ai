# 多階段建構 Dockerfile for {{PROJECT_NAME}}

# 第一階段：建構階段
FROM node:18-alpine AS builder

# 設定工作目錄
WORKDIR /app

# 安裝 pnpm (可選，如果使用 pnpm)
# RUN npm install -g pnpm

# 複製 package 檔案
COPY package*.json ./
# COPY pnpm-lock.yaml ./ (如果使用 pnpm)

# 安裝相依性
RUN npm ci --only=production && npm cache clean --force
# RUN pnpm install --frozen-lockfile --prod (如果使用 pnpm)

# 複製原始碼
COPY . .

# 建構應用程式
RUN npm run build
# RUN pnpm build (如果使用 pnpm)

# 第二階段：生產階段
FROM nginx:alpine AS production

# 安裝必要的套件
RUN apk add --no-cache curl

# 建立非 root 使用者
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# 複製建構產物
COPY --from=builder /app/dist /usr/share/nginx/html

# 複製 nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

# 建立必要的目錄和設定權限
RUN mkdir -p /var/cache/nginx && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nike:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# 切換到非 root 使用者
USER nginx

# 暴露端口
EXPOSE 80

# 健康檢查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:80/ || exit 1

# 啟動指令
CMD ["nginx", "-g", "daemon off;"]

# --- 開發環境 Dockerfile ---
FROM node:18-alpine AS development

# 設定工作目錄
WORKDIR /app

# 安裝開發工具
RUN apk add --no-cache \
    git \
    bash \
    curl \
    vim

# 複製 package 檔案
COPY package*.json ./

# 安裝所有相依性 (包含開發相依性)
RUN npm install && npm cache clean --force

# 複製原始碼
COPY . .

# 暴露端口
EXPOSE 3000 5173

# 建立開發使用者
RUN addgroup -g 1001 -S developer
RUN adduser -S developer -u 1001 -G developer

# 設定權限
RUN chown -R developer:developer /app
USER developer

# 啟動開發伺服器
CMD ["npm", "run", "dev"]

# --- 後端 Node.js Dockerfile (如果需要) ---
FROM node:18-alpine AS backend

# 設定工作目錄
WORKDIR /app

# 安裝系統相依性
RUN apk add --no-cache \
    postgresql-client \
    curl

# 複製後端 package 檔案
COPY backend/package*.json ./

# 安裝相依性
RUN npm ci --only=production && npm cache clean --force

# 複製後端原始碼
COPY backend/ .

# 建構後端應用程式
RUN npm run build

# 建立應用程式使用者
RUN addgroup -g 1001 -S backend
RUN adduser -S backend -u 1001 -G backend

# 設定權限
RUN chown -R backend:backend /app
USER backend

# 暴露端口
EXPOSE 3001

# 健康檢查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

# 啟動指令
CMD ["node", "dist/index.js"]

# --- Python 後端 Dockerfile (如果使用 Python) ---
FROM python:3.11-alpine AS python-backend

# 設定工作目錄
WORKDIR /app

# 安裝系統相依性
RUN apk add --no-cache \
    gcc \
    musl-dev \
    postgresql-dev \
    curl

# 建立虛擬環境
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# 複製 requirements 檔案
COPY backend/requirements.txt .
COPY backend/requirements-prod.txt .

# 安裝 Python 相依性
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements-prod.txt

# 複製應用程式程式碼
COPY backend/ .

# 建立應用程式使用者
RUN addgroup -g 1001 -S python
RUN adduser -S python -u 1001 -G python

# 設定權限
RUN chown -R python:python /app
USER python

# 暴露端口
EXPOSE 8000

# 健康檢查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# 啟動指令
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
