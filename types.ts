// Andiamo/types.ts

export enum Region {
  INDO_ITALI = "indo-itali",
  ITALI_INDO = "itali-indo",
}

export interface Batch {
  id: number;
  name: string;
  description?: string;
  shortDescription?: string;
  region?: Region | string;
  departure_date?: string; // YYYY-MM-DD
  arrival_date?: string; // YYYY-MM-DD (Pengganti duration_days)
  image_urls?: string[]; // Array of image paths/URLs (untuk multiple images)
  whatsappLink?: string;
  status?: "active" | "closed" | string;
  created_at?: string;
  updated_at?: string;
  // price dan quota dihapus
}

export interface RegionFilterOption {
  value: Region | "all";
  label: string;
}

export interface AdminSettings {
  defaultWhatsAppNumber: string;
  defaultCTAMessage: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}
