#!/bin/bash

# 專案模板快速設定腳本
# 使用方式: ./setup-project.sh

set -e  # 遇到錯誤立即退出

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 輔助函式
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 顯示歡迎訊息
show_welcome() {
    echo "================================================"
    echo "🚀 專案模板快速設定腳本"
    echo "================================================"
    echo "這個腳本將幫助你快速設定新專案"
    echo "請按照提示輸入相關資訊"
    echo "================================================"
    echo
}

# 收集專案資訊
collect_project_info() {
    log_info "請輸入專案基本資訊:"
    echo
    
    # 專案名稱
    read -p "專案名稱 (英文,小寫,可用連字符): " PROJECT_NAME
    if [ -z "$PROJECT_NAME" ]; then
        log_error "專案名稱不能為空!"
        exit 1
    fi
    
    # 專案描述
    read -p "專案描述: " PROJECT_DESCRIPTION
    if [ -z "$PROJECT_DESCRIPTION" ]; then
        PROJECT_DESCRIPTION="A new project created with AI template"
    fi
    
    # 作者資訊
    read -p "作者姓名: " AUTHOR_NAME
    if [ -z "$AUTHOR_NAME" ]; then
        AUTHOR_NAME=$(git config user.name 2>/dev/null || echo "Your Name")
    fi
    
    read -p "作者信箱: " AUTHOR_EMAIL
    if [ -z "$AUTHOR_EMAIL" ]; then
        AUTHOR_EMAIL=$(git config user.email 2>/dev/null || echo "your.email@example.com")
    fi
    
    # GitHub 使用者名稱
    read -p "GitHub 使用者名稱: " USERNAME
    if [ -z "$USERNAME" ]; then
        USERNAME="your-username"
    fi
    
    echo
    log_info "請選擇專案類型:"
    echo "1) 前端專案 (React + TypeScript + Vite)"
    echo "2) 全端專案 (React + Node.js + TypeScript)"
    echo "3) Python 專案 (FastAPI + Python)"
    echo "4) 自訂專案"
    read -p "請選擇 (1-4): " PROJECT_TYPE
    
    case $PROJECT_TYPE in
        1)
            FRONTEND_FRAMEWORK="React + TypeScript + Vite + Tailwind CSS"
            BACKEND_FRAMEWORK="None"
            DATABASE_TYPE="None"
            ;;
        2)
            FRONTEND_FRAMEWORK="React + TypeScript + Vite + Tailwind CSS"
            BACKEND_FRAMEWORK="Node.js + Express + TypeScript"
            DATABASE_TYPE="PostgreSQL"
            ;;
        3)
            FRONTEND_FRAMEWORK="None"
            BACKEND_FRAMEWORK="Python + FastAPI"
            DATABASE_TYPE="PostgreSQL"
            ;;
        4)
            read -p "前端技術棧: " FRONTEND_FRAMEWORK
            read -p "後端技術棧: " BACKEND_FRAMEWORK
            read -p "資料庫類型: " DATABASE_TYPE
            ;;
        *)
            log_error "無效的選擇!"
            exit 1
            ;;
    esac
}

# 顯示設定摘要
show_summary() {
    echo
    log_info "設定摘要:"
    echo "專案名稱: $PROJECT_NAME"
    echo "專案描述: $PROJECT_DESCRIPTION"
    echo "作者: $AUTHOR_NAME <$AUTHOR_EMAIL>"
    echo "GitHub 使用者: $USERNAME"
    echo "前端技術: $FRONTEND_FRAMEWORK"
    echo "後端技術: $BACKEND_FRAMEWORK"
    echo "資料庫: $DATABASE_TYPE"
    echo
    
    read -p "確認以上資訊正確嗎? (y/N): " CONFIRM
    if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
        log_warning "設定已取消"
        exit 0
    fi
}

