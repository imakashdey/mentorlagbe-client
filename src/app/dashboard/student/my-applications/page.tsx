"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, Loader2, ArrowUpRight, Search } from "lucide-react";
import { getMyApplications, cancelApplication } from "@/lib/api";
import { Application } from "@/types";
import { toast } from "sonner";

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchApps = () => {
    setLoading(true);
    getMyApplications()
      .then((data) => setApplications(data || []))
      .catch((err) => {
        console.error("Failed to load applications:", err);
        toast.error("Failed to load your applications");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this pending application?")) {
      return;
    }

    setCancellingId(id);
    try {
      await cancelApplication(id);
      toast.success("Application cancelled successfully");
      setApplications((prev) => prev.filter((a) => a._id !== id));
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel application");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-[#0A0E09]">
            My Tuition Applications
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Track and manage all your tuition enrollment submissions
          </p>
        </div>
        <Link
          href="/tuitions"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#96EE60] px-5 py-2.5 text-xs font-black text-[#0A0E09] hover:brightness-95 transition"
        >
          Find More Tuitions <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* Applications Table / Cards */}
      <div className="overflow-hidden rounded-[2rem] border border-[#0A0E09]/5 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <Loader2 size={32} className="animate-spin text-[#96EE60]" />
          </div>
        ) : applications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-100 bg-gray-50/75 text-[11px] font-black uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Tuition Title &amp; Subject</th>
                  <th className="px-6 py-4">Tutor Email</th>
                  <th className="px-6 py-4">Monthly Fee</th>
                  <th className="px-6 py-4">Preferred Schedule</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map((app) => {
                  const isPending = app.status === "pending";
                  return (
                    <tr key={app._id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4">
                        <Link
                          href={`/tuitions/${app.tuitionId}`}
                          className="font-extrabold text-[#0A0E09] hover:underline"
                        >
                          {app.tuitionTitle}
                        </Link>
                        <span className="mt-0.5 block font-semibold text-gray-400">
                          {app.subject}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-medium text-gray-600">
                        {app.tutorEmail}
                      </td>

                      <td className="px-6 py-4 font-black text-[#0A0E09]">
                        ৳{Number(app.monthlyFee).toLocaleString("en-BD")}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {app.preferredSchedule}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-[10px] font-black uppercase ${
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

                      <td className="px-6 py-4 text-right">
                        {isPending ? (
                          <button
                            onClick={() => handleCancel(app._id)}
                            disabled={cancellingId === app._id}
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50 transition disabled:opacity-50"
                            title="Cancel Application"
                          >
                            <Trash2 size={14} />
                            Cancel
                          </button>
                        ) : (
                          <span className="text-[11px] font-medium text-gray-400">
                            {app.status === "accepted" ? "Enrolled" : "Closed"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
              <Search size={24} />
            </span>
            <h3 className="mt-4 text-base font-bold text-[#0A0E09]">
              No Applications Found
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              You haven&apos;t applied to any tuitions yet.
            </p>
            <Link
              href="/tuitions"
              className="mt-5 inline-flex rounded-full bg-[#96EE60] px-5 py-2.5 text-xs font-black text-[#0A0E09]"
            >
              Browse Tuitions
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
