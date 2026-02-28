"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { startPlaytimeSession, stopActivePlaytimeSession } from "@/app/actions";
import styles from "./Sidebar.module.css";

export function PlaytimeButton({ isActive: serverIsActive }: { isActive: boolean }) {
  const [isActive, setIsActive] = useState(serverIsActive);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  // Sync with server prop when it changes (e.g. after router.refresh())
  useEffect(() => {
    setIsActive(serverIsActive);
  }, [serverIsActive]);

  function handleToggle() {
    startTransition(async () => {
      if (isActive) {
        await stopActivePlaytimeSession();
        setIsActive(false);
      } else {
        await startPlaytimeSession();
        setIsActive(true);
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
      {pending ? "…" : isActive ? "⏹ Stop Session" : "▶ Start Session"}
    </button>
  );
}
