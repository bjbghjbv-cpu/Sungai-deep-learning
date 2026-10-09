"use client";

import { useRef, useState } from "react";
import type { AnalyzeInput, AnalyzeResult } from "@/lib/types";
import { ResultCard } from "@/components/result-card";

interface FormState {
  lat: string;
  lng: string;
  locationLabel: string;
  kelurahan: string;
  notes: string;
}

const initialForm: FormState = {
  lat: "",
  lng: "",
  locationLabel: "",
  kelurahan: "",
  notes: "",
};

const inputCls =
  "w-full rounded-lg border border-line bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent/20";

export function UploadScanner() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onFile(f: File | null) {
    setError(null);
    if (!f) {
      setFile(null);
      setPreview(null);
      return;
    }
    if (!f.type.startsWith("image/")) {
      setError("Berkas harus berupa gambar (JPG, PNG, atau lainnya).");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function detectLocation() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("Perangkat/browser ini tidak mendukung deteksi lokasi.");
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        update("lat", pos.coords.latitude.toFixed(6));
        update("lng", pos.coords.longitude.toFixed(6));
        setLocating(false);
      },
      () => {
        setError(
          "Gagal mendeteksi lokasi. Izinkan akses lokasi atau isi koordinat manual."
        );
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function toBase64(f: File): Promise<string> {
    const buf = await f.arrayBuffer();
    let binary = "";
    const bytes = new Uint8Array(buf);
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    return btoa(binary);
  }

  async function analyze() {
    if (!file) {
      setError("Pilih foto sungai terlebih dahulu.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const imageBase64 = await toBase64(file);
      const payload: AnalyzeInput = {
        imageBase64,
        mimeType: file.type || "image/jpeg",
        lat: form.lat ? Number(form.lat) : null,
        lng: form.lng ? Number(form.lng) : null,
        locationLabel: form.locationLabel || null,
        kelurahan: form.kelurahan || null,
        notes: form.notes || null,
      };
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error("Server gagal menganalisis gambar.");
      }
      const data = (await res.json()) as AnalyzeResult;
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Terjadi kesalahan saat menganalisis. Coba lagi."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-2">
        <div className="space-y-5 bg-background p-6">
          <div>
            <label className="mb-2 block text-sm font-semibold">
              1. Foto kondisi sungai
            </label>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex min-h-64 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-line bg-surface-2 text-center transition hover:border-accent/60"
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview}
                  alt="Pratinjau foto sungai"
                  className="h-64 w-full object-cover"
                />
              ) : (
                <div className="p-6 text-muted">
                  <svg
                    className="mx-auto h-10 w-10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <circle cx="12" cy="12" r="3.2" />
                    <path d="M8 5l1.5-2h5L16 5" />
                  </svg>
                  <p className="mt-3 text-sm font-medium text-foreground">
                    Klik untuk memilih foto
                  </p>
                  <p className="text-xs">JPG / PNG</p>
                </div>
              )}
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            />
            {file ? (
              <button
                type="button"
                onClick={() => onFile(null)}
                className="mt-2 text-xs font-medium text-muted transition hover:text-danger"
              >
                Hapus foto
              </button>
            ) : null}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Catatan (opsional)
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              rows={3}
              placeholder="Contoh: air berbau, banyak busa, ada sampah menumpuk..."
              className={inputCls}
            />
          </div>
        </div>

        <div className="space-y-5 bg-background p-6">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold">2. Lokasi</label>
            <button
              type="button"
              onClick={detectLocation}
              disabled={locating}
              className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold transition hover:border-accent hover:text-accent disabled:opacity-60"
            >
              {locating ? "Mendeteksi..." : "Deteksi lokasi"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">
                Latitude
              </label>
              <input
                value={form.lat}
                onChange={(e) => update("lat", e.target.value)}
                placeholder="-6.200000"
                className={`${inputCls} tabular`}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">
                Longitude
              </label>
              <input
                value={form.lng}
                onChange={(e) => update("lng", e.target.value)}
                placeholder="106.816666"
                className={`${inputCls} tabular`}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted">
              Label lokasi
            </label>
            <input
              value={form.locationLabel}
              onChange={(e) => update("locationLabel", e.target.value)}
              placeholder="Contoh: Jembatan RT 04"
              className={inputCls}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted">
              Kelurahan
            </label>
            <input
              value={form.kelurahan}
              onChange={(e) => update("kelurahan", e.target.value)}
              placeholder="Contoh: Sukamaju"
              className={inputCls}
            />
          </div>

          <button
            type="button"
            onClick={analyze}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 font-semibold text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/40 border-t-background" />
                Menganalisis...
              </>
            ) : (
              "Analisis sekarang"
            )}
          </button>

          {error ? (
            <p className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </p>
          ) : null}
        </div>
      </div>

      {loading ? (
        <div className="mt-6 flex items-center justify-center gap-3 rounded-2xl border border-line bg-surface-2 p-6 text-sm text-muted">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-muted/40 border-t-accent" />
          Menganalisis foto sungai...
        </div>
      ) : null}

      {result ? <ResultCard result={result} /> : null}
    </div>
  );
}
