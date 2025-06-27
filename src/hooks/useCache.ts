import { useState, useCallback, useRef } from 'react';

// 快取項目介面
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

// 快取配置
interface CacheConfig {
  maxSize: number;
  defaultTTL: number; // Time to live in milliseconds
}

// 快取統計
interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
}

/**
 * 記憶體快取 Hook
 * 提供高效的本地快取功能，支援 TTL、LRU 清理策略
 */
export const useCache = <T>(config: CacheConfig = { maxSize: 100, defaultTTL: 5 * 60 * 1000 }) => {
  const cacheRef = useRef<Map<string, CacheItem<T>>>(new Map());
  const accessOrderRef = useRef<string[]>([]);
  const [stats, setStats] = useState<CacheStats>({
    hits: 0,
    misses: 0,
    size: 0,
    hitRate: 0
  });

  // 更新統計資料
  const updateStats = useCallback((hit: boolean) => {
    setStats(prev => {
      const newStats = {
        hits: hit ? prev.hits + 1 : prev.hits,
        misses: hit ? prev.misses : prev.misses + 1,
        size: cacheRef.current.size,
        hitRate: 0
      };
      const total = newStats.hits + newStats.misses;
      newStats.hitRate = total > 0 ? newStats.hits / total : 0;
      return newStats;
    });
  }, []);

  // 清理過期項目
  const cleanExpired = useCallback(() => {
    const now = Date.now();
    const cache = cacheRef.current;
    const accessOrder = accessOrderRef.current;
    
    for (const [key, item] of cache.entries()) {
      if (now > item.expiry) {
        cache.delete(key);
        const index = accessOrder.indexOf(key);
        if (index > -1) {
          accessOrder.splice(index, 1);
        }
      }
    }
  }, []);

  // LRU 清理策略
  const evictLRU = useCallback(() => {
    const cache = cacheRef.current;
    const accessOrder = accessOrderRef.current;
    
    while (cache.size >= config.maxSize && accessOrder.length > 0) {
      const oldestKey = accessOrder.shift();
      if (oldestKey) {
        cache.delete(oldestKey);
      }
    }
  }, [config.maxSize]);

  // 更新存取順序
  const updateAccessOrder = useCallback((key: string) => {
    const accessOrder = accessOrderRef.current;
    const index = accessOrder.indexOf(key);
    
    if (index > -1) {
      accessOrder.splice(index, 1);
    }
    accessOrder.push(key);
  }, []);

  // 取得快取值
  const get = useCallback((key: string): T | null => {
    cleanExpired();
    
    const cache = cacheRef.current;
    const item = cache.get(key);
    
    if (!item) {
      updateStats(false);
      return null;
    }
    
    const now = Date.now();
    if (now > item.expiry) {
      cache.delete(key);
      updateStats(false);
      return null;
    }
    
    updateAccessOrder(key);
    updateStats(true);
    return item.data;
  }, [cleanExpired, updateStats, updateAccessOrder]);

  // 設定快取值
  const set = useCallback((key: string, data: T, ttl: number = config.defaultTTL) => {
    const cache = cacheRef.current;
    const now = Date.now();
    
    evictLRU();
    
    const item: CacheItem<T> = {
      data,
      timestamp: now,
      expiry: now + ttl
    };
    
    cache.set(key, item);
    updateAccessOrder(key);
  }, [config.defaultTTL, evictLRU, updateAccessOrder]);

  // 刪除快取項目
  const remove = useCallback((key: string) => {
    const cache = cacheRef.current;
    const accessOrder = accessOrderRef.current;
    
    cache.delete(key);
    const index = accessOrder.indexOf(key);
    if (index > -1) {
      accessOrder.splice(index, 1);
    }
  }, []);

  // 清空快取
  const clear = useCallback(() => {
    cacheRef.current.clear();
    accessOrderRef.current.length = 0;
    setStats({
      hits: 0,
      misses: 0,
      size: 0,
      hitRate: 0
    });
  }, []);

  // 檢查是否存在
  const has = useCallback((key: string): boolean => {
    cleanExpired();
    const cache = cacheRef.current;
    const item = cache.get(key);
    
    if (!item) return false;
    
    const now = Date.now();
    if (now > item.expiry) {
      cache.delete(key);
      return false;
    }
    
    return true;
  }, [cleanExpired]);

  // 取得所有快取鍵
  const keys = useCallback((): string[] => {
    cleanExpired();
    return Array.from(cacheRef.current.keys());
  }, [cleanExpired]);

  // 取得快取大小
  const size = useCallback((): number => {
    cleanExpired();
    return cacheRef.current.size;
  }, [cleanExpired]);

  return {
    get,
    set,
    remove,
    clear,
    has,
    keys,
    size,
    stats
  };
};
