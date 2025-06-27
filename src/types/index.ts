// 圖片比例選項
export interface AspectRatio {
  label: string;
  value: string;
  ratio: number;
  width: number;
  height: number;
}

// DALL·E 和 GPT-image 模型選項
export type DalleModel = 'dall-e-2' | 'dall-e-3' | 'gpt-image-1';

// 圖片品質選項 (不同模型支援不同品質選項)
export type ImageQuality = 'standard' | 'hd' | 'high' | 'medium' | 'low' | 'auto';

// 圖片風格選項 (僅 DALL·E 3 支援)
export type ImageStyle = 'vivid' | 'natural';

// API 回應型別
export interface ImageGenerationResponse {
  success: boolean;
  imageUrl?: string;
  revisedPrompt?: string;
  error?: string;
  requestId?: string;
}

// 圖片編輯回應型別
export interface ImageEditResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  requestId?: string;
}

// 圖片變化回應型別
export interface ImageVariationResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  requestId?: string;
}

// 圖片生成請求
export interface ImageGenerationRequest {
  prompt: string;
  aspectRatio: AspectRatio;
  model?: DalleModel;
  quality?: ImageQuality;
  style?: ImageStyle;
  n?: number;
  // GPT-Image-1 特有屬性
  outputFormat?: 'png' | 'jpeg' | 'webp';
  outputCompression?: number;
  moderation?: 'auto' | 'low';
}

// 圖片編輯請求
export interface ImageEditRequest {
  image: File;
  mask?: File;
  prompt: string;
  n?: number;
  size?: string;
}

// 圖片變化請求
export interface ImageVariationRequest {
  image: File;
  n?: number;
  size?: string;
}

// 應用程式狀態
export interface AppState {
  isGenerating: boolean;
  isEditing: boolean;
  isVariating: boolean;
  generatedImage: string | null;
  editedImage: string | null;
  error: string | null;
  history: GeneratedImage[];
}

// 歷史記錄項目
export interface GeneratedImage {
  id: string;
  prompt: string;
  originalPrompt?: string;
  revisedPrompt?: string;
  imageUrl: string;
  aspectRatio: AspectRatio;
  model: DalleModel;
  quality?: ImageQuality;
  style?: ImageStyle;
  createdAt: Date;
  downloadCount: number;
  type: 'generation' | 'edit' | 'variation';
}

// 載入狀態
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// 下載格式
export type DownloadFormat = 'png' | 'jpeg' | 'webp';

// 編輯工具
export type EditTool = 'brush' | 'eraser' | 'fill';

// 畫布狀態
export interface CanvasState {
  tool: EditTool;
  brushSize: number;
  isDrawing: boolean;
  hasChanges: boolean;
}

// 環境變數
export interface EnvironmentConfig {
  apiKey: string;
  apiEndpoint: string;
  maxRequestsPerMonth: number;
}
