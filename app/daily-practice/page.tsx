import { Link } from "@/components/Link";

export const dynamic = "force-dynamic";
import {
  getTodayExercises,
  getNewPiece,
  getFamiliarPiecesDue,
} from "@/app/actions";
import { MarkAsPlayedButton } from "./MarkAsPlayedButton";
import { RegenerateExercisesButton } from "./RegenerateExercisesButton";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export default async function DailyPracticePage() {
  const date = today();
  const [todayData, newPiece, familiarPieces] = await Promise.all([
    getTodayExercises(date),
    getNewPiece(),
    getFamiliarPiecesDue(date),
  ]);

  return (
    <main style={{ padding: "1.5rem", maxWidth: "42rem" }}>
      <h1 style={{ marginTop: 0 }}>Daily practice</h1>

      <section style={sectionStyle}>
        <h2 style={h2Style}>1. Daily exercises (~15 min)</h2>
        <RegenerateExercisesButton date={date} />
        <ul style={listStyle}>
          {todayData.exercises.map((e) => (
            <li key={e.id} style={exerciseItemStyle}>
              <strong>{e.name}</strong>
              <span style={focusStyle}>{e.focus}</span>
            </li>
          ))}
        </ul>
        {todayData.exercises.length === 0 && (
          <p style={mutedStyle}>No exercises selected. Regenerate to pick some.</p>
        )}
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>2. New piece (15–20 min)</h2>
        {newPiece ? (
          <p style={pieceBlockStyle}>
            <strong>{newPiece.title}</strong>
            <br />
            <Link href={`/pieces?edit=${newPiece.id}`}>Edit / mark as played</Link>
          </p>
        ) : (
          <p style={mutedStyle}>
            No piece in progress.{" "}
            <Link href="/pieces">Pick or add a piece</Link> and set it as learning.
          </p>
        )}
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>3. Familiar pieces (~10 min)</h2>
        {familiarPieces.length > 0 ? (
          <ul style={listStyle}>
            {familiarPieces.map((p) => (
              <li key={p.id} style={familiarItemStyle}>
                <span>
                  <strong>{p.title}</strong>
                  {p.lastPlayed && (
                    <span style={mutedStyle}> — Last played {p.lastPlayed}</span>
                  )}
                </span>
                <MarkAsPlayedButton pieceId={p.id} />
              </li>
            ))}
          </ul>
        ) : (
          <p style={mutedStyle}>No familiar pieces due today.</p>
        )}
      </section>
    </main>
  );
}

const sectionStyle: React.CSSProperties = {
  marginBottom: "2rem",
};

const h2Style: React.CSSProperties = {
  fontSize: "1.1rem",
  fontWeight: 600,
  marginBottom: "0.5rem",
};

const listStyle: React.CSSProperties = {
  listStyle: "none",
  margin: 0,
  padding: 0,
};

const exerciseItemStyle: React.CSSProperties = {
  marginBottom: "0.5rem",
};

const focusStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.9rem",
  color: "#555",
  fontWeight: "normal",
};

const pieceBlockStyle: React.CSSProperties = {
  margin: 0,
};

const familiarItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "0.75rem",
  marginBottom: "0.5rem",
  flexWrap: "wrap",
};

const mutedStyle: React.CSSProperties = {
  color: "#666",
  fontSize: "0.95rem",
  margin: 0,
};
