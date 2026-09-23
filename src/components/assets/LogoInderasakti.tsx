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
        className={`relative inline-flex items-center justify-center rounded-2xl overflow-hidden border-2 border-tinta shadow-stiker-sm bg-[#B44C33] flex-shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src="/logo.webp"
          alt="Penyengat Quest Logo"
          className="w-full h-full object-cover select-none"
        />
      </div>
    );
  }

  if (variant === "horizontal") {
    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        <div className="w-11 h-11 rounded-xl overflow-hidden border-2 border-tinta shadow-stiker-sm bg-[#B44C33] flex items-center justify-center flex-shrink-0">
          <img
            src="/logo.webp"
            alt="Penyengat Quest Logo"
            className="w-full h-full object-cover select-none"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-display font-black text-xl leading-none text-tinta tracking-wide">
            JEJAK INDERASAKTI
          </span>
          <span className="font-label text-[10px] text-coklat font-bold tracking-wider uppercase mt-0.5">
            Penyengat Quest ✦ Pulau Penyengat
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
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-kraft border border-tinta opacity-90 rotate-[-3deg] z-10 shadow-xs" />
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-3 border-tinta shadow-stiker bg-[#B44C33] flex items-center justify-center">
          <img
            src="/logo.webp"
            alt="Penyengat Quest Logo"
            className="w-full h-full object-cover select-none"
          />
        </div>
      </div>

      {/* Main Title */}
      <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-tinta tracking-tight drop-shadow-[1px_1px_0px_#FFC629]">
        JEJAK INDERASAKTI
      </h1>

      {/* Ribbon / Pill Subtitle */}
      <div className="mt-1 px-4 py-0.5 bg-kraft text-tinta font-label font-bold text-xs uppercase tracking-widest border border-tinta rounded-full shadow-stiker-sm">
        Penyengat Quest ✦ Kuis Budaya
      </div>
    </div>
  );
};
