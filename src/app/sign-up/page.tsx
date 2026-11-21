"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, GraduationCap, Loader2, UserRound, Presentation } from "lucide-react";
import { authClient } from "@/lib/auth-client"; // <-- তোমার BetterAuth client-এর path

type Role = "student" | "tutor";

const roles: { value: Role; title: string; hint: string; icon: typeof UserRound; tint: string }[] = [
  { value: "student", title: "Student", hint: "Find tutors & apply", icon: UserRound, tint: "bg-[#ECFAB5]" },
  { value: "tutor", title: "Tutor", hint: "Post tuitions & teach", icon: Presentation, tint: "bg-[#D9F0FF]" },
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" as Role });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!emailRegex.test(form.email)) e.email = "Enter a valid email address";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setLoading(true);
    try {
      // `role` must be declared in BetterAuth `user.additionalFields` on the server.
      const { error } = await authClient.signUp.email({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      } as any);

      if (error) {
        toast.error(error.message || "Sign up failed");
        return;
      }

      toast.success("Account created! Please sign in.");
      router.push("/sign-in");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (field: string) =>
    `w-full rounded-2xl border bg-white px-4 py-3.5 text-sm font-semibold text-[#0A0E09] outline-none transition placeholder:font-medium placeholder:text-[#0A0E09]/40 focus:border-[#0A0E09] ${errors[field] ? "border-red-500" : "border-[#0A0E09]/15"
    }`;

  return (
    <section className="bg-[#FBE4E3] px-5 py-14 md:py-20">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-[#0A0E09]/10 md:grid-cols-[0.9fr_1.1fr]">
        {/* Left panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-[#0A0E09] p-10 text-white md:flex">
          <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-[#96EE60]/20 blur-3xl" />
          <div className="absolute -bottom-20 -right-16 h-64 w-64 rounded-full bg-[#ECEEFE]/15 blur-3xl" />
          <div className="relative">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#96EE60] text-[#0A0E09]">
              <GraduationCap size={26} />
            </span>
            <h2 className="mt-8 text-3xl font-extrabold leading-tight">
              Start your learning journey with{" "}
              <span className="text-[#96EE60]">MentorLagbe</span>
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/65">
              Join as a student to find verified tutors, or as a tutor to share
              your knowledge and manage your batches.
            </p>
          </div>
          <ul className="relative mt-10 space-y-3 text-sm font-semibold text-white/80">
            <li>✓ Free to get started</li>
            <li>✓ Online & offline tuitions</li>
            <li>✓ Track applications in real time</li>
          </ul>
        </div>

        {/* Form */}
        <div className="p-6 md:p-10">
          <h1 className="text-3xl font-extrabold text-[#0A0E09]">Create your account</h1>
          <p className="mt-2 text-sm text-[#0A0E09]/60">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-bold text-[#0A0E09] underline decoration-[#96EE60] decoration-2 underline-offset-4">
              Sign in
            </Link>
          </p>

          <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
            {/* Role */}
            <fieldset>
              <legend className="mb-2 text-sm font-bold text-[#0A0E09]">I am a</legend>
              <div className="grid grid-cols-2 gap-3">
                {roles.map(({ value, title, hint, icon: Icon, tint }) => (
                  <label key={value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value={value}
                      checked={form.role === value}
                      onChange={() => setForm({ ...form, role: value })}
                      className="peer sr-only"
                    />
                    <span className="flex h-full flex-col gap-2 rounded-2xl border-2 border-[#0A0E09]/10 p-4 transition peer-checked:border-[#0A0E09] peer-checked:shadow-md peer-focus-visible:ring-2 peer-focus-visible:ring-[#96EE60]">
                      <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-[#0A0E09] ${tint}`}>
                        <Icon size={20} />
                      </span>
                      <span className="font-extrabold text-[#0A0E09]">{title}</span>
                      <span className="text-xs text-[#0A0E09]/60">{hint}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Name */}
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-bold text-[#0A0E09]">Full name</label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputCls("name")}
              />
              {errors.name && <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-bold text-[#0A0E09]">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputCls("email")}
              />
              {errors.email && <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-bold text-[#0A0E09]">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={`${inputCls("password")} pr-12`}
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
              {errors.password && <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#96EE60] px-6 py-4 font-bold text-[#0A0E09] hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}