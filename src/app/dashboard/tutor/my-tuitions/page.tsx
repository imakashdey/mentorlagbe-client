"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  PlusCircle,
  Edit2,
  Trash2,
  Power,
  Loader2,
  Search,
  ExternalLink,
  X,
} from "lucide-react";
import {
  getMyTuitions,
  toggleTuitionActive,
  deleteTuition,
  updateTuition,
} from "@/lib/api";
import { Tuition } from "@/types";
import { toast } from "sonner";
import Pagination from "@/components/pagination";

export default function MyTuitionsPage() {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Edit Modal State
  const [editingTuition, setEditingTuition] = useState<Tuition | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    subject: "",
    classLevel: "",
    mode: "Online" as "Online" | "Offline",
    location: "",
    monthlyFee: 0,
    daysPerWeek: 3,
    description: "",
    bannerImage: "",
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchTuitions = () => {
    setLoading(true);
    getMyTuitions()
      .then((data) => setTuitions(data || []))
      .catch((err) => {
        console.error("Failed to load tutor tuitions:", err);
        toast.error("Failed to load your tuitions");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTuitions();
  }, []);

  const handleToggleActive = async (tuition: Tuition) => {
    const nextState = !tuition.isActive;
    try {
      await toggleTuitionActive(tuition._id, nextState);
      toast.success(
        nextState ? "Tuition is now Active" : "Tuition closed/paused"
      );
      setTuitions((prev) =>
        prev.map((t) => (t._id === tuition._id ? { ...t, isActive: nextState } : t))
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to toggle status");
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this tuition post? This action cannot be undone."
      )
    ) {
      return;
    }
    try {
      await deleteTuition(id);
      toast.success("Tuition deleted successfully");
      setTuitions((prev) => prev.filter((t) => t._id !== id));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete tuition");
    }
  };

  const handleOpenEdit = (t: Tuition) => {
    setEditingTuition(t);
    setEditForm({
      title: t.title,
      subject: t.subject,
      classLevel: t.classLevel,
      mode: t.mode,
      location: t.location || "",
      monthlyFee: t.monthlyFee,
      daysPerWeek: t.daysPerWeek || 3,
      description: t.description || "",
      bannerImage: t.bannerImage || "",
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTuition) return;

    setSavingEdit(true);
    try {
      await updateTuition(editingTuition._id, {
        title: editForm.title.trim(),
        subject: editForm.subject.trim(),
        classLevel: editForm.classLevel.trim(),
        mode: editForm.mode,
        location: editForm.location.trim(),
        monthlyFee: Number(editForm.monthlyFee),
        daysPerWeek: Number(editForm.daysPerWeek),
        description: editForm.description.trim(),
        bannerImage: editForm.bannerImage.trim(),
      });

      toast.success("Tuition updated successfully");
      setTuitions((prev) =>
        prev.map((t) =>
          t._id === editingTuition._id
            ? {
                ...t,
                ...editForm,
                monthlyFee: Number(editForm.monthlyFee),
                daysPerWeek: Number(editForm.daysPerWeek),
              }
            : t
        )
      );
      setEditingTuition(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to update tuition");
    } finally {
      setSavingEdit(false);
    }
  };

  const totalPages = Math.ceil(tuitions.length / pageSize);
  const paginatedTuitions = tuitions.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-[#0A0E09]">
            My Created Tuitions
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Edit your batch listings, toggle active status, or post new sessions
          </p>
        </div>
        <Link
          href="/dashboard/tutor/post-tuition"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#96EE60] px-5 py-2.5 text-xs font-black text-[#0A0E09] hover:brightness-95 transition"
        >
          <PlusCircle size={15} /> Post New Tuition
        </Link>
      </div>

      {/* Tuitions List Table */}
      <div className="overflow-hidden rounded-[2rem] border border-[#0A0E09]/5 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <Loader2 size={32} className="animate-spin text-[#96EE60]" />
          </div>
        ) : tuitions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-100 bg-gray-50/75 text-[11px] font-black uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Tuition Title</th>
                  <th className="px-6 py-4">Subject &amp; Class</th>
                  <th className="px-6 py-4">Mode / Location</th>
                  <th className="px-6 py-4">Fee / Mo</th>
                  <th className="px-6 py-4">Approval Status</th>
                  <th className="px-6 py-4">Active State</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedTuitions.map((t) => {
                  const isApproved = t.approvalStatus === "approved";
                  return (
                    <tr key={t._id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4">
                        <p className="font-extrabold text-[#0A0E09]">
                          {t.title}
                        </p>
                        {isApproved && (
                          <Link
                            href={`/tuitions/${t._id}`}
                            target="_blank"
                            className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:underline"
                          >
                            View Live <ExternalLink size={11} />
                          </Link>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-bold text-[#0A0E09]">
                          {t.subject}
                        </span>
                        <span className="block text-[11px] text-gray-400">
                          {t.classLevel}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-700">
                          {t.mode}
                        </span>
                        <span className="block truncate max-w-[140px] text-[11px] text-gray-400">
                          {t.location}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-black text-[#0A0E09]">
                        ৳{Number(t.monthlyFee).toLocaleString("en-BD")}
                      </td>

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

                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleActive(t)}
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-black transition ${
                            t.isActive
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                          title="Click to toggle Active / Closed"
                        >
                          <Power size={11} />
                          {t.isActive ? "Active" : "Closed"}
                        </button>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(t)}
                            className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100 hover:text-black transition"
                            title="Edit Tuition"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(t._id)}
                            className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition"
                            title="Delete Tuition"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
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
              No Tuitions Created Yet
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Post your first tuition batch to start receiving student applications.
            </p>
            <Link
              href="/dashboard/tutor/post-tuition"
              className="mt-5 inline-flex rounded-full bg-[#96EE60] px-5 py-2.5 text-xs font-black text-[#0A0E09]"
            >
              Post a Tuition
            </Link>
          </div>
        )}
      </div>

      {/* Circular Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Edit Tuition Modal */}
      {editingTuition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] bg-white p-7 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-xl font-black text-[#0A0E09]">
                Edit Tuition Details
              </h3>
              <button
                onClick={() => setEditingTuition(null)}
                className="rounded-lg p-1 text-gray-400 hover:text-black"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="mb-1 block font-bold text-[#0A0E09]">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 font-semibold text-[#0A0E09] outline-none focus:border-[#0A0E09]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-bold text-[#0A0E09]">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.subject}
                    onChange={(e) =>
                      setEditForm({ ...editForm, subject: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 font-semibold text-[#0A0E09] outline-none focus:border-[#0A0E09]"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-bold text-[#0A0E09]">
                    Class Level *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.classLevel}
                    onChange={(e) =>
                      setEditForm({ ...editForm, classLevel: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 font-semibold text-[#0A0E09] outline-none focus:border-[#0A0E09]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block font-bold text-[#0A0E09]">
                    Mode *
                  </label>
                  <select
                    value={editForm.mode}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        mode: e.target.value as "Online" | "Offline",
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 font-semibold text-[#0A0E09] outline-none focus:border-[#0A0E09]"
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-bold text-[#0A0E09]">
                    Fee (৳) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editForm.monthlyFee}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        monthlyFee: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 font-semibold text-[#0A0E09] outline-none focus:border-[#0A0E09]"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-bold text-[#0A0E09]">
                    Days / Wk *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    required
                    value={editForm.daysPerWeek}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        daysPerWeek: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 font-semibold text-[#0A0E09] outline-none focus:border-[#0A0E09]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block font-bold text-[#0A0E09]">
                  Location / Platform *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.location}
                  onChange={(e) =>
                    setEditForm({ ...editForm, location: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 font-semibold text-[#0A0E09] outline-none focus:border-[#0A0E09]"
                />
              </div>

              <div>
                <label className="mb-1 block font-bold text-[#0A0E09]">
                  Banner Image URL
                </label>
                <input
                  type="url"
                  value={editForm.bannerImage}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bannerImage: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-gray-700 outline-none focus:border-[#0A0E09]"
                />
              </div>

              <div>
                <label className="mb-1 block font-bold text-[#0A0E09]">
                  Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-gray-700 outline-none focus:border-[#0A0E09]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingTuition(null)}
                  className="rounded-full px-5 py-2.5 font-bold text-gray-500 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#96EE60] px-6 py-2.5 font-black text-[#0A0E09] hover:brightness-95 disabled:opacity-50"
                >
                  {savingEdit && <Loader2 size={13} className="animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
