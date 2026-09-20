import React, { useState } from "react";
import { PaperCard } from "../ui/PaperCard";
import { PinInput } from "../ui/PinInput";
import { StickerButton } from "../ui/StickerButton";
import { ArrowLeft, QrCode, Ticket, Sparkles } from "lucide-react";

interface P2Props {
  pin: string;
  onChangePin: (pin: string) => void;
  onEnterRoom: () => void;
  onBack: () => void;
  lang: "id" | "en";
  onToggleLang?: () => void;
  error?: string;
}

export const P2_PinEntry: React.FC<P2Props> = ({
  pin,
  onChangePin,
  onEnterRoom,
  onBack,
  lang,
  error,
}) => {
  const [showQrSim, setShowQrSim] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-between min-h-[calc(100dvh-60px)] px-4 py-3 pb-safe">
      {/* Back Navigation */}
      <div className="flex items-center justify-between">
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

      {/* Quizizz Signature Join Card */}
      <div className="my-auto w-full py-2">
        <PaperCard variant="ticket" className="w-full p-6 relative overflow-hidden">
          {/* Ticket Header Stamp */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-tinta/30 mb-4">
            <div className="flex items-center gap-1.5 font-label font-bold text-xs text-coklat">
              <Ticket className="w-4 h-4 text-emas" />
              <span>KODE BERMAIN GAME</span>
            </div>
            <span className="font-label text-[10px] font-bold text-tinta bg-kuning px-2 py-0.5 rounded border border-tinta">
              PULAU PENYENGAT
            </span>
          </div>

          <div className="text-center mb-5">
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
          <PinInput value={pin} onChange={onChangePin} length={6} error={error} />

          {/* Demo Shortcut */}
          <div className="flex justify-center mt-3">
            <button
              type="button"
              onClick={() => onChangePin("482913")}
              className="text-[11px] font-label font-bold text-coklat/70 hover:text-tinta underline decoration-dashed"
            >
              [ demo PIN: 482913 ]
            </button>
          </div>

          {/* QR Scan Action */}
          <div className="mt-5 pt-4 border-t-2 border-dashed border-tinta/20 flex flex-col items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowQrSim(!showQrSim)}
              className="w-full py-2 px-3.5 rounded-xl border-2 border-dashed border-coklat bg-kertas-putih text-tinta font-body font-bold text-xs flex items-center justify-center gap-2 hover:bg-kraft/30 btn-pressable"
            >
              <QrCode className="w-4 h-4 text-coklat" />
              <span>{lang === "id" ? "Pindai Kode QR Ruangan" : "Scan Room QR Code"}</span>
            </button>

            {showQrSim && (
              <div className="w-full p-3 rounded-xl bg-kertas-putih border-2 border-tinta text-center animate-fade-in">
                <div className="w-20 h-20 mx-auto bg-kraft/40 rounded-lg border-2 border-tinta flex items-center justify-center mb-1.5">
                  <QrCode className="w-14 h-14 text-tinta" />
                </div>
                <p className="font-body text-[11px] font-bold text-tinta">
                  {lang === "id"
                    ? "Kamera siap memindai QR code kuis..."
                    : "Camera scanning room QR code..."}
                </p>
              </div>
            )}
          </div>
        </PaperCard>
      </div>

      {/* Enter Room Button */}
      <div className="w-full pt-2">
        <StickerButton
          variant="primary"
          size="lg"
          className="w-full text-xl flex items-center justify-center gap-2"
          onClick={onEnterRoom}
          disabled={pin.trim().length < 6}
        >
          <Sparkles className="w-5 h-5 text-tinta" />
          <span>{lang === "id" ? "Gabung ke Permainan ➔" : "Join Game ➔"}</span>
        </StickerButton>
      </div>
    </div>
  );
};
