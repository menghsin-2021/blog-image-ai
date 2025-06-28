import {
  OptimizationProviderInterface,
  ContentInput,
  ImagePurposeType,
  UnifiedOptimizationResult,
  ModelOption,
} from '../../../types/promptOptimizer';
import { perplexityOptimizationService } from '../../../services/perplexityOptimizer';
import { PERPLEXITY_MODELS, PerplexityModel } from '../../../utils/perplexityConstants';

/**
 * Perplexity AI 最佳化服務提供商
 * 包裝現有的 PerplexityOptimizationService，使其符合統一介面
 */
export class PerplexityOptimizationProvider implements OptimizationProviderInterface {
  name = 'Perplexity AI';
  provider = 'perplexity' as const;

  /**
   * 執行提示詞最佳化
   */
  async optimize(
    content: ContentInput,
    purpose: ImagePurposeType,
    options?: { model?: string; originalPrompt?: string }
  ): Promise<UnifiedOptimizationResult> {
    try {
      // 轉換 ContentInput 為 Perplexity 需要的字串格式
      const contentString = this.convertContentInputToString(content);

      // 轉換 ImagePurposeType 為 Perplexity 需要的字串格式
      const purposeString = this.convertPurposeToString(purpose);

      // 選擇模型
      const selectedModel = this.convertModelName(
        options?.model || 'llama-3.1-sonar-large-128k-online'
      );

      // 使用現有的 Perplexity 服務實例
      const result = await perplexityOptimizationService.optimizePrompt(
        contentString,
        purposeString,
        selectedModel
      );

      // 轉換為統一格式
      return this.convertToUnifiedResult(
        result,
        options?.model || 'llama-3.1-sonar-large-128k-online'
      );
    } catch (error) {
      console.error('Perplexity optimization failed:', error);
      throw new Error(
        `Perplexity 最佳化失敗: ${error instanceof Error ? error.message : '未知錯誤'}`
      );
    }
  }

  /**
   * 取得可用模型列表
   */
  getAvailableModels(): ModelOption[] {
    return [
      {
        value: 'llama-3.1-sonar-large-128k-online',
        label: 'Llama 3.1 Sonar Large (Online)',
        description: '結合線上搜尋的大型模型，提供最新資訊',
        features: ['即時搜尋', '引用來源', '最新資訊'],
      },
      {
        value: 'llama-3.1-sonar-small-128k-online',
        label: 'Llama 3.1 Sonar Small (Online)',
        description: '輕量級線上搜尋模型，成本較低',
        features: ['即時搜尋', '快速回應', '成本效益'],
      },
      {
        value: 'llama-3.1-sonar-huge-128k-online',
        label: 'Llama 3.1 Sonar Huge (Online)',
        description: '最強大的線上搜尋模型，深度分析',
        features: ['深度分析', '完整引用', '專業級'],
      },
    ];
  }

  /**
   * 估算成本
   */
  async estimateCost(content: string, model?: string): Promise<number> {
    try {
      // 估算 token 數量（粗略計算）
      const estimatedTokens = Math.ceil(content.length / 4); // 每4個字元約1個token

      // Perplexity 價格表（每1000 tokens的成本，美元）
      const pricing: Record<string, number> = {
        'llama-3.1-sonar-small-128k-online': 0.0002, // $0.0002
        'llama-3.1-sonar-large-128k-online': 0.001, // $0.001
        'llama-3.1-sonar-huge-128k-online': 0.005, // $0.005
      };

      const selectedModel = model || 'llama-3.1-sonar-large-128k-online';
      const pricePerK = pricing[selectedModel] || pricing['llama-3.1-sonar-large-128k-online'];

      return (estimatedTokens / 1000) * pricePerK;
    } catch (error) {
      console.warn('Cost estimation failed:', error);
      return 0.001; // 預設成本
    }
  }

  /**
   * 轉換 Perplexity 結果為統一格式
   */
  private convertToUnifiedResult(perplexityResult: any, model: string): UnifiedOptimizationResult {
    return {
      // 基本識別
      provider: 'perplexity',
      model: model,
      timestamp: perplexityResult.timestamp || Date.now(),

      // 統一提示詞格式
      original: perplexityResult.original || perplexityResult.originalPrompt || '',
      originalPrompt: perplexityResult.originalPrompt || perplexityResult.original || '',
      optimized: {
        chinese: perplexityResult.optimized?.chinese || perplexityResult.optimizedPrompt || '',
        english:
          perplexityResult.optimized?.english ||
          perplexityResult.optimizedPromptEn ||
          perplexityResult.optimizedPrompt ||
          '',
      },
      optimizedPrompt:
        perplexityResult.optimizedPrompt || perplexityResult.optimized?.chinese || '',

      // 分析結果
      improvements: perplexityResult.improvements || perplexityResult.suggestions || [],
      suggestions: perplexityResult.suggestions || perplexityResult.improvements || [],
      reasoning: perplexityResult.reasoning || '基於 Perplexity AI 分析',

      // 樣式與技術參數
      suggestedStyle: perplexityResult.suggestedStyle || '',
      styleModifiers: perplexityResult.styleModifiers || [],
      technicalTips: perplexityResult.technicalTips || '',
      technicalParams: perplexityResult.technicalParams || {},

      // 品質指標
      confidence: perplexityResult.confidence || 0.8,

      // 內容分析
      analysis: perplexityResult.analysis || {
        keywords: [],
        topic: '未知',
        sentiment: 'neutral',
        complexity: 'moderate',
        technicalTerms: [],
      },

      // 匯出資料
      exportData: perplexityResult.exportData || {
        markdown: '# Perplexity 最佳化結果\n\n匯出資料不可用',
        timestamp: Date.now(),
        purpose: 'banner',
      },

      // Perplexity 特有欄位
      citations: perplexityResult.citations || [],
      cost: perplexityResult.cost || {
        inputCost: 0,
        outputCost: 0,
        searchCost: 0,
        totalCost: 0,
      },
    };
  }

  /**
   * 轉換 ContentInput 為字串格式
   */
  private convertContentInputToString(content: ContentInput): string {
    return `標題: ${content.title}\n\n內容: ${content.content}\n\n${
      content.keywords?.length ? `關鍵字: ${content.keywords.join(', ')}\n\n` : ''
    }${content.targetAudience ? `目標讀者: ${content.targetAudience}` : ''}`;
  }

  /**
   * 轉換 ImagePurposeType 為字串格式
   */
  private convertPurposeToString(purpose: ImagePurposeType): string {
    const purposeMap = {
      banner: '首頁橫幅',
      illustration: '段落說明',
      summary: '內容總結',
    };
    return purposeMap[purpose] || purpose;
  }

  /**
   * 轉換模型名稱為 Perplexity 格式
   */
  private convertModelName(modelName: string): PerplexityModel {
    // 模型名稱映射
    const modelMapping: Record<string, PerplexityModel> = {
      'llama-3.1-sonar-small-128k-online': PERPLEXITY_MODELS.SONAR,
      'llama-3.1-sonar-large-128k-online': PERPLEXITY_MODELS.SONAR_PRO,
      'llama-3.1-sonar-huge-128k-online': PERPLEXITY_MODELS.SONAR_REASONING,
    };

    return modelMapping[modelName] || PERPLEXITY_MODELS.SONAR_PRO; // 預設使用 Pro 版本
  }
}

/**
 * Perplexity 最佳化提供商實例
 */
export const perplexityOptimizationProvider = new PerplexityOptimizationProvider();
