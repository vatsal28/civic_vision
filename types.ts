
export interface FilterOption {
  id: string;
  icon: string;  // Emoji icon for the filter
  label: string;
  description: string;
  promptFragment: string;
  isDefault?: boolean;
  category?: FilterCategory;  // For grouping filters in Home mode
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

export enum AppMode {
  CITY = 'CITY',   // Urban renewal / cityscape transformation
  HOME = 'HOME'    // Interior design / room decor transformation
}

export type FilterCategory = 'roomType' | 'style' | 'colors' | 'furniture' | 'architectural';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}
