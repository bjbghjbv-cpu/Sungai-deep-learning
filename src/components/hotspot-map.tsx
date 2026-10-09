"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Hotspot } from "@/lib/types";
import { POLLUTION_LABELS, SEVERITY_LABELS } from "@/lib/types";

function scoreColor(score: number): string {
  if (score >= 70) return "#15803d";
  if (score >= 45) return "#b45309";
  return "#b91c1c";
}

const TILE_URL =
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTR =
  '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';

export default function HotspotMap({ hotspots }: { hotspots: Hotspot[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  const points = hotspots.filter(
    (h) => Number.isFinite(h.lat) && Number.isFinite(h.lng)
  );

  const center: [number, number] =
    points.length > 0
      ? [
          points.reduce((acc, h) => acc + h.lat, 0) / points.length,
          points.reduce((acc, h) => acc + h.lng, 0) / points.length,
        ]
      : [-6.2, 106.816666];

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center,
      zoom: 11,
      scrollWheelZoom: true,
    });
    mapRef.current = map;
    markersRef.current = L.layerGroup().addTo(map);

    tileRef.current = L.tileLayer(TILE_URL, {
      attribution: TILE_ATTR,
      maxZoom: 19,
    }).addTo(map);

    const observer = new MutationObserver(() => {
      if (!mapRef.current) return;
      mapRef.current.invalidateSize();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    window.addEventListener("sm-theme-change", () => {
      if (mapRef.current) mapRef.current.invalidateSize();
    });
    window.addEventListener("storage", () => {
      if (mapRef.current) mapRef.current.invalidateSize();
    });

    const invalidate = () => map.invalidateSize();
    const raf = requestAnimationFrame(invalidate);
    window.addEventListener("resize", invalidate);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", invalidate);
      map.remove();
      mapRef.current = null;
      tileRef.current = null;
      markersRef.current = null;
    };
    // Map dibuat sekali; pembaruan center/tema/titik ditangani efek terpisah.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const group = markersRef.current;
    if (!group) return;
    group.clearLayers();
    for (const h of points) {
      const color = scoreColor(h.avgWaterScore);
      L.circleMarker([h.lat, h.lng], {
        radius: 6 + h.count * 3,
        color,
        fillColor: color,
        fillOpacity: 0.4,
        weight: 2,
      })
        .bindPopup(
          `<div style="line-height:1.5">` +
            `<p style="font-weight:600;margin:0 0 4px">${h.kelurahan}</p>` +
            `<p style="margin:0">Jumlah laporan: <strong>${h.count}</strong></p>` +
            `<p style="margin:0">Rata-rata skor air: <strong>${h.avgWaterScore}</strong></p>` +
            `<p style="margin:0">Jenis dominan: <strong>${POLLUTION_LABELS[h.dominantType]}</strong></p>` +
            `<p style="margin:0">Tingkat terburuk: <strong>${SEVERITY_LABELS[h.worstSeverity]}</strong></p>` +
            `</div>`
        )
        .addTo(group);
    }
    mapRef.current?.invalidateSize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotspots]);

  return (
    <div
      ref={containerRef}
      className="h-[70vh] min-h-80 w-full rounded-2xl border border-line"
    />
  );
}
