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
    x: 22.0,
    y: 89.5,
    color: "#2F7D4F",
    desc: "Masjid bersejarah berkubah kuning-hijau dibangun dengan perekat putih telur.",
    image: "/situs/masjid raya.webp",
  },
  {
    id: 2,
    name: "Makam Engku Putri & Raja Ali Haji",
    nameEn: "Tomb of Engku Putri & Raja Ali Haji",
    x: 36.8,
    y: 68.3,
    color: "#9A6B12",
    desc: "Kompleks pemakaman sastrawan Melayu penggubah Gurindam 12 & permaisuri kesultanan.",
    image: "/situs/kompleks makam raja Ali haji.webp",
  },
  {
    id: 3,
    name: "Istana Kantor",
    nameEn: "Kantor Palace (Raja Ali Marhum Kantor)",
    x: 61.8,
    y: 57.2,
    color: "#B4533A",
    desc: "Kediaman dan pusat administrasi Yang Dipertuan Muda Riau VIII.",
    image: "/situs/Istana Kantor.webp",
  },
  {
    id: 4,
    name: "Gedung Tabib",
    nameEn: "Physician's House",
    x: 77.8,
    y: 38.6,
    color: "#5F7F2E",
    desc: "Reruntuhan kediaman tabib kerajaan yang dikelilingi rimbun tanaman obat.",
    image: "/situs/Gedung Tabib (1).webp",
  },
  {
    id: 5,
    name: "Perigi Puteri",
    nameEn: "The Princess Well",
    x: 78.2,
    y: 11.8,
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
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-black/10 z-10" />

      {/* Dynamic Interactive Stage Markers overlaid on trail dots */}
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
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group flex flex-col items-center p-2"
              title={`${site.id}. ${site.name}`}
            >
              {/* Active Stage Indicator on Trail Dot */}
              {isActive && (
                <div className="relative flex items-center justify-center">
                  <span className="absolute -inset-1.5 rounded-full bg-kuning/60 animate-ping pointer-events-none" />
                  <div className="relative w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-kuning border-2 border-tinta flex items-center justify-center shadow-stiker-sm ring-2 ring-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-tinta" />
                  </div>
                </div>
              )}

              {/* Passed Stage Indicator */}
              {isPassed && (
                <div className="relative w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-benar border border-tinta flex items-center justify-center shadow-xs">
                  <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                </div>
              )}

              {/* Upcoming Stage Dot */}
              {isUpcoming && (
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white/70 border border-tinta/50 opacity-60 group-hover:scale-125 transition-transform" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
