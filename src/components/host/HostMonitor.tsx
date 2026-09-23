import React, { useState, useEffect } from "react";
import { PaperCard } from "../ui/PaperCard";
import { StickerButton } from "../ui/StickerButton";
import { LogoInderasakti } from "../assets/LogoInderasakti";
import { AvatarIcon } from "../assets/AvatarCollection";
import { Trophy, Clock, Users, Flame, AlertCircle } from "lucide-react";

interface LivePlayerScore {
  id: string;
  name: string;
  avatarId: string;
  score: number;
  stage: number;
  question: number;
  totalStages: number;
  accuracy: string; // e.g. "5/5"
}

interface HostMonitorProps {
  roomCode: string;
  roomName: string;
  onEndSession: () => void;
  onBackToRooms?: () => void;
}

const DEFAULT_MONITOR_PLAYERS: LivePlayerScore[] = [
  { id: "1", name: "Bimo", avatarId: "1", score: 12500, stage: 5, question: 3, totalStages: 5, accuracy: "14/15" },
  { id: "2", name: "Rani", avatarId: "4", score: 11200, stage: 4, question: 2, totalStages: 5, accuracy: "12/13" },
  { id: "3", name: "Ahmad", avatarId: "7", score: 10800, stage: 4, question: 1, totalStages: 5, accuracy: "11/13" },
  { id: "4", name: "Siti", avatarId: "2", score: 9800, stage: 3, question: 3, totalStages: 5, accuracy: "10/12" },
  { id: "5", name: "Farhan", avatarId: "5", score: 8600, stage: 3, question: 2, totalStages: 5, accuracy: "9/11" },
  { id: "6", name: "Aisyah", avatarId: "6", score: 7900, stage: 3, question: 1, totalStages: 5, accuracy: "8/10" },
  { id: "7", name: "Rizky", avatarId: "3", score: 7200, stage: 2, question: 3, totalStages: 5, accuracy: "7/9" },
  { id: "8", name: "Maya", avatarId: "8", score: 6500, stage: 2, question: 2, totalStages: 5, accuracy: "6/8" },
];

export const HostMonitor: React.FC<HostMonitorProps> = ({
  roomCode = "482913",
  roomName = "Kelas 8-B — Sejarah Riau",
  onEndSession,
  onBackToRooms,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(360); // 6 mins

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col justify-between min-h-[700px] p-5 sm:p-7">
      {/* Top Navbar */}
      <div className="flex items-center justify-between pb-4 border-b-3 border-tinta mb-5">
        <LogoInderasakti variant="horizontal" />

        <div className="flex items-center gap-3">
          {onBackToRooms && (
            <button
              type="button"
              onClick={onBackToRooms}
              className="px-3.5 py-1.5 rounded-xl border-2 border-tinta bg-kertas-putih font-body text-xs font-bold text-tinta hover:bg-kraft/70 btn-pressable shadow-stiker-sm"
            >
              ← Daftar Ruangan
            </button>
          )}

          {/* Room PIN Tag */}
          <div className="px-3.5 py-1.5 rounded-xl bg-kuning border-2 border-tinta font-label font-bold text-sm text-tinta shadow-stiker-sm">
            PIN: {roomCode}
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-kertas-putih border-2 border-tinta shadow-stiker-sm">
            <Clock className="w-4 h-4 text-coklat" />
            <span className="font-label font-black text-base text-tinta">
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </span>
          </div>

          {/* End Session Button */}
          <button
            type="button"
            onClick={onEndSession}
            className="px-4 py-2 rounded-xl bg-salah text-white border-2 border-tinta font-display font-black text-sm btn-pressable shadow-stiker-sm hover:bg-[#A92E2E]"
          >
            Akhiri Sesi ➔
          </button>
        </div>
      </div>

      {/* Main Split Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto">
        {/* Left Side: Live Leaderboard (Receipt Style) */}
        <div className="lg:col-span-6 flex flex-col">
          <PaperCard variant="receipt" className="p-5 flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-kraft mb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-emas" />
                <h3 className="font-display font-black text-xl text-tinta">
                  Klasemen Langsung (Live Leaderboard)
                </h3>
              </div>
              <span className="font-label text-xs text-coklat font-bold">
                8 Peserta
              </span>
            </div>

            {/* Leaderboard List */}
            <div className="space-y-2 overflow-y-auto max-h-[380px] pr-1">
              {DEFAULT_MONITOR_PLAYERS.map((player, idx) => {
                const isTop3 = idx < 3;
                return (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border-2 transition-all ${
                      idx === 0
                        ? "bg-kuning/30 border-tinta shadow-stiker-sm"
                        : idx === 1
                        ? "bg-kraft/40 border-tinta"
                        : "bg-kertas-putih border-tinta/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-full border border-tinta font-label font-black text-xs flex items-center justify-center ${
                          idx === 0
                            ? "bg-kuning text-tinta"
                            : idx === 1
                            ? "bg-[#E0E0E0] text-tinta"
                            : idx === 2
                            ? "bg-[#D4A373] text-white"
                            : "bg-kraft text-coklat"
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <AvatarIcon id={player.avatarId} size={36} />
                      <div>
                        <span className="font-display font-black text-sm text-tinta block leading-tight">
                          {player.name}
                        </span>
                        <span className="font-label text-[10px] text-coklat font-bold">
                          Akurasi: {player.accuracy}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-display font-black text-base text-tinta block">
                        {player.score.toLocaleString()}
                      </span>
                      <span className="font-label text-[10px] text-benar font-bold">
                        Stage {player.stage}/5
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </PaperCard>
        </div>

        {/* Right Side: Participant Progress Tracker */}
        <div className="lg:col-span-6 flex flex-col">
          <PaperCard variant="memo" className="p-5 flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-kraft mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emas" />
                <h3 className="font-display font-black text-xl text-tinta">
                  Progres Pengerjaan Tiap Siswa
                </h3>
              </div>
              <span className="font-label text-xs text-benar font-bold">
                Semua aktif
              </span>
            </div>

            {/* Student Progress Bars */}
            <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
              {DEFAULT_MONITOR_PLAYERS.map((player) => {
                const totalEstimatedQuestions = 15;
                const completedQuestions =
                  (player.stage - 1) * 3 + player.question;
                const pct = Math.min(
                  100,
                  Math.round((completedQuestions / totalEstimatedQuestions) * 100)
                );

                return (
                  <div
                    key={player.id}
                    className="p-3 rounded-xl bg-kertas border-2 border-tinta/50 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-sm text-tinta">
                        {player.name}
                      </span>
                      <span className="font-label text-xs font-bold text-coklat">
                        Stage {player.stage} · Soal {player.question} ({pct}%)
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-3 bg-kraft/70 rounded-full border border-tinta/40 overflow-hidden">
                      <div
                        className="h-full bg-kuning transition-all duration-300 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </PaperCard>
        </div>
      </div>
    </div>
  );
};
