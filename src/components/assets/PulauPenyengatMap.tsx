import React from "react";
import { Check, MapPin, Sparkles, Lock } from "lucide-react";

export interface SiteLocation {
  id: number;
  name: string;
  nameEn: string;
  x: number; // percentage X position on /peta.webp
  y: number; // percentage Y position on /peta.webp
  color: string;
  desc: string;
  image: string;
}

export const SITES_DATA: SiteLocation[] = [
  {
    id: 1,
    name: "Masjid Raya Sultan Riau",
    nameEn: "Sultan Riau Grand Mosque",
    x: 18,
    y: 86,
    color: "#2F7D4F",
    desc: "Masjid bersejarah berkubah kuning-hijau dibangun dengan perekat putih telur.",
    image: "/situs/masjid raya.webp",
  },
  {
    id: 2,
    name: "Makam Engku Putri & Raja Ali Haji",
    nameEn: "Tomb of Engku Putri & Raja Ali Haji",
    x: 35,
    y: 67,
    color: "#9A6B12",
    desc: "Kompleks pemakaman sastrawan Melayu penggubah Gurindam 12 & permaisuri kesultanan.",
    image: "/situs/kompleks makam raja Ali haji.webp",
  },
  {
    id: 3,
    name: "Istana Kantor",
    nameEn: "Kantor Palace (Raja Ali Marhum Kantor)",
    x: 58,
    y: 56,
    color: "#B4533A",
    desc: "Kediaman dan pusat administrasi Yang Dipertuan Muda Riau VIII.",
    image: "/situs/Istana Kantor.webp",
  },
  {
    id: 4,
    name: "Gedung Tabib",
    nameEn: "Physician's House",
    x: 77,
    y: 38,
    color: "#5F7F2E",
    desc: "Reruntuhan kediaman tabib kerajaan yang dikelilingi rimbun tanaman obat.",
    image: "/situs/Gedung Tabib (1).webp",
  },
  {
    id: 5,
    name: "Perigi Puteri",
    nameEn: "The Princess Well",
    x: 84,
    y: 14,
    color: "#2E7EA0",
    desc: "Mata air tawar jernih yang tak pernah kering di tepi pesisir pulau.",
    image: "/situs/perigi puteri.webp",
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
  const activeSite = SITES_DATA[currentStage - 1] || SITES_DATA[0];

  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl border-3 border-tinta bg-[#0C3042] shadow-stiker select-none ${className}`}
    >
      {/* Base Illustrated Map Graphic */}
      <img
        src="/peta.webp"
        alt="Peta Pulau Penyengat — Jejak Inderasakti"
        className="w-full h-auto block object-cover select-none pointer-events-none"
      />

      {/* Fold Overlay Effects */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 z-10" />

      {/* Dynamic Interactive Stage Markers overlaid on peta.webp */}
      <div className="absolute inset-0 z-20">
        {SITES_DATA.map((site) => {
          const isPassed = site.id < currentStage;
          const isActive = site.id === currentStage;
          const isUpcoming = site.id > currentStage;

          return (
            <div
              key={site.id}
              onClick={() => onSelectSite?.(site.id)}
              style={{ left: `${site.x}%`, top: `${site.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group flex flex-col items-center"
            >
              {/* Active Pulse Animation Rings */}
              {isActive && (
                <>
                  <span className="absolute -inset-3 rounded-full bg-kuning/50 animate-ping pointer-events-none" />
                  <span className="absolute -inset-1.5 rounded-full bg-emas/70 animate-pulse pointer-events-none" />
                </>
              )}

              {/* Pin Center Marker */}
              <div
                className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-tinta flex items-center justify-center font-display font-black text-xs transition-transform duration-200 group-hover:scale-110 shadow-stiker-sm ${
                  isActive
                    ? "bg-kuning text-tinta scale-110 ring-3 ring-white ring-offset-1 ring-offset-tinta"
                    : isPassed
                    ? "bg-benar text-white"
                    : "bg-kraft/90 text-tinta/80 opacity-85"
                }`}
              >
                {isPassed ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : isActive ? (
                  <MapPin className="w-4 h-4 fill-tinta text-tinta animate-bounce" />
                ) : (
                  <span className="font-label text-[11px] font-bold">{site.id}</span>
                )}
              </div>

              {/* Status Tooltip Badges */}
              {isActive && (
                <div className="absolute -top-7 whitespace-nowrap bg-kuning text-tinta font-label font-black text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full border border-tinta shadow-stiker-sm flex items-center gap-1 animate-bounce">
                  <span className="w-1.5 h-1.5 rounded-full bg-benar animate-pulse" />
                  <span>Kamu Disini!</span>
                </div>
              )}

              {isPassed && !compact && (
                <div className="absolute -bottom-5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-benar text-white font-label font-bold text-[9px] px-1.5 py-0.5 rounded-md border border-tinta shadow-xs pointer-events-none">
                  ✓ Selesai
                </div>
              )}

              {isUpcoming && !compact && (
                <div className="absolute -bottom-5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-kertas-putih text-coklat font-label font-bold text-[9px] px-1.5 py-0.5 rounded-md border border-tinta shadow-xs pointer-events-none">
                  Stage {site.id}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Header Progress Slip */}
      <div className="absolute top-2.5 left-2.5 right-2.5 sm:right-auto px-3 py-1.5 bg-kertas-putih/95 border-2 border-tinta rounded-xl shadow-stiker-sm flex items-center justify-between sm:justify-start gap-2 z-20 backdrop-blur-xs">
        <div className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full border border-tinta animate-pulse"
            style={{ backgroundColor: activeSite.color }}
          />
          <span className="font-label text-xs font-bold text-tinta">
            Stage {currentStage}/5: <strong className="font-display font-extrabold">{activeSite.name}</strong>
          </span>
        </div>

        <div className="flex items-center gap-1 pl-1">
          {SITES_DATA.map((s) => (
            <span
              key={s.id}
              className={`w-2 h-2 rounded-full border border-tinta/40 transition-all ${
                s.id === currentStage
                  ? "bg-kuning scale-125 border-tinta"
                  : s.id < currentStage
                  ? "bg-benar"
                  : "bg-kraft/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
