export type AnnouncementBarBackgroundPreset = "default" | "purple" | "yellow";

export interface AnnouncementBarProps {
  message?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  backgroundPreset?: AnnouncementBarBackgroundPreset | null;
  backgroundColor?: string | null;
  textColor?: string | null;
  countdownEnabled?: boolean | null;
  countdownTargetDate?: string | null;
  countdownLabel?: string | null;
  dismissKey?: string | null;
}
