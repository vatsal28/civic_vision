
export interface FilterOption {
  id: string;
  label: string;
  description: string;
  promptFragment: string;
  isDefault?: boolean;
}

export interface GeneratedImageResult {
  imageUrl: string;
  error?: string;
}

export enum AppState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING', // Processing initial upload
  READY = 'READY', // Image loaded, ready to generate
  GENERATING = 'GENERATING', // AI working
  COMPARING = 'COMPARING' // Showing results
}

export enum AuthMode {
  GUEST = 'GUEST', // Uses App's provided key with credit limits
  BYOK = 'BYOK'    // User provides their own key (Unlimited)
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}
