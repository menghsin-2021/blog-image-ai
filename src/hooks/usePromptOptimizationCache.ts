import { useCallback } from 'react';
import { useCache } from './useCache';
import { ContentInput, OptimizedPrompt, ImagePurposeType } from '../types/promptOptimizer';
import { gpt4oOptimizationService } from '../services/gpt4oOptimizer';

// 快取鍵生成函式 - 支援 UTF-8 編碼
const generateCacheKey = (content: ContentInput, purpose: ImagePurposeType): string => {
  // 安全檢查輸入參數
  if (!content || !purpose) {
    console.warn('generateCacheKey: 缺少必要參數', { content: !!content, purpose: !!purpose });
    return `cache_fallback_${Date.now()}_${Math.random().toString(36)}`;
  }

  const keyData = {
    title: content.title?.trim() || '',
    content: content.content?.trim() || '',
    keywords: content.keywords?.sort().join(',') || '',
    targetAudience: content.targetAudience?.trim() || '',
    purpose: purpose || 'unknown'
  };
  
  // 使用 encodeURIComponent 替代 btoa 來支援中文字符
  const jsonString = JSON.stringify(keyData);
  
  // 建立簡單的 hash 來縮短鍵長度
  let hash = 0;
  for (let i = 0; i < jsonString.length; i++) {
    const char = jsonString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 轉換為 32-bit 整數
  }
  
  // 結合 hash 和編碼後的字串前綴來確保唯一性
  const prefix = encodeURIComponent(jsonString.slice(0, 50));
  return `cache_${Math.abs(hash).toString(36)}_${prefix}`;
};

/**
 * 提示詞最佳化快取 Hook
 * 整合 GPT-4o API 與智慧快取機制
 */
export const usePromptOptimizationCache = () => {
  // 設定快取：最多 50 個項目，預設 10 分鐘過期
  const cache = useCache<OptimizedPrompt>({
    maxSize: 50,
    defaultTTL: 10 * 60 * 1000 // 10 minutes
  });

  // 快取的提示詞最佳化
  const optimizePromptWithCache = useCallback(async (
    content: ContentInput,
    purpose: ImagePurposeType,
    forceFresh: boolean = false
  ): Promise<OptimizedPrompt> => {
    // 輸入驗證
    if (!content) {
      throw new Error('optimizePromptWithCache: content 參數為必填');
    }
    if (!content.content || content.content.trim().length === 0) {
      throw new Error('optimizePromptWithCache: content.content 不能為空');
    }
    if (!purpose) {
      throw new Error('optimizePromptWithCache: purpose 參數為必填');
    }

    // 生成快取鍵
    const cacheKey = generateCacheKey(content, purpose);
    
    // 檢查快取（除非強制重新整理）
    if (!forceFresh) {
      const cachedResult = cache.get(cacheKey);
      if (cachedResult) {
        console.log('快取命中:', cacheKey);
        return cachedResult;
      }
    }
    
    try {
      console.log('呼叫 GPT-4o API:', cacheKey);
      
      // 呼叫實際 API
      const result = await gpt4oOptimizationService.optimizePrompt(content, purpose);
      
      // 驗證 API 回應結構
      if (!result || !result.optimized || !result.optimized.chinese || !result.optimized.english) {
        console.error('API 回應結構不完整:', result);
        throw new Error('API 回應結構不完整');
      }
      
      // 儲存到快取
      cache.set(cacheKey, result);
      
      return result;
    } catch (error) {
      console.error('提示詞最佳化失敗:', error);
      
      // 如果有舊的快取，嘗試使用它
      const fallbackResult = cache.get(cacheKey);
      if (fallbackResult) {
        console.log('使用快取作為 fallback:', cacheKey);
        return fallbackResult;
      }
      
      throw error;
    }
  }, [cache]);

  // 預載入常用組合
  const preloadCommonOptimizations = useCallback(async () => {
    const commonCombinations = [
      { purpose: 'hero-banner' as ImagePurposeType, content: { title: '', content: '', keywords: [] } },
      { purpose: 'section-illustration' as ImagePurposeType, content: { title: '', content: '', keywords: [] } },
      { purpose: 'content-summary' as ImagePurposeType, content: { title: '', content: '', keywords: [] } }
    ];

    for (const combo of commonCombinations) {
      if (!cache.has(generateCacheKey(combo.content, combo.purpose))) {
        try {
          await optimizePromptWithCache(combo.content, combo.purpose);
        } catch {
          // 忽略預載入錯誤
        }
      }
    }
  }, [cache, optimizePromptWithCache]);

  // 清理舊快取
  const cleanupOldCache = useCallback(() => {
    const keys = cache.keys();
    console.log(`清理快取，當前大小: ${keys.length}`);
    
    // 如果快取過大，清理一些舊的項目
    if (keys.length > 40) {
      keys.slice(0, 10).forEach(key => cache.remove(key));
    }
  }, [cache]);

  // 取得快取統計
  const getCacheStats = useCallback(() => {
    return {
      ...cache.stats,
      keys: cache.keys().length,
      efficiency: cache.stats.hitRate > 0.7 ? 'high' : cache.stats.hitRate > 0.4 ? 'medium' : 'low'
    };
  }, [cache]);

  // 清空所有快取
  const clearAllCache = useCallback(() => {
    cache.clear();
    console.log('所有快取已清空');
  }, [cache]);

  // 檢查特定內容是否已快取
  const isCached = useCallback((content: ContentInput, purpose: ImagePurposeType): boolean => {
    const cacheKey = generateCacheKey(content, purpose);
    return cache.has(cacheKey);
  }, [cache]);

  // 手動設定快取（用於測試或預設值）
  const setCachedResult = useCallback((
    content: ContentInput,
    purpose: ImagePurposeType,
    result: OptimizedPrompt
  ) => {
    const cacheKey = generateCacheKey(content, purpose);
    cache.set(cacheKey, result);
  }, [cache]);

  return {
    optimizePromptWithCache,
    preloadCommonOptimizations,
    cleanupOldCache,
    getCacheStats,
    clearAllCache,
    isCached,
    setCachedResult
  };
};
