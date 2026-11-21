"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Generate page numbers array
  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2.5 py-6">
      {/* Prev Button */}
      <button
        type="button"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage <= 1}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 transition hover:border-black hover:text-black disabled:cursor-not-allowed disabled:opacity-30 shadow-xs"
        aria-label="Previous Page"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Number Buttons */}
      {pages.map((p) => {
        const isActive = p === currentPage;
        return (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition shadow-xs ${
              isActive
                ? "bg-[#0A0E09] text-white shadow-md ring-2 ring-[#0A0E09]/20"
                : "border border-gray-200 bg-white text-[#0A0E09] hover:border-black hover:bg-gray-50"
            }`}
          >
            {p}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        type="button"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage >= totalPages}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-[#0A0E09] transition hover:border-black hover:text-black disabled:cursor-not-allowed disabled:opacity-30 shadow-xs"
        aria-label="Next Page"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
