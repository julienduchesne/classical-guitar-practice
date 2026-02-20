"use client";

import { useRouter } from "next/navigation";
import { recordPlay } from "@/app/actions";

export function MarkAsPlayedButton({ pieceId }: { pieceId: string }) {
  const router = useRouter();

  async function handleClick() {
    await recordPlay(pieceId);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        padding: "0.35rem 0.6rem",
        fontSize: "0.875rem",
        cursor: "pointer",
      }}
    >
      Mark as played
    </button>
  );
}
