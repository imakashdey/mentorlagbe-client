"use client";

import { useEffect, useState } from "react";
import { Check, X, Loader2, Users, Phone } from "lucide-react";
import { getTutorApplicants, updateApplicationStatus } from "@/lib/api";
import { Application } from "@/types";
import { toast } from "sonner";
import Pagination from "@/components/pagination";

export default function ManageApplicantsPage() {
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const fetchApplicants = () => {
    setLoading(true);
    getTutorApplicants()
      .then((data) => setApplicants(data || []))
      .catch((err) => {
        console.error("Failed to load applicants:", err);
        toast.error("Failed to load applicants");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const handleStatusChange = async (
    id: string,
    status: "accepted" | "rejected"
  ) => {
    setUpdatingId(id);
    try {
      await updateApplicationStatus(id, status);
      toast.success(`Application marked as ${status}`);
      setApplicants((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a))
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to update applicant status");
    } finally {
      setUpdatingId(null);
    }
  };

  const totalPages = Math.ceil(applicants.length / pageSize);
  const paginatedApplicants = applicants.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-[#0A0E09]">
          Manage Student Applicants
        </h1>
        <p className="mt-1 text-xs text-gray-500">
          Review student applications for your tuition batches and accept or
          reject enrollments
        </p>
      </div>

      {/* Applicants List */}
      <div className="overflow-hidden rounded-[2rem] border border-[#0A0E09]/5 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <Loader2 size={32} className="animate-spin text-[#96EE60]" />
          </div>
        ) : applicants.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-100 bg-gray-50/75 text-[11px] font-black uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Student Info</th>
                  <th className="px-6 py-4">Target Tuition</th>
                  <th className="px-6 py-4">Preferred Schedule</th>
                  <th className="px-6 py-4">Note / Goal</th>
                  <th className="px-6 py-4">Current Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedApplicants.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50/50 transition">
                    {/* Student Info */}
                    <td className="px-6 py-4">
                      <p className="font-extrabold text-[#0A0E09]">
                        {app.studentName}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {app.studentEmail}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                        <Phone size={11} /> {app.studentPhone}
                      </p>
                    </td>

                    {/* Target Tuition */}
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#0A0E09]">
                        {app.tuitionTitle}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {app.subject} · ৳{Number(app.monthlyFee).toLocaleString("en-BD")}
                      </p>
                    </td>

                    {/* Schedule */}
                    <td className="px-6 py-4 font-medium text-gray-700 max-w-[160px]">
                      {app.preferredSchedule}
                    </td>

                    {/* Note */}
                    <td className="px-6 py-4 text-gray-600 max-w-[200px]">
                      {app.studentNote ? (
                        <p className="line-clamp-2 italic">
                          &quot;{app.studentNote}&quot;
                        </p>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${
                          app.status === "accepted"
                            ? "bg-emerald-100 text-emerald-800"
                            : app.status === "rejected"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {updatingId === app._id ? (
                          <Loader2 size={16} className="animate-spin text-gray-400" />
                        ) : (
                          <>
                            {app.status !== "accepted" && (
                              <button
                                onClick={() =>
                                  handleStatusChange(app._id, "accepted")
                                }
                                className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-1.5 text-[11px] font-black text-emerald-700 hover:bg-emerald-100 transition"
                                title="Accept Application"
                              >
                                <Check size={13} /> Accept
                              </button>
                            )}
                            {app.status !== "rejected" && (
                              <button
                                onClick={() =>
                                  handleStatusChange(app._id, "rejected")
                                }
                                className="inline-flex items-center gap-1 rounded-xl bg-rose-50 px-3 py-1.5 text-[11px] font-black text-rose-700 hover:bg-rose-100 transition"
                                title="Reject Application"
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
          <div className="py-16 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
              <Users size={24} />
            </span>
            <h3 className="mt-4 text-base font-bold text-[#0A0E09]">
              No Applicants Received Yet
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              When students apply to your approved tuitions, their submissions will appear here.
            </p>
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
