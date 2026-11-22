import {
  Tuition,
  Application,
  Payment,
  User,
  StudentStats,
  TutorStats,
  AdminStats,
  Role,
  ApprovalStatus,
  ApplicationStatus,
  Review,
} from "@/types";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://mentorlagbe-server-taupe.vercel.app";

const TOKEN_KEY = "mentorlagbe_jwt_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  let token = getToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Preemptively obtain token if user is signed in but token was cleared or not set
  if (!token && !endpoint.includes("/api/jwt") && typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("mentorlagbe_user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u?.email) {
          token = await getJwtToken(u.email, u.role || "student");
        }
      }
    } catch (e) {
      // ignore
    }
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const resolvedBase = typeof window !== "undefined" ? "/server-api" : API_URL;
  const url = endpoint.startsWith("http") ? endpoint : `${resolvedBase}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  const contentType = res.headers.get("content-type");
  let data: any = null;
  if (contentType && contentType.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    // If unauthorized on protected endpoint, try silent JWT refresh once using stored user
    if (res.status === 401 && !endpoint.includes("/api/jwt") && typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("mentorlagbe_user");
        let userEmail = "";
        let userRole = "student";
        if (stored) {
          const u = JSON.parse(stored);
          userEmail = u?.email || "";
          userRole = u?.role || "student";
        }
        if (userEmail) {
          const freshJwt = await getJwtToken(userEmail, userRole);
          if (freshJwt) {
            headers.set("Authorization", `Bearer ${freshJwt}`);
            const retryRes = await fetch(url, { ...options, headers, credentials: "include" });
            if (retryRes.ok) {
              const retryType = retryRes.headers.get("content-type");
              return (retryType && retryType.includes("application/json") ? await retryRes.json() : await retryRes.text()) as T;
            }
          }
        }
      } catch (refreshErr) {
        // proceed to normal error handling
      }
    }

    const errorMsg =
      (data && typeof data === "object" && data.message) ||
      (typeof data === "string" && data) ||
      `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

// ---------------- AUTH & PROFILE ----------------
export async function getJwtToken(email?: string, role?: string): Promise<string> {
  // First attempt local Next.js route for 100% reliable zero-CORS issuance
  if (typeof window !== "undefined") {
    try {
      const localRes = await fetch("/api/jwt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      if (localRes.ok) {
        const localData = await localRes.json();
        if (localData?.token) {
          setToken(localData.token);
          return localData.token;
        }
      }
    } catch (e) {
      // fallback to backend
    }
  }

  const data = await apiFetch<{ token: string }>("/api/jwt", {
    method: "POST",
    body: JSON.stringify(email ? { email, role } : {}),
  });
  if (data?.token) {
    setToken(data.token);
  }
  return data.token;
}

export async function getMe(): Promise<User> {
  return apiFetch<User>("/me");
}

