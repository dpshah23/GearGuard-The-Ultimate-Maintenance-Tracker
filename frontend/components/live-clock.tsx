"use client";

import { useEffect, useState } from "react";
import { now, getLocalTimeZone } from "@internationalized/date";

/**
 * A perfectly-synced live clock using @internationalized/date.
 */
export function LiveClock({
  className = "",
  timeZone = getLocalTimeZone(),
  format = "en-US",
}: {
  className?: string;
  timeZone?: string;
  format?: string;
}) {
  const [current, setCurrent] = useState(() => now(timeZone));

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let timeoutId: NodeJS.Timeout;

    const syncClock = () => {
      // Step 1: Update immediately
      setCurrent(now(timeZone));

      // Step 2: Set interval that updates exactly every second
      intervalId = setInterval(() => {
        setCurrent(now(timeZone));
      }, 1000);
    };

    // Step 0: Find how many ms until the next full second
    const msUntilNextSecond = 1000 - new Date().getMilliseconds();

    // Wait just enough to align to the next second
    timeoutId = setTimeout(syncClock, msUntilNextSecond);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [timeZone]);

  const date = current.toDate();

  return (
    <span className={`font-mono ${className} text-nowrap`}>
      {date.toLocaleString(format, {
        dateStyle: "medium",
        timeStyle: "medium",
        timeZone,
      })}
    </span>
  );
}
