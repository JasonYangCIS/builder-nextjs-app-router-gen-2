"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CounterProps {
  initialCount?: number;
}

function Counter({ initialCount = 99 }: CounterProps) {
  const [count, setCount] = useState(initialCount);

  return (
    <div className="inline-flex items-center gap-4">
      <Button
        variant="outline"
        size="sm"
        aria-label="Decrement"
        onClick={() => setCount((c) => c - 1)}
      >
        −
      </Button>
      <span className="w-10 text-center text-xl font-semibold tabular-nums text-foreground">
        {count}
      </span>
      <Button
        variant="outline"
        size="sm"
        aria-label="Increment"
        onClick={() => setCount((c) => c + 1)}
      >
        +
      </Button>
    </div>
  );
}

export default Counter;
