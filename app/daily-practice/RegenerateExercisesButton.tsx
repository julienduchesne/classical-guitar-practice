"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { regenerateTodayExercises } from "@/app/actions";

export function RegenerateExercisesButton({ date }: { date: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    await regenerateTodayExercises(date);
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      style={{
        marginBottom: "0.75rem",
        padding: "0.35rem 0.6rem",
        fontSize: "0.875rem",
        cursor: loading ? "wait" : "pointer",
      }}
    >
      {loading ? "Regenerating…" : "Regenerate today’s exercises"}
    </button>
  );
}
