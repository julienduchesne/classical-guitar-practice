"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updatePlaytimeSession } from "@/app/actions";
import { Link } from "@/components/Link";
import type { PlaytimeSession } from "@/lib/types";
import styles from "./Playtime.module.css";

/** Convert UTC ISO string to datetime-local input value in local time. */
function toLocalDatetimeValue(iso: string): string {
  const d = new Date(iso);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function EditPlaytimeForm({ session }: { session: PlaytimeSession }) {
  const [startTime, setStartTime] = useState(() =>
    toLocalDatetimeValue(session.startTime)
  );
  const [endTime, setEndTime] = useState(() =>
    session.endTime ? toLocalDatetimeValue(session.endTime) : ""
  );
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await updatePlaytimeSession(session.id, {
        startTime: new Date(startTime).toISOString(),
        endTime: endTime ? new Date(endTime).toISOString() : null,
      });
      router.push("/playtime");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="startTime">Start time</label>
        <input
          id="startTime"
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="endTime">End time (leave blank if in progress)</label>
        <input
          id="endTime"
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>
      <div className={styles.formActions}>
        <button type="submit" className={styles.saveButton} disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </button>
        <Link href="/playtime" className={styles.cancelLink}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
