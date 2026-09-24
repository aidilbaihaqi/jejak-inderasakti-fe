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

interface FinalPodiumProps {
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


export const FinalPodium: React.FC<FinalPodiumProps> = ({
  playerName,
  playerRank = 0,
  totalPlayers = 0,
  playerScore = 0,
  correctCount = 0,
  totalQuestions = 15,
  topPlayers = [],
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

  const p1 = topPlayers.find((p) => p.rank === 1);
  const p2 = topPlayers.find((p) => p.rank === 2);
  const p3 = topPlayers.find((p) => p.rank === 3);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-between h-full max-h-full p-2.5 sm:p-3 min-h-0 overflow-hidden pb-safe">
      {/* Top Victory Title */}
      <div className="text-center pt-0.5">
        <span className="font-label text-[10px] font-bold text-emas tracking-widest uppercase">
          ✦ SELESAI PETUALANGAN ✦
        </span>
        <h1 className="font-display font-black text-2xl text-tinta leading-tight">
          {lang === "id" ? "PODIUM JUARA" : "VICTORY PODIUM"}
        </h1>
      </div>

      {/* Mascot Sakti with Golden Trophy */}
      <div className="flex justify-center -my-1">
        <MascotSakti
          pose="trophy"
          size={85}
          speechBubble={
            lang === "id"
              ? "Luar biasa! Kamu telah menjelajahi seluruh situs!"
              : "Splendid! You explored all 5 heritage sites!"
          }
        />
      </div>

      {/* 3-Tier Podium */}
      <div className="w-full flex items-end justify-center gap-1.5 px-2 my-auto">
        {/* Rank 2 (Silver) */}
        {p2 ? (
        <div className="flex-1 flex flex-col items-center">
          <AvatarIcon id={p2.avatarId} size={40} />
          <span className="font-display font-black text-xs text-tinta mt-0.5 truncate max-w-[70px]">
            {p2.name}
          </span>
          <span className="font-label text-[9px] text-coklat font-bold">
            {p2.score.toLocaleString()}
          </span>
          <div className="w-full h-16 bg-[#E0E0E0] border-2 border-tinta rounded-t-xl flex flex-col items-center justify-center shadow-stiker-sm mt-1">
            <span className="font-display font-black text-xl text-coklat">2</span>
            <span className="font-label text-[8px] font-bold text-tinta">PERAK</span>
          </div>
        </div>
        ) : (
          <div className="flex-1" />
        )}

        {/* Rank 1 (Gold - Tallest) */}
        {p1 ? (
        <div className="flex-1 flex flex-col items-center -mt-4">
          <div className="relative">
            <AvatarIcon id={p1.avatarId} size={48} selected />
            <Trophy className="w-4 h-4 text-emas fill-kuning absolute -top-2 -right-1.5" />
          </div>
          <span className="font-display font-black text-xs sm:text-sm text-tinta mt-0.5 truncate max-w-[80px]">
            {p1.name}
          </span>
          <span className="font-label text-[10px] text-tinta font-extrabold">
            {p1.score.toLocaleString()}
          </span>
          <div className="w-full h-22 bg-kuning border-2 sm:border-3 border-tinta rounded-t-2xl flex flex-col items-center justify-center shadow-stiker mt-1">
            <span className="font-display font-black text-3xl text-tinta">1</span>
            <span className="font-label text-[9px] font-black text-tinta">EMAS</span>
          </div>
        </div>
        ) : (
          <div className="flex-1" />
        )}

        {/* Rank 3 (Bronze) */}
        {p3 ? (
        <div className="flex-1 flex flex-col items-center">
          <AvatarIcon id={p3.avatarId} size={40} />
          <span className="font-display font-black text-xs text-tinta mt-0.5 truncate max-w-[70px]">
            {p3.name}
          </span>
          <span className="font-label text-[9px] text-coklat font-bold">
            {p3.score.toLocaleString()}
          </span>
          <div className="w-full h-12 bg-[#D4A373] border-2 border-tinta rounded-t-xl flex flex-col items-center justify-center shadow-stiker-sm mt-1">
            <span className="font-display font-black text-xl text-white">3</span>
            <span className="font-label text-[8px] font-bold text-white">PERUNGGU</span>
          </div>
        </div>
        ) : (
          <div className="flex-1" />
        )}
      </div>

      {/* User's Personal Result Card */}
      <PaperCard variant="memo" className="w-full p-2.5 sm:p-3 mt-1.5">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-label text-[10px] font-bold text-coklat uppercase tracking-wider block">
              {lang === "id" ? "PERINGKAT KAMU" : "YOUR RANK"}
            </span>
            <div className="font-display font-black text-xl text-tinta flex items-center gap-1.5">
              <span>#{playerRank}</span>
              <span className="text-xs font-semibold text-coklat">
                {lang === "id" ? `dari ${totalPlayers} peserta` : `of ${totalPlayers} players`}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="font-label text-[10px] font-bold text-coklat uppercase tracking-wider block">
              {lang === "id" ? "AKURASI SOAL" : "ACCURACY"}
            </span>
            <div className="font-display font-black text-lg text-benar flex items-center justify-end gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{correctCount}/{totalQuestions}</span>
            </div>
          </div>
        </div>
      </PaperCard>

      {/* Finish / Play Again Button */}
      <div className="w-full pt-1.5">
        <StickerButton
          variant="primary"
          size="md"
          className="w-full text-lg py-2.5"
          onClick={onFinish}
        >
          {lang === "id" ? "Selesai & Keluar ➔" : "Finish & Exit ➔"}
        </StickerButton>
      </div>
    </div>
  );
};
