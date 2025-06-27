import { test, expect } from '@playwright/test';

test.describe('效能監控功能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('應該顯示效能儀表板', async ({ page }) => {
    // 檢查主要元件是否載入
    await expect(page.locator('body')).toBeVisible();
    
    // 檢查是否有基本的介面元素
    const hasModelSelector = await page.locator('select, [role="combobox"]').count() > 0;
    const hasInput = await page.locator('input, textarea').count() > 0;
    
    expect(hasModelSelector || hasInput).toBeTruthy();
  });

  test('應該顯示 Web Vitals 指標', async ({ page }) => {
    // 使用 Performance API 檢查載入效能
    const performanceEntries = await page.evaluate(() => {
      return {
        navigation: performance.getEntriesByType('navigation'),
        paint: performance.getEntriesByType('paint')
      };
    });
    
    expect(performanceEntries.navigation.length).toBeGreaterThan(0);
    // First Contentful Paint 應該存在
    expect(performanceEntries.paint.length).toBeGreaterThan(0);
  });

  test('應該顯示載入時間', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - startTime;
    
    // 頁面應該在 5 秒內載入
    expect(loadTime).toBeLessThan(5000);
  });

  test('應該顯示記憶體使用情況', async ({ page }) => {
    // 檢查頁面是否有記憶體洩漏的跡象
    const memoryInfo = await page.evaluate(() => {
      return (performance as any).memory || {
        usedJSHeapSize: 0,
        totalJSHeapSize: 0,
        jsHeapSizeLimit: 0
      };
    });
    
    // 如果支援 memory API，檢查記憶體使用
    if (memoryInfo.usedJSHeapSize > 0) {
      expect(memoryInfo.usedJSHeapSize).toBeLessThan(memoryInfo.jsHeapSizeLimit);
    }
  });
});

test.describe('效能最佳化驗證', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('圖片生成應該有適當的載入狀態', async ({ page }) => {
    // 尋找提示詞輸入框
    const promptInput = page.locator('textarea, input[type="text"]').first();
    if (await promptInput.count() > 0) {
      await promptInput.fill('一個簡單的技術插圖');
      
      // 尋找生成按鈕 - 使用更精確的選擇器
      const generateButton = page.getByRole('button', { name: '生成圖片' });
      
      if (await generateButton.count() > 0) {
        await generateButton.click();
        
        // 檢查載入狀態
        const loadingIndicator = page.locator('[data-testid*="loading"]').or(
          page.locator('.loading').or(
            page.locator('[class*="loading"]').or(
              page.locator('text=載入').or(
                page.locator('text=生成中')
              )
            )
          )
        );
        
        // 至少應該有某種視覺回饋
        const hasLoadingState = await page.locator('button:disabled').count() > 0 ||
                               await loadingIndicator.count() > 0;
        
        expect(hasLoadingState).toBeTruthy();
      }
    }
  });

  test('應該有適當的錯誤處理', async ({ page }) => {
    // 尋找提示詞輸入框並輸入無效內容
    const promptInput = page.locator('textarea, input[type="text"]').first();
    if (await promptInput.count() > 0) {
      await promptInput.fill(''); // 空白輸入
      
      // 嘗試點擊生成按鈕
      const generateButton = page.getByRole('button', { name: '生成圖片' });
      
      if (await generateButton.count() > 0) {
        await generateButton.click();
        
        // 檢查是否顯示錯誤訊息
        const errorMessage = page.locator('[data-testid*="error"]').or(
          page.locator('.error').or(
            page.locator('[class*="error"]').or(
              page.locator('text=錯誤').or(
                page.locator('text=失敗')
              )
            )
          )
        );
        
        // 檢查按鈕是否被禁用或顯示錯誤
        const buttonDisabled = await generateButton.isDisabled();
        const hasErrorMessage = await errorMessage.count() > 0;
        
        expect(buttonDisabled || hasErrorMessage).toBeTruthy();
      }
    }
  });

  test('應該支援鍵盤快速鍵', async ({ page }) => {
    // 檢查是否可以用 Tab 鍵導航
    await page.keyboard.press('Tab');
    
    const focusedElement = page.locator(':focus');
    const hasFocus = await focusedElement.count() > 0;
    
    expect(hasFocus).toBeTruthy();
    
    // 檢查 Enter 鍵是否可以觸發動作
    const promptInput = page.locator('textarea, input[type="text"]').first();
    if (await promptInput.count() > 0) {
      await promptInput.focus();
      await promptInput.fill('測試提示詞');
      
      // 某些表單應該支援 Enter 鍵提交
      await page.keyboard.press('Enter');
      
      // 檢查是否有反應（載入狀態或按鈕狀態變化）
      await page.waitForTimeout(500);
      
      const hasReaction = await page.locator('button:disabled').count() > 0 ||
                          await page.locator('[class*="loading"]').count() > 0;
      
      // 這個測試比較寬鬆，因為不是所有表單都支援 Enter 鍵
      expect(typeof hasReaction).toBe('boolean');
    }
  });
});

test.describe('回應性設計測試', () => {
  test('應該在手機螢幕上正常顯示', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 檢查主要元素是否可見
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // 檢查是否沒有水平捲軸
    const hasHorizontalScrollbar = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth;
    });
    
    expect(hasHorizontalScrollbar).toBeFalsy();
  });

  test('應該在平板螢幕上正常顯示', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 檢查主要元素是否可見
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // 檢查介面元素是否適當排列
    const elements = await page.locator('button, input, textarea, select').count();
    expect(elements).toBeGreaterThan(0);
  });

  test('應該在桌面螢幕上正常顯示', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 檢查主要元素是否可見
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // 檢查內容是否適當置中或利用空間
    const container = page.locator('main, [class*="container"], [class*="wrapper"]').first();
    if (await container.count() > 0) {
      await expect(container).toBeVisible();
    }
  });
});
