"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Building2, Calendar, Wrench, DollarSign, Users, CheckCircle, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="container mx-auto px-6 py-6 border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">STR Zone</span>
          </div>
          <div className="flex gap-6 items-center">
            <Link href="/checker" className="text-gray-700 hover:text-gray-900 font-medium">
              Legality Checker
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-gray-900 font-medium">
              Pricing
            </Link>
            <Link href="/login" className="px-6 py-2 text-indigo-600 hover:text-indigo-700 font-semibold border-2 border-indigo-600 rounded-lg">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="min-h-[85vh] flex items-center">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Copy */}
            <div>
              <div className="inline-block px-4 py-2 bg-blue-100 rounded-full mb-6">
                <span className="text-blue-700 font-semibold text-sm">🏠 For Multi-Property Hosts</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Manage All Your Short-Term Rentals
                <span className="block bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  In One Place
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Stop juggling Google Sheets, text messages, and memory. STR Zone is the operations dashboard built for Airbnb & VRBO hosts managing 3+ properties.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-3 mb-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-medium">Cleaning Scheduler</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
                  <Wrench className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-medium">Maintenance Tracker</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
                  <DollarSign className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-medium">Revenue Dashboard</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-medium">Team Management</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-4">
                <Link 
                  href="/login"
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="#features"
                  className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-gray-300 transition-all"
                >
                  See How It Works
                </Link>
              </div>

              <p className="text-sm text-gray-500 mt-4">
                ✓ 14-day free trial · ✓ No credit card required · ✓ Cancel anytime
              </p>
            </div>

            {/* Right Side - Dashboard Preview */}
            <div className="hidden md:block">
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                {/* Mock Dashboard Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
                  <h3 className="text-white font-semibold text-lg">Your Properties</h3>
                </div>
                
                {/* Mock Dashboard Content */}
                <div className="p-6 space-y-4">
                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                      <div className="text-3xl font-bold text-gray-900">5</div>
                      <div className="text-xs text-gray-600 mt-1">Properties</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <div className="text-3xl font-bold text-gray-900">12</div>
                      <div className="text-xs text-gray-600 mt-1">Active Units</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-xl">
                      <div className="text-3xl font-bold text-gray-900">3</div>
                      <div className="text-xs text-gray-600 mt-1">Open Tasks</div>
                    </div>
                  </div>

                  {/* Upcoming Cleanings */}
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Upcoming Cleanings
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="text-sm font-medium">Sunset Apartments - Unit 3A</div>
                          <div className="text-xs text-gray-500">Today, 2:00 PM</div>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="text-sm font-medium">Beach House - Main</div>
                          <div className="text-xs text-gray-500">Tomorrow, 10:00 AM</div>
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                      </div>
                    </div>
                  </div>

                  {/* Maintenance */}
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Wrench className="w-4 h-4" />
                      Recent Maintenance
                    </h4>
                    <div className="space-y-2">
                      <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">AC not cooling - Unit 2B</div>
                          <span className="text-xs font-semibold text-orange-700 px-2 py-1 bg-orange-100 rounded-full">HIGH</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">Assigned to: John's HVAC</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Run Your STR Portfolio
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built specifically for hosts managing multiple Airbnb & VRBO properties. No more chaos, missed cleanings, or forgotten maintenance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* Feature 1 - Cleaning Scheduler */}
            <div className="p-8 rounded-2xl border-2 border-gray-100 hover:border-indigo-200 transition-all hover:shadow-xl bg-white">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                <Calendar className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Cleaning Scheduler</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Automatically schedule cleanings after checkouts. Assign cleaners, send SMS reminders, track completion.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Manual checkout date entry</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Auto-SMS to cleaners</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Status tracking</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 - Maintenance Tracker */}
            <div className="p-8 rounded-2xl border-2 border-gray-100 hover:border-indigo-200 transition-all hover:shadow-xl bg-white">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
                <Wrench className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Maintenance Tracker</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Log issues, upload photos, assign contractors, track status. Nothing falls through the cracks.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Photo uploads</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Contractor assignment</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Priority levels</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 - Revenue Dashboard */}
            <div className="p-8 rounded-2xl border-2 border-gray-100 hover:border-indigo-200 transition-all hover:shadow-xl bg-white">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Revenue Dashboard</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Upload monthly CSVs from Airbnb/VRBO. See total revenue, expenses, and profit per property.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>CSV import</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Per-property breakdown</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Simple charts</span>
                </li>
              </ul>
            </div>

            {/* Feature 4 - Team Management */}
            <div className="p-8 rounded-2xl border-2 border-gray-100 hover:border-indigo-200 transition-all hover:shadow-xl bg-white">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Team Management</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Add cleaners, contractors, co-hosts. Set permissions. Track their tasks and performance.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Role-based access</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Task assignment</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Performance tracking</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Built for Hosts Like You
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Managing 3+ properties? You need a real operations system.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="text-4xl font-bold text-indigo-600 mb-2">10+</div>
                <div className="text-gray-600">Hours Saved per Week</div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="text-4xl font-bold text-indigo-600 mb-2">$67</div>
                <div className="text-gray-600">Flat Monthly Price</div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="text-4xl font-bold text-indigo-600 mb-2">∞</div>
                <div className="text-gray-600">Unlimited Properties</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="py-24 bg-gradient-to-r from-indigo-600 to-blue-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Stop the Chaos?
          </h2>
          <p className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto">
            Join hosts who manage their entire STR portfolio from one dashboard. Start your free trial today.
          </p>
          <Link 
            href="/login"
            className="inline-flex items-center gap-2 px-12 py-5 bg-white text-indigo-600 rounded-xl font-bold text-xl hover:shadow-2xl transition-all hover:scale-105"
          >
            Start Free Trial
            <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="text-sm text-indigo-100 mt-6">
            14 days free · No credit card required · Cancel anytime
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">STR Zone</span>
            </div>
            <div className="flex gap-8 text-sm">
              <Link href="/checker" className="hover:text-white transition">Legality Checker</Link>
              <Link href="/pricing" className="hover:text-white transition">Pricing</Link>
              <Link href="/login" className="hover:text-white transition">Login</Link>
            </div>
          </div>
          <div className="text-center text-xs mt-8 pt-8 border-t border-gray-800">
            © 2025 STR Zone. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}