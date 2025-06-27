#!/bin/bash
# BlogImageAI Git 自動化腳本
# 使用方式: source .github/scripts/git-automation.sh

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 輔助函式
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}🔄 $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

# 檢查是否在 Git 儲存庫中
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_error "當前目錄不是 Git 儲存庫"
        return 1
    fi
}

# 檢查分支是否存在
check_branch_exists() {
    if ! git show-ref --verify --quiet refs/heads/$1; then
        print_error "分支 '$1' 不存在"
        return 1
    fi
}

# ========== 功能分支 PR 流程 ==========

# 建立功能分支並準備 PR
create-feature-pr() {
    check_git_repo || return 1
    
    if [ -z "$1" ]; then
        print_error "用法: create-feature-pr <功能名稱>"
        echo "範例: create-feature-pr 圖片編輯功能"
        return 1
    fi
    
    local feature_name="$1"
    local branch_name="feature/$feature_name"
    
    print_info "開始建立功能分支 PR 流程..."
    
    # 1. 同步 develop 分支
    print_info "同步 develop 分支..."
    git checkout develop || {
        print_error "無法切換到 develop 分支"
        return 1
    }
    git pull origin develop || {
        print_error "無法同步 develop 分支"
        return 1
    }
    
    # 2. 檢查分支是否已存在
    if git show-ref --verify --quiet refs/heads/"$branch_name"; then
        print_warning "分支 $branch_name 已存在，將切換到該分支"
        git checkout "$branch_name"
    else
        # 建立新的功能分支
        print_info "建立功能分支: $branch_name"
        git checkout -b "$branch_name" || {
            print_error "無法建立功能分支"
            return 1
        }
    fi
    
    # 3. 推送分支到遠端
    print_info "推送分支到遠端..."
    git push -u origin "$branch_name" || {
        print_error "無法推送分支到遠端"
        return 1
    }
    
    print_success "功能分支已建立: $branch_name"
    print_info "現在可以開始開發功能，完成後執行: finish-feature-pr"
    echo ""
    echo "📝 建議的 commit 格式:"
    echo "  git commit -m \"feat(scope): 功能描述\""
    echo "  git commit -m \"fix(scope): 修復描述\""
}

