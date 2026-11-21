"use client";

import { useEffect, useState, useCallback, useTransition, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Laptop,
  MapPin,
  BookOpen,
  ArrowUpRight,
  Filter,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { getTuitions, getTuitionFilters } from "@/lib/api";
import { Tuition } from "@/types";
import { isBookmarked, toggleBookmark } from "@/lib/bookmarks";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

import Pagination from "@/components/pagination";

const cardBg = ["bg-[#ECFAB5]", "bg-[#ECEEFE]", "bg-[#D9F0FF]", "bg-[#FBE4E3]"];

function BrowseTuitionsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const { user } = useAuth();

  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filter options from backend
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const [availableClassLevels, setAvailableClassLevels] = useState<string[]>([]);

  // Local filter states synced with URL
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [subject, setSubject] = useState(searchParams.get("subject") || "");
  const [classLevel, setClassLevel] = useState(searchParams.get("classLevel") || "");
  const [mode, setMode] = useState(searchParams.get("mode") || "");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1", 10));

  // Bookmark tracking state
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  // Load distinct filters from API once
  useEffect(() => {
    getTuitionFilters()
      .then((res) => {
        if (res.subjects) setAvailableSubjects(res.subjects);
        if (res.classLevels) setAvailableClassLevels(res.classLevels);
      })
      .catch((e) => console.error("Error loading filters:", e));
  }, []);

  // Fetch paginated tuitions based on filters
  const fetchTuitions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTuitions({
        search: search.trim() || undefined,
        subject: subject || undefined,
        classLevel: classLevel || undefined,
        mode: mode || undefined,
        page,
        limit: 6,
      });

      setTuitions(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);

      // Refresh bookmarks status
      const bookmarked = new Set<string>();
      (res.data || []).forEach((t) => {
        if (isBookmarked(t._id)) bookmarked.add(t._id);
      });
      setBookmarkedIds(bookmarked);
    } catch (err) {
      console.error("Failed to load tuitions:", err);
      toast.error("Failed to load tuitions");
    } finally {
      setLoading(false);
    }
  }, [search, subject, classLevel, mode, page]);

  useEffect(() => {
    fetchTuitions();
  }, [fetchTuitions]);

  // Sync state to URL for shareable & server-friendly links
  const updateUrlParams = (updates: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, String(v));
      else params.delete(k);
    });
    startTransition(() => {
      router.push(`/tuitions?${params.toString()}`, { scroll: false });
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    updateUrlParams({ search, page: 1 });
  };

  const handleFilterChange = (key: string, value: string) => {
    setPage(1);
    if (key === "subject") setSubject(value);
    if (key === "classLevel") setClassLevel(value);
    if (key === "mode") setMode(value);
    updateUrlParams({ [key]: value, page: 1 });
  };

  const handleResetFilters = () => {
    setSearch("");
    setSubject("");
    setClassLevel("");
    setMode("");
    setPage(1);
    router.push("/tuitions");
  };

  const handleToggleBookmark = (tuition: Tuition, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleBookmark(tuition);
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (added) next.add(tuition._id);
      else next.delete(tuition._id);
      return next;
    });
    if (added) {
      toast.success("Tuition saved to your bookmarks!");
    } else {
      toast.info("Removed from bookmarks");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      {/* Header Banner */}
      <section className="bg-[#FBE4E3] px-5 py-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFAB5] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#0A0E09]">
              <Sparkles size={13} /> Verified Mentors & Tuitions
            </span>
            <h1 className="mt-4 text-4xl font-black text-[#0A0E09] md:text-5xl">
              Browse Available Tuitions
            </h1>
            <p className="mt-3 text-base text-[#0A0E09]/70">
              Discover approved home tuitions and online batches across all subjects
              and classes. Filter by your schedule and budget.
            </p>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-8 flex max-w-3xl items-center gap-2 rounded-2xl bg-white p-2 shadow-lg shadow-[#0A0E09]/5"
          >
            <div className="flex flex-1 items-center gap-3 px-3">
              <Search size={20} className="shrink-0 text-[#0A0E09]/50" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by tuition title or subject (e.g. Higher Math, IELTS, Physics)..."
                className="w-full bg-transparent text-sm font-semibold text-[#0A0E09] outline-none placeholder:font-normal placeholder:text-[#0A0E09]/45"
              />
            </div>
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-[#96EE60] px-6 py-3 text-sm font-bold text-[#0A0E09] transition hover:brightness-95"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Main Content & Filters */}
      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        {/* Filter Toolbar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#0A0E09]/10 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-black uppercase text-[#0A0E09]/60">
              <Filter size={14} /> Filters:
            </span>

            {/* Subject Filter */}
            <select
              value={subject}
              onChange={(e) => handleFilterChange("subject", e.target.value)}
              className="rounded-xl border border-[#0A0E09]/15 bg-white px-3 py-2 text-xs font-bold text-[#0A0E09] outline-none transition focus:border-[#0A0E09]"
            >
              <option value="">All Subjects</option>
              {availableSubjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {/* Class Level Filter */}
            <select
              value={classLevel}
              onChange={(e) => handleFilterChange("classLevel", e.target.value)}
              className="rounded-xl border border-[#0A0E09]/15 bg-white px-3 py-2 text-xs font-bold text-[#0A0E09] outline-none transition focus:border-[#0A0E09]"
            >
              <option value="">All Class Levels</option>
              {availableClassLevels.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Mode Filter */}
            <select
              value={mode}
              onChange={(e) => handleFilterChange("mode", e.target.value)}
              className="rounded-xl border border-[#0A0E09]/15 bg-white px-3 py-2 text-xs font-bold text-[#0A0E09] outline-none transition focus:border-[#0A0E09]"
            >
              <option value="">All Modes</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>

            {(search || subject || classLevel || mode) && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 rounded-xl bg-gray-100 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-200 transition"
              >
                <RotateCcw size={12} /> Clear Filters
              </button>
            )}
          </div>

          <div className="text-xs font-bold text-[#0A0E09]/70">
            Showing <span className="text-[#0A0E09]">{tuitions.length}</span> of{" "}
            <span className="text-[#0A0E09]">{total}</span> tuitions
          </div>
        </div>

        {/* Tuition Cards Grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[430px] animate-pulse rounded-[2rem] bg-gray-100 p-4"
              >
                <div className="h-48 w-full rounded-2xl bg-gray-200" />
                <div className="mt-4 h-6 w-3/4 rounded-md bg-gray-200" />
                <div className="mt-2 h-4 w-1/2 rounded-md bg-gray-200" />
                <div className="mt-12 h-10 w-full rounded-xl bg-gray-200" />
              </div>
            ))}
          </div>
        ) : tuitions.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tuitions.map((tuition, i) => {
              const isOnline = tuition.mode === "Online";
              const isSaved = bookmarkedIds.has(tuition._id);

              return (
                <article
                  key={tuition._id}
                  className={`group flex h-full flex-col rounded-[2rem] p-3.5 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0A0E09]/10 ${
                    cardBg[i % cardBg.length]
                  }`}
                >
                  {/* Photo Header */}
                  <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-[#0A0E09]">
                    {tuition.bannerImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={tuition.bannerImage}
                        alt={tuition.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center bg-[#7FD09F] text-7xl font-black text-[#0A0E09]">
                        {tuition.subject?.charAt(0)}
                      </span>
                    )}

                    {/* Mode Tag */}
                    <span
                      className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold text-[#0A0E09] shadow-sm ${
                        isOnline ? "bg-[#7FD09F]" : "bg-white"
                      }`}
                    >
                      {isOnline ? <Laptop size={12} /> : <MapPin size={12} />}
                      {tuition.mode}
                    </span>

                    {/* Bookmark Button */}
                    <button
                      type="button"
                      aria-label="Bookmark tuition"
                      onClick={(e) => handleToggleBookmark(tuition, e)}
                      className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full transition shadow-sm ${
                        isSaved
                          ? "bg-[#0A0E09] text-[#96EE60]"
                          : "bg-white/80 text-[#0A0E09] hover:bg-white"
                      }`}
                    >
                      <Bookmark
                        size={15}
                        className={isSaved ? "fill-[#96EE60]" : ""}
                      />
                    </button>

                    {/* Tutor info banner at bottom of card banner */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0A0E09]/95 via-[#0A0E09]/60 to-transparent p-4 pt-12 text-white">
                      <p className="truncate text-lg font-black tracking-tight">
                        {tuition.tutorName}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 truncate text-xs font-semibold text-white/85">
                        <MapPin size={13} />
                        {tuition.location || tuition.mode}
                      </p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex flex-1 flex-col px-3 pb-3 pt-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#0A0E09] shadow-xs">
                        {tuition.subject}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-[#0A0E09]/80">
                        <BookOpen size={12} />
                        {tuition.classLevel}
                      </span>
                      {tuition.daysPerWeek && (
                        <span className="rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-semibold text-[#0A0E09]/75">
                          {tuition.daysPerWeek} days/wk
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 line-clamp-2 min-h-[3.25rem] text-base font-extrabold leading-6 text-[#0A0E09]">
                      {tuition.title}
                    </h3>

                    {tuition.description && (
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#0A0E09]/65">
                        {tuition.description}
                      </p>
                    )}

                    <div className="mt-auto flex items-center justify-between gap-3 pt-5 border-t border-black/5">
                      <div>
                        <p className="text-xl font-black text-[#0A0E09]">
                          ৳{Number(tuition.monthlyFee).toLocaleString("en-BD")}
                        </p>
                        <p className="text-[11px] font-bold text-[#0A0E09]/60">
                          per month
                        </p>
                      </div>

                      <Link
                        href={`/tuitions/${tuition._id}`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#0A0E09] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#96EE60] hover:text-[#0A0E09]"
                      >
                        View Details <ArrowUpRight size={15} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[2.5rem] border border-dashed border-[#0A0E09]/20 bg-white p-12 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ECEEFE] text-[#0A0E09]">
              <Search size={28} />
            </span>
            <h3 className="mt-4 text-xl font-black text-[#0A0E09]">
              No matching tuitions found
            </h3>
            <p className="mt-2 text-sm text-[#0A0E09]/60">
              Try adjusting your search criteria or resetting filters to see more
              results.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-6 inline-flex rounded-full bg-[#96EE60] px-6 py-3 text-sm font-bold text-[#0A0E09] hover:brightness-95"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Circular Pagination (image 5 design) */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => {
            setPage(p);
            updateUrlParams({ page: p });
          }}
        />
      </div>
    </div>
  );
}

export default function BrowseTuitionsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0A0E09] border-t-[#96EE60]" />
        </div>
      }
    >
      <BrowseTuitionsContent />
    </Suspense>
  );
}
