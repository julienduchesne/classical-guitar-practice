"use client";

import { useRouter } from "next/navigation";
import { Link } from "@/components/Link";
import { recordPlay } from "@/app/actions";
import type { Piece, Proficiency } from "@/lib/types";
import styles from "./Pieces.module.css";

const PROFICIENCY_LABELS: Record<Proficiency, string> = {
  new: "New",
  struggling: "Struggling",
  learning: "Learning",
  comfortable: "Comfortable",
  very_proficient: "Very proficient",
};

const PROFICIENCY_CLASS: Record<Proficiency, string> = {
  new: styles.proficiencyNew,
  struggling: styles.proficiencyStruggling,
  learning: styles.proficiencyLearning,
  comfortable: styles.proficiencyComfortable,
  very_proficient: styles.proficiencyVeryProficient,
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
    return <p className={styles.emptyState}>No pieces yet. Add one above.</p>;
  }

  return (
    <ul className={styles.pieceList}>
      {pieces.map((p) => (
        <li key={p.id} className={styles.pieceCard}>
          <span className={styles.pieceTitleCell}>
            <span className={styles.pieceTitle}>{p.title}</span>
            {p.troubleNotes.trim() && (
              <span className={styles.troubleBadge} title={p.troubleNotes}>
                trouble
              </span>
            )}
          </span>
          <div className={styles.pieceMeta}>
            <span className={styles.metaItem}>
              <span className={styles.metaLabel}>Level</span>
              <span className={`${styles.proficiency} ${PROFICIENCY_CLASS[p.proficiency]}`}>
                {PROFICIENCY_LABELS[p.proficiency]}
              </span>
            </span>
            <span className={styles.metaItem}>
              <span className={styles.metaLabel}>Last played</span>
              <span className={styles.metaValue}>{p.lastPlayed ?? "—"}</span>
            </span>
            <span className={styles.metaItem}>
              <span className={styles.metaLabel}>Plays</span>
              <span className={styles.metaValue}>{p.playCount}</span>
            </span>
          </div>
          <span className={styles.pieceActions}>
            <button
              type="button"
              onClick={() => handleMarkPlayed(p.id)}
              className={styles.smallButton}
            >
              Mark as played
            </button>
            {editId !== p.id ? (
              <Link href={`/pieces?edit=${p.id}`} className={styles.editLink}>
                Edit
              </Link>
            ) : (
              <span className={styles.editingBadge}>(editing)</span>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}
