import React, { useRef } from "react";

interface PinInputProps {
  value: string;
  onChange: (pin: string) => void;
  length?: number;
  error?: string;
  className?: string;
}

export const PinInput: React.FC<PinInputProps> = ({
  value,
  onChange,
  length = 6,
  error,
  className = "",
}) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    if (!val) {
      // Clear current digit
      const nextPin = value.split("");
      nextPin[index] = "";
      onChange(nextPin.join(""));
      return;
    }

    const lastChar = val[val.length - 1];
    const pinArr = value.padEnd(length, " ").split("");
    pinArr[index] = lastChar;
    const newPin = pinArr.join("").trim();
    onChange(newPin);

    // Auto focus next box
    if (index < length - 1 && lastChar) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {/* 6 Digit Box Grid */}
      <div className="flex items-center justify-center gap-2 sm:gap-2.5">
        {Array.from({ length }).map((_, index) => {
          const char = value[index] || "";
          const isFilled = char !== "";

          return (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={char}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-11 h-14 sm:w-12 sm:h-16 text-center font-label font-extrabold text-2xl sm:text-3xl rounded-xl border-3 transition-all outline-none ${
                error
                  ? "border-salah bg-red-50 text-salah"
                  : isFilled
                  ? "border-tinta bg-kuning text-tinta shadow-stiker-sm"
                  : "border-tinta/60 bg-kertas-putih text-tinta focus:border-tinta focus:bg-white focus:shadow-stiker-sm"
              }`}
            />
          );
        })}
      </div>

      {/* Error Feedback Message */}
      {error && (
        <p className="font-body text-xs sm:text-sm font-bold text-salah text-center animate-shake">
          {error}
        </p>
      )}
    </div>
  );
};
