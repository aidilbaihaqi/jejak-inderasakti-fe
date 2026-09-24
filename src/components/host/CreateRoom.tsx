import React, { useState } from "react";
import { PaperCard } from "../ui/PaperCard";
import { StickerButton } from "../ui/StickerButton";
import {
  PlusCircle,
  Users,
  Play,
  Monitor,
  Trophy,
  Trash2,
  Ticket,
  Clock,
  CheckCircle2,
  X,
  AlertCircle,
} from "lucide-react";

export interface HostRoom {
  id: string;
  pin: string;
  name: string;
  gradeLevel: "SD" | "SMP" | "SMA";
  sessionMode: "NORMAL" | "QUICK";
  playerCount: number;
  maxPlayers: number;
  status: "LOBBY" | "RUNNING" | "FINISHED";
  createdAt: string;
}

interface CreateRoomProps {
  rooms?: HostRoom[];
  onSelectRoom: (room: HostRoom, action: "lobby" | "monitor" | "podium") => void;
  onCreateRoom: (config: {
    gradeLevel: "SD" | "SMP" | "SMA";
    sessionMode: "NORMAL" | "QUICK";
    roomName: string;
    pin: string;
  }) => void;
  onDeleteRoom?: (roomId: string) => void;
  onLogout: () => void;
}

const INITIAL_ROOMS: HostRoom[] = [];

