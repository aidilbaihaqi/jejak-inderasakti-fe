import React, { useState, useEffect } from "react";
import { AnswerTile, AnswerState } from "../ui/AnswerTile";
import { ScoreChip } from "../ui/ScoreChip";
import { SITES_DATA } from "../assets/PulauPenyengatMap";
import { Flame, Clock, Sparkles } from "lucide-react";

export interface QuestionData {
  id: string;
  stageId: number;
  questionNumber: number;
  totalQuestions: number;
  textId: string;
  textEn: string;
  options: {
    key: "A" | "B" | "C" | "D";
    textId: string;
    textEn: string;
  }[];
  correctKey: "A" | "B" | "C" | "D";
  explanationId: string;
  explanationEn: string;
}

interface QuizQuestionProps {
  question: QuestionData;
  score: number;
  streak: number;
  onAnswer: (selectedKey: "A" | "B" | "C" | "D", isCorrect: boolean) => void;
  lang: "id" | "en";
  isMuted?: boolean;
  onToggleMute?: () => void;
  onToggleLang?: () => void;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  score,
  streak,
  onAnswer,
  lang,
}) => {
  const totalSeconds = 15;
  const [remainingTime, setRemainingTime] = useState(totalSeconds);
  const [selectedKey, setSelectedKey] = useState<"A" | "B" | "C" | "D" | null>(
    null
  );
  const site = SITES_DATA[question.stageId - 1] || SITES_DATA[0];

  // 15 seconds countdown timer
  useEffect(() => {
    if (selectedKey !== null) return; // Stop timer once answered

    if (remainingTime <= 0) {
      onAnswer("A", false);
      return;
    }

    const interval = setInterval(() => {
      setRemainingTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingTime, selectedKey, onAnswer]);

  const handleSelectOption = (key: "A" | "B" | "C" | "D") => {
    if (selectedKey !== null) return;
    setSelectedKey(key);
    const isCorrect = key === question.correctKey;
    setTimeout(() => {
      onAnswer(key, isCorrect);
    }, 350);
  };

  const timerPct = Math.max(0, (remainingTime / totalSeconds) * 100);
  const isUrgent = remainingTime <= 5;

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-between min-h-[calc(100dvh-60px)] px-3.5 py-2.5 pb-safe select-none">
      {/* Quizizz Signature Top Edge Timer Bar */}
      <div className="w-full h-2 bg-kraft/70 rounded-full border border-tinta/30 overflow-hidden mb-2">
        <div
          className={`h-full transition-all duration-1000 ease-linear rounded-full ${
            isUrgent ? "bg-salah animate-pulse" : "bg-kuning"
          }`}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      {/* Quizizz Live Header Row */}
      <div className="flex items-center justify-between gap-2 px-1 mb-2">
        {/* Left: Stage & Question Counter */}
        <div className="flex items-center gap-2">
          <div
            className="w-3.5 h-3.5 rounded-full border-2 border-tinta flex-shrink-0"
            style={{ backgroundColor: site.color }}
          />
          <div className="flex flex-col">
            <span className="font-display font-black text-xs sm:text-sm text-tinta leading-tight">
              {lang === "id" ? site.name : site.nameEn}
            </span>
            <span className="font-label text-[10px] text-coklat font-bold">
              {lang === "id"
                ? `Soal ${question.questionNumber} dari ${question.totalQuestions}`
                : `Question ${question.questionNumber} of ${question.totalQuestions}`}
            </span>
          </div>
        </div>

        {/* Right: Score & Streak Badge */}
        <div className="flex items-center gap-2">
          {streak >= 2 && (
            <div className="px-2.5 py-1 rounded-xl bg-salah text-white border-2 border-tinta font-display font-black text-xs flex items-center gap-1 shadow-stiker-sm animate-bounce">
              <Flame className="w-3.5 h-3.5 fill-white text-white" />
              <span>{streak}x</span>
            </div>
          )}

          <div className="px-3 py-1 rounded-xl bg-kuning text-tinta border-2 border-tinta font-display font-black text-sm shadow-stiker-sm flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-coklat" />
            <span>{score.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Quizizz Center Question Card */}
      <div className="my-auto w-full py-1 sm:py-2">
        <div className="w-full bg-kertas-putih rounded-3xl border-3 border-tinta shadow-stiker p-3.5 sm:p-5 text-center relative flex flex-col items-center">
          {/* Authentic Site Photo with Paper-Torn Edges */}
          {site.image && (
            <div className="w-full max-h-28 sm:max-h-36 mb-2.5 flex items-center justify-center overflow-hidden rounded-2xl bg-kraft/20 border-2 border-tinta/20 shadow-xs relative">
              <img
                src={site.image}
                alt={site.name}
                className="max-h-28 sm:max-h-36 w-auto object-contain drop-shadow-sm select-none"
              />
              <span
                className="absolute bottom-1.5 right-2 px-2 py-0.5 rounded-md font-label text-[9px] font-bold text-white shadow-xs"
                style={{ backgroundColor: site.color }}
              >
                {lang === "id" ? site.name : site.nameEn}
              </span>
            </div>
          )}

          {/* Question Text */}
          <h2 className="font-display font-extrabold text-base sm:text-lg md:text-xl text-tinta leading-snug">
            {lang === "id" ? question.textId : question.textEn}
          </h2>

          {/* Time Countdown Badge */}
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-kraft/50 border border-tinta/30 font-label font-bold text-xs text-coklat">
            <Clock className="w-3 h-3 text-coklat" />
            <span>
              {remainingTime} {lang === "id" ? "detik tersisa" : "seconds left"}
            </span>
          </div>
        </div>
      </div>

      {/* Quizizz 2x2 Answer Grid (Thumb Zone - 4 Vibrant Tactile Buttons) */}
      <div className="w-full grid grid-cols-2 gap-2.5 sm:gap-3 pt-2 pb-1">
        {question.options.map((opt) => {
          let state: AnswerState = "idle";
          if (selectedKey === opt.key) {
            state = "selected";
          }

          return (
            <AnswerTile
              key={opt.key}
              optionKey={opt.key}
              text={lang === "id" ? opt.textId : opt.textEn}
              state={state}
              layout="grid"
              onClick={() => handleSelectOption(opt.key)}
              disabled={selectedKey !== null}
            />
          );
        })}
      </div>
    </div>
  );
};
