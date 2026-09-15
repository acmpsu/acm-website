export const EVENT_CATEGORIES = ["workshop", "social", "gbm"] as const;
export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: EventCategory | null;
};

export const categoryStyles: Record<
  EventCategory,
  { bg: string; badge: string; dot: string; label: string }
> = {
  workshop: {
    label: "Workshop",
    bg: "bg-[#eef2fa]",
    badge: "bg-[#d5deef] text-[var(--navy)]",
    dot: "bg-[var(--navy)]",
  },
  social: {
    label: "Social",
    bg: "bg-[#e8f5f3]",
    badge: "bg-[#cfe8e4] text-[#1d6b62]",
    dot: "bg-[#2a9d8f]",
  },
  gbm: {
    label: "GBM",
    bg: "bg-[#f7e8ec]",
    badge: "bg-[#efd0d8] text-[#7a2438]",
    dot: "bg-[#9b2f4a]",
  },
};
