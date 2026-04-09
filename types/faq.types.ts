/** Builder list subfield: one row per tag */
export interface FaqTag {
  tag?: string | null;
}

export interface FaqEntry {
  question?: string | null;
  answer?: string | null;
  tags?: FaqTag[] | null;
}
