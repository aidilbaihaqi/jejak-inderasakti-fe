import React from "react";

export interface AvatarItem {
  id: string;
  name: string;
  color: string;
  hatColor: string;
  skinColor: string;
  accessory: string;
}

export const AVATAR_LIST: AvatarItem[] = [
  { id: "1", name: "Tanjak Kuning", color: "#FFC629", hatColor: "#C8922A", skinColor: "#FDDEB3", accessory: "tanjak" },
  { id: "2", name: "Tudung Merah", color: "#B4533A", hatColor: "#C53A3A", skinColor: "#FCE5CA", accessory: "tudung" },
  { id: "3", name: "Songkok Hitam", color: "#2F7D4F", hatColor: "#3A2412", skinColor: "#F3CDA2", accessory: "songkok" },
  { id: "4", name: "Pita Jingga", color: "#E07A28", hatColor: "#FF8C42", skinColor: "#FDDEB3", accessory: "ribbon" },
  { id: "5", name: "Topi Rimba", color: "#5F7F2E", hatColor: "#8B5A2B", skinColor: "#E8BA85", accessory: "explorer" },
  { id: "6", name: "Kacamata Cilik", color: "#2E7EA0", hatColor: "#1B7F4A", skinColor: "#FDDEB3", accessory: "glasses" },
  { id: "7", name: "Syall Petualang", color: "#C8922A", hatColor: "#B4533A", skinColor: "#F3CDA2", accessory: "scarf" },
  { id: "8", name: "Bunga Melur", color: "#E75480", hatColor: "#FFFDF7", skinColor: "#FCE5CA", accessory: "flower" },
  { id: "9", name: "Topi Biru", color: "#2E7EA0", hatColor: "#1B6288", skinColor: "#FDDEB3", accessory: "cap" },
  { id: "10", name: "Jilbab Hijau", color: "#2F7D4F", hatColor: "#3E9B66", skinColor: "#FCE5CA", accessory: "hijab" },
  { id: "11", name: "Bando Emas", color: "#9A6B12", hatColor: "#FFC629", skinColor: "#E8BA85", accessory: "headband" },
  { id: "12", name: "Tanjak Coklat", color: "#8B5A2B", hatColor: "#5C3A1E", skinColor: "#FDDEB3", accessory: "tanjak_alt" },
];

interface AvatarIconProps {
  id?: string;
  size?: number;
  className?: string;
  selected?: boolean;
}

export const AvatarIcon: React.FC<AvatarIconProps> = ({
  id = "1",
  size = 56,
  className = "",
  selected = false,
}) => {
  const avatar = AVATAR_LIST.find((a) => a.id === id) || AVATAR_LIST[0];

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full transition-transform ${
        selected ? "ring-4 ring-kuning scale-105" : ""
      } ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full rounded-full border-2 border-tinta shadow-stiker-sm"
        style={{ backgroundColor: avatar.color }}
      >
        {/* Face circle */}
        <circle cx="32" cy="35" r="16" fill={avatar.skinColor} stroke="#3A2412" strokeWidth="2" />
        
        {/* Hair base */}
        <path
          d="M18 32C18 24 24 19 32 19C40 19 46 24 46 32C46 33 45 35 44 36C40 33 38 31 32 31C26 31 24 33 20 36C19 35 18 33 18 32Z"
          fill="#3A2412"
        />

        {/* Eyes */}
        <circle cx="27" cy="36" r="2" fill="#3A2412" />
        <circle cx="37" cy="36" r="2" fill="#3A2412" />
        {/* Cheeks */}
        <circle cx="23" cy="38" r="2.5" fill="#FFA573" opacity="0.6" />
        <circle cx="41" cy="38" r="2.5" fill="#FFA573" opacity="0.6" />
        {/* Smile */}
        <path d="M29 42C30.5 44 33.5 44 35 42" stroke="#3A2412" strokeWidth="1.8" strokeLinecap="round" />

        {/* Headdress / Accessories */}
        {avatar.accessory === "tanjak" && (
          <g>
            <path d="M19 23L32 9L38 18L45 23C38 21 26 21 19 23Z" fill={avatar.hatColor} stroke="#3A2412" strokeWidth="1.8" />
            <path d="M17 24C24 21 40 21 47 24L45 28C38 26 26 26 19 28L17 24Z" fill="#8B5A2B" stroke="#3A2412" strokeWidth="1.5" />
            <circle cx="32" cy="24" r="2" fill="#FFC629" />
          </g>
        )}

        {avatar.accessory === "tudung" && (
          <path
            d="M17 31C17 21 23 15 32 15C41 15 47 21 47 31C47 43 43 51 32 51C21 51 17 43 17 31Z"
            fill="none"
            stroke={avatar.hatColor}
            strokeWidth="5"
          />
        )}

        {avatar.accessory === "songkok" && (
          <g>
            <path d="M18 16H46V25H18V16Z" rx="2" fill={avatar.hatColor} stroke="#3A2412" strokeWidth="1.8" />
            <path d="M19 16C26 14 38 14 45 16" stroke="#9A6B12" strokeWidth="1.5" />
          </g>
        )}

        {avatar.accessory === "ribbon" && (
          <g>
            <path d="M38 18L44 14L42 20L46 22L40 22" fill={avatar.hatColor} stroke="#3A2412" strokeWidth="1.5" />
            <circle cx="40" cy="20" r="2.5" fill="#FFC629" />
          </g>
        )}

        {avatar.accessory === "explorer" && (
          <g>
            <ellipse cx="32" cy="22" rx="18" ry="5" fill={avatar.hatColor} stroke="#3A2412" strokeWidth="1.8" />
            <path d="M22 22C22 15 26 12 32 12C38 12 42 15 42 22" fill={avatar.hatColor} stroke="#3A2412" strokeWidth="1.8" />
          </g>
        )}

        {avatar.accessory === "glasses" && (
          <g>
            <circle cx="27" cy="36" r="4.5" fill="none" stroke="#3A2412" strokeWidth="1.6" />
            <circle cx="37" cy="36" r="4.5" fill="none" stroke="#3A2412" strokeWidth="1.6" />
            <path d="M31.5 36H32.5" stroke="#3A2412" strokeWidth="1.8" />
          </g>
        )}

        {avatar.accessory === "flower" && (
          <g>
            <circle cx="43" cy="26" r="3" fill="#FFFDF7" stroke="#3A2412" strokeWidth="1.2" />
            <circle cx="43" cy="26" r="1.2" fill="#FFC629" />
          </g>
        )}

        {avatar.accessory === "tanjak_alt" && (
          <g>
            <path d="M20 22L30 10L36 17L44 22C38 20 26 20 20 22Z" fill="#C8922A" stroke="#3A2412" strokeWidth="1.8" />
            <circle cx="30" cy="20" r="1.5" fill="#FFC629" />
          </g>
        )}

        {/* Shoulders / Shirt */}
        <path
          d="M16 56C16 48 24 46 32 46C40 46 48 48 48 56"
          fill="#FFFDF7"
          stroke="#3A2412"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};
