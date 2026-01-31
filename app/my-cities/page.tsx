// app/my-cities/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useSavedCities } from "../hooks/useSavedCities";

export default function MyCitiesPage() {
  const { savedCities, removeCity } = useSavedCities();
  const [removing, setRemoving] = useState<string | null>(null);

  const handleRemove = (cityName: string) => {
    setRemoving(cityName);
    setTimeout(() => {
      removeCity(cityName);
      setRemoving(null);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f3f4f6] to-white text-[#1a202c]">
      {/* Top nav */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
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
            <Link href="/compare" className="hover:text-[#1a202c]">
              Compare
            </Link>
            <Link href="/my-cities" className="font-semibold text-[#1a202c]">
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

      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#3b82f6]">
            STR Zone • My Cities
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Saved Cities</h1>
          <p className="mt-2 text-sm text-gray-600">
            Quick access to cities you're monitoring. Re-check anytime to stay updated.
          </p>
        </div>

        {savedCities.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[#3b82f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-[#1a202c]">No saved cities yet</h2>
            <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
              When you check a city, click "Save City" to add it here for quick monitoring.
            </p>
            <Link
              href="/checker"
              className="mt-6 inline-flex items-center rounded-xl bg-[#3b82f6] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#2563eb] transition"
            >
              Check Your First City
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {savedCities.map((city) => (
              <div
                key={city.name}
                className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md ${
                  removing === city.name ? 'opacity-50 scale-95' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#1a202c]">{city.name}</h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Saved {new Date(city.savedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(city.name)}
                    className="text-gray-400 hover:text-red-500 transition"
                    aria-label="Remove city"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mt-3">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                    city.status.includes('Allowed') 
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : city.status.includes('Not Allowed')
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                  }`}>
                    {city.status}
                  </span>
                </div>

                {city.lastChecked && (
                  <p className="mt-2 text-xs text-gray-500">
                    Last checked {new Date(city.lastChecked).toLocaleDateString()}
                  </p>
                )}

                <Link
                  href={`/checker?city=${encodeURIComponent(city.name)}`}
                  className="mt-4 block w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  Re-check Now
                </Link>
              </div>
            ))}
          </div>
        )}

        {savedCities.length > 0 && (
          <div className="mt-8 rounded-2xl border-2 border-indigo-100 bg-indigo-50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#1a202c]">Managing properties across multiple cities?</h3>
                <p className="mt-1 text-sm text-gray-700">
                  Our Property Management Dashboard helps you track revenue, schedule cleanings, and get AI assistance for all your properties.
                </p>
                <Link
                  href="/property-management"
                  className="mt-3 inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Learn More →
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}