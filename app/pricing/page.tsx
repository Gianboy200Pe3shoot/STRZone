"use client";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f3f4f6] to-white text-[#1a202c]">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#3b82f6]">
              STR Zone • Plans
            </p>
            <h1 className="mt-2 text-3xl font-semibold">Pricing</h1>
            <p className="mt-2 text-sm text-gray-600">
              Choose the plan that fits how you run your short-term rentals.
            </p>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Basic Compliance</h2>
            <p className="mt-1 text-sm text-gray-600">
              Stay on the right side of city rules for one or a few markets.
            </p>

            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-semibold">$9.99</span>
              <span className="text-sm text-gray-500">/ month</span>
            </div>

            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li>• STR status + permit requirements</li>
              <li>• Min-stay, caps, and tax notes</li>
              <li>• Access everywhere</li>
            </ul>

            <a
              href="https://buy.stripe.com/9B68wI22R1Ab3yxb4w5os01"
              className="mt-6 w-full rounded-xl bg-[#3b82f6] px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-[#2563eb]"
            >
              Get Basic
            </a>

            <p className="mt-2 text-center text-xs text-gray-500">
              No contracts. Cancel anytime.
            </p>
          </div>

          {/* Pro */}
          <div className="rounded-2xl border border-[#3b82f6] bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Pro Compliance</h2>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#3b82f6]">
                Most popular
              </span>
            </div>

            <p className="mt-1 text-sm text-gray-600">
              For serious hosts who want proactive compliance.
            </p>

            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-semibold">$19.99</span>
              <span className="text-sm text-gray-500">/ month</span>
            </div>

            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li>• Everything in Basic</li>
              <li>• Save multiple cities</li>
              <li>• Rule-change alerts</li>
              <li>• Permit checklists</li>
              <li>• Priority support</li>
            </ul>

            <a
              href="https://buy.stripe.com/8x2eV65f32Efb0Z3C45os02"
              className="mt-6 w-full rounded-xl bg-[#1a202c] px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-black"
            >
              Go Pro
            </a>

            <p className="mt-2 text-center text-xs text-gray-500">
              No contracts. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}