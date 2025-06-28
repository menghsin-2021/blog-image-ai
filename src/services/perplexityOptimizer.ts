import {
  PERPLEXITY_API_CONFIG,
  PERPLEXITY_MODELS,
  PerplexityModel,
  calculatePerplexityCost,
} from '../utils/perplexityConstants';
import { OptimizedPrompt } from '../types/promptOptimizer';

export interface PerplexityMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface PerplexityRequest {
  model: PerplexityModel;
  messages: PerplexityMessage[];
  max_tokens?: number;
  temperature?: number;
  search_domain_filter?: string[];
  search_recency_filter?: string;
  return_citations?: boolean;
  return_images?: boolean;
}

export interface PerplexityCitation {
  number: number;
  url: string;
  title: string;
  snippet?: string;
}

export interface PerplexityResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  citations?: PerplexityCitation[];
}

export interface PerplexityOptimizationResult extends OptimizedPrompt {
  provider: 'perplexity';
  model: PerplexityModel;
  citations: PerplexityCitation[];
  cost: {
    inputCost: number;
    outputCost: number;
    searchCost: number;
    totalCost: number;
  };
  searchQueries: number;
}

export class PerplexityOptimizer {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY;
    this.baseUrl = PERPLEXITY_API_CONFIG.BASE_URL;
    