export async function updateProfile(payload: {
  name?: string;
  phone?: string;
  bio?: string;
  image?: string;
}): Promise<{ message: string; user: User }> {
  return apiFetch<{ message: string; user: User }>("/users/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

// ---------------- TUITIONS (PUBLIC & CRUD) ----------------
export async function getLatestTuitions(): Promise<Tuition[]> {
  try {
    const data = await apiFetch<any>("/tuitions/latest", { cache: "no-store" });
    const items = Array.isArray(data) ? data : data?.data || [];
    return items.slice(0, 6);
  } catch (error) {
    console.error("Tuition API error:", error);
    return [];
  }
}

export interface TuitionQuery {
  search?: string;
  subject?: string;
  classLevel?: string;
  mode?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedTuitions {
  data: Tuition[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getTuitions(
  params: TuitionQuery = {}
): Promise<PaginatedTuitions> {
  const qs = new URLSearchParams();
  if (params.search) qs.set("search", params.search);
  if (params.subject) qs.set("subject", params.subject);
  if (params.classLevel) qs.set("classLevel", params.classLevel);
  if (params.mode) qs.set("mode", params.mode);
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));

  return apiFetch<PaginatedTuitions>(`/tuitions?${qs.toString()}`, {
    cache: "no-store",
  });
}

export async function getTuitionFilters(): Promise<{
  subjects: string[];
  classLevels: string[];
}> {
  try {
    return await apiFetch<{ subjects: string[]; classLevels: string[] }>(
      "/tuitions/filters",
      { cache: "no-store" }
    );
  } catch (err) {
    return {
      subjects: [
        "Mathematics",
        "Physics",
        "Chemistry",
        "Biology",
        "Higher Math",
        "General Math",
        "English",
        "IELTS",
        "Programming",
        "Accounting",
        "Economics",
      ],
      classLevels: [
        "Class 6",
        "Class 7",
        "Class 8",
        "Class 9",
        "Class 10",
        "SSC",
        "HSC",
        "Admission",
        "University",
      ],
    };
  }
}

export async function getTuitionById(id: string): Promise<Tuition> {
  return apiFetch<Tuition>(`/tuitions/${id}`, { cache: "no-store" });
}

export async function getMyTuitions(): Promise<Tuition[]> {
  return apiFetch<Tuition[]>("/tuitions/mine", { cache: "no-store" });
}

export async function createTuition(
  payload: Partial<Tuition>
): Promise<Tuition> {
  return apiFetch<Tuition>("/tuitions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateTuition(
  id: string,
  payload: Partial<Tuition>
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/tuitions/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function toggleTuitionActive(
  id: string,
  isActive: boolean
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/tuitions/${id}/active`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });
}

export async function deleteTuition(id: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/tuitions/${id}`, {
    method: "DELETE",
  });
}

// ---------------- APPLICATIONS ----------------
export async function applyTuition(payload: {
  tuitionId: string;
  studentPhone: string;
  preferredSchedule: string;
  studentNote?: string;
}): Promise<Application> {
  return apiFetch<Application>("/applications", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getMyApplications(): Promise<Application[]> {
  return apiFetch<Application[]>("/applications/my", { cache: "no-store" });
}

export async function checkApplication(
  tuitionId: string
): Promise<{ applied: boolean }> {
  return apiFetch<{ applied: boolean }>(`/applications/check/${tuitionId}`, {
    cache: "no-store",
  });
}

export async function cancelApplication(id: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/applications/${id}`, {
    method: "DELETE",
  });
}

export async function getTutorApplicants(): Promise<Application[]> {
  return apiFetch<Application[]>("/applications/tutor", { cache: "no-store" });
}

export async function updateApplicationStatus(
  id: string,
  status: "accepted" | "rejected"
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/applications/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

// ---------------- STATS ----------------
export async function getStudentStats(): Promise<StudentStats> {
  return apiFetch<StudentStats>("/users/stats/student", { cache: "no-store" });
}

export async function getTutorStats(): Promise<TutorStats> {
  return apiFetch<TutorStats>("/users/stats/tutor", { cache: "no-store" });
}

export async function getAdminStats(): Promise<AdminStats> {
  return apiFetch<AdminStats>("/admin/stats", { cache: "no-store" });
}

// ---------------- ADMIN ENDPOINTS ----------------
export async function getAdminUsers(): Promise<User[]> {
  return apiFetch<User[]>("/admin/users", { cache: "no-store" });
}

export async function updateAdminUserRole(
  id: string,
  role: Role
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/admin/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}

export async function getAdminTuitions(): Promise<Tuition[]> {
  return apiFetch<Tuition[]>("/admin/tuitions", { cache: "no-store" });
}

export async function updateAdminTuitionApproval(
  id: string,
  approvalStatus: ApprovalStatus
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/admin/tuitions/${id}/approval`, {
    method: "PATCH",
    body: JSON.stringify({ approvalStatus }),
  });
}

export async function getAdminTransactions(): Promise<Payment[]> {
  return apiFetch<Payment[]>("/admin/transactions", { cache: "no-store" });
}

// ---------------- PAYMENTS / STRIPE ----------------
export async function createCheckoutSession(): Promise<{ url: string }> {
  return apiFetch<{ url: string }>("/payments/create-checkout-session", {
    method: "POST",
  });
}

export async function verifyPaymentSession(
  sessionId: string
): Promise<{ message: string; payment?: Payment }> {
  return apiFetch<{ message: string; payment?: Payment }>(
    `/payments/verify-session?session_id=${encodeURIComponent(sessionId)}`,
    { cache: "no-store" }
  );
}

export async function getMyPayments(): Promise<Payment[]> {
  return apiFetch<Payment[]>("/payments/my", { cache: "no-store" });
}

// ---------------- REVIEWS & RATINGS (Optional Requirement 5) ----------------
export async function getTuitionReviews(
  tuitionId: string
): Promise<{ reviews: Review[]; averageRating: number; totalReviews: number }> {
  try {
    return await apiFetch<{
      reviews: Review[];
      averageRating: number;
      totalReviews: number;
    }>(`/reviews/tuition/${encodeURIComponent(tuitionId)}`, { cache: "no-store" });
  } catch (err) {
    console.warn("Failed to fetch tuition reviews:", err);
    return { reviews: [], averageRating: 0, totalReviews: 0 };
  }
}

export async function checkReviewEligibility(
  tuitionId: string
): Promise<{
  eligible: boolean;
  alreadyReviewed: boolean;
  existingReview: Review | null;
}> {
  try {
    return await apiFetch<{
      eligible: boolean;
      alreadyReviewed: boolean;
      existingReview: Review | null;
    }>(`/reviews/eligibility/${encodeURIComponent(tuitionId)}`, { cache: "no-store" });
  } catch (err) {
    return { eligible: false, alreadyReviewed: false, existingReview: null };
  }
}

export async function submitReview(payload: {
  tuitionId: string;
  rating: number;
  comment: string;
}): Promise<{ message: string; review: Review }> {
  return apiFetch<{ message: string; review: Review }>("/reviews", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function submitApplicationReview(
  applicationId: string,
  payload: { rating: number; feedback: string }
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/applications/${applicationId}/review`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

