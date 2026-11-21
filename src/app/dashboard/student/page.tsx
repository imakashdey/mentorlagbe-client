"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Bookmark,
  GraduationCap,
} from "lucide-react";
import { getStudentStats, getMyApplications } from "@/lib/api";
import { StudentStats, Application } from "@/types";
import { useAuth } from "@/context/auth-context";

export default function StudentDashboardOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState<StudentStats>({
    totalApplied: 0,
    accepted: 0,
    pending: 0,
    plan: "free",
  });
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getStudentStats(), getMyApplications()])
      .then(([statsRes, appsRes]) => {
        if (statsRes) setStats(statsRes);
        if (appsRes) setRecentApplications(appsRes.slice(0, 5));
      })
      .catch((err) => console.error("Error loading student dashboard:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-[2.5rem] bg-[#FBE4E3] p-8 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFAB5] px-3 py-1 text-xs font-black uppercase text-[#0A0E09]">
              <GraduationCap size={14} /> Student Portal
            </span>
            <h1 className="mt-3 text-3xl font-black text-[#0A0E09]">
              Welcome back, {user?.name}!
            </h1>
            <p className="mt-1 text-xs text-[#0A0E09]/70">
              Track your tuition applications, communicate with tutors, and manage your learning goals.
            </p>
          </div>
          <Link
            href="/tuitions"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#0A0E09] px-6 py-3.5 text-xs font-black text-white hover:bg-[#96EE60] hover:text-[#0A0E09] transition"
          >
            Browse Tuitions <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Applied */}
        <div className="rounded-3xl border border-[#0A0E09]/5 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Total Applied</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ECEEFE] text-[#0A0E09]">
              <FileText size={18} />
            </span>
          </div>
          <p className="mt-4 text-3xl font-black text-[#0A0E09]">
            {stats.totalApplied}
          </p>
          <p className="mt-1 text-xs text-gray-400">Tuition applications</p>
        </div>

        {/* Accepted */}
        <div className="rounded-3xl border border-[#0A0E09]/5 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Accepted</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ECFAB5] text-emerald-800">
              <CheckCircle2 size={18} />
            </span>
          </div>
          <p className="mt-4 text-3xl font-black text-emerald-600">
            {stats.accepted}
          </p>
          <p className="mt-1 text-xs text-gray-400">Ready to learn</p>
        </div>

        {/* Pending */}
        <div className="rounded-3xl border border-[#0A0E09]/5 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Pending</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#D9F0FF] text-blue-800">
              <Clock size={18} />
            </span>
          </div>
          <p className="mt-4 text-3xl font-black text-amber-600">
            {stats.pending}
          </p>
          <p className="mt-1 text-xs text-gray-400">Awaiting tutor review</p>
        </div>

        {/* Current Plan */}
        <div className="rounded-3xl border border-[#0A0E09]/5 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Current Plan</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#96EE60] text-[#0A0E09]">
              <Sparkles size={18} />
            </span>
          </div>
          <p className="mt-4 text-3xl font-black uppercase text-[#0A0E09]">
            {user?.plan || stats.plan}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {user?.plan === "pro" ? "Priority queue active" : "Standard booking"}
          </p>
        </div>
      </div>

      {/* Recent Applications Preview */}
      <div className="rounded-[2.5rem] border border-[#0A0E09]/5 bg-white p-7 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-lg font-black text-[#0A0E09]">
              Recent Applications
            </h2>
            <p className="text-xs text-gray-500">
              Your latest submitted tuition requests
            </p>
          </div>
          <Link
            href="/dashboard/student/my-applications"
            className="text-xs font-bold text-[#0A0E09] hover:underline"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-gray-400">
            Loading applications...
          </div>
        ) : recentApplications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {recentApplications.map((app) => (
              <div
                key={app._id}
                className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center"
              >
                <div>
                  <h3 className="text-sm font-extrabold text-[#0A0E09]">
                    {app.tuitionTitle}
                  </h3>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Subject: <span className="font-semibold">{app.subject}</span> ·
                    Tutor: {app.tutorEmail}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-black text-[#0A0E09]">
                    ৳{Number(app.monthlyFee).toLocaleString("en-BD")}/mo
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-black uppercase ${
                      app.status === "accepted"
                        ? "bg-emerald-100 text-emerald-800"
                        : app.status === "rejected"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-xs text-gray-500">
              You haven&apos;t applied for any tuitions yet.
            </p>
            <Link
              href="/tuitions"
              className="mt-4 inline-flex rounded-full bg-[#96EE60] px-5 py-2.5 text-xs font-black text-[#0A0E09]"
            >
              Explore Available Tuitions
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
