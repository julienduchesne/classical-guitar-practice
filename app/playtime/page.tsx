export const dynamic = "force-dynamic";

import { getPlaytimeSessions } from "@/app/actions";
import { EditPlaytimeForm } from "./EditPlaytimeForm";
import { DeletePlaytimeButton } from "./DeletePlaytimeButton";
import { Link } from "@/components/Link";
import type { PlaytimeSession } from "@/lib/types";
import styles from "./Playtime.module.css";

function formatDisplay(iso: string): string {
  // "2026-02-27T10:30:45.000Z" → "2026-02-27 10:30"
  return iso.slice(0, 16).replace("T", " ");
}

function formatDuration(startTime: string, endTime: string): string {
  const ms = new Date(endTime).getTime() - new Date(startTime).getTime();
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function PlaytimePage({ searchParams }: Props) {
  const params = await searchParams;
  const editId = typeof params.edit === "string" ? params.edit : null;
  const sessions = await getPlaytimeSessions();
  const sorted = [...sessions].sort((a, b) =>
    b.startTime.localeCompare(a.startTime)
  );
  const sessionToEdit: PlaytimeSession | null =
    editId ? sessions.find((s) => s.id === editId) ?? null : null;

  return (
    <main>
      <h1>Playtime</h1>

      {sessionToEdit && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Edit session</h2>
          <EditPlaytimeForm session={sessionToEdit} />
        </section>
      )}

      {sorted.length === 0 ? (
        <p className={styles.empty}>
          No sessions yet. Use the &ldquo;Start Session&rdquo; button in the
          menu to begin tracking.
        </p>
      ) : (
        <ul className={styles.list}>
          {sorted.map((session) => (
            <li
              key={session.id}
              className={`${styles.entry} ${session.endTime === null ? styles.entryActive : ""}`}
            >
              <div className={styles.entryHeader}>
                <div className={styles.times}>
                  <span className={styles.timeRow}>
                    <span className={styles.timeLabel}>Started</span>
                    <span className={styles.timeValue}>
                      {formatDisplay(session.startTime)}
                    </span>
                  </span>
                  {session.endTime !== null ? (
                    <>
                      <span className={styles.timeRow}>
                        <span className={styles.timeLabel}>Ended</span>
                        <span className={styles.timeValue}>
                          {formatDisplay(session.endTime)}
                        </span>
                      </span>
                      <span className={styles.duration}>
                        {formatDuration(session.startTime, session.endTime)}
                      </span>
                    </>
                  ) : (
                    <span className={styles.badge}>In progress</span>
                  )}
                </div>
                <div className={styles.actions}>
                  <Link
                    href={`/playtime?edit=${session.id}`}
                    className={styles.editButton}
                  >
                    Edit
                  </Link>
                  <DeletePlaytimeButton id={session.id} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
