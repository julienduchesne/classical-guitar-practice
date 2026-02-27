"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deletePracticeLogEntry } from "@/app/actions";
import styles from "./PracticeLog.module.css";

export function DeleteLogEntryButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      className={styles.deleteButton}
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await deletePracticeLogEntry(id);
          router.refresh();
        });
      }}
    >
      {pending ? "…" : "Delete"}
    </button>
  );
}
