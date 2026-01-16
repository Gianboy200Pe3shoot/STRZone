"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [listingUrl, setListingUrl] = useState('');

  const handleAnalyze = () => {
    if (!listingUrl || !listingUrl.includes('airbnb.com')) {
      alert('Please enter a valid Airbnb listing URL');
      return;
    }
    localStorage.setItem('listingUrl', listingUrl);
    router.push('/analyzer');
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">STR</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">STR Zone</span>
            </div>
            <div className="flex gap-4">
              <Link href="/checker" className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium">
                Legality Checker
              </Link>
              <Link href="/login" className="px-6 py-2 text-indigo-600 hover:text-indigo-700 font-semibold">
                Sign In
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Content */}
        <div className="flex-1 container mx-auto px-6 flex items-center">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-indigo-100 rounded-full mb-6">
                <span className="text-indigo-700 font-semibold text-sm">🚀 AI-Powered Optimization</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Increase Your Airbnb Revenue by
                <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> 23% or More</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Our AI analyzes 10,000+ listings to optimize your title, description, photos, and pricing. Get a free audit in 60 seconds.
              </p>

              {/* Input Form */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Enter Your Airbnb Listing URL
                </label>
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    value={listingUrl}
                    onChange={(e) => setListingUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                    placeholder="https://airbnb.com/rooms/12345678"
                    className="flex-1 px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none text-lg"
                  />
                  <button 
                    onClick={handleAnalyze}
                    className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    Analyze Free
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  ✓ Free audit · ✓ No credit card required · ✓ Results in 60 seconds
                </p>
              </div>

              {/* Social Proof */}
              <div className="mt-8 flex items-center gap-8">
                <div>
                  <div className="text-3xl font-bold text-gray-900">$847K+</div>
                  <div className="text-sm text-gray-600">Extra Revenue Generated</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">2,400+</div>
                  <div className="text-sm text-gray-600">Listings Optimized</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">23%</div>
                  <div className="text-sm text-gray-600">Avg Revenue Increase</div>
                </div>
              </div>
            </div>

            {/* Right Side - Visual */}
            <div className="hidden md:block">
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-6">
                  {/* Stat Card 1 */}
                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl">
                      ↑
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Revenue Potential</div>
                      <div className="text-2xl font-bold text-gray-900">+$8,400/year</div>
                    </div>
                  </div>

                  {/* Stat Card 2 */}
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl">
                      ★
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Listing Score</div>
                      <div className="text-2xl font-bold text-gray-900">6.2/10 → 9.1/10</div>
                    </div>
                  </div>

                  {/* Stat Card 3 */}
                  <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl">
                      📸
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Photo Quality</div>
                      <div className="text-2xl font-bold text-gray-900">12 Improvements</div>
                    </div>
                  </div>

                  {/* Stat Card 4 */}
                  <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl">
                      💰
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Pricing Optimization</div>
                      <div className="text-2xl font-bold text-gray-900">$89 → $112/night</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How STR Zone Optimizes Your Listing</h2>
            <p className="text-xl text-gray-600">AI-powered analysis that finds hidden revenue opportunities</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl border-2 border-gray-100 hover:border-indigo-200 transition-all hover:shadow-xl">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Title & Description</h3>
              <p className="text-gray-600 leading-relaxed">
                AI rewrites your listing based on 10,000+ high-performing listings. Optimized for Airbnb's search algorithm.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl border-2 border-gray-100 hover:border-indigo-200 transition-all hover:shadow-xl">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">📸</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Photo Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Computer vision identifies low-quality photos, missing shots, and suggests improvements that increase bookings.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl border-2 border-gray-100 hover:border-indigo-200 transition-all hover:shadow-xl">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Dynamic Pricing</h3>
              <p className="text-gray-600 leading-relaxed">
                Recommends optimal prices based on seasonality, local events, and competitor analysis. Maximizes revenue.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-br from-indigo-600 to-purple-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Increase Your Revenue?
          </h2>
          <p className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto">
            Join 2,400+ hosts who've increased their Airbnb revenue with AI-powered optimization
          </p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-12 py-5 bg-white text-indigo-600 rounded-xl font-bold text-xl hover:shadow-2xl transition-all hover:scale-105"
          >
            Get Your Free Audit Now
          </button>
        </div>
      </div>
    </div>
  );
}