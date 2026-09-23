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
    <div className="w-full max-w-md mx-auto flex flex-col justify-between h-full max-h-full p-2.5 sm:p-3 min-h-0 overflow-hidden pb-safe">
      {/* Header Badge with 5 Stage Dots */}
      <div className="flex items-center justify-between mb-1 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-emas" />
          <span className="font-display font-black text-sm sm:text-base text-tinta">
            PETA JELAJAH PULAU
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-kertas-putih px-2.5 py-0.5 rounded-full border-2 border-tinta shadow-stiker-sm">
          <span className="font-label text-xs font-bold text-tinta">
            Stage {currentStage}/5
          </span>
          <div className="flex items-center gap-1 pl-1 border-l border-tinta/30">
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                className={`w-2 h-2 rounded-full border border-tinta/40 transition-all ${
                  s === currentStage
                    ? "bg-kuning scale-125 border-tinta"
                    : s < currentStage
                    ? "bg-benar"
                    : "bg-kraft/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Map Component */}
      <div className="my-auto w-full space-y-1.5 sm:space-y-2">
        <PulauPenyengatMap currentStage={currentStage} />

        {/* Current Destination Card with Authentic Site Photo */}
        <PaperCard
          variant="memo"
          washiTape
          washiTapeColor={currentSite.color}
          washiTapeText={`TUJUAN #${currentStage}`}
          className="p-2.5 sm:p-3"
        >
          <div className="flex flex-col gap-1.5">
            {/* Site Image Thumbnail */}
            <div className="w-full h-18 sm:h-22 rounded-xl overflow-hidden border-2 border-tinta bg-kertas relative flex items-center justify-center shadow-xs">
              <img
                src={currentSite.image}
                alt={currentSite.name}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md border border-tinta font-label font-black text-[9px] text-white shadow-xs"
                style={{ backgroundColor: currentSite.color }}
              >
                Stage {currentStage}/5
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border-2 border-tinta flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5"
                style={{ backgroundColor: currentSite.color }}
              >
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[2.5]" />
              </div>

              <div className="flex-1 min-w-0">
                <span className="font-label text-[9px] font-bold uppercase tracking-wider text-coklat block">
                  {lang === "id" ? "SITUS BERIKUTNYA" : "NEXT HERITAGE SITE"}
                </span>
                <h3 className="font-display font-black text-base sm:text-lg text-tinta leading-tight truncate">
                  {lang === "id" ? currentSite.name : currentSite.nameEn}
                </h3>
                <p className="font-body text-[11px] text-coklat font-semibold mt-0.5 line-clamp-2">
                  {currentSite.desc}
                </p>
              </div>
            </div>
          </div>
        </PaperCard>
      </div>

      {/* Action CTA */}
      <div className="w-full pt-1.5 flex-shrink-0">
        <StickerButton
          variant="primary"
          size="lg"
          className="w-full text-lg sm:text-xl flex items-center justify-center gap-2"
          onClick={onContinue}
        >
          <span>{lang === "id" ? "Masuki Situs ➔" : "Enter Site ➔"}</span>
        </StickerButton>
      </div>
    </div>
  );
};
