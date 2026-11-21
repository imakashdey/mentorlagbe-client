"use client";

import { useState, useEffect } from "react";
import {
  UploadCloud,
  Loader2,
  Phone,
  Mail,
  Camera,
  SidebarOpen,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { updateProfile } from "@/lib/api";
import { uploadToImgBB } from "@/lib/imgbb";
import { toast } from "sonner";

export default function ProfileContent() {
  const { user, refreshUser, openProfileDrawer } = useAuth();

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
      toast.success("Profile photo uploaded & ready!");
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
      toast.success("Profile changes saved successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0A0E09]">
            My Profile &amp; Settings
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Manage your account profile, contact details, bio, and avatar across MentorLagbe
          </p>
        </div>
        <button
          type="button"
          onClick={openProfileDrawer}
          className="inline-flex items-center gap-2 self-start rounded-full bg-[#0A0E09] px-4 py-2.5 text-xs font-black text-white hover:bg-[#96EE60] hover:text-[#0A0E09] transition shadow-sm"
        >
          <SidebarOpen size={15} />
          <span>Quick Edit Profile</span>
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Left Card: Profile Summary */}
        <div className="flex flex-col items-center rounded-[2.5rem] border border-[#0A0E09]/5 bg-white p-7 text-center shadow-sm">
          <div className="relative">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt="Avatar"
                className="h-28 w-28 rounded-full object-cover ring-4 ring-[#96EE60] shadow-md"
              />
            ) : (
              <span className="flex h-28 w-28 items-center justify-center rounded-full bg-[#96EE60] text-3xl font-black text-[#0A0E09] shadow-md">
                {name?.charAt(0) || "U"}
              </span>
            )}

            <label className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#0A0E09] text-white shadow-md hover:bg-[#96EE60] hover:text-[#0A0E09] transition">
              <Camera size={16} />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>
          </div>

          <h2 className="mt-4 text-lg font-black text-[#0A0E09]">{name || "Your Name"}</h2>
          <p className="text-xs text-gray-400">{user?.email}</p>

          <div className="mt-3 flex items-center gap-2">
            <span className="rounded-full bg-[#7FD09F] px-3 py-1 text-[10px] font-black uppercase text-[#0A0E09]">
              {user?.role}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${
                user?.plan === "pro"
                  ? "bg-[#96EE60] text-[#0A0E09]"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {user?.plan || "free"} plan
            </span>
          </div>

          {bio && (
            <p className="mt-5 border-t border-gray-100 pt-4 text-xs italic leading-relaxed text-gray-600">
              &quot;{bio}&quot;
            </p>
          )}

          <div className="mt-6 w-full space-y-2 border-t border-gray-100 pt-4 text-left text-xs">
            <div className="flex items-center gap-2 text-gray-500">
              <Mail size={14} className="shrink-0 text-[#0A0E09]" />
              <span className="truncate">{user?.email}</span>
            </div>
            {phone && (
              <div className="flex items-center gap-2 text-gray-500">
                <Phone size={14} className="shrink-0 text-[#0A0E09]" />
                <span>{phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Form: Edit Profile Details */}
        <form
          onSubmit={handleSubmit}
          className="rounded-[2.5rem] border border-[#0A0E09]/5 bg-white p-7 sm:p-10 shadow-sm space-y-5"
        >
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-base font-black text-[#0A0E09]">
              Personal Information
            </h3>
            <p className="text-xs text-gray-400">
              Update your public name, contact phone, and avatar
            </p>
          </div>

          {/* Photo Upload Section */}
          <div>
            <label className="mb-2 block text-xs font-black uppercase text-[#0A0E09]">
              Profile Photo (Direct Upload)
            </label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#0A0E09]/20 bg-gray-50/50 px-5 py-3 text-xs font-bold text-[#0A0E09] hover:border-[#0A0E09] transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="sr-only"
                />
                {uploadingImage ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-[#96EE60]" />
                    <span>Processing Image...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud size={16} />
                    <span>Choose Photo from Device</span>
                  </>
                )}
              </label>

              <div className="flex-1">
                <input
                  type="url"
                  placeholder="Or paste an image URL directly"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-700 outline-none focus:border-[#0A0E09]"
                />
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
              placeholder="Tell tutors or students about your academic goals, qualifications, subjects of expertise..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-2xl border border-[#0A0E09]/15 px-4 py-3 text-sm font-medium text-[#0A0E09] outline-none focus:border-[#0A0E09]"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-3 border-t border-gray-100">
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
    </div>
  );
}
