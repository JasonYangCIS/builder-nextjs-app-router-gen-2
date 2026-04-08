"use client";

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import Link from "next/link";
import type { AnnouncementBarProps } from "./AnnouncementBar.types";
import styles from "./AnnouncementBar.module.scss";

export type { AnnouncementBarProps } from "./AnnouncementBar.types";

// Use useLayoutEffect on the client (runs before paint, avoids dismissed-user flash)
// and useEffect on the server (no-op, avoids SSR warning).
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

/**
 * Validates and sanitizes a URL from Builder content.
 * Rejects javascript: and other non-http(s) protocols.
 * Allows relative paths (/foo, #anchor).
 */
function sanitizeCtaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  // Reject protocol-relative URLs (//evil.com) — they resolve as external but
  // bypass the https? check and lose noopener protection.
  if ((url.startsWith("/") && !url.startsWith("//")) || url.startsWith("#")) return url;
  try {
    const { protocol } = new URL(url);
    if (protocol === "http:" || protocol === "https:") return url;
  } catch {
    // Malformed URL — discard
  }
  return null;
}

function isExternalUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

function getTimeRemaining(targetDate: string): TimeRemaining {
  const target = new Date(targetDate).getTime();

  // Guard against invalid date strings (would otherwise produce NaN everywhere)
  if (isNaN(target)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  const diff = target - Date.now();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, expired: false };
}

function formatTimeRemaining(remaining: TimeRemaining): string {
  const { days, hours, minutes, seconds } = remaining;
  const pad = (n: number) => String(n).padStart(2, "0");

  if (days > 0) {
    return `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
  }
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export default function AnnouncementBar({
  message,
  ctaLabel,
  ctaUrl,
  backgroundPreset,
  backgroundColor,
  textColor,
  countdownEnabled,
  countdownTargetDate,
  countdownLabel,
  dismissKey,
}: AnnouncementBarProps) {
  // Start as false (bar visible) so the server renders the bar in the initial HTML.
  // useIsomorphicLayoutEffect will sync-hide it before first paint if already dismissed.
  const [dismissed, setDismissed] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const storageKey = dismissKey ? `announcement-dismissed-${dismissKey}` : null;

  // Runs before first paint on the client — prevents dismissed-user flash without CLS.
  useIsomorphicLayoutEffect(() => {
    if (storageKey && localStorage.getItem(storageKey) === "true") {
      setDismissed(true);
    }
  }, [storageKey]);

  // Countdown ticker — guarded by dismissed so the interval never starts for
  // users who were already dismissed before passive effects ran. Adding dismissed
  // to deps also means the cleanup function fires when the user actively dismisses,
  // stopping the interval without needing a separate dismissed-watcher effect.
  const startCountdown = useCallback(() => {
    if (!countdownEnabled || !countdownTargetDate) return;

    const tick = () => {
      const remaining = getTimeRemaining(countdownTargetDate);
      setTimeRemaining(remaining);
      if (remaining.expired && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    tick();
    intervalRef.current = setInterval(tick, 1000);
  }, [countdownEnabled, countdownTargetDate]);

  useEffect(() => {
    if (dismissed) return;
    startCountdown();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [startCountdown, dismissed]);

  const handleDismiss = () => {
    if (storageKey) {
      localStorage.setItem(storageKey, "true");
    }
    setDismissed(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleDismiss();
    }
  };

  if (dismissed) return null;

  const safeCtaUrl = sanitizeCtaUrl(ctaUrl);
  const showCountdown =
    countdownEnabled &&
    countdownTargetDate &&
    timeRemaining &&
    !timeRemaining.expired;

  const inlineStyles: React.CSSProperties = {
    ...(backgroundColor ? { backgroundColor } : {}),
    ...(textColor ? { color: textColor } : {}),
  };

  const barClassName = [
    styles.bar,
    backgroundPreset === "purple" && !backgroundColor ? styles["bar--purple"] : "",
    backgroundPreset === "yellow" && !backgroundColor ? styles["bar--yellow"] : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    // suppressHydrationWarning prevents React from complaining about the
    // server (dismissed=false → rendered) vs client (dismissed=true → null) mismatch
    // for users who have already dismissed the bar.
    <div
      role="complementary"
      aria-label="Announcement"
      className={barClassName}
      style={inlineStyles}
      onKeyDown={handleKeyDown}
      suppressHydrationWarning
    >
      <div className={styles.content}>
        {message && <p className={styles.message}>{message}</p>}

        {showCountdown && (
          <>
            {message && <span className={styles.divider} aria-hidden="true">·</span>}
            <div className={styles.countdown} aria-live="off">
              <span
                className={styles.countdownTimer}
                aria-label={`Time remaining: ${formatTimeRemaining(timeRemaining!)}`}
              >
                {formatTimeRemaining(timeRemaining!)}
              </span>
              {countdownLabel && (
                <span className={styles.countdownLabel}>{countdownLabel}</span>
              )}
            </div>
          </>
        )}

        {ctaLabel && safeCtaUrl && (
          <>
            {(message || showCountdown) && (
              <span className={styles.divider} aria-hidden="true">·</span>
            )}
            <Link
              href={safeCtaUrl}
              className={styles.cta}
              {...(isExternalUrl(safeCtaUrl)
                ? { rel: "noopener noreferrer", target: "_blank" }
                : {})}
            >
              {ctaLabel}
            </Link>
          </>
        )}
      </div>

      <button
        type="button"
        className={styles.closeButton}
        onClick={handleDismiss}
        aria-label="Close announcement"
      >
        <svg
          className={styles.closeIcon}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
