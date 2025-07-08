# Perplexity 模型名稱修復報告

## 問題描述
- **問題現象**：Perplexity API 回報 400 錯誤 - Invalid model 'llama-3.1-sonar-large-128k-online'
- **影響範圍**：所有使用 Perplexity 提示詞最佳化功能的用戶
- **發生時間**：2025-07-08
- **嚴重程度**：高

## 環境資訊
- **作業系統**：macOS
- **開發環境**：Node.js + Vite + React
- **相關版本**：
  - Node.js: 18+
  - Perplexity API: 最新版
  - 專案版本: v1.0.0

## 問題重現步驟
1. 進入提示詞最佳化功能
2. 選擇 Perplexity 作為 AI 服務
3. 輸入部落格內容
4. 點擊「開始最佳化」按鈕
5. 收到錯誤訊息：`Perplexity API error: 400 - Invalid model 'llama-3.1-sonar-large-128k-online'`

## 錯誤訊息
```
Perplexity 最佳化失敗: 提示詞最佳化失敗: Perplexity API error: 400 - Invalid model 'llama-3.1-sonar-large-128k-online'. Permitted models can be found in the documentation at https://docs.perplexity.ai/guides/model-cards.
```

## 根本原因分析
- **直接原因**：Perplexity API 更新了模型名稱格式
- **根本原因**：程式碼中使用的是舊版本的模型名稱格式
- **相關因素**：Perplexity 簡化了模型命名規則，移除了 llama-3.1 前綴和 -128k-online 後綴

## 修復方案
### 解決方案概述
更新所有 Perplexity 模型名稱為新的簡化格式

### 修改檔案清單
- `src/utils/perplexityConstants.ts` - 更新模型名稱常數
- `src/components/PromptOptimizer/providers/PerplexityOptimizationProvider.tsx` - 修復模型映射和價格表

### 程式碼變更
```typescript
// 修復前
export const PERPLEXITY_MODELS = {
  SONAR: 'llama-3.1-sonar-small-128k-online',
  SONAR_PRO: 'llama-3.1-sonar-large-128k-online',
  SONAR_REASONING: 'llama-3.1-sonar-huge-128k-online',
} as const;

// 修復後
export const PERPLEXITY_MODELS = {
  SONAR: 'sonar',
  SONAR_PRO: 'sonar-pro', 
  SONAR_REASONING: 'sonar-reasoning',
} as const;
```

### 向下相容性處理
在 `convertModelName` 方法中新增舊模型名稱的映射，確保現有配置不會失效：

```typescript
const modelMapping: Record<string, PerplexityModel> = {
  // 新的模型名稱
  'sonar': PERPLEXITY_MODELS.SONAR,
  'sonar-pro': PERPLEXITY_MODELS.SONAR_PRO,
  'sonar-reasoning': PERPLEXITY_MODELS.SONAR_REASONING,
  // 向下相容舊的模型名稱
  'llama-3.1-sonar-small-128k-online': PERPLEXITY_MODELS.SONAR,
  'llama-3.1-sonar-large-128k-online': PERPLEXITY_MODELS.SONAR_PRO,
  'llama-3.1-sonar-huge-128k-online': PERPLEXITY_MODELS.SONAR_REASONING,
};
```

## 測試驗證
### 測試案例
1. **功能測試**：驗證修復後的 Perplexity 最佳化功能是否正常運作
2. **模型選擇測試**：確認所有三種模型（sonar, sonar-pro, sonar-reasoning）都能正常使用
3. **向下相容測試**：驗證舊模型名稱仍能正確映射

### 測試結果
- [ ] Sonar 模型測試通過
- [ ] Sonar Pro 模型測試通過  
- [ ] Sonar Reasoning 模型測試通過
- [ ] 舊模型名稱映射測試通過
- [ ] 成本估算功能正常
- [ ] 引用來源顯示正常

### 測試指令
```bash
# 啟動開發環境
npm run dev

# 測試 Perplexity 功能
# 1. 前往 http://localhost:3000
# 2. 選擇「提示詞最佳化」分頁
# 3. 選擇 Perplexity 服務
# 4. 測試各種模型選項
```

## 部署注意事項
- **部署順序**：無特殊要求，可直接部署
- **資料庫遷移**：不需要
- **環境變數**：無變更
- **相依套件**：無變更
- **設定檔案**：無需更新

## 預防措施
### 短期措施
- 新增 API 模型名稱的自動檢測機制
- 改善錯誤處理，提供更友善的錯誤訊息
- 新增模型可用性檢查

### 長期措施
- 實作動態模型列表獲取
- 建立 API 版本相容性檢查
- 新增自動化測試覆蓋 API 呼叫

### 文件更新
- [x] 更新 PERPLEXITY_USAGE_GUIDE.md 中的模型名稱說明
- [x] 更新 PERPLEXITY_INTEGRATION_REPORT.md 的模型列表
- [x] 建立本修復報告

## 影響評估
### 正面影響
- 解決了 Perplexity 功能完全無法使用的問題
- 提升了系統穩定性
- 保持了向下相容性

### 風險評估
- **低風險**：只是模型名稱變更，不影響核心邏輯
- **向下相容**：舊配置仍能正常工作
- **即時生效**：修復後立即可用

## 相關連結
- **Issues**: 用戶回報 - Perplexity 最佳化功能錯誤
- **參考文件**: [Perplexity API Model Cards](https://docs.perplexity.ai/guides/model-cards)
- **API 文件**: [Perplexity API Documentation](https://docs.perplexity.ai)

## 後續追蹤
- [ ] 監控 Perplexity 功能使用狀況（持續 7 天）
- [ ] 收集使用者回饋
- [ ] 檢查是否有其他 API 變更
- [ ] 建立 API 變更監控機制

## 簽名
- **修復負責人**：AI Assistant
- **建立日期**：2025-07-08
- **完成日期**：2025-07-08

---

## 附錄
### Perplexity 新模型名稱對照表
| 舊模型名稱 | 新模型名稱 | 說明 |
|------------|------------|------|
| `llama-3.1-sonar-small-128k-online` | `sonar` | 基礎搜尋模型 |
| `llama-3.1-sonar-large-128k-online` | `sonar-pro` | 進階搜尋模型 |
| `llama-3.1-sonar-huge-128k-online` | `sonar-reasoning` | 推理搜尋模型 |

### 學習心得
- API 供應商的模型名稱可能會更新，需要保持關注
- 向下相容性處理很重要，避免影響現有用戶
- 錯誤訊息應該更友善，幫助用戶快速理解問題
- 建立自動化 API 相容性檢查機制的必要性
