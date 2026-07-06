"use client";

import { FormEvent, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import QrPreview from "./QrPreview";

interface QrFormProps {
  onSuccess: () => void;
}

export default function QrForm({ onSuccess }: QrFormProps) {
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("Logo must be under 2MB");
      return;
    }

    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      new URL(url);
    } catch {
      setError("Please enter a valid URL");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("url", url);
    if (label) formData.append("label", label);
    if (logoFile) formData.append("logo", logoFile);

    const res = await fetch("/api/qr", { method: "POST", body: formData });
    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Failed to generate QR");
      return;
    }

    setUrl("");
    setLabel("");
    removeLogo();
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-bg-card border border-border rounded-xl p-6 space-y-5">
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">{error}</div>
      )}

      <div>
        <label htmlFor="url" className="block text-sm font-medium text-text mb-1.5">
          Destination URL *
        </label>
        <input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          placeholder="https://example.com"
          className="w-full h-10 px-3 rounded-lg bg-bg-input border border-border text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-cta/50"
        />
      </div>

      <div>
        <label htmlFor="label" className="block text-sm font-medium text-text mb-1.5">
          Label (optional)
        </label>
        <input
          id="label"
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="My QR Code"
          className="w-full h-10 px-3 rounded-lg bg-bg-input border border-border text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-cta/50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-1.5">
          Logo (optional)
        </label>
        {logoPreview ? (
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-lg border border-border overflow-hidden">
              <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
            </div>
            <button
              type="button"
              onClick={removeLogo}
              className="p-2 rounded-lg bg-bg-input text-text-muted hover:text-red-500 transition-colors duration-150 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full h-20 border-2 border-dashed border-border rounded-lg flex items-center justify-center gap-2 text-text-muted hover:text-text hover:border-cta transition-colors duration-150 cursor-pointer"
          >
            <Upload size={18} />
            <span className="text-sm">Click to upload logo (PNG/JPEG/SVG, max 2MB)</span>
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml"
          onChange={handleLogoChange}
          className="hidden"
        />
      </div>

      <div className="flex justify-center py-4">
        <QrPreview url={url} logoUrl={logoPreview} />
      </div>

      <button
        type="submit"
        disabled={loading || !url}
        className="w-full h-10 bg-cta hover:bg-cta-hover text-white rounded-lg font-medium transition-colors duration-150 disabled:opacity-50 cursor-pointer"
      >
        {loading ? "Generating..." : "Generate & Save"}
      </button>
    </form>
  );
}
