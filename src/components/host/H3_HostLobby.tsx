import React from "react";
import { PaperCard } from "../ui/PaperCard";
import { StickerButton } from "../ui/StickerButton";
import { LogoInderasakti } from "../assets/LogoInderasakti";
import { AvatarIcon } from "../assets/AvatarCollection";
import { QrCode, Users, Play, LogOut, Sparkles } from "lucide-react";

interface JoinedHostPlayer {
  id: string;
  name: string;
  school: string;
  avatarId: string;
}

interface H3Props {
  roomCode: string;
  roomName: string;
  gradeLevel: string;
  sessionMode: string;
  players?: JoinedHostPlayer[];
  onStartSession: () => void;
  onEndSession: () => void;
}

const DEFAULT_HOST_PLAYERS: JoinedHostPlayer[] = [
  { id: "1", name: "Bimo", school: "SDN 001 Tanjungpinang", avatarId: "1" },
  { id: "2", name: "Siti", school: "SDN 001 Tanjungpinang", avatarId: "2" },
  { id: "3", name: "Rizky", school: "SMPN 1 Tanjungpinang", avatarId: "3" },
  { id: "4", name: "Rani", school: "SMPN 1 Tanjungpinang", avatarId: "4" },
  { id: "5", name: "Farhan", school: "SDN 002 Tanjungpinang", avatarId: "5" },
  { id: "6", name: "Aisyah", school: "SMPN 2 Tanjungpinang", avatarId: "6" },
  { id: "7", name: "Ahmad", school: "SMPN 1 Tanjungpinang", avatarId: "7" },
  { id: "8", name: "Maya", school: "SDN 001 Tanjungpinang", avatarId: "8" },
];

export const H3_HostLobby: React.FC<H3Props> = ({
  roomCode = "482913",
  roomName = "Kelas 8-B — Sejarah Riau",
  gradeLevel = "SMP",
  sessionMode = "NORMAL",
  players = DEFAULT_HOST_PLAYERS,
  onStartSession,
  onEndSession,
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col justify-between min-h-[700px] p-5 sm:p-7">
      {/* Top Projector Navbar */}
      <div className="flex items-center justify-between pb-4 border-b-3 border-tinta mb-6">
        <LogoInderasakti variant="horizontal" />

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-kraft border-2 border-tinta font-label text-xs font-bold text-tinta flex items-center gap-2">
            <span>{roomName}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-tinta" />
            <span>{gradeLevel}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-tinta" />
            <span>{sessionMode === "NORMAL" ? "15 Soal" : "10 Soal"}</span>
          </div>

          <button
            type="button"
            onClick={onEndSession}
            className="px-4 py-2 rounded-xl bg-salah text-white border-2 border-tinta font-display font-bold text-xs btn-pressable shadow-stiker-sm hover:bg-[#A92E2E]"
          >
            Tutup Room
          </button>
        </div>
      </div>

      {/* Main Split Section: Left PIN/QR, Right Participants Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto">
        {/* Left Col: Big PIN & Giant QR Code for Projector (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <PaperCard variant="ticket" className="p-6 text-center">
            <span className="font-label text-xs font-bold text-coklat tracking-widest uppercase block mb-1">
              MASUK KE JEJAK INDERASAKTI
            </span>
            <span className="font-label text-xs font-semibold text-tinta block mb-2">
              Buka link di HP peserta & masukkan PIN:
            </span>

            {/* Giant 6-digit PIN */}
            <div className="py-2.5 px-4 bg-kertas-putih rounded-2xl border-3 border-tinta shadow-stiker-sm inline-block">
              <span className="font-label font-black text-4xl sm:text-5xl tracking-widest text-tinta">
                {roomCode.split("").join(" ")}
              </span>
            </div>

            {/* Giant QR Code */}
            <div className="mt-5 p-4 bg-kertas-putih rounded-2xl border-3 border-tinta shadow-stiker-sm inline-flex flex-col items-center">
              <div className="w-44 h-44 bg-kraft/40 rounded-xl border-2 border-tinta flex items-center justify-center p-2">
                <QrCode className="w-full h-full text-tinta" />
              </div>
              <span className="font-body text-xs font-bold text-coklat mt-2">
                Scan langsung pakai kamera HP
              </span>
            </div>
          </PaperCard>
        </div>

        {/* Right Col: Joined Participants Grid (7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <PaperCard variant="memo" className="p-6 flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-kraft mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emas" />
                <h3 className="font-display font-black text-xl text-tinta">
                  Peserta Bergabung
                </h3>
              </div>
              <div className="px-3 py-1 rounded-xl bg-kuning border-2 border-tinta font-label font-bold text-sm text-tinta shadow-stiker-sm">
                {players.length} / 15 Peserta
              </div>
            </div>

            {/* Grid of Players */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 overflow-y-auto max-h-[380px] pr-1 flex-1">
              {players.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col items-center text-center p-3 rounded-2xl bg-kertas border-2 border-tinta shadow-stiker-sm animate-pop-badge"
                >
                  <AvatarIcon id={p.avatarId} size={50} />
                  <span className="font-display font-black text-sm text-tinta truncate max-w-[100px] mt-1.5">
                    {p.name}
                  </span>
                  <span className="font-body text-[10px] text-coklat font-semibold truncate max-w-[100px]">
                    {p.school}
                  </span>
                </div>
              ))}
            </div>

            {/* Status note */}
            <div className="mt-4 pt-3 border-t border-dashed border-kraft flex items-center justify-between text-xs font-label font-bold text-coklat">
              <span>✦ Sesi siap dimulai kapan saja</span>
              <span className="text-benar">● Real-time WebSocket aktif</span>
            </div>
          </PaperCard>
        </div>
      </div>

      {/* Big Start Session CTA Button */}
      <div className="w-full pt-6">
        <StickerButton
          variant="primary"
          size="xl"
          className="w-full text-2xl py-5 flex items-center justify-center gap-3 shadow-stiker-lg"
          onClick={onStartSession}
          disabled={players.length === 0}
        >
          <Play className="w-6 h-6 fill-tinta" />
          <span>Mulai Sesi Kuis Sekarang! ➔</span>
        </StickerButton>
      </div>
    </div>
  );
};
