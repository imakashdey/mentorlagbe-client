"use client";

import { useState, useEffect } from "react";
import {
  UploadCloud,
  Loader2,
  CheckCircle2,
  User,
  Phone,
  FileText,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { updateProfile } from "@/lib/api";
import { uploadToImgBB } from "@/lib/imgbb";
import { toast } from "sonner";

export default function UpdateProfilePage() {
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setBio(user.bio || "");
      setImage(user.image || "");
    }
  }, [user]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    setUploadingImage(true);
    try {
      const url = await uploadToImgBB(file);
      setImage(url);
      toast.success("Profile photo uploaded to ImgBB successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
        image: image.trim(),
      });

      await refreshUser();
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-[#0A0E09]">
          Update Profile Information
        </h1>
        <p className="mt-1 text-xs text-gray-500">
          Personalize your contact details, bio, and profile avatar across MentorLagbe
        </p>
      </div>

      {/* Profile Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-[2.5rem] border border-[#0A0E09]/5 bg-white p-7 sm:p-10 shadow-sm space-y-6"
      >
        {/* Avatar Upload (Challenge 3: ImgBB) */}
        <div>
          <label className="mb-2 block text-xs font-black uppercase text-[#0A0E09]">
            Profile Picture
          </label>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt="Profile Avatar"
                className="h-20 w-20 rounded-full object-cover ring-4 ring-[#96EE60]"
              />
            ) : (
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#96EE60] text-2xl font-black text-[#0A0E09]">
                {name?.charAt(0) || "U"}
              </span>
            )}

            <div className="flex-1 space-y-2">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gray-100 px-5 py-2.5 text-xs font-bold text-[#0A0E09] hover:bg-gray-200 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="sr-only"
                />
                {uploadingImage ? (
                  <>
                    <Loader2 size={14} className="animate-spin text-[#96EE60]" />
                    <span>Uploading to ImgBB...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud size={14} />
                    <span>Upload New Photo (ImgBB)</span>
                  </>
                )}
              </label>

              <input
                type="url"
                placeholder="Or paste an image URL here directly"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-700 outline-none focus:border-[#0A0E09]"
              />
            </div>
          </div>
        </div>

        {/* Read-Only Account Details */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-bold text-gray-500">
              Account Email (Fixed)
            </label>
            <input
              type="email"
              disabled
              value={user?.email || ""}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs font-semibold text-gray-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-gray-500">
              Current Role &amp; Plan
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs font-semibold text-gray-700">
              <span className="capitalize">{user?.role}</span>
              <span>·</span>
              <span className="uppercase text-emerald-700 font-black">
                {user?.plan || "free"} plan
              </span>
            </div>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label className="mb-1 block text-xs font-black uppercase text-[#0A0E09]">
            Full Name *
          </label>
          <input
            type="text"
            required
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-[#0A0E09]/15 px-4 py-3 text-sm font-semibold text-[#0A0E09] outline-none focus:border-[#0A0E09]"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="mb-1 block text-xs font-black uppercase text-[#0A0E09]">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="e.g. 017XXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-2xl border border-[#0A0E09]/15 px-4 py-3 text-sm font-semibold text-[#0A0E09] outline-none focus:border-[#0A0E09]"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="mb-1 block text-xs font-black uppercase text-[#0A0E09]">
            Bio &amp; Academic Background
          </label>
          <textarea
            rows={4}
            placeholder="Write a brief overview of your academic background, tutoring experience, or learning goals..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full rounded-2xl border border-[#0A0E09]/15 px-4 py-3 text-sm font-medium text-[#0A0E09] outline-none focus:border-[#0A0E09]"
          />
        </div>

        {/* Action */}
        <div className="flex justify-end pt-2 border-t border-gray-100">
          <button
            type="submit"
            disabled={saving || uploadingImage}
            className="inline-flex items-center gap-2 rounded-full bg-[#96EE60] px-8 py-3.5 text-xs font-black text-[#0A0E09] hover:brightness-95 disabled:opacity-50 transition shadow-md"
          >
            {saving && <Loader2 size={15} className="animate-spin" />}
            {saving ? "Saving Changes..." : "Save Profile Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
