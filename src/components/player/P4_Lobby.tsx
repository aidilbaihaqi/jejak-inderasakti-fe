import React from "react";
import { PaperCard } from "../ui/PaperCard";
import { MascotSakti } from "../assets/MascotSakti";
import { AvatarIcon } from "../assets/AvatarCollection";
import { Users, Sparkles, Clock, CheckCircle2 } from "lucide-react";

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
    <div className="w-full max-w-md mx-auto flex flex-col justify-between min-h-[calc(100dvh-60px)] px-4 py-3 pb-safe select-none">
      {/* Quizizz Room PIN Banner */}
      <PaperCard variant="kraft" className="w-full p-3.5 mb-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-label text-[10px] font-bold text-coklat tracking-wider uppercase block">
              {lang === "id" ? "KODE PERMAINAN" : "GAME CODE"}
            </span>
            <span className="font-label font-black text-2xl tracking-widest text-tinta">
              {roomCode.split("").join(" ")}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-kertas-putih border-2 border-tinta shadow-stiker-sm">
            <Users className="w-4 h-4 text-coklat" />
            <span className="font-label font-bold text-xs text-tinta">
              {currentCount}/{maxPlayers}
            </span>
          </div>
        </div>
      </PaperCard>

      {/* Quizizz "You're in!" Center Card */}
      <div className="my-auto w-full flex flex-col items-center text-center py-2">
        <div className="relative mb-2">
          <AvatarIcon id={playerAvatarId} size={90} selected />
          <div className="absolute -bottom-1 -right-1 p-1 bg-benar text-white rounded-full border-2 border-tinta shadow-sm">
            <CheckCircle2 className="w-4 h-4 stroke-[3]" />
          </div>
        </div>

        <h2 className="font-display font-black text-2xl text-tinta leading-tight">
          {lang === "id" ? `Kamu sudah bergabung, ${playerName}!` : `You're in, ${playerName}!`}
        </h2>
        <p className="font-body text-xs font-semibold text-coklat mt-0.5">
          {lang === "id"
            ? "Lihat namamu di layar proyektor kelas?"
            : "See your nickname on the classroom screen?"}
        </p>

        {/* Mascot Thinking & Waiting Status */}
        <div className="mt-3 flex flex-col items-center">
          <MascotSakti
            pose="thinking"
            size={115}
            speechBubble={
              lang === "id"
                ? "Menunggu guru/host menekan tombol Mulai..."
                : "Waiting for host to start..."
            }
          />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-kraft/50 border border-tinta/30 text-xs font-label font-bold text-coklat mt-1">
            <Clock className="w-3.5 h-3.5 animate-spin text-emas" />
            <span>{lang === "id" ? "Status: Siap di Ruang Tunggu" : "Status: Ready in Lobby"}</span>
          </div>
        </div>
      </div>

      {/* Joined Friends Drawer Preview */}
      <PaperCard variant="memo" className="w-full p-3.5 mt-2">
        <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-dashed border-kraft">
          <span className="font-display font-black text-xs text-tinta flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emas" />
            {lang === "id" ? "Teman Seperjuangan" : "Fellow Explorers"}
          </span>
          <span className="font-label text-[11px] text-coklat font-bold">
            {currentCount} siswa
          </span>
        </div>

        {/* Horizontal Scroll / Compact Grid of Joined Avatars */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
          {playersList.map((p) => (
            <div
              key={p.id}
              className={`flex-shrink-0 flex flex-col items-center p-1.5 rounded-xl border transition-all ${
                p.isSelf
                  ? "bg-kuning/40 border-tinta shadow-xs"
                  : "bg-kertas/60 border-tinta/30"
              }`}
            >
              <AvatarIcon id={p.avatarId} size={36} />
              <span className="font-body font-bold text-[10px] text-tinta truncate max-w-[55px] mt-1">
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </PaperCard>

      {/* Host Simulation Action */}
      <div className="w-full pt-3">
        <button
          type="button"
          onClick={onSimulateHostStart}
          className="w-full py-3 px-4 rounded-2xl bg-kuning border-3 border-tinta text-tinta font-display font-black text-base shadow-stiker btn-pressable hover:bg-[#FFD147]"
        >
          {lang === "id" ? "Host Memulai Kuis Sekarang ➔" : "Host Starts Quiz Now ➔"}
        </button>
      </div>
    </div>
  );
};
