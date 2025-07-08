import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/',
        'build/',
        'coverage/',
        '**/__tests__/**',
        '**/*.test.*',
        '**/*.spec.*'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },
    // 測試檔案匹配模式
    include: [
      '**/__tests__/**/*.{test,spec}.{js,ts,tsx}',
      '**/*.{test,spec}.{js,ts,tsx}'
    ],
    // 排除檔案
    exclude: [
      'node_modules',
      'dist',
      'build',
      '.git',
      '.github'
    ],
    // 測試超時設定
    testTimeout: 10000,
    hookTimeout: 10000,
    // 並行測試設定
    threads: true,
    maxThreads: 4,
    minThreads: 1,
    // 監視模式設定
    watch: {
      ignore: ['**/dist/**', '**/build/**', '**/coverage/**']
    },
    // 報告設定
    reporters: ['verbose'],
    // 快照設定
    resolveSnapshotPath: (testPath, snapExtension) => {
      return testPath.replace(/\.test\./, '.snap.') + snapExtension
    }
  },
  // 解析設定
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@utils': '/src/utils',
      '@services': '/src/services',
      '@types': '/src/types',
      '@hooks': '/src/hooks'
    }
  },
  // 定義全域變數
  define: {
    __TEST__: true,
    __DEV__: true
  }
})
