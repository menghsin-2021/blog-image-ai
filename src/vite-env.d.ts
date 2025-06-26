/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_MAX_RETRIES: string
  readonly VITE_DEFAULT_MODEL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
