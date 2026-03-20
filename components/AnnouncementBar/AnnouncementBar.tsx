"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { AnnouncementBarProps } from "./AnnouncementBar.types";
import styles from "./AnnouncementBar.module.scss";

export type { AnnouncementBarProps } from "./AnnouncementBar.types";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function getTimeRemaining(targetDate: string): TimeRemaining {
  const target = new Date(targetDate).getTime();
  const now = Date.now();
  const diff = target - now;

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
  backgroundColor,
  textColor,
  countdownEnabled,
  countdownTargetDate,
  countdownLabel,
  dismissKey,
}: AnnouncementBarProps) {
  // null = not yet determined (avoids SSR flash), false = visible, true = dismissed
  const [dismissed, setDismissed] = useState<boolean | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const storageKey = dismissKey ? `announcement-dismissed-${dismissKey}` : null;

  // On mount, check localStorage to avoid flash of bar then hide
  useEffect(() => {
    if (storageKey) {
      const stored = localStorage.getItem(storageKey);
      setDismissed(stored === "true");
    } else {
      setDismissed(false);
    }
  }, [storageKey]);

  // Countdown ticker
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
    startCountdown();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startCountdown]);

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

  // Render nothing until hydration resolves localStorage check (prevents layout shift)
  if (dismissed === null || dismissed === true) return null;

  const showCountdown =
    countdownEnabled &&
    countdownTargetDate &&
    timeRemaining &&
    !timeRemaining.expired;

  const inlineStyles: React.CSSProperties = {
    ...(backgroundColor ? { backgroundColor } : {}),
    ...(textColor ? { color: textColor } : {}),
  };

  return (
    <div
      role="complementary"
      aria-label="Announcement"
      className={styles.bar}
      style={inlineStyles}
      onKeyDown={handleKeyDown}
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

        {ctaLabel && ctaUrl && (
          <>
            {(message || showCountdown) && (
              <span className={styles.divider} aria-hidden="true">·</span>
            )}
            <a href={ctaUrl} className={styles.cta}>
              {ctaLabel}
            </a>
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
