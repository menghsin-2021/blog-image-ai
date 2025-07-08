# Commit 訊息規範

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 規範，確保提交訊息的一致性和可讀性。

## 📝 基本格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 範例
```
feat(auth): 新增使用者登入功能

實作 JWT Token 驗證機制，支援以下功能：
- 使用者名稱/密碼登入
- 記住登入狀態
- 自動登出機制

Closes #123
```

## 🏷️ Type 類型

### 主要類型
- **`feat`** - 新功能 (feature)
- **`fix`** - 修復 bug
- **`docs`** - 文件變更
- **`style`** - 程式碼格式調整 (不影響程式碼運行的變更)
- **`refactor`** - 重構 (既不修復 bug 也不新增功能的程式碼變更)
- **`perf`** - 效能改善
- **`test`** - 新增或修改測試
- **`build`** - 影響建構系統或外部相依性的變更
- **`ci`** - CI 設定檔案和腳本的變更
- **`chore`** - 其他不修改 src 或 test 檔案的變更
- **`revert`** - 撤銷之前的提交

### 特殊類型
- **`hotfix`** - 緊急修復
- **`security`** - 安全性相關修復
- **`deps`** - 相依性更新

## 🎯 Scope 範圍

描述變更影響的範圍，例如：
- **`auth`** - 認證相關
- **`api`** - API 相關
- **`ui`** - 使用者介面
- **`db`** - 資料庫相關
- **`config`** - 設定檔案
- **`utils`** - 工具函式
- **`components`** - 元件相關
- **`services`** - 服務層相關

## ✍️ Subject 主題

- 使用祈使句，現在式：「change」而非「changed」或「changes」
- 不要大寫首字母
- 結尾不要加句號
- 限制在 50 個字元以內
- 清楚描述變更內容

### 好的範例
```
feat(auth): 新增 OAuth2 登入支援
fix(api): 修復使用者查詢 API 的分頁問題
docs(readme): 更新安裝指南
style(lint): 修復 ESLint 警告
refactor(utils): 簡化日期格式化函式
```

### 不好的範例
```
feat: 新增一些功能
fix: 修復 bug
update: 更新檔案
changed: 改變了一些東西
```

## 📖 Body 內文

- 解釋變更的原因，而不是如何變更
- 使用祈使句，現在式
- 每行限制在 72 個字元以內
- 可以包含多個段落

### 範例
```
feat(payment): 整合第三方支付系統

為了支援多種支付方式，整合了以下支付閘道：
- 信用卡支付 (Stripe)
- PayPal 支付
- Apple Pay 支援

這個變更改善了使用者的支付體驗，並提供更多支付選擇。
```

## 🔗 Footer 頁腳

用於記錄重大變更 (BREAKING CHANGES) 或關閉 issue。

### 關閉 Issue
```
Closes #123
Closes #123, #456
Fixes #123
Resolves #123
```

### 重大變更
```
BREAKING CHANGE: API 端點 `/api/v1/users` 已重新命名為 `/api/v2/users`

所有客戶端都需要更新 API 呼叫路徑。
```

## 🎨 完整範例

### 簡單提交
```
feat(auth): 新增使用者註冊功能
```

### 詳細提交
```
feat(payment): 整合 Stripe 支付系統

新增 Stripe 支付處理功能，包括：
- 信用卡資訊驗證
- 支付處理流程
- 錯誤處理機制
- 支付成功/失敗回調

這個功能允許使用者使用信用卡進行線上支付，
提升了購物車的轉換率。

Closes #245
```

### 重大變更提交
```
feat(api): 升級到 API v2

將所有 API 端點從 v1 升級到 v2，提供更好的效能和功能。

BREAKING CHANGE: API 端點結構已變更

v1 端點：
- GET /api/v1/users
- POST /api/v1/users

v2 端點：
- GET /api/v2/users
- POST /api/v2/users

所有客戶端都需要更新 API 呼叫路徑。

Closes #189
```

## 🔧 工具整合

### Git Hooks
在 `.git/hooks/commit-msg` 中加入訊息驗證：

```bash
#!/bin/sh
# 驗證 commit 訊息格式
commit_regex='^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?: .{1,50}'

if ! grep -qE "$commit_regex" "$1"; then
    echo "Invalid commit message format!"
    echo "Format: <type>(<scope>): <subject>"
    exit 1
fi
```

### VS Code 擴充功能
推薦安裝：
- **Conventional Commits** - 提供 commit 訊息模板
- **GitLens** - 增強 Git 功能
- **Git Graph** - 視覺化 Git 歷史

## 📋 檢查清單

提交前檢查：
- [ ] Type 類型正確
- [ ] Scope 範圍明確
- [ ] Subject 使用祈使句
- [ ] Subject 長度 < 50 字元
- [ ] Body 解釋變更原因
- [ ] Footer 包含相關 issue 編號
- [ ] 重大變更標記 BREAKING CHANGE

遵循這些規範可以讓專案歷史更清晰，便於追蹤變更和自動生成變更日誌。
