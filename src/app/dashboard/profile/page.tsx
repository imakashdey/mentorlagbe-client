import { Suspense } from "react";
import ProfileContent from "@/components/profile-content";

export default function UpdateProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0A0E09] border-t-[#96EE60]" />
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
