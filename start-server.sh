#!/bin/bash

# BlogImageAI 開發伺服器啟動腳本
# 使用 Docker Compose 管理容器生命週期

set -e  # 遇到錯誤時立即退出

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 輔助函式
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 檢查必要工具
check_dependencies() {
    print_info "檢查必要工具..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker 未安裝。請先安裝 Docker。"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose 未安裝。請先安裝 Docker Compose。"
        exit 1
    fi
    
    print_success "必要工具檢查完成"
}

# 檢查環境變數檔案
check_env_file() {
    print_info "檢查環境變數設定..."
    
    if [ ! -f ".env" ]; then
        print_warning ".env 檔案不存在，複製自 .env.example"
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_info "請編輯 .env 檔案設定您的 OpenAI API 金鑰"
        else
            print_error ".env.example 檔案不存在"
            exit 1
        fi
    fi
    
    # 檢查 OpenAI API 金鑰是否設定
    if grep -q "^VITE_OPENAI_API_KEY=sk-" .env; then
        print_success "OpenAI API 金鑰已設定"
    else
        print_warning "請確認 .env 檔案中的 VITE_OPENAI_API_KEY 已正確設定"
    fi
}

# 停止並清理現有容器
cleanup_containers() {
    print_info "清理現有容器..."
    
    # 停止所有服務
    docker-compose down --remove-orphans 2>/dev/null || docker compose down --remove-orphans 2>/dev/null || true
    
    # 清理未使用的映像檔（可選）
    if [ "$1" = "--clean" ]; then
        print_info "清理未使用的 Docker 映像檔..."
        docker image prune -f
    fi
    
    print_success "容器清理完成"
}

# 啟動開發伺服器
start_dev_server() {
    print_info "啟動開發伺服器..."
    
    # 使用 Docker Compose 啟動開發服務
    if command -v docker-compose &> /dev/null; then
        docker-compose up -d blog-image-ai-dev
    else
        docker compose up -d blog-image-ai-dev
    fi
    
    # 等待服務啟動
    print_info "等待服務啟動..."
    sleep 5
    
    # 檢查容器狀態
    if docker ps | grep -q "blog-image-ai-dev"; then
        print_success "開發伺服器已成功啟動！"
        print_info "存取地址: http://localhost:3000"
        print_info "容器名稱: blog-image-ai-dev"
        
        # 顯示容器記錄檔
        print_info "顯示容器記錄檔（按 Ctrl+C 退出）:"
        if command -v docker-compose &> /dev/null; then
            docker-compose logs -f blog-image-ai-dev
        else
            docker compose logs -f blog-image-ai-dev
        fi
    else
        print_error "容器啟動失敗"
        exit 1
    fi
}

# 啟動生產伺服器
start_prod_server() {
    print_info "啟動生產伺服器..."
    
    # 使用 Docker Compose 啟動生產服務
    if command -v docker-compose &> /dev/null; then
        docker-compose up -d blog-image-ai-prod
    else
        docker compose up -d blog-image-ai-prod
    fi
    
    # 等待服務啟動
    print_info "等待服務啟動..."
    sleep 10
    
    # 檢查容器狀態
    if docker ps | grep -q "blog-image-ai-prod"; then
        print_success "生產伺服器已成功啟動！"
        print_info "存取地址: http://localhost:8080"
        print_info "容器名稱: blog-image-ai-prod"
    else
        print_error "容器啟動失敗"
        exit 1
    fi
}

# 顯示容器狀態
show_status() {
    print_info "Docker 容器狀態:"
    docker ps -a --filter "name=blog-image-ai"
    
    echo ""
    print_info "Docker 映像檔:"
    docker images --filter "reference=blog-image-ai*"
    
    echo ""
    print_info "網路狀態:"
    docker network ls --filter "name=blog-image-ai"
}

# 顯示使用說明
show_help() {
    echo "BlogImageAI 伺服器管理腳本"
    echo ""
    echo "使用方式:"
    echo "  $0 [選項]"
    echo ""
    echo "選項:"
    echo "  dev                啟動開發伺服器 (預設)"
    echo "  prod               啟動生產伺服器"
    echo "  stop               停止所有服務"
    echo "  restart            重新啟動服務"
    echo "  status             顯示容器狀態"
    echo "  logs               顯示容器記錄檔"
    echo "  clean              清理容器和映像檔"
    echo "  help, --help, -h   顯示此說明"
    echo ""
    echo "範例:"
    echo "  $0                 # 啟動開發伺服器"
    echo "  $0 dev             # 啟動開發伺服器"
    echo "  $0 prod            # 啟動生產伺服器"
    echo "  $0 stop            # 停止所有服務"
    echo "  $0 clean           # 清理並重新建構"
}

# 主要邏輯
main() {
    cd "$(dirname "$0")"  # 切換到腳本所在目錄
    
    case "${1:-dev}" in
        "dev")
            check_dependencies
            check_env_file
            cleanup_containers
            start_dev_server
            ;;
        "prod")
            check_dependencies
            check_env_file
            cleanup_containers
            start_prod_server
            ;;
        "stop")
            cleanup_containers
            print_success "所有服務已停止"
            ;;
        "restart")
            check_dependencies
            check_env_file
            cleanup_containers
            start_dev_server
            ;;
        "status")
            show_status
            ;;
        "logs")
            print_info "顯示開發伺服器記錄檔:"
            if command -v docker-compose &> /dev/null; then
                docker-compose logs -f blog-image-ai-dev
            else
                docker compose logs -f blog-image-ai-dev
            fi
            ;;
        "clean")
            cleanup_containers --clean
            print_success "清理完成"
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        *)
            print_error "未知選項: $1"
            show_help
            exit 1
            ;;
    esac
}

# 執行主程式
main "$@"
