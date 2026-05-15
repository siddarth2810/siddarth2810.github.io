/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly BASE_URL: string;
  readonly PUBLIC_GOOGLE_SHEET_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
