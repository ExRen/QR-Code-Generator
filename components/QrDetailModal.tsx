"use client";

import { X, Download, ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";

interface QrDetailModalProps {
  qr: {
    id: string;
    label: string | null;
    destinationUrl: string;
    logoUrl: string | null;
    renderedPngUrl: string;
    renderedSvgUrl: string | null;
    renderedJpegUrl: string | null;
    widthPx: number | null;
    heightPx: number | null;
    createdAt: string;
    updatedAt: string;
  };
  onClose: () => void;
}

export default function QrDetailModal({ qr, onClose }: QrDetailModalProps) {
  const [copied, setCopied] = useState(false);

  const copyUrl = () => {
    navigator.clipboard.writeText(qr.destinationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const date = new Date(qr.createdAt).toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-bg-card border border-border rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold text-text">{qr.label || "QR Code Detail"}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-bg-input text-text-muted hover:text-text transition-colors duration-150 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex justify-center bg-white rounded-xl p-4">
            <img
              src={qr.renderedPngUrl}
              alt={qr.label || qr.destinationUrl}
              className="max-w-[240px] w-full"
            />
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-xs text-text-muted uppercase tracking-wide">Label</span>
              <p className="text-sm text-text">{qr.label || "—"}</p>
            </div>

            <div>
              <span className="text-xs text-text-muted uppercase tracking-wide">Destination URL</span>
              <div className="flex items-center gap-2">
                <p className="text-sm text-text truncate flex-1 font-mono">{qr.destinationUrl}</p>
                <button
                  onClick={copyUrl}
                  className="p-1.5 rounded-md bg-bg-input text-text-muted hover:text-text transition-colors duration-150 cursor-pointer"
                >
                  {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                </button>
                <a
                  href={qr.destinationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-md bg-bg-input text-text-muted hover:text-text transition-colors duration-150 cursor-pointer"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-xs text-text-muted uppercase tracking-wide">Created</span>
                <p className="text-sm text-text">{date}</p>
              </div>
              <div>
                <span className="text-xs text-text-muted uppercase tracking-wide">Dimensions</span>
                <p className="text-sm text-text font-mono">
                  {qr.widthPx && qr.heightPx ? `${qr.widthPx}x${qr.heightPx}` : "—"}
                </p>
              </div>
            </div>

            {qr.logoUrl && (
              <div>
                <span className="text-xs text-text-muted uppercase tracking-wide">Logo</span>
                <div className="mt-1 w-16 h-16 rounded-lg border border-border overflow-hidden">
                  <img src={qr.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <a
              href={`/api/qr/${qr.id}/download?format=png`}
              className="flex-1 flex items-center justify-center gap-2 h-10 bg-cta hover:bg-cta-hover text-white rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer"
            >
              <Download size={16} /> PNG
            </a>
            {qr.renderedSvgUrl && (
              <a
                href={`/api/qr/${qr.id}/download?format=svg`}
                className="flex-1 flex items-center justify-center gap-2 h-10 bg-bg-input border border-border text-text rounded-lg text-sm font-medium hover:bg-border transition-colors duration-150 cursor-pointer"
              >
                <Download size={16} /> SVG
              </a>
            )}
            {qr.renderedJpegUrl && (
              <a
                href={`/api/qr/${qr.id}/download?format=jpeg`}
                className="flex-1 flex items-center justify-center gap-2 h-10 bg-bg-input border border-border text-text rounded-lg text-sm font-medium hover:bg-border transition-colors duration-150 cursor-pointer"
              >
                <Download size={16} /> JPEG
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
