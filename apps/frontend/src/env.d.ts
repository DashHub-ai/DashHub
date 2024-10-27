/* eslint-disable ts/consistent-type-definitions */
/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly VITE_DIRECTUS_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
