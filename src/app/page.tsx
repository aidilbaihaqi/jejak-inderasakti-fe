"use client";

import React, { useState } from "react";
import { P1_LanguageSelect } from "@/components/player/P1_LanguageSelect";
import { P2_PinEntry } from "@/components/player/P2_PinEntry";
import { P3_Registration } from "@/components/player/P3_Registration";
import { P4_Lobby } from "@/components/player/P4_Lobby";
import { P5_IslandMap } from "@/components/player/P5_IslandMap";
import { P6_SiteIntroCard } from "@/components/player/P6_SiteIntroCard";
import { P7_QuizQuestion, QuestionData } from "@/components/player/P7_QuizQuestion";
import { P8_AnswerFeedback } from "@/components/player/P8_AnswerFeedback";
import { P9_StageSummary } from "@/components/player/P9_StageSummary";
import { P10_FinalPodium } from "@/components/player/P10_FinalPodium";

import { H1_HostLogin } from "@/components/host/H1_HostLogin";
import { H2_CreateRoom } from "@/components/host/H2_CreateRoom";
import { H3_HostLobby } from "@/components/host/H3_HostLobby";
import { H4_HostMonitor } from "@/components/host/H4_HostMonitor";
import { H5_HostPodiumExport } from "@/components/host/H5_HostPodiumExport";

import { Smartphone, Monitor, Globe, Compass, RefreshCw } from "lucide-react";

export type ScreenId =
  | "P1"
  | "P2"
  | "P3"
  | "P4"
  | "P5"
  | "P6"
  | "P7"
  | "P8"
  | "P9"
  | "P10"
  | "H1"
  | "H2"
  | "H3"
  | "H4"
  | "H5";

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

