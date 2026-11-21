export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <div className="absolute h-16 w-16 animate-ping rounded-full bg-[#96EE60]/40 duration-1000" />
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#0A0E09] border-t-[#96EE60]" />
      </div>
      <p className="mt-6 text-sm font-bold tracking-wide text-[#0A0E09]/70">
        Loading MentorLagbe...
      </p>
    </div>
  );
}
