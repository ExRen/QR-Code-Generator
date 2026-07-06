"use client";

import { Download, Trash2 } from "lucide-react";

interface HistoryCardProps {
  qr: {
    id: string;
    label: string | null;
    destinationUrl: string;
    renderedPngUrl: string;
    renderedSvgUrl: string | null;
    renderedJpegUrl: string | null;
    createdAt: string;
    widthPx: number | null;
    heightPx: number | null;
  };
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function HistoryCard({ qr, onView, onDelete }: HistoryCardProps) {
  const date = new Date(qr.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-bg-card border border-border rounded-xl p-4 hover:border-cta/30 transition-colors duration-150 cursor-pointer group">
      <div onClick={() => onView(qr.id)} className="cursor-pointer">
        <div className="aspect-square bg-white rounded-lg mb-3 flex items-center justify-center overflow-hidden">
          <img
            src={qr.renderedPngUrl}
            alt={qr.label || qr.destinationUrl}
            className="w-full h-full object-contain p-2"
          />
        </div>

        <h3 className="text-sm font-medium text-text truncate">
          {qr.label || qr.destinationUrl}
        </h3>
        <p className="text-xs text-text-muted truncate mt-1">{qr.destinationUrl}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-text-muted">{date}</span>
          {qr.widthPx && (
            <span className="text-xs text-text-muted font-mono">
              {qr.widthPx}x{qr.heightPx}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border">
        <a
          href={`/api/qr/${qr.id}/download?format=png`}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md bg-bg-input text-xs text-text-muted hover:text-text transition-colors duration-150 cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          <Download size={12} /> PNG
        </a>
        {qr.renderedSvgUrl && (
          <a
            href={`/api/qr/${qr.id}/download?format=svg`}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md bg-bg-input text-xs text-text-muted hover:text-text transition-colors duration-150 cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            <Download size={12} /> SVG
          </a>
        )}
        {qr.renderedJpegUrl && (
          <a
            href={`/api/qr/${qr.id}/download?format=jpeg`}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md bg-bg-input text-xs text-text-muted hover:text-text transition-colors duration-150 cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            <Download size={12} /> JPEG
          </a>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(qr.id); }}
          className="p-1.5 rounded-md bg-bg-input text-text-muted hover:text-red-500 transition-colors duration-150 cursor-pointer"
          aria-label="Delete QR"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}
