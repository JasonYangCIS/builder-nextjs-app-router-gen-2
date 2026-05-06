"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setClientUserAttributes } from "@builder.io/sdk-react";
import { Button } from "@/components/ui/Button/Button";
import { Text } from "@/components/ui/Text/Text";
import {
  parseTargeting,
  serializeTargeting,
  TARGETING_COOKIE,
  USER_TYPES,
  type TargetingAttributes,
  type UserType,
} from "@/utils/targeting";
import type { TargetingDemoControlsProps } from "./TargetingDemoControls.types";

export type { TargetingDemoControlsProps } from "./TargetingDemoControls.types";

function readCookie(): TargetingAttributes {
  if (typeof document === "undefined") return {};
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${TARGETING_COOKIE}=`));
  return parseTargeting(match?.slice(TARGETING_COOKIE.length + 1));
}

// SameSite=Lax is intentional: this cookie is only set from the main site (the
// panel is not mounted on /preview), so cross-site iframe delivery is not needed
// and Lax avoids broader exposure. No HttpOnly because the client must write it.
function cookieAttrs() {
  const isHttps = typeof location !== "undefined" && location.protocol === "https:";
  return `path=/; SameSite=Lax${isHttps ? "; Secure" : ""}`;
}

function writeCookie(value: TargetingAttributes) {
  if (typeof document === "undefined") return;
  document.cookie = `${TARGETING_COOKIE}=${serializeTargeting(value)}; ${cookieAttrs()}`;
}

export default function TargetingDemoControls(_props: TargetingDemoControlsProps = {}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [attrs, setAttrs] = useState<TargetingAttributes>(() => readCookie());

  // Sync attrs into the Builder SDK's user-attributes cookie so client-side
  // Personalization Containers re-evaluate variants without a full reload.
  useEffect(() => {
    setClientUserAttributes(attrs as Record<string, unknown>);
  }, [attrs]);

  const update = (next: TargetingAttributes) => {
    setAttrs(next);
    // document.cookie assignment is synchronous; the cookie is in the jar before
    // router.refresh() fires the next request, so no race here.
    writeCookie(next);
    setClientUserAttributes(next as Record<string, unknown>);
    router.refresh();
  };

  const toggleLoggedIn = () => {
    update({ ...attrs, isLoggedIn: !attrs.isLoggedIn });
  };

  const setUserType = (userType: UserType | undefined) => {
    update({ ...attrs, userType });
  };

  const reset = () => {
    document.cookie = `${TARGETING_COOKIE}=; ${cookieAttrs()}; Max-Age=0`;
    setAttrs({});
    setClientUserAttributes({});
    router.refresh();
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg hover:bg-primary/90"
        aria-label="Open targeting demo controls"
      >
        Targeting
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-50 w-80 rounded-lg border border-border bg-background p-4 shadow-xl"
      role="dialog"
      aria-label="Targeting demo controls"
    >
      <div className="mb-3 flex items-center justify-between">
        <Text variant="h6" as="h2">Targeting demo</Text>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Close targeting controls"
        >
          ×
        </button>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <span id="targeting-isLoggedIn-label" className="text-sm font-medium">
          isLoggedIn
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={!!attrs.isLoggedIn}
          aria-labelledby="targeting-isLoggedIn-label"
          onClick={toggleLoggedIn}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            attrs.isLoggedIn ? "bg-primary" : "bg-muted"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-background shadow transition-transform ${
              attrs.isLoggedIn ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      <div className="mb-4">
        <Text variant="label" as="p" className="mb-2">userType</Text>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={attrs.userType === undefined ? "default" : "outline"}
            onClick={() => setUserType(undefined)}
          >
            none
          </Button>
          {USER_TYPES.map((t) => (
            <Button
              key={t}
              type="button"
              size="sm"
              variant={attrs.userType === t ? "default" : "outline"}
              onClick={() => setUserType(t)}
            >
              {t}
            </Button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <Text variant="label" as="p" className="mb-1">userAttributes sent to Builder</Text>
        <pre className="overflow-auto rounded-md bg-muted p-2 text-xs text-foreground">
{JSON.stringify(attrs, null, 2)}
        </pre>
      </div>

      <Button type="button" size="sm" variant="ghost" onClick={reset}>
        Reset
      </Button>
    </div>
  );
}
