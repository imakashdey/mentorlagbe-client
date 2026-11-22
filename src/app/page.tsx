import Link from "next/link";
import TuitionSection from "@/components/tuition-section";
import SubjectStrip from "@/components/subject-strip";
import StatsSection from "@/components/stats-section";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Search,
  Users,
} from "lucide-react";

/**
 * Palette
 * Dark #0A0E09 · Pink #FBE4E3 · Lime #ECFAB5 · Lavender #ECEEFE
 * Sky #D9F0FF · Green #96EE60 (CTA/active) · Mint #7FD09F (badges/success)
 */

const steps = [
  {
    number: "01",
    title: "Search your tutor",
    description: "Search by subject, class level, learning mode and budget.",
    icon: Search,
  },
  {
    number: "02",
    title: "Apply to a tuition",
    description: "Pick a tuition that fits your goals and send your application.",
    icon: Users,
  },
  {
    number: "03",
    title: "Start learning",
    description: "Once the tutor accepts, begin your learning journey.",
    icon: GraduationCap,
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero: text + search on left, image on right */}
<section className="relative overflow-hidden rounded-b-[2.5rem] bg-[#FBE4E3] px-5 pb-10 pt-12 md:rounded-b-[3.5rem] md:pt-16 lg:px-8">
  <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#ECEEFE] blur-3xl" />
  <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#ECFAB5]/70 blur-3xl" />

  <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
    <div className="text-center lg:text-left">
      <h1 className="text-5xl font-black leading-[1.1] tracking-tight text-[#0A0E09] sm:text-6xl">
        Find Your Ideal
        <br />
        <span className="text-[#96EE60]">TUTOR</span> Today
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-base text-[#0A0E09]/70 md:text-lg lg:mx-0">
        Online or offline, choose verified tutors by subject, class level and
        monthly budget.
      </p>

      <form
        action="/tuitions"
        method="GET"
        className="mx-auto mt-8 max-w-xl rounded-full bg-white/60 p-2 shadow-xl shadow-[#0A0E09]/5 backdrop-blur lg:mx-0"
      >
        <div className="flex items-center gap-3 rounded-full bg-white py-2 pl-5 pr-2">
          <BookOpen size={20} className="shrink-0 text-[#0A0E09]" />
          <input
            type="text"
            name="search"
            placeholder='Try "Mathematics" or "IELTS"'
            className="w-full bg-transparent text-base font-semibold text-[#0A0E09] outline-none placeholder:font-medium placeholder:text-[#0A0E09]/45"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-[#96EE60] px-6 py-3.5 font-bold text-[#0A0E09] transition hover:brightness-95 sm:px-8"
          >
            Search
          </button>
        </div>
      </form>
    </div>

    <div className="relative mx-auto w-full max-w-xl">
      <div className="overflow-hidden rounded-[2rem] border-4 border-white shadow-xl shadow-[#0A0E09]/10">
        <Image
          src="/images/hero.jpg"
          alt="A student learning with a tutor"
          width={1200}
          height={900}
          priority
          sizes="(min-width: 1024px) 576px, 100vw"
          className="h-[320px] w-full object-cover sm:h-[400px] lg:h-[460px]"
        />
      </div>
    </div>
  </div>

  <div className="relative mt-10">
    <SubjectStrip />
  </div>
</section>

      {/* Latest tuitions (pastel image cards) */}
      <TuitionSection />

      {/* Become a tutor: full image, fully responsive */}
      <section className="bg-white px-4 py-8 sm:px-5 lg:px-8">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[1.5rem] md:rounded-[2rem]">
          <Image
            src="/images/Warm Tutoring Session with Colorful Study Props.png"
            alt="A tutor helping a student with a book"
            width={0}
            height={0}
            sizes="(min-width: 1152px) 1152px, 100vw"
            priority
            className="block h-auto w-full"
          />

          <div className="bg-[#FBE4E3] p-6 text-[#0A0E09] md:absolute md:bottom-0 md:right-0 md:w-[46%] md:max-w-[420px] md:rounded-tl-3xl md:p-6 lg:p-8">
            <h2 className="text-2xl font-extrabold leading-tight md:text-xl lg:text-3xl">
              You can become a great tutor too!
            </h2>
            <p className="mt-3 text-sm font-medium leading-6 text-[#0A0E09]/80">
              Share your knowledge, post your tuition batches and become your own boss.
            </p>
            <Link
              href="/sign-up"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0A0E09] px-6 py-3.5 font-bold text-white transition hover:bg-[#96EE60] hover:text-[#0A0E09]"
            >
              Become a Tutor <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works: sky blue + mint */}
      <section id="how-it-works" className="bg-[#D9F0FF] py-20 scroll-mt-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold text-[#0A0E09] md:text-4xl">
              How <span className="rounded-lg bg-[#7FD09F] px-2">MentorLagbe</span> works
            </h2>
            <p className="mt-4 text-[#0A0E09]/65">
              Three simple steps bring students and tutors together.
            </p>
          </div>

          <div className="grid gap-7 md:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="rounded-[2rem] bg-white p-8">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl font-black text-[#0A0E09]/15">
                      {step.number}
                    </span>
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7FD09F] text-[#0A0E09]">
                      <Icon size={24} />
                    </span>
                  </div>
                  <h3 className="mt-7 text-xl font-extrabold text-[#0A0E09]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#0A0E09]/65">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats: real numbers from database */}
      <StatsSection />

      {/* Pricing: white/pastel Free, green Pro */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold text-[#0A0E09] md:text-4xl">
              Choose how you{" "}
              <span className="rounded-lg bg-[#ECFAB5] px-2">grow</span>
            </h2>
            <p className="mt-3 text-[#0A0E09]/60">
              Start for free. Upgrade when you are ready for more.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            <div className="flex flex-col rounded-[2rem] bg-[#ECEEFE] p-8">
              <p className="font-bold text-[#0A0E09]/60">Free Plan</p>
              <h3 className="mt-3 text-4xl font-black text-[#0A0E09]">$0</h3>
              <p className="mt-2 text-sm text-[#0A0E09]/60">A great place to start.</p>
              <ul className="my-8 space-y-4 text-sm text-[#0A0E09]/80">
                {[
                  "Browse tuition listings",
                  "Apply for tuition (Students)",
                  "Post up to 2 tuitions (Tutors)",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="shrink-0 text-[#0A0E09]" /> {t}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className="mt-auto block rounded-full bg-[#0A0E09] px-5 py-3.5 text-center font-bold text-white hover:bg-[#96EE60] hover:text-[#0A0E09]"
              >
                Get Started
              </Link>
            </div>

            <div className="relative flex flex-col rounded-[2rem] bg-[#96EE60] p-8 text-[#0A0E09] shadow-xl shadow-[#96EE60]/30">
              <span className="absolute right-6 top-6 rounded-full bg-[#0A0E09] px-3 py-1 text-xs font-extrabold text-[#96EE60]">
                PRO
              </span>
              <p className="font-bold text-[#0A0E09]/70">Pro Plan</p>
              <h3 className="mt-3 text-4xl font-black">$10–$15</h3>
              <p className="mt-2 text-sm text-[#0A0E09]/70">Student $10 · Tutor $15</p>
              <ul className="my-8 space-y-4 text-sm text-[#0A0E09]/85">
                {[
                  "Unlimited tuition posts + verified badge (Tutors)",
                  "Priority booking (Students)",
                  "Enhanced platform experience",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="shrink-0" /> {t}
                  </li>
                ))}
              </ul>
              <Link
                href="/pricing"
                className="mt-auto block rounded-full bg-[#0A0E09] px-5 py-3.5 text-center font-bold text-white hover:bg-white hover:text-[#0A0E09]"
              >
                Subscribe with Stripe
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}