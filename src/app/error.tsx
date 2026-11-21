"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("MentorLagbe error:", error);
  }, [error]);

  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center bg-[#ECEEFE] px-5 py-20 text-center">
      <div className="mx-auto max-w-lg rounded-[2.5rem] bg-white p-8 shadow-xl shadow-[#0A0E09]/5 sm:p-12">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600">
          <AlertCircle size={36} />
        </span>
        <h1 className="mt-6 text-3xl font-extrabold text-[#0A0E09]">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm text-[#0A0E09]/65">
          {error.message || "An unexpected error occurred while processing your request."}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-full bg-[#96EE60] px-6 py-3 text-sm font-bold text-[#0A0E09] hover:brightness-95 transition"
          >
            <RefreshCw size={16} /> Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#0A0E09] px-6 py-3 text-sm font-bold text-white hover:bg-white/80 hover:text-[#0A0E09] transition"
          >
            <Home size={16} /> Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
