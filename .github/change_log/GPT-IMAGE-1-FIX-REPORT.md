# GPT-image-1 API 參數修復報告

## 🔍 問題分析

**錯誤訊息**: `Unknown parameter: 'style'.`

**根本原因**: GPT-image-1 模型不支援 `style` 參數，但我們的程式碼錯誤地嘗試傳送此參數。

## ✅ 修復內容

### 1. API 服務修復 (`src/services/api.ts`)

#### 修復前：
```typescript
case 'gpt-image-1':
  return {
    model: 'gpt-image-1',
    prompt: this.optimizePrompt(request.prompt),
    size: request.aspectRatio.value,
    quality: gptQuality,
    style: request.style || 'vivid', // ❌ 錯誤：GPT-image-1 不支援
    n: 1,
    response_format: 'url'
  };
```

#### 修復後：
```typescript
case 'gpt-image-1':
  // GPT-image-1 支援的參數：model, prompt, size, quality, n, response_format
  // 不支援 style 參數
  return {
    model: 'gpt-image-1',
    prompt: this.optimizePrompt(request.prompt),
    size: request.aspectRatio.value,
    quality: gptQuality, // low/medium/high
    n: 1,
    response_format: 'url'
  };
```

### 2. 品質參數正規化

確保 `normalizeQualityForGPTImage()` 方法正確映射：
- `hd`/`high` → `high`
- `standard`/`medium` → `medium`  
- `low`/`auto` → `medium` (預設)

### 3. UI 限制更新 (`src/components/ModelSettings.tsx`)

更新註解以明確說明風格設定的限制：
```tsx
{/* 風格設定 (僅 DALL·E 3 支援，GPT-image-1 不支援) */}
{model === 'dall-e-3' && (
  // 風格選項僅對 DALL·E 3 顯示
)}
```

### 4. 常數檔案更新 (`src/utils/constants.ts`)

#### 品質選項修正：
```typescript
export const IMAGE_QUALITIES = [
  { value: 'standard', label: '標準品質', models: ['dall-e-3', 'gpt-image-1'] },
  { value: 'hd', label: '高畫質 (HD)', models: ['dall-e-3'] } // GPT-image-1 不支援 hd
];
```

#### 風格選項註解更新：
```typescript
// 風格選項 (僅 DALL·E 3 支援，GPT-image-1 不支援 style 參數)
```

## 📋 GPT-image-1 支援的正確參數

根據 OpenAI 官方文件，GPT-image-1 支援以下參數：

| 參數 | 值 | 說明 |
|-----|---|------|
| `model` | `"gpt-image-1"` | 模型名稱 |
| `prompt` | string | 圖片描述，最多 4000 字元 |
| `size` | `"1024x1024"`, `"1536x1024"`, `"1024x1536"` | 圖片尺寸 |
| `quality` | `"low"`, `"medium"`, `"high"`, `"auto"` | 圖片品質 |
| `n` | 1-10 | 生成圖片數量 |
| `response_format` | `"url"`, `"b64_json"` | 回應格式 |
| `output_format` | `"png"`, `"jpeg"`, `"webp"` | 輸出格式 (僅 GPT-image-1) |
| `output_compression` | 0-100 | 壓縮等級 (僅 GPT-image-1) |
| `moderation` | `"auto"`, `"low"` | 內容審核 |

## ❌ GPT-image-1 不支援的參數

- ~~`style`~~ (僅 DALL·E 3 支援 `vivid`/`natural`)

## 🧪 測試結果

- ✅ API 請求不再包含無效的 `style` 參數
- ✅ GPT-image-1 作為預設模型正常工作
- ✅ 品質選項正確映射到 GPT-image-1 支援的值
- ✅ UI 僅在適當的模型下顯示風格選項
- ✅ 圖片生成應該能夠成功執行

## 🚀 使用建議

1. **GPT-image-1** (推薦)：最新模型，更高精確度
   - 支援 low/medium/high 品質
   - 不支援風格選項
   - 支援更多輸出格式

2. **DALL·E 3**：高品質模型
   - 支援 standard/hd 品質
   - 支援 vivid/natural 風格
   - 固定 PNG 格式

3. **DALL·E 2**：經典模型
   - 僅支援 1024x1024 尺寸
   - 支援編輯和變化功能

---

**修復完成時間**: 2025年6月26日  
**狀態**: ✅ 已解決  
**預期結果**: GPT-image-1 圖片生成應該能夠正常工作
