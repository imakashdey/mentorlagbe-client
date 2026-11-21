import { Quote, Star } from "lucide-react";

// Lavender section #ECEEFE, white cards, mint/green accents.
// NOTE: names and quotes are sample content. Replace with your own.
const reviews = [
  {
    name: "Nusrat Jahan",
    role: "HSC Student",
    text: "I found a Physics tutor within a day. Applying was easy and the tutor replied the same evening.",
    tint: "bg-[#ECFAB5]",
  },
  {
    name: "Rafiul Hasan",
    role: "Math Tutor",
    text: "Posting my batch took minutes. Applicants show up in one dashboard, so managing them is simple.",
    tint: "bg-[#D9F0FF]",
  },
  {
    name: "Tasnim Akter",
    role: "IELTS Learner",
    text: "Filtering by mode and budget saved me so much time. My IELTS band improved in two months.",
    tint: "bg-[#FBE4E3]",
  },
];

export default function Testimonials() {
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
          {reviews.map((r) => (
            <figure
              key={r.name}
              className="flex h-full flex-col rounded-[2rem] bg-white p-8"
            >
              <Quote size={28} className="text-[#7FD09F]" />
              <div className="mt-3 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className="fill-[#7FD09F] text-[#7FD09F]" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-7 text-[#0A0E09]/75">
                {r.text}
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