import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_SAVED = "cinematch_saved_ids";
const KEY_WATCHED = "cinematch_watched";
const KEY_NOTES = "cinematch_notes";

type WatchedEntry = { id: number; at: string };

export async function getSavedIds(): Promise<number[]> {
  const raw = await AsyncStorage.getItem(KEY_SAVED);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as number[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function toggleSaved(movieId: number): Promise<boolean> {
  const ids = await getSavedIds();
  const has = ids.includes(movieId);
  const next = has ? ids.filter((i) => i !== movieId) : [...ids, movieId];
  await AsyncStorage.setItem(KEY_SAVED, JSON.stringify(next));
  return !has;
}

export async function isSaved(movieId: number): Promise<boolean> {
  const ids = await getSavedIds();
  return ids.includes(movieId);
}

export async function getWatchedList(): Promise<WatchedEntry[]> {
  const raw = await AsyncStorage.getItem(KEY_WATCHED);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as WatchedEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function addWatched(movieId: number): Promise<void> {
  const list = await getWatchedList();
  if (list.some((e) => e.id === movieId)) return;
  const at = new Date().toISOString().slice(0, 10);
  await AsyncStorage.setItem(
    KEY_WATCHED,
    JSON.stringify([...list, { id: movieId, at }])
  );
}

export async function removeWatched(movieId: number): Promise<void> {
  const list = await getWatchedList();
  await AsyncStorage.setItem(
    KEY_WATCHED,
    JSON.stringify(list.filter((e) => e.id !== movieId))
  );
}

export async function isWatched(movieId: number): Promise<boolean> {
  const list = await getWatchedList();
  return list.some((e) => e.id === movieId);
}

export async function getNote(movieId: number): Promise<string> {
  const raw = await AsyncStorage.getItem(KEY_NOTES);
  if (!raw) return "";
  try {
    const map = JSON.parse(raw) as Record<string, string>;
    return map[String(movieId)] ?? "";
  } catch {
    return "";
  }
}

export async function saveNote(movieId: number, note: string): Promise<void> {
  const raw = await AsyncStorage.getItem(KEY_NOTES);
  let map: Record<string, string> = {};
  if (raw) {
    try {
      map = JSON.parse(raw) as Record<string, string>;
    } catch {
      map = {};
    }
  }
  if (note.trim()) {
    map[String(movieId)] = note.trim();
  } else {
    delete map[String(movieId)];
  }
  await AsyncStorage.setItem(KEY_NOTES, JSON.stringify(map));
}
