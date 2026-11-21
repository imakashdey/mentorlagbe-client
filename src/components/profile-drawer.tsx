"use client";

import { useState, useEffect } from "react";
import {
  X,
  Camera,
  UploadCloud,
  Loader2,
  CheckCircle2,
  Mail,
  Phone,
  User,
  Shield,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { updateProfile } from "@/lib/api";
import { uploadToImgBB } from "@/lib/imgbb";
import { toast } from "sonner";

export default function ProfileDrawer() {
  const { user, refreshUser, isProfileDrawerOpen, closeProfileDrawer } = useAuth();

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
  }, [user, isProfileDrawerOpen]);

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
      toast.success("Profile photo ready!");
    } catch (err: any) {
      toast.error(err.message || "Failed to process image");
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
      closeProfileDrawer();
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!isProfileDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        onClick={closeProfileDrawer}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Slide Drawer Panel */}
      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 sm:max-w-lg">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#96EE60] text-[#0A0E09] font-black text-sm">
              <User size={18} />
            </span>
            <div>
              <h2 className="text-base font-black text-[#0A0E09]">
                Update Profile
              </h2>
              <p className="text-[11px] text-gray-500">
                Personal details &amp; preferences
              </p>
            </div>
          </div>
          <button
            onClick={closeProfileDrawer}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-black transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* Avatar Preview & Direct Upload */}
          <div className="flex flex-col items-center rounded-2xl bg-gray-50/75 p-5 border border-gray-100 text-center">
            <div className="relative">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image}
                  alt="Avatar"
                  className="h-20 w-20 rounded-full object-cover ring-4 ring-[#96EE60] shadow-sm"
                />
              ) : (
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#96EE60] text-2xl font-black text-[#0A0E09] shadow-sm">
                  {name?.charAt(0) || "U"}
                </span>
              )}

              <label className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-[#0A0E09] text-white hover:bg-[#96EE60] hover:text-[#0A0E09] transition shadow-md">
                <Camera size={14} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
            </div>

            <div className="mt-3 flex items-center gap-1.5">
              <span className="rounded-full bg-[#7FD09F] px-2.5 py-0.5 text-[10px] font-black uppercase text-[#0A0E09]">
                {user?.role}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                  user?.plan === "pro"
                    ? "bg-[#96EE60] text-[#0A0E09]"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {user?.plan || "free"}
              </span>
            </div>

            <label className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[11px] font-bold text-[#0A0E09] border border-gray-200 hover:bg-gray-100 transition shadow-xs">
              <UploadCloud size={14} />
              <span>{uploadingImage ? "Processing..." : "Change Photo"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>
          </div>

          {/* Email (Fixed) */}
          <div>
            <label className="mb-1 block font-bold text-gray-500">
              Account Email
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 font-semibold text-gray-500">
              <Mail size={14} />
              <span>{user?.email}</span>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="mb-1 block font-black uppercase text-[#0A0E09]">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 font-semibold text-[#0A0E09] outline-none focus:border-[#0A0E09]"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="mb-1 block font-black uppercase text-[#0A0E09]">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="e.g. 017XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 font-semibold text-[#0A0E09] outline-none focus:border-[#0A0E09]"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="mb-1 block font-black uppercase text-[#0A0E09]">
              Bio &amp; Academic Background
            </label>
            <textarea
              rows={4}
              placeholder="Share a short bio or learning background..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-medium text-[#0A0E09] outline-none focus:border-[#0A0E09]"
            />
          </div>

          {/* Image URL fallback */}
          <div>
            <label className="mb-1 block font-bold text-gray-500">
              Or Image URL
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-gray-700 outline-none focus:border-[#0A0E09]"
            />
          </div>

          {/* Drawer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={closeProfileDrawer}
              className="rounded-full px-5 py-2.5 font-bold text-gray-500 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#96EE60] px-6 py-2.5 font-black text-[#0A0E09] hover:brightness-95 disabled:opacity-50 transition shadow-sm"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
