"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Laptop,
  MapPin,
  BookOpen,
  Calendar,
  DollarSign,
  ArrowLeft,
  CheckCircle2,
  Clock,
  User,
  ShieldCheck,
  Send,
  Loader2,
  Bookmark,
  Star,
  MessageSquare,
} from "lucide-react";
import {
  getTuitionById,
  applyTuition,
  checkApplication,
  getTuitionReviews,
  checkReviewEligibility,
  submitReview,
} from "@/lib/api";
import { Tuition, Review } from "@/types";
import { useAuth } from "@/context/auth-context";
import { isBookmarked, toggleBookmark } from "@/lib/bookmarks";
import { toast } from "sonner";

export default function TuitionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();

  const [tuition, setTuition] = useState<Tuition | null>(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [checkingApplied, setCheckingApplied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Application Modal state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [studentPhone, setStudentPhone] = useState("");
  const [preferredSchedule, setPreferredSchedule] = useState("");
  const [studentNote, setStudentNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Real Reviews & Ratings state (Optional Requirement 5)
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Review Form & Eligibility
  const [reviewEligibility, setReviewEligibility] = useState<{
    eligible: boolean;
    alreadyReviewed: boolean;
    existingReview: Review | null;
  } | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [ratingInput, setRatingInput] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentInput, setCommentInput] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Load tuition details
  useEffect(() => {
    getTuitionById(id)
      .then((data) => {
        setTuition(data);
        setBookmarked(isBookmarked(data._id));
      })
      .catch((err) => {
        console.error("Failed to load tuition:", err);
        toast.error("Could not find tuition details");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Load real reviews for this tuition
  useEffect(() => {
    if (id) {
      setLoadingReviews(true);
      getTuitionReviews(id)
        .then((res) => {
          setReviews(res.reviews || []);
          setAverageRating(res.averageRating || 0);
          setTotalReviews(res.totalReviews || 0);
        })
        .catch((err) => console.error("Reviews load error:", err))
        .finally(() => setLoadingReviews(false));
    }
  }, [id]);

  // Check application status and review eligibility for logged-in students
  useEffect(() => {
    if (user && user.role === "student" && id) {
      setCheckingApplied(true);
      checkApplication(id)
        .then((res) => {
          if (res?.applied) {
            setApplied(true);
          }
        })
        .catch(() => {})
        .finally(() => setCheckingApplied(false));

      // Check if student's application was accepted, making them eligible to review
      checkReviewEligibility(id)
        .then((elig) => {
          setReviewEligibility(elig);
          if (elig?.existingReview) {
            setRatingInput(elig.existingReview.rating);
            setCommentInput(elig.existingReview.comment);
          }
        })
        .catch(() => {});
    }
  }, [user, id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingInput || ratingInput < 1 || ratingInput > 5) {
      toast.error("Please select a rating between 1 and 5 stars");
      return;
    }
    if (!commentInput.trim()) {
      toast.error("Please write your review feedback");
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await submitReview({
        tuitionId: id,
        rating: ratingInput,
        comment: commentInput.trim(),
      });
      toast.success(res.message || "Thank you! Your review has been saved.");
      setShowReviewForm(false);

      // Refresh reviews list and eligibility state
      const updated = await getTuitionReviews(id);
      setReviews(updated.reviews || []);
      setAverageRating(updated.averageRating || 0);
      setTotalReviews(updated.totalReviews || 0);
      setReviewEligibility({
        eligible: true,
        alreadyReviewed: true,
        existingReview: res.review,
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentPhone.trim() || !preferredSchedule.trim()) {
      toast.error("Please provide both phone number and preferred schedule");
      return;
    }

    setSubmitting(true);
    try {
      await applyTuition({
        tuitionId: id,
        studentPhone: studentPhone.trim(),
        preferredSchedule: preferredSchedule.trim(),
        studentNote: studentNote.trim(),
      });

      toast.success("Application submitted successfully!");
      setApplied(true);
      setIsApplyModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleBookmark = () => {
    if (!tuition) return;
    const result = toggleBookmark(tuition, user?.plan || "free");
    if (result.limitReached) {
      toast.error(
        "Free students can bookmark up to 5 tuitions. Upgrade to Pro for unlimited bookmarks!"
      );
      return;
    }
    setBookmarked(result.added);
    if (result.added) toast.success("Saved to your bookmarks!");
    else toast.info("Removed from bookmarks");
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0A0E09] border-t-[#96EE60]" />
      </div>
    );
  }

  if (!tuition) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <h2 className="text-2xl font-black text-[#0A0E09]">
          Tuition Not Found
        </h2>
        <p className="mt-2 text-sm text-[#0A0E09]/60">
          This tuition listing might have been removed or is awaiting admin
          approval.
        </p>
        <Link
          href="/tuitions"
          className="mt-6 inline-flex rounded-full bg-[#96EE60] px-6 py-3 text-sm font-bold text-[#0A0E09]"
        >
          Back to Tuitions
        </Link>
      </div>
    );
  }

  const isOnline = tuition.mode === "Online";
  const tutor = tuition.tutor;

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-20">
      {/* Top Navigation */}
      <div className="border-b border-[#0A0E09]/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link
            href="/tuitions"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0A0E09]/70 hover:text-[#0A0E09]"
          >
            <ArrowLeft size={16} /> All Tuitions
          </Link>
          <button
            onClick={handleToggleBookmark}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition ${
              bookmarked
                ? "bg-[#0A0E09] text-[#96EE60]"
                : "border border-[#0A0E09]/15 bg-white text-[#0A0E09] hover:bg-gray-50"
            }`}
          >
            <Bookmark size={14} className={bookmarked ? "fill-[#96EE60]" : ""} />
            {bookmarked ? "Saved" : "Save for Later"}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 pt-8 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          {/* Main Details Column */}
          <div>
            {/* Banner Image */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[2.5rem] bg-[#0A0E09] shadow-lg">
              {tuition.bannerImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={tuition.bannerImage}
                  alt={tuition.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#7FD09F] text-8xl font-black text-[#0A0E09]">
                  {tuition.subject.charAt(0)}
                </div>
              )}
              <span
                className={`absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-black shadow-md ${
                  isOnline ? "bg-[#7FD09F] text-[#0A0E09]" : "bg-white text-[#0A0E09]"
                }`}
              >
                {isOnline ? <Laptop size={14} /> : <MapPin size={14} />}
                {tuition.mode}
              </span>
            </div>

            {/* Title & Tags */}
            <div className="mt-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#ECFAB5] px-3.5 py-1 text-xs font-black text-[#0A0E09]">
                  {tuition.subject}
                </span>
                <span className="rounded-full bg-[#ECEEFE] px-3.5 py-1 text-xs font-bold text-[#0A0E09]">
                  {tuition.classLevel}
                </span>
                {tuition.daysPerWeek && (
                  <span className="rounded-full bg-[#D9F0FF] px-3.5 py-1 text-xs font-bold text-[#0A0E09]">
                    {tuition.daysPerWeek} Days / Week
                  </span>
                )}
              </div>

              <h1 className="mt-4 text-3xl font-black text-[#0A0E09] md:text-4xl">
                {tuition.title}
              </h1>

              <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-[#0A0E09]/70">
                <MapPin size={16} className="text-[#0A0E09]" />
                {tuition.location || tuition.mode}
              </div>
            </div>

            {/* Description */}
            <div className="mt-8 rounded-[2rem] bg-white p-7 shadow-sm border border-[#0A0E09]/5">
              <h2 className="text-lg font-black text-[#0A0E09]">About this Tuition</h2>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#0A0E09]/75">
                {tuition.description || "No description provided."}
              </p>
            </div>

            {/* Quick Highlights Grid */}
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-[#ECFAB5]/50 p-4">
                <p className="text-xs font-bold text-[#0A0E09]/60">Subject</p>
                <p className="mt-1 text-sm font-black text-[#0A0E09]">
                  {tuition.subject}
                </p>
              </div>
              <div className="rounded-2xl bg-[#ECEEFE]/50 p-4">
                <p className="text-xs font-bold text-[#0A0E09]/60">Class Level</p>
                <p className="mt-1 text-sm font-black text-[#0A0E09]">
                  {tuition.classLevel}
                </p>
              </div>
              <div className="rounded-2xl bg-[#D9F0FF]/50 p-4">
                <p className="text-xs font-bold text-[#0A0E09]/60">Weekly Schedule</p>
                <p className="mt-1 text-sm font-black text-[#0A0E09]">
                  {tuition.daysPerWeek ? `${tuition.daysPerWeek} days` : "Flexible"}
                </p>
              </div>
            </div>

            {/* Reviews / Feedback (Optional Requirement 5: Student Review & Rating System) */}
            <div id="reviews-section" className="mt-10 rounded-[2rem] bg-white p-7 shadow-sm border border-[#0A0E09]/5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-black text-[#0A0E09]">
                    Student Feedback &amp; Ratings
                  </h3>
                  <p className="text-xs text-[#0A0E09]/60">
                    Verified reviews from enrolled students
                  </p>
                </div>
                <div className="flex items-center gap-1.5 self-start rounded-xl bg-[#ECFAB5] px-3.5 py-1.5 text-xs font-black text-[#0A0E09]">
                  <Star size={15} className="fill-amber-500 text-amber-500" />
                  <span>
                    {averageRating > 0 ? averageRating.toFixed(1) : "New"} (
                    {totalReviews} {totalReviews === 1 ? "Review" : "Reviews"})
                  </span>
                </div>
              </div>

              {/* Review Submission Form or Trigger for Eligible Students */}
              {user?.role === "student" && (
                <div className="mt-6 rounded-2xl bg-[#0A0E09]/[0.02] border border-[#0A0E09]/10 p-5">
                  {reviewEligibility?.eligible ? (
                    <div>
                      {!showReviewForm ? (
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700">
                              <CheckCircle2 size={13} /> Enrolled Student
                            </span>
                            <h4 className="mt-1.5 text-sm font-black text-[#0A0E09]">
                              {reviewEligibility.alreadyReviewed
                                ? "You have already reviewed this tuition"
                                : "Share your learning experience"}
                            </h4>
                            <p className="text-xs text-[#0A0E09]/60">
                              {reviewEligibility.alreadyReviewed
                                ? "You can update your rating and feedback anytime."
                                : "Your honest review helps other students choose the best mentor."}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowReviewForm(true)}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#96EE60] px-4 py-2 text-xs font-black text-[#0A0E09] hover:brightness-95 transition shadow-sm self-start sm:self-center"
                          >
                            <Star size={14} className="fill-[#0A0E09]" />
                            {reviewEligibility.alreadyReviewed
                              ? "Edit My Review"
                              : "Write a Review"}
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                          <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
                            <div>
                              <h4 className="text-sm font-black text-[#0A0E09]">
                                {reviewEligibility.alreadyReviewed
                                  ? "Update Your Review"
                                  : "Write a Review"}
                              </h4>
                              <p className="text-[11px] text-[#0A0E09]/60">
                                Rate your mentor and leave constructive feedback
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setShowReviewForm(false)}
                              className="text-xs font-bold text-gray-500 hover:text-gray-800"
                            >
                              Cancel
                            </button>
                          </div>

                          {/* Interactive 5-Star Selector */}
                          <div>
                            <label className="block text-xs font-bold text-[#0A0E09] mb-1.5">
                              Rating: <span className="text-amber-600 font-black">{ratingInput} Star{ratingInput > 1 ? "s" : ""}</span>
                            </label>
                            <div className="flex items-center gap-1.5">
                              {[1, 2, 3, 4, 5].map((star) => {
                                const isFilled =
                                  (hoverRating || ratingInput) >= star;
                                return (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRatingInput(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                                  >
                                    <Star
                                      size={26}
                                      className={`transition-colors ${
                                        isFilled
                                          ? "fill-amber-400 text-amber-400 drop-shadow-xs"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  </button>
                                );
                              })}
                              <span className="ml-2 text-xs font-semibold text-gray-500">
                                {ratingInput === 5
                                  ? "Excellent"
                                  : ratingInput === 4
                                  ? "Very Good"
                                  : ratingInput === 3
                                  ? "Good"
                                  : ratingInput === 2
                                  ? "Fair"
                                  : "Poor"}
                              </span>
                            </div>
                          </div>

                          {/* Feedback Textarea */}
                          <div>
                            <label className="block text-xs font-bold text-[#0A0E09] mb-1.5">
                              Review Feedback *
                            </label>
                            <textarea
                              rows={3}
                              required
                              value={commentInput}
                              onChange={(e) => setCommentInput(e.target.value)}
                              placeholder="How was the mentor's teaching style, punctuality, and concept explanations?"
                              className="w-full rounded-xl border border-gray-200 bg-white p-3 text-xs text-[#0A0E09] placeholder:text-gray-400 focus:border-[#96EE60] focus:ring-2 focus:ring-[#96EE60]/20 focus:outline-none"
                            />
                          </div>

                          <div className="flex items-center justify-end gap-2.5">
                            <button
                              type="button"
                              onClick={() => setShowReviewForm(false)}
                              className="rounded-full px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 transition"
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
                                  <Loader2 size={13} className="animate-spin" /> Saving...
                                </>
                              ) : (
                                "Submit Review"
                              )}
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  ) : applied ? (
                    <div className="flex items-center gap-2.5 text-xs text-amber-800">
                      <Clock size={16} className="shrink-0 text-amber-600" />
                      <span>
                        Your application for this tuition is pending. Once the tutor accepts your application, you can rate and leave a review.
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 text-xs text-gray-600">
                      <MessageSquare size={16} className="shrink-0 text-gray-400" />
                      <span>
                        Reviews are exclusive to enrolled students whose applications have been accepted by the tutor.
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Reviews List */}
              <div className="mt-6 space-y-4">
                {loadingReviews ? (
                  <div className="flex justify-center py-6">
                    <Loader2 size={24} className="animate-spin text-[#96EE60]" />
                  </div>
                ) : reviews.length > 0 ? (
                  reviews.map((rev, i) => (
                    <div
                      key={rev._id || i}
                      className="rounded-2xl bg-gray-50/80 p-4 border border-gray-100 hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          {rev.studentImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={rev.studentImage}
                              alt={rev.studentName}
                              className="h-8 w-8 rounded-full object-cover ring-2 ring-[#96EE60]"
                            />
                          ) : (
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#96EE60] text-xs font-black text-[#0A0E09]">
                              {rev.studentName?.charAt(0) || "S"}
                            </span>
                          )}
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="text-xs font-bold text-[#0A0E09]">
                                {rev.studentName}
                              </p>
                              <span className="rounded bg-emerald-50 px-1.5 py-0.2 text-[9px] font-black text-emerald-700">
                                Verified Student
                              </span>
                            </div>
                            <span className="text-[10px] text-gray-400">
                              {rev.createdAt
                                ? new Date(rev.createdAt).toLocaleDateString("en-BD", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })
                                : "Recently"}
                            </span>
                          </div>
                        </div>
                        <div className="flex text-amber-400">
                          {Array.from({ length: rev.rating || 5 }).map((_, r) => (
                            <Star key={r} size={13} className="fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="mt-2.5 text-xs text-[#0A0E09]/80 leading-relaxed">
                        &quot;{rev.comment}&quot;
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl bg-gray-50/50 p-6 text-center border border-dashed border-gray-200">
                    <MessageSquare size={24} className="mx-auto text-gray-300" />
                    <p className="mt-2 text-xs font-medium text-gray-500">
                      No reviews yet for this tuition.
                    </p>
                    <p className="text-[11px] text-gray-400">
                      Enrolled students with accepted applications will share their feedback here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Booking Card */}
          <div className="space-y-6">
            <div className="sticky top-24 rounded-[2.5rem] bg-[#0A0E09] p-7 text-white shadow-2xl">
              <div className="flex items-baseline justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-white/60">
                    Monthly Fee
                  </p>
                  <p className="mt-1 text-4xl font-black text-[#96EE60]">
                    ৳{Number(tuition.monthlyFee).toLocaleString("en-BD")}
                  </p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                  Per Month
                </span>
              </div>

              {/* Tutor Profile Card inside Booking Box */}
              <div className="mt-6 rounded-2xl bg-white/5 p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  {tutor?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={tutor.image}
                      alt={tutor.name || tuition.tutorName}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-[#96EE60]"
                    />
                  ) : (
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#96EE60] font-black text-[#0A0E09]">
                      {tuition.tutorName?.charAt(0)}
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-sm font-bold text-white">
                        {tutor?.name || tuition.tutorName}
                      </p>
                      {tutor?.plan === "pro" && (
                        <span title="Verified Pro Tutor" className="inline-flex items-center">
                          <ShieldCheck
                            size={15}
                            className="shrink-0 text-[#96EE60]"
                          />
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-white/60">
                      {tuition.tutorEmail}
                    </p>
                  </div>
                </div>

                {tutor?.bio && (
                  <p className="mt-3 text-xs leading-relaxed text-white/75 line-clamp-3">
                    {tutor.bio}
                  </p>
                )}
              </div>

              {/* Role Restricted Application Flow */}
              <div className="mt-6">
                {!user ? (
                  <div className="rounded-2xl bg-white/10 p-4 text-center">
                    <p className="text-xs font-medium text-white/80">
                      Please sign in as a student to apply for this tuition.
                    </p>
                    <Link
                      href="/sign-in"
                      className="mt-3 block rounded-full bg-[#96EE60] py-3 text-center text-xs font-bold text-[#0A0E09] hover:brightness-95 transition"
                    >
                      Sign In to Apply
                    </Link>
                  </div>
                ) : user.role !== "student" ? (
                  <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-center">
                    <p className="text-xs font-bold text-amber-300">
                      Tutors and Admins cannot apply for tuitions.
                    </p>
                    <p className="mt-1 text-[11px] text-white/60">
                      Logged in as {user.role} ({user.email}). Only student accounts can apply.
                    </p>
                  </div>
                ) : applied ? (
                  <div className="flex items-center justify-center gap-2 rounded-2xl bg-[#7FD09F]/20 p-4 text-center border border-[#7FD09F]/40">
                    <CheckCircle2 size={18} className="text-[#7FD09F]" />
                    <span className="text-xs font-bold text-[#7FD09F]">
                      You have already applied for this tuition
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsApplyModalOpen(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#96EE60] py-4 text-sm font-black text-[#0A0E09] transition hover:brightness-95 shadow-lg shadow-[#96EE60]/20"
                  >
                    Apply for Tuition <Send size={16} />
                  </button>
                )}
              </div>

              {/* Guarantees */}
              <ul className="mt-6 space-y-2.5 text-xs text-white/65">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#96EE60]" />
                  Verified contact & qualification
                </li>
                <li className="flex items-center gap-2">
                  <Clock size={14} className="text-[#96EE60]" />
                  Direct response in your student dashboard
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-[2.5rem] bg-white p-7 shadow-2xl">
            <h3 className="text-2xl font-black text-[#0A0E09]">
              Apply for Tuition
            </h3>
            <p className="mt-1 text-xs text-[#0A0E09]/60">
              Submit your details to <span className="font-bold">{tuition.tutorName}</span> for &quot;{tuition.title}&quot;
            </p>

            <form onSubmit={handleApplySubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-[#0A0E09]">
                  Student Name
                </label>
                <input
                  type="text"
                  disabled
                  value={user?.name || ""}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-semibold text-gray-700"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-[#0A0E09]">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-semibold text-gray-700"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-[#0A0E09]">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 017XXXXXXXX"
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  className="w-full rounded-xl border border-[#0A0E09]/20 px-3 py-2.5 text-xs font-semibold text-[#0A0E09] outline-none focus:border-[#0A0E09]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-[#0A0E09]">
                  Preferred Schedule *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Evenings, 6:00 PM - 8:00 PM (Sun, Tue, Thu)"
                  value={preferredSchedule}
                  onChange={(e) => setPreferredSchedule(e.target.value)}
                  className="w-full rounded-xl border border-[#0A0E09]/20 px-3 py-2.5 text-xs font-semibold text-[#0A0E09] outline-none focus:border-[#0A0E09]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-[#0A0E09]">
                  Learning Note / Academic Goal
                </label>
                <textarea
                  rows={3}
                  placeholder="Share your current grade, exam preparation needs, or specific topics you want help with..."
                  value={studentNote}
                  onChange={(e) => setStudentNote(e.target.value)}
                  className="w-full rounded-xl border border-[#0A0E09]/20 px-3 py-2 text-xs font-medium text-[#0A0E09] outline-none focus:border-[#0A0E09]"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="rounded-full px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#96EE60] px-6 py-2.5 text-xs font-black text-[#0A0E09] hover:brightness-95 disabled:opacity-50 transition"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  {submitting ? "Submitting..." : "Send Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
