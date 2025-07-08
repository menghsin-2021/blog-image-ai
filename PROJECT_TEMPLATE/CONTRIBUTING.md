# 貢獻指南

感謝你對 {{PROJECT_NAME}} 的關注！我們歡迎所有形式的貢獻。

## 🤝 如何貢獻

### 報告 Bug
如果你發現了 bug，請：
1. 檢查 [Issues]({{GITHUB_REPO_URL}}/issues) 確認問題尚未被報告
2. 建立新的 Issue，包含：
   - 清楚的標題和描述
   - 重現步驟
   - 預期行為 vs 實際行為
   - 環境資訊 (作業系統、瀏覽器版本等)
   - 相關的錯誤訊息或截圖

### 建議新功能
我們歡迎新功能建議！請：
1. 檢查現有 Issues 確認建議尚未提出
2. 建立 Feature Request Issue，說明：
   - 功能的目的和用途
   - 詳細的功能描述
   - 可能的實作方式
   - 對專案的影響

### 提交程式碼
1. **Fork 專案** 到你的 GitHub 帳號
2. **建立分支** 進行開發
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **提交變更** 遵循 commit 規範
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
4. **推送分支**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **建立 Pull Request**

## 📋 開發指南

### 開發環境設定
```bash
# 複製專案
git clone {{GITHUB_REPO_URL}}.git
cd {{PROJECT_NAME}}

# 安裝相依性
npm install

# 設定環境變數
cp .env.example .env
# 編輯 .env 檔案

# 啟動開發伺服器
npm run dev
```

### 程式碼規範
我們使用以下工具確保程式碼品質：
- **ESLint** - 程式碼檢查
- **Prettier** - 程式碼格式化
- **TypeScript** - 型別檢查

在提交前請執行：
```bash
npm run lint          # 檢查程式碼
npm run format        # 格式化程式碼
npm run type-check    # 型別檢查
npm run test          # 執行測試
```

### Commit 訊息規範
我們遵循 [Conventional Commits](https://www.conventionalcommits.org/) 規範：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type 類型:**
- `feat`: 新功能
- `fix`: 修復 bug
- `docs`: 文件更新
- `style`: 程式碼格式調整
- `refactor`: 重構
- `test`: 測試相關
- `chore`: 其他維護

**範例:**
```
feat(auth): 新增使用者登入功能

實作 JWT Token 驗證機制，支援：
- 使用者名稱/密碼登入
- 記住登入狀態
- 自動登出機制

Closes #123
```

### 分支命名規範
- `feature/功能名稱` - 新功能開發
- `bugfix/問題描述` - Bug 修復
- `hotfix/緊急修復` - 緊急修復
- `docs/文件更新` - 文件更新

### 測試要求
- 新功能必須包含對應的測試
- 修復 bug 必須包含回歸測試
- 測試覆蓋率應保持在 80% 以上
- 所有測試都必須通過

```bash
npm run test           # 執行所有測試
npm run test:watch     # 監視模式
npm run test:coverage  # 測試覆蓋率
```

## 🔍 Pull Request 指南

### PR 檢查清單
- [ ] 程式碼遵循專案風格指南
- [ ] 包含必要的測試
- [ ] 所有測試都通過
- [ ] 文件已更新 (如必要)
- [ ] Commit 訊息符合規範
- [ ] 沒有合併衝突

### PR 描述模板
```markdown
## 變更類型
- [ ] Bug 修復
- [ ] 新功能
- [ ] 文件更新
- [ ] 重構
- [ ] 其他

## 變更描述
簡要描述這個 PR 的變更內容...

## 測試
- [ ] 包含新的測試
- [ ] 現有測試通過
- [ ] 手動測試完成

## 截圖 (如適用)
如有 UI 變更，請提供前後對比截圖

## 相關 Issue
Closes #123
```

### 程式碼審查
- 每個 PR 需要至少一位 maintainer 的審查
- 審查者會檢查：
  - 程式碼品質和風格
  - 測試完整性
  - 文件完整性
  - 效能影響
- 請耐心等待審查，並及時回應意見

## 🏷️ Issue 標籤說明

- `bug` - 錯誤報告
- `enhancement` - 功能增強
- `documentation` - 文件相關
- `good first issue` - 適合新手的 issue
- `help wanted` - 需要社群協助
- `priority: high` - 高優先級
- `priority: low` - 低優先級
- `status: in progress` - 正在處理中
- `status: needs review` - 需要審查

## 🎯 開發優先級

### 高優先級
- 安全性漏洞修復
- 重大 bug 修復
- 效能問題解決

### 中優先級
- 新功能開發
- API 改進
- 使用者體驗改善

### 低優先級
- 程式碼重構
- 文件改進
- 開發工具改善

## 📚 資源連結

- [專案文件]({{GITHUB_REPO_URL}}/wiki)
- [API 文件]({{API_DOCS_URL}})
- [設計指南]({{DESIGN_GUIDE_URL}})
- [聊天室]({{CHAT_ROOM_URL}})

## 🆘 需要幫助？

如果你有任何問題，可以：
- 在 [Discussions]({{GITHUB_REPO_URL}}/discussions) 中提問
- 加入我們的 [Discord 伺服器]({{DISCORD_URL}})
- 發送郵件到 {{CONTACT_EMAIL}}

## 🙏 致謝

感謝所有貢獻者的努力！你們的貢獻讓這個專案變得更好。

### 貢獻者列表
<!-- 這裡會自動生成貢獻者列表 -->

---

再次感謝你的貢獻！ 🎉
