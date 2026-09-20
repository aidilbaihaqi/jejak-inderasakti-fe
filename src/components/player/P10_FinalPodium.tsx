import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { MascotSakti } from "../assets/MascotSakti";
import { AvatarIcon } from "../assets/AvatarCollection";
import { PaperCard } from "../ui/PaperCard";
import { StickerButton } from "../ui/StickerButton";
import { Trophy, Award, CheckCircle2, RotateCcw } from "lucide-react";

interface TopPlayer {
  rank: 1 | 2 | 3;
  name: string;
  avatarId: string;
  score: number;
}

interface P10Props {
  playerName: string;
  playerRank: number;
  totalPlayers: number;
  playerScore: number;
  correctCount: number;
  totalQuestions: number;
  topPlayers?: TopPlayer[];
  onFinish: () => void;
  lang: "id" | "en";
}

const DEFAULT_TOP_PLAYERS: TopPlayer[] = [
  { rank: 1, name: "Bimo", avatarId: "1", score: 12450 },
  { rank: 2, name: "Rani", avatarId: "4", score: 11200 },
  { rank: 3, name: "Siti", avatarId: "2", score: 10850 },
];

export const P10_FinalPodium: React.FC<P10Props> = ({
  playerName,
  playerRank = 1,
  totalPlayers = 8,
  playerScore = 12450,
  correctCount = 13,
  totalQuestions = 15,
  topPlayers = DEFAULT_TOP_PLAYERS,
  onFinish,
  lang,
}) => {
  // Fire confetti upon mounting
  useEffect(() => {
    const end = Date.now() + 2.5 * 1000;
    const colors = ["#FFC629", "#C8922A", "#8B5A2B", "#2F7D4F", "#2E7EA0"];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  const p1 = topPlayers.find((p) => p.rank === 1) || DEFAULT_TOP_PLAYERS[0];
  const p2 = topPlayers.find((p) => p.rank === 2) || DEFAULT_TOP_PLAYERS[1];
  const p3 = topPlayers.find((p) => p.rank === 3) || DEFAULT_TOP_PLAYERS[2];

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-between min-h-[100dvh] p-4 sm:p-5 pb-safe">
      {/* Top Victory Title */}
      <div className="text-center pt-1">
        <span className="font-label text-xs font-bold text-emas tracking-widest uppercase">
          ✦ SELESAI PETUALANGAN ✦
        </span>
        <h1 className="font-display font-black text-3xl text-tinta leading-tight">
          {lang === "id" ? "PODIUM JUARA" : "VICTORY PODIUM"}
        </h1>
      </div>

      {/* Mascot Sakti with Golden Trophy */}
      <div className="flex justify-center -my-1">
        <MascotSakti
          pose="trophy"
          size={140}
          speechBubble={
            lang === "id"
              ? "Luar biasa! Kamu telah menjelajahi seluruh situs!"
              : "Splendid! You explored all 5 heritage sites!"
          }
        />
      </div>

      {/* 3-Tier Podium */}
      <div className="w-full flex items-end justify-center gap-2 px-2 my-auto">
        {/* Rank 2 (Silver) */}
        <div className="flex-1 flex flex-col items-center">
          <AvatarIcon id={p2.avatarId} size={48} />
          <span className="font-display font-black text-xs text-tinta mt-1 truncate max-w-[80px]">
            {p2.name}
          </span>
          <span className="font-label text-[10px] text-coklat font-bold">
            {p2.score.toLocaleString()}
          </span>
          <div className="w-full h-24 bg-[#E0E0E0] border-2 border-tinta rounded-t-xl flex flex-col items-center justify-center shadow-stiker-sm mt-1">
            <span className="font-display font-black text-2xl text-coklat">2</span>
            <span className="font-label text-[9px] font-bold text-tinta">PERAK</span>
          </div>
        </div>

        {/* Rank 1 (Gold - Tallest) */}
        <div className="flex-1 flex flex-col items-center -mt-6">
          <div className="relative">
            <AvatarIcon id={p1.avatarId} size={58} selected />
            <Trophy className="w-5 h-5 text-emas fill-kuning absolute -top-3 -right-2" />
          </div>
          <span className="font-display font-black text-sm text-tinta mt-1 truncate max-w-[90px]">
            {p1.name}
          </span>
          <span className="font-label text-[11px] text-tinta font-extrabold">
            {p1.score.toLocaleString()}
          </span>
          <div className="w-full h-32 bg-kuning border-3 border-tinta rounded-t-2xl flex flex-col items-center justify-center shadow-stiker mt-1">
            <span className="font-display font-black text-4xl text-tinta">1</span>
            <span className="font-label text-[10px] font-black text-tinta">EMAS</span>
          </div>
        </div>

        {/* Rank 3 (Bronze) */}
        <div className="flex-1 flex flex-col items-center">
          <AvatarIcon id={p3.avatarId} size={48} />
          <span className="font-display font-black text-xs text-tinta mt-1 truncate max-w-[80px]">
            {p3.name}
          </span>
          <span className="font-label text-[10px] text-coklat font-bold">
            {p3.score.toLocaleString()}
          </span>
          <div className="w-full h-20 bg-[#D4A373] border-2 border-tinta rounded-t-xl flex flex-col items-center justify-center shadow-stiker-sm mt-1">
            <span className="font-display font-black text-2xl text-white">3</span>
            <span className="font-label text-[9px] font-bold text-white">PERUNGGU</span>
          </div>
        </div>
      </div>

      {/* User's Personal Result Card */}
      <PaperCard variant="memo" className="w-full p-4 mt-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-label text-[11px] font-bold text-coklat uppercase tracking-wider block">
              {lang === "id" ? "PERINGKAT KAMU" : "YOUR RANK"}
            </span>
            <div className="font-display font-black text-2xl text-tinta flex items-center gap-1.5">
              <span>#{playerRank}</span>
              <span className="text-sm font-semibold text-coklat">
                {lang === "id" ? `dari ${totalPlayers} peserta` : `of ${totalPlayers} players`}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="font-label text-[11px] font-bold text-coklat uppercase tracking-wider block">
              {lang === "id" ? "AKURASI SOAL" : "ACCURACY"}
            </span>
            <div className="font-display font-black text-xl text-benar flex items-center justify-end gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>{correctCount}/{totalQuestions}</span>
            </div>
          </div>
        </div>
      </PaperCard>

      {/* Finish / Play Again Button */}
      <div className="w-full pt-3">
        <StickerButton
          variant="primary"
          size="lg"
          className="w-full text-xl"
          onClick={onFinish}
        >
          {lang === "id" ? "Selesai & Keluar ➔" : "Finish & Exit ➔"}
        </StickerButton>
      </div>
    </div>
  );
};
