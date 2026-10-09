"use client";

import dynamic from "next/dynamic";
import type { Hotspot } from "@/lib/types";

const HotspotMap = dynamic(() => import("./hotspot-map"), {
  ssr: false,
  loading: () => (
    <div className="grid h-[70vh] w-full place-items-center rounded-2xl border border-line bg-surface-2 text-sm text-muted">
      Memuat peta…
    </div>
  ),
});

export function MapView({ hotspots }: { hotspots: Hotspot[] }) {
  return <HotspotMap hotspots={hotspots} />;
}
