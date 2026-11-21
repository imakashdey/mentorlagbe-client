import { Tuition } from "@/types";

const BOOKMARKS_KEY = "mentorlagbe_saved_tuitions";
export const FREE_STUDENT_BOOKMARK_LIMIT = 5;

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

export interface ToggleBookmarkResult {
  added: boolean;
  limitReached?: boolean;
}

export function toggleBookmark(
  tuition: Tuition,
  plan: string = "free"
): ToggleBookmarkResult {
  const list = getBookmarks();
  const exists = list.some((t) => t._id === tuition._id);

  if (!exists) {
    if (plan !== "pro" && list.length >= FREE_STUDENT_BOOKMARK_LIMIT) {
      return { added: false, limitReached: true };
    }
    const updated = [tuition, ...list];
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save bookmark:", err);
    }
    return { added: true };
  } else {
    const updated = list.filter((t) => t._id !== tuition._id);
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save bookmark:", err);
    }
    return { added: false };
  }
}
