# 自動化 Pull Request 工作流程

## 🎯 概覽

這個工作流程提供自動化的 Pull Request 建立和合併流程，包含從功能分支到 develop 分支，以及從 develop 分支到 main 分支的自動化操作。

## 🚀 自動化 PR 流程

### 1. Feature Branch → Develop PR 流程

#### 準備階段
```bash
# 自動同步並建立功能分支
function create-feature-pr() {
    if [ -z "$1" ]; then
        echo "用法: create-feature-pr <功能名稱>"
        return 1
    fi
    
    local feature_name="$1"
    local branch_name="feature/$feature_name"
    
    echo "🔄 開始建立功能分支 PR 流程..."
    
    # 1. 同步 develop 分支
    echo "📥 同步 develop 分支..."
    git checkout develop
    git pull origin develop
    
    # 2. 建立功能分支
    echo "🌱 建立功能分支: $branch_name"
    git checkout -b "$branch_name"
    
    # 3. 推送分支到遠端
    git push -u origin "$branch_name"
    
    echo "✅ 功能分支已建立: $branch_name"
    echo "🎯 現在可以開始開發功能，完成後執行: finish-feature-pr"
}
```

#### 完成階段
```bash
# 自動完成功能開發並建立 PR
function finish-feature-pr() {
    local current_branch=$(git branch --show-current)
    
    if [[ ! $current_branch == feature/* ]]; then
        echo "❌ 錯誤: 當前不在功能分支"
        return 1
    fi
    
    echo "🔄 完成功能開發 PR 流程..."
    
    # 1. 同步 develop 分支最新變更
    echo "📥 同步 develop 分支最新變更..."
    git checkout develop
    git pull origin develop
    git checkout "$current_branch"
    
    # 2. 合併 develop 到功能分支
    echo "🔀 合併 develop 到功能分支..."
    git merge develop
    
    # 3. 推送最終變更
    echo "📤 推送最終變更..."
    git push origin "$current_branch"
    
    # 4. 建立 PR URL
    local repo_url=$(git remote get-url origin | sed 's/\.git$//')
    local pr_url="$repo_url/compare/develop...$current_branch"
    
    echo "✅ 功能開發完成！"
    echo "🔗 請前往建立 Pull Request:"
    echo "$pr_url"
    echo ""
    echo "📋 PR 標題建議: [Feature] ${current_branch#feature/}"
}
```

### 2. Develop → Main PR 流程 (版本發布)

#### 準備發布
```bash
# 自動準備版本發布 PR
function create-release-pr() {
    if [ -z "$1" ]; then
        echo "用法: create-release-pr <版本號>"
        echo "範例: create-release-pr v1.2.0"
        return 1
    fi
    
    local version="$1"
    local release_branch="release/$version"
    
    echo "🔄 開始建立版本發布 PR 流程..."
    
    # 1. 同步 main 和 develop 分支
    echo "📥 同步 main 分支..."
    git checkout main
    git pull origin main
    
    echo "📥 同步 develop 分支..."
    git checkout develop
    git pull origin develop
    
    # 2. 建立發布分支
    echo "🌱 建立發布分支: $release_branch"
    git checkout -b "$release_branch"
    
    # 3. 更新版本號 (如果有 package.json)
    if [ -f "package.json" ]; then
        echo "📝 更新 package.json 版本號..."
        npm version "$version" --no-git-tag-version
        git add package.json
        git commit -m "chore(release): 更新版本號到 $version"
    fi
    
    # 4. 推送發布分支
    git push -u origin "$release_branch"
    
    # 5. 建立 PR URL
    local repo_url=$(git remote get-url origin | sed 's/\.git$//')
    local pr_url="$repo_url/compare/main...$release_branch"
    
    echo "✅ 發布分支已建立: $release_branch"
    echo "🔗 請前往建立 Release Pull Request:"
    echo "$pr_url"
    echo ""
    echo "📋 PR 標題建議: [Release] $version"
}
```

#### 完成發布
```bash
# 自動完成版本發布流程
function finish-release-pr() {
    local current_branch=$(git branch --show-current)
    
    if [[ ! $current_branch == release/* ]]; then
        echo "❌ 錯誤: 當前不在發布分支"
        return 1
    fi
    
    local version="${current_branch#release/}"
    
    echo "🔄 完成版本發布流程..."
    
    # 1. 合併到 main
    echo "🔀 合併到 main 分支..."
    git checkout main
    git pull origin main
    git merge "$current_branch"
    
    # 2. 建立版本標籤
    echo "🏷️ 建立版本標籤: $version"
    git tag "$version"
    
    # 3. 推送 main 和標籤
    echo "📤 推送 main 分支和標籤..."
    git push origin main
    git push origin "$version"
    
    # 4. 同步回 develop
    echo "🔄 同步變更回 develop 分支..."
    git checkout develop
    git merge main
    git push origin develop
    
    # 5. 清理發布分支
    echo "🧹 清理發布分支..."
    git branch -d "$current_branch"
    git push origin --delete "$current_branch"
    
    echo "✅ 版本 $version 發布完成！"
    echo "🎉 已同步到所有分支並建立標籤"
}
```

