import type { FaqEntry } from "@/types/faq.types";

export interface FaqReference {
  faqEntry?: {
    id?: string | null;
    value?: { data?: FaqEntry | null } | null;
  } | null;
}

export interface FaqListProps {
  title?: string | null;
  faqItems?: FaqReference[] | null;
}
