"use server";

import { revalidatePath } from "next/cache";
import { readJson, writeJson, listBlobs } from "@/lib/blob";
import { EXERCISES } from "@/lib/seed-exercises";
import type { Exercise, Piece, PracticeLogEntry, PlaytimeSession } from "@/lib/types";
import {
  type Proficiency,
  PROFICIENCY_LEVELS,
} from "@/lib/types";
import {
  resolveExercisesByTitle,
  selectOnePerCategory,
  getFamiliarPiecesDue as _getFamiliarPiecesDue,
  getNewPiece as _getNewPiece,
} from "@/lib/daily-logic";

const PIECES_PATH = "data/pieces.json";
const PRACTICE_LOG_PATH = "data/practice-log.json";

function dailyPath(date: string): string {
  return `data/daily-${date}.json`;
}

export async function getExercises(): Promise<Exercise[]> {
  return EXERCISES;
}

export async function getTodayExercises(
  date: string
): Promise<{ date: string; exercises: Exercise[] }> {
  const path = dailyPath(date);
  const existing = await readJson<{ date: string; exerciseTitles: string[] }>(path);
  if (existing?.exerciseTitles?.length) {
    const list = resolveExercisesByTitle(EXERCISES, existing.exerciseTitles);
    if (list.length > 0) {
      return { date, exercises: list };
    }
  }
  const titles = selectOnePerCategory(EXERCISES);
  await writeJson(path, { date, exerciseTitles: titles });
  return { date, exercises: resolveExercisesByTitle(EXERCISES, titles) };
}

export async function regenerateTodayExercises(date: string): Promise<void> {
  const path = dailyPath(date);
  await writeJson(path, { date, exerciseTitles: [] });
  revalidatePath("/daily-practice");
  revalidatePath("/exercises/daily-pick");
}

export async function getDailyPickHistory(): Promise<{ date: string; exercises: Exercise[] }[]> {
  const keys = await listBlobs("daily-");
  const entries = await Promise.all(
    keys.map(async (key) => {
      const dateMatch = key.match(/daily-(\d{4}-\d{2}-\d{2})\.json$/);
      if (!dateMatch) return null;
      const date = dateMatch[1];
      const data = await readJson<{ date: string; exerciseTitles: string[] }>(key);
      if (!data?.exerciseTitles?.length) return null;
      const exercises = resolveExercisesByTitle(EXERCISES, data.exerciseTitles);
      if (exercises.length === 0) return null;
      return { date, exercises };
    })
  );
  return entries
    .filter((e): e is { date: string; exercises: Exercise[] } => e !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPieces(): Promise<Piece[]> {
  const data = await readJson<Piece[]>(PIECES_PATH);
  return Array.isArray(data) ? data : [];
}

export async function getFamiliarPiecesDue(date: string): Promise<Piece[]> {
  const pieces = await getPieces();
  return _getFamiliarPiecesDue(pieces, date);
}

export async function getNewPiece(): Promise<Piece | null> {
  const pieces = await getPieces();
  return _getNewPiece(pieces);
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

export async function getPracticeLog(): Promise<PracticeLogEntry[]> {
  const data = await readJson<PracticeLogEntry[]>(PRACTICE_LOG_PATH);
  return Array.isArray(data) ? data : [];
}

export async function savePracticeSession(entry: {
  date: string;
  exerciseNames: string[];
  newPieceTitle: string | null;
  familiarPieceTitles: string[];
}): Promise<void> {
  const log = await getPracticeLog();
  const newEntry: PracticeLogEntry = {
    id: crypto.randomUUID(),
    ...entry,
    createdAt: new Date().toISOString(),
  };
  log.push(newEntry);
  await writeJson(PRACTICE_LOG_PATH, log);
  revalidatePath("/practice-log");
  revalidatePath("/daily-practice");
}

export async function deletePracticeLogEntry(id: string): Promise<void> {
  const log = await getPracticeLog();
  const filtered = log.filter((e) => e.id !== id);
  if (filtered.length === log.length) return;
  await writeJson(PRACTICE_LOG_PATH, filtered);
  revalidatePath("/practice-log");
}

const PLAYTIME_SESSIONS_PATH = "data/playtime-sessions.json";

export async function getPlaytimeSessions(): Promise<PlaytimeSession[]> {
  const data = await readJson<PlaytimeSession[]>(PLAYTIME_SESSIONS_PATH);
  return Array.isArray(data) ? data : [];
}

export async function getActivePlaytimeSession(): Promise<PlaytimeSession | null> {
  const sessions = await getPlaytimeSessions();
  return sessions.find((s) => s.endTime === null) ?? null;
}

export async function startPlaytimeSession(): Promise<void> {
  const sessions = await getPlaytimeSessions();
  // Stop any lingering active session first
  sessions.forEach((s) => {
    if (s.endTime === null) s.endTime = new Date().toISOString();
  });
  sessions.push({ id: crypto.randomUUID(), startTime: new Date().toISOString(), endTime: null });
  await writeJson(PLAYTIME_SESSIONS_PATH, sessions);
  revalidatePath("/playtime");
}

export async function stopActivePlaytimeSession(): Promise<void> {
  const sessions = await getPlaytimeSessions();
  const active = sessions.find((s) => s.endTime === null);
  if (!active) return;
  active.endTime = new Date().toISOString();
  await writeJson(PLAYTIME_SESSIONS_PATH, sessions);
  revalidatePath("/playtime");
}

export async function deletePlaytimeSession(id: string): Promise<void> {
  const sessions = await getPlaytimeSessions();
  const filtered = sessions.filter((s) => s.id !== id);
  if (filtered.length === sessions.length) return;
  await writeJson(PLAYTIME_SESSIONS_PATH, filtered);
  revalidatePath("/playtime");
}

export async function updatePlaytimeSession(
  id: string,
  updates: { startTime?: string; endTime?: string | null }
): Promise<void> {
  const sessions = await getPlaytimeSessions();
  const i = sessions.findIndex((s) => s.id === id);
  if (i === -1) return;
  if (updates.startTime !== undefined) sessions[i].startTime = updates.startTime;
  if (updates.endTime !== undefined) sessions[i].endTime = updates.endTime;
  await writeJson(PLAYTIME_SESSIONS_PATH, sessions);
  revalidatePath("/playtime");
}

export type { Exercise, Piece, Proficiency, PracticeLogEntry, PlaytimeSession };
