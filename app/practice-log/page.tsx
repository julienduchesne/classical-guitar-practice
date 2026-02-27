export const dynamic = "force-dynamic";

import { getPracticeLog } from "@/app/actions";
import { DeleteLogEntryButton } from "./DeleteLogEntryButton";
import styles from "./PracticeLog.module.css";

export default async function PracticeLogPage() {
  const log = await getPracticeLog();
  const sorted = [...log].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <main>
      <h1>Practice Log</h1>

      {sorted.length === 0 ? (
        <p className={styles.empty}>
          No sessions logged yet. Use the &ldquo;Done — save session&rdquo; button on the daily
          practice page to save sessions.
        </p>
      ) : (
        <ul className={styles.list}>
          {sorted.map((entry) => (
            <li key={entry.id} className={styles.entry}>
              <div className={styles.entryHeader}>
                <span className={styles.date}>{entry.date}</span>
                <DeleteLogEntryButton id={entry.id} />
              </div>
              <div className={styles.details}>
                {entry.exerciseNames.length > 0 && (
                  <div className={styles.row}>
                    <span className={styles.label}>Exercises:</span>{" "}
                    {entry.exerciseNames.join(", ")}
                  </div>
                )}
                {entry.newPieceTitle && (
                  <div className={styles.row}>
                    <span className={styles.label}>New piece:</span>{" "}
                    {entry.newPieceTitle}
                  </div>
                )}
                {entry.familiarPieceTitles.length > 0 && (
                  <div className={styles.row}>
                    <span className={styles.label}>Familiar pieces:</span>{" "}
                    {entry.familiarPieceTitles.join(", ")}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
