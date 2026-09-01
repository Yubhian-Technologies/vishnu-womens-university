// `mammoth` ships no TypeScript types of its own and there's no @types
// package for it — this declares just the browser-input shape this repo
// actually uses (see src/lib/placementsImport.ts).
declare module 'mammoth' {
  export interface MammothMessage {
    type: string;
    message: string;
  }

  export interface MammothResult {
    value: string;
    messages: MammothMessage[];
  }

  export function convertToHtml(input: { arrayBuffer: ArrayBuffer }): Promise<MammothResult>;
}
