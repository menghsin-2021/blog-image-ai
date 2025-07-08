#!/bin/bash

# Git 自動化腳本
# 提供常用的 Git 工作流程指令

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

# 檢查 Git 狀態
git_status_check() {
    log_info "檢查 Git 狀態..."
    
    # 檢查是否在 Git 倉庫中
    if ! git rev-parse --is-inside-work-tree &>/dev/null; then
        log_error "不在 Git 倉庫中！"
        return 1
    fi
    
    # 顯示當前分支
    local current_branch=$(git branch --show-current)
    log_info "當前分支: $current_branch"
    
    # 檢查工作目錄狀態
    if ! git diff-index --quiet HEAD --; then
        log_warning "工作目錄有未提交的變更"
        git status --short
    else
        log_success "工作目錄乾淨"
    fi
    
    # 檢查是否有未推送的提交
    local unpushed=$(git log @{u}.. --oneline 2>/dev/null | wc -l)
    if [ $unpushed -gt 0 ]; then
        log_warning "有 $unpushed 個未推送的提交"
    fi
}

# 建立功能分支
create_feature_branch() {
    local feature_name=$1
    
    if [ -z "$feature_name" ]; then
        log_error "請提供功能分支名稱"
        echo "使用方式: create_feature_branch <功能名稱>"
        return 1
    fi
    
    log_info "建立功能分支: feature/$feature_name"
    
    # 確保在 develop 分支
    git checkout develop
    git pull origin develop
    
    # 建立並切換到功能分支
    git checkout -b "feature/$feature_name"
    
    log_success "功能分支 feature/$feature_name 建立完成"
}

# 完成功能開發
finish_feature() {
    local current_branch=$(git branch --show-current)
    
    if [[ ! $current_branch == feature/* ]]; then
        log_error "目前不在功能分支上！"
        return 1
    fi
    
    log_info "完成功能開發: $current_branch"
    
    # 檢查是否有未提交的變更
    if ! git diff-index --quiet HEAD --; then
        log_error "請先提交所有變更"
        return 1
    fi
    
    # 同步 develop 分支
    git checkout develop
    git pull origin develop
    git checkout "$current_branch"
    git rebase develop
    
    # 推送功能分支
    git push origin "$current_branch"
    
    log_success "功能分支準備完成，可以建立 Pull Request"
}

# 建立發布分支
create_release_branch() {
    local version=$1
    
    if [ -z "$version" ]; then
        log_error "請提供版本號"
        echo "使用方式: create_release_branch <版本號>"
        return 1
    fi
    
    log_info "建立發布分支: release/$version"
    
    # 確保在 develop 分支
    git checkout develop
    git pull origin develop
    
    # 建立發布分支
    git checkout -b "release/$version"
    
    log_success "發布分支 release/$version 建立完成"
}

# 完成發布
finish_release() {
    local current_branch=$(git branch --show-current)
    
    if [[ ! $current_branch == release/* ]]; then
        log_error "目前不在發布分支上！"
        return 1
    fi
    
    local version=${current_branch#release/}
    log_info "完成發布: $version"
    
    # 合併到 main
    git checkout main
    git pull origin main
    git merge --no-ff "$current_branch"
    git tag -a "$version" -m "Release $version"
    
    # 合併回 develop
    git checkout develop
    git merge --no-ff "$current_branch"
    
    # 推送所有變更
    git push origin main
    git push origin develop
    git push origin "$version"
    
    # 刪除發布分支
    git branch -d "$current_branch"
    git push origin --delete "$current_branch"
    
    log_success "發布 $version 完成"
}

# 建立熱修復分支
create_hotfix_branch() {
    local fix_name=$1
    
    if [ -z "$fix_name" ]; then
        log_error "請提供熱修復名稱"
        echo "使用方式: create_hotfix_branch <修復名稱>"
        return 1
    fi
    
    log_info "建立熱修復分支: hotfix/$fix_name"
    
    # 從 main 分支建立
    git checkout main
    git pull origin main
    git checkout -b "hotfix/$fix_name"
    
    log_success "熱修復分支 hotfix/$fix_name 建立完成"
}

# 快速提交
quick_commit() {
    local message=$1
    
    if [ -z "$message" ]; then
        log_error "請提供提交訊息"
        echo "使用方式: quick_commit <提交訊息>"
        return 1
    fi
    
    log_info "快速提交變更..."
    
    git add .
    git commit -m "$message"
    
    local current_branch=$(git branch --show-current)
    git push origin "$current_branch"
    
    log_success "變更已提交並推送"
}

# 清理已合併的分支
cleanup_branches() {
    log_info "清理已合併的分支..."
    
    # 切換到 develop 分支
    git checkout develop
    git pull origin develop
    
    # 刪除已合併的本地分支
    git branch --merged | grep -v "\\*\\|main\\|develop" | xargs -n 1 git branch -d
    
    # 清理遠端追蹤分支
    git remote prune origin
    
    log_success "分支清理完成"
}

# 同步 fork 的倉庫
sync_fork() {
    log_info "同步 fork 的倉庫..."
    
    # 檢查是否設定了 upstream
    if ! git remote | grep -q upstream; then
        log_error "請先設定 upstream 遠端倉庫"
        echo "git remote add upstream <原始倉庫URL>"
        return 1
    fi
    
    # 獲取 upstream 的變更
    git fetch upstream
    
    # 合併到 main 分支
    git checkout main
    git merge upstream/main
    git push origin main
    
    # 合併到 develop 分支
    git checkout develop
    git merge upstream/develop
    git push origin develop
    
    log_success "fork 同步完成"
}

# 顯示幫助資訊
show_help() {
    echo "Git 自動化腳本使用指南"
    echo "======================="
    echo
    echo "基本指令:"
    echo "  git-status-check              檢查 Git 狀態"
    echo "  quick-commit <訊息>           快速提交變更"
    echo "  cleanup-branches              清理已合併的分支"
    echo "  sync-fork                     同步 fork 的倉庫"
    echo
    echo "功能開發流程:"
    echo "  create-feature-branch <名稱>  建立功能分支"
    echo "  finish-feature                完成功能開發"
    echo
    echo "發布流程:"
    echo "  create-release-branch <版本>  建立發布分支"
    echo "  finish-release                完成發布"
    echo
    echo "熱修復流程:"
    echo "  create-hotfix-branch <名稱>   建立熱修復分支"
    echo
    echo "使用範例:"
    echo "  ./git-automation.sh create-feature-branch user-auth"
    echo "  ./git-automation.sh quick-commit 'feat: 新增使用者認證'"
    echo "  ./git-automation.sh create-release-branch v1.2.0"
}

# 主要程式邏輯
main() {
    case $1 in
        "git-status-check")
            git_status_check
            ;;
        "create-feature-branch")
            create_feature_branch "$2"
            ;;
        "finish-feature")
            finish_feature
            ;;
        "create-release-branch")
            create_release_branch "$2"
            ;;
        "finish-release")
            finish_release
            ;;
        "create-hotfix-branch")
            create_hotfix_branch "$2"
            ;;
        "quick-commit")
            quick_commit "$2"
            ;;
        "cleanup-branches")
            cleanup_branches
            ;;
        "sync-fork")
            sync_fork
            ;;
        "help"|"-h"|"--help"|"")
            show_help
            ;;
        *)
            log_error "未知指令: $1"
            show_help
            ;;
    esac
}

# 執行主要程式
main "$@"
