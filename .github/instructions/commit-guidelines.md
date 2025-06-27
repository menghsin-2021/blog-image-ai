# Git Commit 訊息規範與指令

## 📋 Commit 訊息格式

### 基本格式
```
<type>(<scope>): <subject>

<body>

<footer>
```
- 一律使用繁體中文 zh.TW

### Type 類型
- **feat**: 新功能 (feature)
- **fix**: 修復 bug
- **docs**: 文件更新
- **style**: 程式碼格式調整 (不影響程式碼運行的變動)
- **refactor**: 重構 (既不是新增功能，也不是修復 bug 的程式碼變動)
- **perf**: 效能改善
- **test**: 新增測試或修正現有測試
- **build**: 影響建構系統或外部相依性的更動 (例如: gulp, npm)
- **ci**: 對 CI 設定檔和腳本的更動 (例如: Travis, Circle, Actions)
- **chore**: 其他不修改 src 或測試檔案的更動
- **revert**: 撤銷之前的 commit

### Scope 範圍 (可選)
- **ui**: 使用者介面
- **api**: API 相關
- **auth**: 驗證相關
- **config**: 設定檔
- **deps**: 相依性
- **docker**: Docker 相關
- **docs**: 文件
- **test**: 測試

### Subject 主旨
- 使用祈使句，現在式：「change」而不是「changed」或「changes」
- 不要大寫第一個字母
- 結尾不要句點

### Body 內容 (可選)
- 使用祈使句，現在式
- 包含修改的動機，與先前行為的對比

### Footer 腳註 (可選)
- **Breaking Changes**: 如果有重大變更，以 `BREAKING CHANGE:` 開始
- **Issues**: 關閉的 issue，例如 `Closes #123, #245, #992`

## 🎯 實用 Commit 範例

### 新功能
```bash
feat(ui): 新增圖片編輯功能

新增基於畫布的遮罩編輯工具，支援 DALL·E 2 模型
- 實作畫筆工具選擇遮罩區域
- 新增編輯描述輸入框
- 整合 OpenAI 圖片編輯 API

Closes #15
```

### Bug 修復
```bash
fix(api): 修復 GPT-Image-1 參數錯誤

移除不支援的 style 參數，修正 API 請求格式
- 更新 buildGenerationRequest 方法
- 修正品質參數映射
- 新增模型參數驗證

Fixes #23
```

### 文件更新
```bash
docs: 更新 API 使用說明

新增 GPT-Image-1 參數說明和使用範例
- 更新支援的參數列表
- 新增錯誤處理說明
- 補充最佳實踐建議
```

### 重構
```bash
refactor(components): 重構模型設定元件

將複雜的模型設定邏輯拆分為更小的子元件
- 分離品質選擇器
- 分離風格選擇器  
- 提高程式碼可讀性和維護性
```

### 效能改善
```bash
perf(ui): 優化圖片載入效能

實作圖片懶載入和快取機制
- 新增 IntersectionObserver 懶載入
- 實作本地快取策略
- 減少不必要的 API 請求

Performance improvement: 減少初始載入時間 40%
```

### 建構相關
```bash
build(docker): 優化 Docker 建構流程

改進多階段建構設定，減少映像檔大小
- 使用 alpine 基礎映像檔
- 優化相依性安裝順序
- 新增 .dockerignore 排除不必要檔案

Size reduction: 映像檔大小從 800MB 減少到 300MB
```

## 🚀 Copilot 自動生成 Commit 指令

### 功能開發
```bash
# 基於程式碼變更自動生成 commit 訊息
git add .
git commit -m "$(generate_commit_message)"
```

### 快速 Commit 模板
```bash
# 功能開發
feat: [描述新功能]

# Bug 修復  
fix: [描述修復的問題]

# 文件更新
docs: [描述文件變更]

# 重構
refactor: [描述重構內容]
```

## 📝 Commit 前檢查清單

### 程式碼品質
- [ ] 程式碼已通過 ESLint 檢查
- [ ] 已執行相關測試
- [ ] 程式碼格式正確
- [ ] 移除除錯用程式碼

### 功能完整性
- [ ] 功能運作正常
- [ ] 已測試邊界情況
- [ ] 錯誤處理完善
- [ ] 使用者體驗良好

### 文件更新
- [ ] 更新相關文件
- [ ] 更新 API 說明 (如適用)
- [ ] 更新 README (如適用)
- [ ] 新增使用範例 (如適用)

### Git 相關
- [ ] 只提交相關的更改
- [ ] 避免提交機密資訊
- [ ] Commit 訊息清楚明確
- [ ] 適當使用 .gitignore

## 🔧 Git 別名設定

新增到 `~/.gitconfig` 或使用 `git config --global`:

```bash
# 快速 commit
git config --global alias.ac 'add . && commit'

# 美化 log
git config --global alias.lg "log --oneline --decorate --graph --all"

# 查看狀態
git config --global alias.st 'status'

# 快速推送
git config --global alias.pushf 'push --force-with-lease'

# 互動式 rebase
git config --global alias.ri 'rebase -i'
```

## 📊 Commit 統計

```bash
# 查看提交統計
git shortlog -sn

# 查看特定作者的提交
git log --author="作者名稱" --oneline

# 查看特定檔案的修改歷史
git log --follow --oneline -- 檔案名稱

# 查看最近 10 次提交
git log --oneline -10
```

---

**維護者**: BlogImageAI 開發團隊  
**更新日期**: 2025年6月27日  
**版本**: 1.0.0
