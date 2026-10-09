import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/site-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SungaiMata — Pindai Sungai, Ketahui Solusinya",
  description:
    "Unggah foto sungai, dapatkan diagnosis tingkat pencemaran dan langkah nyata untuk memulihkan kebersihannya.",
};

const themeInit = `(function(){try{var s=localStorage.getItem('sm-theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;var e=document.documentElement;e.classList.toggle('dark',d);e.setAttribute('data-theme',d?'dark':'light');}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="min-h-full flex flex-col">
        <SiteNav />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-line">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center">
            <p>SungaiMata — warga memantau, AI menganalisis, sungai pulih.</p>
            <p className="tabular text-xs">Hackathon · 2026</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
