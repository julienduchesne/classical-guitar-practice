"use client";

import { useRouter } from "next/navigation";
import { recordPlay } from "@/app/actions";
import styles from "./MarkAsPlayedButton.module.css";

export function MarkAsPlayedButton({ pieceId }: { pieceId: string }) {
  const router = useRouter();

  async function handleClick() {
    await recordPlay(pieceId);
    router.refresh();
  }

  return (
    <button type="button" onClick={handleClick} className={styles.button}>
      Mark as played
    </button>
  );
}
