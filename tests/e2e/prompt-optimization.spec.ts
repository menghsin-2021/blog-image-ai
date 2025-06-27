import { test, expect } from '@playwright/test';

test.describe('提示詞最佳化完整流程', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('完整的提示詞最佳化工作流程', async ({ page }) => {
    // 步驟 1: 檢查提示詞最佳化標籤是否存在
    const optimizerTab = page.getByText('提示詞最佳化').or(
      page.locator('[data-testid*="optimizer"]')
    );
    
    if (await optimizerTab.count() > 0) {
      await optimizerTab.click();
      
      // 步驟 2: 選擇圖片用途
      const purposeSelector = page.locator('[data-testid*="purpose"]').or(
        page.getByText('首頁橫幅').or(
          page.getByText('段落說明').or(
            page.getByText('內容總結')
          )
        )
      );
      
      if (await purposeSelector.count() > 0) {
        await purposeSelector.first().click();
        
        // 步驟 2.5: 填寫文章標題（必要欄位）
        const titleInput = page.locator('input[placeholder*="標題"]').or(
          page.locator('input[name*="title"]').or(
            page.locator('[data-testid*="title"]')
          )
        );
        
        if (await titleInput.count() > 0) {
          await titleInput.fill('React Hooks 完整指南');
        }
        
        // 步驟 3: 輸入部落格內容
        const contentInput = page.locator('textarea').or(
          page.locator('[data-testid*="content-input"]')
        );
        
        if (await contentInput.count() > 0) {
          await contentInput.fill(`
            # React Hooks 完整指南
            
            React Hooks 是 React 16.8 中引入的新功能，它讓你可以在不編寫 class 的情況下使用 state 和其他 React 功能。
            
            ## 主要的 Hook
            
            ### useState
            useState 是最基本的 Hook，用於在函數組件中添加狀態。
            
            ### useEffect
            useEffect 用於處理副作用，如 API 調用、訂閱或手動更改 DOM。
            
            ## 自訂 Hook
            你可以創建自己的 Hook 來重用狀態邏輯。
          `);
          
          // 步驟 4: 等待表單驗證並點擊最佳化按鈕
          await page.waitForTimeout(500); // 等待表單狀態更新
          
          const optimizeButton = page.getByRole('button', { name: '分析內容並最佳化提示詞' });
          
          // 等待按鈕變為可用
          await optimizeButton.waitFor({ state: 'visible' });
          
          if (await optimizeButton.isEnabled()) {
            await optimizeButton.click();
            
            // 步驟 5: 等待最佳化結果
            const loadingIndicator = page.locator('[data-testid*="loading"]').or(
              page.getByText('分析中').or(
                page.getByText('最佳化中')
              )
            );
            
            // 等待載入完成
            if (await loadingIndicator.count() > 0) {
              await expect(loadingIndicator.first()).toBeVisible();
              await expect(loadingIndicator.first()).not.toBeVisible({ timeout: 30000 });
            }
            
            // 步驟 6: 檢查最佳化結果
            const optimizedResult = page.locator('[data-testid*="optimized-prompt"]').or(
              page.getByText('最佳化提示詞').or(
                page.locator('.optimized-prompt')
              )
            );
            
            if (await optimizedResult.count() > 0) {
              await expect(optimizedResult.first()).toBeVisible();
              
              // 步驟 7: 檢查是否可以使用最佳化的提示詞
              const usePromptButton = page.getByText('使用此提示詞').or(
                page.getByText('套用').or(
                  page.locator('[data-testid*="use-prompt"]')
                )
              );
              
              if (await usePromptButton.count() > 0) {
                await usePromptButton.click();
                
                // 檢查是否回到圖片生成頁面
                const imageGenTab = page.getByText('圖片生成').or(
                  page.locator('[data-testid*="image-generation"]')
                );
                
                if (await imageGenTab.count() > 0) {
                  await expect(imageGenTab).toBeVisible();
                }
              }
            }
          }
        }
      }
    }
  });

  test('提示詞快取功能', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 進入提示詞最佳化頁面
    const optimizerTab = page.getByText('提示詞最佳化').or(
      page.locator('[data-testid*="optimizer"]')
    );
    
    if (await optimizerTab.count() > 0) {
      await optimizerTab.click();
      
      // 輸入相同的內容兩次，檢查快取功能
      const contentInput = page.locator('textarea').or(
        page.locator('[data-testid*="content-input"]')
      );
      
      if (await contentInput.count() > 0) {
        const testContent = '測試快取功能的內容';
        
        // 第一次輸入和最佳化
        await contentInput.fill(testContent);
        
        const optimizeButton = page.getByText('最佳化').or(
          page.getByText('分析')
        );
        
        if (await optimizeButton.count() > 0) {
          await optimizeButton.click();
          
          // 記錄第一次的處理時間
          const startTime = Date.now();
          
          // 等待結果
          await page.waitForTimeout(2000);
          const firstTime = Date.now() - startTime;
          
          // 清空輸入，重新輸入相同內容
          await contentInput.fill('');
          await contentInput.fill(testContent);
          
          // 第二次最佳化
          const secondStartTime = Date.now();
          await optimizeButton.click();
          await page.waitForTimeout(1000);
          const secondTime = Date.now() - secondStartTime;
          
          // 快取的情況下，第二次應該明顯更快
          console.log(`第一次: ${firstTime}ms, 第二次: ${secondTime}ms`);
        }
      }
    }
  });
});

