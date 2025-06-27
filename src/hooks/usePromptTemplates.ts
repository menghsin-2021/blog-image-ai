import { useState, useEffect, useCallback } from 'react';
import {
  PromptTemplate,
  PromptTemplateCategory,
  TemplateUsage,
  UsePromptTemplatesReturn,
} from '../types/promptTemplates';
import {
  BUILTIN_TEMPLATES,
  TEMPLATE_CATEGORIES,
  TEMPLATE_SEARCH_KEYWORDS,
} from '../utils/promptTemplates';

const STORAGE_KEY = 'prompt-templates';

interface StoredTemplateData {
  customTemplates: PromptTemplate[];
  recentUsage: TemplateUsage[];
  favorites: string[];
  lastUpdated: string;
}

export const usePromptTemplates = (): UsePromptTemplatesReturn => {
  const [customTemplates, setCustomTemplates] = useState<PromptTemplate[]>([]);
  const [recentUsage, setRecentUsage] = useState<TemplateUsage[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 組合所有模板（內建 + 自訂）
  const allTemplates = [...BUILTIN_TEMPLATES, ...customTemplates];

  // 從本地儲存載入資料
  const loadFromStorage = useCallback(() => {
    try {
      setIsLoading(true);

      // 載入自訂模板和基本資料
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const data: StoredTemplateData = JSON.parse(storedData);
        setCustomTemplates(data.customTemplates || []);
        setRecentUsage(data.recentUsage || []);
        setFavorites(data.favorites || []);
      }

      setError(null);
    } catch (err) {
      console.error('載入模板資料失敗:', err);
      setError('載入模板資料失敗');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 儲存到本地儲存
  const saveToStorage = useCallback((data: Partial<StoredTemplateData>) => {
    try {
      const currentData = localStorage.getItem(STORAGE_KEY);
      const existingData: StoredTemplateData = currentData
        ? JSON.parse(currentData)
        : {
            customTemplates: [],
            recentUsage: [],
            favorites: [],
            lastUpdated: new Date().toISOString(),
          };

      const updatedData: StoredTemplateData = {
        ...existingData,
        ...data,
        lastUpdated: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    } catch (err) {
      console.error('儲存模板資料失敗:', err);
      setError('儲存模板資料失敗');
    }
  }, []);

  // 初始化載入
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // 取得特定模板
  const getTemplate = useCallback(
    (id: string): PromptTemplate | undefined => {
      return allTemplates.find(template => template.id === id);
    },
    [allTemplates]
  );

  // 依分類取得模板
  const getTemplatesByCategory = useCallback(
    (category: PromptTemplateCategory): PromptTemplate[] => {
      return allTemplates.filter(template => template.category === category);
    },
    [allTemplates]
  );

  // 搜索模板
  const searchTemplates = useCallback(
    (query: string): PromptTemplate[] => {
      if (!query.trim()) return allTemplates;

      const searchQuery = query.toLowerCase();

      return allTemplates.filter(template => {
        // 搜索名稱和描述
        const nameMatch = template.name.toLowerCase().includes(searchQuery);
        const descriptionMatch = template.description.toLowerCase().includes(searchQuery);

        // 搜索標籤
        const tagMatch = template.tags.some(tag => tag.toLowerCase().includes(searchQuery));

        // 搜索關鍵字
        const keywords = TEMPLATE_SEARCH_KEYWORDS[template.id] || [];
        const keywordMatch = keywords.some(keyword => keyword.toLowerCase().includes(searchQuery));

        // 搜索模板內容
        const contentMatch = template.template.toLowerCase().includes(searchQuery);

        return nameMatch || descriptionMatch || tagMatch || keywordMatch || contentMatch;
      });
    },
    [allTemplates]
  );

  // 使用模板
  const useTemplate = useCallback(
    (templateId: string, variables: Record<string, string>): string => {
      const template = getTemplate(templateId);
      if (!template) {
        throw new Error(`模板 ${templateId} 不存在`);
      }

      // 替換模板變數
      let result = template.template;
      template.variables.forEach(variable => {
        const value = variables[variable.name] || variable.defaultValue || '';
        const placeholder = `{{${variable.name}}}`;
        result = result.replace(new RegExp(placeholder, 'g'), value);
      });

      // 記錄使用歷史
      const usage: TemplateUsage = {
        templateId,
        variables,
        timestamp: new Date(),
        result,
      };

      const updatedUsage = [usage, ...recentUsage.slice(0, 19)]; // 保留最近 20 次使用
      setRecentUsage(updatedUsage);
      saveToStorage({ recentUsage: updatedUsage });

      // 更新使用次數
      const updatedTemplates = customTemplates.map(t =>
        t.id === templateId ? { ...t, usageCount: t.usageCount + 1 } : t
      );
      if (updatedTemplates.some(t => t.id === templateId)) {
        setCustomTemplates(updatedTemplates);
        saveToStorage({ customTemplates: updatedTemplates });
      }

      return result;
    },
    [getTemplate, recentUsage, customTemplates, saveToStorage]
  );

  // 收藏管理
  const addToFavorites = useCallback(
    (templateId: string) => {
      if (!favorites.includes(templateId)) {
        const updatedFavorites = [...favorites, templateId];
        setFavorites(updatedFavorites);
        saveToStorage({ favorites: updatedFavorites });
      }
    },
    [favorites, saveToStorage]
  );

  const removeFromFavorites = useCallback(
    (templateId: string) => {
      const updatedFavorites = favorites.filter(id => id !== templateId);
      setFavorites(updatedFavorites);
      saveToStorage({ favorites: updatedFavorites });
    },
    [favorites, saveToStorage]
  );

  const isFavorite = useCallback(
    (templateId: string): boolean => {
      return favorites.includes(templateId);
    },
    [favorites]
  );

  // 自訂模板管理
  const createTemplate = useCallback(
    (templateData: Omit<PromptTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => {
      const newTemplate: PromptTemplate = {
        ...templateData,
        id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedTemplates = [...customTemplates, newTemplate];
      setCustomTemplates(updatedTemplates);
      saveToStorage({ customTemplates: updatedTemplates });
    },
    [customTemplates, saveToStorage]
  );

  const updateTemplate = useCallback(
    (id: string, updates: Partial<PromptTemplate>) => {
      const updatedTemplates = customTemplates.map(template =>
        template.id === id ? { ...template, ...updates, updatedAt: new Date() } : template
      );
      setCustomTemplates(updatedTemplates);
      saveToStorage({ customTemplates: updatedTemplates });
    },
    [customTemplates, saveToStorage]
  );

  const deleteTemplate = useCallback(
    (id: string) => {
      // 只能刪除自訂模板
      if (BUILTIN_TEMPLATES.find(t => t.id === id)) {
        throw new Error('無法刪除內建模板');
      }

      const updatedTemplates = customTemplates.filter(template => template.id !== id);
      setCustomTemplates(updatedTemplates);

      // 同時從收藏中移除
      const updatedFavorites = favorites.filter(fId => fId !== id);
      setFavorites(updatedFavorites);

      saveToStorage({
        customTemplates: updatedTemplates,
        favorites: updatedFavorites,
      });
    },
    [customTemplates, favorites, saveToStorage]
  );

  return {
    templates: allTemplates,
    categories: TEMPLATE_CATEGORIES,
    recentUsage,
    favorites,

    // 模板管理
    getTemplate,
    getTemplatesByCategory,
    searchTemplates,

    // 使用記錄
    useTemplate,
    addToFavorites,
    removeFromFavorites,
    isFavorite,

    // 自訂模板
    createTemplate,
    updateTemplate,
    deleteTemplate,

    // 狀態
    isLoading,
    error,
  };
};
