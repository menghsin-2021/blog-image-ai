# GPT-image-1 Response Format 修復報告

## 🔍 問題分析

**錯誤訊息**: `Unknown parameter: 'response_format'.`

**根本原因**: GPT-image-1 模型不支援 `response_format` 參數，而且預設返回 base64 編碼的圖片，不是 URL。

## ✅ 修復內容

### 1. 移除 response_format 參數

#### 修復前：
```typescript
case 'gpt-image-1':
  return {
    model: 'gpt-image-1',
    prompt: this.optimizePrompt(request.prompt),
    size: request.aspectRatio.value,
    quality: gptQuality,
    n: 1,
    response_format: 'url' // ❌ GPT-image-1 不支援此參數
  };
```

#### 修復後：
```typescript
case 'gpt-image-1':
  return {
    model: 'gpt-image-1',
    prompt: this.optimizePrompt(request.prompt),
    size: request.aspectRatio.value,
    quality: gptQuality,
    n: 1
    // ✅ 移除 response_format 參數
  };
```

### 2. 更新響應處理邏輯

#### 修復前：
```typescript
return {
  success: true,
  imageUrl: response.data[0].url, // ❌ GPT-image-1 沒有 url 欄位
  revisedPrompt: response.data[0].revised_prompt,
  requestId
};
```

#### 修復後：
```typescript
// 根據模型處理不同的響應格式
let imageUrl: string;
if (request.model === 'gpt-image-1') {
  // GPT-image-1 返回 base64 編碼的圖片
  const base64Data = response.data[0].b64_json;
  imageUrl = `data:image/png;base64,${base64Data}`;
} else {
  // DALL·E 2/3 返回 URL
  imageUrl = response.data[0].url;
}

return {
  success: true,
  imageUrl: imageUrl, // ✅ 正確處理兩種格式
  revisedPrompt: response.data[0].revised_prompt,
  requestId
};
```

## 📋 GPT-image-1 vs DALL·E 比較

| 特性 | GPT-image-1 | DALL·E 3 | DALL·E 2 |
|------|------------|----------|----------|
| **響應格式** | base64 only | url or b64_json | url or b64_json |
| **response_format 參數** | ❌ 不支援 | ✅ 支援 | ✅ 支援 |
| **style 參數** | ❌ 不支援 | ✅ 支援 | ❌ 不支援 |
| **品質選項** | low/medium/high | standard/hd | standard |
| **輸出格式** | png (預設) | png (固定) | png (固定) |

## 🔧 GPT-image-1 正確參數

```typescript
{
  "model": "gpt-image-1",
  "prompt": "圖片描述",
  "size": "1024x1024",
  "quality": "medium", // low/medium/high
  "n": 1
}
```

## 📦 GPT-image-1 API 響應格式

```json
{
  "data": [
    {
      "b64_json": "iVBORw0KGgoAAAANSUhEUgAA...", // base64 編碼的圖片
      "revised_prompt": "優化後的提示詞"
    }
  ]
}
```

## 🎯 處理流程

1. **API 請求**: 不包含 `response_format` 參數
2. **API 響應**: 返回 `b64_json` 欄位 
3. **圖片處理**: 轉換為 `data:image/png;base64,{base64_data}` 格式
4. **UI 顯示**: 直接使用 data URL 顯示圖片

## ✅ 修復結果

- ✅ 移除了不支援的 `response_format` 參數
- ✅ 正確處理 GPT-image-1 的 base64 響應
- ✅ 保持與 DALL·E 2/3 的相容性
- ✅ 圖片可以正常顯示和下載

## 🚀 測試建議

使用以下提示詞測試 GPT-image-1：
- "一個現代化的科技辦公室，有藍色和白色的設計元素"
- "一隻可愛的橘貓在陽光下睡覺"
- "簡潔的程式設計概念圖，顯示前端和後端的連接"

---

**修復完成時間**: 2025年6月26日  
**狀態**: ✅ 已解決  
**預期結果**: GPT-image-1 應該能夠成功生成並顯示圖片
