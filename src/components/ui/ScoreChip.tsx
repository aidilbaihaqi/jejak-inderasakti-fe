import React from "react";
import { Sparkles, Flame } from "lucide-react";

interface ScoreChipProps {
  score: number;
  flyScore?: number | null;
  streak?: number;
  className?: string;
}

export const ScoreChip: React.FC<ScoreChipProps> = ({
  score,
  flyScore,
  streak = 0,
  className = "",
}) => {
  return (
    <div className={`relative inline-flex items-center gap-2 ${className}`}>
      {/* Flying +Points Popup */}
      {flyScore && (
        <div className="absolute -top-7 right-2 px-2.5 py-0.5 bg-[#FFE58A] text-benar border-2 border-benar rounded-full font-display font-extrabold text-sm animate-fly-score z-30 shadow-md">
          +{flyScore.toLocaleString()}
        </div>
      )}

      {/* Streak Badge if >= 2 */}
      {streak >= 2 && (
        <div className="px-2.5 py-1 bg-salah text-white border-2 border-tinta rounded-xl font-display font-black text-xs flex items-center gap-1 shadow-stiker-sm animate-bounce">
          <Flame className="w-3.5 h-3.5 fill-white text-white" />
          <span>×{streak}</span>
        </div>
      )}

      {/* Main Score Chip */}
      <div className="px-3.5 py-1.5 bg-kuning text-tinta border-2 border-tinta rounded-2xl font-display font-black text-base flex items-center gap-1.5 shadow-stiker-sm">
        <Sparkles className="w-4 h-4 text-coklat" />
        <span>{score.toLocaleString()}</span>
      </div>
    </div>
  );
};
