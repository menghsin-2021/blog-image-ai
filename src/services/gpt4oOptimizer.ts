// GPT-4o 驅動的內容分析和提示詞最佳化服務
import {
  ContentInput,
  ContentAnalysis,
  ImagePurposeType,
  OptimizedPrompt,
  GPT4oRequest,
  GPT4oResponse,
} from '../types/promptOptimizer';

class GPT4oOptimizationService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!this.apiKey) {
      throw new Error(
        'OpenAI API key not found. Please set VITE_OPENAI_API_KEY in your .env file.'
      );
    }
  }

  /**
   * 呼叫 GPT-4o API
   */
  private async callGPT4o(request: GPT4oRequest): Promise<GPT4oResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...request,
          max_tokens: request.max_tokens || 1000,
          temperature: request.temperature || 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `GPT-4o API Error: ${response.status} - ${errorData.error?.message || '未知錯誤'}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error('GPT-4o API 呼叫失敗:', error);
      throw error;
    }
  }

  /**
   * 分析內容並提取關鍵資訊
   */
  async analyzeContent(content: ContentInput): Promise<ContentAnalysis> {
    const systemPrompt = `你是一個專業的內容分析專家。請分析使用者提供的部落格內容，並提取以下資訊：
1. 關鍵字 (5-10個最重要的概念)
2. 主題分類 (技術/教學/產品/概念/其他)
3. 情感語調 (專業/友善/正式/創新/其他)
4. 內容複雜度 (簡單/中等/複雜)

請以 JSON 格式回應，格式如下：
{
  "keywords": ["關鍵字1", "關鍵字2", ...],
  "topic": "主題分類",
  "sentiment": "情感語調",
  "complexity": "複雜度"
}`;

    const userPrompt = `請分析以下部落格內容：

標題: ${content.title}

內容: ${content.content}

${content.keywords?.length ? `使用者指定關鍵字: ${content.keywords.join(', ')}` : ''}

${content.targetAudience ? `目標讀者: ${content.targetAudience}` : ''}`;

    try {
      const response = await this.callGPT4o({
        model: 'gpt-4o-mini', // 使用 mini 版本來控制成本
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 500,
        temperature: 0.3, // 降低隨機性以獲得更一致的結果
      });

      const analysisText = response.choices[0].message.content;

      // 嘗試解析 JSON 回應
      try {
        const analysis = JSON.parse(analysisText);
        return {
          keywords: analysis.keywords || [],
          topic: analysis.topic || '一般',
          sentiment: analysis.sentiment || '專業',
          complexity: analysis.complexity || '中等',
          technicalTerms: this.extractTechnicalTerms(content.content),
        };
      } catch (parseError) {
        console.warn('GPT-4o 回應格式解析失敗，使用備用解析:', parseError);
        return this.fallbackAnalysis(content, analysisText);
      }
    } catch (error) {
      console.error('內容分析失敗:', error);
      throw new Error('內容分析服務暫時無法使用，請稍後再試');
    }
  }

  /**
   * 生成雙語最佳化提示詞
   */
  async generateOptimizedPrompts(
    content: ContentInput,
    purpose: ImagePurposeType,
    analysis: ContentAnalysis
  ): Promise<{ chinese: string; english: string; suggestions: string[] }> {
    const purposeDescriptions = {
      banner: {
        chinese: '首頁橫幅 - 需要吸引眼球、視覺衝擊力強、代表文章主題',
        english: 'Header Banner - eye-catching, visually impactful, representing article theme',
      },
      illustration: {
        chinese: '段落說明圖 - 需要簡單清晰、輔助理解、避免干擾閱讀',
        english: 'Illustration - simple, clear, helps understanding, non-distracting',
      },
      summary: {
        chinese: '內容總結圖 - 需要概念性、啟發性、留下深刻印象',
        english: 'Summary Image - conceptual, inspiring, memorable',
      },
    };

    const systemPrompt = `你是一個專業的 AI 圖片生成提示詞專家。請根據用戶的部落格內容和圖片用途，生成高品質的提示詞。

