"use client";

import { useEffect, useState } from "react";

/** Live wall-clock for a timezone. Renders a placeholder until mounted to avoid a hydration mismatch. */
export function LocalTime({ timeZone, label }: { timeZone: string; label: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return (
    <time className="tabular-nums" suppressHydrationWarning>
      {time ?? "--:--:--"} {label}
    </time>
  );
}
