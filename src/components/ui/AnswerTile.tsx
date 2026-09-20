import React from "react";
import { getOptionMotif } from "../assets/MelayuMotifs";
import { Check, X } from "lucide-react";

export type AnswerState = "idle" | "selected" | "correct" | "wrong" | "reveal";

interface AnswerTileProps {
  optionKey: "A" | "B" | "C" | "D";
  text: string;
  state?: AnswerState;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const OPTION_THEMES = {
  A: {
    bg: "bg-[#FFC629]",
    hoverBg: "hover:bg-[#FFD147]",
    text: "text-tinta",
    badgeBg: "bg-[#3A2412]",
    badgeText: "text-[#FFC629]",
    motifColor: "#3A2412",
  },
  B: {
    bg: "bg-[#B4533A]",
    hoverBg: "hover:bg-[#C86045]",
    text: "text-white",
    badgeBg: "bg-white",
    badgeText: "text-[#B4533A]",
    motifColor: "#FFFFFF",
  },
  C: {
    bg: "bg-[#5F7F2E]",
    hoverBg: "hover:bg-[#6F9436]",
    text: "text-white",
    badgeBg: "bg-white",
    badgeText: "text-[#5F7F2E]",
    motifColor: "#FFFFFF",
  },
  D: {
    bg: "bg-[#2E7EA0]",
    hoverBg: "hover:bg-[#3693BB]",
    text: "text-white",
    badgeBg: "bg-white",
    badgeText: "text-[#2E7EA0]",
    motifColor: "#FFFFFF",
  },
};

export const AnswerTile: React.FC<AnswerTileProps> = ({
  optionKey,
  text,
  state = "idle",
  onClick,
  disabled = false,
  className = "",
}) => {
  const theme = OPTION_THEMES[optionKey];

  let stateClasses = `${theme.bg} ${theme.text} ${theme.hoverBg} shadow-stiker`;
  let badgeIcon = null;

  if (state === "selected") {
    stateClasses = "bg-[#FFE58A] text-tinta ring-4 ring-tinta scale-[0.98] shadow-stiker-sm";
  } else if (state === "correct") {
    stateClasses = "bg-benar text-white ring-4 ring-white shadow-stiker-lg animate-bounce";
    badgeIcon = <Check className="w-5 h-5 text-white stroke-[3]" />;
  } else if (state === "wrong") {
    stateClasses = "bg-salah text-white opacity-80 shadow-stiker-sm";
    badgeIcon = <X className="w-5 h-5 text-white stroke-[3]" />;
  } else if (state === "reveal") {
    stateClasses = "bg-benar text-white ring-4 ring-kuning shadow-stiker";
    badgeIcon = <Check className="w-5 h-5 text-white stroke-[3]" />;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || state !== "idle"}
      className={`relative w-full min-h-[64px] px-4 py-3.5 rounded-2xl border-3 border-tinta flex items-center justify-between gap-3 text-left transition-all btn-pressable select-none ${stateClasses} ${
        disabled && state === "idle" ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
    >
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        {/* Letter & Motif Badge */}
        <div
          className={`w-10 h-10 rounded-xl border-2 border-tinta flex items-center justify-center font-display font-extrabold text-lg flex-shrink-0 shadow-sm ${
            state === "correct" || state === "reveal"
              ? "bg-white text-benar"
              : state === "wrong"
              ? "bg-white text-salah"
              : `${theme.badgeBg} ${theme.badgeText}`
          }`}
        >
          {optionKey}
        </div>

        {/* Text of the Option */}
        <span className="font-body font-bold text-base sm:text-lg leading-snug flex-1 break-words">
          {text}
        </span>
      </div>

      {/* Right Side: Malay Motif or Result Icon */}
      <div className="flex items-center justify-center flex-shrink-0 ml-2">
        {badgeIcon ? (
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            {badgeIcon}
          </div>
        ) : (
          <div className="opacity-80">
            {getOptionMotif(optionKey, {
              size: 26,
              color: state === "selected" ? "#3A2412" : theme.motifColor,
            })}
          </div>
        )}
      </div>

      {/* Stamp Overlay for Correct Answer */}
      {state === "correct" && (
        <div className="absolute right-2 -top-3 px-3 py-0.5 bg-[#FFE58A] text-benar border-2 border-benar rounded-md font-display font-black text-xs uppercase tracking-wider animate-stamp-drop z-30 shadow-md">
          BENAR!
        </div>
      )}
    </button>
  );
};
