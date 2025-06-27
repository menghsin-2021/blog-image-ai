// 提示詞最佳化服務
import { 
  ImagePurposeType, 
  ContentInput, 
  ContentAnalysis, 
  OptimizedPrompt, 
  PromptTemplate 
} from '../types/promptOptimizer';
import { analyzeContent } from './contentAnalyzer';

/**
 * 風格指引庫
 */
const STYLE_GUIDES = {
  blog: {
    banner: ['modern', 'clean', 'professional', 'eye-catching', 'minimalist', 'vibrant'],
    illustration: ['simple', 'clear', 'educational', 'minimalist', 'flat design', 'icon-style'],
    summary: ['conceptual', 'inspiring', 'conclusive', 'memorable', 'artistic', 'symbolic']
  },
  technical: {
    common: ['flat design', 'vector style', 'clean lines', 'blue and grey tones', 'professional'],
    banner: ['futuristic', 'high-tech', 'digital', 'network patterns'],
    illustration: ['diagram style', 'flowchart', 'schematic', 'technical drawing'],
    summary: ['abstract tech', 'data visualization', 'geometric patterns']
  },
  educational: {
    common: ['friendly', 'approachable', 'clear', 'step-by-step visual'],
    banner: ['welcoming', 'bright colors', 'engaging'],
    illustration: ['instructional', 'guide-style', 'tutorial format'],
    summary: ['achievement', 'completion', 'success indicators']
  }
};

/**
 * 提示詞模板庫
 */
const PROMPT_TEMPLATES: Record<ImagePurposeType, PromptTemplate[]> = {
  banner: [
    {
      id: 'tech-banner-1',
      name: '技術概念橫幅',
      purpose: 'banner',
      template: 'A modern, professional banner image representing {MAIN_CONCEPT}, featuring {VISUAL_ELEMENTS}, {STYLE_MODIFIERS}, suitable for a tech blog header',
      placeholders: ['MAIN_CONCEPT', 'VISUAL_ELEMENTS', 'STYLE_MODIFIERS'],
      styleModifiers: ['modern', 'professional', 'clean design', 'high contrast']
    },
    {
      id: 'general-banner-1',
      name: '一般主題橫幅',
      purpose: 'banner',
      template: 'An eye-catching banner image about {TOPIC}, {STYLE_MODIFIERS}, perfect for blog header, {VISUAL_ELEMENTS}',
      placeholders: ['TOPIC', 'STYLE_MODIFIERS', 'VISUAL_ELEMENTS'],
      styleModifiers: ['eye-catching', 'professional', 'modern design']
    }
  ],
  illustration: [
    {
      id: 'tech-illustration-1',
      name: '技術說明圖',
      purpose: 'illustration',
      template: 'A simple, clear illustration explaining {CONCEPT}, {STYLE_MODIFIERS}, educational diagram style, {VISUAL_ELEMENTS}',
      placeholders: ['CONCEPT', 'STYLE_MODIFIERS', 'VISUAL_ELEMENTS'],
      styleModifiers: ['simple', 'clear', 'educational', 'diagram style']
    },
    {
      id: 'process-illustration-1',
      name: '流程說明圖',
      purpose: 'illustration',
      template: 'A step-by-step visual guide showing {PROCESS}, {STYLE_MODIFIERS}, flowchart style, {VISUAL_ELEMENTS}',
      placeholders: ['PROCESS', 'STYLE_MODIFIERS', 'VISUAL_ELEMENTS'],
      styleModifiers: ['step-by-step', 'flowchart', 'clear structure']
    }
  ],
  summary: [
    {
      id: 'concept-summary-1',
      name: '概念總結圖',
      purpose: 'summary',
      template: 'A conceptual image summarizing {MAIN_THEME}, {STYLE_MODIFIERS}, symbolic representation, {VISUAL_ELEMENTS}',
      placeholders: ['MAIN_THEME', 'STYLE_MODIFIERS', 'VISUAL_ELEMENTS'],
      styleModifiers: ['conceptual', 'symbolic', 'inspiring', 'memorable']
    },
    {
      id: 'conclusion-summary-1',
      name: '結論總結圖',
      purpose: 'summary',
      template: 'An inspiring image representing the conclusion of {TOPIC}, {STYLE_MODIFIERS}, thought-provoking visual, {VISUAL_ELEMENTS}',
      placeholders: ['TOPIC', 'STYLE_MODIFIERS', 'VISUAL_ELEMENTS'],
      styleModifiers: ['inspiring', 'thought-provoking', 'conclusive']
    }
  ]
};

/**
 * 根據主題選擇視覺元素
 */
