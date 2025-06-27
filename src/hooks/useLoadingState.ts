import { useState, useCallback, useRef, useEffect } from 'react';

// 載入狀態類型
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// 載入階段
export interface LoadingPhase {
  id: string;
  label: string;
  completed: boolean;
  duration?: number;
}

// 載入狀態資料
export interface LoadingStateData {
  state: LoadingState;
  progress: number;
  phase: string;
  phases: LoadingPhase[];
  startTime?: number;
  endTime?: number;
  error?: Error;
}

/**
 * 進階載入狀態管理 Hook
 * 支援多階段載入、進度追蹤、錯誤處理
 */
export const useLoadingState = (initialPhases: LoadingPhase[] = []) => {
  const [loadingData, setLoadingData] = useState<LoadingStateData>({
    state: 'idle',
    progress: 0,
    phase: '',
    phases: initialPhases
  });

  const timeoutRef = useRef<number>();
  const startTimeRef = useRef<number>();

  // 開始載入
  const startLoading = useCallback((phases?: LoadingPhase[]) => {
    startTimeRef.current = Date.now();
    
    setLoadingData(prev => ({
      ...prev,
      state: 'loading',
      progress: 0,
      phase: phases?.[0]?.label || '準備中...',
      phases: phases || prev.phases,
      startTime: startTimeRef.current,
      error: undefined
    }));
  }, []);

  // 更新載入階段
  const updatePhase = useCallback((phaseId: string) => {
    setLoadingData(prev => {
      const phaseIndex = prev.phases.findIndex(p => p.id === phaseId);
      if (phaseIndex === -1) return prev;

      const updatedPhases = prev.phases.map((phase, index) => ({
        ...phase,
        completed: index <= phaseIndex,
        duration: index === phaseIndex ? Date.now() - (startTimeRef.current || 0) : phase.duration
      }));

      const progress = ((phaseIndex + 1) / prev.phases.length) * 100;

      return {
        ...prev,
        progress,
        phase: prev.phases[phaseIndex].label,
        phases: updatedPhases
      };
    });
  }, []);

  // 設定自訂進度
  const setProgress = useCallback((progress: number, phase?: string) => {
    setLoadingData(prev => ({
      ...prev,
      progress: Math.min(100, Math.max(0, progress)),
      phase: phase || prev.phase
    }));
  }, []);

  // 完成載入
  const completeLoading = useCallback(() => {
    const endTime = Date.now();
    
    setLoadingData(prev => ({
      ...prev,
      state: 'success',
      progress: 100,
      phase: '完成',
      endTime,
      phases: prev.phases.map(phase => ({
        ...phase,
        completed: true,
        duration: phase.duration || (endTime - (prev.startTime || endTime))
      }))
    }));

    // 短暫延遲後重置為 idle
    timeoutRef.current = setTimeout(() => {
      setLoadingData(prev => ({
        ...prev,
        state: 'idle',
        progress: 0,
        phase: '',
        error: undefined
      }));
    }, 1000);
  }, []);

  // 載入失敗
  const failLoading = useCallback((error: Error) => {
    setLoadingData(prev => ({
      ...prev,
      state: 'error',
      error,
      endTime: Date.now()
    }));
  }, []);

  // 重置載入狀態
  const resetLoading = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setLoadingData({
      state: 'idle',
      progress: 0,
      phase: '',
      phases: initialPhases,
      error: undefined
    });
  }, [initialPhases]);

  // 取得載入時間
  const getLoadingDuration = useCallback((): number => {
    if (!loadingData.startTime) return 0;
    const endTime = loadingData.endTime || Date.now();
    return endTime - loadingData.startTime;
  }, [loadingData.startTime, loadingData.endTime]);

  // 檢查是否正在載入
  const isLoading = loadingData.state === 'loading';
  const isSuccess = loadingData.state === 'success';
  const isError = loadingData.state === 'error';
  const isIdle = loadingData.state === 'idle';

  // 清理 timeout
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    // 狀態
    loadingData,
    isLoading,
    isSuccess,
    isError,
    isIdle,
    
    // 動作
    startLoading,
    updatePhase,
    setProgress,
    completeLoading,
    failLoading,
    resetLoading,
    
    // 工具
    getLoadingDuration
  };
};

// 預設的提示詞最佳化載入階段
export const PROMPT_OPTIMIZATION_PHASES: LoadingPhase[] = [
  { id: 'validate', label: '驗證輸入內容...', completed: false },
  { id: 'analyze', label: '分析內容特徵...', completed: false },
  { id: 'generate', label: '生成最佳化提示詞...', completed: false },
  { id: 'format', label: '格式化結果...', completed: false }
];