# 替換模板變數
replace_template_variables() {
    log_info "正在替換模板變數..."
    
    # 需要替換的檔案列表
    FILES_TO_REPLACE=(
        ".github/copilot-instructions.md"
        "README.md"
        "package.json"
        ".env.example"
    )
    
    for file in "${FILES_TO_REPLACE[@]}"; do
        if [ -f "$file" ]; then
            log_info "處理檔案: $file"
            
            # 使用 sed 替換變數 (macOS 相容版本)
            sed -i '' "s/{{PROJECT_NAME}}/$PROJECT_NAME/g" "$file"
            sed -i '' "s/{{PROJECT_DESCRIPTION}}/$PROJECT_DESCRIPTION/g" "$file"
            sed -i '' "s/{{AUTHOR_NAME}}/$AUTHOR_NAME/g" "$file"
            sed -i '' "s/{{AUTHOR_EMAIL}}/$AUTHOR_EMAIL/g" "$file"
            sed -i '' "s/{{USERNAME}}/$USERNAME/g" "$file"
            sed -i '' "s/{{FRONTEND_FRAMEWORK}}/$FRONTEND_FRAMEWORK/g" "$file"
            sed -i '' "s/{{BACKEND_FRAMEWORK}}/$BACKEND_FRAMEWORK/g" "$file"
            sed -i '' "s/{{DATABASE_TYPE}}/$DATABASE_TYPE/g" "$file"
            
            # 其他常用變數
            sed -i '' "s/{{CURRENT_DATE}}/$(date +%Y-%m-%d)/g" "$file"
            sed -i '' "s/{{GITHUB_REPO_URL}}/https:\/\/github.com\/$USERNAME\/$PROJECT_NAME/g" "$file"
        fi
    done
    
    log_success "模板變數替換完成"
}

# 初始化 Git 倉庫
init_git_repo() {
    log_info "初始化 Git 倉庫..."
    
    if [ ! -d ".git" ]; then
        git init
        git branch -M main
        log_success "Git 倉庫初始化完成"
    else
        log_warning "Git 倉庫已存在，跳過初始化"
    fi
    
    # 建立初始提交
    if [ -z "$(git status --porcelain)" ]; then
        log_info "沒有變更需要提交"
    else
        git add .
        git commit -m "feat: 初始化專案

使用 AI 專案模板建立的新專案
- 專案名稱: $PROJECT_NAME
- 技術棧: $FRONTEND_FRAMEWORK, $BACKEND_FRAMEWORK
- 作者: $AUTHOR_NAME"
        log_success "初始提交完成"
    fi
}

# 設定遠端倉庫
setup_remote_repo() {
    echo
    read -p "是否要設定 GitHub 遠端倉庫? (y/N): " SETUP_REMOTE
    
    if [[ $SETUP_REMOTE =~ ^[Yy]$ ]]; then
        REPO_URL="https://github.com/$USERNAME/$PROJECT_NAME.git"
        
        log_info "設定遠端倉庫: $REPO_URL"
        
        if git remote | grep -q origin; then
            log_warning "origin 遠端已存在，更新 URL"
            git remote set-url origin "$REPO_URL"
        else
            git remote add origin "$REPO_URL"
        fi
        
        log_success "遠端倉庫設定完成"
        log_info "請確保在 GitHub 上建立了對應的倉庫，然後執行:"
        echo "  git push -u origin main"
    fi
}

# 安裝相依性
install_dependencies() {
    echo
    read -p "是否要安裝 npm 相依性? (y/N): " INSTALL_DEPS
    
    if [[ $INSTALL_DEPS =~ ^[Yy]$ ]]; then
        if [ -f "package.json" ]; then
            log_info "安裝 npm 相依性..."
            npm install
            log_success "相依性安裝完成"
        else
            log_warning "找不到 package.json，跳過相依性安裝"
        fi
    fi
}

# 顯示後續步驟
show_next_steps() {
    echo
    log_success "專案設定完成! 🎉"
    echo
    echo "================================================"
    echo "🚀 後續步驟:"
    echo "================================================"
    echo "1. 建立 GitHub 倉庫:"
    echo "   https://github.com/new"
    echo
    echo "2. 推送程式碼到 GitHub:"
    echo "   git push -u origin main"
    echo
    echo "3. 設定環境變數:"
    echo "   cp .env.example .env"
    echo "   # 編輯 .env 檔案，填入實際值"
    echo
    echo "4. 開始開發:"
    echo "   npm run dev"
    echo
    echo "5. 查看專案文件:"
    echo "   - README.md - 專案說明"
    echo "   - 使用指南.md - 模板使用指南"
    echo "   - .github/instructions/ - 開發指令"
    echo
    echo "================================================"
    echo "🤖 AI 協作提示:"
    echo "================================================"
    echo "- 使用 GitHub Copilot 進行程式碼開發"
    echo "- 參考 .github/copilot-instructions.md 中的指令"
    echo "- 使用 .github/prompts/ 中的提示詞模板"
    echo "- 遵循 .github/instructions/ 中的開發流程"
    echo
    echo "祝你開發順利! 🚀"
}

# 主要程式邏輯
main() {
    show_welcome
    collect_project_info
    show_summary
    replace_template_variables
    init_git_repo
    setup_remote_repo
    install_dependencies
    show_next_steps
}

# 執行主要程式
main "$@"
