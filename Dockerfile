# 使用 Node.js 18 作為建構環境
FROM node:18-alpine as builder

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝相依套件
RUN npm ci --only=production

# 複製原始碼
COPY . .

# 建構應用程式
RUN npm run build

# 使用 nginx 作為生產環境
FROM nginx:alpine

# 複製建構結果到 nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# 複製 nginx 設定
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露連接埠
EXPOSE 80

# 啟動 nginx
CMD ["nginx", "-g", "daemon off;"]
