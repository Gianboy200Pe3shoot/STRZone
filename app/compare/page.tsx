"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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
  return "Conditional";
}

export default function ComparePage() {
  const [allCities, setAllCities] = useState<RuleRow[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all cities on mount
  useEffect(() => {
    async function loadAllCities() {
      try {
        const res = await fetch("/api/rules", { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load cities (${res.status})`);
        const data = await res.json();
        const cities: RuleRow[] = Array.isArray(data?.rows) ? data.rows : [];
        setAllCities(cities);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load cities");
      } finally {
        setLoading(false);
      }
    }
    loadAllCities();
  }, []);

  const toggleCity = (cityName: string) => {
    if (selectedCities.includes(cityName)) {
      setSelectedCities(selectedCities.filter((c) => c !== cityName));
    } else {
      if (selectedCities.length >= 5) {
        alert("Maximum 5 cities for comparison");
        return;
      }
      setSelectedCities([...selectedCities, cityName]);
    }
  };

  const comparedCities = allCities.filter((city) =>
    selectedCities.includes(city.jurisdiction_name)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f3f4f6] to-white text-[#1a202c]">
      {/* Top nav */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="rounded-md bg-[#1a202c] px-2 py-1 text-xs font-semibold text-white">
              STR
            </span>
            <span className="text-sm font-semibold tracking-tight text-[#1a202c]">
              STR Zone
            </span>
          </Link>

          <nav className="flex items-center gap-6 text-sm text-gray-700">
            <Link href="/checker" className="hover:text-[#1a202c]">
              Free Checker
            </Link>
            <Link href="/compare" className="font-semibold text-[#1a202c]">
              Compare
            </Link>
            <Link href="/my-cities" className="hover:text-[#1a202c]">
              My Cities
            </Link>
            <Link href="/property-management" className="hover:text-[#1a202c]">
              Property Management
            </Link>
            <Link href="/login" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">
              Login
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10">
        {/* Hero */}
        <section className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#3b82f6]">
            STR Zone • City Comparison
          </p>
          <h1 className="mt-3 text-3xl font-semibold md:text-4xl text-[#1a202c]">
            Compare STR regulations across cities
          </h1>
          <p className="mt-3 text-sm md:text-base text-gray-600 max-w-2xl">
            Select 2-5 cities to see side-by-side regulations. Perfect for investors evaluating multiple markets or hosts managing properties in different locations.
          </p>
        </section>

        {loading && (
          <div className="text-gray-600">Loading cities...</div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* City selector */}
            <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#1a202c] mb-4">
                Select cities to compare ({selectedCities.length}/5)
              </h2>
              <div className="flex flex-wrap gap-2">
                {allCities.map((city) => {
                  const isSelected = selectedCities.includes(
                    city.jurisdiction_name
                  );
                  return (
                    <button
                      key={city.jurisdiction_name}
                      onClick={() => toggleCity(city.jurisdiction_name)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        isSelected
                          ? "bg-[#3b82f6] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {city.jurisdiction_name}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Comparison table */}
            {comparedCities.length > 0 && (
              <section className="overflow-x-auto">
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <table className="w-full text-sm">
                    <thead className="border-b border-gray-200 bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700 sticky left-0 bg-gray-50">
                          Regulation
                        </th>
                        {comparedCities.map((city) => (
                          <th
                            key={city.jurisdiction_name}
                            className="px-4 py-3 text-left font-semibold text-gray-700 min-w-[200px]"
                          >
                            {city.jurisdiction_name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-700 sticky left-0 bg-white">
                          STR Status
                        </td>
                        {comparedCities.map((city) => (
                          <td key={city.jurisdiction_name} className="px-4 py-3">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                statusLabel(city.str_status) === "Not Allowed"
                                  ? "bg-red-100 text-red-700"
                                  : statusLabel(city.str_status) === "Allowed with Permit"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : statusLabel(city.str_status) === "Allowed"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {statusLabel(city.str_status)}
                            </span>
                          </td>
                        ))}
                      </tr>

                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-700 sticky left-0 bg-white">
                          Permit Required
                        </td>
                        {comparedCities.map((city) => (
                          <td key={city.jurisdiction_name} className="px-4 py-3 text-gray-600">
                            {city.permit_required || "—"}
                          </td>
                        ))}
                      </tr>

                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-700 sticky left-0 bg-white">
                          Primary Residence Required
                        </td>
                        {comparedCities.map((city) => (
                          <td key={city.jurisdiction_name} className="px-4 py-3 text-gray-600">
                            {city.primary_residence_required || "—"}
                          </td>
                        ))}
                      </tr>

                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-700 sticky left-0 bg-white">
                          Min Stay (nights)
                        </td>
                        {comparedCities.map((city) => (
                          <td key={city.jurisdiction_name} className="px-4 py-3 text-gray-600">
                            {city.min_stay_nights || "—"}
                          </td>
                        ))}
                      </tr>

                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-700 sticky left-0 bg-white">
                          Caps / Limits
                        </td>
                        {comparedCities.map((city) => (
                          <td key={city.jurisdiction_name} className="px-4 py-3 text-gray-600">
                            {city.cap_or_limit || "—"}
                          </td>
                        ))}
                      </tr>

                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-700 sticky left-0 bg-white">
                          Taxes
                        </td>
                        {comparedCities.map((city) => (
                          <td key={city.jurisdiction_name} className="px-4 py-3 text-gray-600">
                            {city.taxes || "—"}
                          </td>
                        ))}
                      </tr>

                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-700 sticky left-0 bg-white">
                          Notes
                        </td>
                        {comparedCities.map((city) => (
                          <td key={city.jurisdiction_name} className="px-4 py-3 text-gray-600 text-xs">
                            {city.notes || "—"}
                          </td>
                        ))}
                      </tr>

                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-700 sticky left-0 bg-white">
                          Last Verified
                        </td>
                        {comparedCities.map((city) => (
                          <td key={city.jurisdiction_name} className="px-4 py-3 text-gray-500 text-xs">
                            {city.last_verified || "—"}
                          </td>
                        ))}
                      </tr>

                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-700 sticky left-0 bg-white">
                          Official Source
                        </td>
                        {comparedCities.map((city) => (
                          <td key={city.jurisdiction_name} className="px-4 py-3">
                            {city.source_url ? (
                              <a
                                href={city.source_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#3b82f6] hover:underline text-xs"
                              >
                                View source →
                              </a>
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {comparedCities.length === 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                <p className="text-gray-600">
                  Select at least 2 cities above to start comparing
                </p>
              </div>
            )}

            {/* Property Management upsell */}
            <section className="mt-8 rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-6">
              <h3 className="text-lg font-semibold text-[#1a202c]">
                Managing properties in multiple cities?
              </h3>
              <p className="mt-2 text-sm text-gray-700">
                Our Property Management Dashboard helps you track revenue, schedule cleanings, and get AI assistance for maintenance issues across all your properties.
              </p>
              <Link
                href="/property-management"
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
              >
                Learn about Property Management →
              </Link>
            </section>
          </>
        )}
      </main>
    </div>
  );
}