function selectVisualElements(analysis: ContentAnalysis, purpose: ImagePurposeType): string[] {
  const elements: string[] = [];
  
  // 根據技術術語添加相關視覺元素
  if (analysis.technicalTerms.length > 0) {
    if (analysis.technicalTerms.some(term => ['ai', '人工智慧', 'machine learning'].includes(term))) {
      elements.push('neural network patterns', 'brain-like structures', 'data nodes');
    }
    if (analysis.technicalTerms.some(term => ['cloud', '雲端', 'aws', 'azure'].includes(term))) {
      elements.push('cloud icons', 'server networks', 'data flow');
    }
    if (analysis.technicalTerms.some(term => ['javascript', 'python', 'code', '程式碼'].includes(term))) {
      elements.push('code snippets', 'programming symbols', 'terminal windows');
    }
  }
  
  // 根據用途添加特定元素
  switch (purpose) {
    case 'banner':
      elements.push('professional typography', 'geometric shapes', 'gradient backgrounds');
      break;
    case 'illustration':
      elements.push('clean icons', 'simple diagrams', 'clear visual hierarchy');
      break;
    case 'summary':
      elements.push('symbolic representations', 'abstract concepts', 'meaningful metaphors');
      break;
  }
  
  // 根據複雜度調整
  if (analysis.complexity === 'simple') {
    elements.push('minimal design', 'single focal point');
  } else if (analysis.complexity === 'complex') {
    elements.push('detailed illustrations', 'multiple components');
  }
  
  return elements.slice(0, 3); // 限制元素數量
}

/**
 * 選擇風格修飾詞
 */
function selectStyleModifiers(analysis: ContentAnalysis, purpose: ImagePurposeType): string[] {
  const modifiers: string[] = [];
  
  // 基礎風格
  modifiers.push(...STYLE_GUIDES.blog[purpose]);
  
  // 根據主題添加特定風格
  if (analysis.topic === 'technical') {
    modifiers.push(...STYLE_GUIDES.technical[purpose] || STYLE_GUIDES.technical.common);
  } else if (analysis.topic === 'tutorial') {
    modifiers.push(...STYLE_GUIDES.educational[purpose] || STYLE_GUIDES.educational.common);
  }
  
  // 根據情感調整風格
  if (analysis.sentiment === 'positive') {
    modifiers.push('vibrant colors', 'energetic', 'optimistic tone');
  } else if (analysis.sentiment === 'professional') {
    modifiers.push('corporate style', 'business professional', 'sophisticated');
  }
  
  // 去重並限制數量
  return [...new Set(modifiers)].slice(0, 5);
}

/**
 * 選擇最佳模板
 */
function selectBestTemplate(purpose: ImagePurposeType, analysis: ContentAnalysis): PromptTemplate {
  const templates = PROMPT_TEMPLATES[purpose];
  
  // 根據內容特性選擇模板
  if (analysis.topic === 'technical' && templates.find(t => t.id.includes('tech'))) {
    return templates.find(t => t.id.includes('tech'))!;
  }
  
  if (analysis.topic === 'tutorial' && templates.find(t => t.id.includes('process'))) {
    return templates.find(t => t.id.includes('process'))!;
  }
  
  // 預設選擇第一個模板
  return templates[0];
}

/**
 * 建構最佳化提示詞
 */
function buildOptimizedPrompt(
  content: ContentInput,
  analysis: ContentAnalysis,
  purpose: ImagePurposeType
): { chinese: string; english: string } {
  const template = selectBestTemplate(purpose, analysis);
  const visualElements = selectVisualElements(analysis, purpose);
  const styleModifiers = selectStyleModifiers(analysis, purpose);
  
  // 替換模板中的占位符
  let englishPrompt = template.template;
  
  // 主要概念/主題
  const mainConcept = content.title || analysis.keywords[0] || 'blog content';
  englishPrompt = englishPrompt.replace(/\{MAIN_CONCEPT\}/g, mainConcept);
  englishPrompt = englishPrompt.replace(/\{TOPIC\}/g, mainConcept);
  englishPrompt = englishPrompt.replace(/\{MAIN_THEME\}/g, mainConcept);
  englishPrompt = englishPrompt.replace(/\{CONCEPT\}/g, mainConcept);
  englishPrompt = englishPrompt.replace(/\{PROCESS\}/g, mainConcept);
  
  // 視覺元素
  const visualElementsText = visualElements.join(', ');
  englishPrompt = englishPrompt.replace(/\{VISUAL_ELEMENTS\}/g, visualElementsText);
  
  // 風格修飾詞
  const styleModifiersText = styleModifiers.join(', ');
  englishPrompt = englishPrompt.replace(/\{STYLE_MODIFIERS\}/g, styleModifiersText);
  
  // 添加通用的品質指引
  englishPrompt += ', high quality, professional photography, clean composition, suitable for blog use';
  
  // 建立中文版本（簡化版）
  const chinesePrompt = `為「${mainConcept}」主題建立專業部落格插圖，風格：${styleModifiersText}，高品質專業攝影效果，乾淨構圖，適合部落格使用`;
  
  return {
    chinese: chinesePrompt,
    english: englishPrompt
  };
}

/**
 * 生成最佳化建議
 */
