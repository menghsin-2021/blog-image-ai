# Scripts 目錄

此目錄包含開發和測試過程中使用的各種腳本檔案。

## 📁 檔案分類

### 🔍 除錯腳本
- `debug-cache-errors.sh` - 快取系統實際錯誤偵測腳本
- `debug-runtime-errors.sh` - 詳細的運行時錯誤偵測與修復驗證腳本

### 🧪 測試腳本  
- `test-setup.sh` - BlogImageAI 功能測試腳本，快速驗證應用程式基本功能
- `test-cache-fix.sh` - 修復後的快取系統測試腳本，驗證 GPT-4o API 回應結構錯誤修復
- `test-cache-final.sh` - 快取系統修復後的最終驗證測試
- `test-cache-performance.sh` - 容器化快取系統效能測試腳本

## 🚀 使用方式

### 執行功能測試
```bash
./scripts/test-setup.sh
```

### 執行快取系統測試
```bash
# 基本修復驗證
./scripts/test-cache-fix.sh

# 效能測試
./scripts/test-cache-performance.sh

# 最終驗證
./scripts/test-cache-final.sh
```

### 執行除錯腳本
```bash
# 快取錯誤偵測
./scripts/debug-cache-errors.sh

# 運行時錯誤偵測
./scripts/debug-runtime-errors.sh
```

## 📋 注意事項

1. **權限設定**: 所有腳本都已設定為可執行
2. **Docker 需求**: 部分腳本需要 Docker 容器運行
3. **環境設定**: 確保 `.env` 檔案已正確配置
4. **開發用途**: 這些腳本主要用於開發和除錯，不建議在生產環境使用

## 🔧 維護指南

- 定期檢查腳本是否與最新的應用程式版本相容
- 更新腳本時記得修改相關文件
- 測試腳本的輸出應該清楚且有意義
- 保持腳本的簡潔性和可讀性

---

**注意**: 這些腳本記錄了專案開發過程中的測試和除錯歷程，對於了解專案的發展歷史和問題解決過程很有價值。
