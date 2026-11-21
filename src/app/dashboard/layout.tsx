"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Users,
  ShieldCheck,
  CreditCard,
  User,
  LogOut,
  Menu,
  X,
  GraduationCap,
  Sparkles,
  Bookmark,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If loading, show pleasant skeleton
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFCFB]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0A0E09] border-t-[#96EE60]" />
      </div>
    );
  }

  // If not logged in after loading finishes, redirect to login
  if (!user) {
    if (typeof window !== "undefined") {
      router.push("/sign-in");
    }
    return null;
  }

  const role = user.role || "student";

  // Sidebar navigation links tailored per role
  const getNavLinks = () => {
    switch (role) {
      case "student":
        return [
          {
            title: "Overview",
            href: "/dashboard/student",
            icon: LayoutDashboard,
          },
          {
            title: "My Applications",
            href: "/dashboard/student/my-applications",
            icon: FileText,
          },
          {
            title: "Saved Tuitions",
            href: "/dashboard/student/saved",
            icon: Bookmark,
          },
        ];
      case "tutor":
        return [
          {
            title: "Overview",
            href: "/dashboard/tutor",
            icon: LayoutDashboard,
          },
          {
            title: "Post a Tuition",
            href: "/dashboard/tutor/post-tuition",
            icon: PlusCircle,
          },
          {
            title: "My Created Tuitions",
            href: "/dashboard/tutor/my-tuitions",
            icon: FileText,
          },
          {
            title: "Manage Applicants",
            href: "/dashboard/tutor/applicants",
            icon: Users,
          },
        ];
      case "admin":
        return [
          {
            title: "Overview",
            href: "/dashboard/admin",
            icon: LayoutDashboard,
          },
          {
            title: "User Management",
            href: "/dashboard/admin/users",
            icon: Users,
          },
          {
            title: "Tuition Approvals",
            href: "/dashboard/admin/tuitions",
            icon: ShieldCheck,
          },
          {
            title: "Transactions",
            href: "/dashboard/admin/transactions",
            icon: CreditCard,
          },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="flex min-h-[calc(100vh-65px)] bg-[#F8F9FA]">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-[#0A0E09]/10 bg-[#0A0E09] p-6 text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Logo in Sidebar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#96EE60] text-[#0A0E09]">
                <GraduationCap size={20} />
              </span>
              <span className="text-lg font-black tracking-tight text-white">
                Mentor<span className="text-[#96EE60]">Lagbe</span>
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-1 text-white/70 hover:bg-white/10 lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          {/* User Profile Card */}
          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white/5 p-3.5 border border-white/10">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={user.name}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-[#96EE60]"
              />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#96EE60] text-sm font-black text-[#0A0E09]">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-black text-white">
                {user.name}
              </p>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="rounded-full bg-[#7FD09F] px-2 py-0.5 text-[9px] font-black uppercase text-[#0A0E09]">
                  {user.role}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${
                    user.plan === "pro"
                      ? "bg-[#96EE60] text-[#0A0E09]"
                      : "bg-white/15 text-white/80"
                  }`}
                >
                  {user.plan || "free"}
                </span>
              </div>
            </div>
          </div>

          {/* Role Navigation Items */}
          <div className="mt-6 space-y-1.5">
            <p className="px-3 text-[10px] font-black uppercase tracking-wider text-white/40">
              {role} Menu
            </p>
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-xs font-bold transition ${
                    active
                      ? "bg-[#96EE60] text-[#0A0E09] shadow-sm"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.title}</span>
                </Link>
              );
            })}

            {/* Shared Links */}
            <div className="pt-4 mt-4 border-t border-white/10">
              <p className="px-3 text-[10px] font-black uppercase tracking-wider text-white/40">
                Account &amp; Settings
              </p>
              <Link
                href="/dashboard/profile"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-xs font-bold transition mt-1.5 ${
                  pathname === "/dashboard/profile"
                    ? "bg-[#96EE60] text-[#0A0E09]"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                }`}
              >
                <User size={18} />
                <span>Update Profile</span>
              </Link>

              {role !== "admin" && (
                <Link
                  href="/pricing"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-xs font-bold text-[#96EE60] hover:bg-white/10 transition mt-1"
                >
                  <Sparkles size={18} />
                  <span>
                    {user.plan === "pro" ? "Pro Subscription" : "Upgrade to Pro"}
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Sign Out at bottom */}
        <div className="border-t border-white/10 pt-4">
          <button
            onClick={() => signOut()}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-xs font-bold text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Dashboard Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="flex h-16 items-center justify-between border-b border-[#0A0E09]/10 bg-white px-5 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-[#0A0E09] hover:bg-gray-100 lg:hidden"
            >
              <Menu size={22} />
            </button>
            <div className="flex items-center gap-2 text-xs font-bold text-[#0A0E09]/60">
              <span>Dashboard</span>
              <ChevronRight size={14} />
              <span className="capitalize text-[#0A0E09] font-extrabold">
                {role}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/tuitions"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#0A0E09]/15 px-4 py-2 text-xs font-bold text-[#0A0E09] hover:bg-gray-50 transition"
            >
              Browse Tuitions
            </Link>
            {user.plan === "pro" ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#96EE60] px-3 py-1 text-xs font-black text-[#0A0E09]">
                <Sparkles size={13} /> PRO ACTIVE
              </span>
            ) : (
              role !== "admin" && (
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#0A0E09] px-4 py-2 text-xs font-black text-white hover:bg-[#96EE60] hover:text-[#0A0E09] transition"
                >
                  Upgrade to Pro
                </Link>
              )
            )}
          </div>
        </header>

        {/* Dashboard Content Body */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
