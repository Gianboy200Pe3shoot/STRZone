"use client";

import { useMemo, useState } from "react";

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
  if (s.includes("not") || s.includes("prohibit") || s.includes("ban")) return "Not Allowed";
  if (s.includes("permit") || s.includes("license") || s.includes("allowed")) {
    if (s.includes("permit")) return "Allowed with Permit";
    return "Allowed";
  }
  return "Conditional / Check details";
}

export default function CheckPage() {
  const [query, setQuery] = useState("San Diego");
  const [resolvedCity, setResolvedCity] = useState(""); // IMPORTANT
  const [rows, setRows] = useState<RuleRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function loadRules() {
    setLoading(true);
    setErr(null);

    try {
      // 1) Geocode: query -> city
      const geoRes = await fetch(`/api/rules/geocode?q=${encodeURIComponent(query)}`, {
        cache: "no-store",
      });
      if (!geoRes.ok) throw new Error(`Geocode failed (${geoRes.status})`);
      const geo = await geoRes.json();

      // if user typed a city, geo.city might be null sometimes — fallback to query
      const city = (geo?.city || query || "").trim();
      setResolvedCity(city);

      // 2) Rules: city -> rows
      const rulesRes = await fetch(`/api/rules?city=${encodeURIComponent(city)}`, {
        cache: "no-store",
      });
      if (!rulesRes.ok) throw new Error(`Rules failed (${rulesRes.status})`);
      const rulesData = await rulesRes.json();

      // Ensure rows is always an array
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

    // IMPORTANT: match based on resolvedCity (what API uses), not raw query
    const key = normalize(resolvedCity || query);
    if (!key) return null;

    return rows.find((r) => normalize(r.jurisdiction_name) === key) || null;
  }, [rows, query, resolvedCity]);

  const label = statusLabel(match?.str_status);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-3xl font-semibold">STR Legality Checker</h1>
        <p className="mt-2 text-gray-600">
          V1: type an address or city — we auto-detect the city.
        </p>

        <div className="mt-6 rounded-xl border p-4">
          <label className="block text-sm font-medium text-gray-700">Address or City</label>
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
              Detected city: <span className="font-medium">{resolvedCity}</span>
            </div>
          )}
        </div>

        <div className="mt-6">
          {loading && <div className="text-gray-600">Loading…</div>}

          {err && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              {err}
            </div>
          )}

          {!loading && rows && rows.length > 0 && !match && (
            <div className="rounded-lg border bg-gray-50 p-4">
              No match found for{" "}
              <span className="font-semibold">{resolvedCity || query}</span>.
              <div className="mt-2 text-sm text-gray-600">
                Current inventory: {rows.map((r) => r.jurisdiction_name).join(", ")}
              </div>
            </div>
          )}

          {!loading && match && (
            <div className="rounded-xl border p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{match.jurisdiction_name}</h2>
                  <div className="mt-1 text-sm text-gray-600">
                    Last verified: {match.last_verified || "—"}
                  </div>
                </div>
                <span className="rounded-full border px-3 py-1 text-sm font-medium">
                  {label}
                </span>
              </div>

              <div className="mt-4 grid gap-3 text-sm">
                <div><span className="font-medium">Permit required:</span> {match.permit_required || "—"}</div>
                <div><span className="font-medium">Primary residence required:</span> {match.primary_residence_required || "—"}</div>
                <div><span className="font-medium">Min stay nights:</span> {match.min_stay_nights || "—"}</div>
                <div><span className="font-medium">Caps / limits:</span> {match.cap_or_limit || "—"}</div>
                <div><span className="font-medium">Taxes:</span> {match.taxes || "—"}</div>
                <div><span className="font-medium">Notes:</span> {match.notes || "—"}</div>
                {match.source_url && (
                  <div>
                    <a className="text-blue-600 underline" href={match.source_url} target="_blank" rel="noreferrer">
                      Official source
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {!loading && rows && rows.length === 0 && (
            <div className="rounded-lg border bg-gray-50 p-4">
              API returned 0 rows. That means your sheet filter didn’t match anything.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}