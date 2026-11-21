"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, X, Loader2, ExternalLink, Filter, MapPin, Laptop } from "lucide-react";
import { getAdminTuitions, updateAdminTuitionApproval } from "@/lib/api";
import { Tuition, ApprovalStatus } from "@/types";
import { toast } from "sonner";

export default function AdminTuitionsApprovalPage() {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchTuitions = () => {
    setLoading(true);
    getAdminTuitions()
      .then((data) => setTuitions(data || []))
      .catch((err) => {
        console.error("Failed to load tuitions:", err);
        toast.error("Failed to load tuitions");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTuitions();
  }, []);

  const handleApproval = async (id: string, status: ApprovalStatus) => {
    setUpdatingId(id);
    try {
      await updateAdminTuitionApproval(id, status);
      toast.success(`Tuition post marked as ${status}`);
      setTuitions((prev) =>
        prev.map((t) => (t._id === id ? { ...t, approvalStatus: status } : t))
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to update approval status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = tuitions.filter((t) => {
    if (filter === "all") return true;
    return t.approvalStatus === filter;
  });

  const pendingCount = tuitions.filter(
    (t) => t.approvalStatus === "pending"
  ).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-[#0A0E09]">
            Tuition Moderation &amp; Approvals
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Review tutor listings and approve them for public listing or reject invalid posts
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-white p-1.5 border border-[#0A0E09]/10 shadow-xs">
          {["all", "pending", "approved", "rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-black uppercase transition ${
                filter === tab
                  ? "bg-[#0A0E09] text-white shadow-xs"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab}
              {tab === "pending" && pendingCount > 0 && (
                <span className="ml-1.5 rounded-full bg-amber-400 px-1.5 py-0.2 text-[10px] text-black font-extrabold">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tuitions List Table */}
      <div className="overflow-hidden rounded-[2rem] border border-[#0A0E09]/5 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <Loader2 size={32} className="animate-spin text-[#96EE60]" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-100 bg-gray-50/75 text-[11px] font-black uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Tuition Listing</th>
                  <th className="px-6 py-4">Tutor Details</th>
                  <th className="px-6 py-4">Subject &amp; Class</th>
                  <th className="px-6 py-4">Monthly Fee</th>
                  <th className="px-6 py-4">Current Status</th>
                  <th className="px-6 py-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-50/50 transition">
                    {/* Tuition Listing */}
                    <td className="px-6 py-4">
                      <p className="font-extrabold text-[#0A0E09] line-clamp-1">
                        {t.title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-gray-500 line-clamp-1">
                        {t.location || t.mode}
                      </p>
                    </td>

                    {/* Tutor Details */}
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#0A0E09]">
                        {t.tutorName}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {t.tutorEmail}
                      </p>
                    </td>

                    {/* Subject & Class */}
                    <td className="px-6 py-4">
                      <span className="font-bold text-[#0A0E09]">
                        {t.subject}
                      </span>
                      <span className="block text-[11px] text-gray-400">
                        {t.classLevel}
                      </span>
                    </td>

                    {/* Monthly Fee */}
                    <td className="px-6 py-4 font-black text-[#0A0E09]">
                      ৳{Number(t.monthlyFee).toLocaleString("en-BD")}
                    </td>

                    {/* Current Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${
                          t.approvalStatus === "approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : t.approvalStatus === "rejected"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {t.approvalStatus || "pending"}
                      </span>
                    </td>

                    {/* Moderation Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {updatingId === t._id ? (
                          <Loader2 size={16} className="animate-spin text-gray-400" />
                        ) : (
                          <>
                            {t.approvalStatus !== "approved" && (
                              <button
                                onClick={() => handleApproval(t._id, "approved")}
                                className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-1.5 text-[11px] font-black text-emerald-700 hover:bg-emerald-100 transition"
                                title="Approve Tuition"
                              >
                                <Check size={13} /> Approve
                              </button>
                            )}
                            {t.approvalStatus !== "rejected" && (
                              <button
                                onClick={() => handleApproval(t._id, "rejected")}
                                className="inline-flex items-center gap-1 rounded-xl bg-rose-50 px-3 py-1.5 text-[11px] font-black text-rose-700 hover:bg-rose-100 transition"
                                title="Reject Tuition"
                              >
                                <X size={13} /> Reject
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-xs text-gray-500">
            No tuitions match the selected &quot;{filter}&quot; filter.
          </div>
        )}
      </div>
    </div>
  );
}
