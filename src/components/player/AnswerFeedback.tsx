import React, { useEffect, useState } from "react";
import { QuestionData } from "./QuizQuestion";
import { MascotSakti } from "../assets/MascotSakti";
import { PaperCard } from "../ui/PaperCard";
import { StickerButton } from "../ui/StickerButton";
import { CheckCircle2, XCircle, Flame, ArrowRight, Trophy, Zap } from "lucide-react";

interface AnswerFeedbackProps {
  question: QuestionData;
  userAnswerKey: "A" | "B" | "C" | "D";
  isCorrect: boolean;
  earnedPoints: number;
  totalScore: number;
  streak: number;
  explanation?: string;
  onNext: () => void;
  lang: "id" | "en";
}

export const AnswerFeedback: React.FC<AnswerFeedbackProps> = ({
  question,
  userAnswerKey,
  isCorrect,
  earnedPoints,
  totalScore,
  streak,
  explanation,
  onNext,
  lang,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(3);

  // Auto advance after 3 seconds
  useEffect(() => {
    if (secondsLeft <= 0) {
      onNext();
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, onNext]);

  const correctOption = question.options.find((o) => o.key === question.correctKey);

  return (
    <div
      onClick={onNext}
      className="w-full max-w-md mx-auto flex flex-col justify-between h-full max-h-full px-3 py-1.5 min-h-0 overflow-hidden pb-safe cursor-pointer select-none"
    >
      {/* Top Banner (Quizizz Flash Banner) */}
      <div
        className={`w-full py-2.5 px-3.5 rounded-2xl border-2 sm:border-3 border-tinta shadow-stiker flex items-center justify-between text-white animate-stamp-drop ${
          isCorrect ? "bg-benar" : "bg-salah"
        }`}
      >
        <div className="flex items-center gap-2">
          {isCorrect ? (
            <CheckCircle2 className="w-7 h-7 stroke-[3] text-white" />
          ) : (
            <XCircle className="w-7 h-7 stroke-[3] text-white" />
          )}
          <div>
            <h2 className="font-display font-black text-xl leading-none">
              {isCorrect
                ? lang === "id"
                  ? "BENAR!"
                  : "CORRECT!"
                : lang === "id"
                ? "KURANG TEPAT!"
                : "INCORRECT!"}
            </h2>
            <span className="font-label text-[11px] font-bold opacity-90">
              {isCorrect ? `+${earnedPoints} Poin` : "Tetap semangat!"}
            </span>
          </div>
        </div>

        {/* Earned Points Badge */}
        {isCorrect && (
          <div className="px-2.5 py-0.5 bg-white text-benar border-2 border-tinta rounded-xl font-display font-black text-sm shadow-sm animate-bounce">
            +{earnedPoints.toLocaleString()}
          </div>
        )}
      </div>

      {/* Center Mascot & Streak Celebration */}
      <div className="my-auto flex flex-col items-center py-1">
        {/* Streak Flare Banner if active */}
        {streak >= 2 && isCorrect && (
          <div className="mb-1 px-3 py-0.5 rounded-full bg-kuning text-tinta border-2 border-tinta font-display font-black text-xs flex items-center gap-1 shadow-stiker-sm animate-pulse">
            <Flame className="w-3.5 h-3.5 text-salah fill-salah" />
            <span>{streak}x BERUNTUN!</span>
          </div>
        )}

        {/* Mascot Reaction */}
        <MascotSakti
          pose={isCorrect ? "cheering" : "encouraging"}
          size={95}
          speechBubble={
            isCorrect
              ? lang === "id"
                ? "Luar biasa! Jawabanmu akurat!"
                : "Brilliant! You're on fire!"
              : lang === "id"
              ? "Tak apa, pelajari faktanya yuk!"
              : "No worries, check the fact below!"
          }
        />

        {/* Historical Explanation Box */}
        <PaperCard variant="memo" className="w-full p-2.5 sm:p-3 mt-1.5">
          {/* Answer Key Reveal */}
          <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-dashed border-kraft">
            <span className="font-label text-[11px] font-bold text-coklat uppercase">
              {lang === "id" ? "Jawaban Benar:" : "Correct Answer:"}
            </span>
            <span className="font-display font-black text-xs sm:text-sm text-benar">
              {question.correctKey}. {lang === "id" ? correctOption?.textId : correctOption?.textEn}
            </span>
          </div>

          {/* Historical Sentence */}
          <p className="font-body text-xs text-tinta font-semibold leading-relaxed">
            {explanation || (lang === "id" ? question.explanationId : question.explanationEn)}
          </p>
        </PaperCard>
      </div>

      {/* Quizizz Tap to Continue Bar */}
      <div className="w-full pt-1.5">
        <StickerButton
          variant="primary"
          size="md"
          className="w-full text-base py-2 flex items-center justify-center gap-2"
          onClick={onNext}
        >
          <span>
            {lang === "id"
              ? `Lanjut (${secondsLeft}s)`
              : `Next (${secondsLeft}s)`}
          </span>
          <ArrowRight className="w-4 h-4 flex-shrink-0" />
        </StickerButton>
      </div>
    </div>
  );
};
