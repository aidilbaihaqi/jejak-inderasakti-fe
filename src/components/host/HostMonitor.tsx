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

export interface LiveRanking {
  rank: number;
  nickname: string;
  school: string;
  score: number;
  correct_count: number;
}

interface HostMonitorProps {
  roomCode: string;
  roomName: string;
  rankings?: LiveRanking[];
  players?: { id: string; name: string; avatarId?: string; school?: string }[];
  onEndSession: () => void;
  onBackToRooms?: () => void;
}

export const HostMonitor: React.FC<HostMonitorProps> = ({
  roomCode = "------",
  roomName = "Sesi Kuis",
  rankings,
  players = [],
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
    <div className="w-full max-w-6xl mx-auto flex flex-col min-h-0 overflow-y-auto p-2 sm:p-6 pb-safe space-y-4">
      {/* Top Navbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b-2 sm:border-b-3 border-tinta">
        <LogoInderasakti variant="horizontal" />

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {onBackToRooms && (
            <button
              type="button"
              onClick={onBackToRooms}
              className="px-3 py-1.5 rounded-xl border-2 border-tinta bg-kertas-putih font-body text-xs font-bold text-tinta hover:bg-kraft/70 btn-pressable shadow-stiker-sm"
            >
              ← Daftar Ruangan
            </button>
          )}

          {/* Room PIN Tag */}
          <div className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl bg-kuning border-2 border-tinta font-label font-bold text-xs sm:text-sm text-tinta shadow-stiker-sm">
            PIN: {roomCode}
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-xl bg-kertas-putih border-2 border-tinta shadow-stiker-sm">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-coklat" />
            <span className="font-label font-black text-sm sm:text-base text-tinta">
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </span>
          </div>

          {/* End Session Button */}
          <button
            type="button"
            onClick={onEndSession}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-salah text-white border-2 border-tinta font-display font-black text-xs sm:text-sm btn-pressable shadow-stiker-sm hover:bg-[#A92E2E]"
          >
            Akhiri Sesi ➔
          </button>
        </div>
      </div>

      {/* Main Split Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 flex-1">
        {/* Left Side: Live Leaderboard (Receipt Style) */}
        <div className="lg:col-span-6 flex flex-col">
          <PaperCard variant="receipt" className="p-4 sm:p-5 flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-kraft mb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-emas" />
                <h3 className="font-display font-black text-lg sm:text-xl text-tinta">
                  Klasemen Langsung (Live Leaderboard)
                </h3>
              </div>
              <span className="font-label text-xs text-coklat font-bold">
                {rankings && rankings.length > 0 ? `${rankings.length} Peserta` : "0 Peserta"}
              </span>
            </div>

            {/* Leaderboard List */}
            <div className="space-y-2 overflow-y-auto max-h-[380px] pr-1">
              {rankings && rankings.length > 0 ? (
                rankings.map((item, idx) => (
                  <div
                    key={`rank-${item.rank}-${item.nickname}`}
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
                        {item.rank}
                      </span>
                      <div>
                        <span className="font-display font-black text-sm text-tinta block leading-tight">
                          {item.nickname}
                        </span>
                        <span className="font-label text-[10px] text-coklat font-bold">
                          {item.school || "Umum"} • {item.correct_count} benar
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-display font-black text-base text-tinta block">
                        {item.score.toLocaleString()}
                      </span>
                      <span className="font-label text-[10px] text-benar font-bold">
                        Peringkat {item.rank}
                      </span>
                    </div>
                  </div>
                ))
              ) : players && players.length > 0 ? (
                players.map((p, idx) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border-2 bg-kertas-putih border-tinta/40"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full border border-tinta font-label font-black text-xs flex items-center justify-center bg-kraft text-coklat">
                        {idx + 1}
                      </span>
                      <AvatarIcon id={p.avatarId || "1"} size={36} />
                      <div>
                        <span className="font-display font-black text-sm text-tinta block leading-tight">
                          {p.name}
                        </span>
                        <span className="font-label text-[10px] text-coklat font-bold">
                          {p.school || "Umum"} • Sedang Mengerjakan
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-display font-black text-sm text-tinta block">
                        0
                      </span>
                      <span className="font-label text-[10px] text-coklat font-bold">
                        Aktif
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center flex flex-col items-center justify-center">
                  <span className="font-display font-black text-sm text-tinta">
                    Belum Ada Peserta Menjawab
                  </span>
                  <span className="font-body text-xs text-coklat mt-1">
                    Klasemen langsung akan terupdate begitu peserta mengirim jawaban.
                  </span>
                </div>
              )}
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
                {players && players.length > 0 ? `${players.length} Peserta Aktif` : "0 Aktif"}
              </span>
            </div>

            {/* Student Progress Bars */}
            <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
              {players && players.length > 0 ? (
                players.map((player) => (
                  <div
                    key={player.id}
                    className="p-3 rounded-xl bg-kertas border-2 border-tinta/50 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AvatarIcon id={player.avatarId || "1"} size={24} />
                        <span className="font-display font-bold text-sm text-tinta">
                          {player.name}
                        </span>
                      </div>
                      <span className="font-label text-xs font-bold text-coklat">
                        {player.school || "Umum"}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-3 bg-kraft/70 rounded-full border border-tinta/40 overflow-hidden">
                      <div
                        className="h-full bg-kuning transition-all duration-300 rounded-full animate-pulse"
                        style={{ width: "65%" }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center flex flex-col items-center justify-center">
                  <span className="font-display font-black text-sm text-tinta">
                    Menunggu Peserta Aktif
                  </span>
                  <span className="font-body text-xs text-coklat mt-1">
                    Progres pengerjaan peserta akan muncul di sini saat sesi dimulai.
                  </span>
                </div>
              )}
            </div>
          </PaperCard>
        </div>
      </div>
    </div>
  );
};
