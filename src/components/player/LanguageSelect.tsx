import React from "react";
import { LogoInderasakti } from "../assets/LogoInderasakti";
import { MascotSakti } from "../assets/MascotSakti";
import { StickerButton } from "../ui/StickerButton";
import { PaperCard } from "../ui/PaperCard";
import { Sparkles } from "lucide-react";

interface LanguageSelectProps {
  selectedLang: "id" | "en";
  onSelectLang: (lang: "id" | "en") => void;
  onNext: () => void;
}

export const LanguageSelect: React.FC<LanguageSelectProps> = ({
  selectedLang,
  onSelectLang,
  onNext,
}) => {
  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-between h-full max-h-full p-2.5 sm:p-4 min-h-0 overflow-hidden pb-safe">
      {/* Top Logo */}
      <div className="w-full flex justify-center pt-0.5">
        <LogoInderasakti variant="full" />
      </div>

      {/* Mascot Sakti Waving */}
      <div className="my-auto py-1 flex flex-col items-center">
        <MascotSakti
          pose="waving"
          size={95}
          speechBubble={
            selectedLang === "id"
              ? "Hai penjelajah! Pilih bahasamu yuk!"
              : "Welcome explorer! Choose your language!"
          }
        />
      </div>

      {/* Language Selection Card */}
      <PaperCard variant="memo" washiTape washiTapeText="PILIH BAHASA / SELECT LANGUAGE" className="w-full p-3 sm:p-4 mt-1">
        <div className="flex flex-col gap-2 sm:gap-2.5">
          {/* Bahasa Indonesia Option */}
          <button
            type="button"
            onClick={() => onSelectLang("id")}
            className={`w-full p-2.5 sm:p-3 rounded-2xl border-2 sm:border-3 border-tinta flex items-center justify-between transition-all btn-pressable ${
              selectedLang === "id"
                ? "bg-kuning shadow-stiker ring-2 ring-tinta"
                : "bg-kertas-putih hover:bg-kraft/40 shadow-stiker-sm"
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Indonesia SVG Flag */}
              <div className="w-8 h-6 rounded-lg overflow-hidden border-2 border-tinta shadow-stiker-sm flex flex-col flex-shrink-0">
                <div className="w-full h-1/2 bg-[#E70011]" />
                <div className="w-full h-1/2 bg-white" />
              </div>
              <div className="text-left">
                <div className="font-display font-black text-lg text-tinta leading-tight flex items-center gap-1.5">
                  <span>Bahasa Indonesia</span>
                  <span className="font-label text-[10px] px-1.5 py-0.5 rounded bg-kraft/80 border border-tinta/40 font-bold text-tinta">
                    ID
                  </span>
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
            className={`w-full p-2.5 sm:p-3 rounded-2xl border-2 sm:border-3 border-tinta flex items-center justify-between transition-all btn-pressable ${
              selectedLang === "en"
                ? "bg-kuning shadow-stiker ring-2 ring-tinta"
                : "bg-kertas-putih hover:bg-kraft/40 shadow-stiker-sm"
            }`}
          >
            <div className="flex items-center gap-3">
              {/* UK SVG Flag */}
              <div className="w-8 h-6 rounded-lg overflow-hidden border-2 border-tinta shadow-stiker-sm flex-shrink-0 relative bg-[#012169]">
                <svg viewBox="0 0 60 36" className="w-full h-full block" preserveAspectRatio="none">
                  <path d="M0,0 L60,36 M60,0 L0,36" stroke="#ffffff" strokeWidth="6" />
                  <path d="M0,0 L60,36 M60,0 L0,36" stroke="#C8102E" strokeWidth="2.5" />
                  <path d="M30,0 v36 M0,18 h60" stroke="#ffffff" strokeWidth="10" />
                  <path d="M30,0 v36 M0,18 h60" stroke="#C8102E" strokeWidth="6" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-display font-black text-lg text-tinta leading-tight flex items-center gap-1.5">
                  <span>English</span>
                  <span className="font-label text-[10px] px-1.5 py-0.5 rounded bg-kraft/80 border border-tinta/40 font-bold text-tinta">
                    EN
                  </span>
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
        <div className="mt-3 sm:mt-4">
          <StickerButton
            variant="primary"
            size="md"
            className="w-full text-lg sm:text-xl py-2.5 sm:py-3"
            onClick={onNext}
          >
            {selectedLang === "id" ? "Mulai Petualangan ➔" : "Start Adventure ➔"}
          </StickerButton>
        </div>
      </PaperCard>
    </div>
  );
};
