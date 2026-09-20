import React, { useState } from "react";
import { PaperCard } from "../ui/PaperCard";
import { StickerButton } from "../ui/StickerButton";
import { PlusCircle, Settings, Users, Sparkles, BookCheck } from "lucide-react";

interface H2Props {
  onCreateRoom: (config: {
    gradeLevel: "SD" | "SMP" | "SMA";
    sessionMode: "NORMAL" | "QUICK";
    roomName: string;
  }) => void;
  onLogout: () => void;
}

export const H2_CreateRoom: React.FC<H2Props> = ({
  onCreateRoom,
  onLogout,
}) => {
  const [gradeLevel, setGradeLevel] = useState<"SD" | "SMP" | "SMA">("SMP");
  const [sessionMode, setSessionMode] = useState<"NORMAL" | "QUICK">("NORMAL");
  const [roomName, setRoomName] = useState("Kelas 8-B — Sejarah Riau");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateRoom({
      gradeLevel,
      sessionMode,
      roomName,
    });
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col justify-between min-h-[600px] p-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-tinta/20 mb-4">
        <div>
          <span className="font-label text-xs font-bold text-coklat tracking-wider uppercase block">
            DASHBOARD GURU
          </span>
          <h2 className="font-display font-black text-2xl text-tinta">
            Pengaturan Sesi Kuis Baru
          </h2>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="px-3 py-1.5 rounded-xl border border-tinta bg-kraft font-body text-xs font-bold text-tinta hover:bg-kraft/70 btn-pressable shadow-xs"
        >
          Keluar
        </button>
      </div>

      {/* Main Settings Card */}
      <div className="my-auto w-full">
        <PaperCard variant="memo" washiTape washiTapeText="KONFIGURASI ROOM" className="p-6 space-y-5">
          <form onSubmit={handleCreate} className="space-y-5">
            {/* Room Label / Title */}
            <div>
              <label className="block font-display font-extrabold text-sm text-tinta mb-1.5">
                Nama / Keterangan Sesi
              </label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Contoh: Kelas 8-B Sejarah"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-tinta bg-kertas font-body font-bold text-sm text-tinta outline-none focus:bg-white focus:shadow-stiker-sm transition-all"
              />
            </div>

            {/* Target Grade Level */}
            <div>
              <label className="block font-display font-extrabold text-sm text-tinta mb-2">
                Pilih Jenjang Peserta Didik
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {(
                  [
                    { id: "SD", label: "SD / MI", desc: "Bahasa santai & visual besar" },
                    { id: "SMP", label: "SMP / MTs", desc: "Kompetitif & terukur" },
                    { id: "SMA", label: "SMA / SMK", desc: "Soal historis analitis" },
                  ] as const
                ).map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setGradeLevel(lvl.id)}
                    className={`p-3 rounded-2xl border-2 border-tinta text-center transition-all btn-pressable ${
                      gradeLevel === lvl.id
                        ? "bg-kuning shadow-stiker ring-2 ring-tinta"
                        : "bg-kertas hover:bg-kraft/40 shadow-stiker-sm"
                    }`}
                  >
                    <div className="font-display font-black text-base text-tinta">
                      {lvl.label}
                    </div>
                    <div className="font-body text-[10px] text-coklat font-semibold mt-0.5">
                      {lvl.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Session Mode: Normal (15 soal) vs Quick (10 soal) */}
            <div>
              <label className="block font-display font-extrabold text-sm text-tinta mb-2">
                Durasi & Mode Kuis
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSessionMode("NORMAL")}
                  className={`p-3.5 rounded-2xl border-2 border-tinta text-left transition-all btn-pressable ${
                    sessionMode === "NORMAL"
                      ? "bg-kuning shadow-stiker ring-2 ring-tinta"
                      : "bg-kertas hover:bg-kraft/40 shadow-stiker-sm"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-display font-black text-base text-tinta">
                      Sesi Normal
                    </span>
                    <span className="font-label text-[10px] font-bold bg-white/70 px-1.5 py-0.5 rounded border border-tinta/30">
                      Standar
                    </span>
                  </div>
                  <div className="font-body text-xs text-coklat font-semibold">
                    15 Soal (3 soal per situs)
                  </div>
                  <div className="font-label text-[11px] text-tinta font-bold mt-1">
                    ⏱️ Estimasi 5–10 menit
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSessionMode("QUICK")}
                  className={`p-3.5 rounded-2xl border-2 border-tinta text-left transition-all btn-pressable ${
                    sessionMode === "QUICK"
                      ? "bg-kuning shadow-stiker ring-2 ring-tinta"
                      : "bg-kertas hover:bg-kraft/40 shadow-stiker-sm"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-display font-black text-base text-tinta">
                      Sesi Singkat
                    </span>
                    <span className="font-label text-[10px] font-bold bg-white/70 px-1.5 py-0.5 rounded border border-tinta/30">
                      Cepat
                    </span>
                  </div>
                  <div className="font-body text-xs text-coklat font-semibold">
                    10 Soal (2 soal per situs)
                  </div>
                  <div className="font-label text-[11px] text-tinta font-bold mt-1">
                    ⏱️ Estimasi ±4 menit
                  </div>
                </button>
              </div>
            </div>

            {/* Room Info Note */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-kraft/40 border border-tinta/30 text-xs font-body font-bold text-coklat">
              <Users className="w-4 h-4 text-emas flex-shrink-0" />
              <span>
                Kapasitas maksimal 15 siswa per room. PIN 6 digit dan QR akan dibuat otomatis.
              </span>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <StickerButton
                type="submit"
                variant="primary"
                size="lg"
                className="w-full text-xl flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Buka Room Kuis Sekarang ➔</span>
              </StickerButton>
            </div>
          </form>
        </PaperCard>
      </div>
    </div>
  );
};
