"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

interface QrPreviewProps {
  url: string;
  logoUrl?: string | null;
}

export default function QrPreview({ url, logoUrl }: QrPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !url) return;

    QRCode.toCanvas(canvasRef.current, url, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 280,
      color: { dark: "#000000", light: "#ffffff" },
    });
  }, [url]);

  if (!url) {
    return (
      <div className="w-[280px] h-[280px] bg-bg-input border border-border rounded-xl flex items-center justify-center text-text-muted text-sm">
        Enter a URL to preview
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      <canvas ref={canvasRef} className="rounded-xl" />
      {logoUrl && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-white rounded-lg p-1 shadow-md">
            <img
              src={logoUrl}
              alt="Logo"
              className="w-full h-full object-contain rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
}
