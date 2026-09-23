"use client";

import React, { useState, useMemo, useEffect } from "react";
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
  getRoomByPin,
  joinRoom,
  createRoom,
  Jenjang,
} from "@/lib/api";
import { useGameSocket } from "@/hooks/useGameSocket";
import {
  getQuestionsForStage,
  findQuestionByPrompt,
} from "@/data/questionBank";

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

const INITIAL_HOST_ROOMS: HostRoom[] = [];

export default function App() {
  // Navigation State
  const [currentStep, setCurrentStep] = useState<ScreenKey>("pilih-bahasa");
  const [lang, setLang] = useState<"id" | "en">("id");
  const [isMuted, setIsMuted] = useState(false);
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);

  // Player State
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [isCheckingPin, setIsCheckingPin] = useState(false);
  const [playerToken, setPlayerToken] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [school, setSchool] = useState("");
  const [schoolId, setSchoolId] = useState<number | null>(null);
  const [gradeLevel, setGradeLevel] = useState<"SD" | "SMP" | "SMA" | "UMUM">("SD");
  const [gradeClass, setGradeClass] = useState("");
  const [avatarId, setAvatarId] = useState("1");
  const [currentStage, setCurrentStage] = useState(1);
  const [stageQuestionIndex, setStageQuestionIndex] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastAnswer, setLastAnswer] = useState<{
    key: "A" | "B" | "C" | "D";
    isCorrect: boolean;
    earnedPoints: number;
  }>({
    key: "A",
    isCorrect: true,
    earnedPoints: 850,
  });

  // Host Multi-Room State (persisted to localStorage)
  const [hostToken, setHostToken] = useState<string | null>(null);
  const [hostEmail, setHostEmail] = useState("host0@email.com");
  const [hostRooms, setHostRooms] = useState<HostRoom[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("ji_host_rooms");
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_HOST_ROOMS;
  });
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [localRoomPlayers, setLocalRoomPlayers] = useState<
    Record<string, Array<{ id: string; name: string; school: string; avatarId: string }>>
  >(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("ji_local_players");
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return {};
  });

  // Hydrate persisted session on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const savedToken = localStorage.getItem("ji_host_token");
      const savedEmail = localStorage.getItem("ji_host_email");
      const savedRoomId = localStorage.getItem("ji_host_selected_room");
      const savedStep = localStorage.getItem("ji_current_step") as ScreenKey | null;

      if (savedToken) setHostToken(savedToken);
      if (savedEmail) setHostEmail(savedEmail);
      if (savedRoomId) setSelectedRoomId(savedRoomId);

      // Restore active screen
      if (savedToken && savedStep && savedStep.startsWith("host-") && savedStep !== "host-login") {
        setCurrentStep(savedStep);
      } else if (savedToken && savedStep === "host-login") {
        setCurrentStep("host-buat-room");
      } else if (savedStep && !savedStep.startsWith("host-")) {
        setCurrentStep(savedStep);
      }
    } catch (e) {
      console.warn("Failed to restore session from localStorage", e);
    }
  }, []);

  // Sync session state to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("ji_current_step", currentStep);
    } catch (e) {}
  }, [currentStep]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (hostToken) {
        localStorage.setItem("ji_host_token", hostToken);
      } else {
        localStorage.removeItem("ji_host_token");
      }
    } catch (e) {}
  }, [hostToken]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("ji_host_email", hostEmail);
    } catch (e) {}
  }, [hostEmail]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (selectedRoomId) {
        localStorage.setItem("ji_host_selected_room", selectedRoomId);
      } else {
        localStorage.removeItem("ji_host_selected_room");
      }
    } catch (e) {}
  }, [selectedRoomId]);

  useEffect(() => {
    try {
      localStorage.setItem("ji_host_rooms", JSON.stringify(hostRooms));
    } catch (e) {}
  }, [hostRooms]);

  // Check if player's room status changed to RUNNING (works in both single-tab & cross-tab)
  useEffect(() => {
    if (currentStep === "ruang-tunggu" && pin) {
      const matched = hostRooms.find((r) => r.pin === pin.trim());
      if (matched && matched.status === "RUNNING") {
        setCurrentStep("peta-jelajah");
      }
    }
  }, [currentStep, hostRooms, pin]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "ji_host_rooms" && e.newValue) {
        try {
          const updatedRooms: HostRoom[] = JSON.parse(e.newValue);
          setHostRooms(updatedRooms);
          if (currentStep === "ruang-tunggu" && pin) {
            const matched = updatedRooms.find((r) => r.pin === pin.trim());
            if (matched && matched.status === "RUNNING") {
              setCurrentStep("peta-jelajah");
            }
          }
        } catch (err) {}
      }
      if (e.key === "ji_local_players" && e.newValue) {
        try {
          setLocalRoomPlayers(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [currentStep, pin]);

  // Realtime Player WebSocket
  const playerSocket = useGameSocket({
    token: playerToken,
    autoConnect: Boolean(playerToken),
    onRoomStarted: () => {
      setCurrentStep("peta-jelajah");
    },
    onRoomEnded: () => {
      setCurrentStep("podium-juara");
    },
    onError: (err) => {
      console.warn("[Player WS Error]", err);
    },
  });

  // Realtime Host WebSocket
  const hostSocket = useGameSocket({
    token: hostToken,
    roomId: selectedRoomId,
    autoConnect: Boolean(
      hostToken &&
        selectedRoomId &&
        !selectedRoomId.startsWith("room-") &&
        (currentStep === "host-lobby" || currentStep === "host-monitor")
    ),
    onRoomEnded: () => {
      setCurrentStep("host-hasil-ekspor");
    },
    onError: (err) => {
      console.warn("[Host WS Error]", err);
    },
  });

  const currentHostRoom =
    hostRooms.find((r) => r.id === selectedRoomId) ||
    hostRooms[0] || {
      id: "room-empty",
      pin: "------",
      name: "Belum Ada Ruangan",
      gradeLevel: "SMP" as const,
      sessionMode: "NORMAL" as const,
      playerCount: 0,
      maxPlayers: 15,
      status: "LOBBY" as const,
      createdAt: "-",
    };

  // Map active question from live WebSocket or authentic DB question bank
  const activeQuestionData: QuestionData = useMemo(() => {
    if (playerToken && playerSocket.activeQuestion) {
      const q = playerSocket.activeQuestion;
      const rawMatch = findQuestionByPrompt(q.prompt);
      const optionKeys: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];
      return {
        id: rawMatch?.id || `live-${q.index}`,
        stageId: q.site || currentStage,
        questionNumber: q.index + 1,
        totalQuestions: q.total || 15,
        textId: q.prompt,
        textEn: rawMatch?.prompt.en || q.prompt,
        options: q.options.map((opt, i) => ({
          key: optionKeys[i] || "A",
          textId: opt.label,
          textEn: rawMatch?.options.find((ro) => ro.id === opt.id)?.label.en || opt.label,
          optionId: opt.id,
        })),
        correctKey: "A",
        explanationId: rawMatch?.explanation.id || "",
        explanationEn: rawMatch?.explanation.en || "",
      };
    }
    const stageQuestions = getQuestionsForStage(
      currentStage,
      gradeLevel === "UMUM" ? "SD" : gradeLevel
    );
    return stageQuestions[stageQuestionIndex] || stageQuestions[0];
  }, [playerToken, playerSocket.activeQuestion, currentStage, stageQuestionIndex, gradeLevel]);

  // Map joined players for host screen (merges WS live events, WS room state snapshot, and localRoomPlayers)
  const mappedHostPlayers = useMemo(() => {
    const playersMap = new Map<string, { id: string; name: string; school: string; avatarId: string }>();

    // 1. WebSocket player.joined live events
    if (hostSocket.joinedPlayers && hostSocket.joinedPlayers.length > 0) {
      hostSocket.joinedPlayers.forEach((p, idx) => {
        const key = p.nickname || p.id;
        playersMap.set(key, {
          id: p.id || `p-${idx + 1}`,
          name: p.nickname,
          school: p.school || "Umum",
          avatarId: String(p.avatar || 1),
        });
      });
    }

    // 2. WebSocket room.state snapshot
    if (hostSocket.roomState?.players && hostSocket.roomState.players.length > 0) {
      hostSocket.roomState.players.forEach((p, idx) => {
        const key = p.nickname || p.id;
        if (key && !playersMap.has(key)) {
          playersMap.set(key, {
            id: p.id || `p-${idx + 1}`,
            name: p.nickname,
            school: p.school || "Umum",
            avatarId: String(p.avatar || 1),
          });
        }
      });
    }

    // 3. Local/Cross-tab joined players for current host room PIN
    const currentPin = currentHostRoom?.pin?.trim();
    if (currentPin && localRoomPlayers[currentPin]) {
      localRoomPlayers[currentPin].forEach((p) => {
        if (!playersMap.has(p.name)) {
          playersMap.set(p.name, p);
        }
      });
    }

    return Array.from(playersMap.values());
  }, [hostSocket.joinedPlayers, hostSocket.roomState?.players, currentHostRoom?.pin, localRoomPlayers]);

  // Map joined players for player lobby screen
  const mappedPlayerLobbyPlayers = useMemo(() => {
    const listMap = new Map<string, { id: string; name: string; avatarId: string; isSelf: boolean }>();
    const selfName = playerName.trim() || "Pemain";

    // 1. Self first
    listMap.set(selfName, {
      id: "self",
      name: selfName,
      avatarId: avatarId || "1",
      isSelf: true,
    });

    // 2. WebSocket room.state players
    if (playerSocket.roomState?.players && playerSocket.roomState.players.length > 0) {
      playerSocket.roomState.players.forEach((p, i) => {
        listMap.set(p.nickname, {
          id: p.id || `p-${i}`,
          name: p.nickname,
          avatarId: String(p.avatar || 1),
          isSelf: p.nickname === selfName,
        });
      });
    }

    // 3. WebSocket joinedPlayers
    if (playerSocket.joinedPlayers && playerSocket.joinedPlayers.length > 0) {
      playerSocket.joinedPlayers.forEach((p, i) => {
        listMap.set(p.nickname, {
          id: p.id || `p-${i}`,
          name: p.nickname,
          avatarId: String(p.avatar || 1),
          isSelf: p.nickname === selfName,
        });
      });
    }

    // 4. Local room players for current pin
    const currentPin = pin.trim();
    if (currentPin && localRoomPlayers[currentPin]) {
      localRoomPlayers[currentPin].forEach((p) => {
        if (!listMap.has(p.name)) {
          listMap.set(p.name, {
            id: p.id,
            name: p.name,
            avatarId: p.avatarId,
            isSelf: p.name === selfName,
          });
        }
      });
    }

    return Array.from(listMap.values());
  }, [playerName, avatarId, playerSocket.roomState?.players, playerSocket.joinedPlayers, pin, localRoomPlayers]);

  // Map podium results from live WS podium, WS rankings, or real joined players (like Okta)
  const mappedPodiumResults = useMemo(() => {
    // 1. Live WebSocket podium from room.ended
    if (hostSocket.podium && hostSocket.podium.length > 0) {
      return hostSocket.podium.map((p, idx) => ({
        rank: p.rank || idx + 1,
        name: p.nickname,
        school: mappedHostPlayers.find((mp) => mp.name === p.nickname)?.school || "Umum",
        avatarId: String(p.avatar || 1),
        score: p.score || 0,
        correctAnswers: 15,
        totalQuestions: 15,
        timeTaken: "-",
      }));
    }

    // 2. Live WebSocket rankings from lb.update
    if (hostSocket.rankings && hostSocket.rankings.length > 0) {
      return hostSocket.rankings.map((r, idx) => ({
        rank: r.rank || idx + 1,
        name: r.nickname,
        school: r.school || "Umum",
        avatarId: mappedHostPlayers.find((mp) => mp.name === r.nickname)?.avatarId || "1",
        score: r.score || 0,
        correctAnswers: r.correct_count || 0,
        totalQuestions: 15,
        timeTaken: "-",
      }));
    }

    // 3. Fallback to real joined players from current session
    if (mappedHostPlayers && mappedHostPlayers.length > 0) {
      return mappedHostPlayers.map((p, idx) => ({
        rank: idx + 1,
        name: p.name,
        school: p.school || "Umum",
        avatarId: p.avatarId || "1",
        score: 0,
        correctAnswers: 0,
        totalQuestions: 15,
        timeTaken: "-",
      }));
    }

    return [];
  }, [hostSocket.podium, hostSocket.rankings, mappedHostPlayers]);

  const handleSelectRoom = (room: HostRoom, action: "lobby" | "monitor" | "podium") => {
    setSelectedRoomId(room.id);
    if (action === "lobby") setCurrentStep("host-lobby");
    else if (action === "monitor") setCurrentStep("host-monitor");
    else if (action === "podium") setCurrentStep("host-hasil-ekspor");
  };

  const handleCheckPinAndEnter = async () => {
    setPinError(null);
    setIsCheckingPin(true);
    const cleanPin = pin.trim();
    try {
      const roomInfo = await getRoomByPin(cleanPin);
      if (roomInfo.status !== "lobby" && roomInfo.status !== "running") {
        setPinError("Sesi untuk ruangan ini sudah berakhir. Silakan minta Host/Guru membuat ruangan baru.");
        return;
      }
      setGradeLevel(roomInfo.jenjang);
      setCurrentStep("daftar-peserta");
    } catch (err: any) {
      console.warn("Real room check failed:", err);
      // Only fall back to local if it's an active local room that hasn't ended
      const localMatch = hostRooms.find((r) => r.pin === cleanPin);
      if (localMatch && localMatch.status !== "FINISHED" && localMatch.id.startsWith("room-")) {
        setGradeLevel(localMatch.gradeLevel);
        setCurrentStep("daftar-peserta");
      } else {
        if (localMatch) {
          setHostRooms((prev) =>
            prev.map((r) => (r.pin === cleanPin ? { ...r, status: "FINISHED" } : r))
          );
        }
        setPinError(
          err.message && err.message.includes("ended")
            ? "Ruangan dengan PIN ini sudah selesai atau telah ditutup oleh Host. Silakan buat ruangan baru dari layar Host."
            : "Ruangan dengan PIN ini tidak ditemukan. Pastikan 6-digit PIN sudah benar dari layar Host/Guru."
        );
      }
    } finally {
      setIsCheckingPin(false);
    }
  };

  const handlePlayerRegister = async () => {
    const cleanPin = pin.trim();
    const cleanNick = playerName.trim() || "Pemain";
    const cleanSchool = school.trim() || "Umum";
    const cleanAvatar = Math.max(1, Math.min(12, Number(avatarId) || 1));

    // Save to localRoomPlayers immediately so it shows up in Host & Player screens across tabs
    const newEntry = {
      id: `p-${Date.now()}`,
      name: cleanNick,
      school: cleanSchool,
      avatarId: String(cleanAvatar),
    };

    setLocalRoomPlayers((prev) => {
      const existing = prev[cleanPin] || [];
      const updated = {
        ...prev,
        [cleanPin]: [...existing.filter((p) => p.name !== cleanNick), newEntry],
      };
      try {
        localStorage.setItem("ji_local_players", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    try {
      // Only send school_id if it's 1 or 2 (valid IDs seeded in DB); else send null
      const validSchoolId = schoolId === 1 || schoolId === 2 ? schoolId : null;
      const res = await joinRoom(cleanPin, {
        nickname: cleanNick,
        school_id: validSchoolId,
        jenjang: (gradeLevel === "UMUM" ? "SD" : gradeLevel) as Jenjang,
        avatar: cleanAvatar,
        lang: lang,
      });
      setPlayerToken(res.player_token);
      setCurrentStep("ruang-tunggu");
    } catch (err: any) {
      console.warn("Live join failed:", err);
      const localMatch = hostRooms.find((r) => r.pin === cleanPin);
      if (localMatch) {
        setCurrentStep("ruang-tunggu");
      } else {
        setPinError(err.message || "Gagal bergabung ke ruangan. Pastikan PIN benar dan server aktif.");
        setCurrentStep("masukkan-pin");
      }
    }
  };

  const handleCreateHostRoom = async (config: {
    gradeLevel: "SD" | "SMP" | "SMA";
    sessionMode: "NORMAL" | "QUICK";
    roomName: string;
    pin: string;
  }) => {
    try {
      if (hostToken && hostToken !== "demo-mock-jwt-token") {
        const res = await createRoom(hostToken, {
          jenjang: config.gradeLevel,
          short_session: config.sessionMode === "QUICK",
          accuracy_mode: false,
          consent_confirmed: true,
        });
        const newRoom: HostRoom = {
          id: res.id,
          pin: res.pin,
          name: config.roomName || `Sesi ${config.gradeLevel} (${res.pin})`,
          gradeLevel: config.gradeLevel,
          sessionMode: config.sessionMode,
          playerCount: 0,
          maxPlayers: 15,
          status: "LOBBY",
          createdAt: "Baru saja",
        };
        setHostRooms((prev) => [newRoom, ...prev]);
        setSelectedRoomId(res.id);
        setCurrentStep("host-lobby");
        return;
      }
    } catch (err: any) {
      console.warn("Failed to create room via live API:", err);
      if (err.message && err.message.includes("5 rooms")) {
        alert("Batas maksimal 5 ruangan aktif tercapai di server. Silakan klik 'Tutup Room' pada sesi yang sudah selesai sebelum membuat ruangan baru.");
        return;
      }
    }

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
    if (hostToken && selectedRoomId === roomId && hostSocket) {
      try {
        hostSocket.hostEnd();
      } catch (e) {}
    }
    setHostRooms((prev) => prev.filter((r) => r.id !== roomId));
  };

  const handleStartHostSession = () => {
    if (hostToken && hostSocket) {
      hostSocket.hostStart();
    }
    setHostRooms((prev) =>
      prev.map((r) => (r.id === selectedRoomId ? { ...r, status: "RUNNING" } : r))
    );
    setCurrentStep("host-monitor");
  };

  const handleEndHostSession = () => {
    if (hostToken && hostSocket) {
      hostSocket.hostEnd();
    }
    setHostRooms((prev) =>
      prev.map((r) => (r.id === selectedRoomId ? { ...r, status: "FINISHED" } : r))
    );
    setCurrentStep("host-hasil-ekspor");
  };

  const toggleLanguage = () => {
    setLang((prev) => (prev === "id" ? "en" : "id"));
  };

  const handleAnswerSubmit = (
    key: "A" | "B" | "C" | "D",
    isCorrect: boolean,
    optionId?: string
  ) => {
    if (playerToken && playerSocket) {
      let qId = playerSocket.activeQuestion?.prompt
        ? findQuestionByPrompt(playerSocket.activeQuestion.prompt)?.id
        : undefined;
      if (!qId && playerSocket.activeQuestion) {
        qId = `M${playerSocket.activeQuestion.site}-${String(playerSocket.activeQuestion.index + 1).padStart(2, "0")}`;
      }
      playerSocket.sendAnswer(
        qId || "M1-01",
        optionId || null
      );
      setCurrentStep("hasil-jawaban");
    } else {
      const points = isCorrect ? 850 + streak * 50 : 0;
      setLastAnswer({ key, isCorrect, earnedPoints: points });
      if (isCorrect) {
        setPlayerScore((prev) => prev + points);
        setStreak((prev) => prev + 1);
      } else {
        setStreak(0);
      }
      setCurrentStep("hasil-jawaban");
    }
  };

  const handleAnswerNext = () => {
    if (playerToken && playerSocket) {
      if (playerSocket.lastResult?.finished) {
        setCurrentStep("podium-juara");
      } else {
        playerSocket.sendNext();
        setCurrentStep("kuis-soal");
      }
    } else {
      const stageQuestions = getQuestionsForStage(
        currentStage,
        gradeLevel === "UMUM" ? "SD" : gradeLevel
      );
      if (stageQuestionIndex < stageQuestions.length - 1) {
        setStageQuestionIndex((prev) => prev + 1);
        setCurrentStep("kuis-soal");
      } else {
        setCurrentStep("kartu-warisan");
      }
    }
  };

  const handleNextStage = () => {
    if (currentStage >= 5) {
      setCurrentStep("podium-juara");
    } else {
      setCurrentStage((prev) => prev + 1);
      setStageQuestionIndex(0);
      setCurrentStep("peta-jelajah");
    }
  };

  const isHostView = currentStep.startsWith("host-");

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full bg-kertas text-tinta flex flex-col selection:bg-kuning selection:text-tinta relative overflow-hidden">
      {/* ========================================================
          MOBILE-FRIENDLY TOP NAVBAR (Compact, fixed height)
      ======================================================== */}
      <header className="flex-shrink-0 z-40 w-full bg-kertas-putih/95 backdrop-blur-md border-b-2 border-tinta/30 px-3.5 py-1.5 sm:py-2 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Brand Identity */}
          <button
            type="button"
            onClick={() => setCurrentStep("pilih-bahasa")}
            className="flex items-center gap-2 text-left focus:outline-none group"
          >
            <div className="w-8 h-8 rounded-xl overflow-hidden border-2 border-tinta shadow-stiker-sm bg-[#B44C33] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-all">
              <img
                src="/logo.webp"
                alt="Logo Jejak Inderasakti"
                className="w-full h-full object-cover select-none"
              />
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
                onClick={() => {
                  if (hostToken) {
                    setCurrentStep("host-buat-room");
                  } else {
                    setCurrentStep("host-login");
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-kuning border-2 border-tinta font-display font-black text-xs text-tinta shadow-stiker-sm btn-pressable hover:bg-[#FFD147]"
                title="Masuk ke Panel Host / Guru"
              >
                <KeyRound className="w-3.5 h-3.5 text-tinta" />
                <span>{hostToken ? "Panel Host" : "Masuk Host"}</span>
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
          MAIN VIEW AREA (Full Screen Mobile Native First - No Scrolling)
      ======================================================== */}
      <main className="w-full flex-1 flex flex-col min-h-0 overflow-hidden">
        {!isHostView ? (
          /* Native Player Screen: 100% viewport, strictly no vertical scroll */
          <div className="w-full max-w-md mx-auto flex-1 flex flex-col min-h-0 overflow-hidden">
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
                onEnterRoom={handleCheckPinAndEnter}
                onBack={() => setCurrentStep("pilih-bahasa")}
                lang={lang}
                onToggleLang={toggleLanguage}
                error={pinError}
                isChecking={isCheckingPin}
              />
            )}

            {currentStep === "daftar-peserta" && (
              <Registration
                name={playerName}
                setName={setPlayerName}
                school={school}
                setSchool={setSchool}
                schoolId={schoolId}
                setSchoolId={setSchoolId}
                gradeLevel={gradeLevel}
                setGradeLevel={setGradeLevel}
                gradeClass={gradeClass}
                setGradeClass={setGradeClass}
                avatarId={avatarId}
                setAvatarId={setAvatarId}
                onReady={handlePlayerRegister}
                onBack={() => setCurrentStep("masukkan-pin")}
                lang={lang}
              />
            )}

            {currentStep === "ruang-tunggu" && (
              <PlayerLobby
                roomCode={pin}
                playerName={playerName || "Pemain"}
                playerAvatarId={avatarId}
                playersList={mappedPlayerLobbyPlayers}
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
                question={activeQuestionData}
                score={playerToken && playerSocket.roomState ? playerSocket.roomState.score : playerScore}
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
                question={activeQuestionData}
                userAnswerKey={lastAnswer.key}
                isCorrect={
                  playerToken && playerSocket.lastResult
                    ? playerSocket.lastResult.correct
                    : lastAnswer.isCorrect
                }
                earnedPoints={
                  playerToken && playerSocket.lastResult
                    ? playerSocket.lastResult.points
                    : lastAnswer.earnedPoints
                }
                totalScore={
                  playerToken && playerSocket.lastResult
                    ? playerSocket.lastResult.score
                    : playerScore
                }
                streak={
                  playerToken && playerSocket.lastResult
                    ? playerSocket.lastResult.streak
                    : streak
                }
                explanation={
                  playerToken && playerSocket.lastResult
                    ? playerSocket.lastResult.explanation
                    : undefined
                }
                onNext={handleAnswerNext}
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
                  setStageQuestionIndex(0);
                  setPlayerScore(0);
                  setStreak(0);
                  setPin("");
                  setPlayerToken(null);
                  setCurrentStep("pilih-bahasa");
                }}
                lang={lang}
              />
            )}
          </div>
        ) : (
          /* Host Projector Views */
          <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col min-h-0 overflow-y-auto p-3 sm:p-4">
            {currentStep === "host-login" && (
              <HostLogin
                onLoginSuccess={(email, token) => {
                  setHostEmail(email);
                  if (token) setHostToken(token);
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
                onLogout={() => {
                  setHostToken(null);
                  setSelectedRoomId("");
                  if (typeof window !== "undefined") {
                    localStorage.removeItem("ji_host_token");
                    localStorage.removeItem("ji_host_selected_room");
                    localStorage.setItem("ji_current_step", "host-login");
                  }
                  setCurrentStep("host-login");
                }}
              />
            )}

            {currentStep === "host-lobby" && (
              <HostLobby
                roomCode={currentHostRoom.pin}
                roomName={currentHostRoom.name}
                gradeLevel={currentHostRoom.gradeLevel}
                sessionMode={currentHostRoom.sessionMode}
                players={mappedHostPlayers}
                onStartSession={handleStartHostSession}
                onEndSession={() => {
                  handleEndHostSession();
                  setCurrentStep("host-buat-room");
                }}
                onBackToRooms={() => setCurrentStep("host-buat-room")}
              />
            )}

            {currentStep === "host-monitor" && (
              <HostMonitor
                roomCode={currentHostRoom.pin}
                roomName={currentHostRoom.name}
                rankings={hostSocket.rankings}
                players={mappedHostPlayers}
                onEndSession={handleEndHostSession}
                onBackToRooms={() => setCurrentStep("host-buat-room")}
              />
            )}

            {currentStep === "host-hasil-ekspor" && (
              <HostPodiumExport
                roomCode={currentHostRoom.pin}
                roomName={currentHostRoom.name}
                roomId={selectedRoomId}
                hostToken={hostToken}
                results={mappedPodiumResults}
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
