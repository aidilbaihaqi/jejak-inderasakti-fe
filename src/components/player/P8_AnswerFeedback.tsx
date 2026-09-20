import React, { useEffect, useState } from "react";
import { QuestionData } from "./P7_QuizQuestion";
import { MascotSakti } from "../assets/MascotSakti";
import { ScoreChip } from "../ui/ScoreChip";
import { PaperCard } from "../ui/PaperCard";
import { StickerButton } from "../ui/StickerButton";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";

interface P8Props {
  question: QuestionData;
  userAnswerKey: "A" | "B" | "C" | "D";
  isCorrect: boolean;
  earnedPoints: number;
  totalScore: number;
  streak: number;
  onNext: () => void;
  lang: "id" | "en";
}

export const P8_AnswerFeedback: React.FC<P8Props> = ({
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
      className="w-full max-w-md mx-auto flex flex-col justify-between min-h-[640px] p-5 cursor-pointer select-none"
    >
      {/* Top Score Bar */}
      <div className="flex items-center justify-between">
        <ScoreChip
          score={totalScore}
          flyScore={isCorrect ? earnedPoints : null}
          streak={streak}
        />
        <div className="font-label text-xs font-bold text-coklat bg-kraft/60 px-3 py-1 rounded-full border border-tinta/30">
          {lang === "id" ? `Lanjut dalam ${secondsLeft}s` : `Next in ${secondsLeft}s`}
        </div>
      </div>

      {/* Center Feedback Stamp & Mascot */}
      <div className="my-auto w-full flex flex-col items-center gap-4 py-2">
        {/* Angled Stamp */}
        <div className="relative">
          {isCorrect ? (
            <div className="px-6 py-2.5 bg-benar text-white border-4 border-white rounded-2xl font-display font-black text-3xl uppercase tracking-wider shadow-stiker-lg animate-stamp-drop flex items-center gap-2 -rotate-6">
              <CheckCircle2 className="w-8 h-8 stroke-[3]" />
              <span>BENAR!</span>
            </div>
          ) : (
            <div className="px-6 py-2.5 bg-salah text-white border-4 border-white rounded-2xl font-display font-black text-3xl uppercase tracking-wider shadow-stiker-lg animate-stamp-drop flex items-center gap-2 rotate-6">
              <XCircle className="w-8 h-8 stroke-[3]" />
              <span>COBA LAGI!</span>
            </div>
          )}
        </div>

        {/* Mascot Reaction */}
        <div className="flex justify-center my-1">
          <MascotSakti
            pose={isCorrect ? "cheering" : "encouraging"}
            size={140}
            speechBubble={
              isCorrect
                ? lang === "id"
                  ? "Hebat sekali! Jawabanmu tepat!"
                  : "Awesome! You nailed it!"
                : lang === "id"
                ? "Tidak apa-apa, kamu pasti bisa di soal berikutnya!"
                : "Keep it up! You'll get the next one!"
            }
          />
        </div>

        {/* Historical Explanation Memo Card */}
        <PaperCard variant="memo" className="w-full p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-dashed border-kraft">
            <span className="font-label text-xs font-bold uppercase tracking-wider text-coklat">
              {lang === "id" ? "Kunci Jawaban & Fakta:" : "Key Answer & Fact:"}
            </span>
          </div>

          {/* Correct Answer Display */}
          <div className="mb-2">
            <span className="font-display font-black text-base text-benar">
              {question.correctKey}. {lang === "id" ? correctOption?.textId : correctOption?.textEn}
            </span>
          </div>

          {/* Explanation Text */}
          <p className="font-body text-xs sm:text-sm text-tinta font-semibold leading-relaxed bg-kertas/50 p-2.5 rounded-xl border border-tinta/20">
            {lang === "id" ? question.explanationId : question.explanationEn}
          </p>
        </PaperCard>
      </div>

      {/* Tap to Continue Button */}
      <div className="w-full pt-3">
        <StickerButton
          variant="primary"
          size="lg"
          className="w-full text-xl flex items-center justify-center gap-2"
          onClick={onNext}
        >
          <span>{lang === "id" ? "Lanjutkan ➔" : "Continue ➔"}</span>
          <ArrowRight className="w-5 h-5" />
        </StickerButton>
      </div>
    </div>
  );
};
