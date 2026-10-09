type Props = { className?: string };

export function RiverPolluted({ className }: Props) {
  return (
    <svg
      viewBox="0 0 480 320"
      className={className}
      fill="none"
      role="img"
      aria-label="Ilustrasi sungai tercemar"
    >
      <rect x="0.5" y="0.5" width="479" height="319" rx="16" className="fill-surface-2 stroke-line" />
      {/* asap pabrik */}
      <g className="stroke-foreground/40" strokeWidth="1.8" strokeLinecap="round">
        <path d="M368 96c0-10 8-14 8-24M384 100c0-8 6-12 6-20" />
      </g>
      {/* cerobong/anak sungai industri */}
      <g className="stroke-foreground/70" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M356 150v-34h10v-14h8v14h10v34" />
      </g>
      {/* pohon layu */}
      <g className="stroke-foreground/55" strokeWidth="1.8" strokeLinecap="round">
        <path d="M64 250v-40" />
        <path d="M64 216l-16-12M64 224l18-10" />
      </g>
      {/* bantaran kotor */}
      <path d="M0 250c60 0 90-10 150-10s90 10 150 10 120-14 180-14v84H0z" className="fill-surface stroke-line" strokeWidth="1.5" />
      {/* aliran keruh */}
      <g strokeWidth="2.6" strokeLinecap="round" className="stroke-foreground/45">
        <path d="M32 234c30-8 44 10 74 4s40-14 74-6 44 12 74 4 50-10 74-4 44 4 56 2" />
      </g>
      <g strokeWidth="2" strokeLinecap="round" className="stroke-foreground/25">
        <path d="M50 262c40-6 56 10 96 4s62-12 100-4 60 8 96 2 60-6 78-4" />
        <path d="M78 290c38-4 54 8 92 4s60-8 98-4 58 6 94 2 60-4 82-6" />
      </g>
      {/* busa kimia */}
      <g className="stroke-danger" strokeWidth="2" strokeLinecap="round">
        <circle cx="150" cy="230" r="5" />
        <circle cx="166" cy="226" r="3.5" />
        <circle cx="136" cy="226" r="3" />
        <path d="M232 236c6-4 12-4 18 0" />
      </g>
      {/* sampah mengapung */}
      <g className="stroke-foreground/70" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {/* botol */}
        <path d="M300 226h16l2 6v14h-20v-14z" />
        <path d="M304 226v-6h8v6" />
        {/* kaleng */}
        <rect x="336" y="232" width="14" height="16" rx="2" />
        {/* kantong plastik */}
        <path d="M246 250c4-6 12-6 16 0 3 5-2 10-8 10s-11-5-8-10z" />
      </g>
      {/* limbah minyak */}
      <g className="stroke-warn" strokeWidth="2" strokeLinecap="round">
        <path d="M120 258c10-3 20 3 30 0" opacity="0.9" />
        <path d="M188 254c8-2 16 2 24 0" opacity="0.9" />
      </g>
    </svg>
  );
}
