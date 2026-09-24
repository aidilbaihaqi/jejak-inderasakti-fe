import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { PaperCard } from "../ui/PaperCard";
import { StickerButton } from "../ui/StickerButton";
import { LogoInderasakti } from "../assets/LogoInderasakti";
import { AvatarIcon } from "../assets/AvatarCollection";
import { Trophy, Download, PlusCircle, ArrowLeft } from "lucide-react";

import { getRoomResultsCsv } from "@/lib/api";

interface FinalResult {
  rank: number;
  name: string;
  school: string;
  avatarId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: string;
}

interface HostPodiumExportProps {
  roomCode: string;
  roomName: string;
  roomId?: string;
  hostToken?: string | null;
  results?: FinalResult[];
  onNewSession: () => void;
  onBackToRooms?: () => void;
}

export const HostPodiumExport: React.FC<HostPodiumExportProps> = ({
  roomCode = "------",
  roomName = "Sesi Kuis",
  roomId,
  hostToken,
  results = [],
  onNewSession,
  onBackToRooms,
}) => {
  // Fire celebratory fireworks confetti on load
  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FFC629", "#C8922A", "#8B5A2B", "#2F7D4F", "#2E7EA0"],
    });
  }, []);

  const handleDownloadCsv = async () => {
    if (hostToken && roomId && hostToken !== "demo-mock-jwt-token") {
      try {
        const csvText = await getRoomResultsCsv(hostToken, roomId);
        const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `rekap_nilai_jejak_inderasakti_${roomCode}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return;
      } catch (err) {
        console.warn("Failed to download CSV from API, falling back to local generator:", err);
      }
    }

    const headers = ["Peringkat", "Nama Siswa", "Asal Sekolah", "Skor Akhir", "Benar", "Total Soal", "Durasi"];
    const rows = results.map((r) => [
      r.rank,
      `"${r.name}"`,
      `"${r.school}"`,
      r.score,
      r.correctAnswers,
      r.totalQuestions,
      `"${r.timeTaken}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `rekap_nilai_jejak_inderasakti_${roomCode}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const p1 = results[0];
  const p2 = results[1];
  const p3 = results[2];

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
              className="px-3 py-1.5 rounded-xl border-2 border-tinta bg-kertas-putih font-body text-xs font-bold text-tinta hover:bg-kraft/70 btn-pressable shadow-stiker-sm flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Daftar Ruangan</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleDownloadCsv}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-kuning text-tinta border-2 border-tinta font-display font-black text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 btn-pressable shadow-stiker-sm hover:bg-[#FFD147]"
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Unduh Rekap Nilai (CSV)</span>
          </button>

          <StickerButton
            variant="secondary"
            size="sm"
            onClick={onNewSession}
            className="flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Buat Sesi Baru</span>
          </StickerButton>
        </div>
      </div>

      {/* Main Grid: Podium on Left, Full Results Table on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 flex-1">
        {/* Left Side: Projector 3-Tier Podium */}
        <div className="lg:col-span-5 flex flex-col">
          <PaperCard variant="memo" className="p-4 sm:p-5 flex-1 flex flex-col items-center justify-between text-center">
            <span className="font-label text-xs font-bold text-emas tracking-widest uppercase">
              ✦ HASIL AKHIR SESI KUIS ✦
            </span>
            <h3 className="font-display font-black text-2xl text-tinta">
              Tiga Besar Juara
            </h3>

            {/* Podium Display */}
            {results.length === 0 ? (
              <div className="my-auto py-10 flex flex-col items-center justify-center text-center">
                <Trophy className="w-12 h-12 text-emas/40 mb-2 stroke-[1.5]" />
                <h4 className="font-display font-black text-base text-tinta">
                  Belum Ada Data Juara
                </h4>
                <p className="font-body text-xs text-coklat font-semibold mt-1 max-w-xs">
                  Nilai juara dan podium akan tampil otomatis setelah peserta menyelesaikan kuis.
                </p>
              </div>
            ) : (
              <div className="w-full flex items-end justify-center gap-2 px-2 my-auto pt-6">
                {/* Rank 2 (Silver) */}
                {p2 ? (
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
                      <span className="font-label text-[8px] font-bold text-tinta">PERAK</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1" />
                )}

                {/* Rank 1 (Gold - Tallest) */}
                {p1 && (
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
                      <span className="font-label text-[9px] font-black text-tinta">EMAS</span>
                    </div>
                  </div>
                )}

                {/* Rank 3 (Bronze) */}
                {p3 ? (
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
                      <span className="font-label text-[8px] font-bold text-white">PERUNGGU</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1" />
                )}
              </div>
            )}

            <div className="w-full pt-3 border-t border-dashed border-kraft text-xs font-body font-bold text-coklat">
              Selamat kepada para juara penjelajah cilik Pulau Penyengat!
            </div>
          </PaperCard>
        </div>

        {/* Right Side: Full Student Ranking Table */}
        <div className="lg:col-span-7 flex flex-col">
          <PaperCard variant="memo" className="p-5 flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-kraft mb-3">
              <h3 className="font-display font-black text-lg text-tinta">
                Tabel Rekapitulasi Nilai Siswa
              </h3>
              <span className="font-label text-xs text-coklat font-bold">
                {results.length} Peserta Selesai
              </span>
            </div>

            {/* Table */}
            {results.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                <span className="font-display font-black text-sm text-tinta">
                  Belum Ada Data Rekapitulasi
                </span>
                <span className="font-body text-xs text-coklat font-semibold mt-1">
                  Hasil pengerjaan kuis siswa akan muncul otomatis di sini.
                </span>
              </div>
            ) : (
              <div className="overflow-x-auto flex-1 max-h-[380px] -mx-1 sm:mx-0">
                <table className="w-full min-w-[460px] text-left font-body text-xs">
                  <thead>
                    <tr className="border-b-2 border-tinta/30 font-display font-extrabold text-coklat uppercase text-[10px]">
                      <th className="py-2 px-1">#</th>
                      <th className="py-2 px-2">Nama</th>
                      <th className="py-2 px-2">Sekolah</th>
                      <th className="py-2 px-2 text-right">Skor</th>
                      <th className="py-2 px-2 text-center">Benar</th>
                      <th className="py-2 px-2 text-right">Waktu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-kraft">
                    {results.map((r) => (
                      <tr
                        key={r.rank}
                        className={`hover:bg-kuning/20 transition-colors ${
                          r.rank <= 3 ? "font-bold text-tinta" : "text-tinta/80"
                        }`}
                      >
                        <td className="py-2 px-1 font-label font-bold">
                          {r.rank === 1 ? "🥇" : r.rank === 2 ? "🥈" : r.rank === 3 ? "🥉" : r.rank}
                        </td>
                        <td className="py-2 px-2 flex items-center gap-1.5 font-bold">
                          <AvatarIcon id={r.avatarId} size={24} />
                          <span className="truncate max-w-[100px] sm:max-w-none">{r.name}</span>
                        </td>
                        <td className="py-2 px-2 text-coklat truncate max-w-[120px] sm:max-w-[150px]">
                          {r.school}
                        </td>
                        <td className="py-2 px-2 text-right font-label font-black text-tinta">
                          {r.score.toLocaleString()}
                        </td>
                        <td className="py-2 px-2 text-center font-label text-benar font-bold">
                          {r.correctAnswers}/{r.totalQuestions}
                        </td>
                        <td className="py-2 px-2 text-right font-label text-coklat">
                          {r.timeTaken}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Footer CSV button note */}
            <div className="mt-4 pt-3 border-t border-dashed border-kraft flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs font-label">
              <span className="text-coklat font-bold">
                Format file: CSV (Kompatibel dengan Microsoft Excel)
              </span>
              <button
                type="button"
                onClick={handleDownloadCsv}
                className="font-display font-bold text-tinta underline hover:text-coklat flex items-center gap-1 self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5" />
                Unduh Sekarang
              </button>
            </div>
          </PaperCard>
        </div>
      </div>
    </div>
  );
};
