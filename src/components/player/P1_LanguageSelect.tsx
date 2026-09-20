import React from "react";
import { LogoInderasakti } from "../assets/LogoInderasakti";
import { MascotSakti } from "../assets/MascotSakti";
import { StickerButton } from "../ui/StickerButton";
import { PaperCard } from "../ui/PaperCard";
import { Sparkles } from "lucide-react";

interface P1Props {
  selectedLang: "id" | "en";
  onSelectLang: (lang: "id" | "en") => void;
  onNext: () => void;
}

export const P1_LanguageSelect: React.FC<P1Props> = ({
  selectedLang,
  onSelectLang,
  onNext,
}) => {
  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-between min-h-[640px] p-5">
      {/* Top Logo */}
      <div className="w-full flex justify-center pt-2">
        <LogoInderasakti variant="full" />
      </div>

      {/* Mascot Sakti Waving */}
      <div className="my-auto flex flex-col items-center">
        <MascotSakti
          pose="waving"
          size={160}
          speechBubble={
            selectedLang === "id"
              ? "Hai penjelajah! Pilih bahasamu yuk!"
              : "Welcome explorer! Choose your language!"
          }
        />
      </div>

      {/* Language Selection Card */}
      <PaperCard variant="memo" washiTape washiTapeText="PILIH BAHASA / SELECT LANGUAGE" className="w-full p-5 mt-2">
        <div className="flex flex-col gap-3">
          {/* Bahasa Indonesia Option */}
          <button
            type="button"
            onClick={() => onSelectLang("id")}
            className={`w-full p-4 rounded-2xl border-3 border-tinta flex items-center justify-between transition-all btn-pressable ${
              selectedLang === "id"
                ? "bg-kuning shadow-stiker ring-2 ring-tinta"
                : "bg-kertas-putih hover:bg-kraft/40 shadow-stiker-sm"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🇮🇩</span>
              <div className="text-left">
                <div className="font-display font-black text-lg text-tinta leading-tight">
                  Bahasa Indonesia
                </div>
                <div className="font-body text-xs text-coklat font-semibold">
                  Jelajah dalam bahasa nasional
                </div>
              </div>
            </div>
            {selectedLang === "id" && (
              <Sparkles className="w-5 h-5 text-tinta" />
            )}
          </button>

          {/* English Option */}
          <button
            type="button"
            onClick={() => onSelectLang("en")}
            className={`w-full p-4 rounded-2xl border-3 border-tinta flex items-center justify-between transition-all btn-pressable ${
              selectedLang === "en"
                ? "bg-kuning shadow-stiker ring-2 ring-tinta"
                : "bg-kertas-putih hover:bg-kraft/40 shadow-stiker-sm"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🇬🇧</span>
              <div className="text-left">
                <div className="font-display font-black text-lg text-tinta leading-tight">
                  English
                </div>
                <div className="font-body text-xs text-coklat font-semibold">
                  Explore in international English
                </div>
              </div>
            </div>
            {selectedLang === "en" && (
              <Sparkles className="w-5 h-5 text-tinta" />
            )}
          </button>
        </div>

        {/* Next Button */}
        <div className="mt-5">
          <StickerButton
            variant="primary"
            size="lg"
            className="w-full text-xl"
            onClick={onNext}
          >
            {selectedLang === "id" ? "Mulai Petualangan ➔" : "Start Adventure ➔"}
          </StickerButton>
        </div>
      </PaperCard>
    </div>
  );
};
