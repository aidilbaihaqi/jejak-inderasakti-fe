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

import {
  PucukRebungMotif,
  WajikMotif,
  BungaCengkihMotif,
} from "@/components/assets/MelayuMotifs";

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
import { useAudioManager } from "@/hooks/useAudioManager";
import { WsRanking } from "@/lib/socket";
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
  Lock,
  LogOut,
  ShieldCheck,
  ArrowRight,
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

function parseSafeJenjang(input: string): Jenjang {
  const norm = (input || "").trim().toUpperCase();
  if (norm.includes("SMA") || norm.includes("SMK") || norm.includes("MA")) return "SMA";
  if (norm.includes("SMP") || norm.includes("MTS")) return "SMP";
  return "SD";
}

export default function App() {
  // Navigation State
  const [currentStep, setCurrentStep] = useState<ScreenKey>("pilih-bahasa");
  const [lang, setLang] = useState<"id" | "en">("id");
  const { isMuted, setIsMuted, toggleMute, playSfxCorrect, playSfxWrong } = useAudioManager();
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<"player" | "host">("player");

  // Player State
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [isCheckingPin, setIsCheckingPin] = useState(false);
  const [playerToken, setPlayerToken] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [school, setSchool] = useState("");
  const [schoolId, setSchoolId] = useState<number | null>(null);
  const [gradeLevel, setGradeLevel] = useState<string>("");
  const [gradeClass, setGradeClass] = useState("");
  const [avatarId, setAvatarId] = useState("1");
  const [currentStage, setCurrentStage] = useState(1);
  const [stageQuestionIndex, setStageQuestionIndex] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [playerCorrectCount, setPlayerCorrectCount] = useState(0);
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

      // Check if URL has ?pin= query parameter (from QR code scan or direct link)
      const urlParams = new URLSearchParams(window.location.search);
      const urlPin = urlParams.get("pin");
      if (urlPin && urlPin.trim().length === 6) {
        const cleanUrlPin = urlPin.trim();
        setPin(cleanUrlPin);
        setCurrentStep("masukkan-pin");
        getRoomByPin(cleanUrlPin)
          .then((roomInfo) => {
            if (roomInfo.status === "lobby" || roomInfo.status === "running") {
              setCurrentStep("daftar-peserta");
            }
          })
          .catch((err) => {
            console.warn("Auto-check QR pin failed:", err);
          });
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

  // Guard host routes: unauthenticated users cannot access host management/monitor screens
  useEffect(() => {
    if (currentStep.startsWith("host-") && currentStep !== "host-login" && !hostToken) {
      setCurrentStep("host-login");
    }
  }, [currentStep, hostToken]);

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

  // Track player's correct answer count from live q.result events
  useEffect(() => {
    if (playerSocket.lastResult && playerSocket.lastResult.correct) {
      setPlayerCorrectCount((prev) => prev + 1);
    }
  }, [playerSocket.lastResult]);

  // Automatically sync stage from live WebSocket question
  useEffect(() => {
    if (playerSocket.activeQuestion?.site) {
      setCurrentStage(playerSocket.activeQuestion.site);
    }
  }, [playerSocket.activeQuestion?.site]);

  // If in quiz step but no question is served yet, trigger sendNext
  useEffect(() => {
    if (currentStep === "kuis-soal" && playerToken && !playerSocket.activeQuestion) {
      playerSocket.sendNext();
    }
  }, [currentStep, playerToken, playerSocket.activeQuestion, playerSocket.sendNext]);

  // Realtime Host WebSocket
  const hostSocket = useGameSocket({
    token: hostToken,
    roomId: selectedRoomId,
    autoConnect: Boolean(
      hostToken &&
        selectedRoomId &&
        !selectedRoomId.startsWith("room-") &&
        (currentStep === "host-lobby" ||
          currentStep === "host-monitor" ||
          currentStep === "host-hasil-ekspor")
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
      const optionLabels = q.options.map((o) => o.label);
      const rawMatch = findQuestionByPrompt(q.prompt, q.site, optionLabels);
      const optionKeys: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];

      // Determine correct option
      let correctKey: "A" | "B" | "C" | "D" = "A";
      const revealedOptId = playerSocket.lastResult?.correct_option_id;
      const dbCorrectOpt = rawMatch?.options.find((o) => o.correct);
      const targetOptId = revealedOptId || dbCorrectOpt?.id;

      const options = q.options.map((opt, i) => {
        const key = optionKeys[i] || "A";
        if (targetOptId && opt.id === targetOptId) {
          correctKey = key;
        } else if (!targetOptId && dbCorrectOpt && dbCorrectOpt.label.id.trim() === opt.label.trim()) {
          correctKey = key;
        }
        return {
          key,
          textId: opt.label,
          textEn: rawMatch?.options.find((ro) => ro.id === opt.id)?.label.en || opt.label,
          optionId: opt.id,
        };
      });

      const resolvedSite = q.site || rawMatch?.site || currentStage || 1;
      const resolvedId =
        q.id ||
        q.question_id ||
        rawMatch?.id ||
        `M${resolvedSite}-${String((q.index % 3) + 1).padStart(2, "0")}`;

      return {
        id: resolvedId,
        stageId: resolvedSite,
        questionNumber: q.index + 1,
        totalQuestions: q.total || 15,
        textId: q.prompt,
        textEn: rawMatch?.prompt.en || q.prompt,
        options,
        correctKey,
        explanationId: playerSocket.lastResult?.explanation || rawMatch?.explanation.id || "",
        explanationEn: rawMatch?.explanation.en || playerSocket.lastResult?.explanation || "",
      };
    }
    const stageQuestions = getQuestionsForStage(
      currentStage,
      parseSafeJenjang(gradeLevel)
    );
    return stageQuestions[stageQuestionIndex] || stageQuestions[0];
  }, [
    playerToken,
    playerSocket.activeQuestion,
    playerSocket.lastResult,
    currentStage,
    stageQuestionIndex,
    gradeLevel,
  ]);

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

  // Cache the latest rankings so they are never lost when changing steps or ending room
  const [latestRankings, setLatestRankings] = useState<WsRanking[]>([]);
  useEffect(() => {
    if (hostSocket.rankings && hostSocket.rankings.length > 0) {
      setLatestRankings(hostSocket.rankings);
    }
  }, [hostSocket.rankings]);

  // Sync playerCount in hostRooms whenever players join
  useEffect(() => {
    setHostRooms((prev) => {
      let changed = false;
      const updated = prev.map((r) => {
        const pin = r.pin?.trim();
        const localCount = pin && localRoomPlayers[pin] ? localRoomPlayers[pin].length : 0;
        const hostCount = r.id === selectedRoomId ? mappedHostPlayers.length : 0;
        const targetCount = Math.max(r.playerCount || 0, localCount, hostCount);
        if (targetCount !== r.playerCount) {
          changed = true;
          return { ...r, playerCount: targetCount };
        }
        return r;
      });
      return changed ? updated : prev;
    });
  }, [localRoomPlayers, selectedRoomId, mappedHostPlayers.length]);

  // Enriched host rooms with dynamic live player count
  const enrichedHostRooms = useMemo(() => {
    return hostRooms.map((r) => {
      const pin = r.pin?.trim();
      const localCount = pin && localRoomPlayers[pin] ? localRoomPlayers[pin].length : 0;
      const isSelected = r.id === selectedRoomId;
      const hostCount = isSelected ? mappedHostPlayers.length : 0;
      const targetCount = Math.max(r.playerCount || 0, localCount, hostCount);
      return {
        ...r,
        playerCount: targetCount,
      };
    });
  }, [hostRooms, localRoomPlayers, selectedRoomId, mappedHostPlayers.length]);

  // Map podium results from live WS rankings (with correct_count) or podium (top-3 only)
  const mappedPodiumResults = useMemo(() => {
    const effectiveRankings =
      hostSocket.rankings && hostSocket.rankings.length > 0
        ? hostSocket.rankings
        : latestRankings;

    // 1. Live WebSocket rankings from lb.update — has ALL players + correct_count
    if (effectiveRankings && effectiveRankings.length > 0) {
      return effectiveRankings.map((r, idx) => ({
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

    // 2. Podium from room.ended — only top-3, no correct_count; use as fallback
    if (hostSocket.podium && hostSocket.podium.length > 0) {
      return hostSocket.podium.map((p, idx) => ({
        rank: p.rank || idx + 1,
        name: p.nickname,
        school: mappedHostPlayers.find((mp) => mp.name === p.nickname)?.school || "Umum",
        avatarId: String(p.avatar || 1),
        score: p.score || 0,
        correctAnswers: 0,
        totalQuestions: 15,
        timeTaken: "-",
      }));
    }

    // 3. Fallback to real joined players from current session
    if (mappedHostPlayers && mappedHostPlayers.length > 0) {
      return mappedHostPlayers.map((p, idx) => {
        const isSelf = p.name === playerName;
        return {
          rank: idx + 1,
          name: p.name,
          school: p.school || "Umum",
          avatarId: p.avatarId || "1",
          score: isSelf ? (playerScore || 0) : 0,
          correctAnswers: isSelf ? (playerCorrectCount || 0) : 0,
          totalQuestions: 15,
          timeTaken: "-",
        };
      });
    }

    return [];
  }, [
    hostSocket.podium,
    hostSocket.rankings,
    latestRankings,
    mappedHostPlayers,
    playerName,
    playerScore,
    playerCorrectCount,
  ]);

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
      setCurrentStep("daftar-peserta");
    } catch (err: any) {
      console.warn("Real room check failed:", err);
      // Only fall back to local if it's an active local room that hasn't ended
      const localMatch = hostRooms.find((r) => r.pin === cleanPin);
      if (localMatch && localMatch.status !== "FINISHED" && localMatch.id.startsWith("room-")) {
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
        jenjang: parseSafeJenjang(gradeLevel),
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
          qr_url: res.qr_url,
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
    // Determine correctness accurately from activeQuestionData
    const isAnswerCorrect = key === activeQuestionData.correctKey || isCorrect;
    const earnedPoints = isAnswerCorrect ? 850 + streak * 50 : 0;

    // Trigger instant SFX
    if (isAnswerCorrect) {
      playSfxCorrect();
    } else {
      playSfxWrong();
    }

    // Immediately record user answer state so AnswerFeedback displays accurately
    setLastAnswer({ key, isCorrect: isAnswerCorrect, earnedPoints });

    if (isAnswerCorrect) {
      setPlayerScore((prev) => prev + earnedPoints);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }

    if (playerToken && playerSocket) {
      const q = playerSocket.activeQuestion;
      const optionLabels = q?.options.map((o) => o.label);
      const rawMatch = q?.prompt ? findQuestionByPrompt(q.prompt, q.site, optionLabels) : undefined;
      const qId = q?.id || q?.question_id || rawMatch?.id || activeQuestionData.id;

      playerSocket.sendAnswer(qId, optionId || null);
    }

    setCurrentStep("hasil-jawaban");
  };

  const handleAnswerNext = () => {
    const totalQ = activeQuestionData.totalQuestions || 15;
    const qNum = activeQuestionData.questionNumber;
    const questionsPerStage = totalQ === 10 ? 2 : 3;
    const isEndOfStage = qNum % questionsPerStage === 0 || qNum >= totalQ;
    const isFinished = qNum >= totalQ || Boolean(playerSocket.lastResult?.finished);

    if (playerToken && playerSocket) {
      if (isFinished) {
        if (currentStage >= 5) {
          setCurrentStep("kartu-warisan");
        } else {
          setCurrentStep("podium-juara");
        }
      } else if (isEndOfStage) {
        // Completed this stage's questions -> show heritage summary card
        setCurrentStep("kartu-warisan");
      } else {
        // Next question within same stage -> request next question and stay in quiz
        playerSocket.sendNext();
        setCurrentStep("kuis-soal");
      }
    } else {
      const stageQuestions = getQuestionsForStage(
        currentStage,
        parseSafeJenjang(gradeLevel)
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
    <div className="app-bg-textured h-[100dvh] max-h-[100dvh] w-full text-tinta flex flex-col selection:bg-kuning selection:text-tinta relative overflow-hidden">
      {/* ========================================================
          DECORATIVE SONGKET MOTIFS (fills wide-viewport gutters
          around the mobile-first column; hidden on small screens)
      ======================================================== */}
      <div
        className="hidden md:block fixed inset-0 z-0 pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <PucukRebungMotif
          size={440}
          color="#C8922A"
          className="absolute -left-28 -top-28 opacity-[0.07] -rotate-[10deg]"
        />
        <WajikMotif
          size={340}
          color="#8B5A2B"
          className="absolute -right-20 top-1/4 opacity-[0.06] rotate-6"
        />
        <BungaCengkihMotif
          size={300}
          color="#C8922A"
          className="absolute -left-14 bottom-[-70px] opacity-[0.07] rotate-3"
        />
        <PucukRebungMotif
          size={320}
          color="#8B5A2B"
          className="absolute -right-16 -bottom-20 opacity-[0.06] rotate-[16deg]"
        />
      </div>

      {/* ========================================================
          MOBILE-FRIENDLY TOP NAVBAR (Compact, fixed height)
      ======================================================== */}
      <header className="relative z-40 flex-shrink-0 w-full bg-kertas-putih/95 backdrop-blur-md border-b-2 border-tinta/30 px-3.5 py-1.5 sm:py-2 shadow-xs">
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
              onClick={toggleMute}
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
              onClick={() => {
                setDrawerTab(isHostView ? "host" : "player");
                setIsNavDrawerOpen(true);
              }}
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
      <main className="relative z-10 w-full flex-1 flex flex-col min-h-0 overflow-hidden">
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
                onStartQuiz={() => {
                  if (playerToken && playerSocket) {
                    if (!playerSocket.activeQuestion || playerSocket.activeQuestion.site !== currentStage) {
                      playerSocket.sendNext();
                    }
                  }
                  setCurrentStep("kuis-soal");
                }}
                lang={lang}
              />
            )}

            {currentStep === "kuis-soal" && (
              playerToken && !playerSocket.activeQuestion ? (
                <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center h-full p-6 text-center animate-fade-in">
                  <div className="w-14 h-14 rounded-full border-4 border-emas border-t-transparent animate-spin mb-4" />
                  <h3 className="font-display font-black text-xl text-tinta mb-1">
                    {lang === "id" ? "Menyiapkan Soal Budaya..." : "Loading Cultural Question..."}
                  </h3>
                  <p className="font-body text-xs text-coklat font-semibold">
                    {lang === "id" ? `Situs #${currentStage} dari 5` : `Site #${currentStage} of 5`}
                  </p>
                </div>
              ) : (
                <QuizQuestion
                  question={activeQuestionData}
                  score={playerToken && playerSocket.roomState ? playerSocket.roomState.score : playerScore}
                  streak={streak}
                  onAnswer={handleAnswerSubmit}
                  lang={lang}
                  isMuted={isMuted}
                  onToggleMute={toggleMute}
                  onToggleLang={toggleLanguage}
                />
              )
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
                totalScore={playerToken && playerSocket.roomState ? playerSocket.roomState.score : playerScore}
                currentRank={
                  playerSocket.rankings?.find((r) => r.nickname === playerName)?.rank || 1
                }
                totalPlayers={playerSocket.rankings?.length || 1}
                onNextStage={handleNextStage}
                lang={lang}
              />
            )}

            {currentStep === "podium-juara" && (() => {
              // Derive player's rank from rankings
              const myRank = playerSocket.rankings?.find(
                (r) => r.nickname === playerName
              )?.rank || 1;
              const totalP = playerSocket.rankings?.length || 1;

              // Build top-3 from podium (room.ended) or rankings (lb.update)
              const top3: { rank: 1 | 2 | 3; name: string; avatarId: string; score: number }[] = [];
              if (playerSocket.podium && playerSocket.podium.length > 0) {
                playerSocket.podium.slice(0, 3).forEach((p) => {
                  top3.push({
                    rank: p.rank as 1 | 2 | 3,
                    name: p.nickname,
                    avatarId: String(p.avatar || 1),
                    score: p.score || 0,
                  });
                });
              } else if (playerSocket.rankings && playerSocket.rankings.length > 0) {
                playerSocket.rankings.slice(0, 3).forEach((r, idx) => {
                  top3.push({
                    rank: (idx + 1) as 1 | 2 | 3,
                    name: r.nickname,
                    avatarId: "1",
                    score: r.score || 0,
                  });
                });
              }

              // Use live score from roomState if available
              const liveScore = playerSocket.roomState?.score ?? playerScore;

              // Correct count: from rankings (server-side) or locally tracked
              const liveCorrect = playerSocket.rankings?.find(
                (r) => r.nickname === playerName
              )?.correct_count ?? playerCorrectCount;

              return (
                <FinalPodium
                  playerName={playerName}
                  playerRank={myRank}
                  totalPlayers={totalP}
                  playerScore={liveScore}
                  correctCount={liveCorrect}
                  totalQuestions={playerSocket.activeQuestion?.total || 15}
                  topPlayers={top3.length > 0 ? top3 : undefined}
                  onFinish={() => {
                    setCurrentStage(1);
                    setStageQuestionIndex(0);
                    setPlayerScore(0);
                    setStreak(0);
                    setPlayerCorrectCount(0);
                    setPin("");
                    setPlayerToken(null);
                    setCurrentStep("pilih-bahasa");
                  }}
                  lang={lang}
                />
              );
            })()}
          </div>
        ) : (
          /* Host Projector Views */
          <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col min-h-0 overflow-y-auto p-1 sm:p-4">
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
                rooms={enrichedHostRooms}
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
                qrUrl={currentHostRoom.qr_url}
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
      {/* ========================================================
          CLEAN SLIDE-OVER MOBILE MENU DRAWER (ROLE-BASED & PROTECTED)
      ======================================================== */}
      {isNavDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in">
          <div
            className="w-full max-w-xs sm:max-w-sm h-full bg-kertas border-l-3 border-tinta shadow-2xl p-4 sm:p-5 flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Drawer Header */}
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
                  className="w-8 h-8 rounded-full bg-kertas-putih border border-tinta flex items-center justify-center text-tinta hover:bg-kraft transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-kraft/60 rounded-2xl border-2 border-tinta mb-4">
                <button
                  type="button"
                  onClick={() => setDrawerTab("player")}
                  className={`py-2 px-2.5 rounded-xl font-display font-black text-xs flex items-center justify-center gap-1.5 transition-all ${
                    drawerTab === "player"
                      ? "bg-kuning text-tinta shadow-stiker-sm border border-tinta"
                      : "text-coklat hover:text-tinta"
                  }`}
                >
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>Kuis Siswa</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDrawerTab("host")}
                  className={`py-2 px-2.5 rounded-xl font-display font-black text-xs flex items-center justify-center gap-1.5 transition-all ${
                    drawerTab === "host"
                      ? "bg-kuning text-tinta shadow-stiker-sm border border-tinta"
                      : "text-coklat hover:text-tinta"
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Panel Guru</span>
                  {hostToken && (
                    <span className="w-2 h-2 rounded-full bg-benar" />
                  )}
                </button>
              </div>

              {/* TAB 1: KUIS SISWA */}
              {drawerTab === "player" && (
                <div className="space-y-3">
                  <span className="font-label text-[11px] font-bold text-coklat block uppercase tracking-wider">
                    Navigasi Peserta
                  </span>

                  <div className="space-y-1.5">
                    {/* Beranda / Mulai */}
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentStep("pilih-bahasa");
                        setIsNavDrawerOpen(false);
                      }}
                      className={`w-full px-3 py-2.5 rounded-xl border text-left font-body font-bold text-xs flex items-center justify-between transition-all ${
                        currentStep === "pilih-bahasa"
                          ? "bg-kuning border-tinta text-tinta shadow-stiker-sm"
                          : "bg-kertas-putih border-tinta/30 text-coklat hover:bg-kraft"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-tinta" />
                        <span>Pilih Bahasa & Mulai</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCurrentStep("masukkan-pin");
                        setIsNavDrawerOpen(false);
                      }}
                      className={`w-full px-3 py-2.5 rounded-xl border text-left font-body font-bold text-xs flex items-center justify-between transition-all ${
                        currentStep === "masukkan-pin"
                          ? "bg-kuning border-tinta text-tinta shadow-stiker-sm"
                          : "bg-kertas-putih border-tinta/30 text-coklat hover:bg-kraft"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <KeyRound className="w-4 h-4 text-tinta" />
                        <span>Masukkan PIN Room</span>
                      </div>
                    </button>

                    {/* Jika sedang dalam permainan */}
                    {(playerToken || pin) && (
                      <div className="pt-2 mt-2 border-t border-dashed border-kraft space-y-1.5">
                        <div className="p-2.5 bg-kuning/30 rounded-xl border border-tinta/40">
                          <span className="font-label text-[10px] font-bold text-coklat block mb-0.5">
                            STATUS SESI BERJALAN
                          </span>
                          <span className="font-display font-black text-xs text-tinta block">
                            PIN: {pin || "---"} • {playerName || "Peserta"}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setIsNavDrawerOpen(false)}
                          className="w-full px-3 py-2.5 rounded-xl border-2 border-tinta bg-kuning text-tinta font-display font-black text-xs flex items-center justify-between shadow-stiker-sm"
                        >
                          <span>Lanjutkan Sesi Kuis</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm("Yakin ingin keluar dari sesi kuis saat ini?")) {
                              setPin("");
                              setPlayerToken(null);
                              setPlayerName("");
                              setPlayerScore(0);
                              setStreak(0);
                              setCurrentStage(1);
                              setStageQuestionIndex(0);
                              setCurrentStep("pilih-bahasa");
                              setIsNavDrawerOpen(false);
                            }
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-salah/40 text-salah hover:bg-salah/10 font-body font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Keluar dari Sesi Kuis</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Informational sites list */}
                  <div className="pt-3 border-t border-dashed border-kraft">
                    <span className="font-label text-[10px] font-bold text-coklat uppercase tracking-wider block mb-1.5">
                      5 Situs Warisan Pulau Penyengat
                    </span>
                    <div className="space-y-1">
                      {[
                        "1. Masjid Raya Sultan Riau",
                        "2. Makam Engku Putri & Raja Ali Haji",
                        "3. Istana Kantor",
                        "4. Gedung Tabib",
                        "5. Perigi Puteri",
                      ].map((siteName, idx) => (
                        <div
                          key={idx}
                          className="text-[11px] font-body text-coklat flex items-center gap-1.5 py-0.5"
                        >
                          <MapPin className="w-3 h-3 text-emas flex-shrink-0" />
                          <span className="truncate">{siteName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PANEL GURU & HOST */}
              {drawerTab === "host" && (
                <div className="space-y-3">
                  <span className="font-label text-[11px] font-bold text-coklat block uppercase tracking-wider">
                    Panel Guru & Host
                  </span>

                  {!hostToken ? (
                    /* JIKA BELUM LOGIN: DIBATASI & TERKUNCI */
                    <div className="space-y-2.5">
                      <div className="p-3 bg-kraft/40 rounded-xl border-2 border-dashed border-tinta/40 text-center">
                        <div className="w-8 h-8 rounded-full bg-kertas-putih border border-tinta mx-auto flex items-center justify-center mb-1.5 text-coklat">
                          <Lock className="w-4 h-4" />
                        </div>
                        <h4 className="font-display font-black text-xs text-tinta mb-1">
                          Akses Terbatas
                        </h4>
                        <p className="font-body text-[11px] text-coklat leading-relaxed">
                          Panel Host memerlukan autentikasi guru untuk membuat ruangan, mengontrol proyektor, dan memantau kuis.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setCurrentStep("host-login");
                          setIsNavDrawerOpen(false);
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-kuning border-2 border-tinta font-display font-black text-xs text-tinta shadow-stiker-sm flex items-center justify-center gap-2 hover:bg-[#FFD147] transition-all"
                      >
                        <KeyRound className="w-4 h-4" />
                        <span>Masuk Akun Guru</span>
                      </button>

                      {/* Locked host features preview */}
                      <div className="space-y-1.5 opacity-50 select-none">
                        {[
                          "Manajemen Ruangan",
                          "Ruang Tunggu Proyektor",
                          "Pemantauan Langsung",
                          "Hasil Akhir & Unduh CSV",
                        ].map((label, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setCurrentStep("host-login");
                              setIsNavDrawerOpen(false);
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-tinta/30 bg-kraft/30 text-coklat font-body font-bold text-xs flex items-center justify-between cursor-not-allowed"
                            title="Perlu login sebagai Host"
                          >
                            <span>{label}</span>
                            <Lock className="w-3.5 h-3.5 text-coklat/60" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* JIKA SUDAH LOGIN: AKSES DIIZINKAN */
                    <div className="space-y-2">
                      <div className="p-2.5 bg-benar/10 rounded-xl border border-benar/40 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-benar flex-shrink-0" />
                        <div className="min-w-0">
                          <span className="font-label text-[9px] font-bold text-benar uppercase block leading-none">
                            Host Terautentikasi
                          </span>
                          <span className="font-display font-bold text-xs text-tinta truncate block mt-0.5">
                            {hostEmail}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        {[
                          { id: "host-buat-room", label: `Manajemen Ruangan (${hostRooms.length}/5)` },
                          { id: "host-lobby", label: "Ruang Tunggu Proyektor" },
                          { id: "host-monitor", label: "Pemantauan Langsung" },
                          { id: "host-hasil-ekspor", label: "Hasil Akhir & Unduh CSV" },
                        ].map((item) => {
                          const isActive = currentStep === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                setCurrentStep(item.id as ScreenKey);
                                setIsNavDrawerOpen(false);
                              }}
                              className={`w-full px-3 py-2.5 rounded-xl border text-left font-body font-bold text-xs flex items-center justify-between transition-all ${
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

                      <div className="pt-2 border-t border-dashed border-kraft">
                        <button
                          type="button"
                          onClick={() => {
                            setHostToken(null);
                            setSelectedRoomId("");
                            if (typeof window !== "undefined") {
                              localStorage.removeItem("ji_host_token");
                              localStorage.removeItem("ji_host_selected_room");
                              localStorage.setItem("ji_current_step", "host-login");
                            }
                            setCurrentStep("host-login");
                            setIsNavDrawerOpen(false);
                          }}
                          className="w-full py-2 px-3 rounded-xl border border-salah/40 text-salah hover:bg-salah/10 font-body font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Keluar dari Akun Guru</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
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
