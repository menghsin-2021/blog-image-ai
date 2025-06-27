// 內容分析服務
import { ContentInput, ContentAnalysis } from '../types/promptOptimizer';

/**
 * 停用詞列表 - 用於過濾無意義的詞彙
 */
const STOP_WORDS = new Set([
  // 中文停用詞
  '的',
  '了',
  '在',
  '是',
  '我',
  '有',
  '和',
  '就',
  '不',
  '人',
  '都',
  '一',
  '一個',
  '上',
  '也',
  '很',
  '到',
  '說',
  '要',
  '去',
  '你',
  '會',
  '著',
  '沒有',
  '看',
  '好',
  '自己',
  '這',
  // 英文停用詞
  'the',
  'be',
  'to',
  'of',
  'and',
  'a',
  'in',
  'that',
  'have',
  'i',
  'it',
  'for',
  'not',
  'on',
  'with',
  'he',
  'as',
  'you',
  'do',
  'at',
  'this',
  'but',
  'his',
  'by',
  'from',
]);

/**
 * 技術關鍵詞字典 - 用於識別技術內容
 */
const TECH_KEYWORDS = new Set([
  // 程式設計
  'javascript',
  'python',
  'react',
  'vue',
  'angular',
  'node',
  'typescript',
  'html',
  'css',
  'api',
  'database',
  'sql',
  'mongodb',
  'mysql',
  // 雲端和架構
  'aws',
  'azure',
  'docker',
  'kubernetes',
  'microservices',
  'serverless',
  'cloud',
  'devops',
  'ci/cd',
  'github',
  'git',
  // AI 和機器學習
  'ai',
  'machine learning',
  'deep learning',
  'neural network',
  'tensorflow',
  'pytorch',
  'nlp',
  'computer vision',
  // 中文技術詞彙
  '人工智慧',
  '機器學習',
  '深度學習',
  '神經網路',
  '雲端',
  '容器',
  '微服務',
  '資料庫',
  '前端',
  '後端',
  '全端',
  '框架',
  '演算法',
  '程式碼',
  '開發',
]);

/**
 * 主題分類字典
 */
const TOPIC_KEYWORDS = {
  technical: [
    '程式',
    '開發',
    '技術',
    'code',
    'programming',
    'development',
    'software',
    'system',
    'architecture',
  ],
  tutorial: [
    '教學',
    '指南',
    '步驟',
    '如何',
    'tutorial',
    'guide',
    'how to',
    'step by step',
    'learn',
  ],
  review: ['評測', '比較', '分析', '優缺點', 'review', 'comparison', 'analysis', 'pros and cons'],
  news: ['新聞', '發布', '更新', '趨勢', 'news', 'release', 'update', 'trend', 'announcement'],
};

/**
 * 文字預處理 - 分詞和清理
 */
function preprocessText(text: string): string[] {
  // 移除標點符號並轉為小寫
  const cleaned = text.toLowerCase().replace(/[^\w\s\u4e00-\u9fff]/g, ' ');

  // 簡單分詞 (支援中英文)
  const words = cleaned.split(/\s+/).filter(word => word.length > 1 && !STOP_WORDS.has(word));

  return words;
}

/**
 * TF-IDF 關鍵字提取
 */
function extractKeywordsTFIDF(words: string[], maxKeywords: number = 10): string[] {
  // 計算詞頻 (TF)
  const termFreq = new Map<string, number>();
  words.forEach(word => {
    termFreq.set(word, (termFreq.get(word) || 0) + 1);
  });

  // 簡化的 IDF 計算 (假設文檔集合)
  const keywords = Array.from(termFreq.entries())
    .map(([term, freq]) => ({
      term,
      score: freq * (TECH_KEYWORDS.has(term) ? 2 : 1), // 技術詞彙加權
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, maxKeywords)
    .map(item => item.term);

  return keywords;
}

/**
 * 主題識別
 */
function identifyTopic(words: string[]): string {
  const topicScores = Object.entries(TOPIC_KEYWORDS).map(([topic, keywords]) => {
    const score = keywords.reduce((sum, keyword) => {
      return sum + words.filter(word => word.includes(keyword) || keyword.includes(word)).length;
    }, 0);
    return { topic, score };
  });

  const bestTopic = topicScores.sort((a, b) => b.score - a.score)[0];
  return bestTopic.score > 0 ? bestTopic.topic : 'general';
}

/**
 * 情感分析 (簡化版)
 */
function analyzeSentiment(text: string): 'positive' | 'neutral' | 'professional' {
  const positiveWords = [
    '好',
    '棒',
    '優秀',
    '推薦',
    '喜歡',
    'good',
    'great',
    'excellent',
    'recommend',
    'amazing',
  ];
  const professionalWords = [
    '分析',
    '研究',
    '探討',
    '實作',
    '架構',
    'analysis',
    'research',
    'implementation',
    'architecture',
  ];

  const lowerText = text.toLowerCase();

  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
  const professionalCount = professionalWords.filter(word => lowerText.includes(word)).length;

  if (professionalCount > positiveCount) return 'professional';
  if (positiveCount > 0) return 'positive';
  return 'neutral';
}

/**
 * 內容複雜度分析
 */
function analyzeComplexity(
  words: string[],
  techTerms: string[]
): 'simple' | 'moderate' | 'complex' {
  const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
  const techRatio = techTerms.length / words.length;

  if (techRatio > 0.1 || avgWordLength > 6) return 'complex';
  if (techRatio > 0.05 || avgWordLength > 4) return 'moderate';
  return 'simple';
}

/**
 * 主要的內容分析函式
 */
export async function analyzeContent(content: ContentInput): Promise<ContentAnalysis> {
  const fullText = `${content.title || ''} ${content.content}`;
  const words = preprocessText(fullText);

  // 提取關鍵字
  const extractedKeywords = extractKeywordsTFIDF(words);

  // 合併用戶提供的關鍵字
  const allKeywords = [...extractedKeywords, ...(content.keywords || [])].filter(
    (keyword, index, arr) => arr.indexOf(keyword) === index
  ); // 去重

  // 識別技術術語
  const technicalTerms = words.filter(word => TECH_KEYWORDS.has(word));

  // 分析各個維度
  const topic = identifyTopic(words);
  const sentiment = analyzeSentiment(fullText);
  const complexity = analyzeComplexity(words, technicalTerms);

  return {
    keywords: allKeywords.slice(0, 15), // 限制關鍵字數量
    topic,
    sentiment,
    complexity,
    technicalTerms: [...new Set(technicalTerms)].slice(0, 10), // 去重並限制數量
  };
}

/**
 * 驗證內容輸入
 */
export function validateContentInput(content: ContentInput): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!content.title?.trim()) {
    errors.push('請提供文章標題');
  }

  if (!content.content?.trim()) {
    errors.push('請提供文章內容');
  } else if (content.content.trim().length < 50) {
    errors.push('文章內容至少需要 50 個字元');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
