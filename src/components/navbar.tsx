"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  GraduationCap,
  Menu,
  X,
  Bookmark,
  Sparkles,
  ChevronDown,
  LayoutDashboard,
  User,
  LogOut,
  CreditCard,
  Settings,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Tuitions", href: "/tuitions" },
  { name: "Pricing", href: "/pricing" },
  { name: "How It Works", href: "/#how-it-works" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, signOut, openProfileDrawer } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setDropdownOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  const getDashboardHref = () => {
    if (!user) return "/dashboard";
    return `/dashboard/${user.role}`;
  };

  const ghost =
    "rounded-full px-4 py-2 text-sm font-bold text-white/80 hover:text-white hover:bg-white/10 transition";

  return (
    <header className="sticky top-0 z-50 bg-[#0A0E09] border-b border-white/10 shadow-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#96EE60] text-[#0A0E09] shadow-sm">
            <GraduationCap size={22} />
          </span>
          <span className="text-xl font-extrabold tracking-tight text-white">
            Mentor<span className="text-[#96EE60]">Lagbe</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-semibold transition ${
                  active
                    ? "text-[#96EE60] font-bold"
                    : "text-white/75 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
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

        {/* Desktop Auth / User Dropdown */}
        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              {/* Trigger Button */}
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-3 rounded-full border border-white/15 bg-white/5 py-1.5 pl-2 pr-3.5 text-left text-white transition hover:border-[#96EE60]/50 hover:bg-white/10"
              >
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-[#96EE60]"
                  />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#96EE60] text-xs font-black text-[#0A0E09]">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="leading-tight">
                  <div className="flex items-center gap-1.5">
                    <span className="max-w-[110px] truncate text-xs font-bold text-white">
                      {user.name}
                    </span>
                    {user.plan === "pro" && (
                      <span className="rounded bg-[#96EE60] px-1.5 py-0.2 text-[9px] font-black uppercase text-[#0A0E09]">
                        PRO
                      </span>
                    )}
                  </div>
                  <span className="rounded-full bg-[#7FD09F] px-1.5 py-0.2 text-[9px] font-black uppercase text-[#0A0E09]">
                    {user.role}
                  </span>
                </div>
                <ChevronDown
                  size={15}
                  className={`text-white/60 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl z-50 text-[#0A0E09] animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* User Profile Header in Dropdown */}
                  <div className="border-b border-gray-100 px-3 py-2.5">
                    <p className="truncate text-xs font-black text-[#0A0E09]">
                      {user.name}
                    </p>
                    <p className="truncate text-[11px] text-gray-500">
                      {user.email}
                    </p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="rounded-full bg-[#7FD09F] px-2 py-0.5 text-[9px] font-black uppercase text-[#0A0E09]">
                        {user.role}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${
                          user.plan === "pro"
                            ? "bg-[#96EE60] text-[#0A0E09]"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {user.plan || "free"} plan
                      </span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1 space-y-0.5">
                    <Link
                      href={getDashboardHref()}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 hover:bg-[#96EE60]/20 hover:text-[#0A0E09] transition"
                    >
                      <LayoutDashboard size={15} className="text-[#0A0E09]" />
                      <span>Dashboard Overview</span>
                    </Link>

                    {/* Update Profile opens side-drawer */}
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        openProfileDrawer();
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-bold text-gray-700 hover:bg-[#96EE60]/20 hover:text-[#0A0E09] transition"
                    >
                      <User size={15} className="text-[#0A0E09]" />
                      <span>Update Profile (Slide Drawer)</span>
                    </button>

                    {user.role === "student" && (
                      <Link
                        href="/dashboard/student/saved"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 hover:bg-[#96EE60]/20 hover:text-[#0A0E09] transition"
                      >
                        <Bookmark size={15} className="text-[#0A0E09]" />
                        <span>Saved Tuitions</span>
                      </Link>
                    )}

                    {user.role !== "admin" && (
                      <Link
                        href="/pricing"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-[#0A0E09] hover:bg-[#96EE60]/20 transition"
                      >
                        <Sparkles size={15} className="text-emerald-600" />
                        <span>
                          {user.plan === "pro"
                            ? "Pro Subscription"
                            : "Upgrade to Pro"}
                        </span>
                      </Link>
                    )}
                  </div>

                  {/* Sign Out */}
                  <div className="border-t border-gray-100 pt-1 mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        signOut();
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/sign-in" className={ghost}>
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full bg-[#96EE60] px-5 py-2 text-sm font-bold text-[#0A0E09] hover:brightness-95 transition shadow-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          aria-label="Toggle navigation"
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-lg p-2 text-white hover:bg-white/10 lg:hidden"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#0A0E09] px-5 pb-5 pt-3 lg:hidden">
          {/* User Preview if logged in */}
          {user && (
            <div className="mb-3 flex items-center gap-3 rounded-2xl bg-white/10 p-3">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-[#96EE60]"
                />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#96EE60] text-sm font-black text-[#0A0E09]">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-black text-white">
                  {user.name}
                </p>
                <p className="truncate text-[10px] text-white/60">
                  {user.email}
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="rounded bg-[#7FD09F] px-1.5 py-0.2 text-[9px] font-black uppercase text-[#0A0E09]">
                    {user.role}
                  </span>
                  <span className="rounded bg-white/20 px-1.5 py-0.2 text-[9px] font-black uppercase text-white">
                    {user.plan || "free"}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white"
              >
                {link.name}
              </Link>
            ))}

            {user && (
              <>
                <Link
                  href={getDashboardHref()}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-[#96EE60] hover:bg-white/10"
                >
                  <LayoutDashboard size={16} />
                  <span>Dashboard ({user.role})</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    openProfileDrawer();
                  }}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-bold text-white hover:bg-white/10"
                >
                  <User size={16} />
                  <span>Update Profile (Slide Drawer)</span>
                </button>

                {user.role === "student" && (
                  <Link
                    href="/dashboard/student/saved"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
                  >
                    <Bookmark size={16} />
                    <span>Saved Tuitions</span>
                  </Link>
                )}

                {user.role !== "admin" && (
                  <Link
                    href="/pricing"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-[#96EE60] hover:bg-white/10"
                  >
                    <Sparkles size={16} />
                    <span>Pricing &amp; Pro Plan</span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Bottom Auth Buttons */}
          <div className="mt-4 border-t border-white/10 pt-3">
            {user ? (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  signOut();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-2.5 text-xs font-black text-[#0A0E09] hover:bg-[#96EE60] transition"
              >
                <LogOut size={14} />
                <span>Sign Out ({user.name})</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full border border-white/20 py-2.5 text-center text-xs font-bold text-white hover:bg-white/10"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full bg-[#96EE60] py-2.5 text-center text-xs font-black text-[#0A0E09] hover:brightness-95"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
