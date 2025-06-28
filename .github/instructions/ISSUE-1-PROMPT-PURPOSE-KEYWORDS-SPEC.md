# Issue #1: 提示詞最佳化結果必須包含圖片用途關鍵字

## 📋 Issue 概述
**優先級**: High  
**類型**: Enhancement  
**標籤**: prompt-optimization, user-experience, content-enhancement

## 🎯 問題描述
目前的提示詞最佳化系統在生成結果時，並未強制包含使用者選擇的圖片用途關鍵字。這可能導致生成的提示詞與使用者的具體需求不完全匹配，影響最終圖片生成的準確性。

## 🔍 具體需求

### 用途關鍵字對應規則
當使用者在 `PurposeSelector` 中選擇不同用途時，最佳化後的提示詞**必須**包含對應的關鍵字：

| 使用者選擇 | 必須包含的關鍵字 |
|-----------|-----------------|
| 首頁橫幅 | "部落格文章開頭封面橫幅圖片" |
| 段落說明 | "部落格文章段落說明圖片" |
| 內容總結 | "部落格文章結尾總結圖片" |

### 技術實作要求
1. **OpenAI 服務**: 在 `OpenAIOptimizationProvider` 中的系統提示加入用途關鍵字要求
2. **Perplexity 服務**: 在 `PerplexityOptimizationProvider` 中的系統提示加入用途關鍵字要求
3. **結果驗證**: 實作檢查機制，確保生成的提示詞包含必要關鍵字
4. **錯誤處理**: 如果生成結果未包含關鍵字，應重新生成或顯示警告

## 📁 影響檔案
- `src/components/PromptOptimizer/providers/OpenAIOptimizationProvider.tsx`
- `src/components/PromptOptimizer/providers/PerplexityOptimizationProvider.tsx`
- `src/services/gpt4oOptimizer.ts`
- `src/services/perplexityOptimizer.ts`
- `src/types/promptOptimizer.ts` (如需新增驗證相關型別)

## 🧪 測試要求
1. **功能測試**: 每種用途選擇都能正確包含對應關鍵字
2. **服務測試**: OpenAI 和 Perplexity 兩種服務都正確實作
3. **邊界測試**: 驗證關鍵字在提示詞中的位置和格式
4. **整合測試**: 確保不影響現有的雙語生成功能

## ✅ 完成標準 (Definition of Done)
- [ ] OpenAI 提示詞最佳化結果包含正確的用途關鍵字
- [ ] Perplexity 提示詞最佳化結果包含正確的用途關鍵字
- [ ] 繁體中文和英文版本都包含對應關鍵字
- [ ] 新增驗證機制確保關鍵字存在
- [ ] 所有現有功能保持正常運作
- [ ] 通過所有相關測試

## 📝 實作細節

### Phase 1: 系統提示增強
- 修改兩個服務提供商的系統提示
- 加入用途關鍵字的強制要求
- 確保雙語版本都包含關鍵字

### Phase 2: 驗證機制
- 實作提示詞結果驗證函式
- 檢查關鍵字存在性
- 錯誤處理與重試邏輯

### Phase 3: 測試與優化
- 全面測試三種用途選擇
- 優化關鍵字在提示詞中的整合方式
- 確保自然語言流暢性

## 🔗 相關 Issue/PR
- 關聯到統一提示詞最佳化系統 v1.0.0
- 可能需要更新用戶文件

---

**預估工作量**: 1-2 天  
**開發者**: GitHub Copilot  
**審查者**: 專案維護者
