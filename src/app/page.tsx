"use client";

import React, { useState } from "react";
import { LanguageSelect } from "@/components/player/LanguageSelect";
import { PinEntry } from "@/components/player/PinEntry";
import { Registration } from "@/components/player/Registration";
import { PlayerLobby } from "@/components/player/PlayerLobby";
import { IslandMap } from "@/components/player/IslandMap";
import { SiteIntroCard } from "@/components/player/SiteIntroCard";
import { QuizQuestion, QuestionData } from "@/components/player/QuizQuestion";
import { AnswerFeedback } from "@/components/player/AnswerFeedback";
import { StageSummary } from "@/components/player/StageSummary";
import { FinalPodium } from "@/components/player/FinalPodium";

import { HostLogin } from "@/components/host/HostLogin";
import { CreateRoom, HostRoom } from "@/components/host/CreateRoom";
import { HostLobby } from "@/components/host/HostLobby";
import { HostMonitor } from "@/components/host/HostMonitor";
import { HostPodiumExport } from "@/components/host/HostPodiumExport";

import {
  Compass,
  Globe,
  Volume2,
  VolumeX,
  KeyRound,
  Gamepad2,
  Menu,
  X,
  Sparkles,
  MapPin,
  CheckCircle2,
  Trophy,
  Users,
  School,
  FileText,
} from "lucide-react";

export type ScreenKey =
  | "pilih-bahasa"
  | "masukkan-pin"
  | "daftar-peserta"
  | "ruang-tunggu"
  | "peta-jelajah"
  | "info-situs"
  | "kuis-soal"
  | "hasil-jawaban"
  | "kartu-warisan"
  | "podium-juara"
  | "host-login"
  | "host-buat-room"
  | "host-lobby"
  | "host-monitor"
  | "host-hasil-ekspor";

