"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AnalyzerResults() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [listing, setListing] = useState(null);

  useEffect(() => {
    analyzeListing();
  }, []);

  const analyzeListing = async () => {
    const listingUrl = localStorage.getItem('listingUrl');
    
    if (!listingUrl) {
      router.push('/');
      return;
    }

    try {
      const response = await fetch('/api/analyze-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingUrl })
      });

      const data = await response.json();
      setListing(data.listing);
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Your Listing...</h2>
          <p className="text-gray-600">AI is reviewing 10,000+ comparable listings</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Analysis Failed</h2>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">STR Zone</h1>
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold"
            >
              Unlock Full Report
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-5xl">
        {/* Revenue Potential Banner */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 mb-2">Estimated Revenue Increase</p>
              <p className="text-5xl font-bold">{analysis.revenueIncreasePotential}</p>
              <p className="text-green-100 mt-2">Based on our AI analysis of 10,000+ listings</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <div>
                  <p className="text-5xl font-bold">{analysis.overallScore}</p>
                  <p className="text-sm">/ 10</p>
                </div>
              </div>
              <p className="mt-2 text-sm">Overall Score</p>
            </div>
          </div>
        </div>

        {/* Current vs Optimized */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Current */}
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">❌</span>
              <h3 className="text-xl font-bold text-gray-900">Current Listing</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Title</p>
                <p className="font-medium text-gray-900">{listing.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Description</p>
                <p className="text-gray-700">{listing.description}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Price</p>
                <p className="text-2xl font-bold text-gray-900">${listing.price}/night</p>
              </div>
            </div>
          </div>

          {/* Optimized */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">✨</span>
              <h3 className="text-xl font-bold text-indigo-900">AI-Optimized</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-indigo-600 mb-1">Optimized Title</p>
                <p className="font-medium text-indigo-900">{analysis.optimizedTitle}</p>
              </div>
              <div>
                <p className="text-sm text-indigo-600 mb-1">Optimized Description (Preview)</p>
                <p className="text-indigo-800">{analysis.optimizedDescription?.substring(0, 120)}...</p>
                <p className="text-sm text-indigo-500 mt-2">🔒 Unlock full version</p>
              </div>
              <div>
                <p className="text-sm text-indigo-600 mb-1">Recommended Price</p>
                <p className="text-2xl font-bold text-indigo-900">${analysis.pricingRecommendation.recommendedPrice}/night</p>
                <p className="text-sm text-green-600 font-semibold mt-1">
                  +{Math.round(((analysis.pricingRecommendation.recommendedPrice - listing.price) / listing.price) * 100)}% increase
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-white rounded-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Insights</h3>
          <div className="space-y-4">
            {analysis.keyInsights.map((insight, index) => (
              <div key={index} className="flex gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <span className="text-2xl">💡</span>
                <p className="text-gray-800">{insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Locked Sections Preview */}
        <div className="space-y-6">
          {/* Photo Improvements - Locked */}
          <div className="bg-white rounded-xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white z-10"></div>
            <div className="blur-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">📸 Photo Improvements</h3>
              <ul className="space-y-3">
                {analysis.photoImprovements.slice(0, 2).map((improvement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-indigo-600">•</span>
                    <span className="text-gray-700">{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <button
                onClick={() => router.push('/login')}
                className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg shadow-2xl hover:bg-indigo-700"
              >
                🔓 Unlock Full Analysis - $97/mo
              </button>
            </div>
          </div>

          {/* Amenity Gaps - Locked */}
          <div className="bg-white rounded-xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white z-10"></div>
            <div className="blur-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">🎯 Missing Amenities</h3>
              <ul className="space-y-3">
                {analysis.amenityGaps.slice(0, 2).map((gap, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-red-600">✗</span>
                    <span className="text-gray-700">{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <button
                onClick={() => router.push('/login')}
                className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg shadow-2xl hover:bg-indigo-700"
              >
                🔓 See All Recommendations
              </button>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-center mt-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Unlock Your Full Revenue Potential?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Get complete optimization report + monthly updates for just $97/month
          </p>
          <button
            onClick={() => router.push('/login')}
            className="px-12 py-5 bg-white text-indigo-600 rounded-xl font-bold text-xl hover:shadow-2xl transition-all"
          >
            Start Free Trial →
          </button>
          <p className="text-indigo-100 mt-4 text-sm">14-day money-back guarantee</p>
        </div>
      </div>
    </div>
  );
}