import React from "react";

interface TimerBarProps {
  durationSeconds: number; // total duration
  remainingSeconds: number; // current seconds
  className?: string;
}

export const TimerBar: React.FC<TimerBarProps> = ({
  durationSeconds = 15,
  remainingSeconds = 15,
  className = "",
}) => {
  const percentage = Math.max(
    0,
    Math.min(100, (remainingSeconds / durationSeconds) * 100)
  );
  const isUrgent = remainingSeconds <= 5 && remainingSeconds > 0;

  return (
    <div className={`w-full flex items-center gap-3 ${className}`}>
      {/* Progress Track */}
      <div className="relative flex-1 h-5 bg-kraft/70 rounded-full border-2 border-tinta p-0.5 overflow-hidden shadow-inner">
        {/* Fill Bar */}
        <div
          className={`h-full rounded-full transition-all duration-300 ease-linear ${
            isUrgent ? "bg-salah animate-pulse" : "bg-kuning"
          }`}
          style={{ width: `${percentage}%` }}
        />

        {/* Dotted lines pattern overlay */}
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#3A2412 1px, transparent 1px)",
            backgroundSize: "6px 6px",
          }}
        />
      </div>

      {/* Numerical Countdown Badge */}
      <div
        className={`px-3 py-1 rounded-xl border-2 border-tinta font-label font-bold text-sm min-w-[50px] text-center shadow-stiker-sm transition-transform ${
          isUrgent
            ? "bg-salah text-white animate-pulse-danger scale-110"
            : "bg-kertas-putih text-tinta"
        }`}
      >
        {remainingSeconds}s
      </div>
    </div>
  );
};
