/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_URL: string;
  readonly VITE_GATE_HASH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
