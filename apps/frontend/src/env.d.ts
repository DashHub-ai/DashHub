/* eslint-disable ts/consistent-type-definitions */
/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PUBLIC_VITE_DIRECTUS_URL: string;
  readonly PUBLIC_VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
