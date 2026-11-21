"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  Atom,
  Award,
  BookOpen,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Code2,
  Dna,
  FlaskConical,
  Languages,
  Sigma,
  TrendingUp,
} from "lucide-react";

// Subject tiles alternate Lime #ECFAB5 / Lavender #ECEEFE, hover = Green #96EE60
const subjects = [
  { name: "Mathematics", icon: Sigma },
  { name: "Physics", icon: Atom },
  { name: "Chemistry", icon: FlaskConical },
  { name: "Biology", icon: Dna },
  { name: "English", icon: Languages },
  { name: "Programming", icon: Code2 },
  { name: "IELTS", icon: Award },
  { name: "Accounting", icon: Calculator },
  { name: "Economics", icon: TrendingUp },
  { name: "Bangla", icon: BookOpen },
];

export default function SubjectStrip() {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) =>
    ref.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  const arrow =
    "hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#0A0E09] shadow-sm transition hover:bg-[#0A0E09] hover:text-white sm:flex";

  return (
    <div className="mx-auto flex max-w-5xl items-center gap-3 rounded-[2rem] bg-white/50 p-3 backdrop-blur">
      <button aria-label="Previous subjects" onClick={() => scroll(-1)} className={arrow}>
        <ChevronLeft size={20} />
      </button>

      <div
        ref={ref}
        className="flex flex-1 gap-2 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {subjects.map(({ name, icon: Icon }, i) => (
          <Link
            key={name}
            href={`/tuitions?subject=${encodeURIComponent(name)}`}
            className={`flex min-w-[104px] shrink-0 flex-col items-center gap-2 rounded-2xl px-3 py-3 text-[#0A0E09] transition hover:bg-[#96EE60] ${
              i % 2 === 0 ? "bg-[#ECFAB5]" : "bg-[#ECEEFE]"
            }`}
          >
            <Icon size={26} />
            <span className="text-xs font-bold">{name}</span>
          </Link>
        ))}
      </div>

      <button aria-label="Next subjects" onClick={() => scroll(1)} className={arrow}>
        <ChevronRight size={20} />
      </button>
    </div>
  );
}