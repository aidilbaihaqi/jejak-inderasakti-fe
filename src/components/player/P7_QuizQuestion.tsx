import React, { useState, useEffect } from "react";
import { StageHeader } from "../ui/StageHeader";
import { TimerBar } from "../ui/TimerBar";
import { AnswerTile, AnswerState } from "../ui/AnswerTile";
import { PaperCard } from "../ui/PaperCard";
import { ScoreChip } from "../ui/ScoreChip";
import { SITES_DATA } from "../assets/PulauPenyengatMap";

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

interface P7Props {
  question: QuestionData;
  score: number;
  streak: number;
  onAnswer: (selectedKey: "A" | "B" | "C" | "D", isCorrect: boolean) => void;
  lang: "id" | "en";
  isMuted?: boolean;
  onToggleMute?: () => void;
  onToggleLang?: () => void;
}

export const P7_QuizQuestion: React.FC<P7Props> = ({
  question,
  score,
  streak,
  onAnswer,
  lang,
  isMuted,
  onToggleMute,
  onToggleLang,
}) => {
  const [remainingTime, setRemainingTime] = useState(15);
  const [selectedKey, setSelectedKey] = useState<"A" | "B" | "C" | "D" | null>(
    null
  );
  const site = SITES_DATA[question.stageId - 1] || SITES_DATA[0];

  // 15 seconds countdown timer
  useEffect(() => {
    if (selectedKey !== null) return; // Stop timer once answered

    if (remainingTime <= 0) {
      // Time up! Auto submit wrong
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
    // Brief delay to trigger selected state before moving to feedback screen
    setTimeout(() => {
      onAnswer(key, isCorrect);
    }, 350);
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-between min-h-[640px] p-4 sm:p-5">
      {/* Stage Header */}
      <div className="w-full space-y-3">
        <StageHeader
          siteName={lang === "id" ? site.name : site.nameEn}
          siteColor={site.color}
          stageNumber={question.stageId}
          questionNumber={question.questionNumber}
          totalQuestions={question.totalQuestions}
          isMuted={isMuted}
          onToggleMute={onToggleMute}
          lang={lang}
          onToggleLang={onToggleLang}
        />

        {/* Score & Timer Row */}
        <div className="flex items-center justify-between gap-3">
          <ScoreChip score={score} streak={streak} />
          <div className="flex-1 max-w-[220px]">
            <TimerBar
              durationSeconds={15}
              remainingSeconds={remainingTime}
            />
          </div>
        </div>
      </div>

      {/* Main Question Card (Memo Style) */}
      <div className="my-auto w-full py-2">
        <PaperCard
          variant="memo"
          washiTape
          washiTapeColor={site.color}
          washiTapeText={`PERTANYAAN ${question.questionNumber} DARI ${question.totalQuestions}`}
          className="p-5 sm:p-6"
        >
          <h2 className="font-display font-extrabold text-xl sm:text-2xl text-tinta leading-snug">
            {lang === "id" ? question.textId : question.textEn}
          </h2>
        </PaperCard>
      </div>

      {/* 4 Large Answer Tiles (Thumb zone, min height 64px) */}
      <div className="w-full space-y-3 pt-2">
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
              onClick={() => handleSelectOption(opt.key)}
              disabled={selectedKey !== null}
            />
          );
        })}
      </div>
    </div>
  );
};
