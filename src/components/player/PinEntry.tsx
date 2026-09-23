import React, { useState } from "react";
import { PaperCard } from "../ui/PaperCard";
import { PinInput } from "../ui/PinInput";
import { StickerButton } from "../ui/StickerButton";
import { ArrowLeft, QrCode, Ticket, Sparkles, Loader2 } from "lucide-react";

interface PinEntryProps {
  pin: string;
  onChangePin: (pin: string) => void;
  onEnterRoom: () => void;
  onBack: () => void;
  lang: "id" | "en";
  onToggleLang?: () => void;
  error?: string | null;
  isChecking?: boolean;
}

export const PinEntry: React.FC<PinEntryProps> = ({
  pin,
  onChangePin,
  onEnterRoom,
  onBack,
  lang,
  error,
  isChecking = false,
}) => {
  const [showQrSim, setShowQrSim] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col h-full max-h-full px-3.5 py-3 min-h-0 overflow-hidden pb-safe">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between flex-shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="px-3 py-1.5 rounded-xl border-2 border-tinta bg-kertas-putih flex items-center gap-1 text-xs font-display font-black text-tinta btn-pressable shadow-stiker-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === "id" ? "Kembali" : "Back"}</span>
        </button>

        <span className="font-label text-xs font-bold text-coklat bg-kraft/60 px-3 py-1 rounded-full border border-tinta/30">
          ✦ Ruang Kuis Budaya ✦
        </span>
      </div>

      {/* Centered Karcis PIN Ticket */}
      <div className="flex-1 flex flex-col justify-center items-center w-full my-auto py-2">
        <PaperCard variant="ticket" className="w-full p-4 sm:p-5 relative overflow-hidden shadow-stiker">
          {/* Ticket Header Stamp */}
          <div className="flex items-center justify-between pb-2 border-b-2 border-dashed border-tinta/30 mb-3">
            <div className="flex items-center gap-1.5 font-label font-bold text-xs text-coklat">
              <Ticket className="w-4 h-4 text-emas" />
              <span>KODE BERMAIN GAME</span>
            </div>
            <span className="font-label text-[10px] font-bold text-tinta bg-kuning px-2 py-0.5 rounded border border-tinta">
              PULAU PENYENGAT
            </span>
          </div>

          <div className="text-center mb-4">
            <h2 className="font-display font-black text-2xl sm:text-3xl text-tinta leading-tight">
              {lang === "id" ? "Masukkan Kode Game" : "Enter Game Code"}
            </h2>
            <p className="font-body text-xs text-coklat font-semibold mt-1">
              {lang === "id"
                ? "Dapatkan 6 digit PIN dari layar guru / host"
                : "Enter the 6-digit code shown on host screen"}
            </p>
          </div>

          {/* 6 Digit Input */}
          <PinInput value={pin} onChange={onChangePin} length={6} error={error || undefined} />

          {/* Action Button Integrated Inside Karcis */}
          <div className="w-full pt-4 mt-4 border-t-2 border-dashed border-tinta/25">
            <StickerButton
              variant="primary"
              size="lg"
              className="w-full text-lg sm:text-xl flex items-center justify-center gap-2"
              onClick={onEnterRoom}
              disabled={pin.trim().length < 6 || isChecking}
            >
              {isChecking ? (
                <>
                  <Loader2 className="w-5 h-5 text-tinta animate-spin" />
                  <span>{lang === "id" ? "Memeriksa PIN..." : "Checking PIN..."}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-tinta" />
                  <span>{lang === "id" ? "Gabung ke Permainan ➔" : "Join Game ➔"}</span>
                </>
              )}
            </StickerButton>
          </div>
        </PaperCard>
      </div>
    </div>
  );
};
