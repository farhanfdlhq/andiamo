export enum Region {
  INDO_ITALI = "indo-itali",
  ITALI_INDO = "itali-indo",
}

export interface BatchOrder {
  id: string;
  title: string;
  region: Region;
  description: string; // Potentially rich text/markdown
  shortDescription: string;
  images: string[]; // URLs of images
  whatsappLink: string; // Full WhatsApp link
  status: "active" | "closed"; // Example status
  departureDate?: string; // Example additional field (YYYY-MM-DD)
  arrivalDate?: string; // Example additional field (YYYY-MM-DD)
}

export interface RegionFilterOption {
  value: Region | "all";
  label: string;
}

export interface AdminSettings {
  defaultWhatsAppNumber: string;
  defaultCTAMessage: string;
}