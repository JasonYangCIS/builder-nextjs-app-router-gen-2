"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button/Button";
import { Text } from "@/components/ui/Text/Text";
import { Badge } from "@/components/ui/Badge/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card/Card";
import Counter from "@/components/Counter/Counter";
import type { ServerClientBoundaryDemoProps } from "./ServerClientBoundaryDemo.types";

export type { ServerClientBoundaryDemoProps } from "./ServerClientBoundaryDemo.types";

export default function ServerClientBoundaryDemo({ renderedAt }: ServerClientBoundaryDemoProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [refreshCount, setRefreshCount] = useState(0);

  const refreshServer = () => {
    setRefreshCount((c) => c + 1);
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <Button type="button" onClick={refreshServer} disabled={isPending} className="w-fit">
        {isPending ? "Re-running server…" : "Re-run the server, don't reload the page"}
      </Button>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle>
                <Text variant="h5" as="h3">Server Component</Text>
              </CardTitle>
              <Badge variant="outline">re-ran {refreshCount}×</Badge>
            </div>
            <CardDescription>
              This value is computed on the server, inside the page's render function.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Text variant="display" as="p" className="text-3xl tabular-nums">
              {renderedAt}
            </Text>
            <Text variant="caption" color="muted" as="p" className="mt-2">
              Every click above asks the server to re-render this page from scratch. The timestamp
              moves because the server function genuinely ran again.
            </Text>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <Text variant="h5" as="h3">Client Component</Text>
            </CardTitle>
            <CardDescription>
              Hydrated once, then lives entirely in your browser.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Counter initialCount={0} />
            <Text variant="caption" color="muted" as="p" className="mt-3">
              Click the counter a few times, then hit the button above. The server re-ran — but the
              count doesn't reset, because the server has no idea this component even has state. A
              full browser reload (not shown here) WOULD reset it, since that remounts everything.
            </Text>
          </CardContent>
        </Card>
      </div>

      <Text variant="body-sm" color="muted" as="p">
        This is the whole point of cacheComponents: it decides whether that server-side work (the
        timestamp, or a Builder <code className="rounded bg-muted px-1 py-0.5 text-xs">fetchOneEntry</code> call)
        re-runs on every request or gets reused from a cache. It has no effect on the counter — Client
        Components were never part of that caching decision.
      </Text>
    </div>
  );
}
