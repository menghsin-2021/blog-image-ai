import { useCallback } from 'react';
import { useCache } from './useCache';
import { ContentInput, OptimizedPrompt, ImagePurposeType } from '../types/promptOptimizer';
import { gpt4oOptimizationService } from '../services/gpt4oOptimizer';

// 快取鍵生成函式
const generateCacheKey = (content: ContentInput, purpose: ImagePurposeType): string => {
  const keyData = {
    title: content.title?.trim(),
    content: content.content?.trim(),
    keywords: content.keywords?.sort().join(','),
    targetAudience: content.targetAudience?.trim(),
    purpose
  };
  
  return btoa(JSON.stringify(keyData));
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
