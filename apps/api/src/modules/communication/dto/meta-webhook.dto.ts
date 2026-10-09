export interface MetaProfile {
  name: string;
}

export interface MetaContact {
  profile: MetaProfile;
  wa_id: string;
}

export interface MetaText {
  body: string;
}

export interface MetaMedia {
  id: string;
  mime_type?: string;
  sha256?: string;
  caption?: string;
}

export interface MetaMessage {
  from: string;
  id: string;
  timestamp: string;
  type: "text" | "image" | "document" | "audio" | "video" | "sticker" | "location" | "interactive" | string;
  text?: MetaText;
  image?: MetaMedia;
  document?: MetaMedia;
  audio?: MetaMedia;
  video?: MetaMedia;
}

export interface MetaStatus {
  id: string;
  status: "sent" | "delivered" | "read" | "failed";
  timestamp: string;
  recipient_id: string;
  errors?: Array<{ code: number; title: string }>;
}

export interface MetaValue {
  messaging_product: string;
  metadata: {
    display_phone_number: string;
    phone_number_id: string;
  };
  contacts?: MetaContact[];
  messages?: MetaMessage[];
  statuses?: MetaStatus[];
}

export interface MetaChange {
  value: MetaValue;
  field: string;
}

export interface MetaEntry {
  id: string;
  changes: MetaChange[];
}

export interface MetaWebhookPayload {
  object: string;
  entry: MetaEntry[];
}

export interface ExtractedLeadIntelligence {
  intent?: "HIGH" | "MEDIUM" | "LOW";
  budget?: string;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  sentiment?: "Positive" | "Neutral" | "Negative";
  urgency?: "Immediate" | "Flexible" | "Dormant";
  buyingIntent?: string;
  nationality?: string;
  purpose?: "Investment" | "End-user";
}