# 完成功能開發並準備建立 PR
finish-feature-pr() {
    check_git_repo || return 1
    
    local current_branch=$(git branch --show-current)
    
    if [[ ! $current_branch == feature/* ]]; then
        print_error "當前不在功能分支 (feature/*)"
        echo "當前分支: $current_branch"
        return 1
    fi
    
    print_info "完成功能開發 PR 流程..."
    
    # 1. 檢查是否有未提交的變更
    if ! git diff-index --quiet HEAD --; then
        print_warning "發現未提交的變更，是否要先提交？ (y/n)"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            print_info "請先提交您的變更:"
            echo "  git add ."
            echo "  git commit -m \"feat: 功能描述\""
            return 1
        fi
    fi
    
    # 2. 同步 develop 分支最新變更
    print_info "同步 develop 分支最新變更..."
    git checkout develop || return 1
    git pull origin develop || return 1
    git checkout "$current_branch" || return 1
    
    # 3. 合併 develop 到功能分支
    print_info "合併 develop 到功能分支..."
    if ! git merge develop; then
        print_error "合併發生衝突，請手動解決後再執行 finish-feature-pr"
        return 1
    fi
    
    # 4. 推送最終變更
    print_info "推送最終變更..."
    git push origin "$current_branch" || {
        print_error "無法推送變更到遠端"
        return 1
    }
    
    # 5. 建立 PR URL
    local repo_url=$(git remote get-url origin | sed 's/\.git$//' | sed 's/git@github.com:/https:\/\/github.com\//')
    local pr_url="$repo_url/compare/develop...$current_branch"
    
    print_success "功能開發完成！"
    echo ""
    echo "🔗 請前往建立 Pull Request:"
    echo "$pr_url"
    echo ""
    echo "📋 建議的 PR 標題: [Feature] ${current_branch#feature/}"
    echo ""
    echo "📝 PR 描述模板:"
    echo "## 📋 變更摘要"
    echo "簡述此次功能的內容和目的"
    echo ""
    echo "## 🎯 相關 Issue"
    echo "Closes #"
    echo ""
    echo "## 🔧 主要變更"
    echo "- [ ] 新增 ${current_branch#feature/} 功能"
    echo "- [ ] 更新相關文件"
    echo "- [ ] 新增測試"
}

# ========== 版本發布 PR 流程 ==========

# 建立版本發布分支並準備 PR
create-release-pr() {
    check_git_repo || return 1
    
    if [ -z "$1" ]; then
        print_error "用法: create-release-pr <版本號>"
        echo "範例: create-release-pr v1.2.0"
        return 1
    fi
    
    local version="$1"
    local release_branch="release/$version"
    
    print_info "開始建立版本發布 PR 流程..."
    
    # 1. 同步 main 和 develop 分支
    print_info "同步 main 分支..."
    git checkout main || return 1
    git pull origin main || return 1
    
    print_info "同步 develop 分支..."
    git checkout develop || return 1
    git pull origin develop || return 1
    
    # 2. 檢查發布分支是否已存在
    if git show-ref --verify --quiet refs/heads/"$release_branch"; then
        print_warning "發布分支 $release_branch 已存在，將切換到該分支"
        git checkout "$release_branch"
    else
        # 建立新的發布分支
        print_info "建立發布分支: $release_branch"
        git checkout -b "$release_branch" || return 1
    fi
    
    # 3. 更新版本號 (如果有 package.json)
    if [ -f "package.json" ]; then
        print_info "更新 package.json 版本號..."
        npm version "$version" --no-git-tag-version || {
            print_warning "無法更新 package.json 版本號，請手動更新"
        }
        if git diff-index --quiet HEAD --; then
            print_info "沒有版本號變更"
        else
            git add package.json
            git commit -m "chore(release): 更新版本號到 $version"
        fi
    fi
    
    # 4. 推送發布分支
    print_info "推送發布分支到遠端..."
    git push -u origin "$release_branch" || return 1
    
    # 5. 建立 PR URL
    local repo_url=$(git remote get-url origin | sed 's/\.git$//' | sed 's/git@github.com:/https:\/\/github.com\//')
    local pr_url="$repo_url/compare/main...$release_branch"
    
    print_success "發布分支已建立: $release_branch"
    echo ""
    echo "🔗 請前往建立 Release Pull Request:"
    echo "$pr_url"
    echo ""
    echo "📋 建議的 PR 標題: [Release] $version"
}

# 完成版本發布流程
finish-release-pr() {
    check_git_repo || return 1
    
    local current_branch=$(git branch --show-current)
    
    if [[ ! $current_branch == release/* ]]; then
        print_error "當前不在發布分支 (release/*)"
        echo "當前分支: $current_branch"
        return 1
    fi
    
    local version="${current_branch#release/}"
    
    print_warning "即將完成版本 $version 的發布流程"
    print_warning "這將會合併到 main 分支並建立標籤，確定要繼續嗎？ (y/n)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        print_info "已取消發布流程"
        return 0
    fi
    
    print_info "完成版本發布流程..."
    
    # 1. 合併到 main
    print_info "合併到 main 分支..."
    git checkout main || return 1
    git pull origin main || return 1
    
    if ! git merge "$current_branch"; then
        print_error "合併到 main 分支時發生衝突，請手動解決"
        return 1
    fi
    
    # 2. 建立版本標籤
    print_info "建立版本標籤: $version"
    if git tag -l | grep -q "^$version$"; then
        print_warning "標籤 $version 已存在，跳過建立標籤"
    else
        git tag "$version" || return 1
    fi
    
    # 3. 推送 main 和標籤
    print_info "推送 main 分支和標籤..."
    git push origin main || return 1
    git push origin "$version" || return 1
    
    # 4. 同步回 develop
    print_info "同步變更回 develop 分支..."
    git checkout develop || return 1
    git merge main || return 1
    git push origin develop || return 1
    
    # 5. 清理發布分支
    print_info "清理發布分支..."
    git branch -d "$current_branch" || {
        print_warning "無法刪除本地發布分支，請手動清理"
    }
    git push origin --delete "$current_branch" || {
        print_warning "無法刪除遠端發布分支，請手動清理"
    }
    
    print_success "版本 $version 發布完成！"
    print_success "已同步到所有分支並建立標籤"
    echo ""
    echo "🎉 發布成功！"
    echo "📋 發布摘要:"
    echo "  - 版本: $version"
    echo "  - 主分支已更新"
    echo "  - 標籤已建立"
    echo "  - develop 分支已同步"
}

# ========== GitHub CLI 整合 ==========

# 檢查 GitHub CLI 是否安裝
check_gh_cli() {
    if ! command -v gh &> /dev/null; then
        print_error "GitHub CLI (gh) 未安裝"
        echo "請先安裝: brew install gh"
        echo "然後登入: gh auth login"
        return 1
    fi
    
    if ! gh auth status &> /dev/null; then
        print_error "GitHub CLI 未登入"
        echo "請先登入: gh auth login"
        return 1
    fi
}

# 使用 GitHub CLI 自動建立功能 PR
auto-create-feature-pr() {
    check_git_repo || return 1
    check_gh_cli || return 1
    
    local current_branch=$(git branch --show-current)
    
    if [[ ! $current_branch == feature/* ]]; then
        print_error "當前不在功能分支 (feature/*)"
        return 1
    fi
    
    local feature_name="${current_branch#feature/}"
    local pr_title="[Feature] $feature_name"
    local pr_body="## 📋 變更摘要
自動建立的功能 PR - $feature_name

## 🎯 相關 Issue
Closes #

## 🔧 主要變更
- [ ] 新增 $feature_name 功能
- [ ] 更新相關文件
- [ ] 新增測試

## 🧪 測試情況
- [ ] 單元測試通過
- [ ] 整合測試通過
- [ ] 手動測試完成

## 📝 注意事項
請在合併前確認所有檢查項目都已完成。"
    
    # 確保分支已推送
    print_info "推送分支到遠端..."
    git push origin "$current_branch" || return 1
    
    # 建立 PR
    print_info "建立 Pull Request..."
    gh pr create \
        --title "$pr_title" \
        --body "$pr_body" \
        --base develop \
        --head "$current_branch" || return 1
    
    print_success "Pull Request 已建立！"
    
    # 顯示 PR URL
    local pr_url=$(gh pr view --json url --jq '.url')
    echo "🔗 PR 連結: $pr_url"
}

# 使用 GitHub CLI 自動建立發布 PR
auto-create-release-pr() {
    check_git_repo || return 1
    check_gh_cli || return 1
    
    local current_branch=$(git branch --show-current)
    
    if [[ ! $current_branch == release/* ]]; then
        print_error "當前不在發布分支 (release/*)"
        return 1
    fi
    
    local version="${current_branch#release/}"
    local pr_title="[Release] $version"
    local pr_body="## 🚀 版本發布 $version

## 📋 本次發布內容
- 包含 develop 分支的所有最新功能
- 版本號已更新到 $version
- 已通過所有測試

## 🔍 發布檢查清單
- [ ] 版本號正確更新
- [ ] 所有功能測試通過
- [ ] 文件已更新
- [ ] 無重大問題

## 📝 發布說明
請在合併前確認所有檢查項目都已完成。

⚠️ 合併此 PR 將會：
1. 更新 main 分支
2. 建立版本標籤 $version
3. 觸發生產環境部署"
    
    # 確保分支已推送
    print_info "推送分支到遠端..."
    git push origin "$current_branch" || return 1
    
    # 建立 PR
    print_info "建立 Release Pull Request..."
    gh pr create \
        --title "$pr_title" \
        --body "$pr_body" \
        --base main \
        --head "$current_branch" || return 1
    
    print_success "Release Pull Request 已建立！"
    
    # 顯示 PR URL
    local pr_url=$(gh pr view --json url --jq '.url')
    echo "🔗 PR 連結: $pr_url"
}

# ========== 輔助指令 ==========

# 顯示可用的指令
git-help() {
    echo "🚀 BlogImageAI Git 自動化指令"
    echo ""
    echo "📋 功能分支流程:"
    echo "  create-feature-pr <功能名稱>     建立功能分支並準備 PR"
    echo "  finish-feature-pr               完成功能開發並準備建立 PR"
    echo "  auto-create-feature-pr          使用 GitHub CLI 自動建立功能 PR"
    echo ""
    echo "📋 版本發布流程:"
    echo "  create-release-pr <版本號>       建立發布分支並準備 PR"
    echo "  finish-release-pr               完成版本發布流程"
    echo "  auto-create-release-pr          使用 GitHub CLI 自動建立發布 PR"
    echo ""
    echo "📋 輔助指令:"
    echo "  git-help                        顯示此說明"
    echo "  git-status-check                檢查當前 Git 狀態"
    echo ""
    echo "📝 範例:"
    echo "  create-feature-pr \"圖片編輯功能\""
    echo "  create-release-pr \"v1.2.0\""
}

# 檢查當前 Git 狀態
git-status-check() {
    check_git_repo || return 1
    
    echo "📊 Git 狀態檢查"
    echo ""
    
    # 當前分支
    local current_branch=$(git branch --show-current)
    echo "🌱 當前分支: $current_branch"
    
    # 分支類型
    if [[ $current_branch == feature/* ]]; then
        echo "📋 分支類型: 功能分支"
    elif [[ $current_branch == release/* ]]; then
        echo "📋 分支類型: 發布分支"
    elif [[ $current_branch == hotfix/* ]]; then
        echo "📋 分支類型: 緊急修復分支"
    elif [[ $current_branch == "main" ]]; then
        echo "📋 分支類型: 主分支"
    elif [[ $current_branch == "develop" ]]; then
        echo "📋 分支類型: 開發分支"
    else
        echo "📋 分支類型: 其他"
    fi
    
    # 未提交的變更
    if ! git diff-index --quiet HEAD --; then
        print_warning "有未提交的變更"
        git status --porcelain
    else
        print_success "沒有未提交的變更"
    fi
    
    # 與遠端的同步狀態
    local ahead_behind=$(git rev-list --left-right --count origin/$current_branch...$current_branch 2>/dev/null)
    if [ $? -eq 0 ]; then
        local behind=$(echo $ahead_behind | cut -f1)
        local ahead=$(echo $ahead_behind | cut -f2)
        
        if [ "$ahead" -gt 0 ] && [ "$behind" -gt 0 ]; then
            print_warning "分支與遠端有分歧 (領先 $ahead 個提交，落後 $behind 個提交)"
        elif [ "$ahead" -gt 0 ]; then
            print_info "分支領先遠端 $ahead 個提交"
        elif [ "$behind" -gt 0 ]; then
            print_warning "分支落後遠端 $behind 個提交"
        else
            print_success "分支與遠端同步"
        fi
    else
        print_warning "無法檢查與遠端的同步狀態 (可能是新分支)"
    fi
    
    echo ""
    echo "💡 建議的下一步操作:"
    if [[ $current_branch == feature/* ]]; then
        echo "  - 完成功能開發: finish-feature-pr"
        echo "  - 自動建立 PR: auto-create-feature-pr"
    elif [[ $current_branch == release/* ]]; then
        echo "  - 完成發布: finish-release-pr"
        echo "  - 自動建立發布 PR: auto-create-release-pr"
    elif [[ $current_branch == "develop" ]]; then
        echo "  - 建立功能分支: create-feature-pr <功能名稱>"
        echo "  - 準備發布: create-release-pr <版本號>"
    elif [[ $current_branch == "main" ]]; then
        echo "  - 切換到開發分支: git checkout develop"
    fi
}

# 顯示載入成功訊息
print_success "BlogImageAI Git 自動化腳本已載入"
echo "執行 'git-help' 查看可用指令"
