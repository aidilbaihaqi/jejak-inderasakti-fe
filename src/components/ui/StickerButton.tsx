import React from "react";

interface StickerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "kraft" | "danger" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const StickerButton: React.FC<StickerButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  icon,
  className = "",
  disabled = false,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-display font-bold text-center select-none rounded-2xl border-3 border-tinta transition-all duration-150 btn-pressable active:scale-[0.98]";

  const variantStyles = {
    primary: "bg-kuning text-tinta shadow-stiker hover:bg-[#FFD147]",
    secondary: "bg-coklat text-kertas-putih shadow-stiker hover:bg-[#724820]",
    kraft: "bg-kraft text-tinta shadow-stiker hover:bg-[#DFC797]",
    danger: "bg-salah text-kertas-putih shadow-stiker hover:bg-[#A92E2E]",
    ghost: "bg-transparent text-tinta border-2 border-dashed border-coklat/60 shadow-none hover:bg-kraft/40",
  };

  const sizeStyles = {
    sm: "px-3.5 py-2 text-sm rounded-xl",
    md: "px-5 py-3 text-base min-h-[48px]",
    lg: "px-6 py-4 text-lg min-h-[58px]",
    xl: "px-7 py-4.5 text-xl min-h-[64px]", // For quiz answer tiles
  };

  const disabledStyles = disabled
    ? "opacity-50 cursor-not-allowed pointer-events-none filter grayscale"
    : "cursor-pointer";

  return (
    <button
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`}
      {...props}
    >
      {icon && <span className="mr-2 flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
