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

interface PlayerLobbyProps {
  roomCode: string;
  playerName: string;
  playerAvatarId: string;
  playersList?: JoinedPlayer[];
  onSimulateHostStart?: () => void;
  lang: "id" | "en";
}

const DEFAULT_PLAYERS: JoinedPlayer[] = [];

export const PlayerLobby: React.FC<PlayerLobbyProps> = ({
  roomCode,
  playerName,
  playerAvatarId,
  playersList = DEFAULT_PLAYERS,
  lang,
}) => {
  const currentCount = playersList.length;
  const maxPlayers = 15;

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-between h-full max-h-full px-3 py-1.5 min-h-0 overflow-hidden pb-safe select-none">
      {/* Quizizz Room PIN Banner */}
      <PaperCard variant="kraft" className="w-full p-2.5 mb-1">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-label text-[10px] font-bold text-coklat tracking-wider uppercase block">
              {lang === "id" ? "KODE PERMAINAN" : "GAME CODE"}
            </span>
            <span className="font-label font-black text-xl tracking-widest text-tinta">
              {roomCode.split("").join(" ")}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-xl bg-kertas-putih border-2 border-tinta shadow-stiker-sm">
            <Users className="w-3.5 h-3.5 text-coklat" />
            <span className="font-label font-bold text-xs text-tinta">
              {currentCount}/{maxPlayers}
            </span>
          </div>
        </div>
      </PaperCard>

      {/* Quizizz "You're in!" Center Card */}
      <div className="my-auto w-full flex flex-col items-center text-center py-1">
        <div className="relative mb-1">
          <AvatarIcon id={playerAvatarId} size={64} selected />
          <div className="absolute -bottom-1 -right-1 p-0.5 bg-benar text-white rounded-full border-2 border-tinta shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </div>

        <h2 className="font-display font-black text-xl text-tinta leading-tight">
          {lang === "id" ? `Kamu sudah bergabung, ${playerName}!` : `You're in, ${playerName}!`}
        </h2>
        <p className="font-body text-xs font-semibold text-coklat mt-0.5">
          {lang === "id"
            ? "Lihat namamu di layar proyektor kelas?"
            : "See your nickname on the classroom screen?"}
        </p>

        {/* Mascot Thinking & Waiting Status */}
        <div className="mt-2 flex flex-col items-center">
          <MascotSakti
            pose="thinking"
            size={85}
            speechBubble={
              lang === "id"
                ? "Menunggu guru/host menekan tombol Mulai..."
                : "Waiting for host to start..."
            }
          />
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-kraft/50 border border-tinta/30 text-xs font-label font-bold text-coklat mt-1">
            <Clock className="w-3 h-3 animate-spin text-emas" />
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

      {/* Waiting for Host Status Banner (Player cannot bypass Host) */}
      <div className="w-full pt-2">
        <div className="w-full py-2.5 px-4 rounded-2xl bg-kertas-putih border-2 border-dashed border-tinta/40 text-center flex items-center justify-center gap-2 shadow-xs">
          <Clock className="w-4 h-4 text-coklat animate-spin" />
          <span className="font-body font-bold text-xs text-coklat">
            {lang === "id"
              ? "Menunggu Guru / Host menekan Mulai di proyektor..."
              : "Waiting for Host to press Start on projector..."}
          </span>
        </div>
      </div>
    </div>
  );
};
