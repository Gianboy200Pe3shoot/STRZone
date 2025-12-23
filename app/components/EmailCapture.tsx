"use client";

import { useState } from "react";

export default function EmailCapture({ city }: { city: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, city }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to subscribe");

      setStatus("ok");
      setMsg("✅ Saved. We’ll send permit steps + a compliance checklist for this city.");
      setEmail("");
    } catch (err: any) {
      setStatus("err");
      setMsg(err?.message || "Something went wrong.");
    }
  }

  return (
    <div className="mt-6 rounded-xl border p-4">
      <h3 className="text-lg font-semibold">Want the next steps for {city} STR compliance?</h3>
      <p className="mt-1 text-sm text-gray-600">
        Get permit steps, a compliance checklist, and rule-change updates.
      </p>

      <form onSubmit={onSubmit} className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-60"
        >
          {status === "loading" ? "Saving..." : "Email me the guide"}
        </button>
      </form>

      {msg && (
        <p className={`mt-2 text-sm ${status === "err" ? "text-red-600" : "text-gray-700"}`}>
          {msg}
        </p>
      )}
    </div>
  );
}
