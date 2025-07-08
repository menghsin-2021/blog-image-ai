# Change Log 資料夾說明

此資料夾用於存放專案開發過程中的各種變更記錄、修復報告、部署摘要等文件。

## 檔案命名規則

### 修復報告
- 格式：`{FEATURE}-FIX-REPORT.md`
- 範例：`GPT-IMAGE-1-FIX-REPORT.md`
- 用途：記錄特定功能的錯誤修復過程和解決方案

### 更新記錄
- 格式：`{FEATURE}-UPDATE.md`
- 範例：`GPT-IMAGE-1-UPDATE.md`
- 用途：記錄功能更新和改進的詳細內容

### 部署摘要
- 格式：`DEPLOYMENT-SUMMARY.md`
- 用途：記錄部署過程和結果摘要

### 設定報告
- 格式：`{COMPONENT}-{ACTION}-report.md`
- 範例：`setup-complete-report.md`
- 用途：記錄系統設定和配置的完成狀態

### 環境修復
- 格式：`{ENVIRONMENT}-environment-fix.md`
- 範例：`conda-environment-fix.md`
- 用途：記錄開發環境問題的修復過程

### 實作記錄
- 格式：`{FEATURE}-IMPLEMENTATION-{YYYY-MM-DD}.md`
- 範例：`NEW-FEATURE-IMPLEMENTATION-2024-01-15.md`
- 用途：記錄新功能的實作過程和技術細節

### Bug 修復
- 格式：`BUG-FIX-{COMPONENT}-{YYYY-MM-DD}.md`
- 範例：`BUG-FIX-API-2024-01-15.md`
- 用途：記錄 Bug 的發現、分析和修復過程

### 版本發布
- 格式：`DEPLOYMENT-{VERSION}-{YYYY-MM-DD}.md`
- 範例：`DEPLOYMENT-v1.2.0-2024-01-15.md`
- 用途：記錄版本發布的詳細資訊

## 檔案內容範本

### 修復報告範本
```markdown
# {功能名稱} 修復報告

## 問題描述
- 問題現象：
- 影響範圍：
- 發生時間：

## 原因分析
- 根本原因：
- 技術細節：

## 修復方案
- 解決方案：
- 修改檔案：
- 測試驗證：

## 預防措施
- 避免重複：
- 改進建議：

## 建立時間
- 日期：{YYYY-MM-DD}
- 負責人：{DEVELOPER_NAME}
```

### 部署摘要範本
```markdown
# 部署摘要報告

## 部署資訊
- 版本：v{VERSION}
- 環境：{ENVIRONMENT}
- 時間：{DEPLOYMENT_TIME}

## 部署內容
- 新功能：
- 修復項目：
- 配置變更：

## 部署結果
- 狀態：成功/失敗
- 測試結果：
- 效能影響：

## 後續行動
- 監控重點：
- 回滾方案：

## 建立時間
- 日期：{YYYY-MM-DD}
- 負責人：{DEVELOPER_NAME}
```

## 使用指南

1. **建立新記錄**：按照命名規則建立對應的 markdown 檔案
2. **內容撰寫**：使用相應的範本格式
3. **及時更新**：在完成任務時立即建立記錄
4. **詳細記錄**：包含足夠的技術細節供未來參考

## 自動化建議

- 可在 Git hooks 中加入自動建立記錄的邏輯
- 在 CI/CD 過程中自動產生部署摘要
- 使用腳本工具自動化文件格式檢查

## 注意事項

- 所有敏感資訊（如 API Key）不應出現在記錄中
- 保持檔案命名的一致性
- 定期整理和歸檔舊記錄
- 確保記錄內容的準確性和完整性
