// app/check/page.tsx - UPDATED with Save City feature
"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useSavedCities } from "../hooks/useSavedCities";
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
  permit_checklist?: string; // NEW FIELD
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
  const [checkCount, setCheckCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const { saveCity, isCitySaved, savedCities } = useSavedCities();

  useEffect(() => {
    const count = parseInt(localStorage.getItem('checkCount') || '0');
    setCheckCount(count);
  }, []);

  async function loadRules() {
    if (checkCount >= 3) {
      setShowPaywall(true);
      return;
    }

    setLoading(true);
    setErr(null);

    try {
      const geoRes = await fetch(
        `/api/rules/geocode?q=${encodeURIComponent(query)}`,
        { cache: "no-store" }
      );
      if (!geoRes.ok) throw new Error(`Geocode failed (${geoRes.status})`);
      const geo = await geoRes.json();

      const city = (
        geo?.city ||
        geo?.fullPlaceName?.split(",")?.[0] ||
        query ||
        ""
      ).trim();

      setResolvedCity(city);

      const rulesRes = await fetch(
        `/api/rules?city=${encodeURIComponent(city)}`,
        { cache: "no-store" }
      );
      if (!rulesRes.ok) throw new Error(`Rules failed (${rulesRes.status})`);
      const rulesData = await rulesRes.json();

      const list: RuleRow[] = Array.isArray(rulesData?.rows)
        ? rulesData.rows
        : Array.isArray(rulesData)
        ? rulesData
        : [];

      setRows(list);

      const newCount = checkCount + 1;
      setCheckCount(newCount);
      localStorage.setItem('checkCount', newCount.toString());

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
    return rows.find((r) => normalize(r.jurisdiction_name) === key) || null;
  }, [rows, query, resolvedCity]);

  const label = statusLabel(match?.str_status);
  const cityName = resolvedCity || match?.jurisdiction_name || "";
  const isSaved = isCitySaved(cityName);

  const handleSaveCity = () => {
    if (!cityName || !match) return;
    
    const success = saveCity({
      name: cityName,
      status: label,
      savedAt: new Date().toISOString(),
    });

    if (success) {
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f3f4f6] to-white text-[#1a202c]">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/check" className="flex items-center gap-2">
            <span className="rounded-md bg-[#1a202c] px-2 py-1 text-xs font-semibold text-white">
              STR
            </span>
            <span className="text-sm font-semibold tracking-tight text-[#1a202c]">
              STR Zone
            </span>
          </Link>

          <nav className="flex items-center gap-6 text-sm text-gray-700">
            <Link href="/check" className="hover:text-[#1a202c]">
              Checker
            </Link>
            <Link href="/compare" className="hover:text-[#1a202c]">
              Compare
            </Link>
            <Link href="/my-cities" className="hover:text-[#1a202c] relative">
              My Cities
              {savedCities.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#3b82f6] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {savedCities.length}
                </span>
              )}
            </Link>
            <Link href="/pricing" className="hover:text-[#1a202c]">
              Pricing
            </Link>
            <a href="#how-it-works" className="hover:text-[#1a202c]">
              How it works
            </a>
          </nav>
        </div>
      </header>

      {showSaveSuccess && (
        <div className="fixed top-20 right-4 z-50 rounded-xl bg-green-50 border border-green-200 px-4 py-3 shadow-lg animate-in slide-in-from-top">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium text-green-800">City saved successfully!</span>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <section>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#3b82f6]">
              STR Zone • Legality Checker
            </p>
            <h1 className="mt-3 text-3xl font-semibold md:text-4xl text-[#1a202c]">
              Instantly check if your Airbnb is legal before you get fined.
            </h1>
            <p className="mt-3 text-sm md:text-base text-gray-600">
              Type any address or city and see whether short-term rentals are
              allowed, what permits you need, and which restrictions apply so
              you don&apos;t risk shutdowns, surprise fines, or delisting.
            </p>

            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Address or City
                </label>
                <span className="text-xs text-gray-500">
                  {checkCount}/3 free checks used
                </span>
              </div>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadRules()}
                  className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#3b82f6]"
                  placeholder="San Diego"
                />
                <button
                  onClick={loadRules}
                  className="rounded-xl bg-[#3b82f6] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#2563eb] transition whitespace-nowrap"
                >
                  Check City {checkCount < 3 ? "(free)" : ""}
                </button>
              </div>

              {resolvedCity && (
                <div className="mt-3 text-xs text-gray-600">
                  Detected city:{" "}
                  <span className="font-medium text-[#1a202c]">
                    {resolvedCity}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-[#1a202c]">
                STR allowed / banned status
              </span>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-[#1a202c]">
                Permit + registration rules
              </span>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-[#1a202c]">
                Min-stay limits & caps
              </span>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-[#1a202c]">
                Taxes & official sources
              </span>
            </div>
          </section>

          <section className="hidden md:block">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-[#1a202c]">
                Turn quick checks into a real STR compliance system.
              </p>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li>• Unlimited city checks</li>
                <li>• Compare multiple cities side-by-side</li>
                <li>• Save your watched cities in one place</li>
                <li>• Get rule-change alerts before they hit your listing</li>
                <li>• Access permit checklists and notes by city</li>
              </ul>
              <Link
                href="/pricing"
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#3b82f6] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#2563eb] transition"
              >
                View PRO plans
              </Link>
            </div>
          </section>
        </div>

        {showPaywall && (
          <section className="mt-8">
            <div className="rounded-2xl border-2 border-[#3b82f6] bg-blue-50 p-8 shadow-lg">
              <h2 className="text-xl font-semibold text-[#1a202c]">
                You've used your 3 free checks
              </h2>
              <p className="mt-2 text-gray-700">
                Upgrade to <span className="font-semibold">Basic ($9.99/month)</span> to get:
              </p>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li>✓ Unlimited city checks</li>
                <li>✓ Compare up to 5 cities side-by-side</li>
                <li>✓ Save unlimited cities</li>
                <li>✓ Full regulation details</li>
              </ul>
              <div className="mt-6 flex gap-3">
                <Link
                  href="/pricing"
                  className="rounded-xl bg-[#3b82f6] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#2563eb] transition"
                >
                  Upgrade to Basic
                </Link>
                <button
                  onClick={() => setShowPaywall(false)}
                  className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </section>
        )}

        <section className="mt-10 text-sm text-gray-600">
          <h2 className="text-base font-semibold text-[#1a202c]">
            Why this matters for hosts and investors
          </h2>
          <p className="mt-2 max-w-2xl">
            Cities are cracking down on illegal short-term rentals. Many hosts
            don&apos;t realize their city requires permits, primary-residence
            rules, or strict caps until they receive a notice or their listing
            gets removed. STR Zone helps you understand the rules <span className="font-semibold">before</span>{" "}
            you buy or list, so you can protect your cashflow and avoid
            expensive surprises.
          </p>
        </section>

        <section id="how-it-works" className="mt-8 text-sm text-gray-600">
          <h2 className="text-base font-semibold text-[#1a202c]">
            How STR Zone works
          </h2>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                1. Search any city or address
              </p>
              <p className="mt-1">
                Type an address or city and we auto-detect the jurisdiction.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                2. We map it to STR rules
              </p>
              <p className="mt-1">
                We match it against our rules database and pull status, permits,
                caps, and notes.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                3. You get a clear, actionable summary
              </p>
              <p className="mt-1">
                See what&apos;s allowed, what&apos;s required, and click through
                to the official source so you can stay compliant.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="max-w-2xl">
            {loading && <div className="text-gray-600">Loading…</div>}

            {err && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                {err}
              </div>
            )}

            {!loading && rows && rows.length > 0 && !match && (
              <div className="rounded-lg border bg-white p-4 shadow-sm text-sm text-gray-700">
                No match found for{" "}
                <span className="font-semibold">
                  {resolvedCity || query}
                </span>
                .
                <div className="mt-2 text-xs text-gray-500">
                  Current inventory:{" "}
                  {rows.map((r) => r.jurisdiction_name).join(", ")}
                </div>
              </div>
            )}

            {!loading && match && (
              <>
                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-[#1a202c]">
                        {match.jurisdiction_name}
                      </h2>
                      <div className="mt-1 text-xs text-gray-500">
                        Last verified: {match.last_verified || "—"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700">
                        {label}
                      </span>
                      <button
                        onClick={handleSaveCity}
                        disabled={isSaved}
                        className={`rounded-xl px-4 py-1.5 text-xs font-semibold transition ${
                          isSaved
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-[#3b82f6] text-white hover:bg-[#2563eb]'
                        }`}
                      >
                        {isSaved ? '✓ Saved' : 'Save City'}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm text-gray-700">
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

                    {match.permit_checklist && (
                      <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
                        <h3 className="text-sm font-semibold text-[#1a202c] flex items-center gap-2">
                          <svg className="w-4 h-4 text-[#3b82f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          Permit Checklist
                        </h3>
                        <div className="mt-2 text-sm text-gray-700 whitespace-pre-line">
                          {match.permit_checklist}
                        </div>
                      </div>
                    )}

                    {match.source_url && (
                      <a
                        className="text-sm text-[#3b82f6] underline"
                        href={match.source_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Official source
                      </a>
                    )}
                  </div>
                </div>

                <EmailCapture city={resolvedCity || match.jurisdiction_name} />

                <p className="mt-4 text-xs text-gray-600">
                  Manage more than one property or market? Get rule-change
                  alerts and permit checklists for{" "}
                  <span className="font-semibold">
                    {resolvedCity || match.jurisdiction_name}
                  </span>{" "}
                  and other cities with{" "}
                  <Link
                    href="/pricing"
                    className="font-semibold text-[#3b82f6] underline"
                  >
                    STR Zone PRO →
                  </Link>
                </p>
              </>
            )}

            {!loading && rows && rows.length === 0 && (
              <div className="rounded-lg border bg-white p-4 text-sm text-gray-700 shadow-sm">
                API returned 0 rows. That means your sheet filter didn't match
                anything.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}