"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { startPlaytimeSession, stopActivePlaytimeSession } from "@/app/actions";
import styles from "./Sidebar.module.css";

function formatElapsed(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function PlaytimeButton({
  activeStartTime: serverActiveStartTime,
}: {
  activeStartTime: string | null;
}) {
  const [activeStartTime, setActiveStartTime] = useState(serverActiveStartTime);
  const [elapsed, setElapsed] = useState(0);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isActive = activeStartTime !== null;

  // Sync with server prop when it changes (e.g. after router.refresh())
  useEffect(() => {
    setActiveStartTime(serverActiveStartTime);
  }, [serverActiveStartTime]);

  // Run elapsed timer while active
  useEffect(() => {
    if (!activeStartTime) {
      setElapsed(0);
      return;
    }
    const startMs = new Date(activeStartTime).getTime();
    const tick = () => setElapsed(Math.floor((Date.now() - startMs) / 1000));
    tick();
    intervalRef.current = setInterval(tick, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeStartTime]);

  function handleToggle() {
    startTransition(async () => {
      if (isActive) {
        await stopActivePlaytimeSession();
        setActiveStartTime(null);
      } else {
        await startPlaytimeSession();
        setActiveStartTime(new Date().toISOString());
      }
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      className={`${styles.playtimeButton} ${isActive ? styles.playtimeButtonActive : ""}`}
      disabled={pending}
      onClick={handleToggle}
    >
      {pending
        ? "…"
        : isActive
          ? `⏹ Stop Session (${formatElapsed(elapsed)})`
          : "▶ Start Session"}
    </button>
  );
}
