"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Sparkles, Loader2, ShieldCheck, ArrowRight, Zap } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { createCheckoutSession } from "@/lib/api";
import { toast } from "sonner";

export default function PricingPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!user) {
      toast.info("Please sign in first to upgrade your account");
      window.location.href = "/sign-in";
      return;
    }

    if (user.role === "admin") {
      toast.info("Admin accounts have full platform access.");
      return;
    }

    if (user.plan === "pro") {
      toast.success("You are already enjoying the Pro Plan benefits!");
      return;
    }

    setLoading(true);
    try {
      const res = await createCheckoutSession();
      if (res?.url) {
        window.location.href = res.url;
      } else {
        throw new Error("Could not initialize Stripe checkout");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to start checkout session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      {/* Hero Header */}
      <section className="bg-[#FBE4E3] px-5 py-14 md:py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFAB5] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#0A0E09]">
            <Sparkles size={13} /> Flexible Subscriptions
          </span>
          <h1 className="mt-4 text-4xl font-black text-[#0A0E09] md:text-5xl">
            Choose Your Growth Plan
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base text-[#0A0E09]/70">
            Start for free to explore the platform. Upgrade with Stripe for verified
            visibility, priority matching, and unlimited tuition posts.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Free Tier */}
          <div className="flex flex-col justify-between rounded-[2.5rem] border border-[#0A0E09]/10 bg-white p-8 sm:p-10 shadow-sm transition hover:shadow-lg">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#ECEEFE] px-3 py-1 text-xs font-bold text-[#0A0E09]">
                  Starter
                </span>
                <span className="text-xs font-bold text-gray-400">Default</span>
              </div>

              <h2 className="mt-4 text-2xl font-black text-[#0A0E09]">
                Free Plan
              </h2>
              <p className="mt-1 text-xs text-[#0A0E09]/60">
                Ideal for students and tutors just getting started.
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-5xl font-black text-[#0A0E09]">$0</span>
                <span className="text-xs font-bold text-[#0A0E09]/60">
                  / lifetime
                </span>
              </div>

              <div className="my-8 space-y-4 border-t border-b border-[#0A0E09]/5 py-6">
                <p className="text-xs font-black uppercase text-[#0A0E09]/70 tracking-wider">
                  Included in Free:
                </p>
                <ul className="space-y-3 text-xs text-[#0A0E09]/80">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-[#0A0E09]" />
                    <span>Browse all verified tuition listings</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-[#0A0E09]" />
                    <span>Apply for sessions (Student accounts)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-[#0A0E09]" />
                    <span>Save favorite tuitions to bookmarks</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-[#0A0E09]" />
                    <span>Post up to <strong>2 tuition batches</strong> (Tutors)</span>
                  </li>
                </ul>
              </div>
            </div>

            <Link
              href="/sign-up"
              className="block w-full rounded-full bg-[#0A0E09] py-4 text-center text-xs font-black text-white hover:bg-gray-800 transition"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro Tier (Stripe Integration) */}
          <div className="relative flex flex-col justify-between rounded-[2.5rem] bg-[#96EE60] p-8 sm:p-10 text-[#0A0E09] shadow-2xl shadow-[#96EE60]/30 transition hover:-translate-y-1">
            <span className="absolute right-8 top-8 rounded-full bg-[#0A0E09] px-3.5 py-1 text-xs font-black text-[#96EE60] shadow-sm">
              RECOMMENDED
            </span>

            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#0A0E09]">
                  Pro Tier
                </span>
                <span className="flex items-center gap-1 text-xs font-black">
                  <Zap size={14} /> Full Access
                </span>
              </div>

              <h2 className="mt-4 text-3xl font-black text-[#0A0E09]">
                MentorLagbe Pro
              </h2>
              <p className="mt-1 text-xs text-[#0A0E09]/80 font-medium">
                Designed for ambitious tutors and students seeking priority matching.
              </p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-5xl font-black text-[#0A0E09]">$10 - $15</span>
                <span className="text-xs font-bold text-[#0A0E09]/75">
                  / one-time upgrade
                </span>
              </div>
              <p className="mt-1 text-xs font-bold text-[#0A0E09]/70">
                Students $10 · Tutors $15 (via secure Stripe Checkout)
              </p>

              <div className="my-8 space-y-4 border-t border-b border-[#0A0E09]/15 py-6">
                <p className="text-xs font-black uppercase text-[#0A0E09] tracking-wider">
                  Pro Privileges:
                </p>
                <ul className="space-y-3 text-xs font-medium text-[#0A0E09]/90">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-[#0A0E09]" />
                    <span>
                      <strong>Unlimited Tuition Posts</strong> for Tutors (no limits)
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-[#0A0E09]" />
                    <span>
                      <strong>Verified Pro Badge</strong> &amp; featured placement on Browse Tuitions
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-[#0A0E09]" />
                    <span>
                      <strong>Priority Application Queue</strong> for Students
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-[#0A0E09]" />
                    <span>Direct tutor contact details &amp; instant notifications</span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              {user?.plan === "pro" ? (
                <div className="flex items-center justify-center gap-2 rounded-full bg-[#0A0E09] py-4 text-xs font-black text-[#96EE60]">
                  <ShieldCheck size={16} /> You are an Active Pro Member!
                </div>
              ) : (
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleUpgrade}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0A0E09] py-4 text-sm font-black text-white hover:bg-white hover:text-[#0A0E09] transition shadow-lg"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {loading
                    ? "Connecting to Stripe..."
                    : user
                    ? `Upgrade to Pro with Stripe ($${user.role === "tutor" ? "15" : "10"})`
                    : "Subscribe with Stripe"}
                  {!loading && <ArrowRight size={16} />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Guarantee Banner */}
        <div className="mt-16 rounded-[2rem] bg-[#ECEEFE] p-8 text-center sm:p-10">
          <h3 className="text-xl font-black text-[#0A0E09]">
            Powered by Stripe Secure Payments
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-xs text-[#0A0E09]/70 leading-relaxed">
            Your transactions are encrypted and processed by Stripe. Upon completion,
            your profile status and transaction log are immediately synced across your
            dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
