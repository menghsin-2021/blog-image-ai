# 提示詞最佳化助手功能規格制定記錄

**日期**: 2025年6月27日  
**分支**: `feature/prompt-optimizer`  
**狀態**: 功能規格完成 ✅

## 概述
完成了提示詞最佳化助手功能的完整規格制定，這是一個針對部落格圖片生成需求的智慧提示詞最佳化工具。

## 功能規格重點

### 1. 使用情境分析
- **首頁橫幅圖片**: 吸引眼球、代表主題、視覺衝擊力
- **文章段落說明圖片**: 輔助說明、簡單明瞭、避免干擾
- **內容總結末尾圖片**: 呼應主題、深刻印象、象徵性元素

### 2. 技術架構設計
```
src/components/PromptOptimizer/
├── PromptOptimizer.tsx          // 主要元件
├── PurposeSelector.tsx          // 圖片用途選擇器
├── ContentInput.tsx             // 部落格內容輸入
├── OptimizedPromptDisplay.tsx   // 最佳化提示詞顯示
└── PromptTemplates.tsx          // 提示詞模板管理
```

### 3. 使用者體驗流程
1. **用途選擇**: 選擇圖片類型，自動預設參數
2. **內容分析**: 輸入部落格內容，即時提取關鍵概念
3. **提示詞最佳化**: 產生最佳化提示詞，顯示改善建議
4. **結果應用**: 編輯並一鍵複製到主要生成介面

### 4. 最佳化演算法
- 內容分析：TF-IDF 關鍵字提取、主題識別、情感分析
- 提示詞建構：模組化模板 + 風格指引庫
- 針對性最佳化：根據部落格圖片特性調整

## 技術規格

### 核心介面
```typescript
interface ImagePurpose {
  id: 'banner' | 'illustration' | 'summary';
  title: string;
  description: string;
  aspectRatios: string[];
  styleGuidelines: string[];
}

interface OptimizedPrompt {
  original: string;
  optimized: string;
  suggestions: string[];
  styleModifiers: string[];
  technicalParams: {
    aspectRatio: string;
    quality: string;
    style?: string;
  };
}
```

### 風格指引庫
- **部落格通用**: 簡潔、現代、專業、易理解
- **技術內容**: 扁平設計、圖示、圖表、藍灰色調
- **教學內容**: 親和、步驟化、視覺指引

## 開發計劃

### Phase 1: 核心功能 (1-2 週)
- [x] 功能規格制定
- [ ] 基礎元件開發
- [ ] 用途選擇器實作
- [ ] 內容輸入介面

### Phase 2: 最佳化邏輯 (2-3 週)
- [ ] 內容分析演算法
- [ ] 提示詞建構系統
- [ ] 模板庫建立
- [ ] 結果顯示介面

### Phase 3: 整合與最佳化 (1 週)
- [ ] 主介面整合
- [ ] 效能最佳化
- [ ] 測試與除錯
- [ ] 文件更新

## 預期效益

### 使用者體驗
- 降低學習門檻，提升圖片生成成功率
- 針對部落格需求的專業化最佳化
- 直觀的四步驟使用流程

### 技術指標
- 提示詞最佳化準確度 > 85%
- 內容分析回應時間 < 2 秒
- 使用者滿意度 > 4.0/5.0

## 文件更新

### 新增檔案
- `.github/instructions/prompt-optimizer-feature-spec.md` - 完整功能規格
- `.github/change_log/PROMPT-OPTIMIZER-SPEC-2025-06-27.md` - 本記錄檔案

### 更新檔案  
- `.github/copilot-instructions.md` - 專案狀態更新，將此功能列為優先開發

## 下一步行動
1. 開始 Phase 1 開發：建立基礎元件架構
2. 實作 `PurposeSelector` 圖片用途選擇器
3. 建立 `ContentInput` 部落格內容輸入介面
4. 設定基本的內容分析邏輯

## 備註
此功能將大幅提升 BlogImageAI 的實用性，特別是對部落格作者的工作流程最佳化。規格已充分考慮使用者需求和技術可行性，可以開始進入實作階段。

---

**相關檔案**:
- 功能規格: `.github/instructions/prompt-optimizer-feature-spec.md`
- 專案指令: `.github/copilot-instructions.md`
- 開發分支: `feature/prompt-optimizer`
