import React from "react";

interface LogoProps {
  variant?: "full" | "horizontal" | "badge";
  className?: string;
  size?: number;
}

export const LogoInderasakti: React.FC<LogoProps> = ({
  variant = "full",
  className = "",
  size = 64,
}) => {
  if (variant === "badge") {
    return (
      <div
        className={`relative inline-flex items-center justify-center p-2 rounded-2xl bg-kuning border-2 border-tinta shadow-stiker-sm ${className}`}
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Tanjak & Sun/Boat Motif */}
          <circle cx="24" cy="24" r="20" fill="#FFFDF7" stroke="#3A2412" strokeWidth="2.5" />
          <path
            d="M12 28C16 32 32 32 36 28L34 32C28 35 20 35 14 32L12 28Z"
            fill="#8B5A2B"
            stroke="#3A2412"
            strokeWidth="2"
          />
          <path
            d="M16 26L24 14L28 20L32 26C27 24 21 24 16 26Z"
            fill="#C8922A"
            stroke="#3A2412"
            strokeWidth="2"
          />
          <circle cx="24" cy="18" r="2.5" fill="#FFC629" />
          {/* Water wave under boat */}
          <path
            d="M10 36C14 34 18 38 22 36C26 34 30 38 34 36C36 35 38 36 40 37"
            stroke="#2E7EA0"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  if (variant === "horizontal") {
    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        <div className="w-11 h-11 rounded-xl bg-kuning border-2 border-tinta shadow-stiker-sm flex items-center justify-center p-1 flex-shrink-0">
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
            <circle cx="24" cy="24" r="20" fill="#FFFDF7" stroke="#3A2412" strokeWidth="2.5" />
            <path
              d="M14 27L24 14L29 21L34 27C28 25 20 25 14 27Z"
              fill="#C8922A"
              stroke="#3A2412"
              strokeWidth="2"
            />
            <path
              d="M12 29C17 33 31 33 36 29L34 33C28 36 20 36 14 33L12 29Z"
              fill="#8B5A2B"
              stroke="#3A2412"
              strokeWidth="2"
            />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-display font-black text-xl leading-none text-tinta tracking-wide">
            JEJAK INDERASAKTI
          </span>
          <span className="font-label text-[10px] text-coklat font-bold tracking-wider uppercase mt-0.5">
            Jelajah Pulau Penyengat
          </span>
        </div>
      </div>
    );
  }

  // Full / Stacked Logo
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {/* Emblem Badge with Washi Tape Effect */}
      <div className="relative mb-2">
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-kraft border border-tinta opacity-90 rotate-[-3deg] z-10" />
        <div className="w-20 h-20 rounded-3xl bg-kuning border-3 border-tinta shadow-stiker flex items-center justify-center p-2.5">
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
            <circle cx="24" cy="24" r="20" fill="#FFFDF7" stroke="#3A2412" strokeWidth="2.5" />
            {/* Tanjak & Pompong Boat Motif */}
            <path
              d="M13 27L24 13L30 20L35 27C29 25 19 25 13 27Z"
              fill="#C8922A"
              stroke="#3A2412"
              strokeWidth="2.2"
            />
            <circle cx="24" cy="18" r="2" fill="#FFC629" />
            <path
              d="M11 29C17 34 31 34 37 29L35 33C29 37 19 37 13 33L11 29Z"
              fill="#8B5A2B"
              stroke="#3A2412"
              strokeWidth="2.2"
            />
            <path
              d="M8 38C13 36 17 40 22 38C27 36 31 40 36 38C38 37 40 38 42 39"
              stroke="#2E7EA0"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Main Title */}
      <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-tinta tracking-tight drop-shadow-[1px_1px_0px_#FFC629]">
        JEJAK INDERASAKTI
      </h1>

      {/* Ribbon / Pill Subtitle */}
      <div className="mt-1 px-4 py-0.5 bg-kraft text-tinta font-label font-bold text-xs uppercase tracking-widest border border-tinta rounded-full shadow-stiker-sm">
        Jelajah Pulau Penyengat ✦ Kuis Budaya
      </div>
    </div>
  );
};
