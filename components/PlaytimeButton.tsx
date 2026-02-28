"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { startPlaytimeSession, stopActivePlaytimeSession } from "@/app/actions";
import styles from "./Sidebar.module.css";

export function PlaytimeButton({ isActive: initialIsActive }: { isActive: boolean }) {
  const [isActive, setIsActive] = useState(initialIsActive);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

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
