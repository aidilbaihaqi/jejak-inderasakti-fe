/**
 * WebSocket Client for Jejak Inderasakti
 * Implements protocol contract from contracts/ws.md
 */

export interface WsMessage<T = any> {
  t: string;
  d?: T;
}

export interface WsOption {
  id: string;
  label: string;
}

export interface WsQuestionShow {
  id?: string;
  question_id?: string;
  index: number;
  total: number;
  site: number;
  level: number;
  prompt: string;
  options: WsOption[];
  limit_ms: number;
}

export interface WsQuestionResult {
  correct: boolean;
  correct_option_id: string;
  explanation: string;
  points: number;
  score: number;
  streak: number;
  finished: boolean;
}

export interface WsRanking {
  rank: number;
  nickname: string;
  school: string;
  score: number;
  correct_count: number;
}

export interface WsPodiumEntry {
  rank: number;
  nickname: string;
  avatar: number;
  score: number;
}

export interface WsPlayerJoined {
  id: string;
  nickname: string;
  avatar: number;
  school: string;
  lang: string;
}

export interface WsRoomState {
  status: string;
  current_index: number;
  score: number;
  streak: number;
  players?: Array<{
    id?: string;
    nickname: string;
    avatar: number;
    school?: string;
    score?: number;
  }>;
}

export interface WsError {
  code: string;
  message: string;
  ref?: string;
}

export type WsEventListener = (data: any) => void;

export class GameSocket {
  private ws: WebSocket | null = null;
  private url: string;
  private pingInterval: any = null;
  private listeners: Map<string, Set<WsEventListener>> = new Map();
  private statusListeners: Set<(status: "connecting" | "open" | "closed" | "error") => void> = new Set();
  private isExplicitlyClosed = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;

  constructor(url: string) {
    this.url = url;
  }

  public connect(): void {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.isExplicitlyClosed = false;
    this.notifyStatus("connecting");

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        this.notifyStatus("open");
        this.startPing();
      };

      this.ws.onmessage = (event: MessageEvent) => {
        try {
          const msg: WsMessage = JSON.parse(event.data);
          this.emit(msg.t, msg.d);
        } catch (err) {
          console.error("[WS] Failed to parse message:", event.data, err);
        }
      };

      this.ws.onerror = () => {
        this.notifyStatus("error");
      };

      this.ws.onclose = (event) => {
        this.stopPing();
        this.notifyStatus("closed");
        // Don't auto-retry if room ended/unauthorized (4401) or cleanly closed (1000)
        if (event.code === 4401 || event.code === 1000) {
          return;
        }
        if (!this.isExplicitlyClosed && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts += 1;
          setTimeout(() => {
            if (!this.isExplicitlyClosed) {
              this.connect();
            }
          }, 3000);
        }
      };
    } catch (err) {
      this.notifyStatus("error");
    }
  }

  public close(): void {
    this.isExplicitlyClosed = true;
    this.stopPing();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.notifyStatus("closed");
  }

  public send(type: string, data?: any): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      if (type !== "host.end") {
        console.warn(`[WS] Cannot send "${type}", socket not connected`);
      }
      return;
    }

    const payload: WsMessage = { t: type };
    if (data !== undefined) {
      payload.d = data;
    }
    this.ws.send(JSON.stringify(payload));
  }

  public on(type: string, listener: WsEventListener): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(listener);

    return () => {
      this.listeners.get(type)?.delete(listener);
    };
  }

  public onStatusChange(listener: (status: "connecting" | "open" | "closed" | "error") => void): () => void {
    this.statusListeners.add(listener);
    return () => {
      this.statusListeners.delete(listener);
    };
  }

  private notifyStatus(status: "connecting" | "open" | "closed" | "error"): void {
    this.statusListeners.forEach((listener) => listener(status));
  }

  private emit(type: string, data: any): void {
    const set = this.listeners.get(type);
    if (set) {
      set.forEach((listener) => {
        try {
          listener(data);
        } catch (e) {
          console.error(`[WS] Listener error on event "${type}":`, e);
        }
      });
    }
  }

  private startPing(): void {
    this.stopPing();
    // Keepalive ping every 20 seconds as specified in contracts/ws.md
    this.pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send("ping");
      }
    }, 20000);
  }

  private stopPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }
}
