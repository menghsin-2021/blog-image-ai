import {
  OptimizationProviderInterface,
  ContentInput,
  ImagePurposeType,
  UnifiedOptimizationResult,
  ModelOption,
} from '../../../types/promptOptimizer';
import { gpt4oOptimizationService } from '../../../services/gpt4oOptimizer';

/**
 * OpenAI GPT-4o 最佳化服務提供商
 * 包裝現有的 GPT4oOptimizationService，使其符合統一介面
 */
export class OpenAIOptimizationProvider implements OptimizationProviderInterface {
  name = 'OpenAI GPT-4o';
  provider = 'openai' as const;

  /**
   * 執行提示詞最佳化
   */
  async optimize(
    content: ContentInput,
    purpose: ImagePurposeType,
    options?: { model?: string; originalPrompt?: string }
  ): Promise<UnifiedOptimizationResult> {
    try {
      // 使用現有的 GPT4o 服務實例
      const result = await gpt4oOptimizationService.optimizePrompt(
        content,
        purpose,
        options?.originalPrompt
      );

      // 轉換為統一格式
      return this.convertToUnifiedResult(result, options?.model || 'gpt-4o');
    } catch (error) {
      console.error('OpenAI optimization failed:', error);
      throw new Error(`OpenAI 最佳化失敗: ${error instanceof Error ? error.message : '未知錯誤'}`);
    }
  }

  /**
   * 取得可用模型列表
   */
  getAvailableModels(): ModelOption[] {
    return [
      {
        value: 'gpt-4o',
        label: 'GPT-4o',
        description: '強大的多模態模型，適合複雜內容分析',
        features: ['深度分析', '創意生成', '多語言支援'],
      },
    ];
  }

  /**
   * 估算成本 (OpenAI 目前不提供即時成本估算)
   */
  async estimateCost?(_content: string, _model?: string): Promise<number> {
    // OpenAI 的計費方式不需要即時估算
    // 這裡返回 0 表示免費使用或預付費模式
    return 0;
  }

  /**
   * 轉換 GPT4o 結果為統一格式
   */
  private convertToUnifiedResult(gpt4oResult: any, model: string): UnifiedOptimizationResult {
    return {
      // 基本識別
      provider: 'openai',
      model: model,
      timestamp: gpt4oResult.timestamp || Date.now(),

      // 統一提示詞格式
      original: gpt4oResult.original || gpt4oResult.originalPrompt || '',
      originalPrompt: gpt4oResult.originalPrompt || gpt4oResult.original || '',
      optimized: {
        chinese: gpt4oResult.optimized?.chinese || gpt4oResult.optimizedPrompt || '',
        english: gpt4oResult.optimized?.english || gpt4oResult.optimizedPrompt || '',
      },
      optimizedPrompt: gpt4oResult.optimizedPrompt || gpt4oResult.optimized?.chinese || '',

      // 分析結果
      improvements: gpt4oResult.improvements || gpt4oResult.suggestions || [],
      reasoning: gpt4oResult.reasoning || '基於 GPT-4o 深度分析生成',
      suggestedStyle: gpt4oResult.suggestedStyle || '現代專業風格',
      technicalTips: gpt4oResult.technicalTips || '建議使用高解析度',
      confidence: gpt4oResult.confidence || 0.8,

      // 分析資訊
      analysis: {
        keywords: gpt4oResult.analysis?.keywords || [],
        topic: gpt4oResult.analysis?.topic || '一般',
        sentiment: this.normalizeSentiment(gpt4oResult.analysis?.sentiment),
        complexity: this.normalizeComplexity(gpt4oResult.analysis?.complexity),
      },

      // 技術參數
      technicalParams: {
        aspectRatio: gpt4oResult.technicalParams?.aspectRatio || '16:9',
        quality: gpt4oResult.technicalParams?.quality || 'high',
        style: gpt4oResult.technicalParams?.style,
      },

      // 共同欄位
      styleModifiers: gpt4oResult.styleModifiers || [],
      suggestions: gpt4oResult.suggestions || gpt4oResult.improvements || [],

      // 匯出資料
      exportData: {
        markdown: gpt4oResult.exportData?.markdown || this.generateMarkdown(gpt4oResult),
      },

      // OpenAI 特有欄位 (保留在統一格式中)
      // 注意：這裡不包含 Perplexity 特有的 citations 和 cost
    };
  }

  /**
   * 正規化情感分析結果
   */
  private normalizeSentiment(sentiment: any): 'positive' | 'neutral' | 'professional' {
    if (typeof sentiment === 'string') {
      const normalized = sentiment.toLowerCase();
      if (normalized.includes('positive') || normalized.includes('正面')) return 'positive';
      if (normalized.includes('neutral') || normalized.includes('中性')) return 'neutral';
    }
    return 'professional'; // 預設值
  }

  /**
   * 正規化複雜度分析結果
   */
  private normalizeComplexity(complexity: any): 'simple' | 'moderate' | 'complex' {
    if (typeof complexity === 'string') {
      const normalized = complexity.toLowerCase();
      if (normalized.includes('simple') || normalized.includes('簡單')) return 'simple';
      if (normalized.includes('complex') || normalized.includes('複雜')) return 'complex';
    }
    return 'moderate'; // 預設值
  }

  /**
   * 生成 Markdown 匯出格式
   */
  private generateMarkdown(result: any): string {
    return `# OpenAI GPT-4o 提示詞最佳化結果

## 原始提示詞
${result.original || result.originalPrompt || ''}

## 最佳化後提示詞

### 中文版本
${result.optimized?.chinese || result.optimizedPrompt || ''}

### 英文版本
${result.optimized?.english || result.optimizedPrompt || ''}

## 改善建議
${(result.improvements || result.suggestions || []).map((item: string, index: number) => `${index + 1}. ${item}`).join('\n')}

## 最佳化理由
${result.reasoning || ''}

## 技術建議
${result.technicalTips || ''}

---
*生成時間: ${new Date(result.timestamp || Date.now()).toLocaleString('zh-TW')}*
*服務提供商: OpenAI GPT-4o*
`;
  }
}
