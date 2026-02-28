"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { addPiece } from "@/app/actions";
import styles from "./Pieces.module.css";

export function AddPieceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    if (!title.trim()) return;
    setLoading(true);
    await addPiece({ title: title.trim() });
    const password = searchParams.get("password");
    router.push(password ? `/pieces?password=${encodeURIComponent(password)}` : "/pieces");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="add-title">Title</label>
        <input id="add-title" name="title" required />
      </div>
      <button type="submit" disabled={loading} className={styles.primaryButton}>
        {loading ? "Adding…" : "Add piece"}
      </button>
    </form>
  );
}
