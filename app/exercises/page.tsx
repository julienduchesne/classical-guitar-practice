import { Link } from "@/components/Link";
import { getExercises } from "@/app/actions";

export const dynamic = "force-dynamic";
import type { ExerciseCategory } from "@/lib/types";

const CATEGORY_LABELS: Record<ExerciseCategory, string> = {
  right_hand: "Right Hand (Arpeggios & Tone)",
  left_hand: "Left Hand (Strength & Agility)",
  coordination_scales: "Coordination & Scales",
  specialized: "Specialized Technique",
};

export default async function ExercisesPage() {
  const exercises = await getExercises();
  const byCategory = new Map<ExerciseCategory, { id: string; name: string; focus: string }[]>();
  for (const e of exercises) {
    const list = byCategory.get(e.category) ?? [];
    list.push({ id: e.id, name: e.name, focus: e.focus });
    byCategory.set(e.category, list);
  }
  const order: ExerciseCategory[] = [
    "right_hand",
    "left_hand",
    "coordination_scales",
    "specialized",
  ];

  return (
    <main style={{ padding: "1.5rem", maxWidth: "42rem" }}>
      <h1 style={{ marginTop: 0 }}>Exercises</h1>
      <p style={{ color: "#666", marginBottom: "1.5rem" }}>
        <Link href="/daily-practice">Use these in daily practice</Link>
      </p>
      {order.map((cat) => {
        const list = byCategory.get(cat) ?? [];
        if (list.length === 0) return null;
        return (
          <section key={cat} style={sectionStyle}>
            <h2 style={h2Style}>{CATEGORY_LABELS[cat]}</h2>
            <ul style={listStyle}>
              {list.map((e) => (
                <li key={e.id} style={itemStyle}>
                  <strong>{e.name}</strong>
                  <span style={focusStyle}>{e.focus}</span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
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

const itemStyle: React.CSSProperties = {
  marginBottom: "0.5rem",
};

const focusStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.9rem",
  color: "#555",
  fontWeight: "normal",
};
