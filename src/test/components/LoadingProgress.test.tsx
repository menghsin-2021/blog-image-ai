import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingProgress, LoadingStages, SmartLoading } from '../../components/LoadingProgress';

describe('LoadingProgress', () => {
  it('應該顯示正確的進度百分比', () => {
    render(<LoadingProgress progress={75} label="測試進度" />);

    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('測試進度')).toBeInTheDocument();
  });

  it('應該支援不同的變體樣式', () => {
    const { rerender } = render(<LoadingProgress progress={50} variant="optimizing" />);

    // 檢查是否有適當的樣式類別
    const container = screen.getByText('50%').closest('.bg-purple-50');
    expect(container).toBeInTheDocument();

    rerender(<LoadingProgress progress={50} variant="analyzing" />);
    const newContainer = screen.getByText('50%').closest('.bg-blue-50');
    expect(newContainer).toBeInTheDocument();
  });

  it('應該可以隱藏百分比顯示', () => {
    render(<LoadingProgress progress={50} showPercentage={false} />);

    expect(screen.queryByText('50%')).not.toBeInTheDocument();
  });
});

describe('LoadingStages', () => {
  const mockStages = [
    { name: '第一階段', status: 'complete' as const },
    { name: '第二階段', status: 'active' as const },
    { name: '第三階段', status: 'pending' as const },
  ];

  it('應該顯示所有階段', () => {
    render(<LoadingStages stages={mockStages} />);

    expect(screen.getByText('第一階段')).toBeInTheDocument();
    expect(screen.getByText('第二階段')).toBeInTheDocument();
    expect(screen.getByText('第三階段')).toBeInTheDocument();
  });

  it('應該顯示不同狀態的視覺指示', () => {
    render(<LoadingStages stages={mockStages} />);

    // 檢查不同狀態的樣式
    const activeStage = screen.getByText('第二階段');
    expect(activeStage).toHaveClass('text-blue-700');

    const completeStage = screen.getByText('第一階段');
    expect(completeStage).toHaveClass('text-green-700');
  });
});

describe('SmartLoading', () => {
  it('應該根據類型顯示適當的訊息和圖示', () => {
    const { rerender } = render(<SmartLoading type="content-analysis" />);

    expect(screen.getByText('🔍')).toBeInTheDocument();
    expect(screen.getByText('正在分析內容結構...')).toBeInTheDocument();

    rerender(<SmartLoading type="prompt-optimization" />);
    expect(screen.getByText('✨')).toBeInTheDocument();
    expect(screen.getByText('正在最佳化提示詞...')).toBeInTheDocument();
  });

  it('應該支援自訂訊息', () => {
    render(<SmartLoading type="content-analysis" message="自訂載入訊息" />);

    expect(screen.getByText('自訂載入訊息')).toBeInTheDocument();
    expect(screen.queryByText('正在分析內容結構...')).not.toBeInTheDocument();
  });

  it('應該有動畫效果', () => {
    render(<SmartLoading type="content-analysis" />);

    const icon = screen.getByText('🔍');
    expect(icon).toHaveClass('animate-bounce');
  });
});
