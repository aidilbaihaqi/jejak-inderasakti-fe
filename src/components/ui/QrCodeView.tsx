"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

interface QrCodeViewProps {
  value: string;
  size?: number;
  className?: string;
}

export const QrCodeView: React.FC<QrCodeViewProps> = ({
  value,
  size = 180,
  className = "",
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    if (!value) return;
    QRCode.toDataURL(value, {
      width: size * 2, // 2x for ultra-sharp rendering on mobile screens & projectors
      margin: 1,
      color: {
        dark: "#2A2A2A", // Brand ink / tinta
        light: "#FFFFFF",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("Gagal menghasilkan QR Code:", err));
  }, [value, size]);

  if (!qrDataUrl) {
    return (
      <div
        className={`flex items-center justify-center bg-white rounded-xl ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="w-6 h-6 border-2 border-tinta/30 border-t-tinta rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <img
      src={qrDataUrl}
      alt={`QR Code untuk ${value}`}
      width={size}
      height={size}
      className={`rounded-lg object-contain bg-white shadow-xs ${className}`}
    />
  );
};
