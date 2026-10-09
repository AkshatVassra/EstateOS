export type LeadTemperature = "HOT" | "WARM" | "COLD";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  status: string;
  temperature: LeadTemperature;
  score: number;
  budget: string;
  area: string;
  timeline: string;
  agent: string;
}

export interface Property {
  id: string;
  title: string;
  price: number;
  community: string;
  bedrooms: number;
  bathrooms: number;
  status: string;
  image: string;
  area?: number;
}

export const mockLeads: Lead[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    phone: "+971 50 123 4567",
    status: "Qualifying",
    temperature: "HOT",
    score: 93,
    budget: "AED 2.4M",
    area: "Dubai Hills",
    timeline: "30 days",
    agent: "Ali Hassan",
  },
  {
    id: "2",
    name: "Sarah Mitchell",
    phone: "+971 55 987 6543",
    status: "Viewing",
    temperature: "WARM",
    score: 68,
    budget: "AED 1.8M",
    area: "Marina",
    timeline: "60 days",
    agent: "Ali Hassan",
  },
  {
    id: "3",
    name: "Ahmed Al Farsi",
    phone: "+971 52 456 7890",
    status: "New",
    temperature: "COLD",
    score: 22,
    budget: "—",
    area: "—",
    timeline: "—",
    agent: "Unassigned",
  },
];

export const mockProperties: Property[] = [
  {
    id: "p1",
    title: "3BR Park View — Dubai Hills Estate",
    price: 2450000,
    community: "Dubai Hills",
    bedrooms: 3,
    bathrooms: 4,
    status: "Available",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  },
  {
    id: "p2",
    title: "2BR Creek Horizon",
    price: 1890000,
    community: "Dubai Creek Harbour",
    bedrooms: 2,
    bathrooms: 3,
    status: "Available",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  },
  {
    id: "p3",
    title: "4BR Villa — Arabian Ranches III",
    price: 5200000,
    community: "Arabian Ranches",
    bedrooms: 4,
    bathrooms: 5,
    status: "Reserved",
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
  },
];

export const commandCenterActions = [
  {
    id: "a1",
    priority: "urgent",
    title: "Hot buyer ready for viewing",
    description: "Rajesh Kumar (93%) — budget matches new Dubai Hills listing.",
    action: "Schedule viewing",
    href: "/leads/1",
  },
  {
    id: "a2",
    priority: "high",
    title: "Follow-up overdue",
    description: "Sarah Mitchell — no reply in 48h after Marina tour.",
    action: "Send follow-up",
    href: "/messages",
  },
  {
    id: "a3",
    priority: "medium",
    title: "3 messages need attention",
    description: "Average wait time exceeded 15 min SLA.",
    action: "Open inbox",
    href: "/messages",
  },
];
