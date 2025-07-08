# Git 工作流程完整指南

## 🌿 分支策略

### 主要分支
- **`main`** - 生產環境，只包含穩定且經過測試的程式碼
- **`develop`** - 開發主分支，整合最新功能的分支

### 支援分支
- **`feature/*`** - 功能開發分支
- **`release/*`** - 發布準備分支
- **`hotfix/*`** - 緊急修復分支
- **`bugfix/*`** - 一般錯誤修復分支

## 🔄 開發工作流程

### 1. 功能開發流程

#### 開始新功能
```bash
# 1. 確保在 develop 分支並拉取最新程式碼
git checkout develop
git pull origin develop

# 2. 建立功能分支
git checkout -b feature/功能名稱

# 3. 開始開發...
```

#### 開發過程中
```bash
# 定期提交變更
git add .
git commit -m "feat(scope): 描述具體變更"

# 定期同步 develop 分支的更新
git checkout develop
git pull origin develop
git checkout feature/功能名稱
git rebase develop
```

#### 完成功能開發
```bash
# 1. 最後一次同步並解決衝突
git checkout develop
git pull origin develop
git checkout feature/功能名稱
git rebase develop

# 2. 推送功能分支
git push origin feature/功能名稱

# 3. 建立 Pull Request
# 使用 GitHub/GitLab 介面或 CLI 工具

# 4. 程式碼審查通過後合併
# 5. 刪除功能分支
git branch -d feature/功能名稱
git push origin --delete feature/功能名稱
```

### 2. 發布流程

#### 準備發布
```bash
# 1. 從 develop 建立發布分支
git checkout develop
git pull origin develop
git checkout -b release/v1.2.0

# 2. 更新版本號和發布說明
# 修改 package.json, CHANGELOG.md 等檔案

# 3. 最後測試和修復
git add .
git commit -m "chore(release): 準備 v1.2.0 發布"
```

#### 完成發布
```bash
# 1. 合併到 main
git checkout main
git pull origin main
git merge --no-ff release/v1.2.0
git tag -a v1.2.0 -m "Release v1.2.0"

# 2. 合併回 develop
git checkout develop
git merge --no-ff release/v1.2.0

# 3. 推送所有變更
git push origin main
git push origin develop
git push origin v1.2.0

# 4. 刪除發布分支
git branch -d release/v1.2.0
git push origin --delete release/v1.2.0
```

### 3. 緊急修復流程

```bash
# 1. 從 main 建立熱修復分支
git checkout main
git pull origin main
git checkout -b hotfix/修復描述

# 2. 進行修復
git add .
git commit -m "fix: 修復緊急問題描述"

# 3. 合併到 main
git checkout main
git merge --no-ff hotfix/修復描述
git tag -a v1.2.1 -m "Hotfix v1.2.1"

# 4. 合併到 develop
git checkout develop
git merge --no-ff hotfix/修復描述

# 5. 推送變更
git push origin main
git push origin develop
git push origin v1.2.1

# 6. 清理
git branch -d hotfix/修復描述
git push origin --delete hotfix/修復描述
```

## 📋 最佳實踐

### 分支命名規範
- `feature/user-authentication` - 功能分支
- `bugfix/fix-login-error` - 錯誤修復分支
- `hotfix/security-patch` - 緊急修復分支
- `release/v1.2.0` - 發布分支

### 提交頻率
- 小而頻繁的提交
- 每個提交都應該是可編譯的
- 提交訊息要清楚描述變更內容

### 程式碼審查
- 所有 Pull Request 都需要至少一人審查
- 審查者檢查程式碼品質、測試覆蓋率、文件
- 使用 Draft PR 進行早期回饋

### 衝突處理
- 使用 `git rebase` 而非 `git merge` 來同步分支
- 解決衝突後進行完整測試
- 避免在公共分支上使用 `git rebase`

## 🚨 注意事項

### 禁止操作
- **永遠不要**直接推送到 `main` 分支
- **永遠不要**在 `main` 分支上進行開發
- **永遠不要**使用 `git push --force` 到公共分支
- **永遠不要**在已推送的提交上使用 `git rebase`

### 緊急情況處理
如果發生錯誤推送：
1. 立即通知團隊成員
2. 評估影響範圍
3. 建立熱修復分支進行修復
4. 記錄事件並改進流程

## 🔧 有用的 Git 指令

```bash
# 檢查分支狀態
git status
git branch -a

# 檢視提交歷史
git log --oneline --graph --decorate

# 檢視檔案變更
git diff
git diff --staged

# 暫存變更
git stash
git stash pop

# 重置變更
git reset --soft HEAD~1  # 保留檔案變更
git reset --hard HEAD~1  # 完全重置

# 檢查遠端分支
git remote -v
git fetch --prune
```

這個工作流程確保程式碼品質，促進團隊協作，並維持專案的穩定性。