    if (!this.apiKey) {
      throw new Error('Perplexity API key is required. Please set VITE_PERPLEXITY_API_KEY in your environment variables.');
    }
  }

  private async makeRequest(request: PerplexityRequest): Promise<PerplexityResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}${PERPLEXITY_API_CONFIG.CHAT_COMPLETIONS_ENDPOINT}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...request,
            return_citations: true,
            return_images: false,
          }),
          signal: AbortSignal.timeout(PERPLEXITY_API_CONFIG.TIMEOUT),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Perplexity API error: ${response.status} - ${errorData.error?.message || response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Perplexity API request timeout');
      }
      throw error;
    }
  }

  private createOptimizationPrompt(content: string, purpose: string): PerplexityMessage[] {
    const systemPrompt = `你是一個專業的部落格圖片生成提示詞最佳化專家。

**重要：請務必使用繁體中文回應，不要使用簡體中文。**

你的任務是分析部落格內容，並為指定的圖片用途生成最佳化的 AI 圖片生成提示詞。

請遵循以下原則：
1. 深入理解部落格內容的主題和情境
2. 基於最新的圖片生成趨勢和技術
3. 考慮目標受眾和視覺效果
4. 包含具體的視覺元素、風格指導和技術參數
5. 確保提示詞能生成專業、高品質的圖片
6. **所有回應內容必須使用繁體中文（Traditional Chinese），包括提示詞和建議**

請以 JSON 格式回應，包含以下欄位：
{
  "originalPrompt": "基於內容生成的基礎提示詞（繁體中文）",
  "optimizedPrompt": "經過最佳化的詳細提示詞（繁體中文）",
  "optimizedPromptEn": "經過最佳化的詳細提示詞（英文版本）",
  "improvements": ["改善點1", "改善點2", ...],
  "reasoning": "最佳化的理由和邏輯",
  "suggestedStyle": "建議的視覺風格",
  "technicalTips": "技術建議和參數"
}`;

    const userPrompt = `請為以下部落格內容生成${purpose}的最佳化提示詞：

部落格內容：
${content}

圖片用途：${purpose}

**特別要求：**
1. 必須提供繁體中文（optimizedPrompt）和英文（optimizedPromptEn）兩個版本的最佳化提示詞
2. 所有說明文字請使用繁體中文（Traditional Chinese），不要使用簡體中文
3. 提示詞應該適合台灣地區的使用者
4. 請基於最新的 AI 圖片生成趨勢和部落格視覺設計最佳實踐，提供詳細的最佳化建議

請確保回應格式正確，且所有中文字都是繁體字。兩個版本的提示詞內容應該相對應但語言不同。`;

    return [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];
  }

  public async optimizePrompt(
    content: string,
    purpose: string,
    model: PerplexityModel = PERPLEXITY_MODELS.SONAR
  ): Promise<PerplexityOptimizationResult> {
    try {
      const messages = this.createOptimizationPrompt(content, purpose);
      
      const request: PerplexityRequest = {
        model,
        messages,
        max_tokens: PERPLEXITY_API_CONFIG.MAX_TOKENS,
        temperature: 0.7,
        search_recency_filter: 'month', // 搜尋最近一個月的資訊
      };

      const response = await this.makeRequest(request);
      
      // 解析回應內容
      const responseContent = response.choices[0]?.message?.content || '';
      
      let parsedContent: any;
      try {
        // 嘗試解析 JSON 回應
        const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedContent = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        // 如果 JSON 解析失敗，使用預設格式
        parsedContent = {
          originalPrompt: content.substring(0, 100) + '...',
          optimizedPrompt: responseContent,
          optimizedPromptEn: responseContent, // 預設使用相同內容
          improvements: ['基於即時網路資訊最佳化', 'Perplexity AI 分析優化'],
          reasoning: '使用 Perplexity AI 基於最新網路資訊進行最佳化',
          suggestedStyle: '現代簡約風格',
          technicalTips: '建議使用高解析度和專業構圖',
        };
      }

      // 計算成本 (估算搜尋查詢數量)
      const estimatedSearchQueries = 3; // 根據內容複雜度估算
      const cost = calculatePerplexityCost(
        response.usage.prompt_tokens,
        response.usage.completion_tokens,
        estimatedSearchQueries,
        model
      );

      return {
        provider: 'perplexity',
        model,
        original: parsedContent.originalPrompt,
        originalPrompt: parsedContent.originalPrompt,
        optimized: {
          chinese: parsedContent.optimizedPrompt,
          english: parsedContent.optimizedPromptEn || parsedContent.optimizedPrompt, // 使用英文版本或退回中文版本
        },
        optimizedPrompt: parsedContent.optimizedPrompt,
        improvements: parsedContent.improvements || [],
        reasoning: parsedContent.reasoning || '',
        suggestedStyle: parsedContent.suggestedStyle || '',
        technicalTips: parsedContent.technicalTips || '',
        confidence: 0.8, // Perplexity 的預設信心度
        analysis: {
          keywords: this.extractKeywords(parsedContent.optimizedPrompt),
          topic: purpose || '一般',
          sentiment: 'professional' as const,
          complexity: 'moderate' as const,
        },
        technicalParams: {
          aspectRatio: '16:9',
          quality: 'high',
          style: parsedContent.suggestedStyle || 'professional',
        },
        styleModifiers: parsedContent.suggestedStyle ? [parsedContent.suggestedStyle] : ['professional'],
        suggestions: parsedContent.improvements || [],
        exportData: {
          markdown: this.generateMarkdown(parsedContent, response.citations || []),
        },
        citations: response.citations || [],
        cost,
        searchQueries: estimatedSearchQueries,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Perplexity optimization error:', error);
      throw new Error(
        `提示詞最佳化失敗: ${error instanceof Error ? error.message : '未知錯誤'}`
      );
    }
  }

  public async analyzeBlogContent(content: string): Promise<{
    contentType: string;
    complexity: 'simple' | 'medium' | 'complex';
    recommendedModel: PerplexityModel;
    estimatedCost: number;
  }> {
    // 簡單的內容分析邏輯
    const wordCount = content.split(/\s+/).length;
    const hasComplexTerms = /技術|分析|研究|深度|專業|複雜/.test(content);
    
    let complexity: 'simple' | 'medium' | 'complex';
    let recommendedModel: PerplexityModel;
    
    if (wordCount < 200 && !hasComplexTerms) {
      complexity = 'simple';
      recommendedModel = PERPLEXITY_MODELS.SONAR;
    } else if (wordCount < 500 || hasComplexTerms) {
      complexity = 'medium';
      recommendedModel = PERPLEXITY_MODELS.SONAR_PRO;
    } else {
      complexity = 'complex';
      recommendedModel = PERPLEXITY_MODELS.SONAR_REASONING;
    }

    // 估算成本
    const estimatedTokens = wordCount * 1.3; // 估算 token 數量
    const estimatedCost = calculatePerplexityCost(
      estimatedTokens,
      estimatedTokens * 0.6,
      3,
      recommendedModel
    ).totalCost;

    return {
      contentType: hasComplexTerms ? '技術/專業內容' : '一般內容',
      complexity,
      recommendedModel,
      estimatedCost,
    };
  }

  /**
   * 從文字中提取關鍵字
   */
  private extractKeywords(text: string): string[] {
    // 簡單的關鍵字提取邏輯
    const words = text.toLowerCase()
      .replace(/[^\u4e00-\u9fa5a-zA-Z\s]/g, '') // 保留中文、英文和空格
      .split(/\s+/)
      .filter(word => word.length > 1);

    // 移除常見停用詞
    const stopWords = ['的', '和', '或', '但', '在', '是', '有', '以', '為', '與', 'the', 'and', 'or', 'but', 'in', 'is', 'with'];
    const keywords = words.filter(word => !stopWords.includes(word));

    // 回傳前 10 個關鍵字
    return [...new Set(keywords)].slice(0, 10);
  }

  /**
   * 產生 Markdown 格式的匯出資料
   */
  private generateMarkdown(parsedContent: any, citations: PerplexityCitation[]): string {
    let markdown = `# 提示詞最佳化結果\n\n`;
    
    markdown += `## 原始提示詞\n${parsedContent.originalPrompt}\n\n`;
    markdown += `## 最佳化後提示詞\n${parsedContent.optimizedPrompt}\n\n`;
    
    if (parsedContent.reasoning) {
      markdown += `## 最佳化理由\n${parsedContent.reasoning}\n\n`;
    }

    if (parsedContent.improvements && parsedContent.improvements.length > 0) {
      markdown += `## 改善點\n`;
      parsedContent.improvements.forEach((improvement: string, index: number) => {
        markdown += `${index + 1}. ${improvement}\n`;
      });
      markdown += '\n';
    }

    if (citations && citations.length > 0) {
      markdown += `## 參考來源\n`;
      citations.forEach((citation, index) => {
        markdown += `${index + 1}. [${citation.title}](${citation.url})\n`;
      });
      markdown += '\n';
    }

    markdown += `\n---\n生成時間: ${new Date().toLocaleString('zh-TW')}\n`;
    markdown += `服務提供: Perplexity AI\n`;

    return markdown;
  }
}

/**
 * Perplexity 最佳化服務實例
 */
export const perplexityOptimizationService = new PerplexityOptimizer();
