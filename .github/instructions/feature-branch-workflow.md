# 功能分支工作流程指令

## 🌳 Git 分支策略

### 分支架構
```
main (生產環境)
├── develop (開發主分支)
│   ├── feature/新功能名稱 (功能開發)
│   ├── bugfix/問題修復 (Bug 修復)
│   └── hotfix/緊急修復 (緊急修復)
```

### 分支說明
- **main**: 穩定的生產版本，只接受來自 develop 的 merge
- **develop**: 開發主分支，包含最新的開發功能
- **feature/***: 新功能開發分支
- **bugfix/***: Bug 修復分支
- **hotfix/***: 緊急修復分支，直接從 main 建立

## 🚀 功能開發流程

### 1. 建立新功能分支
```bash
# 確保在最新的 develop 分支
git checkout develop
git pull origin develop

# 建立新功能分支
git checkout -b feature/圖片編輯功能
```

### 2. 開發過程中
```bash
# 定期提交變更
git add .
git commit -m "feat(ui): 新增畫筆工具選擇器"

# 推送到遠端分支
git push -u origin feature/圖片編輯功能
```

### 3. 保持與 develop 同步
```bash
# 定期同步 develop 分支的最新變更
git checkout develop
git pull origin develop
git checkout feature/圖片編輯功能
git merge develop

# 或使用 rebase (保持歷史乾淨)
git rebase develop
```

### 4. 功能完成後
```bash
# 最終測試與整理
git add .
git commit -m "feat(ui): 完成圖片編輯功能實作

新增完整的畫布編輯工具組
- 畫筆工具與橡皮擦
- 遮罩區域預覽
- 編輯描述輸入
- OpenAI API 整合

Closes #15"

# 推送最終版本
git push origin feature/圖片編輯功能
```

## 🔄 Pull Request 流程

### 建立 Pull Request 前檢查
- [ ] 功能完全實作並測試
- [ ] 程式碼通過 ESLint 檢查
- [ ] 已更新相關文件
- [ ] 與 develop 分支同步
- [ ] 提交訊息符合規範

### Pull Request 標題格式
```
[Type] 功能簡短描述

例如：
[Feature] 新增圖片編輯功能
[Bugfix] 修復 GPT-Image-1 參數錯誤
[Docs] 更新 API 使用說明
```

### Pull Request 描述模板
```markdown
## 📋 變更摘要
簡述此次變更的內容和目的

## 🎯 相關 Issue
Closes #15

## 🔧 主要變更
- [ ] 新增畫筆工具選擇器
- [ ] 實作遮罩編輯功能
- [ ] 整合 OpenAI 圖片編輯 API
- [ ] 新增錯誤處理機制

## 🧪 測試情況
- [ ] 單元測試通過
- [ ] 整合測試通過
- [ ] 手動測試完成
- [ ] 瀏覽器相容性測試

## 📸 Screenshots (如適用)
新增功能或 UI 變更的螢幕截圖

## 📝 注意事項
列出需要特別注意的事項或破壞性變更
```

## 🔥 緊急修復流程 (Hotfix)

### 建立 Hotfix 分支
```bash
# 從 main 分支建立 hotfix
git checkout main
git pull origin main
git checkout -b hotfix/修復關鍵錯誤
```

### 修復與合併
```bash
# 修復問題
git add .
git commit -m "fix(critical): 修復生產環境關鍵錯誤

修復導致 API 請求失敗的關鍵問題
- 修正環境變數讀取錯誤
- 新增 API 金鑰驗證
- 改善錯誤處理機制

CRITICAL: 影響所有使用者的 API 功能"

# 合併回 main
git checkout main
git merge hotfix/修復關鍵錯誤
git push origin main

# 同步到 develop
git checkout develop
git merge main
git push origin develop

# 刪除 hotfix 分支
git branch -d hotfix/修復關鍵錯誤
git push origin --delete hotfix/修復關鍵錯誤
```

## 🧹 分支清理

### 本地分支清理
```bash
# 列出已合併的分支
git branch --merged develop

# 刪除已合併的功能分支
git branch -d feature/已完成功能

# 強制刪除分支 (謹慎使用)
git branch -D feature/廢棄功能
```

### 遠端分支清理
```bash
# 列出遠端分支
git branch -r

# 清理已刪除的遠端分支參照
git remote prune origin

# 刪除遠端分支
git push origin --delete feature/已完成功能
```

## 📋 Copilot 自動化指令

### 快速建立功能分支
```bash
# 自動從 develop 建立新功能分支
function new-feature() {
    if [ -z "$1" ]; then
        echo "用法: new-feature <功能名稱>"
        return 1
    fi
    
    git checkout develop
    git pull origin develop
    git checkout -b "feature/$1"
    echo "已建立功能分支: feature/$1"
}

# 使用方式
new-feature 圖片編輯功能
```

### 快速同步 develop
```bash
# 自動同步 develop 分支到當前功能分支
function sync-develop() {
    current_branch=$(git branch --show-current)
    
    if [[ $current_branch == feature/* ]] || [[ $current_branch == bugfix/* ]]; then
        git checkout develop
        git pull origin develop
        git checkout $current_branch
        git merge develop
        echo "已同步 develop 到 $current_branch"
    else
        echo "當前不在功能分支，請切換到功能分支後執行"
    fi
}
```

### 完成功能開發
```bash
# 自動整理並推送功能分支
function finish-feature() {
    current_branch=$(git branch --show-current)
    
    if [[ $current_branch == feature/* ]]; then
        # 同步 develop
        git checkout develop
        git pull origin develop
        git checkout $current_branch
        git merge develop
        
        # 推送最終版本
        git push origin $current_branch
        
        echo "功能開發完成，請建立 Pull Request:"
        echo "https://github.com/your-repo/compare/develop...$current_branch"
    else
        echo "當前不在功能分支"
    fi
}
```

## 🎯 最佳實踐

### Commit 頻率
- 小步快跑：每個小功能或修復立即提交
- 清楚的提交訊息：每個 commit 都應該有明確的目的
- 避免大型 commit：將複雜功能拆分為多個 commit

### 分支管理
- 功能分支保持簡潔：一個分支只做一件事
- 定期同步：避免分支分歧過大
- 及時清理：合併後刪除不需要的分支

### Code Review
- 自我檢查：在建立 PR 前自行檢查程式碼
- 詳細描述：提供足夠的上下文信息
- 積極回應：及時回應 reviewer 的意見

### 部署策略
- develop → staging 環境測試
- main → production 環境部署
- 使用 tag 標記版本發布

---

**維護者**: BlogImageAI 開發團隊  
**更新日期**: 2025年6月27日  
**版本**: 1.0.0