const MOCK_QUESTIONS: Record<number, QuestionData> = {
  1: {
    id: "q-1-1",
    stageId: 1,
    questionNumber: 1,
    totalQuestions: 3,
    textId: "Berapa jumlah kubah yang terdapat pada bangunan Masjid Raya Sultan Riau di Pulau Penyengat?",
    textEn: "How many domes are there on the Sultan Riau Grand Mosque in Penyengat Island?",
    options: [
      { key: "A", textId: "9 Kubah", textEn: "9 Domes" },
      { key: "B", textId: "11 Kubah", textEn: "11 Domes" },
      { key: "C", textId: "13 Kubah", textEn: "13 Domes" },
      { key: "D", textId: "17 Kubah", textEn: "17 Domes" },
    ],
    correctKey: "C",
    explanationId:
      "Masjid Raya Sultan Riau memiliki total 13 kubah dan 4 menara, yang jika dijumlahkan melambangkan 17 rakaat dalam salat fardhu lima waktu.",
    explanationEn:
      "The Grand Mosque features 13 domes and 4 minarets, symbolizing the 17 units of obligatory daily prayers.",
  },
  2: {
    id: "q-2-1",
    stageId: 2,
    questionNumber: 1,
    totalQuestions: 3,
    textId: "Karya sastra Melayu terkenal gubahan Raja Ali Haji pada tahun 1847 adalah...",
    textEn: "The famous Malay literary work composed by Raja Ali Haji in 1847 is...",
    options: [
      { key: "A", textId: "Gurindam Dua Belas", textEn: "Gurindam Dua Belas" },
      { key: "B", textId: "Hikayat Hang Tuah", textEn: "Hikayat Hang Tuah" },
      { key: "C", textId: "Syair Siti Zubaidah", textEn: "Syair Siti Zubaidah" },
      { key: "D", textId: "Bustanul Katibin", textEn: "Bustanul Katibin" },
    ],
    correctKey: "A",
    explanationId:
      "Gurindam Dua Belas adalah mahakarya puisi didaktik 12 pasal yang berisi nasihat moral, kepemimpinan, dan keagamaan.",
    explanationEn:
      "Gurindam Dua Belas is a monumental 12-chapter didactic poem offering guidance on ethics, governance, and spiritual life.",
  },
  3: {
    id: "q-3-1",
    stageId: 3,
    questionNumber: 1,
    totalQuestions: 3,
    textId: "Siapakah Yang Dipertuan Muda Riau VIII yang mendiami dan memimpin dari Istana Kantor?",
    textEn: "Who was the 8th Viceroy of Riau who resided and governed from Istana Kantor?",
    options: [
      { key: "A", textId: "Raja Ja'afar", textEn: "Raja Ja'afar" },
      { key: "B", textId: "Raja Ali Marhum Kantor", textEn: "Raja Ali Marhum Kantor" },
      { key: "C", textId: "Raja Haji Fisabilillah", textEn: "Raja Haji Fisabilillah" },
      { key: "D", textId: "Raja Abdullah", textEn: "Raja Abdullah" },
    ],
    correctKey: "B",
    explanationId:
      "Istana Kantor dibangun pada masa Yang Dipertuan Muda Riau VIII, Raja Ali (1844-1857), yang setelah mangkat bergelar Marhum Kantor.",
    explanationEn:
      "Istana Kantor was constructed during the reign of Viceroy Raja Ali (1844-1857), posthumously honored as Marhum Kantor.",
  },
  4: {
    id: "q-4-1",
    stageId: 4,
    questionNumber: 1,
    totalQuestions: 3,
    textId: "Fungsi utama Gedung Tabib pada masa Kesultanan Riau-Lingga adalah sebagai...",
    textEn: "The primary function of the Physician's House during the sultanate era was...",
    options: [
      { key: "A", textId: "Pusat peracikan obat & tempat tinggal tabib kerajaan", textEn: "Medicine dispensary & royal healer residence" },
      { key: "B", textId: "Pos benteng pertahanan tepi laut", textEn: "Coastal defense lookout outpost" },
      { key: "C", textId: "Gudang penyimpanan naskah kuno", textEn: "Ancient manuscript storage repository" },
      { key: "D", textId: "Dapur umum istana kesultanan", textEn: "Royal palace community kitchen" },
    ],
    correctKey: "A",
    explanationId:
      "Gedung Tabib merupakan tempat tinggal dan klinik tabib kerajaan yang meracik herbal tanaman obat tradisional untuk kerabat kesultanan.",
    explanationEn:
      "The building served as both the residence and clinic of the royal apothecary formulating indigenous herbal cures.",
  },
  5: {
    id: "q-5-1",
    stageId: 5,
    questionNumber: 1,
    totalQuestions: 3,
    textId: "Apakah keistimewaan alami yang dimiliki sumur Perigi Puteri di Pulau Penyengat?",
    textEn: "What is the unique natural feature of Perigi Puteri well on Penyengat Island?",
    options: [
      { key: "A", textId: "Airnya tetap tawar & jernih meski berada di tepi laut", textEn: "Its water stays fresh & sweet right beside the seawater" },
      { key: "B", textId: "Airnya mengeluarkan aroma rempah harum", textEn: "Its water emanates a natural fragrance" },
      { key: "C", textId: "Bisa berubah warna setiap hari Jumat", textEn: "It changes color every Friday" },
      { key: "D", textId: "Airnya bersuhu hangat sepanjang tahun", textEn: "Its water remains warm year-round" },
    ],
    correctKey: "A",
    explanationId:
      "Perigi Puteri adalah sumur mata air tawar alami yang berada tepat di pinggir pantai berbatu namun airnya senantiasa tawar dan tak pernah kering.",
    explanationEn:
      "Perigi Puteri produces clear, sweet freshwater directly on the rocky coastal shore, never drying up even during severe droughts.",
  },
};

const INITIAL_HOST_ROOMS: HostRoom[] = [
  {
    id: "room-1",
    pin: "482913",
    name: "Kelas 8-B — Sejarah Riau",
    gradeLevel: "SMP",
    sessionMode: "NORMAL",
    playerCount: 8,
    maxPlayers: 15,
    status: "LOBBY",
    createdAt: "Baru saja",
  },
  {
    id: "room-2",
    pin: "719204",
    name: "Kelas 7-A — Jelajah Penyengat",
    gradeLevel: "SMP",
    sessionMode: "NORMAL",
    playerCount: 12,
    maxPlayers: 15,
    status: "RUNNING",
    createdAt: "15 menit lalu",
  },
  {
    id: "room-3",
    pin: "531980",
    name: "Kelas 9-C — Sesi Singkat",
    gradeLevel: "SMP",
    sessionMode: "QUICK",
    playerCount: 15,
    maxPlayers: 15,
    status: "FINISHED",
    createdAt: "45 menit lalu",
  },
];

