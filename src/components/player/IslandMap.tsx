import React from "react";
import { PulauPenyengatMap, SITES_DATA } from "../assets/PulauPenyengatMap";
import { StickerButton } from "../ui/StickerButton";
import { PaperCard } from "../ui/PaperCard";
import { MapPin, ArrowRight, Compass } from "lucide-react";

interface IslandMapProps {
  currentStage: number; // 1 to 5
  onContinue: () => void;
  lang: "id" | "en";
}

export const IslandMap: React.FC<IslandMapProps> = ({
  currentStage = 1,
  onContinue,
  lang,
}) => {
  const currentSite = SITES_DATA[currentStage - 1] || SITES_DATA[0];

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-between min-h-[100dvh] p-4 sm:p-5 pb-safe">
      {/* Header Badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-emas" />
          <span className="font-display font-black text-lg text-tinta">
            PETA JELAJAH PULAU
          </span>
        </div>
        <span className="font-label text-xs font-bold text-tinta bg-kuning px-3 py-1 rounded-full border border-tinta shadow-stiker-sm">
          Stage {currentStage}/5
        </span>
      </div>

      {/* Main Interactive Map Component */}
      <div className="my-auto w-full space-y-4">
        <PulauPenyengatMap currentStage={currentStage} />

        {/* Current Destination Card */}
        <PaperCard
          variant="memo"
          washiTape
          washiTapeColor={currentSite.color}
          washiTapeText={`TUJUAN #${currentStage}`}
          className="p-5"
        >
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl border-2 border-tinta flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5"
              style={{ backgroundColor: currentSite.color }}
            >
              <MapPin className="w-6 h-6 text-white stroke-[2.5]" />
            </div>

            <div className="flex-1">
              <span className="font-label text-[10px] font-bold uppercase tracking-wider text-coklat">
                {lang === "id" ? "SITUS BERIKUTNYA" : "NEXT HERITAGE SITE"}
              </span>
              <h3 className="font-display font-black text-xl text-tinta leading-tight">
                {lang === "id" ? currentSite.name : currentSite.nameEn}
              </h3>
              <p className="font-body text-xs text-coklat font-semibold mt-1">
                {currentSite.desc}
              </p>
            </div>
          </div>
        </PaperCard>
      </div>

      {/* Action CTA */}
      <div className="w-full pt-4">
        <StickerButton
          variant="primary"
          size="lg"
          className="w-full text-xl flex items-center justify-center gap-2"
          onClick={onContinue}
        >
          <span>{lang === "id" ? "Masuki Situs ➔" : "Enter Site ➔"}</span>
        </StickerButton>
      </div>
    </div>
  );
};
