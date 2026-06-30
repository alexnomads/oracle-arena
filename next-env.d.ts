/// <reference types="next" />
/// <reference types="next/image-types/global" />

// Since lib.dom.d.ts and next-env.d.ts both define window and document, we need to
// extend them rather than overwrite them.
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | string[] | undefined;
    }
  }

  interface ImportMeta {
    env: ProcessEnv;
  }
}

export {};
