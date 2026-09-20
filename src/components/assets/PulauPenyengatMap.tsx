import React from "react";

export interface SiteLocation {
  id: number;
  name: string;
  nameEn: string;
  x: number;
  y: number;
  color: string;
  desc: string;
}

export const SITES_DATA: SiteLocation[] = [
  {
    id: 1,
    name: "Masjid Raya Sultan Riau",
    nameEn: "Sultan Riau Grand Mosque",
    x: 85,
    y: 110,
    color: "#2F7D4F",
    desc: "Masjid bersejarah berkubah kuning-hijau dibangun dengan perekat putih telur.",
  },
  {
    id: 2,
    name: "Makam Engku Putri & Raja Ali Haji",
    nameEn: "Tomb of Engku Putri & Raja Ali Haji",
    x: 160,
    y: 85,
    color: "#9A6B12",
    desc: "Kompleks pemakaman sastrawan Melayu penggubah Gurindam 12 & permaisuri kesultanan.",
  },
  {
    id: 3,
    name: "Istana Kantor",
    nameEn: "Kantor Palace (Raja Ali Marhum Kantor)",
    x: 235,
    y: 130,
    color: "#B4533A",
    desc: "Kediaman dan pusat administrasi Yang Dipertuan Muda Riau VIII.",
  },
  {
    id: 4,
    name: "Gedung Tabib",
    nameEn: "Physician's House",
    x: 305,
    y: 95,
    color: "#5F7F2E",
    desc: "Reruntuhan kediaman tabib kerajaan yang dikelilingi rimbun tanaman obat.",
  },
  {
    id: 5,
    name: "Perigi Puteri",
    nameEn: "The Princess Well",
    x: 370,
    y: 140,
    color: "#2E7EA0",
    desc: "Mata air tawar jernih yang tak pernah kering di tepi pesisir pulau.",
  },
];

interface PulauPenyengatMapProps {
  currentStage?: number; // 1 to 5
  onSelectSite?: (siteId: number) => void;
  className?: string;
  compact?: boolean;
}

