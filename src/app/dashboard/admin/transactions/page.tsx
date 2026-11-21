"use client";

import { useEffect, useState } from "react";
import { Loader2, DollarSign, CheckCircle2 } from "lucide-react";
import { getAdminTransactions } from "@/lib/api";
import { Payment } from "@/types";
import { toast } from "sonner";
import Pagination from "@/components/pagination";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    getAdminTransactions()
      .then((data) => setTransactions(data || []))
      .catch((err) => {
        console.error("Failed to load transactions:", err);
        toast.error("Failed to load Stripe transactions");
      })
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = transactions.reduce(
    (acc, curr) => acc + (curr.amount || 0),
    0
  );

  const totalPages = Math.ceil(transactions.length / pageSize);
  const paginatedTransactions = transactions.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-[#0A0E09]">
            Stripe Transactions &amp; Revenue
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Complete log of Pro subscription payments processed via Stripe Checkout
          </p>
        </div>

        {/* Revenue Summary Badge */}
        <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-3 border border-[#0A0E09]/10 shadow-xs">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#96EE60] text-[#0A0E09]">
            <DollarSign size={20} />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase text-gray-400">
              Total Recorded Revenue
            </p>
            <p className="text-xl font-black text-[#0A0E09]">
              ${totalRevenue} USD
            </p>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-hidden rounded-[2rem] border border-[#0A0E09]/5 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <Loader2 size={32} className="animate-spin text-[#96EE60]" />
          </div>
        ) : transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-100 bg-gray-50/75 text-[11px] font-black uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Plan Name</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Payment Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedTransactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4">
                      <p className="font-extrabold text-[#0A0E09]">
                        {tx.userName}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {tx.userEmail}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-black uppercase text-gray-700">
                        {tx.userRole}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-bold text-[#0A0E09]">
                      {tx.planName}
                    </td>

                    <td className="px-6 py-4 font-black text-emerald-600">
                      ${tx.amount} {tx.currency?.toUpperCase()}
                    </td>

                    <td className="px-6 py-4 font-mono text-[10px] text-gray-500 max-w-[150px] truncate">
                      {tx.transactionId || tx.stripeSessionId}
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-black uppercase text-emerald-800">
                        <CheckCircle2 size={11} /> {tx.paymentStatus}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right text-gray-500">
                      {tx.paidAt
                        ? new Date(tx.paidAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-xs text-gray-500">
            No transactions found yet.
          </div>
        )}
      </div>

      {/* Circular Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
