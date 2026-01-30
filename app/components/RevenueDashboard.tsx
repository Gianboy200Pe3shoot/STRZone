"use client";

import { useState, useEffect } from 'react';
import { DollarSign, Upload, TrendingUp, TrendingDown, Calendar, X, Download } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';

// Upload Revenue Modal
function UploadRevenueModal({ isOpen, onClose, onSuccess, userId, properties }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    property_id: '',
    month: '',
    year: new Date().getFullYear().toString(),
    total_revenue: '',
    total_expenses: '',
    notes: ''
  });

  const handleSubmit = async () => {
    if (!formData.property_id || !formData.month || !formData.year || !formData.total_revenue) {
      setError('Please fill in required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const revenue = parseFloat(formData.total_revenue);
      const expenses = parseFloat(formData.total_expenses) || 0;
      const profit = revenue - expenses;

      const { error: insertError } = await supabase
  .from('revenue_records')
  .insert([{
    user_id: userId,
    property_id: formData.property_id,
    month: formData.month,
    year: parseInt(formData.year),
    total_revenue: revenue,
    total_expenses: expenses,
    // net_profit auto-calculated by database
    notes: formData.notes
  }]);

      if (insertError) throw insertError;

      setFormData({ property_id: '', month: '', year: new Date().getFullYear().toString(), total_revenue: '', total_expenses: '', notes: '' });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Add Revenue Record</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Property *</label>
            <select 
              value={formData.property_id} 
              onChange={(e) => setFormData({ ...formData, property_id: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg"
            >
              <option value="">Select a property</option>
              {properties.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Month *</label>
              <select 
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg"
              >
                <option value="">Select month</option>
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Year *</label>
              <select 
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Total Revenue *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input 
                type="number" 
                step="0.01"
                value={formData.total_revenue}
                onChange={(e) => setFormData({ ...formData, total_revenue: e.target.value })}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Total Expenses</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input 
                type="number" 
                step="0.01"
                value={formData.total_expenses}
                onChange={(e) => setFormData({ ...formData, total_expenses: e.target.value })}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 border rounded-lg"
              />
            </div>
          </div>

          {formData.total_revenue && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Net Profit:</span>
                <span className="text-2xl font-bold text-green-600">
                  ${(parseFloat(formData.total_revenue || '0') - parseFloat(formData.total_expenses || '0')).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea 
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Additional details..."
              className="w-full px-4 py-3 border rounded-lg"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          <button 
            onClick={onClose}
            className="px-6 py-3 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Revenue Record'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Revenue Dashboard Component
export default function RevenueDashboard({ userId, properties }) {
  const [revenueRecords, setRevenueRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedProperty, setSelectedProperty] = useState('all');

  useEffect(() => {
    loadRevenue();
  }, [userId]);

  const loadRevenue = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('revenue_records')
      .select('*, properties(name, address)')
      .eq('user_id', userId)
      .order('year', { ascending: false })
      .order('month', { ascending: false });

    if (!error && data) {
      setRevenueRecords(data);
    }
    setLoading(false);
  };

  const filteredRecords = revenueRecords.filter(r => {
    if (selectedYear && r.year !== selectedYear) return false;
    if (selectedProperty !== 'all' && r.property_id !== selectedProperty) return false;
    return true;
  });

  const totalRevenue = filteredRecords.reduce((sum, r) => sum + (r.total_revenue || 0), 0);
  const totalExpenses = filteredRecords.reduce((sum, r) => sum + (r.total_expenses || 0), 0);
  const netProfit = totalRevenue - totalExpenses;
  const avgMonthlyRevenue = filteredRecords.length > 0 ? totalRevenue / filteredRecords.length : 0;

  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100) : 0;

  // Group by property for breakdown
  const revenueByProperty = {};
  filteredRecords.forEach(record => {
    const propName = record.properties?.name || 'Unknown';
    if (!revenueByProperty[propName]) {
      revenueByProperty[propName] = { revenue: 0, expenses: 0, profit: 0 };
    }
    revenueByProperty[propName].revenue += record.total_revenue || 0;
    revenueByProperty[propName].expenses += record.total_expenses || 0;
    revenueByProperty[propName].profit += record.net_profit || 0;
  });

  const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  if (loading) {
    return <div className="p-8 text-center">Loading revenue data...</div>;
  }

  return (
    <div className="space-y-6">
      <UploadRevenueModal 
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={loadRevenue}
        userId={userId}
        properties={properties}
      />

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Revenue Dashboard</h2>
          <p className="text-gray-600 mt-1">Track income, expenses, and profitability</p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-indigo-700"
        >
          <Upload className="w-5 h-5" />
          Add Revenue
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border flex gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Year</label>
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-4 py-2 border rounded-lg"
          >
            {[...new Set(revenueRecords.map(r => r.year))].sort((a, b) => b - a).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Property</label>
          <select 
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">All Properties</option>
            {properties.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-900">${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
          <p className="text-3xl font-bold text-gray-900">${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Net Profit</p>
          <p className={`text-3xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${netProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Avg Monthly Revenue</p>
          <p className="text-3xl font-bold text-gray-900">${avgMonthlyRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      </div>

{/* Revenue by Property */}
      {Object.keys(revenueByProperty).length > 0 && (
        <div className="bg-white p-6 rounded-xl border">
          <h3 className="text-xl font-bold mb-4">Revenue by Property</h3>
          <div className="space-y-4">
            {Object.entries(revenueByProperty).map(([propName, data]: [string, any]) => (
              <div key={propName} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{propName}</h4>
                  <span className={`text-lg font-bold ${(data as any).profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${((data as any).profit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Revenue:</span>
                    <span className="ml-2 font-medium">${(data as any).revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Expenses:</span>
                    <span className="ml-2 font-medium">${(data as any).expenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Margin:</span>
                    <span className="ml-2 font-medium">
                      {(data as any).revenue > 0 ? (((data as any).profit / (data as any).revenue) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Records Table */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border text-center">
          <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No Revenue Records</h3>
          <p className="text-gray-600 mb-6">Start tracking your property revenue</p>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold"
          >
            Add First Record
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Expenses</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Profit</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredRecords
                  .sort((a, b) => {
                    if (a.year !== b.year) return b.year - a.year;
                    return monthOrder.indexOf(b.month) - monthOrder.indexOf(a.month);
                  })
                  .map(record => {
                    const margin = record.total_revenue > 0 ? ((record.net_profit / record.total_revenue) * 100) : 0;
                    return (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{record.properties?.name}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {record.month} {record.year}
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-gray-900">
                          ${record.total_revenue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-right text-gray-600">
                          ${record.total_expenses?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className={`px-6 py-4 text-right font-semibold ${record.net_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${record.net_profit?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${margin >= 50 ? 'bg-green-100 text-green-800' : margin >= 30 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                            {margin.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}