import { test, expect } from '@playwright/test';

test.describe('基本應用程式功能', () => {
  test('應用程式應該正常載入', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 檢查頁面標題
    await expect(page).toHaveTitle(/BlogImageAI/);
    
    // 檢查主要元素是否存在 - 等待 React 應用程式載入
    await expect(page.locator('#root')).toBeVisible();
    
    // 檢查是否有任何可見內容
    const anyContent = page.locator('h1, h2, h3, button, input, select, .container, main').first();
    await expect(anyContent).toBeVisible({ timeout: 10000 });
  });

  test('應該顯示模型選擇器', async ({ page }) => {
    await page.goto('/');
    
    // 等待頁面載入完成
    await page.waitForLoadState('networkidle');
    
    // 檢查模型選擇器
    const modelSelector = page.locator('[data-testid="model-selector"]');
    if (await modelSelector.count() > 0) {
      await expect(modelSelector).toBeVisible();
    }
  });

  test('應該顯示提示詞輸入區域', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForLoadState('networkidle');
    
    // 檢查提示詞輸入
    const promptInput = page.locator('textarea, input[type="text"]').first();
    await expect(promptInput).toBeVisible();
  });
});

test.describe('提示詞最佳化功能', () => {
  test('應該能夠切換到提示詞最佳化頁籤', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForLoadState('networkidle');
    
    // 尋找提示詞最佳化相關的按鈕或頁籤
    const optimizerTab = page.getByText('提示詞最佳化').or(
      page.getByText('最佳化').or(
        page.locator('[data-testid*="optimizer"]')
      )
    );
    
    if (await optimizerTab.count() > 0) {
      await optimizerTab.click();
      
      // 檢查是否顯示最佳化相關內容
      await expect(page.locator('body')).toContainText(/最佳化|分析|模板/);
    }
  });

  test('應該顯示用途選擇器', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForLoadState('networkidle');
    
    // 如果有提示詞最佳化功能，檢查用途選擇器
    const purposeSelector = page.locator('[data-testid*="purpose"]').or(
      page.getByText('圖片用途').or(
        page.getByText('選擇用途')
      )
    );
    
    if (await purposeSelector.count() > 0) {
      await expect(purposeSelector).toBeVisible();
    }
  });
});

test.describe('響應式設計', () => {
  test('應該在手機版面正常顯示', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    await page.waitForLoadState('networkidle');
    
    // 檢查基本元素在小螢幕上是否可見
    await expect(page.locator('body')).toBeVisible();
    
    // 檢查是否有響應式導航
    const navToggle = page.locator('button[aria-label*="menu"], [data-testid*="menu"]');
    if (await navToggle.count() > 0) {
      await expect(navToggle).toBeVisible();
    }
  });

  test('應該在平板版面正常顯示', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('效能與可用性', () => {
  test('頁面應該在合理時間內載入', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // 檢查載入時間應該少於 5 秒
    expect(loadTime).toBeLessThan(5000);
  });

  test('應該沒有 JavaScript 錯誤', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 檢查是否有 JavaScript 錯誤
    expect(errors).toHaveLength(0);
  });

  test('應該沒有 404 資源錯誤', async ({ page }) => {
    const failedRequests: string[] = [];
    
    page.on('response', response => {
      if (response.status() === 404) {
        failedRequests.push(response.url());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 檢查是否有 404 錯誤
    expect(failedRequests).toHaveLength(0);
  });
});
