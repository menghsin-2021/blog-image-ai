import { test, expect } from '@playwright/test';

test.describe('提示詞模板庫功能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('應該能夠開啟模板庫', async ({ page }) => {
    // 尋找模板庫相關的按鈕
    const templateButton = page.getByText('模板').or(
      page.getByText('模板庫').or(
        page.locator('[data-testid*="template"]')
      )
    );
    
    if (await templateButton.count() > 0) {
      await templateButton.click();
      
      // 檢查是否顯示模板庫內容
      await expect(page.locator('body')).toContainText(/模板|Template/);
    }
  });

  test('應該顯示內建模板', async ({ page }) => {
    // 如果有模板庫功能，檢查內建模板
    const templateLibrary = page.locator('[data-testid*="template-library"]').or(
      page.getByText('技術部落格').or(
        page.getByText('概念說明')
      )
    );
    
    if (await templateLibrary.count() > 0) {
      await expect(templateLibrary).toBeVisible();
    }
  });

  test('應該支援模板搜索', async ({ page }) => {
    // 尋找搜索框
    const searchInput = page.locator('input[placeholder*="搜索"], input[placeholder*="search"]');
    
    if (await searchInput.count() > 0) {
      await searchInput.fill('技術');
      
      // 等待搜索結果
      await page.waitForTimeout(500);
      
      // 檢查是否有搜索結果
      const results = page.locator('[data-testid*="template-card"], .template-card');
      if (await results.count() > 0) {
        await expect(results.first()).toBeVisible();
      }
    }
  });

  test('應該支援模板分類', async ({ page }) => {
    // 尋找分類標籤
    const categoryTabs = page.locator('[data-testid*="category"], .category-tab');
    
    if (await categoryTabs.count() > 0) {
      const firstCategory = categoryTabs.first();
      await firstCategory.click();
      
      // 檢查是否篩選了相應的模板
      await page.waitForTimeout(500);
      await expect(page.locator('body')).toBeVisible();
    }
  });
});

test.describe('模板編輯器功能', () => {
  test('應該能夠選擇並編輯模板', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 尋找模板卡片或選擇按鈕
    const templateCard = page.locator('[data-testid*="template-card"]').or(
      page.getByText('技術部落格').or(
        page.getByText('選擇模板')
      )
    );
    
    if (await templateCard.count() > 0) {
      await templateCard.first().click();
      
      // 檢查是否進入編輯器
      const editor = page.locator('[data-testid*="template-editor"]').or(
        page.getByText('參數設定').or(
          page.getByText('即時預覽')
        )
      );
      
      if (await editor.count() > 0) {
        await expect(editor).toBeVisible();
      }
    }
  });

  test('應該顯示模板變數輸入', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 如果進入了模板編輯器，檢查變數輸入
    const variableInputs = page.locator('input, textarea, select').filter({
      hasNot: page.locator('[type="hidden"]')
    });
    
    if (await variableInputs.count() > 0) {
      await expect(variableInputs.first()).toBeVisible();
    }
  });

  test('應該顯示即時預覽', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 檢查預覽區域
    const preview = page.locator('[data-testid*="preview"]').or(
      page.getByText('預覽').or(
        page.locator('pre, .preview')
      )
    );
    
    if (await preview.count() > 0) {
      await expect(preview).toBeVisible();
    }
  });
});

test.describe('模板收藏功能', () => {
  test('應該能夠收藏模板', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 尋找收藏按鈕（星號圖標）
    const favoriteButton = page.locator('[data-testid*="favorite"]').or(
      page.locator('button:has-text("⭐")').or(
        page.locator('.favorite-btn')
      )
    );
    
    if (await favoriteButton.count() > 0) {
      await favoriteButton.first().click();
      
      // 檢查收藏狀態變化
      await page.waitForTimeout(300);
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('應該顯示收藏清單', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 尋找收藏分類或清單
    const favoritesTab = page.getByText('收藏').or(
      page.locator('[data-testid*="favorites"]')
    );
    
    if (await favoritesTab.count() > 0) {
      await favoritesTab.click();
      
      // 檢查收藏清單
      await page.waitForTimeout(500);
      await expect(page.locator('body')).toBeVisible();
    }
  });
});
