"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  UploadCloud,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  Image as ImageIcon,
} from "lucide-react";
import { createTuition } from "@/lib/api";
import { uploadToImgBB } from "@/lib/imgbb";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

export default function PostTuitionPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: "",
    subject: "",
    classLevel: "",
    mode: "Online" as "Online" | "Offline",
    location: "",
    monthlyFee: "",
    daysPerWeek: "3",
    description: "",
    bannerImage: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));

    // Upload directly to ImgBB (Challenge 3)
    setUploadingImage(true);
    try {
      const url = await uploadToImgBB(file);
      setForm((prev) => ({ ...prev, bannerImage: url }));
      toast.success("Banner image uploaded successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image to ImgBB");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.title.trim() ||
      !form.subject.trim() ||
      !form.classLevel.trim() ||
      !form.location.trim() ||
      !form.description.trim() ||
      !form.monthlyFee
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const fee = Number(form.monthlyFee);
    if (isNaN(fee) || fee <= 0) {
      toast.error("Monthly fee must be greater than 0");
      return;
    }

    const days = Number(form.daysPerWeek);
    if (isNaN(days) || days < 1 || days > 7) {
      toast.error("Days per week must be between 1 and 7");
      return;
    }

    setSubmitting(true);
    try {
      await createTuition({
        title: form.title.trim(),
        subject: form.subject.trim(),
        classLevel: form.classLevel.trim(),
        mode: form.mode,
        location: form.location.trim(),
        monthlyFee: fee,
        daysPerWeek: days,
        description: form.description.trim(),
        bannerImage:
          form.bannerImage.trim() ||
          "https://picsum.photos/seed/mentorpost/800/500",
      });

      toast.success(
        "Tuition posted successfully! It is now pending admin approval."
      );
      router.push("/dashboard/tutor/my-tuitions");
    } catch (err: any) {
      toast.error(err.message || "Failed to create tuition post");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/tutor"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <h1 className="mt-2 text-2xl font-black text-[#0A0E09]">
            Post a New Tuition
          </h1>
          <p className="text-xs text-gray-500">
            Fill in the batch details. Newly posted tuitions undergo quick admin
            approval before appearing publicly.
          </p>
        </div>
      </div>

      {/* Post Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-[2.5rem] border border-[#0A0E09]/5 bg-white p-7 sm:p-10 shadow-sm space-y-6"
      >
        {/* Title */}
        <div>
          <label className="mb-1.5 block text-xs font-black uppercase text-[#0A0E09]">
            Tuition Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. HSC Higher Math Special Care Batch"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-2xl border border-[#0A0E09]/15 px-4 py-3 text-sm font-semibold text-[#0A0E09] outline-none focus:border-[#0A0E09]"
          />
        </div>

        {/* Row: Subject, Class Level, Mode */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-black uppercase text-[#0A0E09]">
              Subject *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mathematics, Physics, IELTS"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full rounded-2xl border border-[#0A0E09]/15 px-4 py-3 text-sm font-semibold text-[#0A0E09] outline-none focus:border-[#0A0E09]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-black uppercase text-[#0A0E09]">
              Class Level *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. HSC, SSC, University, Class 9"
              value={form.classLevel}
              onChange={(e) => setForm({ ...form, classLevel: e.target.value })}
              className="w-full rounded-2xl border border-[#0A0E09]/15 px-4 py-3 text-sm font-semibold text-[#0A0E09] outline-none focus:border-[#0A0E09]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-black uppercase text-[#0A0E09]">
              Mode *
            </label>
            <select
              value={form.mode}
              onChange={(e) =>
                setForm({ ...form, mode: e.target.value as "Online" | "Offline" })
              }
              className="w-full rounded-2xl border border-[#0A0E09]/15 bg-white px-4 py-3 text-sm font-semibold text-[#0A0E09] outline-none focus:border-[#0A0E09]"
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>
        </div>

        {/* Row: Location, Monthly Fee, Days per week */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-black uppercase text-[#0A0E09]">
              Location / Platform *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dhanmondi, Dhaka or Online (Zoom)"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full rounded-2xl border border-[#0A0E09]/15 px-4 py-3 text-sm font-semibold text-[#0A0E09] outline-none focus:border-[#0A0E09]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-black uppercase text-[#0A0E09]">
              Monthly Fee (BDT ৳) *
            </label>
            <input
              type="number"
              min="100"
              required
              placeholder="e.g. 3000"
              value={form.monthlyFee}
              onChange={(e) => setForm({ ...form, monthlyFee: e.target.value })}
              className="w-full rounded-2xl border border-[#0A0E09]/15 px-4 py-3 text-sm font-semibold text-[#0A0E09] outline-none focus:border-[#0A0E09]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-black uppercase text-[#0A0E09]">
              Days per Week (1-7) *
            </label>
            <input
              type="number"
              min="1"
              max="7"
              required
              value={form.daysPerWeek}
              onChange={(e) =>
                setForm({ ...form, daysPerWeek: e.target.value })
              }
              className="w-full rounded-2xl border border-[#0A0E09]/15 px-4 py-3 text-sm font-semibold text-[#0A0E09] outline-none focus:border-[#0A0E09]"
            />
          </div>
        </div>

        {/* Challenge 3: Direct Image Upload via ImgBB API */}
        <div>
          <label className="mb-1.5 block text-xs font-black uppercase text-[#0A0E09]">
            Banner Image (Direct Upload to ImgBB)
          </label>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <label className="flex flex-1 cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#0A0E09]/20 p-5 hover:border-[#0A0E09] transition bg-gray-50/50">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
              />
              {uploadingImage ? (
                <div className="flex items-center gap-2 text-xs font-bold text-[#0A0E09]">
                  <Loader2 size={18} className="animate-spin text-[#96EE60]" />
                  Uploading to ImgBB...
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs font-bold text-[#0A0E09]">
                  <UploadCloud size={20} className="text-[#0A0E09]/60" />
                  <span>Choose Banner Photo (JPG, PNG)</span>
                </div>
              )}
            </label>

            {imagePreview && (
              <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Or Image URL fallback */}
          <div className="mt-2">
            <input
              type="url"
              placeholder="Or paste an image URL directly"
              value={form.bannerImage}
              onChange={(e) => setForm({ ...form, bannerImage: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-700 outline-none focus:border-[#0A0E09]"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-xs font-black uppercase text-[#0A0E09]">
            Detailed Description *
          </label>
          <textarea
            rows={5}
            required
            placeholder="Outline course syllabus, weekly tests, doubt-solving format, prerequisites, and session timings..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-2xl border border-[#0A0E09]/15 px-4 py-3 text-sm font-medium text-[#0A0E09] outline-none focus:border-[#0A0E09]"
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
          <Link
            href="/dashboard/tutor"
            className="rounded-full px-5 py-3 text-xs font-bold text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting || uploadingImage}
            className="inline-flex items-center gap-2 rounded-full bg-[#96EE60] px-8 py-3.5 text-xs font-black text-[#0A0E09] hover:brightness-95 disabled:opacity-50 transition shadow-md"
          >
            {submitting && <Loader2 size={15} className="animate-spin" />}
            {submitting ? "Publishing Tuition..." : "Publish Tuition Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
