"use client";

import Link from "next/link";
import { useState } from "react";
import { GraduationCap, Menu, X, Bookmark, Sparkles } from "lucide-react";
import { useAuth } from "@/context/auth-context";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Tuitions", href: "/tuitions" },
  { name: "Pricing", href: "/pricing" },
  { name: "How It Works", href: "/#how-it-works" },
];

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const ghost =
    "rounded-full px-4 py-2.5 text-sm font-bold text-white hover:bg-white/10 transition";

  const getDashboardHref = () => {
    if (!user) return "/dashboard";
    return `/dashboard/${user.role}`;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0A0E09] shadow-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#96EE60] text-[#0A0E09] shadow-sm">
            <GraduationCap size={23} />
          </span>
          <span className="text-xl font-extrabold tracking-tight text-white">
            Mentor<span className="text-[#96EE60]">Lagbe</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-semibold text-white/75 transition hover:text-white"
            >
              {link.name}
            </Link>
          ))}
          {user?.role === "student" && (
            <Link
              href="/dashboard/student/saved"
              className="flex items-center gap-1.5 text-sm font-semibold text-white/75 transition hover:text-[#96EE60]"
            >
              <Bookmark size={15} />
              Saved
            </Link>
          )}
        </div>

        {/* Desktop Auth */}
        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              {user.plan === "pro" && (
                <span className="flex items-center gap-1 rounded-full bg-[#96EE60] px-2.5 py-1 text-xs font-black text-[#0A0E09]">
                  <Sparkles size={12} /> PRO
                </span>
              )}
              <Link href={getDashboardHref()} className={ghost}>
                Dashboard
              </Link>
              <Link href="/dashboard/profile" className={ghost}>
                Update Profile
              </Link>
              <div className="flex items-center gap-2.5 border-l border-white/15 pl-3">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={user.name}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-[#96EE60]"
                  />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#96EE60] text-sm font-bold text-[#0A0E09]">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="leading-tight">
                  <p className="max-w-[120px] truncate text-sm font-bold text-white">
                    {user.name}
                  </p>
                  <span className="rounded-full bg-[#7FD09F] px-2 py-0.5 text-[10px] font-extrabold uppercase text-[#0A0E09]">
                    {user.role}
                  </span>
                </div>
              </div>
              <button
                onClick={signOut}
                className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#0A0E09] hover:bg-[#96EE60] transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/sign-in" className={ghost}>
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full bg-[#96EE60] px-5 py-2.5 text-sm font-bold text-[#0A0E09] hover:brightness-95 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg p-2 text-white hover:bg-white/10 lg:hidden"
        >
          {open ? <X size={25} /> : <Menu size={25} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <div className="border-t border-white/10 bg-[#0A0E09] px-5 pb-5 pt-2 lg:hidden">
          <div className="flex flex-col py-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                {link.name}
              </Link>
            ))}
            {user && (
              <>
                <Link
                  href={getDashboardHref()}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-semibold text-[#96EE60] hover:bg-white/10"
                >
                  Dashboard ({user.role})
                </Link>
                {user.role === "student" && (
                  <Link
                    href="/dashboard/student/saved"
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
                  >
                    Saved Tuitions
                  </Link>
                )}
                <Link
                  href="/dashboard/profile"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Update Profile
                </Link>
              </>
            )}
          </div>
          <div className="mt-3 border-t border-white/10 pt-3 flex gap-3">
            {user ? (
              <button
                onClick={() => {
                  setOpen(false);
                  signOut();
                }}
                className="w-full rounded-full bg-white py-3 text-sm font-bold text-[#0A0E09] hover:bg-[#96EE60]"
              >
                Sign Out ({user.name})
              </button>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  onClick={() => setOpen(false)}
                  className="w-full rounded-full border border-white/25 py-2.5 text-center text-sm font-bold text-white hover:bg-white/10"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setOpen(false)}
                  className="w-full rounded-full bg-[#96EE60] py-2.5 text-center text-sm font-bold text-[#0A0E09] hover:brightness-95"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
