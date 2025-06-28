# Issue #2: 圖片生成結果複製功能改善

## 📋 Issue 概述
**優先級**: Medium  
**類型**: Enhancement  
**標籤**: image-generation, user-experience, clipboard, copy-function

## 🎯 問題描述
目前在圖片生成功能中，當使用者點擊「複製」按鈕時，複製的是提示詞文字而非實際的圖片。這不符合使用者的直觀期望，使用者更希望能直接複製圖片本身到剪貼簿，以便快速貼到其他應用程式中使用。

## 🔍 具體需求

### 功能改善目標
1. **主要複製功能**: 點擊「複製」按鈕應複製圖片到剪貼簿
2. **備選功能**: 提供額外選項複製提示詞（如果需要）
3. **格式支援**: 支援主流圖片格式（PNG、JPEG、WebP）
4. **跨平台相容**: 確保在不同作業系統和瀏覽器中正常運作

### 使用者體驗設計
```
現有設計:
[📷 圖片預覽]
[複製提示詞] [下載圖片]

建議新設計:
[📷 圖片預覽]  
[複製圖片] [複製提示詞] [下載圖片]
```

### 技術實作要求
1. **瀏覽器 API**: 使用 `navigator.clipboard.write()` API
2. **圖片轉換**: 將圖片轉為 Blob 格式
3. **錯誤處理**: 處理瀏覽器不支援或權限不足的情況
4. **使用者回饋**: 提供複製成功/失敗的視覺回饋
5. **降級方案**: 對於不支援的瀏覽器提供替代方案

## 📁 影響檔案
- `src/components/SimpleImagePreview.tsx` (主要圖片預覽元件)
- `src/components/ImagePreview.tsx` (如果有使用)
- `src/utils/helpers.ts` (可能需要新增圖片處理函式)
- `src/types/index.ts` (如需新增相關型別定義)

## 🧪 測試要求

### 瀏覽器相容性測試
- [ ] Chrome (最新版本)
- [ ] Firefox (最新版本) 
- [ ] Safari (最新版本)
- [ ] Edge (最新版本)

### 功能測試
- [ ] PNG 格式圖片複製
- [ ] JPEG 格式圖片複製
- [ ] WebP 格式圖片複製
- [ ] 複製成功提示顯示
- [ ] 複製失敗錯誤處理
- [ ] 權限拒絕情況處理

### 使用者體驗測試
- [ ] 複製後可成功貼到其他應用程式
- [ ] 按鈕標籤清楚明確
- [ ] 載入狀態適當顯示
- [ ] 錯誤訊息使用者友善

## ✅ 完成標準 (Definition of Done)
- [ ] 點擊複製按鈕可將圖片複製到剪貼簿
- [ ] 支援所有專案使用的圖片格式
- [ ] 在主流瀏覽器中正常運作
- [ ] 提供清楚的成功/失敗回饋
- [ ] 保留原有的提示詞複製功能（可選）
- [ ] 不影響現有的下載圖片功能
- [ ] 通過所有相關測試

## 📝 實作細節

### Phase 1: 圖片複製核心功能
```typescript
// 核心複製函式
const copyImageToClipboard = async (imageUrl: string) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob
      })
    ]);
    
    // 顯示成功提示
  } catch (error) {
    // 錯誤處理與降級方案
  }
};
```

### Phase 2: UI/UX 改善
- 更新按鈕設計和標籤
- 新增載入狀態指示器
- 實作成功/失敗的視覺回饋

### Phase 3: 相容性與錯誤處理
- 檢測瀏覽器 API 支援度
- 實作降級方案
- 完善錯誤訊息與使用者指引

### 降級方案設計
對於不支援 Clipboard API 的瀏覽器：
1. 顯示「瀏覽器不支援直接複製圖片」訊息
2. 提供「右鍵複製圖片」的使用說明
3. 保持下載功能作為替代方案

## 🔗 相關資源
- [MDN - Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- [Can I Use - Clipboard API](https://caniuse.com/async-clipboard)
- [Web API - ClipboardItem](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardItem)

## 📋 實作順序
1. **調研階段**: 確認瀏覽器支援度和技術可行性
2. **核心開發**: 實作圖片複製功能
3. **UI 改善**: 更新介面設計
4. **測試驗證**: 跨瀏覽器測試
5. **文件更新**: 更新使用說明

---

**預估工作量**: 2-3 天  
**開發者**: GitHub Copilot  
**審查者**: 專案維護者  
**依賴**: 無特殊依賴，可獨立開發