function generateSuggestions(
  analysis: ContentAnalysis,
  purpose: ImagePurposeType
): string[] {
  const suggestions: string[] = [];
  
  // 基於內容分析的建議
  if (analysis.technicalTerms.length > 0) {
    suggestions.push('已加入技術相關的視覺元素，使圖片更符合技術主題');
  }
  
  if (analysis.complexity === 'complex') {
    suggestions.push('根據內容複雜度，建議使用較詳細的視覺表現方式');
  } else if (analysis.complexity === 'simple') {
    suggestions.push('採用簡潔設計風格，避免過度複雜的視覺元素');
  }
  
  // 基於用途的建議
  switch (purpose) {
    case 'banner':
      suggestions.push('最佳化為橫幅格式，增強視覺衝擊力和專業感');
      break;
    case 'illustration':
      suggestions.push('調整為說明圖風格，強調清晰易懂的視覺表達');
      break;
    case 'summary':
      suggestions.push('採用概念性設計，營造總結和啟發的視覺效果');
      break;
  }
  
  // 風格最佳化建議
  suggestions.push('加入專業的色彩搭配和構圖指引');
  suggestions.push('優化了關鍵字密度，提高 AI 理解準確度');
  
  return suggestions;
}

/**
 * 計算最佳化信心度
 */
function calculateConfidence(
  content: ContentInput,
  analysis: ContentAnalysis
): number {
  let confidence = 0.5; // 基礎信心度
  
  // 內容品質加分
  if (content.title && content.title.trim().length > 5) confidence += 0.1;
  if (content.content.length > 100) confidence += 0.1;
  if (analysis.keywords.length > 3) confidence += 0.1;
  
  // 技術內容加分
  if (analysis.technicalTerms.length > 0) confidence += 0.1;
  if (analysis.topic !== 'general') confidence += 0.1;
  
  // 用戶提供的額外資訊加分
  if (content.keywords && content.keywords.length > 0) confidence += 0.05;
  if (content.targetAudience) confidence += 0.05;
  
  return Math.min(confidence, 1.0); // 限制在 1.0 以內
}

/**
 * 推薦技術參數
 */
function recommendTechnicalParams(purpose: ImagePurposeType): {
  aspectRatio: string;
  quality: string;
  style?: string;
} {
  const params = {
    banner: { aspectRatio: '16:9', quality: 'high', style: 'natural' },
    illustration: { aspectRatio: '1:1', quality: 'high', style: 'natural' },
    summary: { aspectRatio: '4:5', quality: 'high', style: 'natural' }
  };
  
  return params[purpose];
}

/**
 * 生成 Markdown 格式的匯出資料
 */
function generateMarkdownExport(
  optimizedPrompt: { chinese: string; english: string },
  suggestions: string[],
  technicalParams: { aspectRatio: string; quality: string; style?: string }
): string {
  const sections = [
    '# 提示詞最佳化結果',
    '',
    '## 最佳化提示詞',
    '',
    '### 中文版本',
    optimizedPrompt.chinese,
    '',
    '### 英文版本',
    optimizedPrompt.english,
    '',
    '## 最佳化建議',
    ...suggestions.map(suggestion => `- ${suggestion}`),
    '',
    '## 技術參數建議',
    `- 比例: ${technicalParams.aspectRatio}`,
    `- 品質: ${technicalParams.quality}`,
    ...(technicalParams.style ? [`- 風格: ${technicalParams.style}`] : []),
    '',
    '---',
    `*建立時間: ${new Date().toLocaleString('zh-TW')}*`
  ];
  
  return sections.join('\n');
}

/**
 * 主要的提示詞最佳化函式
 */
export async function optimizePrompt(
  content: ContentInput,
  purpose: ImagePurposeType,
  originalPrompt?: string
): Promise<OptimizedPrompt> {
  // 分析內容
  const analysis = await analyzeContent(content);
  
  // 建構最佳化提示詞
  const optimizedPrompt = buildOptimizedPrompt(content, analysis, purpose);
  
  // 生成建議
  const suggestions = generateSuggestions(analysis, purpose);
  
  // 計算信心度
  const confidence = calculateConfidence(content, analysis);
  
  // 選擇風格修飾詞
  const styleModifiers = selectStyleModifiers(analysis, purpose);
  
  // 推薦技術參數
  const technicalParams = recommendTechnicalParams(purpose);
  
  return {
    original: originalPrompt || content.content.slice(0, 100) + '...',
    optimized: optimizedPrompt,
    suggestions,
    styleModifiers,
    technicalParams,
    confidence,
    analysis: {
      keywords: analysis.keywords,
      topic: analysis.topic,
      sentiment: analysis.sentiment,
      complexity: analysis.complexity
    },
    exportData: {
      markdown: generateMarkdownExport(optimizedPrompt, suggestions, technicalParams),
      timestamp: new Date().toISOString(),
      purpose
    }
  };
}

/**
 * 批次最佳化多個用途
 */
export async function optimizeForAllPurposes(
  content: ContentInput
): Promise<Record<ImagePurposeType, OptimizedPrompt>> {
  const purposes: ImagePurposeType[] = ['banner', 'illustration', 'summary'];
  
  const results = await Promise.all(
    purposes.map(purpose => optimizePrompt(content, purpose))
  );
  
  return {
    banner: results[0],
    illustration: results[1],
    summary: results[2]
  };
}
