"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  Users,
  Sparkles,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { getTutorStats } from "@/lib/api";
import { TutorStats } from "@/types";
import { useAuth } from "@/context/auth-context";

export default function TutorDashboardOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState<TutorStats>({
    totalTuitions: 0,
    activeApproved: 0,
    totalApplicants: 0,
    plan: "free",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTutorStats()
      .then((data) => {
        if (data) setStats(data);
      })
      .catch((err) => console.error("Error loading tutor stats:", err))
      .finally(() => setLoading(false));
  }, []);

  const isFree = (user?.plan || stats.plan) !== "pro";
  const postsRemaining = Math.max(0, 2 - stats.totalTuitions);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-[2.5rem] bg-[#ECFAB5] p-8 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-black uppercase text-[#0A0E09]">
              <ShieldCheck size={14} /> Tutor Dashboard
            </span>
            <h1 className="mt-3 text-3xl font-black text-[#0A0E09]">
              Welcome back, {user?.name}!
            </h1>
            <p className="mt-1 text-xs text-[#0A0E09]/75">
              Manage your tuition batches, review student applicants, and publish new academic sessions.
            </p>
          </div>
          <Link
            href="/dashboard/tutor/post-tuition"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#0A0E09] px-6 py-3.5 text-xs font-black text-white hover:bg-[#96EE60] hover:text-[#0A0E09] transition"
          >
            <PlusCircle size={15} /> Post New Tuition
          </Link>
        </div>
      </div>

      {/* Free Plan Limit Notice (if applicable) */}
      {isFree && (
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-amber-300 bg-amber-50 p-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="shrink-0 text-amber-600 mt-0.5" />
            <div>
              <p className="text-xs font-extrabold text-[#0A0E09]">
                Free Plan Limitation: {stats.totalTuitions}/2 Tuitions Posted
              </p>
              <p className="mt-0.5 text-xs text-[#0A0E09]/70">
                {postsRemaining > 0
                  ? `You have ${postsRemaining} free post slot(s) remaining. Upgrade to Pro for unlimited postings.`
                  : "You have reached your limit of 2 free tuition posts. Upgrade to Pro for unlimited posts."}
              </p>
            </div>
          </div>
          <Link
            href="/pricing"
            className="shrink-0 rounded-full bg-[#0A0E09] px-4 py-2 text-xs font-bold text-white hover:bg-[#96EE60] hover:text-[#0A0E09] transition"
          >
            Upgrade to Pro ($15)
          </Link>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Posted */}
        <div className="rounded-3xl border border-[#0A0E09]/5 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Total Tuitions</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ECEEFE] text-[#0A0E09]">
              <FileText size={18} />
            </span>
          </div>
          <p className="mt-4 text-3xl font-black text-[#0A0E09]">
            {stats.totalTuitions}
          </p>
          <p className="mt-1 text-xs text-gray-400">Total batches created</p>
        </div>

        {/* Active & Approved */}
        <div className="rounded-3xl border border-[#0A0E09]/5 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Live Tuitions</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#7FD09F] text-[#0A0E09]">
              <CheckCircle2 size={18} />
            </span>
          </div>
          <p className="mt-4 text-3xl font-black text-emerald-600">
            {stats.activeApproved}
          </p>
          <p className="mt-1 text-xs text-gray-400">Approved &amp; visible</p>
        </div>

        {/* Total Applicants */}
        <div className="rounded-3xl border border-[#0A0E09]/5 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Applicants</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#D9F0FF] text-[#0A0E09]">
              <Users size={18} />
            </span>
          </div>
          <p className="mt-4 text-3xl font-black text-[#0A0E09]">
            {stats.totalApplicants}
          </p>
          <p className="mt-1 text-xs text-gray-400">Student applications</p>
        </div>

        {/* Plan Status */}
        <div className="rounded-3xl border border-[#0A0E09]/5 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Tutor Tier</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#96EE60] text-[#0A0E09]">
              <Sparkles size={18} />
            </span>
          </div>
          <p className="mt-4 text-3xl font-black uppercase text-[#0A0E09]">
            {user?.plan || stats.plan}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {user?.plan === "pro" ? "Verified badge active" : "Max 2 posts"}
          </p>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        <Link
          href="/dashboard/tutor/my-tuitions"
          className="flex items-center justify-between rounded-[2rem] bg-white p-6 border border-[#0A0E09]/5 shadow-sm hover:border-[#0A0E09]/20 transition group"
        >
          <div>
            <h3 className="text-base font-extrabold text-[#0A0E09] group-hover:text-emerald-700">
              Manage Created Tuitions
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Edit listings, close batches, or delete old posts.
            </p>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ECEEFE] text-[#0A0E09] group-hover:bg-[#96EE60] transition">
            <ArrowRight size={18} />
          </span>
        </Link>

        <Link
          href="/dashboard/tutor/applicants"
          className="flex items-center justify-between rounded-[2rem] bg-white p-6 border border-[#0A0E09]/5 shadow-sm hover:border-[#0A0E09]/20 transition group"
        >
          <div>
            <h3 className="text-base font-extrabold text-[#0A0E09] group-hover:text-emerald-700">
              Review Student Applicants
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Accept or reject incoming applications for your classes.
            </p>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ECEEFE] text-[#0A0E09] group-hover:bg-[#96EE60] transition">
            <ArrowRight size={18} />
          </span>
        </Link>
      </div>
    </div>
  );
}
