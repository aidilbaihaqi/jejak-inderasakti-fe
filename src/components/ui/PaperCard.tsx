import React from "react";

interface PaperCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "memo" | "kraft" | "ticket" | "stamp" | "receipt";
  washiTape?: boolean;
  washiTapeColor?: string;
  washiTapeText?: string;
}

export const PaperCard: React.FC<PaperCardProps> = ({
  children,
  className = "",
  variant = "memo",
  washiTape = false,
  washiTapeColor = "#EAD7B0",
  washiTapeText,
}) => {
  let cardStyle =
    "relative rounded-3xl border-3 border-tinta shadow-stiker transition-all";

  switch (variant) {
    case "memo":
      cardStyle += " bg-kertas-putih text-tinta";
      break;
    case "kraft":
      cardStyle += " bg-kraft text-tinta";
      break;
    case "ticket":
      cardStyle += " bg-[#FFEBB3] text-tinta ticket-notch";
      break;
    case "stamp":
      cardStyle += " bg-kertas-putih text-tinta stamp-border";
      break;
    case "receipt":
      cardStyle += " bg-kertas-putih text-tinta receipt-zigzag pb-6";
      break;
  }

  return (
    <div className={`${cardStyle} ${className}`}>
      {/* Washi Tape Strip on Top */}
      {washiTape && (
        <div
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-sm border border-tinta/30 shadow-sm z-20 flex items-center justify-center font-label text-[10px] font-bold text-tinta tracking-wider uppercase rotate-[-1.5deg]"
          style={{ backgroundColor: washiTapeColor }}
        >
          {washiTapeText || "✦ JEJAK INDERASAKTI ✦"}
        </div>
      )}

      {children}
    </div>
  );
};
