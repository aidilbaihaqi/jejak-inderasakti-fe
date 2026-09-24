/**
 * Jejak Inderasakti API & WebSocket Configuration
 * Contracts: contracts/openapi.yaml & contracts/ws.md
 *
 * All REST calls use relative URLs ("/api/…") so they go through the
 * Next.js rewrite proxy defined in next.config.ts — this avoids CORS
 * issues when the backend is on a different origin.
 *
 * WebSocket URL is computed dynamically from window.location so it
 * also goes through the same-origin proxy path.
 */

export const API_CONFIG = {
  /** Relative — proxied by Next.js rewrites to BACKEND_ORIGIN */
  apiUrl: "/api",

  /** Computed at runtime so it works in both dev and production. */
  get wsUrl(): string {
    if (process.env.NEXT_PUBLIC_WS_URL) {
      return process.env.NEXT_PUBLIC_WS_URL;
    }
    // The API is on its own subdomain (api.penyengatadventure.tech), not the frontend's origin,
    // so — unlike /api, which Next.js rewrites proxy same-origin — WS must target it directly
    // (rewrites don't support the upgrade). This fallback only matters if NEXT_PUBLIC_WS_URL was
    // left unset at build time; the Docker image always sets it (see Dockerfile / deploy/README.md).
    if (typeof window === "undefined") return "wss://api.penyengatadventure.tech/ws";
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return "ws://localhost:8080/ws";
    }
    const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
    return `${proto}//${window.location.host}/ws`;
  },
};

export type Jenjang = "SD" | "SMP" | "SMA";
export type Lang = "id" | "en";

export interface School {
  id: number;
  name: string;
  jenjang: string | null;
}

export interface SchoolRank {
  school: string;
  avg_score: number;
  player_count: number;
}

export interface RoomInfo {
  status: "lobby" | "running";
  slots_left: number;
  jenjang: Jenjang;
}

export interface CreateRoomPayload {
  jenjang: Jenjang;
  short_session?: boolean;
  accuracy_mode?: boolean;
  consent_confirmed: boolean;
}

export interface CreateRoomResponse {
  id: string;
  pin: string;
  qr_url: string;
}

export interface JoinPayload {
  nickname: string;
  school_id?: number | null;
  jenjang: Jenjang;
  avatar: number; // 1-12
  lang: Lang;
}

export interface JoinResponse {
  player_token: string;
}

/**
 * Fetch list of registered schools from backend autocomplete
 */
export async function getSchools(query?: string): Promise<School[]> {
  const url = query
    ? `${API_CONFIG.apiUrl}/schools?q=${encodeURIComponent(query)}`
    : `${API_CONFIG.apiUrl}/schools`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Gagal memuat daftar sekolah (${res.status})`);
  }
  return res.json();
}

/**
 * Check room status and slots by 6-digit PIN
 */
export async function getRoomByPin(pin: string): Promise<RoomInfo> {
  const res = await fetch(`${API_CONFIG.apiUrl}/rooms/${pin}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Ruangan PIN ${pin} tidak ditemukan (${res.status})`);
  }
  return res.json();
}

/**
 * Join a room as player
 */
export async function joinRoom(pin: string, payload: JoinPayload): Promise<JoinResponse> {
  const res = await fetch(`${API_CONFIG.apiUrl}/rooms/${pin}/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Gagal bergabung ke ruangan (${res.status})`);
  }
  return res.json();
}

/**
 * Host login
 */
export async function hostLogin(
  email: string,
  password: string
): Promise<{ token: string }> {
  const res = await fetch(`${API_CONFIG.apiUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Login gagal: Email atau password tidak valid`);
  }
  return res.json();
}

/**
 * Host: Create a new room
 */
export async function createRoom(
  token: string,
  payload: CreateRoomPayload
): Promise<CreateRoomResponse> {
  const res = await fetch(`${API_CONFIG.apiUrl}/rooms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Gagal membuat ruangan (${res.status})`);
  }
  return res.json();
}

/**
 * Host: Download results CSV
 */
export async function getRoomResultsCsv(token: string, roomId: string): Promise<string> {
  const res = await fetch(`${API_CONFIG.apiUrl}/rooms/${roomId}/results.csv`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Gagal mengunduh rekap CSV (${res.status})`);
  }
  return res.text();
}

/**
 * Get school leaderboard
 */
export async function getSchoolLeaderboard(): Promise<SchoolRank[]> {
  const res = await fetch(`${API_CONFIG.apiUrl}/leaderboard/schools`);
  if (!res.ok) {
    throw new Error(`Gagal memuat peringkat sekolah (${res.status})`);
  }
  return res.json();
}

/**
 * Helper to construct WebSocket connection URL
 */
export function getWebSocketUrl(token: string, roomId?: string): string {
  const base = API_CONFIG.wsUrl;
  if (roomId) {
    return `${base}?token=${encodeURIComponent(token)}&room=${encodeURIComponent(roomId)}`;
  }
  return `${base}?token=${encodeURIComponent(token)}`;
}
