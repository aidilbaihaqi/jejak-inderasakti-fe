import React from "react";
import { PaperCard } from "../ui/PaperCard";
import { MascotSakti } from "../assets/MascotSakti";
import { AvatarIcon, AVATAR_LIST } from "../assets/AvatarCollection";
import { Users, Sparkles, Clock, Crown } from "lucide-react";

interface JoinedPlayer {
  id: string;
  name: string;
  avatarId: string;
  isSelf?: boolean;
}

interface P4Props {
  roomCode: string;
  playerName: string;
  playerAvatarId: string;
  playersList?: JoinedPlayer[];
  onSimulateHostStart: () => void;
  lang: "id" | "en";
}

const DEFAULT_PLAYERS: JoinedPlayer[] = [
  { id: "p1", name: "Bimo", avatarId: "1", isSelf: true },
  { id: "p2", name: "Siti", avatarId: "2" },
  { id: "p3", name: "Rizky", avatarId: "3" },
  { id: "p4", name: "Rani", avatarId: "4" },
  { id: "p5", name: "Farhan", avatarId: "5" },
  { id: "p6", name: "Aisyah", avatarId: "6" },
  { id: "p7", name: "Ahmad", avatarId: "7" },
  { id: "p8", name: "Maya", avatarId: "8" },
];

export const P4_Lobby: React.FC<P4Props> = ({
  roomCode,
  playerName,
  playerAvatarId,
  playersList = DEFAULT_PLAYERS,
  onSimulateHostStart,
  lang,
}) => {
  const currentCount = playersList.length;
  const maxPlayers = 15;

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-between min-h-[640px] p-5 pb-8">
      {/* Top Room PIN Header Card */}
      <PaperCard variant="kraft" className="w-full p-4 mb-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-label text-[11px] font-bold text-coklat tracking-wider uppercase block">
              {lang === "id" ? "KODE RUANGAN" : "ROOM CODE"}
            </span>
            <span className="font-label font-extrabold text-2xl tracking-widest text-tinta">
              {roomCode.split("").join(" ")}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-kertas-putih border-2 border-tinta shadow-stiker-sm">
            <Users className="w-4 h-4 text-coklat" />
            <span className="font-label font-bold text-xs text-tinta">
              {currentCount}/{maxPlayers}
            </span>
          </div>
        </div>
      </PaperCard>

      {/* Marquee Ticker */}
      <div className="w-full overflow-hidden bg-kuning border-2 border-tinta rounded-xl py-1 px-2 shadow-stiker-sm mb-4">
        <div className="whitespace-nowrap animate-marquee flex items-center gap-4 text-xs font-display font-extrabold text-tinta tracking-wide">
          <span>✦ JEJAK INDERASAKTI</span>
          <span>✦ PULAU PENYENGAT</span>
          <span>✦ GURINDAM DUA BELAS</span>
          <span>✦ RAJA ALI HAJI</span>
          <span>✦ 5 SITUS CAGAR BUDAYA</span>
        </div>
      </div>

      {/* Joined Players Grid */}
      <PaperCard variant="memo" className="w-full p-4 flex-1 flex flex-col mb-4">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-dashed border-kraft">
          <span className="font-display font-black text-sm text-tinta flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emas" />
            {lang === "id" ? "Peserta di Lobby" : "Players in Lobby"}
          </span>
          <span className="font-label text-xs text-coklat font-bold">
            {lang === "id" ? "Siap bertanding" : "Ready to play"}
          </span>
        </div>

        {/* Players Avatar List */}
        <div className="grid grid-cols-4 gap-2.5 max-h-56 overflow-y-auto pr-1">
          {playersList.map((player) => (
            <div
              key={player.id}
              className={`flex flex-col items-center p-1.5 rounded-xl border transition-all ${
                player.isSelf
                  ? "bg-kuning/30 border-tinta shadow-xs ring-2 ring-kuning"
                  : "bg-kertas/40 border-tinta/40"
              }`}
            >
              <div className="relative">
                <AvatarIcon id={player.avatarId} size={42} />
                {player.isSelf && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-kuning border border-tinta text-[9px] font-bold flex items-center justify-center">
                    ★
                  </span>
                )}
              </div>
              <span className="font-body font-bold text-[11px] text-tinta truncate max-w-[65px] mt-1">
                {player.name}
              </span>
            </div>
          ))}
        </div>
      </PaperCard>

      {/* Waiting Status with Mascot Sakti */}
      <div className="flex flex-col items-center text-center my-auto">
        <MascotSakti
          pose="thinking"
          size={130}
          speechBubble={
            lang === "id"
              ? "Menunggu guru/host memulai sesi..."
              : "Waiting for host to start..."
          }
        />
        <div className="flex items-center gap-1.5 text-xs font-label font-bold text-coklat mt-2 bg-kraft/50 px-3 py-1 rounded-full border border-tinta/30">
          <Clock className="w-3.5 h-3.5 animate-spin" />
          <span>{lang === "id" ? "Status: Siap di Lobby" : "Status: Ready in Lobby"}</span>
        </div>
      </div>

      {/* Host Simulation Action */}
      <div className="w-full pt-4">
        <button
          type="button"
          onClick={onSimulateHostStart}
          className="w-full py-3 px-4 rounded-2xl bg-kuning border-3 border-tinta text-tinta font-display font-black text-base shadow-stiker btn-pressable hover:bg-[#FFD147]"
        >
          {lang === "id" ? "Host Memulai Kuis ➔" : "Host Starts Quiz ➔"}
        </button>
      </div>
    </div>
  );
};
