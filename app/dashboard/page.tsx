"use client";

import { useState, useEffect } from 'react';
import { Building2, Home, Wrench, Users, Plus, LogOut, AlertCircle, Clock, CheckCircle, Calendar, DollarSign, Bot } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';
import { useRouter } from 'next/navigation';
import CleaningScheduler from '../components/CleaningScheduler';
import RevenueDashboard from '../components/RevenueDashboard';
import AIChat from '../components/AIChat';

// Add Property Modal
function AddPropertyModal({ isOpen, onClose, onSuccess, userId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    total_units: ''
  });

  const handleSubmit = async () => {
    if (!formData.name || !formData.address || !formData.city || !formData.state || !formData.zip) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: insertError } = await supabase
        .from('properties')
        .insert([{
          user_id: userId,
          name: formData.name,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          total_units: parseInt(formData.total_units) || 0
        }]);

      if (insertError) throw insertError;

      setFormData({ name: '', address: '', city: '', state: '', zip: '', total_units: '' });
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
          <h2 className="text-2xl font-bold">Add New Property</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <div className="p-6 space-y-4">
          {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-600">{error}</p></div>}
          <div><label className="block text-sm font-medium mb-2">Property Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Sunset Apartments" className="w-full px-4 py-3 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-2">Street Address *</label><input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="123 Main St" className="w-full px-4 py-3 border rounded-lg" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-2">City *</label><input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="San Diego" className="w-full px-4 py-3 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium mb-2">State *</label><input type="text" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} placeholder="CA" maxLength={2} className="w-full px-4 py-3 border rounded-lg" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-2">ZIP Code *</label><input type="text" value={formData.zip} onChange={(e) => setFormData({ ...formData, zip: e.target.value })} placeholder="92101" className="w-full px-4 py-3 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium mb-2">Number of Units</label><input type="number" value={formData.total_units} onChange={(e) => setFormData({ ...formData, total_units: e.target.value })} placeholder="10" className="w-full px-4 py-3 border rounded-lg" /></div>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-6 border-t">
          <button onClick={onClose} className="px-6 py-3 border rounded-lg">Cancel</button>
          <button onClick={handleSubmit} disabled={loading} className="px-6 py-3 bg-indigo-600 text-white rounded-lg">{loading ? 'Adding...' : 'Add Property'}</button>
        </div>
      </div>
    </div>
  );
}

