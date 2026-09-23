import React from "react";

interface MotifProps {
  className?: string;
  size?: number;
  color?: string;
}

/**
 * Motif Opsi A: Pucuk Rebung (Segitiga Khas Tenun Songket Melayu Riau)
 */
export const PucukRebungMotif: React.FC<MotifProps> = ({
  className = "w-6 h-6",
  size = 24,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Motif Pucuk Rebung"
  >
    <path
      d="M12 2L3 20H21L12 2Z"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 7L7 17H17L12 7Z"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M12 2V20" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
    <circle cx="12" cy="13" r="1.5" fill={color} />
  </svg>
);

/**
 * Motif Opsi B: Wajik (Belah Ketupat Geometris Melayu)
 */
export const WajikMotif: React.FC<MotifProps> = ({
  className = "w-6 h-6",
  size = 24,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Motif Wajik"
  >
    <path
      d="M12 2L22 12L12 22L2 12L12 2Z"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 6L18 12L12 18L6 12L12 6Z"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="2" fill={color} />
  </svg>
);

/**
 * Motif Opsi C: Bunga Cengkih (4 Kelopak Bunga Cengkih Tradisional)
 */
export const BungaCengkihMotif: React.FC<MotifProps> = ({
  className = "w-6 h-6",
  size = 24,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Motif Bunga Cengkih"
  >
    <circle cx="12" cy="6" r="3.2" stroke={color} strokeWidth="2" />
    <circle cx="12" cy="18" r="3.2" stroke={color} strokeWidth="2" />
    <circle cx="6" cy="12" r="3.2" stroke={color} strokeWidth="2" />
    <circle cx="18" cy="12" r="3.2" stroke={color} strokeWidth="2" />
    <circle cx="12" cy="12" r="2" fill={color} />
  </svg>
);

/**
 * Motif Opsi D: Tetes Air (Lingkaran / Tetes Air Perigi Puteri)
 */
export const TetesAirMotif: React.FC<MotifProps> = ({
  className = "w-6 h-6",
  size = 24,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Motif Tetes Air"
  >
    <path
      d="M12 3C12 3 5 11 5 15.5C5 19.0899 8.13401 22 12 22C15.866 22 19 19.0899 19 15.5C19 11 12 3 12 3Z"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 9C10.5 12 10 14 10 16"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <circle cx="14" cy="16" r="1.5" fill={color} />
  </svg>
);

export const getOptionMotif = (
  optionKey: "A" | "B" | "C" | "D" | string,
  props?: MotifProps
) => {
  switch (optionKey.toUpperCase()) {
    case "A":
      return <PucukRebungMotif {...props} />;
    case "B":
      return <WajikMotif {...props} />;
    case "C":
      return <BungaCengkihMotif {...props} />;
    case "D":
      return <TetesAirMotif {...props} />;
    default:
      return <PucukRebungMotif {...props} />;
  }
};
