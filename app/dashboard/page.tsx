"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, SortAsc, SortDesc, Loader2 } from "lucide-react";
import HistoryCard from "@/components/HistoryCard";
import QrDetailModal from "@/components/QrDetailModal";

interface QrCode {
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
}

export default function DashboardPage() {
  const [qrCodes, setQrCodes] = useState<QrCode[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedQr, setSelectedQr] = useState<QrCode | null>(null);

  const fetchQrCodes = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ search, sort, page: String(page) });
    const res = await fetch(`/api/qr?${params}`);
    const data = await res.json();
    setQrCodes(data.qrCodes);
    setTotalPages(data.totalPages);
    setLoading(false);
  }, [search, sort, page]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/qr?${new URLSearchParams({ search, sort, page: String(page) })}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        setQrCodes(data.qrCodes);
        setTotalPages(data.totalPages);
        setLoading(false);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [search, sort, page]);

  useEffect(() => {
    if (selectedQr) {
      const controller = new AbortController();
      fetch(`/api/qr/${selectedQr.id}`, { signal: controller.signal })
        .then((r) => r.json())
        .then((data) => setSelectedQr(data))
        .catch(() => {});
      return () => controller.abort();
    }
  }, [selectedQr?.id]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this QR code?")) return;
    await fetch(`/api/qr/${id}`, { method: "DELETE" });
    fetchQrCodes();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-xl font-bold text-text">QR History</h1>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by label or URL..."
              className="w-full h-10 pl-9 pr-3 rounded-lg bg-bg-input border border-border text-text text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-cta/50"
            />
          </div>

          <button
            onClick={() => setSort(sort === "newest" ? "oldest" : "newest")}
            className="h-10 px-3 rounded-lg bg-bg-input border border-border text-text-muted hover:text-text text-sm flex items-center gap-1.5 transition-colors duration-150 cursor-pointer"
          >
            {sort === "newest" ? <SortDesc size={14} /> : <SortAsc size={14} />}
            {sort === "newest" ? "Newest" : "Oldest"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-text-muted">
          <Loader2 size={24} className="animate-spin" />
        </div>
      ) : qrCodes.length === 0 ? (
        <div className="text-center py-20 text-text-muted">
          {search ? "No QR codes match your search" : "No QR codes yet. Generate your first one!"}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {qrCodes.map((qr) => (
              <HistoryCard
                key={qr.id}
                qr={qr}
                onView={(id) => {
                  const found = qrCodes.find((q) => q.id === id);
                  if (found) setSelectedQr(found);
                }}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-2 rounded-lg bg-bg-input border border-border text-sm text-text-muted hover:text-text disabled:opacity-50 transition-colors duration-150 cursor-pointer"
              >
                Previous
              </button>
              <span className="text-sm text-text-muted">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-2 rounded-lg bg-bg-input border border-border text-sm text-text-muted hover:text-text disabled:opacity-50 transition-colors duration-150 cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {selectedQr && (
        <QrDetailModal
          qr={selectedQr}
          onClose={() => setSelectedQr(null)}
        />
      )}
    </div>
  );
}
