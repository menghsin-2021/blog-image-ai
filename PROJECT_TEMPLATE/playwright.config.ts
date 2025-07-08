import { defineConfig, devices } from '@playwright/test'

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // 測試目錄
  testDir: './tests/e2e',
  
  // 並行執行測試
  fullyParallel: true,
  
  // 在 CI 環境中不允許測試失敗
  forbidOnly: !!process.env.CI,
  
  // CI 環境中的重試次數
  retries: process.env.CI ? 2 : 0,
  
  // 並行執行的 worker 數量
  workers: process.env.CI ? 1 : undefined,
  
  // 測試報告設定
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
    process.env.CI ? ['github'] : ['list']
  ],
  
  // 全域測試設定
  use: {
    // 基本設定
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    // 瀏覽器設定
    headless: process.env.CI ? true : false,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    // 截圖設定
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    
    // 等待設定
    actionTimeout: 10000,
    navigationTimeout: 30000,
    
    // 其他設定
    locale: 'zh-TW',
    timezoneId: 'Asia/Taipei',
    
    // 自動等待
    waitForLoadState: 'networkidle'
  },

  // 測試專案設定 - 不同瀏覽器和裝置
  projects: [
    // 桌面瀏覽器
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // 行動裝置
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    // 平板裝置
    {
      name: 'Tablet',
      use: { ...devices['iPad Pro'] },
    },

    // Microsoft Edge
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },

    // Google Chrome (有狀態測試)
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],

  // 開發伺服器設定 (可選)
  webServer: process.env.CI ? undefined : {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  // 輸出目錄
  outputDir: 'test-results',
  
  // 測試匹配模式
  testMatch: [
    '**/*.{test,spec}.{js,ts}',
    '**/tests/e2e/**/*.{test,spec}.{js,ts}'
  ],
  
  // 忽略檔案
  testIgnore: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**'
  ],

  // 全域設定
  globalSetup: './tests/global-setup.ts',
  globalTeardown: './tests/global-teardown.ts',

  // 預期設定
  expect: {
    // 自動等待時間
    timeout: 5000,
    // 截圖比較
    toHaveScreenshot: {
      mode: 'css',
      animations: 'disabled',
    },
    toMatchSnapshot: {
      threshold: 0.2,
      mode: 'css',
      animations: 'disabled',
    }
  },

  // 測試超時設定
  timeout: 30 * 1000,

  // 最大失敗數
  maxFailures: process.env.CI ? 10 : undefined,

  // 元資料
  metadata: {
    project: '{{PROJECT_NAME}}',
    version: '{{PROJECT_VERSION}}',
    environment: process.env.NODE_ENV || 'test'
  }
})
