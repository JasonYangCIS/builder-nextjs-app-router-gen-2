"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setClientUserAttributes } from "@builder.io/sdk-react";
import { Button } from "@/components/ui/Button/Button";
import { Text } from "@/components/ui/Text/Text";
import {
  TARGETING_CHANGE_EVENT,
  USER_TYPES,
  type TargetingAttributes,
  type UserType,
} from "@/utils/targeting";
import {
  DEFAULT_TARGETING_SOURCE_KEY,
  TARGETING_SOURCES,
} from "@/utils/targeting-source";
import type { TargetingDemoControlsProps } from "./TargetingDemoControls.types";

export type { TargetingDemoControlsProps } from "./TargetingDemoControls.types";

const ALL_SOURCES = Object.values(TARGETING_SOURCES);

export default function TargetingDemoControls(_props: TargetingDemoControlsProps = {}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [attrs, setAttrs] = useState<TargetingAttributes>({});

  // Load current attributes on mount via the default source.
  useEffect(() => {
    let active = true;
    TARGETING_SOURCES[DEFAULT_TARGETING_SOURCE_KEY]
      .load()
      .then((a) => active && setAttrs(a))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Sync attrs into the Builder SDK's user-attributes service so client-side
  // Personalization Containers re-evaluate variants without a full reload.
  useEffect(() => {
    setClientUserAttributes(attrs);
  }, [attrs]);

  // Notify consumers AFTER the writes land. router.refresh() additionally re-runs
  // the server for the SSR/PPR demo routes that read the session server-side.
  const notifyChange = () => {
    window.dispatchEvent(new Event(TARGETING_CHANGE_EVENT));
    router.refresh();
  };

  // Write through EVERY source so all demo routes stay in sync regardless of
  // which source they read from (cookie route vs session routes).
  const persist = async (next: TargetingAttributes) => {
    setAttrs(next); // optimistic
    await Promise.all(ALL_SOURCES.map((s) => s.set(next)));
    notifyChange();
  };

  const toggleLoggedIn = () => {
    void persist({ ...attrs, isLoggedIn: !attrs.isLoggedIn });
  };

  const setUserType = (userType: UserType | undefined) => {
    void persist({ ...attrs, userType });
  };

  const reset = async () => {
    setAttrs({});
    await Promise.all(ALL_SOURCES.map((s) => s.clear()));
    notifyChange();
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

      <Button type="button" size="sm" variant="ghost" onClick={() => void reset()}>
        Reset
      </Button>
    </div>
  );
}
