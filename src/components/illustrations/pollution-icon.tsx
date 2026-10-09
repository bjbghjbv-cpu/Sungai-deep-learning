import type { PollutionType } from "@/lib/types";

type Props = { type: PollutionType; className?: string };

const common = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function PollutionIcon({ type, className }: Props) {
  const c = { ...common, className };
  switch (type) {
    case "keruh_sedimen":
      return (
        <svg viewBox="0 0 24 24" {...c}>
          <path d="M3 8c2 0 3 1.5 5 1.5S11 8 13 8s3 1.5 5 1.5" />
          <path d="M3 14c2 0 3 1.5 5 1.5s3-1.5 5-1.5 3 1.5 5 1.5" />
          <circle cx="8" cy="11" r="0.9" />
          <circle cx="15" cy="17" r="0.9" />
        </svg>
      );
    case "sampah_domestik":
      return (
        <svg viewBox="0 0 24 24" {...c}>
          <path d="M5 7h14l-1 12H6z" />
          <path d="M4 7h16M9 7V5h6v2" />
          <path d="M10 11v5M14 11v5" />
        </svg>
      );
    case "berbusa_kimia":
      return (
        <svg viewBox="0 0 24 24" {...c}>
          <circle cx="8" cy="9" r="3" />
          <circle cx="15" cy="7" r="2" />
          <circle cx="16" cy="12" r="2.5" />
          <path d="M4 17h16" />
        </svg>
      );
    case "alga_eutrofikasi":
      return (
        <svg viewBox="0 0 24 24" {...c}>
          <path d="M12 20V9" />
          <path d="M12 12c-3 0-5-2-5-5 3 0 5 2 5 5z" />
          <path d="M12 15c3 0 5-2 5-5-3 0-5 2-5 5z" />
        </svg>
      );
    case "limbah_minyak":
      return (
        <svg viewBox="0 0 24 24" {...c}>
          <path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z" />
        </svg>
      );
    case "normal":
      return (
        <svg viewBox="0 0 24 24" {...c}>
          <path d="M3 9c2 0 3 1.5 5 1.5S11 9 13 9s3 1.5 5 1.5" />
          <path d="M3 15c2 0 3 1.5 5 1.5s3-1.5 5-1.5 3 1.5 5 1.5" />
        </svg>
      );
  }
}
