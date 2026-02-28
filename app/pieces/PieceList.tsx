"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/components/Link";
import { recordPlay } from "@/app/actions";
import type { Piece, Proficiency, KnowledgeLevel } from "@/lib/types";
import styles from "./Pieces.module.css";
import { SheetMusicControls } from "./SheetMusicControls";

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

const KNOWLEDGE_LABELS: Record<KnowledgeLevel, string> = {
  none: "None",
  partial: "Partial",
  mostly: "Mostly",
  by_heart: "By heart",
};

const KNOWLEDGE_CLASS: Record<KnowledgeLevel, string> = {
  none: styles.knowledgeNone,
  partial: styles.knowledgePartial,
  mostly: styles.knowledgeMostly,
  by_heart: styles.knowledgeByHeart,
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
              <span className={styles.metaLabel}>Knowledge</span>
              <span className={`${styles.knowledge} ${KNOWLEDGE_CLASS[p.knowledge ?? "none"]}`}>
                {KNOWLEDGE_LABELS[p.knowledge ?? "none"]}
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
            {p.youtubeUrl && (
              <a
                href={p.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.youtubeLink}
              >
                ▶ YouTube
              </a>
            )}
            <Suspense fallback={null}>
              <SheetMusicControls
                pieceId={p.id}
                hasSheetMusic={p.hasSheetMusic ?? false}
              />
            </Suspense>
          </span>
        </li>
      ))}
    </ul>
  );
}