export const PulauPenyengatMap: React.FC<PulauPenyengatMapProps> = ({
  currentStage = 1,
  onSelectSite,
  className = "",
  compact = false,
}) => {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border-3 border-tinta bg-[#F5EEDB] shadow-stiker ${className}`}
      style={{
        backgroundImage: "radial-gradient(#8B5A2B 0.75px, transparent 0.75px)",
        backgroundSize: "16px 16px",
      }}
    >
      {/* Paper Fold Shadows Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-tinta/5 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-tinta/10 z-10" />
      <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-tinta/10 z-10" />

      {/* Map SVG */}
      <svg
        viewBox="0 0 440 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto select-none"
      >
        {/* Sea Ripple Lines */}
        <g stroke="#2E7EA0" strokeWidth="1.2" opacity="0.3" strokeLinecap="round">
          <path d="M20 30C28 32 36 28 44 30" />
          <path d="M120 20C130 22 140 18 150 20" />
          <path d="M350 40C360 42 370 38 380 40" />
          <path d="M30 190C40 192 50 188 60 190" />
          <path d="M220 205C230 207 240 203 250 205" />
          <path d="M380 185C390 187 400 183 410 185" />
        </g>

        {/* Small Traditional Boat (Pompong) */}
        <g transform="translate(30, 45) scale(0.65)">
          <path d="M0 16C8 22 24 22 32 16L28 20C20 24 10 24 4 20Z" fill="#8B5A2B" stroke="#3A2412" strokeWidth="2" />
          <path d="M16 16V4" stroke="#3A2412" strokeWidth="2" />
          <path d="M16 6L26 12H16V6Z" fill="#FFC629" stroke="#3A2412" strokeWidth="1.5" />
        </g>

        {/* Pulau Penyengat Island Body Contour */}
        <path
          d="M45 125C40 95 60 70 100 65C150 60 190 50 240 55C290 60 340 70 390 85C420 95 425 135 395 160C365 185 305 175 250 170C190 165 140 185 90 175C55 165 48 145 45 125Z"
          fill="#E7D5B0"
          stroke="#8B5A2B"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Island Terrain Highlights (Inland Greens & Paths) */}
        <path
          d="M70 120C65 95 90 80 130 75C180 70 230 65 280 75C330 85 370 95 385 125C370 150 320 155 260 150C200 145 150 165 105 155C80 145 72 135 70 120Z"
          fill="#D6C296"
          opacity="0.6"
        />

        {/* Small Coconut Tree Doodles */}
        <g transform="translate(60, 85) scale(0.5)">
          <path d="M10 20Q15 10 12 0" stroke="#8B5A2B" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M12 0Q5 -5 0 0M12 0Q18 -8 24 -2M12 0Q8 -10 12 -12M12 0Q18 2 22 8" stroke="#5F7F2E" strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>
        <g transform="translate(340, 120) scale(0.5)">
          <path d="M10 20Q8 10 12 0" stroke="#8B5A2B" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M12 0Q5 -5 0 0M12 0Q18 -8 24 -2M12 0Q8 -10 12 -12M12 0Q18 2 22 8" stroke="#5F7F2E" strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>

        {/* Connecting Trail between Sites */}
        <path
          d="M85 110C115 95 130 90 160 85C190 80 205 120 235 130C265 140 280 105 305 95C330 85 345 130 370 140"
          stroke="#C8922A"
          strokeWidth="3.5"
          strokeDasharray="6 6"
          strokeLinecap="round"
        />

        {/* Site Pins */}
        {SITES_DATA.map((site) => {
          const isActive = site.id === currentStage;
          const isCompleted = site.id < currentStage;

          return (
            <g
              key={site.id}
              transform={`translate(${site.x}, ${site.y})`}
              className="cursor-pointer transition-transform hover:scale-110"
              onClick={() => onSelectSite?.(site.id)}
            >
              {/* Active Pulsing Ripple */}
              {isActive && (
                <circle
                  cx="0"
                  cy="0"
                  r="18"
                  fill={site.color}
                  opacity="0.35"
                  className="animate-ping"
                />
              )}

              {/* Pin Shadow */}
              <ellipse cx="0" cy="8" rx="8" ry="3.5" fill="#3A2412" opacity="0.25" />

              {/* Pin Base / Badge */}
              <circle
                cx="0"
                cy="0"
                r={isActive ? "14" : "11"}
                fill={isCompleted ? "#1B7F4A" : isActive ? site.color : "#FFFDF7"}
                stroke="#3A2412"
                strokeWidth={isActive ? "3" : "2.2"}
              />

              {/* Pin Number or Checkmark */}
              {isCompleted ? (
                <path
                  d="M-4 0L-1 3L5 -3"
                  stroke="#FFFDF7"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fill={isActive ? "#FFFDF7" : "#3A2412"}
                  fontFamily="Space Mono, monospace"
                  fontWeight="bold"
                  fontSize={isActive ? "11" : "9"}
                >
                  {site.id}
                </text>
              )}

              {/* Site Name Tooltip / Label */}
              {!compact && (
                <g transform="translate(0, 22)">
                  <rect
                    x={-site.name.length * 3.3}
                    y="-8"
                    width={site.name.length * 6.6}
                    height="16"
                    rx="4"
                    fill="#FFFDF7"
                    stroke="#3A2412"
                    strokeWidth="1.2"
                    className="shadow-sm"
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fill="#3A2412"
                    fontFamily="Nunito, sans-serif"
                    fontWeight={isActive ? "bold" : "600"}
                    fontSize="7.5"
                  >
                    {site.name.replace("Sultan Riau", "").trim()}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Stage Badge in Corner */}
      <div className="absolute top-2 left-2 px-3 py-1 bg-kertas-putih/95 border-2 border-tinta rounded-xl shadow-stiker-sm flex items-center gap-1.5 z-20">
        <span className="w-2.5 h-2.5 rounded-full bg-kuning animate-pulse" />
        <span className="font-label text-xs font-bold text-tinta">
          Stage {currentStage}/5: {SITES_DATA[currentStage - 1]?.name}
        </span>
      </div>
    </div>
  );
};
