import React, { useState } from "react";
import { PaperCard } from "../ui/PaperCard";
import { PinInput } from "../ui/PinInput";
import { StickerButton } from "../ui/StickerButton";
import { ArrowLeft, Globe, QrCode, Ticket } from "lucide-react";

interface P2Props {
  pin: string;
  onChangePin: (pin: string) => void;
  onEnterRoom: () => void;
  onBack: () => void;
  lang: "id" | "en";
  onToggleLang: () => void;
  error?: string;
}

export const P2_PinEntry: React.FC<P2Props> = ({
  pin,
  onChangePin,
  onEnterRoom,
  onBack,
  lang,
  onToggleLang,
  error,
}) => {
  const [showQrSim, setShowQrSim] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-between min-h-[640px] p-5">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 rounded-xl border-2 border-tinta bg-kertas-putih flex items-center justify-center text-tinta btn-pressable shadow-stiker-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className="font-display font-extrabold text-lg text-tinta">
          JEJAK INDERASAKTI
        </span>

        <button
          type="button"
          onClick={onToggleLang}
          className="px-2.5 py-1.5 rounded-xl border-2 border-tinta bg-kraft font-label text-xs font-bold text-tinta flex items-center gap-1.5 btn-pressable shadow-stiker-sm"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{lang.toUpperCase()}</span>
        </button>
      </div>

      {/* Main Yellow Ticket Voucher */}
      <div className="my-auto w-full py-4">
        <PaperCard variant="ticket" className="w-full p-6 sm:p-7 relative overflow-hidden">
          {/* Ticket Header Stamp */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-tinta/30 mb-4">
            <div className="flex items-center gap-1.5 font-label font-bold text-xs text-coklat">
              <Ticket className="w-4 h-4 text-emas" />
              <span>KARCIS MASUK ROOM</span>
            </div>
            <span className="font-label text-[10px] font-bold text-tinta bg-kuning px-2 py-0.5 rounded border border-tinta">
              PULAU PENYENGAT
            </span>
          </div>

          <div className="text-center mb-6">
            <h2 className="font-display font-black text-2xl sm:text-3xl text-tinta leading-tight">
              {lang === "id" ? "Masukkan PIN Room" : "Enter Room PIN"}
            </h2>
            <p className="font-body text-xs sm:text-sm text-coklat font-semibold mt-1">
              {lang === "id"
                ? "Dapatkan 6 digit kode dari layar guru / host"
                : "Get the 6-digit code from teacher / host screen"}
            </p>
          </div>

          {/* 6 Digit Input */}
          <PinInput value={pin} onChange={onChangePin} length={6} error={error} />

          {/* Quick Demo Fill Shortcut */}
          <div className="flex justify-center mt-3">
            <button
              type="button"
              onClick={() => onChangePin("482913")}
              className="text-[11px] font-label font-bold text-coklat/70 hover:text-tinta underline decoration-dashed"
            >
              [ demo PIN: 482913 ]
            </button>
          </div>

          {/* QR Scan Button */}
          <div className="mt-5 pt-4 border-t-2 border-dashed border-tinta/20 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => setShowQrSim(!showQrSim)}
              className="w-full py-2.5 px-4 rounded-xl border-2 border-dashed border-coklat bg-kertas-putih text-tinta font-body font-bold text-sm flex items-center justify-center gap-2 hover:bg-kraft/30 btn-pressable"
            >
              <QrCode className="w-4 h-4 text-coklat" />
              <span>{lang === "id" ? "Pindai Kode QR" : "Scan QR Code"}</span>
            </button>

            {/* QR Simulation View */}
            {showQrSim && (
              <div className="w-full p-4 rounded-xl bg-kertas-putih border-2 border-tinta text-center animate-fade-in">
                <div className="w-24 h-24 mx-auto bg-kraft/40 rounded-lg border-2 border-tinta flex items-center justify-center mb-2">
                  <QrCode className="w-16 h-16 text-tinta" />
                </div>
                <p className="font-body text-xs font-bold text-tinta">
                  {lang === "id"
                    ? "Kamera aktif mendeteksi QR code ruangan..."
                    : "Camera active detecting room QR code..."}
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
          className="w-full text-xl"
          onClick={onEnterRoom}
          disabled={pin.trim().length < 6}
        >
          {lang === "id" ? "Masuk ke Ruangan ➔" : "Join Room ➔"}
        </StickerButton>
      </div>
    </div>
  );
};
