"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Sparkles, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { verifyPaymentSession } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { Payment } from "@/types";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { user, refreshUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID provided.");
      setLoading(false);
      return;
    }

    verifyPaymentSession(sessionId)
      .then((res) => {
        if (res.payment) {
          setPayment(res.payment);
        }
        // Refresh local user state so user.plan becomes 'pro' immediately
        refreshUser();
      })
      .catch((err) => {
        console.error("Verification error:", err);
        setError(err.message || "Failed to verify transaction with Stripe.");
      })
      .finally(() => setLoading(false));
  }, [sessionId, refreshUser]);

  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-[#FBE4E3] px-5 py-16">
      <div className="w-full max-w-lg rounded-[2.5rem] bg-white p-8 text-center shadow-xl sm:p-12">
        {loading ? (
          <div>
            <Loader2 size={48} className="mx-auto animate-spin text-[#96EE60]" />
            <h2 className="mt-6 text-2xl font-black text-[#0A0E09]">
              Verifying Your Payment...
            </h2>
            <p className="mt-2 text-xs text-[#0A0E09]/60">
              Synchronizing your Stripe transaction and upgrading your account.
            </p>
          </div>
        ) : error ? (
          <div>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
              <AlertCircle size={36} />
            </div>
            <h2 className="mt-6 text-2xl font-black text-[#0A0E09]">
              Payment Verification Note
            </h2>
            <p className="mt-2 text-xs text-[#0A0E09]/70">{error}</p>
            <div className="mt-8 flex justify-center gap-3">
              <Link
                href="/dashboard"
                className="rounded-full bg-[#0A0E09] px-6 py-3 text-xs font-bold text-white hover:bg-[#96EE60] hover:text-[#0A0E09] transition"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#96EE60] text-[#0A0E09] shadow-lg">
              <CheckCircle2 size={36} />
            </div>

            <span className="mt-4 inline-flex items-center gap-1 rounded-full bg-[#ECFAB5] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#0A0E09]">
              <Sparkles size={12} /> Payment Confirmed
            </span>

            <h1 className="mt-4 text-3xl font-black text-[#0A0E09]">
              Welcome to Pro!
            </h1>
            <p className="mt-2 text-xs text-[#0A0E09]/65">
              Your subscription upgrade was successful. Your account now has full
              Pro privileges.
            </p>

            {payment && (
              <div className="mt-6 rounded-2xl bg-gray-50 p-4 text-left text-xs border border-gray-100 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Plan:</span>
                  <span className="font-bold text-[#0A0E09]">
                    {payment.planName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Amount Paid:</span>
                  <span className="font-bold text-[#0A0E09]">
                    ${payment.amount} {payment.currency?.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Status:</span>
                  <span className="font-bold text-emerald-600 uppercase">
                    {payment.paymentStatus}
                  </span>
                </div>
                {payment.transactionId && (
                  <div className="flex justify-between pt-1 border-t border-gray-200">
                    <span className="text-gray-500 font-medium">Transaction:</span>
                    <span className="font-mono text-[10px] text-gray-700 truncate max-w-[160px]">
                      {payment.transactionId}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8">
              <Link
                href={`/dashboard/${user?.role || "student"}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#96EE60] py-4 text-sm font-black text-[#0A0E09] hover:brightness-95 transition shadow-md"
              >
                Go to Dashboard <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0A0E09] border-t-[#96EE60]" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
