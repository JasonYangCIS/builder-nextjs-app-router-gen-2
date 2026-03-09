"use client";
import { useState } from "react";
import { Button } from "@/components/design-system";

interface CounterProps {
  initialCount?: number;
}

function Counter({ initialCount = 99 }: CounterProps) {
  const [count, setCount] = useState(initialCount);

  return (
    <div className="inline-flex items-center gap-4">
      <Button
        variant="secondary"
        size="sm"
        label="−"
        aria-label="Decrement"
        onClick={() => setCount((c) => c - 1)}
      />
      <span className="w-10 text-center text-xl font-semibold tabular-nums text-zinc-900">
        {count}
      </span>
      <Button
        variant="secondary"
        size="sm"
        label="+"
        aria-label="Increment"
        onClick={() => setCount((c) => c + 1)}
      />
    </div>
  );
}

export default Counter;
