import React from "react";

export type MascotPose =
  | "waving"
  | "thinking"
  | "pointing"
  | "cheering"
  | "encouraging"
  | "trophy";

interface MascotSaktiProps {
  pose?: MascotPose;
  className?: string;
  size?: number;
  speechBubble?: string;
}

export const MascotSakti: React.FC<MascotSaktiProps> = ({
  pose = "waving",
  className = "",
  size = 140,
  speechBubble,
}) => {
  return (
    <div
      className={`relative inline-flex flex-col items-center select-none ${className}`}
    >
      {/* Optional Speech Bubble */}
      {speechBubble && (
        <div className="relative mb-2 px-3.5 py-1.5 bg-kertas-putih text-tinta border-2 border-tinta rounded-xl shadow-stiker-sm text-xs font-bold font-body animate-float-slow max-w-[200px] text-center">
          {speechBubble}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-tinta" />
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-kertas-putih" />
        </div>
      )}

      {/* Mascot SVG */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_4px_8px_rgba(58,36,18,0.18)]"
      >
        {/* Antennas */}
        <path
          d="M68 42C62 28 54 26 48 30"
          stroke="#3A2412"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle cx="46" cy="30" r="4.5" fill="#FFC629" stroke="#3A2412" strokeWidth="2.5" />

        <path
          d="M92 42C98 28 106 26 112 30"
          stroke="#3A2412"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle cx="114" cy="30" r="4.5" fill="#FFC629" stroke="#3A2412" strokeWidth="2.5" />

        {/* Wings (Translucent Sky Blue with White Trim) */}
        <g opacity="0.85">
          {/* Left Wing */}
          <path
            d="M50 78C20 60 16 35 34 38C52 41 58 64 50 78Z"
            fill="#D7EEFA"
            stroke="#8B5A2B"
            strokeWidth="2.5"
          />
          <path
            d="M34 46C42 52 46 62 47 70"
            stroke="#A3D7F4"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Right Wing */}
          <path
            d="M110 78C140 60 144 35 126 38C108 41 102 64 110 78Z"
            fill="#D7EEFA"
            stroke="#8B5A2B"
            strokeWidth="2.5"
          />
          <path
            d="M126 46C118 52 114 62 113 70"
            stroke="#A3D7F4"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>

        {/* Bee Rounded Sting (Gentle & rounded, not scary) */}
        <path
          d="M75 130C78 138 82 138 85 130Z"
          fill="#3A2412"
        />

        {/* Bee Main Body (Chubby Round Oval) */}
        <ellipse
          cx="80"
          cy="92"
          rx="44"
          ry="40"
          fill="#FFC629"
          stroke="#3A2412"
          strokeWidth="4"
        />

        {/* Bee Dark Stripes */}
        <path
          d="M40 85C50 93 110 93 120 85C118 97 114 104 112 108C100 114 60 114 48 108C46 104 42 97 40 85Z"
          fill="#3A2412"
        />
        <path
          d="M53 118C62 125 98 125 107 118C104 124 99 128 95 130C85 132 75 132 65 130C61 128 56 124 53 118Z"
          fill="#3A2412"
        />

        {/* Belly Light Highlight */}
        <ellipse
          cx="80"
          cy="100"
          rx="18"
          ry="10"
          fill="#FFE58A"
          opacity="0.6"
        />

        {/* Face Elements */}
        {/* Blush Cheeks */}
        <circle cx="56" cy="80" r="6" fill="#FFA573" opacity="0.75" />
        <circle cx="104" cy="80" r="6" fill="#FFA573" opacity="0.75" />

        {/* Eyes based on Pose */}
        {pose === "cheering" || pose === "trophy" ? (
          /* Joyful Arched Eyes */
          <g stroke="#3A2412" strokeWidth="4" strokeLinecap="round" fill="none">
            <path d="M60 72C64 66 72 66 76 72" />
            <path d="M84 72C88 66 96 66 100 72" />
          </g>
        ) : pose === "thinking" ? (
          /* Thinking Glance Upwards */
          <g>
            <circle cx="68" cy="70" r="6.5" fill="#3A2412" />
            <circle cx="70" cy="68" r="2.5" fill="#FFFDF7" />
            <circle cx="92" cy="70" r="6.5" fill="#3A2412" />
            <circle cx="94" cy="68" r="2.5" fill="#FFFDF7" />
          </g>
        ) : (
          /* Default Cute Wide Eyes */
          <g>
            <circle cx="68" cy="72" r="6.5" fill="#3A2412" />
            <circle cx="70" cy="70" r="2.5" fill="#FFFDF7" />
            <circle cx="92" cy="72" r="6.5" fill="#3A2412" />
            <circle cx="94" cy="70" r="2.5" fill="#FFFDF7" />
          </g>
        )}

        {/* Mouth based on Pose */}
        {pose === "cheering" || pose === "trophy" ? (
          /* Big Happy Smile */
          <path
            d="M72 82C72 88 88 88 88 82"
            fill="#C53A3A"
            stroke="#3A2412"
            strokeWidth="3"
            strokeLinecap="round"
          />
        ) : pose === "thinking" ? (
          /* Small Curious 'o' mouth */
          <circle cx="80" cy="84" r="3" fill="#3A2412" />
        ) : (
          /* Sweet Cheerful Smile */
          <path
            d="M74 81C76 85 84 85 86 81"
            stroke="#3A2412"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        )}

        {/* Tanjak Melayu (Traditional Malay Headcloth) */}
        {/* Tanjak Base Fold */}
        <path
          d="M50 48C60 44 100 44 110 48L114 56C105 58 55 58 46 56L50 48Z"
          fill="#8B5A2B"
          stroke="#3A2412"
          strokeWidth="3"
        />
        {/* Tanjak Peak (Tanjak Elang Menyonsong Angin) */}
        <path
          d="M62 46L76 22L86 36L102 46C92 42 70 42 62 46Z"
          fill="#9A6B12"
          stroke="#3A2412"
          strokeWidth="3"
        />
        {/* Tanjak Golden Motif Stripe */}
        <path
          d="M52 52C65 48 95 48 108 52"
          stroke="#FFC629"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="4 3"
        />
        <circle cx="80" cy="50" r="3" fill="#FFC629" stroke="#3A2412" strokeWidth="1.5" />

        {/* Arms & Hand Gestures based on Pose */}
        {pose === "waving" && (
          <g>
            {/* Left Hand Resting */}
            <path
              d="M40 92C32 96 34 104 40 102"
              stroke="#3A2412"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Right Hand Waving */}
            <path
              d="M118 90C128 82 134 70 128 66C122 62 116 76 112 84"
              stroke="#3A2412"
              strokeWidth="4"
              strokeLinecap="round"
              fill="#FFC629"
            />
            {/* Motion Lines */}
            <path d="M136 62C138 66 138 72 135 76" stroke="#C8922A" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}

        {pose === "pointing" && (
          <g>
            {/* Left Hand Resting */}
            <path
              d="M40 94C32 98 34 104 40 102"
              stroke="#3A2412"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Right Hand Pointing */}
            <path
              d="M118 92C130 92 142 90 148 90"
              stroke="#3A2412"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="148" cy="90" r="3.5" fill="#FFC629" stroke="#3A2412" strokeWidth="2" />
          </g>
        )}

        {pose === "thinking" && (
          <g>
            {/* Right Hand on Chin */}
            <path
              d="M116 94C114 86 104 88 94 86"
              stroke="#3A2412"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Thinking Bubble */}
            <circle cx="128" cy="46" r="3" fill="#EAD7B0" stroke="#3A2412" strokeWidth="1.5" />
            <circle cx="138" cy="38" r="5" fill="#EAD7B0" stroke="#3A2412" strokeWidth="1.5" />
            <circle cx="148" cy="28" r="7" fill="#FFFDF7" stroke="#3A2412" strokeWidth="1.5" />
            <text x="145" y="32" fontSize="9" fontWeight="bold" fill="#3A2412">?</text>
          </g>
        )}

        {pose === "cheering" && (
          <g>
            {/* Both Hands Raised High */}
            <path
              d="M44 88C32 74 24 58 34 54C42 50 48 70 52 82"
              stroke="#3A2412"
              strokeWidth="4"
              strokeLinecap="round"
              fill="#FFC629"
            />
            <path
              d="M116 88C128 74 136 58 126 54C118 50 112 70 108 82"
              stroke="#3A2412"
              strokeWidth="4"
              strokeLinecap="round"
              fill="#FFC629"
            />
            {/* Sparkle Stars */}
            <path d="M22 42L25 48L31 51L25 54L22 60L19 54L13 51L19 48Z" fill="#FFC629" />
            <path d="M138 42L141 48L147 51L141 54L138 60L135 54L129 51L135 48Z" fill="#FFC629" />
          </g>
        )}

        {pose === "encouraging" && (
          <g>
            {/* Fist Pumping Hand */}
            <path
              d="M42 90C36 82 32 74 38 70C44 68 48 80 50 88"
              stroke="#3A2412"
              strokeWidth="4"
              strokeLinecap="round"
              fill="#FFC629"
            />
            <path
              d="M118 90C126 84 132 74 126 70C120 68 116 80 114 88"
              stroke="#3A2412"
              strokeWidth="4"
              strokeLinecap="round"
              fill="#FFC629"
            />
            {/* Thumbs up badge */}
            <circle cx="132" cy="68" r="10" fill="#FFC629" stroke="#3A2412" strokeWidth="2" />
            <path d="M129 69L132 72L137 66" stroke="#3A2412" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {pose === "trophy" && (
          <g>
            {/* Golden Trophy Held Front & Center */}
            <path
              d="M66 94L70 118H90L94 94"
              fill="#C8922A"
              stroke="#3A2412"
              strokeWidth="2.5"
            />
            <path
              d="M62 86H98V100C98 108 90 114 80 114C70 114 62 108 62 100V86Z"
              fill="#FFC629"
              stroke="#3A2412"
              strokeWidth="3"
            />
            {/* Trophy Handles */}
            <path
              d="M62 90C54 90 54 102 64 102"
              stroke="#3A2412"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M98 90C106 90 106 102 96 102"
              stroke="#3A2412"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Trophy Base */}
            <rect x="68" y="118" width="24" height="6" rx="2" fill="#8B5A2B" stroke="#3A2412" strokeWidth="2" />
            <circle cx="80" cy="96" r="4" fill="#FFE58A" />
            {/* Trophy Star */}
            <path d="M80 92L81.5 95H84.5L82 97L83 100L80 98.5L77 100L78 97L75.5 95H78.5Z" fill="#FFFDF7" />
          </g>
        )}
      </svg>
    </div>
  );
};
