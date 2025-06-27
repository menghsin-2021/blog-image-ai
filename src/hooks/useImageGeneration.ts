import { useState, useCallback } from 'react';
import {
  ImageGenerationRequest,
  ImageGenerationResponse,
  ImageEditRequest,
  ImageEditResponse,
  ImageVariationRequest,
  ImageVariationResponse,
  LoadingState,
} from '../types';
import openaiService from '../services/api';
import { validatePrompt } from '../utils/helpers';

/**
 * 圖片生成、編輯、變化 Hook
 */
export const useImageGeneration = () => {
  const [state, setState] = useState<LoadingState>('idle');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [revisedPrompt, setRevisedPrompt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 生成圖片
  const generateImage = useCallback(async (request: ImageGenerationRequest) => {
    // 驗證提示詞
    const validation = validatePrompt(request.prompt);
    if (!validation.isValid) {
      setError(validation.error!);
      return;
    }

    setState('loading');
    setError(null);
    setGeneratedImage(null);
    setRevisedPrompt(null);

    try {
      const response: ImageGenerationResponse = await openaiService.generateImage(request);

      if (response.success && response.imageUrl) {
        setGeneratedImage(response.imageUrl);
        setRevisedPrompt(response.revisedPrompt || null);
        setState('success');
      } else {
        setError(response.error || '圖片生成失敗');
        setState('error');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知錯誤';
      setError(errorMessage);
      setState('error');
    }
  }, []);

  // 編輯圖片 (僅 DALL·E 2)
  const editImage = useCallback(async (request: ImageEditRequest) => {
    setState('loading');
    setError(null);

    try {
      const response: ImageEditResponse = await openaiService.editImage(request);

      if (response.success && response.imageUrl) {
        setGeneratedImage(response.imageUrl);
        setRevisedPrompt(null);
        setState('success');
      } else {
        setError(response.error || '圖片編輯失敗');
        setState('error');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知錯誤';
      setError(errorMessage);
      setState('error');
    }
  }, []);

  // 生成圖片變化 (僅 DALL·E 2)
  const createVariation = useCallback(async (request: ImageVariationRequest) => {
    setState('loading');
    setError(null);

    try {
      const response: ImageVariationResponse = await openaiService.createVariation(request);

      if (response.success && response.imageUrl) {
        setGeneratedImage(response.imageUrl);
        setRevisedPrompt(null);
        setState('success');
      } else {
        setError(response.error || '圖片變化生成失敗');
        setState('error');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知錯誤';
      setError(errorMessage);
      setState('error');
    }
  }, []);

  const reset = useCallback(() => {
    setState('idle');
    setGeneratedImage(null);
    setRevisedPrompt(null);
    setError(null);
  }, []);

  return {
    state,
    generatedImage,
    revisedPrompt,
    error,
    generateImage,
    editImage,
    createVariation,
    reset,
    isLoading: state === 'loading',
    isSuccess: state === 'success',
    isError: state === 'error',
  };
};
