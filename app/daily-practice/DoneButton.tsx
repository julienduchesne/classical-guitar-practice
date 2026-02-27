"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { savePracticeSession } from "@/app/actions";
import styles from "./DoneButton.module.css";

interface Props {
  date: string;
  exerciseNames: string[];
  newPieceTitle: string | null;
  familiarPieceTitles: string[];
  alreadyLogged: boolean;
}

export function DoneButton({
  date,
  exerciseNames,
  newPieceTitle,
  familiarPieceTitles,
  alreadyLogged,
}: Props) {
  const [saved, setSaved] = useState(alreadyLogged);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleDone() {
    startTransition(async () => {
      await savePracticeSession({ date, exerciseNames, newPieceTitle, familiarPieceTitles });
      setSaved(true);
      router.refresh();
    });
  }

  if (saved) {
    return <div className={styles.savedBadge}>Session saved</div>;
  }

  return (
    <button
      type="button"
      className={styles.doneButton}
      onClick={handleDone}
      disabled={pending}
    >
      {pending ? "Saving…" : "Done — save session"}
    </button>
  );
}
