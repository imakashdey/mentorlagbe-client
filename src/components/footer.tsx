"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Mail, MapPin, Phone } from "lucide-react";
import { FaXTwitter, FaFacebookF, FaLinkedinIn } from "react-icons/fa6";

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
    href: "https://x.com/Akash_Dey_21",
    icon: FaXTwitter,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/Akash14.Nil",
    icon: FaFacebookF,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/akashdey2/",
    icon: FaLinkedinIn,
  },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/dashboard")) return null;
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
            <li className="flex items-center gap-2"><Phone size={16} className="text-[#96EE60]" /> +880 1815698786</li>
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
          {social.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#96EE60] hover:text-[#0A0E09]"
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}