import React, { useRef, useState, useEffect } from 'react';
import { Button } from './Button';
import { CanvasState } from '../types';

interface ImageEditorProps {
  imageUrl: string;
  onSave: (editedImage: File, mask: File) => void;
  onCancel: () => void;
  className?: string;
}

/**
 * 圖片編輯元件
 */
export const ImageEditor: React.FC<ImageEditorProps> = ({
  imageUrl,
  onSave,
  onCancel,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const [currentImage, setCurrentImage] = useState<HTMLImageElement | null>(null);
  
  const [canvasState, setCanvasState] = useState<CanvasState>({
    tool: 'brush',
    brushSize: 20,
    isDrawing: false,
    hasChanges: false
  });

  const [imageLoaded, setImageLoaded] = useState(false);

  // 載入圖片
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setCurrentImage(img);
      setupCanvas(img);
      setImageLoaded(true);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  // 設定畫布
  const setupCanvas = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    
    if (!canvas || !maskCanvas) return;

    const ctx = canvas.getContext('2d');
    const maskCtx = maskCanvas.getContext('2d');
    
    if (!ctx || !maskCtx) return;

    // 設定畫布大小
    canvas.width = img.width;
    canvas.height = img.height;
    maskCanvas.width = img.width;
    maskCanvas.height = img.height;

    // 繪製原始圖片
    ctx.drawImage(img, 0, 0);
    
    // 初始化遮罩畫布為白色
    maskCtx.fillStyle = 'white';
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
  };

  // 開始繪製
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setCanvasState(prev => ({ ...prev, isDrawing: true, hasChanges: true }));
    draw(e);
  };

  // 繪製
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasState.isDrawing) return;
    
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!canvas || !maskCanvas) return;

    const ctx = canvas.getContext('2d');
    const maskCtx = maskCanvas.getContext('2d');
    if (!ctx || !maskCtx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // 設定繪製樣式
    ctx.globalCompositeOperation = canvasState.tool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.lineWidth = canvasState.brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = canvasState.tool === 'brush' ? 'rgba(255, 255, 255, 0.7)' : 'transparent';

    // 在主畫布上繪製
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    // 在遮罩畫布上繪製
    maskCtx.globalCompositeOperation = 'source-over';
    maskCtx.fillStyle = canvasState.tool === 'brush' ? 'black' : 'white';
    maskCtx.beginPath();
    maskCtx.arc(x, y, canvasState.brushSize / 2, 0, Math.PI * 2);
    maskCtx.fill();
  };

  // 停止繪製
  const stopDrawing = () => {
    setCanvasState(prev => ({ ...prev, isDrawing: false }));
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
    }
  };

  // 清除畫布
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    
    if (!canvas || !maskCanvas || !currentImage) return;

    const ctx = canvas.getContext('2d');
    const maskCtx = maskCanvas.getContext('2d');
    
    if (!ctx || !maskCtx) return;

    // 重新繪製原始圖片
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(currentImage, 0, 0);
    
    // 重設遮罩
    maskCtx.fillStyle = 'white';
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
    
    setCanvasState(prev => ({ ...prev, hasChanges: false }));
  };

  // 儲存編輯結果
  const handleSave = async () => {
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    
    if (!canvas || !maskCanvas) return;

    try {
      // 轉換為 File 物件
      const editedImageBlob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png');
      });
      
      const maskBlob = await new Promise<Blob>((resolve) => {
        maskCanvas.toBlob((blob) => resolve(blob!), 'image/png');
      });

      const editedImageFile = new File([editedImageBlob], 'edited-image.png', { type: 'image/png' });
      const maskFile = new File([maskBlob], 'mask.png', { type: 'image/png' });

      onSave(editedImageFile, maskFile);
    } catch (error) {
      console.error('儲存編輯結果失敗:', error);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      {/* 工具列 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">圖片編輯器</h3>
          <div className="flex items-center space-x-2">
            <Button onClick={clearCanvas} variant="secondary" size="sm">
              清除
            </Button>
            <Button onClick={onCancel} variant="secondary" size="sm">
              取消
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!canvasState.hasChanges}
              size="sm"
            >
              儲存
            </Button>
          </div>
        </div>

        {/* 工具選擇 */}
        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">工具:</span>
            <button
              onClick={() => setCanvasState(prev => ({ ...prev, tool: 'brush' }))}
              className={`p-2 rounded ${
                canvasState.tool === 'brush'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="畫筆 - 標記要編輯的區域"
            >
              ✏️
            </button>
            <button
              onClick={() => setCanvasState(prev => ({ ...prev, tool: 'eraser' }))}
              className={`p-2 rounded ${
                canvasState.tool === 'eraser'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="橡皮擦 - 移除標記"
            >
              🧽
            </button>
          </div>

          {/* 筆刷大小 */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">大小:</span>
            <input
              type="range"
              min="5"
              max="50"
              value={canvasState.brushSize}
              onChange={(e) => setCanvasState(prev => ({ ...prev, brushSize: parseInt(e.target.value) }))}
              className="w-20"
            />
            <span className="text-sm text-gray-600 w-8">{canvasState.brushSize}</span>
          </div>
        </div>
      </div>

      {/* 畫布區域 */}
      <div className="p-4">
        <div className="text-xs text-gray-500 mb-2">
          💡 使用畫筆標記您想要編輯的區域，然後提供新的描述來替換標記區域
        </div>
        
        <div className="relative border border-gray-300 rounded-lg overflow-hidden bg-gray-50 max-w-full">
          {imageLoaded && (
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="block max-w-full h-auto cursor-crosshair"
              style={{ display: 'block' }}
            />
          )}
          
          {/* 隱藏的遮罩畫布 */}
          <canvas
            ref={maskCanvasRef}
            className="hidden"
          />
          
          {!imageLoaded && (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">載入圖片中...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
