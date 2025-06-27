# BlogImageAI Git 工作流程完整指南

## 🎯 概覽

本指南建立了 BlogImageAI 專案的完整 Git 工作流程，包含分支管理、提交規範、和部署策略。

## 📁 相關文件

- **提交規範**: `.github/instructions/commit-guidelines.md`
- **功能分支流程**: `.github/instructions/feature-branch-workflow.md`
- **變更記錄**: `.github/change_log/`
- **專案指令**: `.github/copilot-instructions.md`

## 🌳 分支架構

```
main (生產環境)
├── develop (開發主分支)
│   ├── feature/新功能名稱
│   ├── bugfix/問題修復
│   └── hotfix/緊急修復
```

## 🚀 快速開始

### 1. 初始設定
```bash
# 複製專案
git clone https://github.com/your-username/blog-image-ai.git
cd blog-image-ai

# 切換到 develop 分支
git checkout develop
git pull origin develop
```

### 2. 新功能開發
```bash
# 建立功能分支
git checkout -b feature/圖片編輯功能

# 開發並提交
git add .
git commit -m "feat(ui): 新增圖片編輯功能基礎架構"

# 推送到遠端
git push -u origin feature/圖片編輯功能
```

### 3. 完成功能開發
```bash
# 同步 develop
git checkout develop
git pull origin develop
git checkout feature/圖片編輯功能
git merge develop

# 最終提交
git add .
git commit -m "feat(ui): 完成圖片編輯功能

新增完整的畫布編輯工具組
- 畫筆工具與橡皮擦
- 遮罩區域預覽  
- 編輯描述輸入
- OpenAI API 整合

Closes #15"

# 推送並建立 Pull Request
git push origin feature/圖片編輯功能
```

## 📋 日常工作流程

### 每日開發流程
1. **開始工作**: 同步 develop 分支
2. **功能開發**: 在功能分支上小步快跑
3. **定期同步**: 保持與 develop 分支同步
4. **完成功能**: 建立 Pull Request
5. **程式碼審查**: 回應審查意見
6. **合併分支**: 合併到 develop
7. **清理分支**: 刪除已完成的功能分支

### 程式碼提交檢查清單
- [ ] 程式碼通過 ESLint 檢查
- [ ] 已執行相關測試
- [ ] 提交訊息符合規範
- [ ] 功能完整且穩定
- [ ] 已更新相關文件

## 🔥 緊急修復流程

### Hotfix 處理步驟
```bash
# 1. 從 main 建立 hotfix 分支
git checkout main
git pull origin main
git checkout -b hotfix/修復關鍵錯誤

# 2. 修復問題
git add .
git commit -m "fix(critical): 修復生產環境關鍵錯誤"

# 3. 合併到 main 和 develop
git checkout main
git merge hotfix/修復關鍵錯誤
git push origin main

git checkout develop  
git merge main
git push origin develop

# 4. 清理分支
git branch -d hotfix/修復關鍵錯誤
git push origin --delete hotfix/修復關鍵錯誤
```

## 🏷️ 版本發布流程

### 準備發布
```bash
# 1. 建立發布分支
git checkout develop
git pull origin develop
git checkout -b release/v1.2.0

# 2. 更新版本號
npm version 1.2.0

# 3. 最終測試與修正
git add .
git commit -m "chore(release): 準備 v1.2.0 發布"

# 4. 合併到 main
git checkout main
git merge release/v1.2.0
git tag v1.2.0
git push origin main --tags

# 5. 同步回 develop
git checkout develop
git merge main
git push origin develop

# 6. 清理發布分支
git branch -d release/v1.2.0
```

## 🛠️ 實用 Git 指令

### 查看狀態
```bash
# 查看目前狀態
git status

# 查看分支
git branch -a

# 查看提交歷史
git log --oneline --graph --all
```

### 分支操作
```bash
# 切換分支
git checkout develop

# 建立新分支
git checkout -b feature/新功能

# 刪除本地分支
git branch -d feature/已完成功能

# 刪除遠端分支
git push origin --delete feature/已完成功能
```

### 同步操作
```bash
# 拉取最新變更
git pull origin develop

# 推送到遠端
git push origin feature/新功能

# 設定上游分支
git push -u origin feature/新功能
```

## 🎭 角色與權限

### 開發者
- 可以建立功能分支
- 可以提交到功能分支
- 可以建立 Pull Request
- 需要 code review 才能合併

### 維護者
- 可以合併 Pull Request
- 可以直接推送到 develop
- 可以建立發布分支
- 負責版本發布

### 管理員
- 可以推送到 main 分支
- 可以管理分支保護規則
- 可以處理緊急修復
- 負責專案設定

## 📊 分支保護規則

### main 分支
- 禁止直接推送
- 需要 Pull Request
- 需要 code review 批准
- 需要通過 CI 檢查
- 需要是最新版本

### develop 分支
- 允許維護者直接推送
- 建議使用 Pull Request
- 需要通過 CI 檢查

## 🔍 故障排除

### 常見問題

#### 分支衝突
```bash
# 查看衝突檔案
git status

# 手動解決衝突後
git add .
git commit -m "resolve: 解決合併衝突"
```

#### 撤銷提交
```bash
# 撤銷最後一次提交 (保留變更)
git reset --soft HEAD~1

# 撤銷最後一次提交 (刪除變更)
git reset --hard HEAD~1

# 撤銷已推送的提交
git revert <commit-hash>
```

#### 清理工作目錄
```bash
# 丟棄所有未提交的變更
git checkout -- .

# 清理未追蹤的檔案
git clean -fd
```

## 📈 最佳實踐總結

### 提交品質
- 小而頻繁的提交
- 清楚的提交訊息
- 每個提交都應該是可工作的狀態

### 分支管理
- 功能分支保持簡潔
- 定期同步主分支
- 及時清理已合併的分支

### 協作流程
- 積極的 code review
- 詳細的 Pull Request 描述
- 及時回應團隊成員意見

### 品質保證
- 每次提交前執行測試
- 使用 CI/CD 自動化檢查
- 保持程式碼風格一致性

---

## 📞 聯絡方式

如有任何關於 Git 工作流程的問題，請參考：
- **Commit 規範**: `.github/instructions/commit-guidelines.md`
- **功能分支流程**: `.github/instructions/feature-branch-workflow.md`
- **專案文件**: `.github/copilot-instructions.md`

**維護者**: BlogImageAI 開發團隊  
**更新日期**: 2025年6月27日  
**版本**: 1.0.0
