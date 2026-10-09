"use client";

import { useState } from "react";
import {
  POLLUTION_LABELS,
  SEVERITY_LABELS,
  type AnalyzeResult,
  type ChecklistItem,
} from "@/lib/types";
import { PollutionIcon } from "@/components/illustrations/pollution-icon";

type Tone = {
  text: string;
  bar: string;
  chip: string;
  label: string;
};

function scoreTone(score: number): Tone {
  if (score >= 70)
    return {
      text: "text-ok",
      bar: "bg-ok",
      chip: "border-ok/40 text-ok",
      label: "Baik",
    };
  if (score >= 40)
    return {
      text: "text-warn",
      bar: "bg-warn",
      chip: "border-warn/40 text-warn",
      label: "Perlu perhatian",
    };
  return {
    text: "text-danger",
    bar: "bg-danger",
    chip: "border-danger/40 text-danger",
    label: "Kritis",
  };
}

const severityTone: Record<AnalyzeResult["severity"], string> = {
  ringan: "border-ok/40 text-ok",
  sedang: "border-warn/40 text-warn",
  berat: "border-danger/40 text-danger",
};

const layerMeta = [
  { key: "hariIni", title: "Hari ini", tag: "Segera" },
  { key: "mingguan", title: "Mingguan", tag: "Pekan ini" },
  { key: "bulanan", title: "Bulanan", tag: "Jangka panjang" },
] as const;

export function ResultCard({ result }: { result: AnalyzeResult }) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(result.checklist);
  const [pending, setPending] = useState<string | null>(null);

  const tone = scoreTone(result.waterScore);
  const score = Math.max(0, Math.min(100, result.waterScore));

  async function toggle(item: ChecklistItem) {
    const next = !item.done;
    setPending(item.id);
    setChecklist((prev) =>
      prev.map((c) => (c.id === item.id ? { ...c, done: next } : c))
    );
    try {
      const res = await fetch(`/api/reports/${result.id}/checklist`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, done: next }),
      });
      if (!res.ok) throw new Error("gagal");
      const data = (await res.json()) as { checklist: ChecklistItem[] };
      if (Array.isArray(data.checklist)) setChecklist(data.checklist);
    } catch {
      setChecklist((prev) =>
        prev.map((c) => (c.id === item.id ? { ...c, done: !next } : c))
      );
    } finally {
      setPending(null);
    }
  }

  return (
    <section className="mt-8 space-y-6">
      <div className="overflow-hidden rounded-2xl border border-line bg-background">
        <div className="grid gap-6 p-6 sm:grid-cols-[auto_1fr] sm:items-center">
          <div className="flex flex-col items-center gap-3">
            <div className={`tabular text-6xl font-bold ${tone.text}`}>
              {score}
              <span className="text-2xl font-medium text-muted">/100</span>
            </div>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${tone.chip}`}
            >
              {tone.label}
            </span>
            <div className="h-1.5 w-44 overflow-hidden rounded-full bg-surface-2">
              <div
                className={`h-full rounded-full ${tone.bar}`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-sm font-semibold">
                <PollutionIcon type={result.pollutionType} className="h-4 w-4" />
                {POLLUTION_LABELS[result.pollutionType]}
              </span>
              <span
                className={`rounded-full border px-3 py-1 text-sm font-semibold ${severityTone[result.severity]}`}
              >
                {SEVERITY_LABELS[result.severity]}
              </span>
              <span className="tabular rounded-full bg-surface-2 px-3 py-1 text-sm text-muted">
                Keyakinan {Math.round(result.confidence * 100)}%
              </span>
            </div>
            <p className="text-foreground/90">{result.summary}</p>
            {result.locationLabel || result.kelurahan ? (
              <p className="flex items-center gap-2 text-sm text-muted">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                {result.locationLabel ?? "-"}
                {result.kelurahan ? ` · Kel. ${result.kelurahan}` : ""}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
        {layerMeta.map((layer) => (
          <div key={layer.key} className="bg-background p-5">
            <div className="mb-3 flex items-baseline justify-between">
              <h3 className="font-semibold">{layer.title}</h3>
              <span className="text-xs text-muted">{layer.tag}</span>
            </div>
            <ul className="space-y-2 text-sm text-foreground/90">
              {result.recommendations[layer.key].map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {result.recommendations.instansi.length > 0 ? (
        <div className="rounded-2xl border border-line bg-background p-5">
          <h3 className="mb-3 font-semibold">Instansi terkait</h3>
          <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
            {result.recommendations.instansi.map((ins, i) => (
              <div key={i} className="bg-background p-4">
                <p className="font-medium">{ins.nama}</p>
                <p className="text-sm text-accent">{ins.kontak}</p>
                <p className="mt-1 text-sm text-muted">{ins.alasan}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="rounded-2xl border border-line bg-background p-5">
        <div className="mb-3 flex items-baseline justify-between">
          <h3 className="font-semibold">Checklist tindakan</h3>
          <span className="tabular text-sm text-muted">
            {checklist.filter((c) => c.done).length}/{checklist.length} selesai
          </span>
        </div>
        <ul className="space-y-2">
          {checklist.map((item) => (
            <li key={item.id}>
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                  item.done
                    ? "border-ok/40 bg-ok/5"
                    : "border-line hover:bg-surface-2"
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.done}
                  disabled={pending === item.id}
                  onChange={() => toggle(item)}
                  className="h-5 w-5 accent-teal-600"
                />
                <span
                  className={`text-sm ${
                    item.done ? "text-muted line-through" : "text-foreground/90"
                  }`}
                >
                  {item.label}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
