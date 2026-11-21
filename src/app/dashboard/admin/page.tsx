"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  DollarSign,
  UserCheck,
} from "lucide-react";
import { getAdminStats } from "@/lib/api";
import { AdminStats } from "@/types";
import { useAuth } from "@/context/auth-context";

export default function AdminDashboardOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalTutors: 0,
    totalStudents: 0,
    pendingTuitions: 0,
    approvedTuitions: 0,
    rejectedTuitions: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then((data) => {
        if (data) setStats(data);
      })
      .catch((err) => console.error("Error loading admin stats:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-[2.5rem] bg-[#0A0E09] p-8 text-white shadow-xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#96EE60] px-3 py-1 text-xs font-black uppercase text-[#0A0E09]">
              <ShieldCheck size={14} /> Master Administrator
            </span>
            <h1 className="mt-3 text-3xl font-black text-white">
              Platform Administration
            </h1>
            <p className="mt-1 text-xs text-white/70">
              Welcome back, {user?.name}. Monitor platform health, manage role
              permissions, and oversee Stripe subscriptions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/admin/tuitions"
              className="inline-flex items-center gap-2 rounded-full bg-[#96EE60] px-5 py-3 text-xs font-black text-[#0A0E09] hover:brightness-95 transition"
            >
              Review Pending Tuitions ({stats.pendingTuitions})
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <div className="rounded-3xl border border-[#0A0E09]/5 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Total Users</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ECEEFE] text-[#0A0E09]">
              <Users size={18} />
            </span>
          </div>
          <p className="mt-4 text-3xl font-black text-[#0A0E09]">
            {stats.totalUsers}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {stats.totalTutors} Tutors · {stats.totalStudents} Students
          </p>
        </div>

        {/* Pending Tuitions */}
        <div className="rounded-3xl border border-[#0A0E09]/5 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Pending Review</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
              <Clock size={18} />
            </span>
          </div>
          <p className="mt-4 text-3xl font-black text-amber-600">
            {stats.pendingTuitions}
          </p>
          <p className="mt-1 text-xs text-gray-400">Awaiting approval</p>
        </div>

        {/* Approved Tuitions */}
        <div className="rounded-3xl border border-[#0A0E09]/5 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Approved Posts</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#7FD09F] text-[#0A0E09]">
              <CheckCircle2 size={18} />
            </span>
          </div>
          <p className="mt-4 text-3xl font-black text-emerald-600">
            {stats.approvedTuitions}
          </p>
          <p className="mt-1 text-xs text-gray-400">Live on platform</p>
        </div>

        {/* Stripe Revenue */}
        <div className="rounded-3xl border border-[#0A0E09]/5 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Stripe Revenue</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#96EE60] text-[#0A0E09]">
              <DollarSign size={18} />
            </span>
          </div>
          <p className="mt-4 text-3xl font-black text-[#0A0E09]">
            ${stats.totalRevenue}
          </p>
          <p className="mt-1 text-xs text-emerald-600 font-bold">
            Pro subscriptions
          </p>
        </div>
      </div>

      {/* Admin Action Hub */}
      <div className="grid gap-6 sm:grid-cols-3">
        <Link
          href="/dashboard/admin/users"
          className="flex flex-col justify-between rounded-[2rem] bg-white p-6 border border-[#0A0E09]/5 shadow-sm hover:border-[#0A0E09]/20 transition group"
        >
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ECEEFE] text-[#0A0E09] group-hover:bg-[#96EE60] transition">
              <UserCheck size={18} />
            </div>
            <h3 className="mt-4 text-base font-extrabold text-[#0A0E09]">
              User Management
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              View registered users, change roles (student/tutor/admin), and monitor accounts.
            </p>
          </div>
          <div className="mt-5 flex items-center gap-1 text-xs font-black text-[#0A0E09]">
            <span>Manage users</span> <ArrowRight size={13} />
          </div>
        </Link>

        <Link
          href="/dashboard/admin/tuitions"
          className="flex flex-col justify-between rounded-[2rem] bg-white p-6 border border-[#0A0E09]/5 shadow-sm hover:border-[#0A0E09]/20 transition group"
        >
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ECFAB5] text-[#0A0E09] group-hover:bg-[#96EE60] transition">
              <ShieldCheck size={18} />
            </div>
            <h3 className="mt-4 text-base font-extrabold text-[#0A0E09]">
              Tuition Moderation
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Approve or reject newly submitted tuitions before they appear publicly.
            </p>
          </div>
          <div className="mt-5 flex items-center gap-1 text-xs font-black text-[#0A0E09]">
            <span>Review posts</span> <ArrowRight size={13} />
          </div>
        </Link>

        <Link
          href="/dashboard/admin/transactions"
          className="flex flex-col justify-between rounded-[2rem] bg-white p-6 border border-[#0A0E09]/5 shadow-sm hover:border-[#0A0E09]/20 transition group"
        >
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#D9F0FF] text-[#0A0E09] group-hover:bg-[#96EE60] transition">
              <CreditCard size={18} />
            </div>
            <h3 className="mt-4 text-base font-extrabold text-[#0A0E09]">
              Stripe Transactions
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Inspect Stripe subscription records, transaction IDs, amounts, and dates.
            </p>
          </div>
          <div className="mt-5 flex items-center gap-1 text-xs font-black text-[#0A0E09]">
            <span>View transactions</span> <ArrowRight size={13} />
          </div>
        </Link>
      </div>
    </div>
  );
}
