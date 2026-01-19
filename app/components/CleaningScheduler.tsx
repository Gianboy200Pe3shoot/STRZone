"use client";

import { useState, useEffect } from 'react';
import { Calendar, Plus, CheckCircle, Clock, User, X } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';

// Add Cleaning Modal
function AddCleaningModal({ isOpen, onClose, onSuccess, userId, properties }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    property_id: '',
    unit_name: '',
    checkout_date: '',
    checkout_time: '11:00',
    cleaner_name: '',
    cleaner_phone: '',
    notes: ''
  });

  const handleSubmit = async () => {
    if (!formData.property_id || !formData.checkout_date || !formData.cleaner_name) {
      setError('Please fill in required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: insertError } = await supabase
        .from('cleanings')
        .insert([{
          user_id: userId,
          property_id: formData.property_id,
          unit_name: formData.unit_name,
          checkout_date: formData.checkout_date,
          checkout_time: formData.checkout_time,
          cleaner_name: formData.cleaner_name,
          cleaner_phone: formData.cleaner_phone,
          notes: formData.notes,
          status: 'scheduled'
        }]);

      if (insertError) throw insertError;

      setFormData({ property_id: '', unit_name: '', checkout_date: '', checkout_time: '11:00', cleaner_name: '', cleaner_phone: '', notes: '' });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Schedule Cleaning</h2>
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

          <div>
            <label className="block text-sm font-medium mb-2">Unit Name (optional)</label>
            <input 
              type="text" 
              value={formData.unit_name}
              onChange={(e) => setFormData({ ...formData, unit_name: e.target.value })}
              placeholder="e.g., Unit 3A, Main House"
              className="w-full px-4 py-3 border rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Checkout Date *</label>
              <input 
                type="date" 
                value={formData.checkout_date}
                onChange={(e) => setFormData({ ...formData, checkout_date: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Checkout Time</label>
              <input 
                type="time" 
                value={formData.checkout_time}
                onChange={(e) => setFormData({ ...formData, checkout_time: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cleaner Name *</label>
            <input 
              type="text" 
              value={formData.cleaner_name}
              onChange={(e) => setFormData({ ...formData, cleaner_name: e.target.value })}
              placeholder="John Smith"
              className="w-full px-4 py-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cleaner Phone</label>
            <input 
              type="tel" 
              value={formData.cleaner_phone}
              onChange={(e) => setFormData({ ...formData, cleaner_phone: e.target.value })}
              placeholder="(555) 123-4567"
              className="w-full px-4 py-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea 
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Extra cleaning needed, key location, etc."
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
            {loading ? 'Scheduling...' : 'Schedule Cleaning'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Cleaning Scheduler Component
export default function CleaningScheduler({ userId, properties }) {
  const [cleanings, setCleanings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all, scheduled, completed

  useEffect(() => {
    loadCleanings();
  }, [userId]);

  const loadCleanings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('cleanings')
      .select('*, properties(name, address)')
      .eq('user_id', userId)
      .order('checkout_date', { ascending: true });

    if (!error && data) {
      setCleanings(data);
    }
    setLoading(false);
  };

  const updateStatus = async (cleaningId, newStatus) => {
    await supabase
      .from('cleanings')
      .update({ status: newStatus })
      .eq('id', cleaningId);
    
    loadCleanings();
  };

  const filteredCleanings = cleanings.filter(c => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  const upcomingCleanings = filteredCleanings.filter(c => 
    new Date(c.checkout_date) >= new Date() && c.status === 'scheduled'
  );

  const todayCleanings = filteredCleanings.filter(c => {
    const today = new Date().toISOString().split('T')[0];
    return c.checkout_date === today;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled': return <Clock className="w-5 h-5 text-blue-600" />;
      case 'in_progress': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      default: return <Calendar className="w-5 h-5 text-gray-600" />;
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading cleanings...</div>;
  }

  return (
    <div className="space-y-6">
      <AddCleaningModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={loadCleanings}
        userId={userId}
        properties={properties}
      />

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Cleaning Schedule</h2>
          <p className="text-gray-600 mt-1">{cleanings.length} total cleanings scheduled</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5" />
          Schedule Cleaning
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b">
        <button 
          onClick={() => setFilter('all')}
          className={`px-6 py-3 font-medium border-b-2 transition ${
            filter === 'all' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          All ({cleanings.length})
        </button>
        <button 
          onClick={() => setFilter('scheduled')}
          className={`px-6 py-3 font-medium border-b-2 transition ${
            filter === 'scheduled' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Scheduled ({cleanings.filter(c => c.status === 'scheduled').length})
        </button>
        <button 
          onClick={() => setFilter('completed')}
          className={`px-6 py-3 font-medium border-b-2 transition ${
            filter === 'completed' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Completed ({cleanings.filter(c => c.status === 'completed').length})
        </button>
      </div>

      {/* Today's Cleanings */}
      {todayCleanings.length > 0 && (
        <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-orange-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Today's Cleanings ({todayCleanings.length})
          </h3>
          <div className="space-y-3">
            {todayCleanings.map(cleaning => (
              <div key={cleaning.id} className="bg-white p-4 rounded-lg border border-orange-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {cleaning.properties?.name}
                      {cleaning.unit_name && ` - ${cleaning.unit_name}`}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      <User className="w-4 h-4 inline mr-1" />
                      {cleaning.cleaner_name}
                      {cleaning.cleaner_phone && ` • ${cleaning.cleaner_phone}`}
                    </p>
                    <p className="text-sm text-gray-600">
                      Checkout: {cleaning.checkout_time}
                    </p>
                  </div>
                  <select 
                    value={cleaning.status}
                    onChange={(e) => updateStatus(cleaning.id, e.target.value)}
                    className="px-3 py-1 border rounded-lg text-sm"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Cleanings List */}
      {filteredCleanings.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No Cleanings Scheduled</h3>
          <p className="text-gray-600 mb-6">Start by scheduling your first cleaning</p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold"
          >
            Schedule First Cleaning
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCleanings.map(cleaning => (
            <div key={cleaning.id} className="bg-white p-6 rounded-xl border hover:shadow-lg transition">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getStatusIcon(cleaning.status)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {cleaning.properties?.name}
                      {cleaning.unit_name && ` - ${cleaning.unit_name}`}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {cleaning.properties?.address}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {new Date(cleaning.checkout_date).toLocaleDateString()} at {cleaning.checkout_time}
                      </span>
                      <span>
                        <User className="w-4 h-4 inline mr-1" />
                        {cleaning.cleaner_name}
                      </span>
                    </div>
                    {cleaning.notes && (
                      <p className="text-sm text-gray-500 mt-2 italic">{cleaning.notes}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(cleaning.status)}`}>
                    {cleaning.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <select 
                    value={cleaning.status}
                    onChange={(e) => updateStatus(cleaning.id, e.target.value)}
                    className="px-4 py-2 border rounded-lg text-sm"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}