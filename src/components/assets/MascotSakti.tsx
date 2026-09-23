import React from "react";

export type MascotPose =
  | "waving"
  | "thinking"
  | "pointing"
  | "cheering"
  | "encouraging"
  | "trophy";

interface MascotSaktiProps {
  pose?: MascotPose;
  className?: string;
  size?: number;
  speechBubble?: string;
}

const MASCOT_IMAGES: Record<MascotPose, { src: string; alt: string }> = {
  waving: {
    src: "/maskot/maskot1.webp",
    alt: "Sakti Melambai",
  },
  thinking: {
    src: "/maskot/maskot2.webp",
    alt: "Sakti Menyimak",
  },
  pointing: {
    src: "/maskot/maskot2.webp",
    alt: "Sakti Menjelaskan",
  },
  encouraging: {
    src: "/maskot/maskot2.webp",
    alt: "Sakti Menyemangati",
  },
  cheering: {
    src: "/maskot/maskot3.webp",
    alt: "Sakti Bersorak",
  },
  trophy: {
    src: "/maskot/maskot3.webp",
    alt: "Sakti Juara",
  },
};

export const MascotSakti: React.FC<MascotSaktiProps> = ({
  pose = "waving",
  className = "",
  size = 140,
  speechBubble,
}) => {
  const current = MASCOT_IMAGES[pose] || MASCOT_IMAGES.waving;

  return (
    <div
      className={`relative inline-flex flex-col items-center select-none ${className}`}
    >
      {/* Optional Speech Bubble */}
      {speechBubble && (
        <div className="relative mb-2 px-3.5 py-1.5 bg-kertas-putih text-tinta border-2 border-tinta rounded-xl shadow-stiker-sm text-xs font-bold font-body animate-float-slow max-w-[220px] text-center z-10">
          {speechBubble}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-tinta" />
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-kertas-putih" />
        </div>
      )}

      {/* Mascot Graphic Image from /maskot/ */}
      <div
        style={{ width: size, height: size }}
        className="relative flex items-center justify-center filter drop-shadow-[0_6px_10px_rgba(58,36,18,0.22)] transition-transform duration-200 hover:scale-105"
      >
        <img
          src={current.src}
          alt={current.alt}
          style={{ width: size, height: size }}
          className="object-contain select-none pointer-events-none"
        />

        {/* Golden Trophy Badge if trophy pose */}
        {pose === "trophy" && (
          <div className="absolute -bottom-1 -right-1 bg-kuning text-tinta p-1.5 rounded-full border-2 border-tinta shadow-stiker-sm animate-bounce text-sm">
            🏆
          </div>
        )}
      </div>
    </div>
  );
};