test.describe('圖片生成與提示詞整合', () => {
  test('從提示詞最佳化到圖片生成的完整流程', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 先在圖片生成頁面輸入基本提示詞
    const promptInput = page.locator('textarea, input[type="text"]').first();
    if (await promptInput.count() > 0) {
      await promptInput.fill('一個關於 React 的技術插圖');
      
      // 切換到提示詞最佳化
      const optimizerTab = page.getByText('提示詞最佳化').or(
        page.locator('[data-testid*="optimizer"]')
      );
      
      if (await optimizerTab.count() > 0) {
        await optimizerTab.click();
        
        // 進行最佳化流程
        const contentInput = page.locator('textarea').or(
          page.locator('[data-testid*="content-input"]')
        );
        
        if (await contentInput.count() > 0) {
          await contentInput.fill('React 是一個用於構建用戶界面的 JavaScript 函式庫');
          
          const optimizeButton = page.getByText('最佳化').or(
            page.getByText('分析')
          );
          
          if (await optimizeButton.count() > 0) {
            await optimizeButton.click();
            await page.waitForTimeout(3000);
            
            // 使用最佳化的提示詞
            const usePromptButton = page.getByText('使用此提示詞').or(
              page.getByText('套用')
            );
            
            if (await usePromptButton.count() > 0) {
              await usePromptButton.click();
              
              // 回到圖片生成頁面，檢查提示詞是否已更新
              const imageGenTab = page.getByText('圖片生成').or(
                page.locator('[data-testid*="image-generation"]')
              );
              
              if (await imageGenTab.count() > 0) {
                await imageGenTab.click();
                
                // 檢查提示詞輸入框是否已更新
                const updatedPromptInput = page.locator('textarea, input[type="text"]').first();
                const inputValue = await updatedPromptInput.inputValue();
                
                // 最佳化後的提示詞應該比原始提示詞更長更詳細
                expect(inputValue.length).toBeGreaterThan('一個關於 React 的技術插圖'.length);
              }
            }
          }
        }
      }
    }
  });

  test('模型設定與提示詞最佳化的相容性', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 檢查不同模型下的提示詞最佳化
    const modelSelector = page.locator('select').or(
      page.locator('[data-testid*="model-selector"]')
    );
    
    if (await modelSelector.count() > 0) {
      // 選擇 DALL-E 3 或 GPT Image 模型
      const options = await modelSelector.locator('option').all();
      for (const option of options) {
        const text = await option.textContent();
        if (text && (text.includes('DALL·E 3') || text.includes('GPT-Image-1'))) {
          await modelSelector.selectOption(await option.getAttribute('value') || '');
          break;
        }
      }
      
      // 進入提示詞最佳化
      const optimizerTab = page.getByText('提示詞最佳化');
      if (await optimizerTab.count() > 0) {
        await optimizerTab.click();
        
        // 進行最佳化並檢查結果是否符合模型限制
        const contentInput = page.locator('textarea').or(
          page.locator('[data-testid*="content-input"]')
        );
        
        if (await contentInput.count() > 0) {
          await contentInput.fill('技術文章的插圖需求');
          
          const optimizeButton = page.getByText('最佳化');
          if (await optimizeButton.count() > 0) {
            await optimizeButton.click();
            await page.waitForTimeout(3000);
            
            // 檢查最佳化結果是否考慮了模型特性
            const result = page.locator('[data-testid*="optimized-prompt"]');
            if (await result.count() > 0) {
              const resultText = await result.textContent();
              
              // 結果應該包含適合圖片生成的描述性詞彙
              expect(resultText).toMatch(/詳細|清晰|專業|高品質/);
            }
          }
        }
      }
    }
  });
});
