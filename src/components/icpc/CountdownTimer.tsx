"use client";

import { useState, useEffect } from "react";

const TARGET_DATE = new Date("2026-11-07T09:00:00-05:00");

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    function update() {
      const now = new Date();
      const diff = TARGET_DATE.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!timeLeft) return null;

  return (
    <div className="flex gap-3 sm:gap-5 justify-center">
      {(
        [
          { label: "Days", value: timeLeft.days },
          { label: "Hours", value: timeLeft.hours },
          { label: "Minutes", value: timeLeft.minutes },
          { label: "Seconds", value: timeLeft.seconds },
        ] as const
      ).map((item) => (
        <div
          key={item.label}
          className="rounded border border-gray-200 bg-white px-4 py-5 sm:px-6 sm:py-6 min-w-[72px] sm:min-w-[96px] text-center shadow-sm"
        >
          <div className="text-2xl sm:text-4xl font-bold text-gray-900 font-mono">
            {String(item.value).padStart(2, "0")}
          </div>
          <div className="text-[10px] sm:text-xs uppercase tracking-[0.2em] mt-1.5 text-gray-600 font-medium">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
