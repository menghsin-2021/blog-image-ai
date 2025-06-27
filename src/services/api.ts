import { 
  ImageGenerationRequest, 
  ImageGenerationResponse,
  ImageEditRequest,
  ImageEditResponse,
  ImageVariationRequest,
  ImageVariationResponse
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
    // 嘗試從環境變數載入，如果失敗則使用硬編碼金鑰
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY
    this.baseUrl = API_CONFIG.baseUrl;
    
    // 偵錯資訊：檢查 API 金鑰是否正確載入
    console.log('OpenAI Service 初始化:', {
      hasApiKey: !!this.apiKey,
      keyPrefix: this.apiKey ? this.apiKey.substring(0, 8) + '...' : 'None',
      baseUrl: this.baseUrl,
      fromEnv: !!import.meta.env.VITE_OPENAI_API_KEY
    });
  }

  /**
   * 生成圖片
   */
  async generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    if (!this.apiKey || this.apiKey.includes('your_openai_api_key_here')) {
      const errorMsg = !this.apiKey 
        ? 'OpenAI API 金鑰未設定，請檢查環境變數 VITE_OPENAI_API_KEY' 
        : 'API 金鑰仍為佔位符，請在 .env 檔案中設定真實的 OpenAI API 金鑰';
      throw new Error(errorMsg);
    }

    const requestId = `img_${Date.now()}`;
    
    try {
      // 根據模型建構請求參數
      const requestBody = this.buildGenerationRequest(request);
      
      const response = await this.makeApiCall('generations', requestBody, requestId);

      // 根據模型處理不同的響應格式
      let imageUrl: string;
      if (request.model === 'gpt-image-1') {
        // GPT-image-1 返回 base64 編碼的圖片
        const base64Data = response.data[0].b64_json;
        imageUrl = `data:image/png;base64,${base64Data}`;
      } else {
        // DALL·E 2/3 返回 URL
        imageUrl = response.data[0].url;
      }

      return {
        success: true,
        imageUrl: imageUrl,
        revisedPrompt: response.data[0].revised_prompt,
        requestId
      };
    } catch (error) {
      console.error('圖片生成失敗:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知錯誤',
        requestId
      };
    }
  }

  /**
   * 根據模型建構生成請求參數
   */
  private buildGenerationRequest(request: ImageGenerationRequest): any {
    console.log('建構請求參數，模型:', request.model);
    
    // 根據不同模型建構請求
    switch (request.model) {
      case 'gpt-image-1': {
        // GPT-image-1 支援的參數：model, prompt, size, quality, n, output_format
        // 不支援 style 和 response_format 參數
        // GPT-image-1 預設返回 base64 編碼的圖片
        const gptQuality = this.normalizeQualityForGPTImage(request.quality);
        return {
          model: 'gpt-image-1',
          prompt: this.optimizePrompt(request.prompt),
          size: request.aspectRatio.value,
          quality: gptQuality,
          n: 1 // GPT-image-1 支援 1-10 張
          // 注意：不包含 response_format，GPT-image-1 預設返回 base64
        };
      }
        
      case 'dall-e-3':
        return {
          model: 'dall-e-3',
          prompt: this.optimizePrompt(request.prompt),
          size: request.aspectRatio.value,
          quality: this.normalizeQualityForDallE3(request.quality),
          style: request.style || 'vivid',
          n: 1, // DALL·E 3 只支援 n=1
          response_format: 'url'
        };
        
      case 'dall-e-2':
        return {
          model: 'dall-e-2',
          prompt: this.optimizePrompt(request.prompt),
          size: request.aspectRatio.value,
          n: Math.min(request.n || 1, 10), // DALL·E 2 最多支援 10 張
          response_format: 'url'
        };
        
      default:
        // 預設使用 DALL·E 3
        return {
          model: 'dall-e-3',
          prompt: this.optimizePrompt(request.prompt),
          size: request.aspectRatio.value,
          quality: 'standard',
          style: 'vivid',
          n: 1,
          response_format: 'url'
        };
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
      formData.append('n', (Math.min(request.n || 1, 10)).toString()); // 最多 10 張
      formData.append('size', request.size || '1024x1024');
      formData.append('response_format', 'url');
      // 注意：編輯端點不需要指定模型參數，預設使用 DALL·E 2

      const response = await fetch(`${this.baseUrl}/images/edits`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || '圖片編輯失敗');
      }

      const data = await response.json();
      
      return {
        success: true,
        imageUrl: data.data[0].url,
        requestId
      };
    } catch (error) {
      console.error('圖片編輯失敗:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '圖片編輯失敗',
        requestId
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
      formData.append('n', (Math.min(request.n || 1, 10)).toString()); // 最多 10 張
      formData.append('size', request.size || '1024x1024');
      formData.append('response_format', 'url');
      // 注意：變化端點不需要指定模型參數，預設使用 DALL·E 2

      const response = await fetch(`${this.baseUrl}/images/variations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || '圖片變化失敗');
      }

      const data = await response.json();
      
      return {
        success: true,
        imageUrl: data.data[0].url,
        requestId
      };
    } catch (error) {
      console.error('圖片變化失敗:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '圖片變化失敗',
        requestId
      };
    }
  }

  /**
   * API 呼叫通用方法
   */
  private async makeApiCall(
    endpoint: string, 
    requestBody: any, 
    requestId: string
  ): Promise<any> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
      try {
        console.log(`API 呼叫 (嘗試 ${attempt}/${API_CONFIG.maxRetries}):`, {
          endpoint,
          requestId,
          model: requestBody.model,
          size: requestBody.size
        });

        const response = await fetch(`${this.baseUrl}/images/${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify(requestBody)
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
   * 將品質參數正規化為 DALL·E 3 支援的格式
   */
  private normalizeQualityForDallE3(quality?: string): 'standard' | 'hd' {
    switch (quality) {
      case 'high':
      case 'hd':
        return 'hd';
      case 'standard':
      case 'medium':
      case 'low':
      case 'auto':
      default:
        return 'standard';
    }
  }

  /**
   * 將品質參數正規化為 GPT-image-1 支援的格式
   */
  private normalizeQualityForGPTImage(quality?: string): 'low' | 'medium' | 'high' {
    switch (quality) {
      case 'hd':
      case 'high':
        return 'high';
      case 'standard':
      case 'medium':
        return 'medium';
      case 'low':
      case 'auto':
      default:
        return 'medium'; // 預設使用中等品質
    }
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
}

// 建立服務實例
const openAIService = new OpenAIService();

// 導出 API 方法
export const generateImage = (request: ImageGenerationRequest) => 
  openAIService.generateImage(request);

export const editImage = (request: ImageEditRequest) => 
  openAIService.editImage(request);

export const createVariation = (request: ImageVariationRequest) => 
  openAIService.createVariation(request);

export default openAIService;
