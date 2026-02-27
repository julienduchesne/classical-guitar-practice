import { Link } from "@/components/Link";

export const dynamic = "force-dynamic";
import {
  getTodayExercises,
  getNewPiece,
  getFamiliarPiecesDue,
} from "@/app/actions";
import { MarkAsPlayedButton } from "./MarkAsPlayedButton";
import { RegenerateExercisesButton } from "./RegenerateExercisesButton";
import styles from "./DailyPractice.module.css";

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
    <main>
      <h1>Daily practice</h1>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionNumber}>1</span>
          <h2 className={styles.sectionTitle}>
            Daily exercises <span className={styles.sectionSubtitle}>~15 min</span>
          </h2>
        </div>
        <RegenerateExercisesButton date={date} />
        <ul className={styles.exerciseList}>
          {todayData.exercises.map((e) => (
            <li key={e.name} className={styles.exerciseItem}>
              <span className={styles.exerciseName}>{e.name}</span>
              <span className={styles.exerciseFocus}>{e.focus}</span>
            </li>
          ))}
        </ul>
        {todayData.exercises.length === 0 && (
          <p className={styles.muted}>No exercises selected. Regenerate to pick some.</p>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionNumber}>2</span>
          <h2 className={styles.sectionTitle}>
            New piece <span className={styles.sectionSubtitle}>15-20 min</span>
          </h2>
        </div>
        {newPiece ? (
          <div className={styles.pieceBlock}>
            <strong>{newPiece.title}</strong>
            <br />
            <Link href={`/pieces?edit=${newPiece.id}`}>Edit / mark as played</Link>
          </div>
        ) : (
          <p className={styles.muted}>
            No piece in progress.{" "}
            <Link href="/pieces">Pick or add a piece</Link> and set it as learning.
          </p>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionNumber}>3</span>
          <h2 className={styles.sectionTitle}>
            Familiar pieces <span className={styles.sectionSubtitle}>~10 min</span>
          </h2>
        </div>
        {familiarPieces.length > 0 ? (
          <ul className={styles.familiarList}>
            {familiarPieces.map((p) => (
              <li key={p.id} className={styles.familiarItem}>
                <span>
                  <span className={styles.familiarTitle}>{p.title}</span>
                  {p.lastPlayed && (
                    <span className={styles.familiarMeta}> — Last played {p.lastPlayed}</span>
                  )}
                </span>
                <MarkAsPlayedButton pieceId={p.id} />
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.muted}>No familiar pieces due today.</p>
        )}
      </section>
    </main>
  );
}
