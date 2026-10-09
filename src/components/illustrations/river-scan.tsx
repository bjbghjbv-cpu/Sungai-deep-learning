type Props = { className?: string };

export function RiverScan({ className }: Props) {
  return (
    <svg
      viewBox="0 0 480 320"
      className={className}
      fill="none"
      role="img"
      aria-label="Ilustrasi pindai sungai dengan AI"
    >
      <rect x="0.5" y="0.5" width="479" height="319" rx="16" className="fill-surface-2 stroke-line" />
      {/* aliran */}
      <g className="stroke-foreground/30" strokeWidth="2.4" strokeLinecap="round">
        <path d="M40 236c46 0 64-12 112-12s66 12 112 12 74-12 132-12" />
        <path d="M64 262c40 0 56-10 96-10s58 10 100 10 64-10 96-10" />
      </g>
      {/* bingkai pindai */}
      <g className="stroke-accent" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M132 96h-24v24" />
        <path d="M348 96h24v24" />
        <path d="M132 224h-24v-24" />
        <path d="M348 224h24v-24" />
      </g>
      {/* garis pindai */}
      <path d="M140 160h200" className="stroke-accent" strokeWidth="2" strokeDasharray="5 6" strokeLinecap="round" />
      {/* titik data */}
      <g className="fill-accent">
        <circle cx="180" cy="140" r="3.5" />
        <circle cx="240" cy="176" r="3.5" />
        <circle cx="300" cy="138" r="3.5" />
      </g>
      <g className="stroke-foreground/45" strokeWidth="1.6" strokeLinecap="round">
        <path d="M180 140l60 36M240 176l60-38" />
      </g>
      {/* node AI */}
      <circle cx="240" cy="160" r="18" className="fill-background stroke-accent" strokeWidth="2.2" />
      <g className="stroke-accent" strokeWidth="2" strokeLinecap="round">
        <path d="M232 160h16M240 152v16" />
      </g>
    </svg>
  );
}
