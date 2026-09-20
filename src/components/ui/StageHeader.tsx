import React from "react";
import { Volume2, VolumeX, Globe } from "lucide-react";

interface StageHeaderProps {
  siteName: string;
  siteColor?: string;
  stageNumber: number; // 1-5
  questionNumber: number; // 1-3
  totalQuestions?: number;
  isMuted?: boolean;
  onToggleMute?: () => void;
  lang?: "id" | "en";
  onToggleLang?: () => void;
  className?: string;
}

export const StageHeader: React.FC<StageHeaderProps> = ({
  siteName,
  siteColor = "#2F7D4F",
  stageNumber = 1,
  questionNumber = 1,
  totalQuestions = 3,
  isMuted = false,
  onToggleMute,
  lang = "id",
  onToggleLang,
  className = "",
}) => {
  return (
    <header
      className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl border-2 border-tinta bg-kertas-putih shadow-stiker-sm ${className}`}
    >
      {/* Left: Site Color Tag & Name */}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <span
          className="w-4 h-4 rounded-md border-2 border-tinta flex-shrink-0 shadow-xs"
          style={{ backgroundColor: siteColor }}
        />
        <div className="flex flex-col min-w-0">
          <span className="font-display font-black text-sm sm:text-base text-tinta truncate">
            {siteName}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-label text-[11px] text-coklat font-bold tracking-tight">
              [ Stage {stageNumber}/5 ]
            </span>
            <span className="font-label text-[11px] text-tinta font-bold bg-kraft/70 px-1.5 py-0.2 rounded border border-tinta/40">
              {lang === "id" ? `Soal ${questionNumber}/${totalQuestions}` : `Q ${questionNumber}/${totalQuestions}`}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Audio & Language Controls */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {onToggleLang && (
          <button
            type="button"
            onClick={onToggleLang}
            className="px-2 py-1 bg-kraft hover:bg-kraft/80 border border-tinta rounded-lg font-label text-xs font-bold text-tinta flex items-center gap-1 btn-pressable shadow-xs"
            title="Ganti Bahasa / Switch Language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang.toUpperCase()}</span>
          </button>
        )}

        {onToggleMute && (
          <button
            type="button"
            onClick={onToggleMute}
            className="w-8 h-8 rounded-lg border border-tinta bg-kertas-putih hover:bg-kraft/40 flex items-center justify-center text-tinta btn-pressable shadow-xs"
            title={isMuted ? "Aktifkan Suara" : "Bisukan Suara"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-coklat" />
            ) : (
              <Volume2 className="w-4 h-4 text-tinta" />
            )}
          </button>
        )}
      </div>
    </header>
  );
};
