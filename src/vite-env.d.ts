/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** GA4 measurement id, e.g. G-XXXXXXXXXX. Unset → analytics stays off. */
  readonly VITE_GA_ID?: string;
  /** 'true' to also measure localhost sessions while debugging. */
  readonly VITE_GA_DEBUG?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
