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
  layout?: "grid" | "list";
}

const OPTION_THEMES = {
  A: {
    bg: "bg-[#FFC629]",
    hoverBg: "hover:bg-[#FFD147]",
    text: "text-[#3A2412]",
    badgeBg: "bg-[#3A2412]",
    badgeText: "text-[#FFC629]",
    shadow: "shadow-[0_5px_0_#3A2412]",
    activeShadow: "active:shadow-[0_1px_0_#3A2412]",
    motifColor: "#3A2412",
  },
  B: {
    bg: "bg-[#B4533A]",
    hoverBg: "hover:bg-[#C86045]",
    text: "text-white",
    badgeBg: "bg-white",
    badgeText: "text-[#B4533A]",
    shadow: "shadow-[0_5px_0_#3A2412]",
    activeShadow: "active:shadow-[0_1px_0_#3A2412]",
    motifColor: "#FFFFFF",
  },
  C: {
    bg: "bg-[#2F7D4F]",
    hoverBg: "hover:bg-[#3B9660]",
    text: "text-white",
    badgeBg: "bg-white",
    badgeText: "text-[#2F7D4F]",
    shadow: "shadow-[0_5px_0_#3A2412]",
    activeShadow: "active:shadow-[0_1px_0_#3A2412]",
    motifColor: "#FFFFFF",
  },
  D: {
    bg: "bg-[#2E7EA0]",
    hoverBg: "hover:bg-[#3693BB]",
    text: "text-white",
    badgeBg: "bg-white",
    badgeText: "text-[#2E7EA0]",
    shadow: "shadow-[0_5px_0_#3A2412]",
    activeShadow: "active:shadow-[0_1px_0_#3A2412]",
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
  layout = "list",
}) => {
  const theme = OPTION_THEMES[optionKey];

  let stateClasses = `${theme.bg} ${theme.text} ${theme.hoverBg} ${theme.shadow} ${theme.activeShadow}`;
  let badgeIcon = null;

  if (state === "selected") {
    stateClasses = "bg-[#FFE58A] text-[#3A2412] ring-4 ring-[#3A2412] translate-y-1 shadow-[0_2px_0_#3A2412]";
  } else if (state === "correct") {
    stateClasses = "bg-benar text-white ring-4 ring-white shadow-[0_6px_0_#0D502E] animate-bounce";
    badgeIcon = <Check className="w-5 h-5 text-white stroke-[3.5]" />;
  } else if (state === "wrong") {
    stateClasses = "bg-salah text-white opacity-80 shadow-[0_2px_0_#3A2412] translate-y-1";
    badgeIcon = <X className="w-5 h-5 text-white stroke-[3.5]" />;
  } else if (state === "reveal") {
    stateClasses = "bg-benar text-white ring-4 ring-[#FFC629] shadow-[0_5px_0_#0D502E]";
    badgeIcon = <Check className="w-5 h-5 text-white stroke-[3.5]" />;
  }

  const isGrid = layout === "grid";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || state !== "idle"}
      className={`relative w-full rounded-2xl border-3 border-tinta transition-all select-none active:translate-y-1 ${
        isGrid
          ? "min-h-[100px] sm:min-h-[110px] p-3.5 flex flex-col justify-between"
          : "min-h-[60px] sm:min-h-[68px] px-4 py-3 flex items-center justify-between gap-3"
      } ${stateClasses} ${
        disabled && state === "idle" ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
    >
      {/* Top row in grid or Left side in list */}
      <div className={`flex items-center gap-3 ${isGrid ? "w-full justify-between" : "flex-1 min-w-0"}`}>
        {/* Letter Badge with Quizizz Chunky Style */}
        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border-2 border-tinta flex items-center justify-center font-display font-black text-base sm:text-lg flex-shrink-0 shadow-xs ${
            state === "correct" || state === "reveal"
              ? "bg-white text-benar"
              : state === "wrong"
              ? "bg-white text-salah"
              : `${theme.badgeBg} ${theme.badgeText}`
          }`}
        >
          {optionKey}
        </div>

        {/* In grid layout, motif is at top-right */}
        {isGrid && (
          <div className="flex items-center justify-center">
            {badgeIcon ? (
              <div className="w-8 h-8 rounded-full bg-white/25 flex items-center justify-center">
                {badgeIcon}
              </div>
            ) : (
              <div className="opacity-90">
                {getOptionMotif(optionKey, {
                  size: 24,
                  color: state === "selected" ? "#3A2412" : theme.motifColor,
                })}
              </div>
            )}
          </div>
        )}

        {/* Text in list mode */}
        {!isGrid && (
          <span className="font-body font-extrabold text-sm sm:text-base leading-snug flex-1 break-words">
            {text}
          </span>
        )}
      </div>

      {/* Text in grid mode */}
      {isGrid && (
        <div className="w-full text-left mt-2">
          <span className="font-body font-extrabold text-sm sm:text-base leading-snug break-words line-clamp-2">
            {text}
          </span>
        </div>
      )}

      {/* Motif in list mode */}
      {!isGrid && (
        <div className="flex items-center justify-center flex-shrink-0 ml-1">
          {badgeIcon ? (
            <div className="w-8 h-8 rounded-full bg-white/25 flex items-center justify-center">
              {badgeIcon}
            </div>
          ) : (
            <div className="opacity-90">
              {getOptionMotif(optionKey, {
                size: 24,
                color: state === "selected" ? "#3A2412" : theme.motifColor,
              })}
            </div>
          )}
        </div>
      )}

      {/* Stamp Overlay for Correct Answer */}
      {state === "correct" && (
        <div className="absolute right-2 -top-3.5 px-3 py-0.5 bg-[#FFE58A] text-benar border-2 border-benar rounded-lg font-display font-black text-xs uppercase tracking-wider animate-stamp-drop z-30 shadow-md">
          BENAR!
        </div>
      )}
    </button>
  );
};
