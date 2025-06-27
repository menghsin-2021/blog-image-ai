# BlogImageAI 伺服器建構與啟動指南

## 概述
這份指南提供完整的步驟來建構和啟動 BlogImageAI 應用程式伺服器，使用 Docker Compose 進行容器化部署，支援開發和生產環境。

## 前置需求

### 必要工具
- [Docker](https://docs.docker.com/get-docker/) (版本 20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (版本 1.29+ 或 Docker Compose V2)
- Git

### 系統需求
- macOS、Linux 或 Windows (with WSL2)
- 最少 4GB RAM
- 最少 10GB 可用磁碟空間

## 快速啟動（推薦方式）

### 步驟 1: 複製專案並進入目錄
```bash
git clone https://github.com/menghsin-2021/blog-image-ai.git
cd blog-image-ai
```

### 步驟 2: 設定環境變數
```bash
# 複製環境變數範例檔案（如果 .env 不存在）
cp .env.example .env

# 編輯 .env 檔案，設定您的 OpenAI API 金鑰
nano .env
```

**重要：請確保在 `.env` 檔案中設定有效的 OpenAI API 金鑰：**
```env
VITE_OPENAI_API_KEY=sk-proj-your-actual-api-key-here
```

### 步驟 3: 使用啟動腳本
```bash
# 賦予執行權限（首次使用）
chmod +x start-server.sh

# 啟動開發伺服器
./start-server.sh dev

# 或者簡單執行（預設為開發模式）
./start-server.sh
```

## 啟動腳本使用說明

### 可用指令
```bash
# 啟動開發伺服器（預設，支援熱重載）
./start-server.sh dev

# 啟動生產伺服器（最佳化建構）
./start-server.sh prod

# 停止所有服務
./start-server.sh stop

# 重新啟動服務
./start-server.sh restart

# 查看容器狀態
./start-server.sh status

# 查看容器記錄檔
./start-server.sh logs

# 清理容器和映像檔
./start-server.sh clean

# 顯示幫助訊息
./start-server.sh help
```

### 服務存取地址
- **開發伺服器**: http://localhost:3000
- **生產伺服器**: http://localhost:8080

## 手動操作（進階使用者）

### 使用 Docker Compose 直接操作

#### 開發環境
```bash
# 啟動開發服務
docker-compose up -d blog-image-ai-dev

# 查看記錄檔
docker-compose logs -f blog-image-ai-dev

# 停止服務
docker-compose down
```

#### 生產環境
```bash
# 建構並啟動生產服務
docker-compose up -d blog-image-ai-prod

# 查看記錄檔
docker-compose logs -f blog-image-ai-prod
```

## 容器管理

### 查看容器狀態
```bash
# 查看所有 blog-image-ai 相關容器
docker ps -a --filter "name=blog-image-ai"

# 查看映像檔
docker images --filter "reference=blog-image-ai*"
```

### 容器操作
```bash
# 進入開發容器
docker exec -it blog-image-ai-dev sh

# 查看容器記錄檔
docker logs blog-image-ai-dev

# 重新啟動容器
docker restart blog-image-ai-dev
```

## 故障排除

### 常見問題

#### 1. 容器啟動失敗
```bash
# 檢查容器記錄檔
docker logs blog-image-ai-dev

# 檢查 Docker Compose 設定
docker-compose config

# 重新建構映像檔
docker-compose build --no-cache blog-image-ai-dev
```

#### 2. 連接埠衝突
```bash
# 檢查連接埠使用情況
lsof -i :3000
lsof -i :8080

# 修改 docker-compose.yml 中的連接埠對應
```

#### 3. 環境變數問題
```bash
# 檢查 .env 檔案是否存在
ls -la .env

# 驗證環境變數載入
docker-compose config
```

#### 4. 權限問題（Linux/macOS）
```bash
# 賦予腳本執行權限
chmod +x start-server.sh

# 檢查 Docker 權限
docker ps
```

### 清理和重置

#### 完全清理
```bash
# 停止所有服務
./start-server.sh stop

# 清理所有相關容器和映像檔
./start-server.sh clean

# 清理所有 Docker 資源（謹慎使用）
docker system prune -a
```

#### 重新建構
```bash
# 停止服務
./start-server.sh stop

# 重新建構映像檔
docker-compose build --no-cache

# 重新啟動
./start-server.sh dev
```

## 開發工作流程

### 日常開發
1. 啟動開發伺服器：`./start-server.sh dev`
2. 開啟瀏覽器存取：http://localhost:3000
3. 修改程式碼（支援熱重載）
4. 查看記錄檔：`./start-server.sh logs`
5. 停止伺服器：`./start-server.sh stop`

### 生產部署測試
1. 建構生產版本：`./start-server.sh prod`
2. 測試生產伺服器：http://localhost:8080
3. 檢查效能和功能
4. 停止測試：`./start-server.sh stop`

## 效能監控

### 資源使用情況
```bash
# 查看容器資源使用
docker stats blog-image-ai-dev

# 查看系統資源
docker system df
```

### 記錄檔管理
```bash
# 即時查看記錄檔
./start-server.sh logs

# 查看特定時間範圍的記錄檔
docker logs --since="1h" blog-image-ai-dev

# 查看最後 100 行記錄檔
docker logs --tail=100 blog-image-ai-dev
```

## 安全注意事項

1. **API 金鑰安全**
   - 絕不將 `.env` 檔案提交到版本控制
   - 使用強健的 API 金鑰
   - 定期輪替 API 金鑰

2. **容器安全**
   - 定期更新基礎映像檔
   - 使用非 root 使用者執行容器
   - 限制容器權限

3. **網路安全**
   - 在生產環境中使用 HTTPS
   - 設定適當的防火牆規則
   - 使用反向代理服務器

## 自動化部署

### GitHub Actions（建議）
可以建立 `.github/workflows/deploy.yml` 來自動化部署流程：

```yaml
name: Deploy BlogImageAI
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to server
        run: |
          chmod +x start-server.sh
          ./start-server.sh prod
```

## 相關檔案結構

```
blog-image-ai/
├── docker-compose.yml      # Docker Compose 設定
├── Dockerfile             # 生產環境 Docker 設定
├── Dockerfile.dev         # 開發環境 Docker 設定
├── start-server.sh        # 伺服器啟動腳本
├── .env                   # 環境變數（本機）
├── .env.example           # 環境變數範例
├── nginx.conf             # Nginx 設定檔
└── .github/
    └── prompts/
        └── build-server.prompt.md  # 本檔案
```

## 支援與說明

如果遇到問題，請按照以下順序檢查：

1. 檢查 Docker 和 Docker Compose 是否正確安裝
2. 確認 `.env` 檔案中的 API 金鑰設定正確
3. 查看容器記錄檔：`./start-server.sh logs`
4. 嘗試重新建構：`docker-compose build --no-cache`
5. 查閱專案的 Issues 或建立新的 Issue

---

**更新日期**: 2025年6月27日
**版本**: 1.0.0
**維護者**: BlogImageAI 開發團隊
