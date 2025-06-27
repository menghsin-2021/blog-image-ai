import { useState, useEffect, useCallback } from 'react';
import { GeneratedImage } from '../types';
import { STORAGE_KEYS, FILE_LIMITS } from '../utils/constants';
import { storage } from '../utils/helpers';

/**
 * 歷史記錄 Hook
 */
export const useImageHistory = () => {
  const [history, setHistory] = useState<GeneratedImage[]>([]);

  // 載入歷史記錄
  useEffect(() => {
    const savedHistory = storage.get<GeneratedImage[]>(STORAGE_KEYS.IMAGE_HISTORY, []);
    setHistory(savedHistory);
  }, []);

  // 新增到歷史記錄
  const addToHistory = useCallback(
    (item: Omit<GeneratedImage, 'id' | 'createdAt' | 'downloadCount'>) => {
      const newItem: GeneratedImage = {
        ...item,
        id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        downloadCount: 0,
      };

      setHistory(prev => {
        const updated = [newItem, ...prev].slice(0, FILE_LIMITS.MAX_HISTORY_ITEMS);
        storage.set(STORAGE_KEYS.IMAGE_HISTORY, updated);
        return updated;
      });

      return newItem.id;
    },
    []
  );

  // 更新下載計數
  const incrementDownloadCount = useCallback((id: string) => {
    setHistory(prev => {
      const updated = prev.map(item =>
        item.id === id ? { ...item, downloadCount: item.downloadCount + 1 } : item
      );
      storage.set(STORAGE_KEYS.IMAGE_HISTORY, updated);
      return updated;
    });
  }, []);

  // 刪除歷史記錄項目
  const removeFromHistory = useCallback((id: string) => {
    setHistory(prev => {
      const updated = prev.filter(item => item.id !== id);
      storage.set(STORAGE_KEYS.IMAGE_HISTORY, updated);
      return updated;
    });
  }, []);

  // 清空歷史記錄
  const clearHistory = useCallback(() => {
    setHistory([]);
    storage.remove(STORAGE_KEYS.IMAGE_HISTORY);
  }, []);

  return {
    history,
    addToHistory,
    incrementDownloadCount,
    removeFromHistory,
    clearHistory,
    totalImages: history.length,
  };
};