export default function App() {
  // Navigation & Screen Controller
  const [currentScreen, setCurrentScreen] = useState<ScreenId>("P1");
  const [deviceFrame, setDeviceFrame] = useState<"mobile" | "responsive">("mobile");
  const [lang, setLang] = useState<"id" | "en">("id");
  const [isMuted, setIsMuted] = useState(false);

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

  // Host State
  const [hostEmail, setHostEmail] = useState("guru.sejarah@penyengat.id");
  const [roomConfig, setRoomConfig] = useState({
    gradeLevel: "SMP",
    sessionMode: "NORMAL",
    roomName: "Kelas 8-B — Sejarah Riau",
  });

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
    setCurrentScreen("P8");
  };

  const handleNextStage = () => {
    if (currentStage >= 5) {
      setCurrentScreen("P10");
    } else {
      setCurrentStage((prev) => prev + 1);
      setCurrentScreen("P5");
    }
  };

  const isHostView = currentScreen.startsWith("H");

  return (
    <main className="min-h-screen bg-kertas flex flex-col justify-between selection:bg-kuning selection:text-tinta">
      {/* ========================================================
          TOP DEMO CONTROL BAR (Switcher & Quick Jump)
      ======================================================== */}
      <header className="sticky top-0 z-50 bg-[#F3E7CF] border-b-2 border-tinta/40 px-3 py-2 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Brand & Mode Switcher */}
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-sm text-tinta flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-emas" />
              <span>Jejak Inderasakti</span>
            </span>

            {/* Mode Switch Pills */}
            <div className="flex items-center rounded-xl bg-kertas-putih border-2 border-tinta p-0.5 shadow-xs">
              <button
                type="button"
                onClick={() => {
                  setDeviceFrame("mobile");
                  setCurrentScreen("P1");
                }}
                className={`px-2.5 py-1 rounded-lg font-display font-extrabold text-xs flex items-center gap-1.5 transition-all ${
                  !isHostView
                    ? "bg-kuning text-tinta shadow-xs"
                    : "text-coklat hover:text-tinta"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Peserta (P1-P10)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDeviceFrame("responsive");
                  setCurrentScreen("H3");
                }}
                className={`px-2.5 py-1 rounded-lg font-display font-extrabold text-xs flex items-center gap-1.5 transition-all ${
                  isHostView
                    ? "bg-kuning text-tinta shadow-xs"
                    : "text-coklat hover:text-tinta"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Host Proyektor (H1-H5)</span>
              </button>
            </div>
          </div>

          {/* Quick Jump Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-full py-0.5">
            <span className="font-label text-[10px] font-bold text-coklat mr-1">
              Lompat Layar:
            </span>

            {!isHostView ? (
              /* Player Screens P1-P10 */
              (
                [
                  { id: "P1", label: "P1:Bahasa" },
                  { id: "P2", label: "P2:PIN" },
                  { id: "P3", label: "P3:Daftar" },
                  { id: "P4", label: "P4:Lobby" },
                  { id: "P5", label: "P5:Peta" },
                  { id: "P6", label: "P6:Info" },
                  { id: "P7", label: "P7:Soal" },
                  { id: "P8", label: "P8:Feedback" },
                  { id: "P9", label: "P9:Ringkasan" },
                  { id: "P10", label: "P10:Podium" },
                ] as const
              ).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCurrentScreen(s.id)}
                  className={`px-2 py-0.5 rounded-md font-label text-[10px] font-bold border transition-all ${
                    currentScreen === s.id
                      ? "bg-kuning border-tinta text-tinta shadow-xs scale-105"
                      : "bg-kertas-putih/80 border-tinta/30 text-coklat hover:bg-kraft"
                  }`}
                >
                  {s.label}
                </button>
              ))
            ) : (
              /* Host Screens H1-H5 */
              (
                [
                  { id: "H1", label: "H1:Login" },
                  { id: "H2", label: "H2:Buat Room" },
                  { id: "H3", label: "H3:Lobby Host" },
                  { id: "H4", label: "H4:Monitor Live" },
                  { id: "H5", label: "H5:Podium & CSV" },
                ] as const
              ).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCurrentScreen(s.id)}
                  className={`px-2 py-0.5 rounded-md font-label text-[10px] font-bold border transition-all ${
                    currentScreen === s.id
                      ? "bg-kuning border-tinta text-tinta shadow-xs scale-105"
                      : "bg-kertas-putih/80 border-tinta/30 text-coklat hover:bg-kraft"
                  }`}
                >
                  {s.label}
                </button>
              ))
            )}
          </div>

          {/* Right Controls: Device Frame Toggle & Language Toggle */}
          <div className="flex items-center gap-1.5">
            {!isHostView && (
              <button
                type="button"
                onClick={() =>
                  setDeviceFrame((prev) => (prev === "mobile" ? "responsive" : "mobile"))
                }
                className="px-2 py-1 rounded-lg border border-tinta bg-kertas-putih font-label text-xs font-bold text-tinta hover:bg-kraft btn-pressable shadow-xs flex items-center gap-1"
                title="Ganti Tampilan Bingkai HP / Full Width"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>{deviceFrame === "mobile" ? "Frame HP" : "Full View"}</span>
              </button>
            )}

            <button
              type="button"
              onClick={toggleLanguage}
              className="px-2 py-1 rounded-lg border border-tinta bg-kraft font-label text-xs font-bold text-tinta hover:bg-kraft/80 btn-pressable shadow-xs flex items-center gap-1"
              title="Ganti Bahasa (ID / EN)"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================
          MAIN SCREEN CONTAINER
      ======================================================== */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-4 md:p-6">
        {/* If Mobile Simulator Frame is active */}
        {!isHostView && deviceFrame === "mobile" ? (
          <div className="w-full max-w-[420px] rounded-[36px] border-4 border-tinta bg-[#FBF5E6] shadow-stiker-lg overflow-hidden relative min-h-[720px] flex flex-col justify-between p-1">
            {/* Phone Speaker & Camera Notch */}
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-20 h-4 bg-tinta rounded-full flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-tinta/40 mr-2" />
                <span className="w-8 h-1 rounded-full bg-tinta/40" />
              </div>
            </div>

            {/* Active Mobile Screen */}
            <div className="flex-1 flex flex-col">
              {currentScreen === "P1" && (
                <P1_LanguageSelect
                  selectedLang={lang}
                  onSelectLang={setLang}
                  onNext={() => setCurrentScreen("P2")}
                />
              )}

              {currentScreen === "P2" && (
                <P2_PinEntry
                  pin={pin}
                  onChangePin={setPin}
                  onEnterRoom={() => setCurrentScreen("P3")}
                  onBack={() => setCurrentScreen("P1")}
                  lang={lang}
                  onToggleLang={toggleLanguage}
                />
              )}

              {currentScreen === "P3" && (
                <P3_Registration
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
                  onReady={() => setCurrentScreen("P4")}
                  onBack={() => setCurrentScreen("P2")}
                  lang={lang}
                />
              )}

              {currentScreen === "P4" && (
                <P4_Lobby
                  roomCode={pin}
                  playerName={playerName}
                  playerAvatarId={avatarId}
                  onSimulateHostStart={() => setCurrentScreen("P5")}
                  lang={lang}
                />
              )}

              {currentScreen === "P5" && (
                <P5_IslandMap
                  currentStage={currentStage}
                  onContinue={() => setCurrentScreen("P6")}
                  lang={lang}
                />
              )}

              {currentScreen === "P6" && (
                <P6_SiteIntroCard
                  stageId={currentStage}
                  onStartQuiz={() => setCurrentScreen("P7")}
                  lang={lang}
                />
              )}

              {currentScreen === "P7" && (
                <P7_QuizQuestion
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

              {currentScreen === "P8" && (
                <P8_AnswerFeedback
                  question={MOCK_QUESTIONS[currentStage] || MOCK_QUESTIONS[1]}
                  userAnswerKey={lastAnswer.key}
                  isCorrect={lastAnswer.isCorrect}
                  earnedPoints={lastAnswer.earnedPoints}
                  totalScore={playerScore}
                  streak={streak}
                  onNext={() => setCurrentScreen("P9")}
                  lang={lang}
                />
              )}

              {currentScreen === "P9" && (
                <P9_StageSummary
                  stageId={currentStage}
                  stageScore={lastAnswer.earnedPoints || 1750}
                  totalScore={playerScore}
                  currentRank={3}
                  totalPlayers={8}
                  onNextStage={handleNextStage}
                  lang={lang}
                />
              )}

              {currentScreen === "P10" && (
                <P10_FinalPodium
                  playerName={playerName}
                  playerRank={1}
                  totalPlayers={8}
                  playerScore={playerScore}
                  correctCount={14}
                  totalQuestions={15}
                  onFinish={() => {
                    setCurrentStage(1);
                    setCurrentScreen("P1");
                  }}
                  lang={lang}
                />
              )}
            </div>

            {/* Mobile Home Bar */}
            <div className="flex justify-center pb-2 pt-1">
              <div className="w-32 h-1 bg-tinta/30 rounded-full" />
            </div>
          </div>
        ) : (
          /* Responsive / Full View (Desktop or Host) */
          <div className="w-full flex justify-center">
            {/* Player screens rendered responsive */}
            {!isHostView && (
              <div className="w-full max-w-lg bg-kertas-putih rounded-3xl border-3 border-tinta shadow-stiker-lg p-2 sm:p-4">
                {currentScreen === "P1" && (
                  <P1_LanguageSelect
                    selectedLang={lang}
                    onSelectLang={setLang}
                    onNext={() => setCurrentScreen("P2")}
                  />
                )}
                {currentScreen === "P2" && (
                  <P2_PinEntry
                    pin={pin}
                    onChangePin={setPin}
                    onEnterRoom={() => setCurrentScreen("P3")}
                    onBack={() => setCurrentScreen("P1")}
                    lang={lang}
                    onToggleLang={toggleLanguage}
                  />
                )}
                {currentScreen === "P3" && (
                  <P3_Registration
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
                    onReady={() => setCurrentScreen("P4")}
                    onBack={() => setCurrentScreen("P2")}
                    lang={lang}
                  />
                )}
                {currentScreen === "P4" && (
                  <P4_Lobby
                    roomCode={pin}
                    playerName={playerName}
                    playerAvatarId={avatarId}
                    onSimulateHostStart={() => setCurrentScreen("P5")}
                    lang={lang}
                  />
                )}
                {currentScreen === "P5" && (
                  <P5_IslandMap
                    currentStage={currentStage}
                    onContinue={() => setCurrentScreen("P6")}
                    lang={lang}
                  />
                )}
                {currentScreen === "P6" && (
                  <P6_SiteIntroCard
                    stageId={currentStage}
                    onStartQuiz={() => setCurrentScreen("P7")}
                    lang={lang}
                  />
                )}
                {currentScreen === "P7" && (
                  <P7_QuizQuestion
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
                {currentScreen === "P8" && (
                  <P8_AnswerFeedback
                    question={MOCK_QUESTIONS[currentStage] || MOCK_QUESTIONS[1]}
                    userAnswerKey={lastAnswer.key}
                    isCorrect={lastAnswer.isCorrect}
                    earnedPoints={lastAnswer.earnedPoints}
                    totalScore={playerScore}
                    streak={streak}
                    onNext={() => setCurrentScreen("P9")}
                    lang={lang}
                  />
                )}
                {currentScreen === "P9" && (
                  <P9_StageSummary
                    stageId={currentStage}
                    stageScore={lastAnswer.earnedPoints || 1750}
                    totalScore={playerScore}
                    currentRank={3}
                    totalPlayers={8}
                    onNextStage={handleNextStage}
                    lang={lang}
                  />
                )}
                {currentScreen === "P10" && (
                  <P10_FinalPodium
                    playerName={playerName}
                    playerRank={1}
                    totalPlayers={8}
                    playerScore={playerScore}
                    correctCount={14}
                    totalQuestions={15}
                    onFinish={() => {
                      setCurrentStage(1);
                      setCurrentScreen("P1");
                    }}
                    lang={lang}
                  />
                )}
              </div>
            )}

            {/* Host screens rendered landscape proyektor */}
            {isHostView && (
              <div className="w-full">
                {currentScreen === "H1" && (
                  <H1_HostLogin
                    onLoginSuccess={(email) => {
                      setHostEmail(email);
                      setCurrentScreen("H2");
                    }}
                    onBackToPlayer={() => {
                      setDeviceFrame("mobile");
                      setCurrentScreen("P1");
                    }}
                  />
                )}

                {currentScreen === "H2" && (
                  <H2_CreateRoom
                    onCreateRoom={(cfg) => {
                      setRoomConfig(cfg);
                      setCurrentScreen("H3");
                    }}
                    onLogout={() => setCurrentScreen("H1")}
                  />
                )}

                {currentScreen === "H3" && (
                  <H3_HostLobby
                    roomCode={pin}
                    roomName={roomConfig.roomName}
                    gradeLevel={roomConfig.gradeLevel}
                    sessionMode={roomConfig.sessionMode}
                    onStartSession={() => setCurrentScreen("H4")}
                    onEndSession={() => setCurrentScreen("H2")}
                  />
                )}

                {currentScreen === "H4" && (
                  <H4_HostMonitor
                    roomCode={pin}
                    roomName={roomConfig.roomName}
                    onEndSession={() => setCurrentScreen("H5")}
                  />
                )}

                {currentScreen === "H5" && (
                  <H5_HostPodiumExport
                    roomCode={pin}
                    roomName={roomConfig.roomName}
                    onNewSession={() => setCurrentScreen("H2")}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================
          FOOTER INFO BAR
      ======================================================== */}
      <footer className="bg-[#EAD7B0]/60 border-t border-tinta/20 py-2 px-4 text-center font-label text-[11px] text-coklat">
        <span>✦ Jejak Inderasakti — Game Kuis Cagar Budaya Pulau Penyengat ✦ Disbudpar Kota Tanjungpinang & Yayasan Indrasakti</span>
      </footer>
    </main>
  );
}
