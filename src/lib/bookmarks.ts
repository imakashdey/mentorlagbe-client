import { Tuition } from "@/types";

const BOOKMARKS_KEY = "mentorlagbe_saved_tuitions";

export function getBookmarks(): Tuition[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isBookmarked(tuitionId: string): boolean {
  const list = getBookmarks();
  return list.some((t) => t._id === tuitionId);
}

export function toggleBookmark(tuition: Tuition): boolean {
  const list = getBookmarks();
  const exists = list.some((t) => t._id === tuition._id);
  let updated: Tuition[];
  if (exists) {
    updated = list.filter((t) => t._id !== tuition._id);
  } else {
    updated = [tuition, ...list];
  }
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save bookmark:", err);
  }
  return !exists;
}
