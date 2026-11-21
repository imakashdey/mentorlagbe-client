"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, GraduationCap, Loader2, Sparkles, Shield, User, BookOpen } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignInPage() {
  const { signIn, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email.trim()) errs.email = "Email is required";
    else if (!emailRegex.test(email)) errs.email = "Enter a valid email address";
    if (!password) errs.password = "Password is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    try {
      await signIn(email, password);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrors({});
  };

  const loading = submitting || authLoading;

  return (
    <section className="bg-[#FBE4E3] px-5 py-12 md:py-20">
      <div className="mx-auto grid max-w-4xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl shadow-[#0A0E09]/10 md:grid-cols-[1fr_1.1fr]">
        {/* Left Branding Panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-[#0A0E09] p-10 text-white md:flex">
          <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-[#96EE60]/20 blur-3xl" />
          <div className="absolute -bottom-20 -right-16 h-64 w-64 rounded-full bg-[#ECEEFE]/15 blur-3xl" />
          <div className="relative">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#96EE60] text-[#0A0E09] shadow-sm">
              <GraduationCap size={28} />
            </span>
            <h2 className="mt-8 text-3xl font-extrabold leading-tight">
              Welcome back to <span className="text-[#96EE60]">MentorLagbe</span>
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/70">
              Access your personalized dashboard, manage your tuitions, or track
              your learning applications in real time.
            </p>
          </div>

          {/* Quick Demo Access Buttons */}
          <div className="relative mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#96EE60]">
              <Sparkles size={14} /> One-Click Test Accounts:
            </p>
            <div className="mt-3 space-y-2">
              <button
                type="button"
                onClick={() =>
                  handleDemoFill("admin@mentorlagbe.com", "Admin@123456")
                }
                className="flex w-full items-center justify-between rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-[#96EE60] hover:text-[#0A0E09] transition"
              >
                <span className="flex items-center gap-1.5">
                  <Shield size={13} /> Admin
                </span>
                <span className="opacity-75">admin@mentorlagbe.com</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  handleDemoFill(
                    "rahim.tutor@mentorlagbe.com",
                    "Tutor@123456"
                  )
                }
                className="flex w-full items-center justify-between rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-[#96EE60] hover:text-[#0A0E09] transition"
              >
                <span className="flex items-center gap-1.5">
                  <BookOpen size={13} /> Pro Tutor
                </span>
                <span className="opacity-75">rahim.tutor@mentorlagbe.com</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  handleDemoFill("student1@mentorlagbe.com", "Student@123456")
                }
                className="flex w-full items-center justify-between rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-[#96EE60] hover:text-[#0A0E09] transition"
              >
                <span className="flex items-center gap-1.5">
                  <User size={13} /> Student
                </span>
                <span className="opacity-75">student1@mentorlagbe.com</span>
              </button>
            </div>
          </div>
        </div>

        {/* Form Panel */}
        <div className="p-7 sm:p-10">
          <h1 className="text-3xl font-black text-[#0A0E09]">Sign In</h1>
          <p className="mt-2 text-sm text-[#0A0E09]/65">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/sign-up"
              className="font-bold text-[#0A0E09] underline decoration-[#96EE60] decoration-2 underline-offset-4"
            >
              Sign up
            </Link>
          </p>

          {/* Mobile Quick Test Accounts Notice */}
          <div className="mt-4 rounded-xl bg-[#ECFAB5] p-3 text-xs md:hidden">
            <p className="font-bold text-[#0A0E09]">Quick Test:</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() =>
                  handleDemoFill("admin@mentorlagbe.com", "Admin@123456")
                }
                className="rounded-lg bg-black px-2.5 py-1 text-[11px] font-bold text-white"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() =>
                  handleDemoFill(
                    "rahim.tutor@mentorlagbe.com",
                    "Tutor@123456"
                  )
                }
                className="rounded-lg bg-black px-2.5 py-1 text-[11px] font-bold text-white"
              >
                Tutor
              </button>
              <button
                type="button"
                onClick={() =>
                  handleDemoFill("student1@mentorlagbe.com", "Student@123456")
                }
                className="rounded-lg bg-black px-2.5 py-1 text-[11px] font-bold text-white"
              >
                Student
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-bold text-[#0A0E09]"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@mentorlagbe.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-2xl border bg-white px-4 py-3.5 text-sm font-semibold text-[#0A0E09] outline-none transition placeholder:font-medium placeholder:text-[#0A0E09]/40 focus:border-[#0A0E09] ${
                  errors.email ? "border-red-500" : "border-[#0A0E09]/15"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs font-semibold text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-bold text-[#0A0E09]"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full rounded-2xl border bg-white px-4 py-3.5 pr-12 text-sm font-semibold text-[#0A0E09] outline-none transition placeholder:font-medium placeholder:text-[#0A0E09]/40 focus:border-[#0A0E09] ${
                    errors.password ? "border-red-500" : "border-[#0A0E09]/15"
                  }`}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#0A0E09]/60 hover:text-[#0A0E09]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs font-semibold text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#96EE60] px-6 py-4 font-bold text-[#0A0E09] hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70 transition shadow-md"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
