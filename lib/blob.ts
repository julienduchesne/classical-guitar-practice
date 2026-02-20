import { del, get, put } from "@vercel/blob";

const BLOB_PREFIX = "data/";

export async function readJson<T>(pathname: string): Promise<T | null> {
  const fullPath = pathname.startsWith(BLOB_PREFIX) ? pathname : `${BLOB_PREFIX}${pathname}`;
  try {
    const result = await get(fullPath, { access: "private" });
    if (!result || result.statusCode !== 200 || !result.stream) return null;
    const text = await new Response(result.stream).text();
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export async function writeJson(pathname: string, data: unknown): Promise<void> {
  const fullPath = pathname.startsWith(BLOB_PREFIX) ? pathname : `${BLOB_PREFIX}${pathname}`;
  const body = JSON.stringify(data, null, 2);
  await put(fullPath, body, {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function deleteBlob(pathname: string): Promise<void> {
  const fullPath = pathname.startsWith(BLOB_PREFIX) ? pathname : `${BLOB_PREFIX}${pathname}`;
  await del(fullPath);
}
