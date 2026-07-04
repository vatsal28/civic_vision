
export interface FilterOption {
  id: string;
  icon: string;
  label: string;
  description: string;
  promptFragment: string;
  isDefault?: boolean;
  category?: FilterCategory;
}

export interface GeneratedImageResult {
  imageUrl: string;
  error?: string;
}

export enum AppState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  READY = 'READY',
  GENERATING = 'GENERATING',
  COMPARING = 'COMPARING'
}

export enum AppMode {
  CITY = 'CITY',
  HOME = 'HOME'
}

export type FilterCategory = 'roomType' | 'style' | 'colors' | 'furniture' | 'architectural';
