import React from "react";
import { SiteHeritageCard } from "../ui/SiteHeritageCard";
import { StickerButton } from "../ui/StickerButton";
import { PaperCard } from "../ui/PaperCard";
import { SITES_DATA } from "../assets/PulauPenyengatMap";
import { Trophy, Sparkles, ArrowRight } from "lucide-react";

interface StageSummaryProps {
  stageId: number; // 1 to 5
  stageScore: number;
  totalScore: number;
  currentRank: number;
  totalPlayers: number;
  onNextStage: () => void;
  lang: "id" | "en";
}

export const StageSummary: React.FC<StageSummaryProps> = ({
  stageId = 1,
  stageScore = 1750,
  totalScore = 4250,
  currentRank = 3,
  totalPlayers = 8,
  onNextStage,
  lang,
}) => {
  const site = SITES_DATA[stageId - 1] || SITES_DATA[0];
  const isFinalStage = stageId === 5;

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-between min-h-[100dvh] p-4 sm:p-5 pb-safe">
      {/* Top Badge */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-label text-xs font-bold text-tinta bg-kuning px-3 py-1 rounded-full border border-tinta shadow-stiker-sm">
          Stage {stageId}/5 Selesai ✓
        </span>

        <div className="flex items-center gap-1.5 font-display font-extrabold text-sm text-tinta">
          <Trophy className="w-4 h-4 text-emas" />
          <span>
            {lang === "id"
              ? `Peringkat: ${currentRank} dari ${totalPlayers}`
              : `Rank: ${currentRank} of ${totalPlayers}`}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="my-auto w-full flex flex-col items-center gap-3">
        {/* Heritage Card with 3D Flip */}
        <div className="w-full flex justify-center">
          <SiteHeritageCard siteId={stageId} lang={lang} />
        </div>

        {/* Stage & Total Score Paper Slip */}
        <PaperCard variant="kraft" className="w-full p-4 flex items-center justify-around text-center">
          <div>
            <span className="font-label text-[11px] font-bold text-coklat uppercase tracking-wider block">
              {lang === "id" ? "POIN STAGE" : "STAGE PTS"}
            </span>
            <span className="font-display font-black text-2xl text-benar">
              +{stageScore.toLocaleString()}
            </span>
          </div>

          <div className="w-px h-10 bg-tinta/20" />

          <div>
            <span className="font-label text-[11px] font-bold text-coklat uppercase tracking-wider block">
              {lang === "id" ? "TOTAL SKOR" : "TOTAL SCORE"}
            </span>
            <span className="font-display font-black text-2xl text-tinta">
              {totalScore.toLocaleString()}
            </span>
          </div>
        </PaperCard>
      </div>

      {/* Next Button */}
      <div className="w-full pt-3">
        <StickerButton
          variant="primary"
          size="lg"
          className="w-full text-xl flex items-center justify-center gap-2"
          onClick={onNextStage}
        >
          <span>
            {isFinalStage
              ? lang === "id"
                ? "Lihat Podium Juara! 🏆"
                : "View Final Podium! 🏆"
              : lang === "id"
              ? "Lanjut ke Stage Berikutnya ➔"
              : "Next Heritage Site ➔"}
          </span>
          <ArrowRight className="w-5 h-5" />
        </StickerButton>
      </div>
    </div>
  );
};
