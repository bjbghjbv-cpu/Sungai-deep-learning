"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "/", label: "Pindai" },
  { href: "/peta", label: "Peta" },
  { href: "/tentang", label: "Tentang" },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-foreground text-background">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 8c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2" />
              <path d="M2 14c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2" />
              <circle cx="12" cy="4" r="1.6" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <span className="text-[17px] font-semibold tracking-tight">
            Sungai<span className="text-accent">Mata</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <ul className="flex items-center gap-1 text-sm font-medium">
            {links.map((l) => {
              const active =
                l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`relative rounded-md px-3 py-2 transition ${
                      active
                        ? "text-foreground"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    {l.label}
                    {active ? (
                      <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-accent" />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
