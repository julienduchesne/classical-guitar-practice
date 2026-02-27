import { Link } from "@/components/Link";
import { getExercises } from "@/app/actions";

export const dynamic = "force-dynamic";
import type { ExerciseCategory } from "@/lib/types";
import styles from "./Exercises.module.css";

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
    <main>
      <h1>Exercises</h1>
      <p className={styles.intro}>
        <Link href="/daily-practice">Use these in daily practice</Link>
      </p>
      {order.map((cat) => {
        const list = byCategory.get(cat) ?? [];
        if (list.length === 0) return null;
        return (
          <section key={cat} className={styles.categorySection}>
            <h2 className={styles.categoryTitle}>{CATEGORY_LABELS[cat]}</h2>
            <ul className={styles.exerciseList}>
              {list.map((e) => (
                <li key={e.id} className={styles.exerciseItem}>
                  <span className={styles.exerciseName}>{e.name}</span>
                  <span className={styles.exerciseFocus}>{e.focus}</span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </main>
  );
}
