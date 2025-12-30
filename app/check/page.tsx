"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import EmailCapture from "../components/EmailCapture";

type RuleRow = {
  jurisdiction_name: string;
  jurisdiction_type?: string;
  str_status?: string;
  permit_required?: string;
  min_stay_nights?: string;
  primary_residence_required?: string;
  cap_or_limit?: string;
  taxes?: string;
  notes?: string;
  source_url?: string;
  last_verified?: string;
};

function normalize(s: string) {
  return (s || "").trim().toLowerCase();
}

function statusLabel(status?: string) {
  const s = normalize(status || "");
  if (!s) return "Unknown";
  if (s.includes("not") || s.includes("prohibit") || s.includes("ban"))
    return "Not Allowed";
  if (s.includes("permit") || s.includes("license") || s.includes("allowed")) {
    if (s.includes("permit")) return "Allowed with Permit";
    return "Allowed";
  }
  return "Conditional / Check details";
}

export default function CheckPage() {
  const [query, setQuery] = useState("San Diego");
  const [resolvedCity, setResolvedCity] = useState("");
  const [rows, setRows] = useState<RuleRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function loadRules() {
    setLoading(true);
    setErr(null);

    try {
      // 1) Geocode: query -> city
      const geoRes = await fetch(
        `/api/rules/geocode?q=${encodeURIComponent(query)}`,
        {
          cache: "no-store",
        }
      );
      if (!geoRes.ok) throw new Error(`Geocode failed (${geoRes.status})`);
      const geo = await geoRes.json();

      // Fallback city detection
      const city = (
        geo?.city ||
        geo?.fullPlaceName?.split(",")?.[0] ||
        query ||
        ""
      ).trim();

      setResolvedCity(city);

      // 2) Rules: city -> rows
      const rulesRes = await fetch(
        `/api/rules?city=${encodeURIComponent(city)}`,
        {
          cache: "no-store",
        }
      );
      if (!rulesRes.ok) throw new Error(`Rules failed (${rulesRes.status})`);
      const rulesData = await rulesRes.json();

      const list: RuleRow[] = Array.isArray(rulesData?.rows)
        ? rulesData.rows
        : Array.isArray(rulesData)
        ? rulesData
        : [];

      setRows(list);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load");
      setRows(null);
      setResolvedCity("");
    } finally {
      setLoading(false);
    }
  }

  const match = useMemo(() => {
    if (!rows || rows.length === 0) return null;

    const key = normalize(resolvedCity || query);
    if (!key) return null;

    return (
      rows.find((r) => normalize(r.jurisdiction_name) === key) || null
    );
  }, [rows, query, resolvedCity]);

  const label = statusLabel(match?.str_status);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white text-gray-900">
      {/* Top nav */}
      <header className="border-b border-rose-100 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/check" className="flex items-center gap-2">
            <span className="rounded-md bg-black px-2 py-1 text-xs font-semibold text-white">
              STR
            </span>
            <span className="text-sm font-semibold tracking-tight">
              STR Zone
            </span>
          </Link>

          <nav className="flex items-center gap-6 text-sm text-gray-700">
            <Link href="/check" className="hover:text-black">
              Checker
            </Link>
            <Link href="/pricing" className="hover:text-black">
              Pricing
            </Link>
            <a href="#how-it-works" className="hover:text-black">
              How it works
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        {/* HERO + checker */}
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <section>
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-500">
              STR Zone • Legality Checker
            </p>
            <h1 className="mt-3 text-3xl font-semibold md:text-4xl">
              Outsmart city STR rules with fast legality checks.
            </h1>
            <p className="mt-3 text-gray-600">
              Type any address or city. We auto-detect the jurisdiction and
              show permit requirements, primary-residence rules, caps, and tax
              notes so you can stay legal and avoid nasty surprises.
            </p>

            {/* your original input/card, styled as search box */}
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <label className="block text-sm font-medium text-gray-700">
                Address or City
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
                  placeholder="San Diego"
                />
                <button
                  onClick={loadRules}
                  className="rounded-lg bg-black px-4 py-2 text-white hover:opacity-90"
                >
                  Check
                </button>
              </div>

              {resolvedCity && (
                <div className="mt-3 text-sm text-gray-600">
                  Detected city:{" "}
                  <span className="font-medium">{resolvedCity}</span>
                </div>
              )}
            </div>

            {/* feature pills */}
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-rose-100 px-3 py-1 text-rose-700">
                STR regulations
              </span>
              <span className="rounded-full bg-rose-100 px-3 py-1 text-rose-700">
                Permit requirements
              </span>
              <span className="rounded-full bg-rose-100 px-3 py-1 text-rose-700">
                Min-stay & caps
              </span>
              <span className="rounded-full bg-rose-100 px-3 py-1 text-rose-700">
                Tax & notes
              </span>
            </div>
          </section>

          {/* Right column: small “why upgrade” card */}
          <section className="hidden md:block">
            <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-gray-800">
                Turn checks into a real compliance system
              </p>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li>• Save your watched cities in one place</li>
                <li>• Get rule-change alerts before they hit your listing</li>
                <li>• Access permit checklists and notes by city</li>
                <li>• Export details to share with partners or clients</li>
              </ul>
              <Link
                href="/pricing"
                className="mt-4 inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                View pricing
              </Link>
            </div>
          </section>
        </div>

        {/* HOW IT WORKS anchor for future content */}
        <section id="how-it-works" className="mt-10 text-sm text-gray-600">
          <h2 className="text-base font-semibold text-gray-900">
            How STR Zone works
          </h2>
          <p className="mt-2 max-w-2xl">
            We maintain a structured rules sheet with STR regulations by
            jurisdiction. When you search, we geocode your query to a city,
            match it against our inventory, and show a summary of status,
            permits, caps, and notes pulled from official sources.
          </p>
        </section>

        {/* Results section */}
        <section className="mt-8">
          <div className="max-w-2xl">
            {loading && <div className="text-gray-600">Loading…</div>}

            {err && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                {err}
              </div>
            )}

            {!loading && rows && rows.length > 0 && !match && (
              <div className="rounded-lg border bg-gray-50 p-4">
                No match found for{" "}
                <span className="font-semibold">
                  {resolvedCity || query}
                </span>
                .
                <div className="mt-2 text-sm text-gray-600">
                  Current inventory:{" "}
                  {rows.map((r) => r.jurisdiction_name).join(", ")}
                </div>
              </div>
            )}

            {!loading && match && (
              <>
                <div className="rounded-xl border bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold">
                        {match.jurisdiction_name}
                      </h2>
                      <div className="mt-1 text-sm text-gray-600">
                        Last verified: {match.last_verified || "—"}
                      </div>
                    </div>
                    <span className="rounded-full border px-3 py-1 text-sm font-medium">
                      {label}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm">
                    <div>
                      <span className="font-medium">Permit required:</span>{" "}
                      {match.permit_required || "—"}
                    </div>
                    <div>
                      <span className="font-medium">
                        Primary residence required:
                      </span>{" "}
                      {match.primary_residence_required || "—"}
                    </div>
                    <div>
                      <span className="font-medium">Min stay nights:</span>{" "}
                      {match.min_stay_nights || "—"}
                    </div>
                    <div>
                      <span className="font-medium">Caps / limits:</span>{" "}
                      {match.cap_or_limit || "—"}
                    </div>
                    <div>
                      <span className="font-medium">Taxes:</span>{" "}
                      {match.taxes || "—"}
                    </div>
                    <div>
                      <span className="font-medium">Notes:</span>{" "}
                      {match.notes || "—"}
                    </div>

                    {match.source_url && (
                      <a
                        className="text-blue-600 underline"
                        href={match.source_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Official source
                      </a>
                    )}
                  </div>
                </div>

                {/* Email capture under results */}
                <EmailCapture city={resolvedCity || match.jurisdiction_name} />

                {/* Soft upsell under results */}
                <p className="mt-4 text-sm text-gray-600">
                  Need ongoing alerts and compliance checklists for{" "}
                  <span className="font-semibold">
                    {resolvedCity || match.jurisdiction_name}
                  </span>
                  ?{" "}
                  <Link
                    href="/pricing"
                    className="font-semibold text-rose-600 underline"
                  >
                    See STR Zone plans →
                  </Link>
                </p>
              </>
            )}

            {!loading && rows && rows.length === 0 && (
              <div className="rounded-lg border bg-gray-50 p-4">
                API returned 0 rows. That means your sheet filter didn’t match
                anything.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
