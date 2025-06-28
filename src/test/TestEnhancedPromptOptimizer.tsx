import { EnhancedPromptOptimizer } from '../components/PromptOptimizer';

export function TestEnhancedPromptOptimizer() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">測試 Perplexity 提示詞最佳化</h1>
      <EnhancedPromptOptimizer
        onOptimizedPrompt={(result) => {
          console.log('最佳化結果:', result);
        }}
        onApplyPrompt={(prompt) => {
          console.log('應用提示詞:', prompt);
        }}
      />
    </div>
  );
}