// Add Maintenance Modal
function AddMaintenanceModal({ isOpen, onClose, onSuccess, userId, properties }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    property_id: '',
    title: '',
    description: '',
    priority: 'medium',
    category: 'other'
  });

  const handleSubmit = async () => {
    if (!formData.property_id || !formData.title || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: insertError } = await supabase
        .from('maintenance_requests')
        .insert([{
          user_id: userId,
          property_id: formData.property_id,
          unit_id: null,
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          category: formData.category,
          status: 'open'
        }]);

      if (insertError) throw insertError;

      setFormData({ property_id: '', title: '', description: '', priority: 'medium', category: 'other' });
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
          <h2 className="text-2xl font-bold">New Maintenance Request</h2>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>
        <div className="p-6 space-y-4">
          {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-600">{error}</p></div>}
          <div><label className="block text-sm font-medium mb-2">Property *</label><select value={formData.property_id} onChange={(e) => setFormData({ ...formData, property_id: e.target.value })} className="w-full px-4 py-3 border rounded-lg"><option value="">Select a property</option>{properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
          <div><label className="block text-sm font-medium mb-2">Issue Title *</label><input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g., Leaking faucet" className="w-full px-4 py-3 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-2">Description *</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} className="w-full px-4 py-3 border rounded-lg" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-2">Priority</label><select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="w-full px-4 py-3 border rounded-lg"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="emergency">Emergency</option></select></div>
            <div><label className="block text-sm font-medium mb-2">Category</label><select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-3 border rounded-lg"><option value="plumbing">Plumbing</option><option value="electrical">Electrical</option><option value="hvac">HVAC</option><option value="appliance">Appliance</option><option value="structural">Structural</option><option value="other">Other</option></select></div>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-6 border-t">
          <button onClick={onClose} className="px-6 py-3 border rounded-lg">Cancel</button>
          <button onClick={handleSubmit} disabled={loading} className="px-6 py-3 bg-indigo-600 text-white rounded-lg">{loading ? 'Creating...' : 'Create Request'}</button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [stats, setStats] = useState({ properties: 0, units: 0, maintenance: 0, tenants: 0 });
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [showAddMaintenance, setShowAddMaintenance] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
    } else {
      setUser(user);
      loadData(user.id);
    }
  };

  const loadData = async (userId) => {
    const { data: propertiesData } = await supabase.from('properties').select('*').eq('user_id', userId);
    const { data: requestsData } = await supabase.from('maintenance_requests').select('*, properties(name, address)').eq('user_id', userId).order('created_at', { ascending: false });

    setProperties(propertiesData || []);
    setMaintenanceRequests(requestsData || []);
    setStats({
      properties: propertiesData?.length || 0,
      units: 0,
      maintenance: requestsData?.filter(r => r.status === 'open').length || 0,
      tenants: 0
    });
  };

  const updateStatus = async (requestId, newStatus) => {
    await supabase.from('maintenance_requests').update({ status: newStatus }).eq('id', requestId);
    loadData(user.id);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'in_progress': return <Clock className="w-5 h-5 text-blue-600" />;
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      default: return <Wrench className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AddPropertyModal isOpen={showAddProperty} onClose={() => setShowAddProperty(false)} onSuccess={() => loadData(user.id)} userId={user?.id} />
      <AddMaintenanceModal isOpen={showAddMaintenance} onClose={() => setShowAddMaintenance(false)} onSuccess={() => loadData(user.id)} userId={user?.id} properties={properties} />

      {/* Sidebar */}
      <div className="w-64 bg-white border-r flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center"><Building2 className="w-6 h-6 text-white" /></div>
            <div><h1 className="text-xl font-bold">STR Zone</h1><p className="text-sm text-gray-500">Property Manager</p></div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'overview' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'}`}><Home className="w-5 h-5" /><span className="font-medium">Overview</span></button>
          <button onClick={() => setActiveTab('properties')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'properties' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'}`}><Building2 className="w-5 h-5" /><span className="font-medium">Properties</span></button>
          <button onClick={() => setActiveTab('cleanings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'cleanings' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'}`}><Calendar className="w-5 h-5" /><span className="font-medium">Cleanings</span></button>
          <button onClick={() => setActiveTab('maintenance')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'maintenance' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'}`}><Wrench className="w-5 h-5" /><span className="font-medium">Maintenance</span></button>
          <button onClick={() => setActiveTab('revenue')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'revenue' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'}`}><DollarSign className="w-5 h-5" /><span className="font-medium">Revenue</span></button>
          <button onClick={() => setActiveTab('ai-assistant')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'ai-assistant' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'}`}><Bot className="w-5 h-5" /><span className="font-medium">AI Assistant</span></button>
          <button onClick={() => setActiveTab('tenants')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'tenants' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'}`}><Users className="w-5 h-5" /><span className="font-medium">Tenants</span></button>
        </nav>
        <div className="p-4 border-t"><button onClick={async () => { await supabase.auth.signOut(); router.push('/login'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50"><LogOut className="w-5 h-5" /><span className="font-medium">Logout</span></button></div>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-auto p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            {activeTab === 'overview' && 'Dashboard Overview'}
            {activeTab === 'properties' && 'Properties'}
            {activeTab === 'cleanings' && 'Cleaning Schedule'}
            {activeTab === 'maintenance' && 'Maintenance Requests'}
            {activeTab === 'revenue' && 'Revenue Dashboard'}
            {activeTab === 'ai-assistant' && 'AI Assistant'}
            {activeTab === 'tenants' && 'Tenants'}
          </h2>
          <p className="text-gray-600">Welcome back, {user?.email}</p>
        </div>

        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl border"><div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4"><Building2 className="w-6 h-6 text-blue-600" /></div><p className="text-sm text-gray-600 mb-1">Total Properties</p><p className="text-3xl font-bold">{stats.properties}</p></div>
              <div className="bg-white p-6 rounded-xl border"><div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4"><Home className="w-6 h-6 text-green-600" /></div><p className="text-sm text-gray-600 mb-1">Total Units</p><p className="text-3xl font-bold">{stats.units}</p></div>
              <div className="bg-white p-6 rounded-xl border"><div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4"><Wrench className="w-6 h-6 text-orange-600" /></div><p className="text-sm text-gray-600 mb-1">Open Requests</p><p className="text-3xl font-bold">{stats.maintenance}</p></div>
              <div className="bg-white p-6 rounded-xl border"><div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4"><Users className="w-6 h-6 text-purple-600" /></div><p className="text-sm text-gray-600 mb-1">Active Tenants</p><p className="text-3xl font-bold">{stats.tenants}</p></div>
            </div>
            <div className="bg-white p-6 rounded-xl border">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-3 gap-4">
                <button onClick={() => setShowAddProperty(true)} className="flex items-center gap-3 p-4 border-2 border-dashed rounded-lg hover:border-indigo-500 hover:bg-indigo-50"><Plus className="w-5 h-5 text-indigo-600" /><span className="font-medium">Add Property</span></button>
                <button className="flex items-center gap-3 p-4 border-2 border-dashed rounded-lg hover:border-indigo-500 hover:bg-indigo-50"><Plus className="w-5 h-5 text-indigo-600" /><span className="font-medium">Add Tenant</span></button>
                <button onClick={() => setShowAddMaintenance(true)} className="flex items-center gap-3 p-4 border-2 border-dashed rounded-lg hover:border-indigo-500 hover:bg-indigo-50"><Plus className="w-5 h-5 text-indigo-600" /><span className="font-medium">New Request</span></button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'properties' && (
          <div>
            {properties.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border text-center"><Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" /><h3 className="text-xl font-bold mb-2">No Properties Yet</h3><p className="text-gray-600 mb-6">Get started by adding your first property</p><button onClick={() => setShowAddProperty(true)} className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold">Add Your First Property</button></div>
            ) : (
              <div>
                <div className="flex justify-between mb-6"><p className="text-gray-600">{properties.length} properties</p><button onClick={() => setShowAddProperty(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2"><Plus className="w-4 h-4" />Add Property</button></div>
                <div className="grid grid-cols-3 gap-6">{properties.map(p => <div key={p.id} className="bg-white p-6 rounded-xl border"><h3 className="text-lg font-bold mb-2">{p.name}</h3><p className="text-sm text-gray-600 mb-4">{p.address}<br />{p.city}, {p.state} {p.zip}</p><span className="text-sm text-gray-500">{p.total_units} units</span></div>)}</div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'cleanings' && (
          <CleaningScheduler userId={user?.id} properties={properties} />
        )}

        {activeTab === 'revenue' && (
          <RevenueDashboard userId={user?.id} properties={properties} />
        )}

        {activeTab === 'ai-assistant' && (
          <AIChat properties={properties} />
        )}

        {activeTab === 'maintenance' && (
          <div>
            <div className="flex justify-between mb-6"><p className="text-gray-600">{maintenanceRequests.length} total requests</p><button onClick={() => setShowAddMaintenance(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">+ New Request</button></div>
            {maintenanceRequests.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border text-center"><Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" /><h3 className="text-xl font-bold mb-2">No Maintenance Requests</h3><p className="text-gray-600 mb-6">All caught up!</p><button onClick={() => setShowAddMaintenance(true)} className="px-6 py-3 bg-indigo-600 text-white rounded-lg">Create First Request</button></div>
            ) : (
              <div className="space-y-4">
                {maintenanceRequests.map(req => (
                  <div key={req.id} className="bg-white p-6 rounded-xl border">
                    <div className="flex justify-between mb-4">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">{getStatusIcon(req.status)}</div>
                        <div><h3 className="text-lg font-bold">{req.title}</h3><p className="text-sm text-gray-600">{req.properties?.name}</p></div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(req.priority)}`}>{req.priority.toUpperCase()}</span>
                    </div>
                    <p className="text-gray-700 mb-4">{req.description}</p>
                    <div className="flex justify-between">
                      <div className="flex gap-4 text-sm text-gray-600"><span className="px-3 py-1 bg-gray-100 rounded-full">{req.category}</span><span>{new Date(req.created_at).toLocaleDateString()}</span></div>
                      <select value={req.status} onChange={(e) => updateStatus(req.id, e.target.value)} className="px-4 py-2 border rounded-lg text-sm"><option value="open">Open</option><option value="in_progress">In Progress</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'tenants' && (
          <div className="bg-white p-8 rounded-xl border text-center"><Users className="w-16 h-16 text-gray-400 mx-auto mb-4" /><h3 className="text-xl font-bold mb-2">No Tenants Yet</h3><p className="text-gray-600 mb-6">Add tenants to start managing</p><button className="px-6 py-3 bg-indigo-600 text-white rounded-lg">Add Your First Tenant</button></div>
        )}
      </div>
    </div>
  );
}