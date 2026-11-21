import Link from "next/link";
import { ArrowUpRight, BookOpen, Laptop, MapPin } from "lucide-react";
import { getLatestTuitions } from "@/lib/api";
import type { Tuition } from "@/types/tuition";

// Pastel card backgrounds cycle: Lime, Lavender, Sky, Pink
const cardBg = ["bg-[#ECFAB5]", "bg-[#ECEEFE]", "bg-[#D9F0FF]", "bg-[#FBE4E3]"];

type TuitionWithBanner = Tuition & { bannerImage?: string };

export default async function TuitionSection() {
  const tuitions = ((await getLatestTuitions()) as TuitionWithBanner[]).slice(0, 6);

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#0A0E09] md:text-4xl">
              Latest{" "}
              <span className="rounded-lg bg-[#ECFAB5] px-2">verified tuitions</span>
            </h2>
            <p className="mt-3 max-w-xl text-[#0A0E09]/60">
              Recently approved listings from our tutor community.
            </p>
          </div>
          <Link
            href="/tuitions"
            className="inline-flex items-center gap-2 rounded-full bg-[#96EE60] px-6 py-3 text-sm font-bold text-[#0A0E09] hover:brightness-95"
          >
            See all tuitions <ArrowUpRight size={18} />
          </Link>
        </div>

        {tuitions.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tuitions.map((tuition, i) => {
              const isOnline = tuition.mode === "Online";
              return (
                <article
                  key={tuition._id}
                  className={`flex h-full flex-col rounded-[2rem] p-3 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0A0E09]/10 ${cardBg[i % cardBg.length]}`}
                >
                  {/* Photo with overlay (equal size on every card) */}
                  <Link
                    href={`/tuitions/${tuition._id}`}
                    className="group relative block aspect-[4/3] overflow-hidden rounded-3xl bg-[#0A0E09]"
                  >
                    {tuition.bannerImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={tuition.bannerImage}
                        alt={tuition.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center bg-[#7FD09F] text-7xl font-black text-[#0A0E09]">
                        {tuition.subject?.charAt(0)}
                      </span>
                    )}

                    <span
                      className={`absolute right-4 top-4 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold text-[#0A0E09] ${
                        isOnline ? "bg-[#7FD09F]" : "bg-white"
                      }`}
                    >
                      {isOnline ? <Laptop size={12} /> : <MapPin size={12} />}
                      {tuition.mode}
                    </span>

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0A0E09]/90 via-[#0A0E09]/50 to-transparent p-5 pt-16 text-white">
                      <p className="truncate text-xl font-extrabold">
                        {tuition.tutorName}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 truncate text-sm font-semibold text-white/85">
                        <MapPin size={14} />
                        {tuition.location || tuition.mode}
                      </p>
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex flex-1 flex-col px-3 pb-3 pt-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#0A0E09]">
                        {tuition.subject}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/60 px-3 py-1 text-xs font-semibold text-[#0A0E09]/75">
                        <BookOpen size={12} />
                        {tuition.classLevel}
                      </span>
                    </div>

                    <h3 className="mt-3 line-clamp-2 min-h-[3.5rem] text-base font-bold leading-7 text-[#0A0E09]">
                      {tuition.title}
                    </h3>

                    <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                      <p className="text-lg font-black text-[#0A0E09]">
                        ৳{Number(tuition.monthlyFee).toLocaleString("en-BD")}
                        <span className="text-sm font-semibold text-[#0A0E09]/60">
                          {" "}/ month
                        </span>
                      </p>
                      <Link
                        href={`/tuitions/${tuition._id}`}
                        className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#0A0E09] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#96EE60] hover:text-[#0A0E09]"
                      >
                        View Details <ArrowUpRight size={16} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-[#0A0E09]/20 bg-[#ECEEFE] px-6 py-16 text-center">
            <h3 className="text-lg font-bold text-[#0A0E09]">
              No tuitions available yet
            </h3>
            <p className="mt-2 text-sm text-[#0A0E09]/60">
              New approved listings will appear here.
            </p>
            <Link
              href="/tuitions"
              className="mt-5 inline-flex rounded-full bg-[#96EE60] px-6 py-3 text-sm font-bold text-[#0A0E09] hover:brightness-95"
            >
              Browse Tuitions
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}