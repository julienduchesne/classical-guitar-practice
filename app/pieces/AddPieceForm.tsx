"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { addPiece } from "@/app/actions";
import styles from "./Pieces.module.css";

export function AddPieceForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const troubleNotes = (form.elements.namedItem("troubleNotes") as HTMLTextAreaElement).value;
    const goalBpmRaw = (form.elements.namedItem("goalBpm") as HTMLInputElement).value;
    const goalBpm = goalBpmRaw ? Number(goalBpmRaw) : null;
    if (!title.trim()) return;
    setLoading(true);
    await addPiece({ title: title.trim(), troubleNotes: troubleNotes.trim() || undefined, goalBpm });
    form.reset();
    router.refresh();
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="add-title">Title</label>
        <input id="add-title" name="title" required />
      </div>
      <div className={styles.field}>
        <label htmlFor="add-trouble">Trouble notes (bar numbers, etc.)</label>
        <textarea id="add-trouble" name="troubleNotes" rows={2} />
      </div>
      <div className={styles.field}>
        <label htmlFor="add-goalBpm">Goal BPM (optional)</label>
        <input id="add-goalBpm" name="goalBpm" type="number" min={1} />
      </div>
      <button type="submit" disabled={loading} className={styles.primaryButton}>
        {loading ? "Adding…" : "Add piece"}
      </button>
    </form>
  );
}
