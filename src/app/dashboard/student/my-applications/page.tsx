"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, Loader2, ArrowUpRight, Search, Star, X, CheckCircle2 } from "lucide-react";
import { getMyApplications, cancelApplication, submitReview } from "@/lib/api";
import { Application } from "@/types";
import { toast } from "sonner";
import Pagination from "@/components/pagination";

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Review Modal state for Accepted Applications (Optional Requirement 5)
  const [reviewApp, setReviewApp] = useState<Application | null>(null);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchApps = () => {
    setLoading(true);
    getMyApplications()
      .then((data) => setApplications(data || []))
      .catch((err) => {
        console.error("Failed to load applications:", err);
        toast.error("Failed to load your applications");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const openReviewModal = (app: Application) => {
    setReviewApp(app);
    setRating(app.rating || 5);
    setComment(app.feedback || "");
    setHoverRating(0);
  };

  const closeReviewModal = () => {
    setReviewApp(null);
    setComment("");
    setRating(5);
    setHoverRating(0);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewApp) return;

    if (!rating || rating < 1 || rating > 5) {
      toast.error("Please select a rating between 1 and 5 stars");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please provide review feedback");
      return;
    }

    setSubmittingReview(true);
    try {
      await submitReview({
        tuitionId: reviewApp.tuitionId,
        rating,
        comment: comment.trim(),
      });

      toast.success("Review submitted successfully! Thank you for your feedback.");

      // Update in local state
      setApplications((prev) =>
        prev.map((a) =>
          a._id === reviewApp._id
            ? { ...a, rating, feedback: comment.trim(), reviewedAt: new Date() }
            : a
        )
      );

      closeReviewModal();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this pending application?")) {
      return;
    }

    setCancellingId(id);
    try {
      await cancelApplication(id);
      toast.success("Application cancelled successfully");
      setApplications((prev) => prev.filter((a) => a._id !== id));
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel application");
    } finally {
      setCancellingId(null);
    }
  };

  const totalPages = Math.ceil(applications.length / pageSize);
  const paginatedApps = applications.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-[#0A0E09]">
            My Tuition Applications
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Track and manage all your tuition enrollment submissions
          </p>
        </div>
        <Link
          href="/tuitions"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#96EE60] px-5 py-2.5 text-xs font-black text-[#0A0E09] hover:brightness-95 transition"
        >
          Find More Tuitions <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* Applications Table / Cards */}
      <div className="overflow-hidden rounded-[2rem] border border-[#0A0E09]/5 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <Loader2 size={32} className="animate-spin text-[#96EE60]" />
          </div>
        ) : applications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-100 bg-gray-50/75 text-[11px] font-black uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Tuition Title &amp; Subject</th>
                  <th className="px-6 py-4">Tutor Email</th>
                  <th className="px-6 py-4">Monthly Fee</th>
                  <th className="px-6 py-4">Preferred Schedule</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedApps.map((app) => {
                  const isPending = app.status === "pending";
                  return (
                    <tr key={app._id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4">
                        <Link
                          href={`/tuitions/${app.tuitionId}`}
                          className="font-extrabold text-[#0A0E09] hover:underline"
                        >
                          {app.tuitionTitle}
                        </Link>
                        <span className="mt-0.5 block font-semibold text-gray-400">
                          {app.subject}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-medium text-gray-600">
                        {app.tutorEmail}
                      </td>

                      <td className="px-6 py-4 font-black text-[#0A0E09]">
                        ৳{Number(app.monthlyFee).toLocaleString("en-BD")}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {app.preferredSchedule}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-[10px] font-black uppercase ${
                            app.status === "accepted"
                              ? "bg-emerald-100 text-emerald-800"
                              : app.status === "rejected"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        {isPending ? (
                          <button
                            onClick={() => handleCancel(app._id)}
                            disabled={cancellingId === app._id}
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50 transition disabled:opacity-50"
                            title="Cancel Application"
                          >
                            <Trash2 size={14} />
                            Cancel
                          </button>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            {app.status === "accepted" ? (
                              <button
                                onClick={() => openReviewModal(app)}
                                className="inline-flex items-center gap-1.5 rounded-full bg-[#0A0E09] px-3 py-1.5 text-[11px] font-black text-white hover:bg-[#96EE60] hover:text-[#0A0E09] transition shadow-xs"
                                title="Rate & Review Tutor"
                              >
                                <Star
                                  size={12}
                                  className={
                                    app.rating
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-white"
                                  }
                                />
                                <span>{app.rating ? `${app.rating}★ Edit` : "Rate & Review"}</span>
                              </button>
                            ) : (
                              <span className="text-[11px] font-medium text-gray-400">
                                Closed
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
              <Search size={24} />
            </span>
            <h3 className="mt-4 text-base font-bold text-[#0A0E09]">
              No Applications Found
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              You haven&apos;t applied to any tuitions yet.
            </p>
            <Link
              href="/tuitions"
              className="mt-5 inline-flex rounded-full bg-[#96EE60] px-5 py-2.5 text-xs font-black text-[#0A0E09]"
            >
              Browse Tuitions
            </Link>
          </div>
        )}
      </div>

      {/* Circular Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Student Review & Rating Modal (Optional Requirement 5) */}
      {reviewApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-[2.5rem] bg-white p-7 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase text-emerald-700">
                  <CheckCircle2 size={12} /> Accepted Enrollment
                </span>
                <h3 className="mt-1.5 text-lg font-black text-[#0A0E09]">
                  {reviewApp.rating ? "Update Your Review" : "Rate & Review Tuition"}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-1">
                  {reviewApp.tuitionTitle}
                </p>
              </div>
              <button
                onClick={closeReviewModal}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="mt-5 space-y-4">
              {/* Star Rating Selector */}
              <div>
                <label className="block text-xs font-black text-[#0A0E09] mb-1.5">
                  Select Rating: <span className="text-amber-600 font-bold">{rating} Star{rating > 1 ? "s" : ""}</span>
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = (hoverRating || rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-110 focus:outline-none"
                      >
                        <Star
                          size={28}
                          className={`transition-colors ${
                            isFilled
                              ? "fill-amber-400 text-amber-400 drop-shadow-xs"
                              : "text-gray-200"
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="ml-2 text-xs font-semibold text-gray-500">
                    {rating === 5
                      ? "Excellent"
                      : rating === 4
                      ? "Very Good"
                      : rating === 3
                      ? "Good"
                      : rating === 2
                      ? "Fair"
                      : "Poor"}
                  </span>
                </div>
              </div>

              {/* Feedback Textarea */}
              <div>
                <label className="block text-xs font-black text-[#0A0E09] mb-1.5">
                  Your Learning Feedback *
                </label>
                <textarea
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about the mentor's teaching style, communication, exam preparation, and reliability..."
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 p-3.5 text-xs text-[#0A0E09] placeholder:text-gray-400 focus:border-[#96EE60] focus:bg-white focus:ring-2 focus:ring-[#96EE60]/20 focus:outline-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={closeReviewModal}
                  className="rounded-full px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#0A0E09] px-5 py-2.5 text-xs font-black text-white hover:bg-[#96EE60] hover:text-[#0A0E09] transition disabled:opacity-50 shadow-md"
                >
                  {submittingReview ? (
                    <>
                      <Loader2 size={13} className="animate-spin" /> Submitting...
                    </>
                  ) : (
                    "Publish Review"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
