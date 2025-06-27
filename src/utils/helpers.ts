import { DownloadFormat } from '../types';

/**
 * 產生唯一 ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 格式化檔案名稱
 */
export const formatFileName = (prompt: string, format: DownloadFormat = 'png'): string => {
  // 移除特殊字元，保留中文、英文、數字和空格
  const cleanPrompt = prompt
    .replace(/[^\w\s\u4e00-\u9fff]/gi, '')
    .trim()
    .substring(0, 50);

  const timestamp = new Date().toISOString().slice(0, 10);
  return `blog-image-${cleanPrompt.replace(/\s+/g, '-')}-${timestamp}.${format}`;
};

/**
 * 下載圖片檔案
 */
export const downloadImage = async (
  imageUrl: string,
  fileName: string,
  _format: DownloadFormat = 'png'
): Promise<void> => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    // 建立下載連結
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;

    // 觸發下載
    document.body.appendChild(link);
    link.click();

    // 清理
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('下載圖片失敗:', error);
    throw new Error('下載圖片失敗');
  }
};

/**
 * 複製文字到剪貼簿
 */
export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error('複製到剪貼簿失敗:', error);
    throw new Error('複製到剪貼簿失敗');
  }
};

/**
 * 格式化檔案大小
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 位元組';

  const k = 1024;
  const sizes = ['位元組', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 延遲函式
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * 驗證提示詞
 */
export const validatePrompt = (prompt: string): { isValid: boolean; error?: string } => {
  if (!prompt.trim()) {
    return { isValid: false, error: '請輸入圖片描述' };
  }

  if (prompt.length < 5) {
    return { isValid: false, error: '描述過短，請至少輸入 5 個字元' };
  }

  return { isValid: true };
};

/**
 * 本地儲存工具
 */
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('儲存到本地儲存失敗:', error);
    }
  },

  remove: (key: string): void => {
    localStorage.removeItem(key);
  },
};
