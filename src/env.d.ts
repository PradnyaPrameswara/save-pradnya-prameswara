/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_IMAGE_MODE?: "reference" | "personal";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
