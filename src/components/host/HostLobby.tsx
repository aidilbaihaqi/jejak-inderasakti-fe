import React from "react";
import { PaperCard } from "../ui/PaperCard";
import { StickerButton } from "../ui/StickerButton";
import { LogoInderasakti } from "../assets/LogoInderasakti";
import { AvatarIcon } from "../assets/AvatarCollection";
import { QrCodeView } from "../ui/QrCodeView";
import { Users, Play, LogOut, Sparkles, ArrowLeft } from "lucide-react";

interface JoinedHostPlayer {
  id: string;
  name: string;
  school: string;
  avatarId: string;
}

interface HostLobbyProps {
  roomCode: string;
  roomName: string;
  gradeLevel: string;
  sessionMode: string;
  qrUrl?: string;
  players?: JoinedHostPlayer[];
  onStartSession: () => void;
  onEndSession: () => void;
  onBackToRooms?: () => void;
}


const DEFAULT_HOST_PLAYERS: JoinedHostPlayer[] = [];

export const HostLobby: React.FC<HostLobbyProps> = ({
  roomCode = "------",
  roomName = "Sesi Kuis Budaya",
  gradeLevel = "SMP",
  sessionMode = "NORMAL",
  qrUrl,
  players = DEFAULT_HOST_PLAYERS,
  onStartSession,
  onEndSession,
  onBackToRooms,
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col min-h-0 overflow-y-auto p-2 sm:p-6 pb-safe space-y-4 sm:space-y-6">
      {/* Top Projector Navbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b-2 sm:border-b-3 border-tinta">
        <div className="flex items-center justify-between">
          <LogoInderasakti variant="horizontal" />
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {onBackToRooms && (
            <button
              type="button"
              onClick={onBackToRooms}
              className="px-3 py-1.5 rounded-xl border-2 border-tinta bg-kertas-putih font-body text-xs font-bold text-tinta hover:bg-kraft/70 btn-pressable shadow-stiker-sm flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Daftar Ruangan</span>
            </button>
          )}

          <div className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-kraft border-2 border-tinta font-label text-[11px] sm:text-xs font-bold text-tinta flex items-center gap-1.5 sm:gap-2">
            <span className="truncate max-w-[120px] sm:max-w-none">{roomName}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-tinta flex-shrink-0" />
            <span>{gradeLevel}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-tinta flex-shrink-0" />
            <span>{sessionMode === "NORMAL" ? "15 Soal" : "10 Soal"}</span>
          </div>

          <button
            type="button"
            onClick={onEndSession}
            className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-salah text-white border-2 border-tinta font-display font-bold text-xs btn-pressable shadow-stiker-sm hover:bg-[#A92E2E]"
          >
            Tutup Room
          </button>
        </div>
      </div>

      {/* Main Split Section: Left PIN/QR, Right Participants Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 flex-1">
        {/* Left Col: Big PIN & Giant QR Code for Projector (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <PaperCard variant="ticket" className="p-4 sm:p-6 text-center">
            <span className="font-label text-[10px] sm:text-xs font-bold text-coklat tracking-widest uppercase block mb-1">
              MASUK KE JEJAK INDERASAKTI
            </span>
            <span className="font-label text-xs font-semibold text-tinta block mb-2">
              Buka link di HP peserta & masukkan PIN:
            </span>

            {/* Giant 6-digit PIN */}
            <div className="py-2 px-3 sm:py-2.5 sm:px-4 bg-kertas-putih rounded-2xl border-3 border-tinta shadow-stiker-sm inline-block max-w-full overflow-hidden">
              <span className="font-label font-black text-3xl sm:text-5xl tracking-wider sm:tracking-widest text-tinta">
                {roomCode.split("").join(" ")}
              </span>
            </div>

            {/* Giant QR Code */}
            <div className="mt-4 sm:mt-5 p-3 sm:p-4 bg-kertas-putih rounded-2xl border-3 border-tinta shadow-stiker-sm inline-flex flex-col items-center">
              <div className="w-36 h-36 sm:w-44 sm:h-44 bg-white rounded-xl border-2 border-tinta flex items-center justify-center p-1.5 overflow-hidden shadow-inner">
                <QrCodeView
                  value={
                    qrUrl ||
                    (typeof window !== "undefined"
                      ? `${window.location.origin}/?pin=${roomCode}`
                      : `https://penyengatadventure.tech/?pin=${roomCode}`)
                  }
                  size={160}
                />
              </div>
              <span className="font-body text-xs font-bold text-coklat mt-2 text-center">
                Scan langsung pakai kamera HP
              </span>
            </div>
          </PaperCard>
        </div>

        {/* Right Col: Joined Participants Grid (7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <PaperCard variant="memo" className="p-4 sm:p-6 flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-kraft mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emas" />
                <h3 className="font-display font-black text-lg sm:text-xl text-tinta">
                  Peserta Bergabung
                </h3>
              </div>
              <div className="px-2.5 sm:px-3 py-1 rounded-xl bg-kuning border-2 border-tinta font-label font-bold text-xs sm:text-sm text-tinta shadow-stiker-sm">
                {players.length} / 15 Peserta
              </div>
            </div>

            {/* Grid of Players */}
            {players.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 text-center bg-kertas/40 rounded-2xl border-2 border-dashed border-tinta/30 my-2 sm:my-4">
                <Users className="w-10 sm:w-12 h-10 sm:h-12 text-coklat/40 mb-2 animate-pulse" />
                <h4 className="font-display font-black text-sm sm:text-base text-tinta">
                  Menunggu Peserta Bergabung...
                </h4>
                <p className="font-body text-xs text-coklat font-semibold mt-1">
                  Minta peserta membuka aplikasi di HP dan memasukkan kode PIN di samping.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3 overflow-y-auto max-h-[300px] sm:max-h-[380px] pr-1 flex-1">
                {players.map((p) => (
                  <div
                    key={p.id}
                    className="flex flex-col items-center text-center p-2.5 sm:p-3 rounded-2xl bg-kertas border-2 border-tinta shadow-stiker-sm animate-pop-badge"
                  >
                    <AvatarIcon id={p.avatarId} size={44} />
                    <span className="font-display font-black text-xs sm:text-sm text-tinta truncate max-w-[100px] mt-1">
                      {p.name}
                    </span>
                    <span className="font-body text-[10px] text-coklat font-semibold truncate max-w-[100px]">
                      {p.school}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Status note */}
            <div className="mt-4 pt-3 border-t border-dashed border-kraft flex items-center justify-between text-[11px] sm:text-xs font-label font-bold text-coklat">
              <span>✦ Sesi siap dimulai kapan saja</span>
              <span className="text-benar">● Real-time WebSocket aktif</span>
            </div>
          </PaperCard>
        </div>
      </div>

      {/* Big Start Session CTA Button */}
      <div className="w-full pt-2 sm:pt-4">
        <StickerButton
          variant="primary"
          size="lg"
          className="w-full text-base sm:text-xl py-3.5 sm:py-4 flex items-center justify-center gap-2 sm:gap-3 shadow-stiker-lg"
          onClick={onStartSession}
          disabled={players.length === 0}
        >
          <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-tinta" />
          <span>Mulai Sesi Kuis Sekarang! ➔</span>
        </StickerButton>
      </div>
    </div>
  );
};
