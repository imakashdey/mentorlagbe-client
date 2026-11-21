


import Link from "next/link";
import { XCircle, ArrowLeft, RotateCcw } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#ECEEFE] px-5 py-16 text-center">
      <div className="w-full max-w-md rounded-[2.5rem] bg-white p-8 shadow-xl sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
          <XCircle size={36} />
        </div>

        <h1 className="mt-6 text-2xl font-black text-[#0A0E09]">
          Payment Cancelled
        </h1>
        <p className="mt-2 text-xs text-[#0A0E09]/65 leading-relaxed">
          The Stripe checkout process was not completed. No charges were made to
          your account.
        </p>

        <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#96EE60] px-6 py-3.5 text-xs font-black text-[#0A0E09] hover:brightness-95 transition"
          >
            <RotateCcw size={14} /> Try Again
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0A0E09] px-6 py-3.5 text-xs font-bold text-white hover:bg-gray-800 transition"
          >
            <ArrowLeft size={14} /> Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
