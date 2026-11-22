import { Quote, Star } from "lucide-react";
import { API_URL } from "@/lib/api";

type ReviewItem = {
  name: string;
  role: string;
  text: string;
  rating?: number;
  tint: string;
};

const defaultReviews: ReviewItem[] = [
  {
    name: "Nusrat Jahan",
    role: "HSC Student",
    text: "I found a Physics tutor within a day. Applying was easy and the tutor replied the same evening.",
    rating: 5,
    tint: "bg-[#ECFAB5]",
  },
  {
    name: "Rafiul Hasan",
    role: "Math Tutor",
    text: "Posting my batch took minutes. Applicants show up in one dashboard, so managing them is simple.",
    rating: 5,
    tint: "bg-[#D9F0FF]",
  },
  {
    name: "Tasnim Akter",
    role: "IELTS Learner",
    text: "Filtering by mode and budget saved me so much time. My IELTS band improved in two months.",
    rating: 5,
    tint: "bg-[#FBE4E3]",
  },
];

async function getLatestCommunityReviews(): Promise<ReviewItem[]> {
  try {
    const baseUrl = API_URL || "https://mentorlagbe-server-taupe.vercel.app";
    const res = await fetch(`${baseUrl}/applications/reviews/latest`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const tints = ["bg-[#ECFAB5]", "bg-[#D9F0FF]", "bg-[#FBE4E3]"];
        return data.slice(0, 3).map((d: any, i: number) => ({
          name: d.studentName || "Verified Student",
          role: `${d.subject || "Academic"} Student`,
          text: d.feedback || "Great learning experience with verified mentors.",
          rating: Number(d.rating) || 5,
          tint: tints[i % tints.length],
        }));
      }
    }
  } catch {
    // fallback
  }
  return defaultReviews;
}

export default async function Testimonials() {
  const reviews = await getLatestCommunityReviews();

  return (
    <section className="bg-[#ECEEFE] py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-[#0A0E09] md:text-4xl">
            Loved by{" "}
            <span className="rounded-lg bg-[#96EE60] px-2">students & tutors</span>
          </h2>
          <p className="mt-4 text-[#0A0E09]/60">
            Real feedback from the MentorLagbe community.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <figure
              key={i}
              className="flex h-full flex-col rounded-[2rem] bg-white p-8 shadow-sm transition hover:shadow-md"
            >
              <Quote size={28} className="text-[#7FD09F]" />
              <div className="mt-3 flex gap-1">
                {Array.from({ length: r.rating || 5 }).map((_, idx) => (
                  <Star key={idx} size={16} className="fill-[#7FD09F] text-[#7FD09F]" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-7 text-[#0A0E09]/75">
                &quot;{r.text}&quot;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-[#0A0E09]/10 pt-5">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full font-extrabold text-[#0A0E09] ${r.tint}`}
                >
                  {r.name.charAt(0)}
                </span>
                <div>
                  <p className="font-bold text-[#0A0E09]">{r.name}</p>
                  <p className="text-xs text-[#0A0E09]/60">{r.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
