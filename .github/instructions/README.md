# 📋 Instructions 資料夾索引

這個資料夾包含 BlogImageAI 專案的所有開發指令和工作流程文件。

## 📁 檔案清單

### Git 工作流程
- **[`git-workflow-complete.md`](./git-workflow-complete.md)** - Git 工作流程完整指南
  - 分支架構說明
  - 快速開始指南
  - 日常工作流程
  - 版本發布流程
  - 故障排除

### 提交規範
- **[`commit-guidelines.md`](./commit-guidelines.md)** - Git Commit 訊息規範與指令
  - Commit 訊息格式標準
  - Type 和 Scope 定義
  - 實用 Commit 範例
  - 自動化指令設定
  - 品質檢查清單

### 功能分支流程
- **[`feature-branch-workflow.md`](./feature-branch-workflow.md)** - 功能分支工作流程指令
  - 分支策略說明
  - 功能開發完整流程
  - Pull Request 規範
  - 緊急修復 (Hotfix) 流程
  - 分支清理與維護

## 🎯 使用指南

### 新開發者入門
1. 先閱讀 [`git-workflow-complete.md`](./git-workflow-complete.md) 了解整體工作流程
2. 學習 [`commit-guidelines.md`](./commit-guidelines.md) 中的提交規範
3. 參考 [`feature-branch-workflow.md`](./feature-branch-workflow.md) 進行功能開發

### 日常開發參考
- **開始新功能**: 參考 `feature-branch-workflow.md` 中的「功能開發流程」
- **提交程式碼**: 使用 `commit-guidelines.md` 中的格式規範
- **遇到問題**: 查看 `git-workflow-complete.md` 中的「故障排除」

### 進階操作
- **版本發布**: 參考 `git-workflow-complete.md` 中的「版本發布流程」
- **緊急修復**: 使用 `feature-branch-workflow.md` 中的「Hotfix 流程」
- **分支管理**: 參考 `git-workflow-complete.md` 中的「分支保護規則」

## 🔗 相關資源

### 專案文件
- **主要指令**: `../.github/copilot-instructions.md`
- **變更記錄**: `../.github/change_log/`
- **專案說明**: `../../README.md`

### 開發工具
- **Prompts**: `../.github/prompts/`
- **Docker 設定**: `../../docker-compose.yml`
- **建構腳本**: `../../start-server.sh`

## 📝 檔案維護

### 更新準則
- 所有指令檔案應保持最新狀態
- 新增功能時同步更新相關指令
- 定期檢查並更新範例和最佳實踐

### 版本控制
- 所有指令檔案變更都應該提交到版本控制
- 重大變更應在檔案頂部註記更新日期
- 保持與專案實際工作流程同步

### 協作維護
- 團隊成員發現問題應及時更新文件
- 新的最佳實踐應該加入到相關指令中
- 定期審查和改進工作流程

---

**建立日期**: 2025年6月27日  
**維護者**: BlogImageAI 開發團隊  
**最後更新**: 2025年6月27日
