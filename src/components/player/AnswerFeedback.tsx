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
      className="w-full max-w-md mx-auto flex flex-col justify-between min-h-[calc(100dvh-60px)] px-3.5 py-3 pb-safe cursor-pointer select-none"
    >
      {/* Top Banner (Quizizz Flash Banner) */}
      <div
        className={`w-full py-3.5 px-4 rounded-3xl border-3 border-tinta shadow-stiker flex items-center justify-between text-white animate-stamp-drop ${
          isCorrect ? "bg-benar" : "bg-salah"
        }`}
      >
        <div className="flex items-center gap-2.5">
          {isCorrect ? (
            <CheckCircle2 className="w-8 h-8 stroke-[3] text-white" />
          ) : (
            <XCircle className="w-8 h-8 stroke-[3] text-white" />
          )}
          <div>
            <h2 className="font-display font-black text-2xl leading-none">
              {isCorrect
                ? lang === "id"
                  ? "BENAR!"
                  : "CORRECT!"
                : lang === "id"
                ? "KURANG TEPAT!"
                : "INCORRECT!"}
            </h2>
            <span className="font-label text-xs font-bold opacity-90">
              {isCorrect ? "+850 Poin Kecepatan" : "Tetap semangat!"}
            </span>
          </div>
        </div>

        {/* Earned Points Badge */}
        {isCorrect && (
          <div className="px-3 py-1 bg-white text-benar border-2 border-tinta rounded-xl font-display font-black text-base shadow-sm animate-bounce">
            +{earnedPoints.toLocaleString()}
          </div>
        )}
      </div>

      {/* Center Mascot & Streak Celebration */}
      <div className="my-auto flex flex-col items-center py-2">
        {/* Streak Flare Banner if active */}
        {streak >= 2 && isCorrect && (
          <div className="mb-2 px-3.5 py-1 rounded-full bg-kuning text-tinta border-2 border-tinta font-display font-black text-xs flex items-center gap-1.5 shadow-stiker-sm animate-pulse">
            <Flame className="w-4 h-4 text-salah fill-salah" />
            <span>{streak}x BERUNTUN! BONUS BERKALI LIPAT</span>
          </div>
        )}

        {/* Mascot Reaction */}
        <MascotSakti
          pose={isCorrect ? "cheering" : "encouraging"}
          size={140}
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
        <PaperCard variant="memo" className="w-full p-4 mt-2">
          {/* Answer Key Reveal */}
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-dashed border-kraft">
            <span className="font-label text-xs font-bold text-coklat uppercase">
              {lang === "id" ? "Jawaban Benar:" : "Correct Answer:"}
            </span>
            <span className="font-display font-black text-sm text-benar">
              {question.correctKey}. {lang === "id" ? correctOption?.textId : correctOption?.textEn}
            </span>
          </div>

          {/* Historical Sentence */}
          <p className="font-body text-xs sm:text-sm text-tinta font-semibold leading-relaxed">
            {lang === "id" ? question.explanationId : question.explanationEn}
          </p>
        </PaperCard>
      </div>

      {/* Quizizz Tap to Continue Bar */}
      <div className="w-full pt-2">
        <StickerButton
          variant="primary"
          size="lg"
          className="w-full text-lg flex items-center justify-center gap-2"
          onClick={onNext}
        >
          <span>
            {lang === "id"
              ? `Lanjut (${secondsLeft}s) ➔`
              : `Next (${secondsLeft}s) ➔`}
          </span>
          <ArrowRight className="w-5 h-5" />
        </StickerButton>
      </div>
    </div>
  );
};
