"use client";

import { useRouter } from "next/navigation";
import { Link } from "@/components/Link";
import { recordPlay } from "@/app/actions";
import type { Piece, Proficiency } from "@/lib/types";

const PROFICIENCY_LABELS: Record<Proficiency, string> = {
  new: "New",
  struggling: "Struggling",
  learning: "Learning",
  comfortable: "Comfortable",
  very_proficient: "Very proficient",
};

export function PieceList({
  pieces,
  editId,
}: {
  pieces: Piece[];
  editId: string | null;
}) {
  const router = useRouter();

  async function handleMarkPlayed(id: string) {
    await recordPlay(id);
    router.refresh();
  }

  if (pieces.length === 0) {
    return <p style={{ color: "#666" }}>No pieces yet. Add one above.</p>;
  }

  return (
    <ul style={listStyle}>
      {pieces.map((p) => (
        <li key={p.id} style={itemStyle}>
          <span style={titleCellStyle}>
            <strong>{p.title}</strong>
            {p.troubleNotes.trim() && (
              <span style={troubleBadgeStyle} title={p.troubleNotes}>
                trouble
              </span>
            )}
          </span>
          <span style={cellStyle}>{PROFICIENCY_LABELS[p.proficiency]}</span>
          <span style={cellStyle}>{p.lastPlayed ?? "—"}</span>
          <span style={cellStyle}>{p.playCount}</span>
          <span style={actionsStyle}>
            <button
              type="button"
              onClick={() => handleMarkPlayed(p.id)}
              style={buttonStyle}
            >
              Mark as played
            </button>
            {editId !== p.id ? (
              <Link href={`/pieces?edit=${p.id}`} style={linkStyle}>
                Edit
              </Link>
            ) : (
              <span style={mutedStyle}>(editing)</span>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

const listStyle: React.CSSProperties = {
  listStyle: "none",
  margin: 0,
  padding: 0,
};

const itemStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr auto auto auto auto",
  gap: "0.75rem",
  alignItems: "center",
  padding: "0.5rem 0",
  borderBottom: "1px solid #eee",
};

const titleCellStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
};

const cellStyle: React.CSSProperties = {
  fontSize: "0.9rem",
  color: "#555",
};

const troubleBadgeStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  padding: "0.1rem 0.35rem",
  backgroundColor: "#f0e0e0",
  borderRadius: "3px",
};

const actionsStyle: React.CSSProperties = {
  display: "flex",
  gap: "0.5rem",
  alignItems: "center",
};

const buttonStyle: React.CSSProperties = {
  padding: "0.25rem 0.5rem",
  fontSize: "0.875rem",
  cursor: "pointer",
};

const linkStyle: React.CSSProperties = {
  fontSize: "0.875rem",
  color: "#0066cc",
};

const mutedStyle: React.CSSProperties = {
  fontSize: "0.875rem",
  color: "#999",
};
