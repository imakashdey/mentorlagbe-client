"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, ArrowUpRight, Laptop, MapPin, Trash2 } from "lucide-react";
import { getBookmarks, toggleBookmark } from "@/lib/bookmarks";
import { Tuition } from "@/types";
import { toast } from "sonner";

export default function SavedTuitionsPage() {
  const [saved, setSaved] = useState<Tuition[]>([]);

  useEffect(() => {
    setSaved(getBookmarks());
  }, []);

  const handleRemove = (tuition: Tuition) => {
    toggleBookmark(tuition);
    setSaved((prev) => prev.filter((t) => t._id !== tuition._id));
    toast.info("Removed from saved tuitions");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-[#0A0E09]">
            Saved Tuitions (Bookmarks)
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Tuitions you marked for quick access and later application
          </p>
        </div>
        <Link
          href="/tuitions"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#96EE60] px-5 py-2.5 text-xs font-black text-[#0A0E09] hover:brightness-95 transition"
        >
          Explore More Tuitions
        </Link>
      </div>

      {saved.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((tuition) => {
            const isOnline = tuition.mode === "Online";
            return (
              <div
                key={tuition._id}
                className="flex flex-col rounded-[2rem] bg-white p-4 border border-[#0A0E09]/5 shadow-sm"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#0A0E09]">
                  {tuition.bannerImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={tuition.bannerImage}
                      alt={tuition.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#7FD09F] font-black text-2xl text-[#0A0E09]">
                      {tuition.subject.charAt(0)}
                    </div>
                  )}

                  <span
                    className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                      isOnline ? "bg-[#7FD09F] text-[#0A0E09]" : "bg-white text-[#0A0E09]"
                    }`}
                  >
                    {isOnline ? <Laptop size={11} /> : <MapPin size={11} />}
                    {tuition.mode}
                  </span>

                  <button
                    onClick={() => handleRemove(tuition)}
                    className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-rose-600 hover:bg-white transition"
                    title="Remove from saved"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="mt-3 flex flex-1 flex-col">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#ECFAB5] px-2.5 py-0.5 text-[10px] font-black text-[#0A0E09]">
                      {tuition.subject}
                    </span>
                    <span className="text-[10px] font-bold text-gray-500">
                      {tuition.classLevel}
                    </span>
                  </div>

                  <h3 className="mt-2 line-clamp-1 text-sm font-extrabold text-[#0A0E09]">
                    {tuition.title}
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Tutor: {tuition.tutorName}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm font-black text-[#0A0E09]">
                      ৳{Number(tuition.monthlyFee).toLocaleString("en-BD")}
                      <span className="text-[10px] text-gray-400">/mo</span>
                    </span>
                    <Link
                      href={`/tuitions/${tuition._id}`}
                      className="inline-flex items-center gap-1 rounded-full bg-[#0A0E09] px-4 py-2 text-xs font-bold text-white hover:bg-[#96EE60] hover:text-[#0A0E09] transition"
                    >
                      View &amp; Apply <ArrowUpRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-[#0A0E09]/15 bg-white p-12 text-center">
          <Bookmark size={32} className="mx-auto text-gray-400" />
          <h3 className="mt-4 text-base font-bold text-[#0A0E09]">
            No Saved Tuitions
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Bookmark interesting tuitions on the Browse Tuitions page to view them here.
          </p>
        </div>
      )}
    </div>
  );
}
