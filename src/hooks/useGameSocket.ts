"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  GameSocket,
  WsQuestionShow,
  WsQuestionResult,
  WsRanking,
  WsPodiumEntry,
  WsPlayerJoined,
  WsRoomState,
  WsError,
} from "@/lib/socket";
import { getWebSocketUrl } from "@/lib/api";

interface UseGameSocketOptions {
  token: string | null;
  roomId?: string;
  autoConnect?: boolean;
  onRoomStarted?: () => void;
  onRoomEnded?: (data: { podium: WsPodiumEntry[]; school_lb?: any[] }) => void;
  onPlayerKicked?: (reason: string) => void;
  onError?: (err: WsError) => void;
}

export function useGameSocket({
  token,
  roomId,
  autoConnect = true,
  onRoomStarted,
  onRoomEnded,
  onPlayerKicked,
  onError,
}: UseGameSocketOptions) {
  const [status, setStatus] = useState<"disconnected" | "connecting" | "open" | "closed" | "error">("disconnected");
  const [roomState, setRoomState] = useState<WsRoomState | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<WsQuestionShow | null>(null);
  const [lastResult, setLastResult] = useState<WsQuestionResult | null>(null);
  const [rankings, setRankings] = useState<WsRanking[]>([]);
  const [podium, setPodium] = useState<WsPodiumEntry[]>([]);
  const [joinedPlayers, setJoinedPlayers] = useState<WsPlayerJoined[]>([]);
  const [lastError, setLastError] = useState<WsError | null>(null);

  const socketRef = useRef<GameSocket | null>(null);

  // Keep callback refs fresh
  const onRoomStartedRef = useRef(onRoomStarted);
  onRoomStartedRef.current = onRoomStarted;

  const onRoomEndedRef = useRef(onRoomEnded);
  onRoomEndedRef.current = onRoomEnded;

  const onPlayerKickedRef = useRef(onPlayerKicked);
  onPlayerKickedRef.current = onPlayerKicked;

  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const connect = useCallback(() => {
    if (!token) return;

    if (socketRef.current) {
      socketRef.current.close();
    }

    const url = getWebSocketUrl(token, roomId);
    const socket = new GameSocket(url);
    socketRef.current = socket;

    socket.onStatusChange((s) => setStatus(s));

    socket.on("room.state", (data: WsRoomState) => {
      setRoomState(data);
      if (data.players && Array.isArray(data.players) && data.players.length > 0) {
        setJoinedPlayers((prev) => {
          const map = new Map<string, WsPlayerJoined>();
          for (const p of prev) {
            map.set(p.nickname || p.id, p);
          }
          for (let idx = 0; idx < data.players!.length; idx++) {
            const p = data.players![idx];
            const id = p.id || `p-${idx}`;
            const key = p.nickname || id;
            map.set(key, {
              id,
              nickname: p.nickname,
              avatar: p.avatar || 1,
              school: p.school || "-",
              lang: "id",
            });
          }
          return Array.from(map.values());
        });
      }
    });

    socket.on("room.started", () => {
      onRoomStartedRef.current?.();
    });

    socket.on("q.show", (data: WsQuestionShow) => {
      setActiveQuestion(data);
      setLastResult(null); // Clear previous result when new question arrives
    });

    socket.on("q.result", (data: WsQuestionResult) => {
      setLastResult(data);
      if (data.score !== undefined && roomState) {
        setRoomState((prev) => (prev ? { ...prev, score: data.score, streak: data.streak } : null));
      }
    });

    socket.on("lb.update", (data: { rankings: WsRanking[] }) => {
      if (data.rankings) {
        setRankings(data.rankings);
      }
    });

    socket.on("room.ended", (data: { podium: WsPodiumEntry[]; school_lb?: any[] }) => {
      if (data.podium) {
        setPodium(data.podium);
      }
      onRoomEndedRef.current?.(data);
    });

    socket.on("player.joined", (data: WsPlayerJoined) => {
      setJoinedPlayers((prev) => {
        const exists = prev.some((p) => p.nickname === data.nickname || p.id === data.id);
        if (exists) return prev;
        return [...prev, data];
      });
    });

    socket.on("player.kicked", (data: { reason: string }) => {
      onPlayerKickedRef.current?.(data.reason);
    });

    socket.on("error", (data: WsError) => {
      setLastError(data);
      onErrorRef.current?.(data);
    });

    socket.connect();
  }, [token, roomId]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    setStatus("disconnected");
  }, []);

  useEffect(() => {
    if (autoConnect && token) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [autoConnect, token, connect, disconnect]);

  // Actions
  const sendAnswer = useCallback((questionId: string, optionId: string | null) => {
    socketRef.current?.send("q.answer", {
      question_id: questionId,
      option_id: optionId,
    });
  }, []);

  const sendNext = useCallback(() => {
    socketRef.current?.send("q.next");
  }, []);

  const hostStart = useCallback(() => {
    socketRef.current?.send("host.start");
  }, []);

  const hostEnd = useCallback(() => {
    socketRef.current?.send("host.end");
  }, []);

  const hostKick = useCallback((playerId: string) => {
    socketRef.current?.send("host.kick", { player_id: playerId });
  }, []);

  return {
    status,
    roomState,
    activeQuestion,
    lastResult,
    rankings,
    podium,
    joinedPlayers,
    lastError,
    connect,
    disconnect,
    sendAnswer,
    sendNext,
    hostStart,
    hostEnd,
    hostKick,
  };
}