export const CreateRoom: React.FC<CreateRoomProps> = ({
  rooms,
  onSelectRoom,
  onCreateRoom,
  onDeleteRoom,
  onLogout,
}) => {
  const [internalRooms, setInternalRooms] = useState<HostRoom[]>(INITIAL_ROOMS);
  const roomList = rooms ?? internalRooms;
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [gradeLevel, setGradeLevel] = useState<"SD" | "SMP" | "SMA">("SMP");
  const [sessionMode, setSessionMode] = useState<"NORMAL" | "QUICK">("NORMAL");
  const [roomName, setRoomName] = useState("");

  const maxActiveRooms = 5;
  const canCreateMore = roomList.length < maxActiveRooms;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) return;

    // Generate random 6-digit PIN
    const randomPin = Math.floor(100000 + Math.random() * 900000).toString();

    const newRoom: HostRoom = {
      id: `room-${Date.now()}`,
      pin: randomPin,
      name: roomName.trim(),
      gradeLevel,
      sessionMode,
      playerCount: 0,
      maxPlayers: 15,
      status: "LOBBY",
      createdAt: "Baru saja",
    };

    setInternalRooms((prev) => [newRoom, ...prev]);
    onCreateRoom({
      gradeLevel,
      sessionMode,
      roomName: newRoom.name,
      pin: newRoom.pin,
    });
    setRoomName("");
    setIsCreatingNew(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setInternalRooms((prev) => prev.filter((r) => r.id !== id));
    onDeleteRoom?.(id);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col min-h-0 px-2 sm:px-4 py-3 sm:p-4 overflow-y-auto pb-safe">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b-2 border-tinta/20 mb-4 sm:mb-5">
        <div>
          <span className="font-label text-[11px] sm:text-xs font-bold text-coklat tracking-wider uppercase block">
            PORTAL GURU & HOST
          </span>
          <h2 className="font-display font-black text-xl sm:text-3xl text-tinta">
            Manajemen Ruangan Kuis
          </h2>
          <p className="font-body text-xs text-coklat font-semibold mt-0.5">
            Host dapat mengelola hingga {maxActiveRooms} ruangan kuis aktif secara bersamaan.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-kertas-putih border-2 border-tinta font-label font-bold text-xs text-tinta shadow-stiker-sm flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-emas" />
            <span>
              {roomList.length}/{maxActiveRooms} Ruangan Aktif
            </span>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="px-3.5 py-1.5 rounded-xl border-2 border-tinta bg-kraft font-body text-xs font-bold text-tinta hover:bg-kraft/70 btn-pressable shadow-stiker-sm"
          >
            Keluar
          </button>
        </div>
      </div>

      {/* Main Content: Room List or Creation Form */}
      <div className="flex-1 w-full">
        {/* Active Rooms Grid */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <h3 className="font-display font-black text-base sm:text-lg text-tinta flex items-center gap-2">
              <Ticket className="w-5 h-5 text-emas flex-shrink-0" />
              <span>Daftar Ruangan Sesi ({roomList.length})</span>
            </h3>

            {!isCreatingNew && (
              <StickerButton
                variant="primary"
                size="sm"
                onClick={() => setIsCreatingNew(true)}
                disabled={!canCreateMore}
                className="flex items-center justify-center gap-1.5 w-full sm:w-auto"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Buat Ruangan Baru</span>
              </StickerButton>
            )}
          </div>

          {/* Creation Form (if opened) */}
          {isCreatingNew && (
            <PaperCard variant="memo" washiTape washiTapeText="BUAT RUANGAN BARU" className="p-5 sm:p-6 mb-4 animate-fade-in">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-dashed border-kraft">
                <span className="font-display font-black text-base text-tinta">
                  Konfigurasi Sesi Kuis Baru
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="w-7 h-7 rounded-full bg-kraft flex items-center justify-center text-tinta hover:bg-kraft/80"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div>
                  <label className="block font-display font-extrabold text-xs text-tinta mb-1">
                    Nama Ruangan / Keterangan Kelas
                  </label>
                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Contoh: Kelas 8-A Sejarah Riau"
                    required
                    className="w-full px-3.5 py-2 rounded-xl border-2 border-tinta bg-kertas font-body font-bold text-sm text-tinta outline-none focus:bg-white focus:shadow-stiker-sm transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Grade Level SD/SMP/SMA */}
                  <div>
                    <label className="block font-display font-extrabold text-xs text-tinta mb-1.5">
                      Jenjang Peserta
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(["SD", "SMP", "SMA"] as const).map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setGradeLevel(lvl)}
                          className={`py-1.5 rounded-lg border-2 border-tinta font-display font-black text-xs transition-all ${
                            gradeLevel === lvl
                              ? "bg-kuning text-tinta shadow-stiker-sm"
                              : "bg-kertas text-coklat hover:bg-kraft"
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mode Sesi Normal vs Singkat */}
                  <div>
                    <label className="block font-display font-extrabold text-xs text-tinta mb-1.5">
                      Mode Sesi
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSessionMode("NORMAL")}
                        className={`py-1.5 px-2 rounded-lg border-2 border-tinta font-display font-bold text-xs text-center transition-all ${
                          sessionMode === "NORMAL"
                            ? "bg-kuning text-tinta shadow-stiker-sm"
                            : "bg-kertas text-coklat hover:bg-kraft"
                        }`}
                      >
                        Normal (15 Soal)
                      </button>
                      <button
                        type="button"
                        onClick={() => setSessionMode("QUICK")}
                        className={`py-1.5 px-2 rounded-lg border-2 border-tinta font-display font-bold text-xs text-center transition-all ${
                          sessionMode === "QUICK"
                            ? "bg-kuning text-tinta shadow-stiker-sm"
                            : "bg-kertas text-coklat hover:bg-kraft"
                        }`}
                      >
                        Singkat (10 Soal)
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingNew(false)}
                    className="px-4 py-2 rounded-xl border border-tinta bg-kraft font-body text-xs font-bold text-tinta"
                  >
                    Batal
                  </button>
                  <StickerButton variant="primary" size="sm" type="submit">
                    Terbitkan Ruangan ➔
                  </StickerButton>
                </div>
              </form>
            </PaperCard>
          )}

          {/* Rooms List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {roomList.map((room) => {
              const isLobby = room.status === "LOBBY";
              const isRunning = room.status === "RUNNING";
              const isFinished = room.status === "FINISHED";

              return (
                <div
                  key={room.id}
                  className="rounded-2xl border-3 border-tinta bg-kertas-putih shadow-stiker p-4 flex flex-col justify-between transition-transform hover:-translate-y-0.5"
                >
                  {/* Card Header: PIN & Status Badge */}
                  <div className="flex items-center justify-between pb-2 border-b border-dashed border-kraft mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-label text-[10px] font-bold text-coklat">PIN:</span>
                      <span className="font-label font-black text-lg text-tinta tracking-widest bg-kraft/50 px-2 py-0.5 rounded-lg border border-tinta/30">
                        {room.pin}
                      </span>
                    </div>

                    {/* Status Pill */}
                    <span
                      className={`font-label text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isLobby
                          ? "bg-kuning text-tinta border-tinta"
                          : isRunning
                          ? "bg-benar text-white border-benar animate-pulse"
                          : "bg-kraft text-coklat border-tinta/40"
                      }`}
                    >
                      {isLobby ? "● Menunggu Lobby" : isRunning ? "● Kuis Berjalan" : "✓ Selesai"}
                    </span>
                  </div>

                  {/* Room Body Info */}
                  <div className="space-y-1.5 mb-4">
                    <h4 className="font-display font-black text-base text-tinta leading-snug line-clamp-1">
                      {room.name}
                    </h4>

                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="px-2 py-0.5 rounded-md bg-kraft/60 font-label font-bold text-[10px] text-tinta border border-tinta/20">
                        {room.gradeLevel}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-kraft/60 font-label font-bold text-[10px] text-tinta border border-tinta/20">
                        {room.sessionMode === "NORMAL" ? "15 Soal" : "10 Soal"}
                      </span>
                      <span className="font-body text-xs font-bold text-coklat flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-emas" />
                        {room.playerCount}/{room.maxPlayers} Siswa
                      </span>
                    </div>
                  </div>

                  {/* Room Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-dashed border-kraft">
                    {isLobby && (
                      <button
                        type="button"
                        onClick={() => onSelectRoom(room, "lobby")}
                        className="flex-1 py-2 px-3 rounded-xl bg-kuning border-2 border-tinta font-display font-black text-xs text-tinta flex items-center justify-center gap-1.5 btn-pressable shadow-stiker-sm hover:bg-[#FFD147]"
                      >
                        <Play className="w-3.5 h-3.5 fill-tinta" />
                        <span>Lobby Proyektor</span>
                      </button>
                    )}

                    {isRunning && (
                      <button
                        type="button"
                        onClick={() => onSelectRoom(room, "monitor")}
                        className="flex-1 py-2 px-3 rounded-xl bg-benar text-white border-2 border-tinta font-display font-black text-xs flex items-center justify-center gap-1.5 btn-pressable shadow-stiker-sm hover:bg-[#14663A]"
                      >
                        <Monitor className="w-3.5 h-3.5" />
                        <span>Monitor Live</span>
                      </button>
                    )}

                    {isFinished && (
                      <button
                        type="button"
                        onClick={() => onSelectRoom(room, "podium")}
                        className="flex-1 py-2 px-3 rounded-xl bg-kraft text-tinta border-2 border-tinta font-display font-black text-xs flex items-center justify-center gap-1.5 btn-pressable shadow-stiker-sm hover:bg-kraft/80"
                      >
                        <Trophy className="w-3.5 h-3.5 text-emas" />
                        <span>Lihat Rekap & CSV</span>
                      </button>
                    )}

                    {/* Delete Room Button */}
                    <button
                      type="button"
                      onClick={(e) => handleDelete(room.id, e)}
                      className="w-8 h-8 rounded-xl border border-tinta/40 bg-kertas hover:bg-red-100 text-salah flex items-center justify-center transition-colors"
                      title="Hapus Ruangan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State / Limit Note */}
          {roomList.length === 0 && (
            <div className="w-full p-8 rounded-3xl border-2 border-dashed border-tinta/40 text-center bg-kertas-putih">
              <Ticket className="w-12 h-12 text-coklat/50 mx-auto mb-2" />
              <h4 className="font-display font-bold text-base text-tinta">
                Belum ada ruangan yang dibuat
              </h4>
              <p className="font-body text-xs text-coklat mt-1">
                Klik tombol "+ Buat Ruangan Baru" di atas untuk memulai sesi kuis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
