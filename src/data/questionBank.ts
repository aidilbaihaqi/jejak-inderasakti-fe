import rawQuestions from "./questions.json";
import { QuestionData } from "@/components/player/QuizQuestion";

export interface RawDbOption {
  id: string;
  label: {
    id: string;
    en: string;
  };
  correct: boolean;
}

export interface RawDbQuestion {
  id: string;
  site: number;
  level: number;
  type: string;
  prompt: {
    id: string;
    en: string;
  };
  options: RawDbOption[];
  explanation: {
    id: string;
    en: string;
  };
  active: boolean;
}

export const DB_QUESTIONS: RawDbQuestion[] = rawQuestions as RawDbQuestion[];

const OPTION_KEYS: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];

/**
 * Converts a raw database question into QuestionData used by UI components
 */
export function formatDbQuestion(
  q: RawDbQuestion,
  questionNumber = 1,
  totalQuestions = 15
): QuestionData {
  let correctKey: "A" | "B" | "C" | "D" = "A";

  const options = q.options.map((opt, idx) => {
    const key = OPTION_KEYS[idx] || "A";
    if (opt.correct) {
      correctKey = key;
    }
    return {
      key,
      textId: opt.label.id,
      textEn: opt.label.en,
      optionId: opt.id,
    };
  });

  return {
    id: q.id,
    stageId: q.site,
    questionNumber,
    totalQuestions,
    textId: q.prompt.id,
    textEn: q.prompt.en,
    options,
    correctKey,
    explanationId: q.explanation.id,
    explanationEn: q.explanation.en,
  };
}

/**
 * Difficulty composition per stage according to docs/04_Data_Modelling.md §8
 * and api/internal/game/selector.go
 */
const STAGE_COMPOSITION: Record<string, number[][]> = {
  SD: [
    [1, 1, 2], // Stage 1 (Masjid)
    [1, 1, 2], // Stage 2 (Makam)
    [1, 2, 2], // Stage 3 (Istana)
    [1, 2, 2], // Stage 4 (Tabib)
    [1, 2, 3], // Stage 5 (Perigi)
  ],
  SMP: [
    [1, 1, 2],
    [1, 2, 2],
    [1, 2, 3],
    [1, 2, 3],
    [1, 2, 3],
  ],
  SMA: [
    [1, 2, 2],
    [1, 2, 3],
    [1, 2, 3],
    [2, 2, 3],
    [2, 3, 3],
  ],
};

/**
 * Retrieve the 3 questions for a specific stage matching the real DB question bank
 */
export function getQuestionsForStage(
  stageId: number,
  jenjang: "SD" | "SMP" | "SMA" | "UMUM" = "SMP",
  shortSession = false
): QuestionData[] {
  const jenjangKey = jenjang === "UMUM" ? "SD" : jenjang;
  const stageIndex = Math.max(0, Math.min(4, stageId - 1));
  const levels = STAGE_COMPOSITION[jenjangKey]?.[stageIndex] || [1, 2, 2];

  const targetLevels = shortSession ? [levels[0], levels[2]] : levels;
  const sitePool = DB_QUESTIONS.filter((q) => q.site === stageId && q.active);

  const selected: RawDbQuestion[] = [];
  const usedIds = new Set<string>();

  for (const lvl of targetLevels) {
    const candidates = sitePool.filter((q) => q.level === lvl && !usedIds.has(q.id));
    if (candidates.length > 0) {
      const picked = candidates[0];
      usedIds.add(picked.id);
      selected.push(picked);
    } else {
      const fallback = sitePool.find((q) => !usedIds.has(q.id));
      if (fallback) {
        usedIds.add(fallback.id);
        selected.push(fallback);
      }
    }
  }

  return selected.map((q, idx) =>
    formatDbQuestion(q, idx + 1, targetLevels.length)
  );
}

/**
 * Retrieve all 15 questions for a full session (5 stages * 3 questions)
 */
export function getAllSessionQuestions(
  jenjang: "SD" | "SMP" | "SMA" | "UMUM" = "SMP",
  shortSession = false
): QuestionData[] {
  const all: QuestionData[] = [];
  const total = shortSession ? 10 : 15;

  for (let stage = 1; stage <= 5; stage++) {
    const stageQuestions = getQuestionsForStage(stage, jenjang, shortSession);
    stageQuestions.forEach((q) => {
      all.push({
        ...q,
        questionNumber: all.length + 1,
        totalQuestions: total,
      });
    });
  }

  return all;
}

/**
 * Match a raw question from the question bank by prompt text (exact or trimmed)
 * Used to resolve real question IDs and explanations for live WebSocket payloads
 */
export function findQuestionByPrompt(prompt: string): RawDbQuestion | undefined {
  if (!prompt) return undefined;
  const normalized = prompt.trim().toLowerCase();

  return DB_QUESTIONS.find(
    (q) =>
      q.prompt.id.trim().toLowerCase() === normalized ||
      q.prompt.en.trim().toLowerCase() === normalized ||
      normalized.includes(q.prompt.id.trim().toLowerCase()) ||
      q.prompt.id.trim().toLowerCase().includes(normalized)
  );
}

/**
 * Find question by its database ID (e.g. "M1-01")
 */
export function findQuestionById(id: string): RawDbQuestion | undefined {
  return DB_QUESTIONS.find((q) => q.id === id);
}
