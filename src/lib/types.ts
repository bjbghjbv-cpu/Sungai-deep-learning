export type PollutionType =
  | "keruh_sedimen"
  | "sampah_domestik"
  | "berbusa_kimia"
  | "alga_eutrofikasi"
  | "limbah_minyak"
  | "normal";

export type Severity = "ringan" | "sedang" | "berat";

export interface Instansi {
  nama: string;
  kontak: string;
  alasan: string;
}

export interface Recommendations {
  hariIni: string[];
  mingguan: string[];
  bulanan: string[];
  instansi: Instansi[];
}

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export interface VisionResult {
  pollutionType: PollutionType;
  confidence: number;
  severity: Severity;
  waterScore: number;
  indicators: string[];
}

export interface AnalyzeResult extends VisionResult {
  id: string;
  createdAt: string;
  imageUrl: string | null;
  lat: number | null;
  lng: number | null;
  locationLabel: string | null;
  kelurahan: string | null;
  summary: string;
  recommendations: Recommendations;
  checklist: ChecklistItem[];
}

export interface ReportListItem {
  id: string;
  createdAt: string;
  pollutionType: PollutionType;
  severity: Severity;
  waterScore: number;
  kelurahan: string | null;
  lat: number | null;
  lng: number | null;
  status: string;
}

export interface Hotspot {
  kelurahan: string;
  lat: number;
  lng: number;
  count: number;
  avgWaterScore: number;
  worstSeverity: Severity;
  dominantType: PollutionType;
}

export const POLLUTION_LABELS: Record<PollutionType, string> = {
  keruh_sedimen: "Keruh / Sedimen",
  sampah_domestik: "Sampah Domestik",
  berbusa_kimia: "Berbusa / Limbah Kimia",
  alga_eutrofikasi: "Alga / Eutrofikasi",
  limbah_minyak: "Limbah Minyak",
  normal: "Air Tampak Normal",
};

export const SEVERITY_LABELS: Record<Severity, string> = {
  ringan: "Ringan",
  sedang: "Sedang",
  berat: "Berat",
};

export interface AnalyzeInput {
  imageBase64: string;
  mimeType: string;
  lat?: number | null;
  lng?: number | null;
  locationLabel?: string | null;
  kelurahan?: string | null;
  notes?: string | null;
}
