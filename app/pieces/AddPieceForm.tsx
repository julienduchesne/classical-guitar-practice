"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { addPiece } from "@/app/actions";

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
    <form onSubmit={handleSubmit} style={formStyle}>
      <div style={fieldStyle}>
        <label htmlFor="add-title">Title</label>
        <input id="add-title" name="title" required style={inputStyle} />
      </div>
      <div style={fieldStyle}>
        <label htmlFor="add-trouble">Trouble notes (bar numbers, etc.)</label>
        <textarea id="add-trouble" name="troubleNotes" rows={2} style={textareaStyle} />
      </div>
      <div style={fieldStyle}>
        <label htmlFor="add-goalBpm">Goal BPM (optional)</label>
        <input id="add-goalBpm" name="goalBpm" type="number" min={1} style={inputStyle} />
      </div>
      <button type="submit" disabled={loading} style={buttonStyle}>
        {loading ? "Adding…" : "Add piece"}
      </button>
    </form>
  );
}

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
  maxWidth: "24rem",
};

const fieldStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
};

const inputStyle: React.CSSProperties = {
  padding: "0.4rem 0.5rem",
  fontSize: "1rem",
};

const textareaStyle: React.CSSProperties = {
  padding: "0.4rem 0.5rem",
  fontSize: "1rem",
  resize: "vertical",
};

const buttonStyle: React.CSSProperties = {
  padding: "0.5rem 0.75rem",
  fontSize: "1rem",
  cursor: "pointer",
  alignSelf: "flex-start",
};
