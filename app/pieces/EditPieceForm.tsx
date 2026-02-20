"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { updatePiece } from "@/app/actions";
import type { Piece, Proficiency } from "@/lib/types";
import { PROFICIENCY_LEVELS } from "@/lib/types";
import { Link } from "@/components/Link";

const PROFICIENCY_LABELS: Record<Proficiency, string> = {
  new: "New",
  struggling: "Struggling",
  learning: "Learning",
  comfortable: "Comfortable",
  very_proficient: "Very proficient",
};

export function EditPieceForm({ piece }: { piece: Piece }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const title = (form.elements.namedItem("edit-title") as HTMLInputElement).value;
    const proficiency = (form.elements.namedItem("edit-proficiency") as HTMLSelectElement)
      .value as Proficiency;
    const troubleNotes = (form.elements.namedItem("edit-troubleNotes") as HTMLTextAreaElement).value;
    const goalBpmRaw = (form.elements.namedItem("edit-goalBpm") as HTMLInputElement).value;
    const currentCleanBpmRaw = (form.elements.namedItem("edit-currentCleanBpm") as HTMLInputElement)
      .value;
    const goalBpm = goalBpmRaw ? Number(goalBpmRaw) : null;
    const currentCleanBpm = currentCleanBpmRaw ? Number(currentCleanBpmRaw) : null;
    setLoading(true);
    await updatePiece(piece.id, {
      title: title.trim(),
      proficiency,
      troubleNotes: troubleNotes.trim(),
      goalBpm,
      currentCleanBpm,
    });
    router.refresh();
    const q = searchParams.toString();
    router.push(q ? `/pieces?${q}` : "/pieces");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <div style={fieldStyle}>
        <label htmlFor="edit-title">Title</label>
        <input
          id="edit-title"
          name="edit-title"
          defaultValue={piece.title}
          required
          style={inputStyle}
        />
      </div>
      <div style={fieldStyle}>
        <label htmlFor="edit-proficiency">Proficiency</label>
        <select
          id="edit-proficiency"
          name="edit-proficiency"
          defaultValue={piece.proficiency}
          style={inputStyle}
        >
          {PROFICIENCY_LEVELS.map((p) => (
            <option key={p} value={p}>
              {PROFICIENCY_LABELS[p]}
            </option>
          ))}
        </select>
      </div>
      <div style={fieldStyle}>
        <label htmlFor="edit-troubleNotes">Trouble notes (Wall of Pain)</label>
        <textarea
          id="edit-troubleNotes"
          name="edit-troubleNotes"
          defaultValue={piece.troubleNotes}
          rows={3}
          style={textareaStyle}
        />
      </div>
      <div style={rowStyle}>
        <div style={fieldStyle}>
          <label htmlFor="edit-goalBpm">Goal BPM</label>
          <input
            id="edit-goalBpm"
            name="edit-goalBpm"
            type="number"
            min={1}
            defaultValue={piece.goalBpm ?? ""}
            style={inputStyle}
          />
        </div>
        <div style={fieldStyle}>
          <label htmlFor="edit-currentCleanBpm">Current clean BPM</label>
          <input
            id="edit-currentCleanBpm"
            name="edit-currentCleanBpm"
            type="number"
            min={1}
            defaultValue={piece.currentCleanBpm ?? ""}
            style={inputStyle}
          />
        </div>
      </div>
      <div style={buttonRowStyle}>
        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? "Saving…" : "Save"}
        </button>
        <Link href="/pieces" style={linkStyle}>
          Cancel
        </Link>
      </div>
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

const rowStyle: React.CSSProperties = {
  display: "flex",
  gap: "1rem",
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
};

const buttonRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
};

const linkStyle: React.CSSProperties = {
  color: "#0066cc",
  fontSize: "0.95rem",
};
