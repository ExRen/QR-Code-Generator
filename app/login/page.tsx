"use client";

import { signIn } from "next-auth/react";
import { QrCode } from "lucide-react";
import { FormEvent, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    // Use redirectTo for server-side redirect - this handles cookie timing correctly
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cta/10 mb-4">
            <QrCode size={32} className="text-cta" />
          </div>
          <h1 className="text-2xl font-bold text-text">QR Code Generator</h1>
          <p className="text-text-muted mt-2">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-bg-card border border-border rounded-xl p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">{error}</div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text mb-1.5">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              defaultValue="admin@example.com"
              className="w-full h-10 px-3 rounded-lg bg-bg-input border border-border text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-cta/50"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text mb-1.5">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              defaultValue="password123"
              className="w-full h-10 px-3 rounded-lg bg-bg-input border border-border text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-cta/50"
              placeholder="password123"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-cta hover:bg-cta-hover text-white rounded-lg font-medium transition-colors duration-150 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
