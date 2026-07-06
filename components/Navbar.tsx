"use client";

import { signOut } from "next-auth/react";
import { LogOut, QrCode } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav className="fixed top-4 left-4 right-4 z-50 bg-bg-card/80 backdrop-blur-md border border-border rounded-xl px-6 py-3 flex items-center justify-between">
      <Link href="/dashboard" className="flex items-center gap-2 text-text font-semibold">
        <QrCode size={20} />
        <span>QR Generator</span>
      </Link>

      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/generate"
          className="px-4 py-2 bg-cta hover:bg-cta-hover text-white rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer"
        >
          Generate QR
        </Link>
        <ThemeToggle />
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="p-2 rounded-lg bg-bg-input text-text-muted hover:text-text transition-colors duration-150 cursor-pointer"
          aria-label="Sign out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}
