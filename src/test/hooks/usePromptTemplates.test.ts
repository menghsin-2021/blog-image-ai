import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePromptTemplates } from '../../hooks/usePromptTemplates';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

describe('usePromptTemplates', () => {
  beforeEach(() => {
    // 清除所有 mock
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  it('應該初始化時載入內建模板', async () => {
    const { result } = renderHook(() => usePromptTemplates());

    // 等待載入完成
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.templates.length).toBeGreaterThan(0);
    expect(result.current.templates.some(t => t.isBuiltIn)).toBe(true);
  });

  it('應該支援按分類篩選模板', async () => {
    const { result } = renderHook(() => usePromptTemplates());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const blogHeaderTemplates = result.current.getTemplatesByCategory('blog-header');
    expect(blogHeaderTemplates.every(t => t.category === 'blog-header')).toBe(true);
  });

  it('應該支援搜索模板', async () => {
    const { result } = renderHook(() => usePromptTemplates());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const searchResults = result.current.searchTemplates('技術');
    expect(searchResults.length).toBeGreaterThan(0);
    expect(
      searchResults.some(t => 
        t.name.includes('技術') || 
        t.description.includes('技術') ||
        t.tags.includes('技術')
      )
    ).toBe(true);
  });

  it('應該支援使用模板生成提示詞', async () => {
    const { result } = renderHook(() => usePromptTemplates());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const template = result.current.templates[0];
    if (template) {
      const variables: Record<string, string> = {};
      template.variables.forEach(variable => {
        variables[variable.name] = variable.defaultValue || '測試值';
      });

      let generatedPrompt: string;
      act(() => {
        generatedPrompt = result.current.useTemplate(template.id, variables);
      });

      expect(generatedPrompt!).toBeTruthy();
      expect(result.current.recentUsage.length).toBeGreaterThan(0);
    }
  });

  it('應該支援收藏管理', async () => {
    const { result } = renderHook(() => usePromptTemplates());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const templateId = result.current.templates[0]?.id;
    if (templateId) {
      // 加入收藏
      act(() => {
        result.current.addToFavorites(templateId);
      });

      expect(result.current.isFavorite(templateId)).toBe(true);
      expect(result.current.favorites).toContain(templateId);

      // 移除收藏
      act(() => {
        result.current.removeFromFavorites(templateId);
      });

      expect(result.current.isFavorite(templateId)).toBe(false);
      expect(result.current.favorites).not.toContain(templateId);
    }
  });

  it('應該支援建立自訂模板', async () => {
    const { result } = renderHook(() => usePromptTemplates());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const newTemplate = {
      name: '測試模板',
      description: '這是一個測試模板',
      category: 'custom' as const,
      template: '這是 {{testVariable}} 的模板',
      variables: [{
        name: 'testVariable',
        description: '測試變數',
        type: 'text' as const,
        required: true
      }],
      tags: ['測試'],
      isBuiltIn: false,
      isPublic: true
    };

    const initialCount = result.current.templates.length;

    act(() => {
      result.current.createTemplate(newTemplate);
    });

    expect(result.current.templates.length).toBe(initialCount + 1);
    expect(result.current.templates.some(t => t.name === '測試模板')).toBe(true);
  });

  it('應該處理載入和儲存錯誤', async () => {
    // 模擬 localStorage 錯誤
    mockLocalStorage.getItem.mockImplementation(() => {
      throw new Error('Storage error');
    });

    const { result } = renderHook(() => usePromptTemplates());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.error).toBeTruthy();
  });
});
