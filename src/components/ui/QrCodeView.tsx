"use client";

import React, { useState } from "react";

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
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Clean, high-resolution QR Generator URL without requiring native npm bindings
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${Math.round(
    size * 2
  )}x${Math.round(size * 2)}&margin=6&color=2A2A2A&bgcolor=FFFFFF&data=${encodeURIComponent(
    value
  )}`;

  return (
    <div
      className={`relative flex items-center justify-center bg-white rounded-xl overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          <div className="w-6 h-6 border-2 border-tinta/30 border-t-tinta rounded-full animate-spin" />
        </div>
      )}

      {!hasError ? (
        <img
          src={qrUrl}
          alt={`QR Code untuk ${value}`}
          width={size}
          height={size}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-contain ${
            isLoaded ? "opacity-100" : "opacity-0"
          } transition-opacity duration-300`}
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-2 text-center text-xs text-coklat">
          <span className="font-bold">Scan via URL</span>
          <span className="text-[10px] break-all">{value}</span>
        </div>
      )}
    </div>
  );
};