## 🛠️ GitHub CLI 整合 (進階)

如果安裝了 GitHub CLI (`gh`)，可以直接建立 PR：

### 自動建立功能 PR
```bash
# 使用 GitHub CLI 自動建立功能 PR
function auto-create-feature-pr() {
    local current_branch=$(git branch --show-current)
    
    if [[ ! $current_branch == feature/* ]]; then
        echo "❌ 錯誤: 當前不在功能分支"
        return 1
    fi
    
    local feature_name="${current_branch#feature/}"
    local pr_title="[Feature] $feature_name"
    local pr_body="## 📋 變更摘要
自動建立的功能 PR

## 🎯 相關 Issue
Closes #

## 🔧 主要變更
- [ ] 新增 $feature_name 功能
- [ ] 更新相關文件
- [ ] 新增測試

## 🧪 測試情況
- [ ] 單元測試通過
- [ ] 整合測試通過
- [ ] 手動測試完成"
    
    # 確保分支已推送
    git push origin "$current_branch"
    
    # 建立 PR
    gh pr create \
        --title "$pr_title" \
        --body "$pr_body" \
        --base develop \
        --head "$current_branch"
    
    echo "✅ Pull Request 已建立！"
}
```

### 自動建立發布 PR
```bash
# 使用 GitHub CLI 自動建立發布 PR
function auto-create-release-pr() {
    local current_branch=$(git branch --show-current)
    
    if [[ ! $current_branch == release/* ]]; then
        echo "❌ 錯誤: 當前不在發布分支"
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
請在合併前確認所有檢查項目都已完成。"
    
    # 確保分支已推送
    git push origin "$current_branch"
    
    # 建立 PR
    gh pr create \
        --title "$pr_title" \
        --body "$pr_body" \
        --base main \
        --head "$current_branch"
    
    echo "✅ Release Pull Request 已建立！"
}
```

## 📋 自動化腳本安裝

### 1. 將函式加入 shell 設定檔
```bash
# 加入到 ~/.zshrc 或 ~/.bashrc
echo "# BlogImageAI Git 自動化函式" >> ~/.zshrc
echo "source /path/to/blog-image-ai/.github/scripts/git-automation.sh" >> ~/.zshrc
source ~/.zshrc
```

### 2. 建立獨立腳本檔案
```bash
# 建立腳本檔案
mkdir -p .github/scripts
cat > .github/scripts/git-automation.sh << 'EOF'
#!/bin/bash
# BlogImageAI Git 自動化腳本

# 在這裡貼上上面的所有函式...
EOF

chmod +x .github/scripts/git-automation.sh
```

## 🎯 完整工作流程範例

### 功能開發完整流程
```bash
# 1. 建立功能分支
create-feature-pr "圖片編輯功能"

# 2. 開發功能 (正常的開發流程)
git add .
git commit -m "feat(ui): 新增圖片編輯基礎元件"
git commit -m "feat(ui): 實作畫筆工具"
git commit -m "feat(api): 整合 OpenAI 圖片編輯 API"

# 3. 完成功能並建立 PR
finish-feature-pr

# 4. (可選) 使用 GitHub CLI 自動建立 PR
auto-create-feature-pr
```

### 版本發布完整流程
```bash
# 1. 準備發布
create-release-pr "v1.2.0"

# 2. 最終測試和調整 (如有需要)
git add .
git commit -m "fix(release): 修復發布前發現的小問題"

# 3. (可選) 使用 GitHub CLI 建立發布 PR
auto-create-release-pr

# 4. PR 審查通過後，完成發布
finish-release-pr
```

## ⚠️ 注意事項

### 使用前提
- 確保有正確的 Git 遠端設定
- 具有分支推送權限
- 如使用 GitHub CLI，需要先登入 `gh auth login`

### 最佳實踐
- 在建立 PR 前確保所有測試都通過
- PR 描述應該詳細說明變更內容
- 發布前進行充分的測試
- 保持 commit 歷史乾淨

### 緊急處理
如果自動化流程出現問題，可以手動執行對應的 Git 指令進行修復。

---

**維護者**: BlogImageAI 開發團隊  
**建立日期**: 2025年6月27日  
**版本**: 1.0.0
