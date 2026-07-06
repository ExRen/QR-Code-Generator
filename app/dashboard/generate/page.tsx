"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import QrForm from "@/components/QrForm";

export default function GeneratePage() {
  const [success, setSuccess] = useState(false);

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/dashboard"
          className="p-2 rounded-lg bg-bg-input text-text-muted hover:text-text transition-colors duration-150 cursor-pointer"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-bold text-text">Generate QR Code</h1>
      </div>

      {success && (
        <div className="mb-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 flex items-center justify-between">
          <span>QR code generated successfully!</span>
          <Link href="/dashboard" className="text-sm underline hover:no-underline">
            View in History
          </Link>
        </div>
      )}

      <QrForm onSuccess={() => setSuccess(true)} />
    </div>
  );
}
