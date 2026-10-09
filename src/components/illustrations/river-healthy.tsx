type Props = { className?: string };

export function RiverHealthy({ className }: Props) {
  return (
    <svg
      viewBox="0 0 480 320"
      className={className}
      fill="none"
      role="img"
      aria-label="Ilustrasi sungai bersih"
    >
      <rect x="0.5" y="0.5" width="479" height="319" rx="16" className="fill-surface-2 stroke-line" />
      {/* langit lembut */}
      <path d="M40 96c18-24 48-24 66 0" className="stroke-line" strokeWidth="2" strokeLinecap="round" />
      {/* vegetasi tepi kiri */}
      <g className="stroke-foreground/60" strokeWidth="1.8" strokeLinecap="round">
        <path d="M40 250v-46" />
        <path d="M40 214c-14-6-18-20-16-30 14 2 22 14 16 30z" />
        <path d="M40 214c14-6 18-20 16-30-14 2-22 14-16 30z" />
        <path d="M62 252v-34" />
        <path d="M62 224c-12-5-15-17-13-26 12 2 19 12 13 26z" />
        <path d="M62 224c12-5 15-17 13-26-12 2-19 12-13 26z" />
      </g>
      {/* vegetasi tepi kanan */}
      <g className="stroke-foreground/60" strokeWidth="1.8" strokeLinecap="round">
        <path d="M438 252v-40" />
        <path d="M438 220c13-6 17-19 15-28-13 2-21 13-15 28z" />
        <path d="M438 220c-13-6-17-19-15-28 13 2 21 13 15 28z" />
      </g>
      {/* bantaran */}
      <path d="M0 250c60 0 90-10 150-10s90 10 150 10 120-14 180-14v84H0z" className="fill-surface stroke-line" strokeWidth="1.5" />
      {/* aliran air */}
      <g strokeWidth="2.4" strokeLinecap="round" className="stroke-accent">
        <path d="M36 232c50 0 70-14 120-14s70 14 120 14 90-14 132-14" />
      </g>
      <g strokeWidth="2" strokeLinecap="round" className="stroke-foreground/35">
        <path d="M60 262c46 0 64-12 112-12s66 12 112 12 74-12 112-12" />
        <path d="M84 288c40 0 56-10 96-10s58 10 100 10 64-10 96-10" />
      </g>
      {/* kilau */}
      <g className="stroke-accent/70" strokeWidth="2" strokeLinecap="round">
        <path d="M150 236h26" />
        <path d="M210 240h16" />
        <path d="M300 234h22" />
      </g>
      {/* daun kecil mengapung */}
      <g className="stroke-accent" strokeWidth="1.6" strokeLinecap="round">
        <path d="M250 232c6-4 12-2 12 4-6 3-12 1-12-4z" />
      </g>
    </svg>
  );
}