要求：
1. 生成中文和英文兩個版本的提示詞
2. 針對 ${purposeDescriptions[purpose].chinese} 進行最佳化
3. 提示詞應該簡潔但具體，避免過於複雜
4. 加入適當的風格指引（現代、專業、簡潔等）
5. 考慮部落格圖片的特殊需求（易理解、不干擾閱讀）

請以 JSON 格式回應：
{
  "chinese": "中文提示詞",
  "english": "English prompt",
  "suggestions": ["建議1", "建議2", "建議3"]
}`;

    const userPrompt = `內容分析結果：
- 標題: ${content.title}
- 關鍵字: ${analysis.keywords.join(', ')}
- 主題: ${analysis.topic}
- 語調: ${analysis.sentiment}
- 複雜度: ${analysis.complexity}

圖片用途: ${purposeDescriptions[purpose].chinese}

原始內容摘要: ${content.content.slice(0, 500)}...

請生成針對此用途的最佳化提示詞，確保中英文版本都能產生高品質的部落格配圖。`;

    try {
      const response = await this.callGPT4o({
        model: 'gpt-4o', // 使用完整版本獲得更好的創意
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 800,
        temperature: 0.8, // 提高創意性
      });

      const resultText = response.choices[0]?.message?.content;

      if (!resultText) {
        console.warn('GPT-4o API 回應內容為空，使用降級模式');
        return this.fallbackPromptGeneration(content, purpose, analysis);
      }

      try {
        const result = JSON.parse(resultText);

        // 驗證回應結構的完整性
        if (!result || typeof result !== 'object') {
          console.warn('GPT-4o API 回應格式不正確，使用降級模式');
          return this.fallbackPromptGeneration(content, purpose, analysis);
        }

        return {
          chinese: result.chinese || '生成失敗',
          english: result.english || 'Generation failed',
          suggestions: result.suggestions || ['無可用建議'],
        };
      } catch (parseError) {
        console.warn('提示詞生成回應解析失敗，使用降級模式:', parseError);
        console.warn('原始回應:', resultText);
        return this.fallbackPromptGeneration(content, purpose, analysis);
      }
    } catch (error) {
      console.error('提示詞生成 API 呼叫失敗，使用降級模式:', error);
      return this.fallbackPromptGeneration(content, purpose, analysis);
    }
  }

  /**
   * 生成完整的最佳化結果
   */
  async optimizePrompt(
    content: ContentInput,
    purpose: ImagePurposeType,
    originalPrompt?: string
  ): Promise<OptimizedPrompt> {
    try {
      // 1. 分析內容
      let analysis: ContentAnalysis;
      try {
        analysis = await this.analyzeContent(content);
      } catch (analysisError) {
        console.warn('內容分析失敗，使用預設分析:', analysisError);
        analysis = this.createFallbackAnalysis(content);
      }

      // 2. 生成最佳化提示詞
      let prompts: { chinese: string; english: string; suggestions: string[] };
      try {
        prompts = await this.generateOptimizedPrompts(content, purpose, analysis);
      } catch (promptError) {
        console.warn('提示詞生成失敗，使用降級模式:', promptError);
        prompts = this.fallbackPromptGeneration(content, purpose, analysis);
      }

      // 3. 驗證提示詞結構
      if (!prompts || !prompts.chinese || !prompts.english) {
        console.warn('提示詞結構不完整，重新生成降級版本');
        prompts = this.fallbackPromptGeneration(content, purpose, analysis);
      }

      // 4. 生成技術參數建議
      const technicalParams = this.generateTechnicalParams(purpose, analysis);

      // 5. 計算信心度
      const confidence = this.calculateConfidence(content, analysis);

      // 6. 生成 Markdown 匯出資料
      const exportData = this.generateExportData(
        content,
        purpose,
        prompts,
        analysis,
        technicalParams
      );

      const result: OptimizedPrompt = {
        original: originalPrompt || content.content.slice(0, 100),
        originalPrompt: originalPrompt || content.content.slice(0, 100),
        optimized: {
          chinese: prompts.chinese,
          english: prompts.english,
        },
        optimizedPrompt: prompts.chinese, // 預設使用中文版本
        improvements: prompts.suggestions, // 使用建議作為改善點
        reasoning:
          analysis.complexity === 'complex'
            ? '內容較為複雜，需要更詳細的視覺呈現'
            : '內容清晰，可以直接視覺化',
        suggestedStyle: this.extractStyleModifiers(analysis).join(', '),
        technicalTips: `建議${technicalParams.aspectRatio}比例，${technicalParams.quality}品質`,
        suggestions: prompts.suggestions,
        styleModifiers: this.extractStyleModifiers(analysis),
        technicalParams,
        confidence,
        analysis,
        exportData,
        timestamp: Date.now(),
      };

      // 7. 最終驗證結果結構
      if (!result.optimized?.chinese || !result.optimized?.english) {
        throw new Error('無法生成有效的最佳化結果');
      }

      return result;
    } catch (error) {
      console.error('提示詞最佳化完全失敗，使用完整降級模式:', error);

      // 完整降級模式：確保返回有效結構
      const fallbackAnalysis = this.createFallbackAnalysis(content);
      const fallbackPrompts = this.fallbackPromptGeneration(content, purpose, fallbackAnalysis);
      const fallbackTechnicalParams = this.generateTechnicalParams(purpose, fallbackAnalysis);
      const fallbackExportData = this.generateExportData(
        content,
        purpose,
        fallbackPrompts,
        fallbackAnalysis,
        fallbackTechnicalParams
      );

      return {
        original: originalPrompt || content.content.slice(0, 100),
        originalPrompt: originalPrompt || content.content.slice(0, 100),
        optimized: {
          chinese: fallbackPrompts.chinese,
          english: fallbackPrompts.english,
        },
        optimizedPrompt: fallbackPrompts.chinese,
        improvements: fallbackPrompts.suggestions,
        reasoning: '使用降級模式產生的結果',
        suggestedStyle: '現代, 簡潔, 專業',
        technicalTips: `建議${fallbackTechnicalParams.aspectRatio}比例`,
        suggestions: fallbackPrompts.suggestions,
        styleModifiers: ['現代', '簡潔', '專業'],
        technicalParams: fallbackTechnicalParams,
        confidence: 0.3, // 降級模式的信心度更低
        analysis: fallbackAnalysis,
        exportData: fallbackExportData,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * 提取技術術語
   */
  private extractTechnicalTerms(content: string): string[] {
    const technicalPatterns = [
      /\b(API|SDK|框架|架構|演算法|資料庫|伺服器|雲端|AI|機器學習|深度學習|區塊鏈|IoT|DevOps)\b/gi,
      /\b(React|Vue|Angular|Node\.js|Python|JavaScript|TypeScript|Docker|Kubernetes)\b/gi,
    ];

    const terms = new Set<string>();
    technicalPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => terms.add(match));
      }
    });

    return Array.from(terms);
  }

  /**
   * 建立降級分析結果
   */
  private createFallbackAnalysis(content: ContentInput): ContentAnalysis {
    return {
      keywords: content.keywords || ['技術', '部落格', '內容'],
      topic: '技術文章',
      sentiment: 'professional',
      complexity: 'moderate',
      technicalTerms: this.extractTechnicalTerms(content.content),
    };
  }

  /**
   * 備用內容分析
   */
  private fallbackAnalysis(content: ContentInput, _analysisText: string): ContentAnalysis {
    return {
      keywords: content.keywords || [],
      topic: '技術',
      sentiment: 'professional',
      complexity: 'moderate',
      technicalTerms: this.extractTechnicalTerms(content.content),
    };
  }

  /**
   * 備用提示詞生成
   */
  private fallbackPromptGeneration(
    content: ContentInput,
    purpose: ImagePurposeType,
    analysis: ContentAnalysis
  ): { chinese: string; english: string; suggestions: string[] } {
    const keywords = analysis.keywords.slice(0, 3).join('、');

    const templates = {
      banner: {
        chinese: `關於${content.title}的現代專業橫幅圖片，包含${keywords}相關的視覺元素，簡潔設計，適合技術部落格`,
        english: `Modern professional banner image about ${content.title}, featuring ${keywords} visual elements, clean design, suitable for tech blog`,
      },
      illustration: {
        chinese: `${keywords}的簡單清晰說明圖片，扁平設計風格，圖示化表現，適合輔助文章理解`,
        english: `Simple clear illustration of ${keywords}, flat design style, iconographic representation, suitable for article comprehension`,
      },
      summary: {
        chinese: `${content.title}主題的概念性總結圖片，象徵性設計，啟發性視覺元素`,
        english: `Conceptual summary image of ${content.title} theme, symbolic design, inspiring visual elements`,
      },
    };

    return {
      chinese: templates[purpose].chinese,
      english: templates[purpose].english,
      suggestions: [
        '建議使用現代簡潔的設計風格',
        '避免過多文字和複雜細節',
        '確保圖片與文章主題相關',
      ],
    };
  }

  /**
   * 生成技術參數建議
   */
  private generateTechnicalParams(purpose: ImagePurposeType, _analysis: ContentAnalysis) {
    const parametersByPurpose = {
      banner: { aspectRatio: '16:9', quality: 'high', style: 'natural' },
      illustration: { aspectRatio: '1:1', quality: 'standard', style: 'natural' },
      summary: { aspectRatio: '4:3', quality: 'high', style: 'vivid' },
    };

    return parametersByPurpose[purpose];
  }

  /**
   * 計算最佳化信心度
   */
  private calculateConfidence(content: ContentInput, analysis: ContentAnalysis): number {
    let confidence = 0.7; // 基礎信心度

    // 根據內容品質調整
    if (content.title && content.title.length > 5) confidence += 0.1;
    if (content.content && content.content.length > 100) confidence += 0.1;
    if (analysis.keywords.length > 3) confidence += 0.1;

    return Math.min(confidence, 0.95);
  }

  /**
   * 提取風格修飾詞
   */
  private extractStyleModifiers(analysis: ContentAnalysis): string[] {
    const modifiers = ['現代', '專業', '簡潔'];

    if (analysis.sentiment === 'positive') modifiers.push('創新', '前衛');
    if (analysis.complexity === 'simple') modifiers.push('易懂', '直觀');
    if (analysis.topic === '技術') modifiers.push('科技感', '數位');

    return modifiers;
  }

  /**
   * 生成 Markdown 匯出資料
   */
  private generateExportData(
    content: ContentInput,
    purpose: ImagePurposeType,
    prompts: { chinese: string; english: string; suggestions: string[] },
    analysis: ContentAnalysis,
    technicalParams: any
  ) {
    const timestamp = new Date().toISOString();
    const purposeNames = {
      banner: '首頁橫幅',
      illustration: '段落說明',
      summary: '內容總結',
    };

    const markdown = `# 提示詞最佳化結果

**生成時間**: ${new Date().toLocaleString('zh-TW')}  
**圖片用途**: ${purposeNames[purpose]}  
**原始標題**: ${content.title}

## 內容分析
- **關鍵字**: ${analysis.keywords.join(', ')}
- **主題分類**: ${analysis.topic}
- **語調風格**: ${analysis.sentiment}
- **內容複雜度**: ${analysis.complexity}

## 最佳化提示詞

### 中文版本
\`\`\`
${prompts.chinese}
\`\`\`

### 英文版本
\`\`\`
${prompts.english}
\`\`\`

## 技術參數建議
- **圖片比例**: ${technicalParams.aspectRatio}
- **圖片品質**: ${technicalParams.quality}
- **風格設定**: ${technicalParams.style}

## 最佳化建議
${prompts.suggestions.map(s => `- ${s}`).join('\n')}

---
*由 BlogImageAI 提示詞最佳化助手生成*`;

    return {
      markdown,
      timestamp,
      purpose,
    };
  }
}

export const gpt4oOptimizationService = new GPT4oOptimizationService();
