import {
  ImageGenerationRequest,
  ImageGenerationResponse,
  ImageEditRequest,
  ImageEditResponse,
  ImageVariationRequest,
  ImageVariationResponse,
} from '../types';
import { API_CONFIG } from '../utils/constants';
import { delay } from '../utils/helpers';

/**
 * OpenAI API 服務類別
 */
class OpenAIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    this.baseUrl = API_CONFIG.baseUrl;
  }

  /**
   * 生成圖片
   */
  async generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    if (!this.apiKey) {
      throw new Error('OpenAI API 金鑰未設定，請檢查環境變數 VITE_OPENAI_API_KEY');
    }

    const requestId = `img_${Date.now()}`;

    try {
      // 根據模型建構請求參數
      const requestBody = this.buildGenerationRequest(request);

      const response = await this.makeApiCall('generations', requestBody, requestId);

      return {
        success: true,
        imageUrl: response.data[0].url,
        revisedPrompt: response.data[0].revised_prompt,
        requestId,
      };
    } catch (error) {
      console.error('圖片生成失敗:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知錯誤',
        requestId,
      };
    }
  }

  /**
   * 根據模型建構生成請求參數
   */
  private buildGenerationRequest(request: ImageGenerationRequest): any {
    const baseRequest = {
      model: request.model || 'gpt-image-1',
      prompt: this.optimizePrompt(request.prompt),
      size: request.aspectRatio.value,
      n: request.n || 1,
      response_format: 'url',
    };

    // 根據不同模型新增特定參數
    switch (request.model) {
      case 'gpt-image-1':
        return {
          ...baseRequest,
          quality: request.quality || 'auto',
          ...(request.outputFormat && { output_format: request.outputFormat }),
          ...(request.outputCompression &&
            request.outputFormat !== 'png' && {
              output_compression: request.outputCompression,
            }),
          ...(request.moderation && { moderation: request.moderation }),
        };

      case 'dall-e-3':
        return {
          ...baseRequest,
          quality: request.quality || 'standard',
          style: request.style || 'vivid',
        };

      case 'dall-e-2':
        return {
          ...baseRequest,
          // DALL·E 2 沒有額外參數
        };

      default:
        return baseRequest;
    }
  }

  /**
   * 編輯圖片 (僅 DALL·E 2 支援)
   */
  async editImage(request: ImageEditRequest): Promise<ImageEditResponse> {
    if (!this.apiKey) {
      throw new Error('OpenAI API 金鑰未設定');
    }

    const requestId = `edit_${Date.now()}`;

    try {
      const formData = new FormData();
      formData.append('image', request.image);
      if (request.mask) {
        formData.append('mask', request.mask);
      }
      formData.append('prompt', request.prompt);
      formData.append('n', (request.n || 1).toString());
      formData.append('size', request.size || '1024x1024');
      formData.append('response_format', 'url');

      const response = await fetch(`${this.baseUrl}/images/edits`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || '圖片編輯失敗');
      }

      const data = await response.json();

      return {
        success: true,
        imageUrl: data.data[0].url,
        requestId,
      };
    } catch (error) {
      console.error('圖片編輯失敗:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '圖片編輯失敗',
        requestId,
      };
    }
  }

  /**
   * 建立圖片變化 (僅 DALL·E 2 支援)
   */
  async createVariation(request: ImageVariationRequest): Promise<ImageVariationResponse> {
    if (!this.apiKey) {
      throw new Error('OpenAI API 金鑰未設定');
    }

    const requestId = `var_${Date.now()}`;

    try {
      const formData = new FormData();
      formData.append('image', request.image);
      formData.append('n', (request.n || 1).toString());
      formData.append('size', request.size || '1024x1024');
      formData.append('response_format', 'url');

      const response = await fetch(`${this.baseUrl}/images/variations`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || '圖片變化失敗');
      }

      const data = await response.json();

      return {
        success: true,
        imageUrl: data.data[0].url,
        requestId,
      };
    } catch (error) {
      console.error('圖片變化失敗:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '圖片變化失敗',
        requestId,
      };
    }
  }

  /**
   * API 呼叫通用方法
   */
  private async makeApiCall(endpoint: string, requestBody: any, requestId: string): Promise<any> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
      try {
        console.log(`API 呼叫 (嘗試 ${attempt}/${API_CONFIG.maxRetries}):`, {
          endpoint,
          requestId,
          model: requestBody.model,
          size: requestBody.size,
        });

        const response = await fetch(`${this.baseUrl}/images/${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log('API 呼叫成功:', { requestId, imageCount: data.data?.length });
        return data;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('未知錯誤');
        console.error(`API 呼叫失敗 (嘗試 ${attempt}):`, lastError.message);

        if (attempt < API_CONFIG.maxRetries) {
          await delay(API_CONFIG.retryDelay * attempt);
        }
      }
    }

    throw lastError;
  }

  /**
   * 最佳化提示詞
   */
  private optimizePrompt(prompt: string): string {
    // 移除多餘空格並確保長度在限制內
    const cleaned = prompt.trim().replace(/\s+/g, ' ');

    // GPT-Image-1 支援最多 4000 字元
    if (cleaned.length > 4000) {
      return cleaned.substring(0, 3997) + '...';
    }

    return cleaned;
  }

  /**
   * 驗證模型支援的圖片尺寸
   * @deprecated 暫時未使用，保留供未來參考
   */
  // private validateSize(model: DalleModel, size: string): boolean {
  //   switch (model) {
  //     case 'dall-e-2':
  //       return ['256x256', '512x512', '1024x1024'].includes(size);
  //     case 'dall-e-3':
  //       return ['1024x1024', '1024x1792', '1792x1024'].includes(size);
  //     case 'gpt-image-1':
  //       return ['1024x1024', '1536x1024', '1024x1536'].includes(size);
  //     default:
  //       return false;
  //   }
  // }
}

// 建立服務實例
const openAIService = new OpenAIService();

// 導出 API 方法
export const generateImage = (request: ImageGenerationRequest) =>
  openAIService.generateImage(request);

export const editImage = (request: ImageEditRequest) => openAIService.editImage(request);

export const createVariation = (request: ImageVariationRequest) =>
  openAIService.createVariation(request);

export default openAIService;
