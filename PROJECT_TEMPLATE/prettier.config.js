/**
 * Prettier 配置檔案
 * @see https://prettier.io/docs/en/configuration.html
 */
export default {
  // 基本格式設定
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  
  // 行尾設定
  endOfLine: 'lf',
  
  // HTML 相關設定
  htmlWhitespaceSensitivity: 'css',
  
  // Vue 相關設定 (如果使用 Vue)
  vueIndentScriptAndStyle: false,
  
  // 嵌入語言格式化
  embeddedLanguageFormatting: 'auto',
  
  // 檔案類型特定設定
  overrides: [
    // JSON 檔案
    {
      files: '*.json',
      options: {
        parser: 'json',
        printWidth: 80,
      },
    },
    // Markdown 檔案
    {
      files: '*.md',
      options: {
        parser: 'markdown',
        printWidth: 80,
        proseWrap: 'preserve',
        singleQuote: false,
      },
    },
    // YAML 檔案
    {
      files: ['*.yml', '*.yaml'],
      options: {
        parser: 'yaml',
        tabWidth: 2,
        singleQuote: false,
      },
    },
    // CSS/SCSS 檔案
    {
      files: ['*.css', '*.scss', '*.less'],
      options: {
        parser: 'css',
        singleQuote: false,
      },
    },
    // HTML 檔案
    {
      files: '*.html',
      options: {
        parser: 'html',
        printWidth: 120,
        htmlWhitespaceSensitivity: 'ignore',
      },
    },
    // XML 檔案
    {
      files: '*.xml',
      options: {
        parser: 'html',
        xmlWhitespaceSensitivity: 'ignore',
      },
    },
    // TypeScript 配置檔案
    {
      files: 'tsconfig*.json',
      options: {
        parser: 'jsonc',
        trailingComma: 'none',
      },
    },
    // 套件配置檔案
    {
      files: 'package.json',
      options: {
        parser: 'json-stringify',
        tabWidth: 2,
      },
    },
    // Dockerfile
    {
      files: ['Dockerfile*', '*.dockerfile'],
      options: {
        parser: 'sh',
      },
    },
    // Shell 腳本
    {
      files: ['*.sh', '*.bash'],
      options: {
        parser: 'sh',
        tabWidth: 4,
      },
    },
    // GraphQL
    {
      files: ['*.graphql', '*.gql'],
      options: {
        parser: 'graphql',
      },
    },
    // SQL
    {
      files: '*.sql',
      options: {
        parser: 'sql',
        tabWidth: 4,
      },
    }
  ],
  
  // 插件設定 (如果需要)
  plugins: [
    // 'prettier-plugin-organize-imports',
    // 'prettier-plugin-packagejson',
  ],
  
  // 忽略檔案 (通常在 .prettierignore 中設定)
  // ignorePath: '.prettierignore',
}
