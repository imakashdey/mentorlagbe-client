import Link from "next/link";
import { ArrowLeft, GraduationCap } from "lucide-react";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center bg-[#FBE4E3] px-5 py-20 text-center">
      <div className="mx-auto max-w-md rounded-[2.5rem] bg-white p-8 shadow-xl shadow-[#0A0E09]/5 sm:p-12">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#96EE60] text-[#0A0E09] shadow-sm">
          <GraduationCap size={36} />
        </span>
        <h1 className="mt-6 text-6xl font-black text-[#0A0E09]">404</h1>
        <h2 className="mt-2 text-2xl font-extrabold text-[#0A0E09]">
          Page Not Found
        </h2>
        <p className="mt-3 text-sm text-[#0A0E09]/65 leading-relaxed">
          The page you are looking for does not exist or has been moved to a new
          address.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#0A0E09] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#96EE60] hover:text-[#0A0E09]"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