export default function App() {
  // Navigation State
  const [currentStep, setCurrentStep] = useState<ScreenKey>("pilih-bahasa");
  const [lang, setLang] = useState<"id" | "en">("id");
  const [isMuted, setIsMuted] = useState(false);
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);

  // Player State
  const [pin, setPin] = useState("482913");
  const [playerName, setPlayerName] = useState("Bimo");
  const [school, setSchool] = useState("SDN 001 Tanjungpinang Kota");
  const [gradeLevel, setGradeLevel] = useState<"SD" | "SMP" | "SMA" | "UMUM">("SD");
  const [gradeClass, setGradeClass] = useState("5");
  const [avatarId, setAvatarId] = useState("1");
  const [currentStage, setCurrentStage] = useState(1);
  const [playerScore, setPlayerScore] = useState(4250);
  const [streak, setStreak] = useState(3);
  const [lastAnswer, setLastAnswer] = useState<{
    key: "A" | "B" | "C" | "D";
    isCorrect: boolean;
    earnedPoints: number;
  }>({
    key: "C",
    isCorrect: true,
    earnedPoints: 850,
  });

  // Host Multi-Room State
  const [hostEmail, setHostEmail] = useState("guru.sejarah@penyengat.id");
  const [hostRooms, setHostRooms] = useState<HostRoom[]>(INITIAL_HOST_ROOMS);
  const [selectedRoomId, setSelectedRoomId] = useState<string>("room-1");

  const currentHostRoom =
    hostRooms.find((r) => r.id === selectedRoomId) ||
    hostRooms[0] || {
      id: "room-default",
      pin: "482913",
      name: "Kelas 8-B — Sejarah Riau",
      gradeLevel: "SMP" as const,
      sessionMode: "NORMAL" as const,
      playerCount: 8,
      maxPlayers: 15,
      status: "LOBBY" as const,
      createdAt: "Baru saja",
    };

  const handleSelectRoom = (room: HostRoom, action: "lobby" | "monitor" | "podium") => {
    setSelectedRoomId(room.id);
    if (action === "lobby") setCurrentStep("host-lobby");
    else if (action === "monitor") setCurrentStep("host-monitor");
    else if (action === "podium") setCurrentStep("host-hasil-ekspor");
  };

  const handleCreateHostRoom = (config: {
    gradeLevel: "SD" | "SMP" | "SMA";
    sessionMode: "NORMAL" | "QUICK";
    roomName: string;
    pin: string;
  }) => {
    const newRoom: HostRoom = {
      id: `room-${Date.now()}`,
      pin: config.pin,
      name: config.roomName,
      gradeLevel: config.gradeLevel,
      sessionMode: config.sessionMode,
      playerCount: 0,
      maxPlayers: 15,
      status: "LOBBY",
      createdAt: "Baru saja",
    };
    setHostRooms((prev) => [newRoom, ...prev]);
    setSelectedRoomId(newRoom.id);
    setCurrentStep("host-lobby");
  };

  const handleDeleteHostRoom = (roomId: string) => {
    setHostRooms((prev) => prev.filter((r) => r.id !== roomId));
  };

  const handleStartHostSession = () => {
    setHostRooms((prev) =>
      prev.map((r) => (r.id === selectedRoomId ? { ...r, status: "RUNNING" } : r))
    );
    setCurrentStep("host-monitor");
  };

  const handleEndHostSession = () => {
    setHostRooms((prev) =>
      prev.map((r) => (r.id === selectedRoomId ? { ...r, status: "FINISHED" } : r))
    );
    setCurrentStep("host-hasil-ekspor");
  };

  const toggleLanguage = () => {
    setLang((prev) => (prev === "id" ? "en" : "id"));
  };

  const handleAnswerSubmit = (key: "A" | "B" | "C" | "D", isCorrect: boolean) => {
    const points = isCorrect ? 850 + streak * 50 : 0;
    setLastAnswer({ key, isCorrect, earnedPoints: points });
    if (isCorrect) {
      setPlayerScore((prev) => prev + points);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }
    setCurrentStep("hasil-jawaban");
  };

  const handleNextStage = () => {
    if (currentStage >= 5) {
      setCurrentStep("podium-juara");
    } else {
      setCurrentStage((prev) => prev + 1);
      setCurrentStep("peta-jelajah");
    }
  };

  const isHostView = currentStep.startsWith("host-");

  return (
    <div className="min-h-[100dvh] w-full bg-kertas text-tinta flex flex-col justify-between selection:bg-kuning selection:text-tinta relative overflow-x-hidden">
      {/* ========================================================
          MOBILE-FRIENDLY TOP NAVBAR
      ======================================================== */}
      <header className="sticky top-0 z-40 w-full bg-kertas-putih/95 backdrop-blur-md border-b-2 border-tinta/30 px-3.5 py-2.5 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Brand Identity */}
          <button
            type="button"
            onClick={() => setCurrentStep("pilih-bahasa")}
            className="flex items-center gap-2 text-left focus:outline-none group"
          >
            <div className="w-8 h-8 rounded-xl bg-kuning border-2 border-tinta flex items-center justify-center shadow-stiker-sm group-hover:bg-[#FFD147] transition-all">
              <Compass className="w-4 h-4 text-tinta" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-sm text-tinta leading-none">
                JEJAK INDERASAKTI
              </span>
              <span className="font-label text-[9px] text-coklat font-bold tracking-wider uppercase mt-0.5">
                Pulau Penyengat
              </span>
            </div>
          </button>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Language Switcher */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="px-2 py-1.5 rounded-xl border-2 border-tinta bg-kraft/60 hover:bg-kraft font-label text-xs font-bold text-tinta flex items-center gap-1 transition-all btn-pressable shadow-xs"
              title="Ganti Bahasa / Switch Language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang.toUpperCase()}</span>
            </button>

            {/* Audio Mute Toggle */}
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="w-8 h-8 rounded-xl border-2 border-tinta bg-kertas hover:bg-kraft/50 text-tinta flex items-center justify-center transition-all btn-pressable shadow-xs"
              title={isMuted ? "Aktifkan Suara" : "Bisukan Suara"}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-coklat" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-tinta" />
              )}
            </button>

            {/* Host Login Button / Icon */}
            {!isHostView ? (
              <button
                type="button"
                onClick={() => setCurrentStep("host-login")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-kuning border-2 border-tinta font-display font-black text-xs text-tinta shadow-stiker-sm btn-pressable hover:bg-[#FFD147]"
                title="Masuk ke Panel Host / Guru"
              >
                <KeyRound className="w-3.5 h-3.5 text-tinta" />
                <span>Masuk Host</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentStep("pilih-bahasa")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-kraft border-2 border-tinta font-display font-black text-xs text-tinta shadow-stiker-sm btn-pressable hover:bg-kraft/80"
                title="Kembali ke Mode Kuis Siswa"
              >
                <Gamepad2 className="w-3.5 h-3.5 text-tinta" />
                <span>Kuis Siswa</span>
              </button>
            )}

            {/* Menu Drawer Toggle */}
            <button
              type="button"
              onClick={() => setIsNavDrawerOpen(true)}
              className="w-8 h-8 rounded-xl border-2 border-tinta bg-kertas hover:bg-kraft/50 text-tinta flex items-center justify-center transition-all btn-pressable shadow-xs ml-0.5"
              title="Menu Navigasi Lengkap"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================
          MAIN VIEW AREA (Full Screen Mobile Native First)
      ======================================================== */}
      <main className="w-full flex-1 flex flex-col justify-between">
        {!isHostView ? (
          /* Native Player Screen: 100% width on phone, elegant centered column on tablet/desktop */
          <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-between">
            {currentStep === "pilih-bahasa" && (
              <LanguageSelect
                selectedLang={lang}
                onSelectLang={setLang}
                onNext={() => setCurrentStep("masukkan-pin")}
              />
            )}

            {currentStep === "masukkan-pin" && (
              <PinEntry
                pin={pin}
                onChangePin={setPin}
                onEnterRoom={() => setCurrentStep("daftar-peserta")}
                onBack={() => setCurrentStep("pilih-bahasa")}
                lang={lang}
                onToggleLang={toggleLanguage}
              />
            )}

            {currentStep === "daftar-peserta" && (
              <Registration
                name={playerName}
                setName={setPlayerName}
                school={school}
                setSchool={setSchool}
                gradeLevel={gradeLevel}
                setGradeLevel={setGradeLevel}
                gradeClass={gradeClass}
                setGradeClass={setGradeClass}
                avatarId={avatarId}
                setAvatarId={setAvatarId}
                onReady={() => setCurrentStep("ruang-tunggu")}
                onBack={() => setCurrentStep("masukkan-pin")}
                lang={lang}
              />
            )}

            {currentStep === "ruang-tunggu" && (
              <PlayerLobby
                roomCode={pin}
                playerName={playerName}
                playerAvatarId={avatarId}
                onSimulateHostStart={() => setCurrentStep("peta-jelajah")}
                lang={lang}
              />
            )}

            {currentStep === "peta-jelajah" && (
              <IslandMap
                currentStage={currentStage}
                onContinue={() => setCurrentStep("info-situs")}
                lang={lang}
              />
            )}

            {currentStep === "info-situs" && (
              <SiteIntroCard
                stageId={currentStage}
                onStartQuiz={() => setCurrentStep("kuis-soal")}
                lang={lang}
              />
            )}

            {currentStep === "kuis-soal" && (
              <QuizQuestion
                question={MOCK_QUESTIONS[currentStage] || MOCK_QUESTIONS[1]}
                score={playerScore}
                streak={streak}
                onAnswer={handleAnswerSubmit}
                lang={lang}
                isMuted={isMuted}
                onToggleMute={() => setIsMuted(!isMuted)}
                onToggleLang={toggleLanguage}
              />
            )}

            {currentStep === "hasil-jawaban" && (
              <AnswerFeedback
                question={MOCK_QUESTIONS[currentStage] || MOCK_QUESTIONS[1]}
                userAnswerKey={lastAnswer.key}
                isCorrect={lastAnswer.isCorrect}
                earnedPoints={lastAnswer.earnedPoints}
                totalScore={playerScore}
                streak={streak}
                onNext={() => setCurrentStep("kartu-warisan")}
                lang={lang}
              />
            )}

            {currentStep === "kartu-warisan" && (
              <StageSummary
                stageId={currentStage}
                stageScore={lastAnswer.earnedPoints || 1750}
                totalScore={playerScore}
                currentRank={3}
                totalPlayers={8}
                onNextStage={handleNextStage}
                lang={lang}
              />
            )}

            {currentStep === "podium-juara" && (
              <FinalPodium
                playerName={playerName}
                playerRank={1}
                totalPlayers={8}
                playerScore={playerScore}
                correctCount={14}
                totalQuestions={15}
                onFinish={() => {
                  setCurrentStage(1);
                  setCurrentStep("pilih-bahasa");
                }}
                lang={lang}
              />
            )}
          </div>
        ) : (
          /* Host Projector Views */
          <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col justify-between p-4 sm:p-6">
            {currentStep === "host-login" && (
              <HostLogin
                onLoginSuccess={(email) => {
                  setHostEmail(email);
                  setCurrentStep("host-buat-room");
                }}
                onBackToPlayer={() => setCurrentStep("pilih-bahasa")}
              />
            )}

            {currentStep === "host-buat-room" && (
              <CreateRoom
                rooms={hostRooms}
                onSelectRoom={handleSelectRoom}
                onCreateRoom={handleCreateHostRoom}
                onDeleteRoom={handleDeleteHostRoom}
                onLogout={() => setCurrentStep("host-login")}
              />
            )}

            {currentStep === "host-lobby" && (
              <HostLobby
                roomCode={currentHostRoom.pin}
                roomName={currentHostRoom.name}
                gradeLevel={currentHostRoom.gradeLevel}
                sessionMode={currentHostRoom.sessionMode}
                onStartSession={handleStartHostSession}
                onEndSession={() => setCurrentStep("host-buat-room")}
                onBackToRooms={() => setCurrentStep("host-buat-room")}
              />
            )}

            {currentStep === "host-monitor" && (
              <HostMonitor
                roomCode={currentHostRoom.pin}
                roomName={currentHostRoom.name}
                onEndSession={handleEndHostSession}
                onBackToRooms={() => setCurrentStep("host-buat-room")}
              />
            )}

            {currentStep === "host-hasil-ekspor" && (
              <HostPodiumExport
                roomCode={currentHostRoom.pin}
                roomName={currentHostRoom.name}
                onNewSession={() => setCurrentStep("host-buat-room")}
                onBackToRooms={() => setCurrentStep("host-buat-room")}
              />
            )}
          </div>
        )}
      </main>

      {/* ========================================================
          CLEAN SLIDE-OVER MOBILE MENU DRAWER
      ======================================================== */}
      {isNavDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in">
          <div
            className="w-full max-w-xs sm:max-w-sm h-full bg-kertas border-l-3 border-tinta shadow-2xl p-5 flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-kraft mb-4">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-emas" />
                  <span className="font-display font-black text-lg text-tinta">
                    Daftar Menu
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNavDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-kertas-putih border border-tinta flex items-center justify-center text-tinta hover:bg-kraft"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mode Selection
              <div className="mb-5">
                <span className="font-label text-[11px] font-bold text-coklat block mb-2 uppercase tracking-wider">
                  Beralih Mode
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep("pilih-bahasa");
                      setIsNavDrawerOpen(false);
                    }}
                    className={`p-2.5 rounded-xl border-2 border-tinta font-display font-extrabold text-xs flex items-center justify-center gap-1.5 btn-pressable ${
                      !isHostView
                        ? "bg-kuning text-tinta shadow-stiker-sm"
                        : "bg-kertas-putih text-coklat"
                    }`}
                  >
                    <Gamepad2 className="w-4 h-4" />
                    <span>Kuis Siswa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep("host-login");
                      setIsNavDrawerOpen(false);
                    }}
                    className={`p-2.5 rounded-xl border-2 border-tinta font-display font-extrabold text-xs flex items-center justify-center gap-1.5 btn-pressable ${
                      isHostView
                        ? "bg-kuning text-tinta shadow-stiker-sm"
                        : "bg-kertas-putih text-coklat"
                    }`}
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Panel Host</span>
                  </button>
                </div>
              </div> */}

              {/* Player Screen Directory with Clear Names (No P1-P10) */}
              <div className="mb-4">
                <span className="font-label text-[11px] font-bold text-coklat block mb-2 uppercase tracking-wider">
                  Alur Kuis Siswa
                </span>
                <div className="space-y-1.5">
                  {(
                    [
                      { id: "pilih-bahasa", label: "Pilih Bahasa", icon: Globe },
                      { id: "masukkan-pin", label: "Masukkan PIN Room", icon: KeyRound },
                      { id: "daftar-peserta", label: "Pendaftaran Profil", icon: Users },
                      { id: "ruang-tunggu", label: "Ruang Tunggu (Lobby)", icon: Sparkles },
                      { id: "peta-jelajah", label: "Peta Pulau Penyengat", icon: MapPin },
                      { id: "info-situs", label: "Sekilas Sejarah Situs", icon: FileText },
                      { id: "kuis-soal", label: "Kuis Soal Budaya", icon: CheckCircle2 },
                      { id: "hasil-jawaban", label: "Umpan Balik Jawaban", icon: Sparkles },
                      { id: "kartu-warisan", label: "Kartu Warisan Budaya", icon: School },
                      { id: "podium-juara", label: "Panggung Juara (Podium)", icon: Trophy },
                    ] as const
                  ).map((item, idx) => {
                    const Icon = item.icon;
                    const isActive = currentStep === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setCurrentStep(item.id);
                          setIsNavDrawerOpen(false);
                        }}
                        className={`w-full px-3 py-2 rounded-xl border text-left font-body font-bold text-xs flex items-center justify-between transition-all ${
                          isActive
                            ? "bg-kuning border-tinta text-tinta shadow-stiker-sm"
                            : "bg-kertas-putih border-tinta/30 text-coklat hover:bg-kraft"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-kraft/70 border border-tinta/30 flex items-center justify-center font-label text-[10px] font-bold text-tinta">
                            {idx + 1}
                          </span>
                          <span>{item.label}</span>
                        </div>
                        <Icon className="w-3.5 h-3.5 text-tinta/60" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Host Screen Directory with Clear Names (No H1-H5) */}
              <div className="mb-4">
                <span className="font-label text-[11px] font-bold text-coklat block mb-2 uppercase tracking-wider">
                  Panel Guru & Host
                </span>
                <div className="space-y-1.5">
                  {(
                    [
                      { id: "host-login", label: "Masuk Akun Guru" },
                      {
                        id: "host-buat-room",
                        label: `Manajemen Ruangan (${hostRooms.length}/5)`,
                      },
                      { id: "host-lobby", label: "Ruang Tunggu Proyektor" },
                      { id: "host-monitor", label: "Pemantauan Langsung" },
                      { id: "host-hasil-ekspor", label: "Hasil Akhir & Unduh CSV" },
                    ] as { id: ScreenKey; label: string }[]
                  ).map((item) => {
                    const isActive = currentStep === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setCurrentStep(item.id);
                          setIsNavDrawerOpen(false);
                        }}
                        className={`w-full px-3 py-2 rounded-xl border text-left font-body font-bold text-xs flex items-center justify-between transition-all ${
                          isActive
                            ? "bg-kuning border-tinta text-tinta shadow-stiker-sm"
                            : "bg-kertas-putih border-tinta/30 text-coklat hover:bg-kraft"
                        }`}
                      >
                        <span>{item.label}</span>
                        <KeyRound className="w-3.5 h-3.5 text-tinta/60" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="pt-3 border-t border-dashed border-kraft text-center font-label text-[10px] text-coklat">
              ✦ Jejak Inderasakti — Pulau Penyengat ✦
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
