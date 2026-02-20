"use server";

import { revalidatePath } from "next/cache";
import { readJson, writeJson } from "@/lib/blob";
import { SEED_EXERCISES } from "@/lib/seed-exercises";
import type { Exercise, Piece } from "@/lib/types";
import {
  type Proficiency,
  PROFICIENCY_INTERVAL_DAYS,
  PROFICIENCY_LEVELS,
} from "@/lib/types";

const EXERCISES_PATH = "data/exercises.json";
const PIECES_PATH = "data/pieces.json";

function dailyPath(date: string): string {
  return `data/daily-${date}.json`;
}

export async function getExercises(): Promise<Exercise[]> {
  const data = await readJson<Exercise[]>(EXERCISES_PATH);
  if (data && Array.isArray(data) && data.length > 0) {
    return data;
  }
  await writeJson(EXERCISES_PATH, SEED_EXERCISES);
  return SEED_EXERCISES;
}

export async function getTodayExercises(
  date: string
): Promise<{ date: string; exercises: Exercise[] }> {
  const exercises = await getExercises();
  const path = dailyPath(date);
  const existing = await readJson<{ date: string; exerciseIds: string[] }>(path);
  if (existing?.exerciseIds?.length) {
    const byId = new Map(exercises.map((e) => [e.id, e]));
    const list = existing.exerciseIds
      .map((id) => byId.get(id))
      .filter((e): e is Exercise => e != null);
    if (list.length === existing.exerciseIds.length) {
      return { date, exercises: list };
    }
  }
  const categories = ["right_hand", "left_hand", "coordination_scales", "specialized"] as const;
  const byCategory = new Map<string, Exercise[]>();
  for (const e of exercises) {
    const list = byCategory.get(e.category) ?? [];
    list.push(e);
    byCategory.set(e.category, list);
  }
  const exerciseIds: string[] = [];
  for (const cat of categories) {
    const list = byCategory.get(cat) ?? [];
    if (list.length) {
      const pick = list[Math.floor(Math.random() * list.length)];
      exerciseIds.push(pick.id);
    }
  }
  await writeJson(path, { date, exerciseIds });
  const byId = new Map(exercises.map((e) => [e.id, e]));
  const list = exerciseIds
    .map((id) => byId.get(id))
    .filter((e): e is Exercise => e != null);
  return { date, exercises: list };
}

export async function regenerateTodayExercises(date: string): Promise<void> {
  const path = dailyPath(date);
  await writeJson(path, { date, exerciseIds: [] });
  revalidatePath("/daily-practice");
}

export async function getPieces(): Promise<Piece[]> {
  const data = await readJson<Piece[]>(PIECES_PATH);
  return Array.isArray(data) ? data : [];
}

function nextDue(piece: Piece): string {
  if (!piece.lastPlayed) return new Date().toISOString().slice(0, 10);
  const interval = PROFICIENCY_INTERVAL_DAYS[piece.proficiency];
  const d = new Date(piece.lastPlayed);
  d.setDate(d.getDate() + interval);
  return d.toISOString().slice(0, 10);
}

export async function getFamiliarPiecesDue(date: string): Promise<Piece[]> {
  const pieces = await getPieces();
  const familiar = pieces.filter((p) => p.proficiency !== "new");
  const due = familiar.filter((p) => nextDue(p) <= date);
  due.sort((a, b) => nextDue(a).localeCompare(nextDue(b)));
  return due;
}

export async function getNewPiece(): Promise<Piece | null> {
  const pieces = await getPieces();
  const learning = pieces.filter(
    (p) => p.proficiency === "new" || p.proficiency === "learning" || p.proficiency === "struggling"
  );
  if (learning.length === 0) return null;
  learning.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
  return learning[0] ?? null;
}

export async function addPiece(formData: {
  title: string;
  troubleNotes?: string;
  goalBpm?: number | null;
}): Promise<void> {
  const pieces = await getPieces();
  const now = new Date().toISOString();
  const piece: Piece = {
    id: crypto.randomUUID(),
    title: formData.title.trim(),
    proficiency: "new",
    lastPlayed: null,
    playCount: 0,
    troubleNotes: formData.troubleNotes?.trim() ?? "",
    goalBpm: formData.goalBpm ?? null,
    currentCleanBpm: null,
    createdAt: now,
  };
  pieces.push(piece);
  await writeJson(PIECES_PATH, pieces);
  revalidatePath("/daily-practice");
  revalidatePath("/pieces");
  revalidatePath("/sheet-music");
}

export async function updatePiece(
  id: string,
  updates: Partial<Pick<Piece, "title" | "proficiency" | "troubleNotes" | "goalBpm" | "currentCleanBpm">>
): Promise<void> {
  const pieces = await getPieces();
  const i = pieces.findIndex((p) => p.id === id);
  if (i === -1) return;
  if (updates.title != null) pieces[i].title = updates.title.trim();
  if (updates.proficiency != null && PROFICIENCY_LEVELS.includes(updates.proficiency)) {
    pieces[i].proficiency = updates.proficiency;
  }
  if (updates.troubleNotes != null) pieces[i].troubleNotes = updates.troubleNotes.trim();
  if (updates.goalBpm != null) pieces[i].goalBpm = updates.goalBpm;
  if (updates.currentCleanBpm != null) pieces[i].currentCleanBpm = updates.currentCleanBpm;
  await writeJson(PIECES_PATH, pieces);
  revalidatePath("/daily-practice");
  revalidatePath("/pieces");
  revalidatePath("/sheet-music");
}

export async function recordPlay(id: string): Promise<void> {
  const pieces = await getPieces();
  const i = pieces.findIndex((p) => p.id === id);
  if (i === -1) return;
  const today = new Date().toISOString().slice(0, 10);
  pieces[i].lastPlayed = today;
  pieces[i].playCount += 1;
  await writeJson(PIECES_PATH, pieces);
  revalidatePath("/daily-practice");
  revalidatePath("/pieces");
  revalidatePath("/sheet-music");
}

export async function deletePiece(id: string): Promise<void> {
  const pieces = await getPieces();
  const filtered = pieces.filter((p) => p.id !== id);
  if (filtered.length === pieces.length) return;
  await writeJson(PIECES_PATH, filtered);
  revalidatePath("/daily-practice");
  revalidatePath("/pieces");
  revalidatePath("/sheet-music");
}

export type { Exercise, Piece, Proficiency };
