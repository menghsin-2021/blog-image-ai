#!/bin/bash

# BlogImageAI 功能測試腳本
# 快速驗證應用程式基本功能

set -e

# 顏色定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# 測試容器是否在執行
test_container_running() {
    print_info "檢查容器是否在執行..."
    
    if docker ps | grep -q "blog-image-ai-dev"; then
        print_success "開發容器正在執行"
        return 0
    else
        print_warning "開發容器未執行，嘗試啟動..."
        ./start-server.sh dev > /dev/null 2>&1 &
        sleep 10
        if docker ps | grep -q "blog-image-ai-dev"; then
            print_success "開發容器已啟動"
            return 0
        else
            echo "❌ 容器啟動失敗"
            return 1
        fi
    fi
}

# 測試網頁是否可以存取
test_web_access() {
    print_info "測試網頁存取..."
    
    # 等待伺服器準備就緒
    sleep 5
    
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
        print_success "網頁可以正常存取 (http://localhost:3000)"
        return 0
    else
        echo "❌ 網頁無法存取"
        return 1
    fi
}

# 測試環境變數
test_env_config() {
    print_info "檢查環境變數設定..."
    
    if [ -f ".env" ]; then
        if grep -q "^VITE_OPENAI_API_KEY=sk-" .env; then
            print_success "OpenAI API 金鑰已設定"
        else
            print_warning "OpenAI API 金鑰未設定，某些功能可能無法使用"
        fi
        
        if grep -q "^VITE_DEFAULT_MODEL=" .env; then
            local model=$(grep "^VITE_DEFAULT_MODEL=" .env | cut -d'=' -f2)
            print_success "預設模型: $model"
        fi
    else
        print_warning ".env 檔案不存在"
    fi
}

# 測試 Docker Compose 設定
test_docker_compose() {
    print_info "驗證 Docker Compose 設定..."
    
    if docker-compose config > /dev/null 2>&1 || docker compose config > /dev/null 2>&1; then
        print_success "Docker Compose 設定有效"
        return 0
    else
        echo "❌ Docker Compose 設定無效"
        return 1
    fi
}

# 顯示系統資訊
show_system_info() {
    print_info "系統資訊:"
    echo "Docker 版本: $(docker --version)"
    echo "Docker Compose 版本: $(docker-compose --version 2>/dev/null || docker compose version 2>/dev/null || echo 'N/A')"
    echo "容器數量: $(docker ps -q | wc -l | tr -d ' ')"
    echo "映像檔數量: $(docker images -q | wc -l | tr -d ' ')"
}

# 主要測試流程
main() {
    echo "🧪 BlogImageAI 功能測試開始"
    echo "================================"
    
    cd "$(dirname "$0")"
    
    show_system_info
    echo ""
    
    test_env_config
    test_docker_compose
    test_container_running
    test_web_access
    
    echo ""
    echo "================================"
    echo "✅ 基本功能測試完成"
    echo ""
    echo "🌐 應用程式存取地址:"
    echo "   開發伺服器: http://localhost:3000"
    echo "   生產伺服器: http://localhost:8080"
    echo ""
    echo "📊 容器狀態:"
    docker ps --filter "name=blog-image-ai" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
    echo "🛠️  管理指令:"
    echo "   查看記錄檔: ./start-server.sh logs"
    echo "   停止服務:   ./start-server.sh stop"
    echo "   查看狀態:   ./start-server.sh status"
}

# 執行測試
main "$@"
