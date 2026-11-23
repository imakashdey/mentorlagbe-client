import { BadgeCheck, Quote, Star } from "lucide-react";

type Review = {
  _id: string;
  studentName: string;
  tuitionTitle: string;
  rating: number;
  feedback: string;
};

const tints = ["bg-[#ECFAB5]", "bg-[#D9F0FF]", "bg-[#FBE4E3]"];

async function getReviews(): Promise<Review[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/latest`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.slice(0, 3) : [];
  } catch {
    return [];
  }
}

export default async function Testimonials() {
  const reviews = await getReviews();
  if (reviews.length === 0) return null;

  const avg = reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length;

  return (
    <section className="relative overflow-hidden bg-[#ECEEFE] py-20">
      <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-[#96EE60]/20 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-[#FBE4E3] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-[#0A0E09] md:text-4xl">
            Loved by{" "}
            <span className="rounded-lg bg-[#96EE60] px-2">students</span>
          </h2>
          <p className="mt-4 text-[#0A0E09]/60">
            Reviews from students with accepted enrollments.
          </p>

          <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-white px-5 py-2.5 shadow-sm">
            <span className="flex items-center gap-1 text-lg font-black text-[#0A0E09]">
              <Star size={18} className="fill-[#FFB400] text-[#FFB400]" />
              {avg.toFixed(1)}
            </span>
            <span className="h-4 w-px bg-[#0A0E09]/15" />
            <span className="text-sm font-semibold text-[#0A0E09]/60">
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {reviews.map((r, i) => (
            <figure
              key={r._id}
              className="group relative flex w-full flex-col rounded-[2rem] border border-[#0A0E09]/5 bg-white p-8 pt-10 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#0A0E09]/10 md:w-[calc(33.333%-1rem)]"
            >
              <span className="absolute -top-5 left-8 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#96EE60] text-[#0A0E09] shadow-md">
                <Quote size={20} />
              </span>

              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    size={17}
                    className={
                      s < r.rating
                        ? "fill-[#FFB400] text-[#FFB400]"
                        : "text-[#0A0E09]/15"
                    }
                  />
                ))}
              </div>

              <blockquote className="mt-4 flex-1 text-[15px] leading-7 text-[#0A0E09]/80">
                &ldquo;{r.feedback}&rdquo;
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3 border-t border-[#0A0E09]/10 pt-5">
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-extrabold text-[#0A0E09] ring-2 ring-white ${tints[i % 3]}`}
                >
                  {r.studentName?.charAt(0)}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-bold text-[#0A0E09]">{r.studentName}</p>
                  <p className="truncate text-xs text-[#0A0E09]/55">{r.tuitionTitle}</p>
                </div>
                <span
                  title="Accepted enrollment"
                  className="ml-auto flex shrink-0 items-center gap-1 rounded-full bg-[#ECFAB5] px-2.5 py-1 text-[10px] font-extrabold uppercase text-[#0A0E09]"
                >
                  <BadgeCheck size={12} /> Verified
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}