"use client";

import Link from "next/link";
import { GraduationCap, Mail, MapPin, Phone } from "lucide-react";

// Dark footer #0A0E09, Green #96EE60 for hover/accents
const columns = [
  {
    title: "Quick Links",
    links: [
      { name: "Home", href: "/" },
      { name: "Browse Tuitions", href: "/tuitions" },
      { name: "Pricing", href: "/pricing" },
      { name: "How It Works", href: "/#how-it-works" },
    ],
  },
  {
    title: "Top Subjects",
    links: ["Mathematics", "Physics", "Programming", "IELTS"].map((s) => ({
      name: s,
      href: `/tuitions?subject=${encodeURIComponent(s)}`,
    })),
  },
  {
    title: "Join Us",
    links: [
      { name: "Become a Tutor", href: "/sign-up" },
      { name: "Sign In", href: "/sign-in" },
      { name: "Sign Up", href: "/sign-up" },
    ],
  },
];

const social = [
  {
    label: "X",
    href: "https://x.com",
    // New X logo (not the old Twitter bird)
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    path: "M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z",
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    path: "M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#0A0E09] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#96EE60] text-[#0A0E09]">
              <GraduationCap size={23} />
            </span>
            <span className="text-xl font-extrabold tracking-tight">
              Mentor<span className="text-[#96EE60]">Lagbe</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-7 text-white/65">
            Find trusted tutors and build skills with guidance that moves you forward.
          </p>
          <ul className="mt-5 space-y-3 text-sm text-white/75">
            <li className="flex items-center gap-2"><Mail size={16} className="text-[#96EE60]" /> hello@mentorlagbe.com</li>
            <li className="flex items-center gap-2"><Phone size={16} className="text-[#96EE60]" /> +880 1XXX-XXXXXX</li>
            <li className="flex items-center gap-2"><MapPin size={16} className="text-[#96EE60]" /> Bangladesh</li>
          </ul>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-lg font-extrabold">{col.title}</h3>
            <ul className="mt-5 space-y-3 text-sm font-semibold text-white/70">
              {col.links.map((l) => (
                <li key={l.name}>
                  <Link href={l.href} className="hover:text-[#96EE60]">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/15 px-5 py-6 sm:flex-row lg:px-8">
        <p className="text-sm text-white/60">
          © 2026 MentorLagbe. All rights reserved.
        </p>
        <div className="flex items-center gap-3">
          {social.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#96EE60] hover:text-[#0A0E09]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d={s.path} />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}