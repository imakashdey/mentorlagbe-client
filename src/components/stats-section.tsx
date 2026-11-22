import { BookOpen, GraduationCap, Layers, Users } from "lucide-react";
import { API_URL } from "@/lib/api";

type Stats = {
  tutors: number;
  students: number;
  tuitions: number;
  subjects: number;
};

async function getStats(): Promise<Stats> {
  try {
    const baseUrl = API_URL || "https://mentorlagbe-server-taupe.vercel.app";
    const res = await fetch(`${baseUrl}/stats`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      return {
        tutors: data.tutors ?? 5,
        students: data.students ?? 2,
        tuitions: data.tuitions ?? 14,
        subjects: data.subjects ?? 10,
      };
    }
  } catch {
    // fallback
  }
  return {
    tutors: 5,
    students: 2,
    tuitions: 14,
    subjects: 10,
  };
}

export default async function StatsSection() {
  const data = await getStats();

  const items = [
    { label: "Tutors", value: data.tutors, icon: GraduationCap, tint: "bg-[#96EE60]" },
    { label: "Students", value: data.students, icon: Users, tint: "bg-[#D9F0FF]" },
    { label: "Tuitions posted", value: data.tuitions, icon: BookOpen, tint: "bg-[#FBE4E3]" },
    { label: "Subjects", value: data.subjects, icon: Layers, tint: "bg-[#ECEEFE]" },
  ];

  return (
    <section className="bg-white px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2.5rem] bg-[#ECFAB5] px-6 py-12 md:px-12 md:py-14">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-[#0A0E09] md:text-4xl">
            MentorLagbe in{" "}
            <span className="rounded-lg bg-[#0A0E09] px-2 text-[#96EE60]">numbers</span>
          </h2>
          <p className="mt-3 text-[#0A0E09]/65">
            Live figures from our growing community.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="flex flex-col items-center rounded-[2rem] bg-white px-4 py-8 text-center"
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl text-[#0A0E09] ${s.tint}`}
                >
                  <Icon size={22} />
                </span>
                <p className="mt-4 text-4xl font-black tracking-tight text-[#0A0E09] md:text-5xl">
                  {s.value.toLocaleString()}
                </p>
                <p className="mt-1 text-sm font-semibold text-[#0A0E09]/60">
                  {s.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}