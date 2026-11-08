/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_IMAGE_MODE?: "reference" | "personal";
  readonly PUBLIC_BUILD_SHA?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
