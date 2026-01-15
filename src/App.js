import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Calendar, MapPin, Phone, DollarSign, Clock, AlertCircle, Users, FileText, TrendingUp, Wrench, Bell, Search, Plus, X, LogIn, LogOut, Mail, Lock, Eye, EyeOff } from 'lucide-react';

// Supabase
const SUPABASE_URL = 'https://xqelbfpgfmvqijgojszk.supabase.co';
const SUPABASE_KEY = 'sb_publishable_qk8WuaN1x4EqzNacL5_J3w_7aDW2paF';
let supabaseInstance = null;
function getSupabase() {
  if (!supabaseInstance) supabaseInstance = createClient(SUPABASE_URL, SUPABASE_KEY);
  return supabaseInstance;
}
const supabase = getSupabase();

// Auth Screen - sama stiil kui äpp
function AuthScreen({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.includes('Invalid login')) throw new Error('Vale e-post või parool');
          throw error;
        }
        if (data.user) onLogin(data.user);
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.user && !data.session) {
          setError('Konto loodud! Kontrolli e-posti kinnitamiseks.');
        } else if (data.user) {
          onLogin(data.user);
        }
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header sama stiil */}
        <div className="bg-blue-600 text-white p-6 rounded-t-xl shadow-lg">
          <div className="flex items-center gap-3 justify-center">
            <Wrench className="w-10 h-10" />
            <div className="text-center">
              <h1 className="text-2xl font-bold">HVAC Pro CRM</h1>
              <p className="text-sm text-blue-100">Lihtne. Võimas. Kasulik.</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white p-6 rounded-b-xl shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
            {isLogin ? 'Logi sisse' : 'Loo konto'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-post</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="sinu@email.ee"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parool</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  {isLogin ? 'Logi sisse' : 'Registreeru'}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-blue-600 hover:underline text-sm"
            >
              {isLogin ? 'Pole kontot? Registreeru' : 'On juba konto? Logi sisse'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Delete Modal
function DeleteModal({ onConfirm, onCancel, text }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full">
        <h3 className="text-lg font-bold mb-2">Kinnita kustutamine</h3>
        <p className="text-gray-600 mb-4">{text}</p>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">Tühista</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Kustuta</button>
        </div>
      </div>
    </div>
  );
}

// Main App
export default function HVACSimpleCRM() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [customers, setCustomers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [maintenancePlans, setMaintenancePlans] = useState([]);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddJob, setShowAddJob] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [jobFilter, setJobFilter] = useState('all');
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  
  const dropdownRef = useRef(null);
  
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', address: '', propertyType: '', customerType: '' });
  const [newJob, setNewJob] = useState({ customerId: '', serviceType: '', scheduledDate: '', scheduledTime: '', amount: '', isEmergency: false });

  // Auth check
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Load data
  useEffect(() => {
    if (user) loadData();
  }, [user]);

  // Dropdown close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCustomerDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadData = async () => {
    const [c, j, p] = await Promise.all([
      supabase.from('customers').select('*').order('created_at', { ascending: false }),
      supabase.from('jobs').select('*').order('scheduled_date', { ascending: true }),
      supabase.from('maintenance_plans').select('*')
    ]);
    setCustomers(c.data || []);
    setJobs(j.data || []);
    setMaintenancePlans(p.data || []);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.phone || !newCustomer.address || !newCustomer.propertyType || !newCustomer.customerType) return;
    
    if (editingCustomer) {
      await supabase.from('customers').update({
        name: newCustomer.name, phone: newCustomer.phone, address: newCustomer.address,
        property_type: newCustomer.propertyType, customer_type: newCustomer.customerType
      }).eq('id', editingCustomer.id);
      setEditingCustomer(null);
    } else {
      await supabase.from('customers').insert([{
        user_id: user.id, name: newCustomer.name, phone: newCustomer.phone, address: newCustomer.address,
        property_type: newCustomer.propertyType, customer_type: newCustomer.customerType, total_revenue: 0
      }]);
    }
    setShowAddCustomer(false);
    setNewCustomer({ name: '', phone: '', address: '', propertyType: '', customerType: '' });
    loadData();
  };

  const deleteCustomer = async () => {
    if (!deleteModal) return;
    await supabase.from('customers').delete().eq('id', deleteModal.id);
    setDeleteModal(null);
    loadData();
  };

  const editCustomer = (customer) => {
    setEditingCustomer(customer);
    setNewCustomer({
      name: customer.name, phone: customer.phone, address: customer.address,
      propertyType: customer.property_type, customerType: customer.customer_type
    });
    setShowAddCustomer(true);
  };

  const handleAddJob = async () => {
    if (!newJob.customerId || !newJob.serviceType || !newJob.scheduledDate || !newJob.scheduledTime || !newJob.amount) return;
    
    if (editingJob) {
      await supabase.from('jobs').update({
        customer_id: newJob.customerId, service_type: newJob.serviceType,
        scheduled_date: newJob.scheduledDate, scheduled_time: newJob.scheduledTime,
        amount: parseFloat(newJob.amount), is_emergency: newJob.isEmergency,
        status: newJob.isEmergency ? 'urgent' : 'scheduled'
      }).eq('id', editingJob.id);
      setEditingJob(null);
    } else {
      await supabase.from('jobs').insert([{
        user_id: user.id, customer_id: newJob.customerId, service_type: newJob.serviceType,
        scheduled_date: newJob.scheduledDate, scheduled_time: newJob.scheduledTime,
        amount: parseFloat(newJob.amount), is_emergency: newJob.isEmergency,
        status: newJob.isEmergency ? 'urgent' : 'scheduled'
      }]);
      // Update customer revenue
      const cust = customers.find(c => c.id === newJob.customerId);
      if (cust) {
        await supabase.from('customers').update({
          total_revenue: (cust.total_revenue || 0) + parseFloat(newJob.amount),
          last_service: newJob.scheduledDate
        }).eq('id', newJob.customerId);
      }
    }
    setShowAddJob(false);
    setNewJob({ customerId: '', serviceType: '', scheduledDate: '', scheduledTime: '', amount: '', isEmergency: false });
    loadData();
  };

  const deleteJob = async () => {
    if (!deleteModal) return;
    await supabase.from('jobs').delete().eq('id', deleteModal.id);
    setDeleteModal(null);
    loadData();
  };

  const editJob = (job) => {
    setEditingJob(job);
    setNewJob({
      customerId: job.customer_id, serviceType: job.service_type,
      scheduledDate: job.scheduled_date, scheduledTime: job.scheduled_time,
      amount: job.amount, isEmergency: job.is_emergency || false
    });
    setShowAddJob(true);
  };

  const updateJobStatus = async (jobId, status) => {
    await supabase.from('jobs').update({ status }).eq('id', jobId);
    loadData();
  };

  const getDashboardStats = () => {
    const today = new Date().toISOString().split('T')[0];
    return {
      todayJobs: jobs.filter(j => j.scheduled_date === today).length,
      urgentJobs: jobs.filter(j => j.status === 'urgent').length,
      monthlyRevenue: jobs.filter(j => new Date(j.scheduled_date).getMonth() === new Date().getMonth())
        .reduce((sum, j) => sum + (parseFloat(j.amount) || 0), 0),
      activePlans: maintenancePlans.length
    };
  };

  const getFilteredJobs = () => {
    const today = new Date().toISOString().split('T')[0];
    if (jobFilter === 'today') return jobs.filter(j => j.scheduled_date === today);
    if (jobFilter === 'urgent') return jobs.filter(j => j.status === 'urgent');
    return jobs;
  };

  const getFilteredCustomers = () => {
    if (!customerSearch) return customers;
    const s = customerSearch.toLowerCase();
    return customers.filter(c => c.name?.toLowerCase().includes(s) || c.phone?.toLowerCase().includes(s) || c.address?.toLowerCase().includes(s));
  };

  // Loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Laadin...</p>
        </div>
      </div>
    );
  }

  // Auth screen
  if (!user) return <AuthScreen onLogin={setUser} />;

  const stats = getDashboardStats();

  return (
    <div className="min-h-screen bg-gray-50 pb-safe">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <Wrench className="w-6 h-6 sm:w-8 sm:h-8" />
            <div>
              <h1 className="text-lg sm:text-2xl font-bold">HVAC Pro CRM</h1>
              <p className="text-xs sm:text-sm text-blue-100 hidden sm:block">{user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="bg-blue-500 px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-400 flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">Logi välja</span>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-sm border-b sticky top-16 sm:top-auto z-30">
        <div className="max-w-7xl mx-auto flex gap-1 p-2 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Ülevaade', icon: TrendingUp },
            { id: 'jobs', label: 'Tööd', icon: Calendar },
            { id: 'customers', label: 'Kliendid', icon: Users },
            { id: 'plans', label: 'Paketid', icon: FileText }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition whitespace-nowrap text-sm sm:text-base ${
                activeTab === tab.id ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.substring(0, 4)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-3 sm:p-4 pb-20 sm:pb-4">
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Tere tulemast tagasi! 👋</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div onClick={() => { setJobFilter('today'); setActiveTab('jobs'); }} className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500 cursor-pointer hover:shadow-lg transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-base font-medium">Tänased Tööd</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.todayJobs}</p>
                  </div>
                  <Calendar className="w-12 h-12 text-blue-500 opacity-50" />
                </div>
                <p className="text-sm text-blue-600 mt-3 font-medium">Kliki vaatamiseks →</p>
              </div>

              <div onClick={() => { setJobFilter('urgent'); setActiveTab('jobs'); }} className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500 cursor-pointer hover:shadow-lg transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-base font-medium">Kiireloomulised</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.urgentJobs}</p>
                  </div>
                  <AlertCircle className="w-12 h-12 text-red-500 opacity-50" />
                </div>
                <p className="text-sm text-red-600 mt-3 font-medium">Kliki vaatamiseks →</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-base font-medium">Kuu Tulu</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">€{stats.monthlyRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-12 h-12 text-green-500 opacity-50" />
                </div>
              </div>

              <div onClick={() => setActiveTab('plans')} className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500 cursor-pointer hover:shadow-lg transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-base font-medium">Aktiivsed Paketid</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.activePlans}</p>
                  </div>
                  <FileText className="w-12 h-12 text-purple-500 opacity-50" />
                </div>
                <p className="text-sm text-purple-600 mt-3 font-medium">Kliki vaatamiseks →</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Kiired Toimingud</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button onClick={() => setShowAddJob(true)} className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                  <Calendar className="w-5 h-5" /> Uus Töö
                </button>
                <button onClick={() => setShowAddCustomer(true)} className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                  <Users className="w-5 h-5" /> Uus Klient
                </button>
                <button className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2">
                  <FileText className="w-5 h-5" /> Hoolduspakett
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Tänane Graafik</h3>
              <div className="space-y-3">
                {jobs.filter(j => j.scheduled_date === new Date().toISOString().split('T')[0]).map(job => {
                  const customer = customers.find(c => c.id === job.customer_id);
                  return (
                    <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-12 rounded ${job.is_emergency ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                        <div>
                          <p className="font-semibold">{customer?.name || 'Tundmatu'}</p>
                          <p className="text-sm text-gray-500">{job.service_type}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" /> {job.scheduled_time}
                          </p>
                        </div>
                      </div>
                      {job.status !== 'completed' && (
                        <button onClick={() => updateJobStatus(job.id, 'completed')} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Valmis</button>
                      )}
                    </div>
                  );
                })}
                {jobs.filter(j => j.scheduled_date === new Date().toISOString().split('T')[0]).length === 0 && (
                  <p className="text-gray-400 text-center py-8">Täna pole töid</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <div>
                <h2 className="text-2xl font-bold">Tööd</h2>
                {jobFilter !== 'all' && (
                  <p className="text-sm text-gray-500 mt-1">
                    Filter: {jobFilter === 'today' ? 'Tänased' : 'Kiired'}
                    <button onClick={() => setJobFilter('all')} className="ml-2 text-blue-600 hover:underline">Eemalda</button>
                  </p>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                {['all', 'today', 'urgent'].map(f => (
                  <button key={f} onClick={() => setJobFilter(f)} className={`px-4 py-2 rounded-lg ${jobFilter === f ? (f === 'urgent' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white') : 'bg-gray-100 text-gray-700'}`}>
                    {f === 'all' ? 'Kõik' : f === 'today' ? 'Täna' : 'Kiired'}
                  </button>
                ))}
                <button onClick={() => setShowAddJob(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg">+ Uus</button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-gray-600">Klient</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-600">Teenus</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-600">Kuupäev</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-600">Summa</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-600">Staatus</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-600">Toimingud</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredJobs().map(job => {
                    const customer = customers.find(c => c.id === job.customer_id);
                    return (
                      <tr key={job.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">{customer?.name || 'N/A'}</td>
                        <td className="p-4">{job.service_type}</td>
                        <td className="p-4">{job.scheduled_date}</td>
                        <td className="p-4">€{job.amount}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            job.status === 'completed' ? 'bg-green-100 text-green-700' :
                            job.status === 'urgent' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {job.status === 'completed' ? 'Valmis' : job.status === 'urgent' ? 'Kiire' : 'Planeeritud'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button onClick={() => editJob(job)} className="bg-blue-50 text-blue-600 px-3 py-1 rounded text-sm">Muuda</button>
                            <button onClick={() => setDeleteModal({ type: 'job', id: job.id })} className="bg-red-50 text-red-600 px-3 py-1 rounded text-sm">Kustuta</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {getFilteredJobs().length === 0 && <p className="text-center py-12 text-gray-400">Pole töid</p>}
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Kliendid</h2>
              <button onClick={() => setShowAddCustomer(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">+ Uus Klient</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customers.map(customer => (
                <div key={customer.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{customer.name}</h3>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-500">{customer.property_type}</p>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{customer.customer_type}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Kokku tulu</p>
                      <p className="text-lg font-bold text-green-600">€{customer.total_revenue || 0}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600"><Phone className="w-4 h-4" />{customer.phone}</div>
                    <div className="flex items-center gap-2 text-gray-600"><MapPin className="w-4 h-4" />{customer.address}</div>
                    {customer.last_service && <div className="flex items-center gap-2 text-gray-600"><Clock className="w-4 h-4" />Viimane: {customer.last_service}</div>}
                  </div>

                  <div className="mt-4 pt-4 border-t flex gap-2">
                    <button onClick={() => editCustomer(customer)} className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded text-sm">Muuda</button>
                    <button onClick={() => { setNewJob({ ...newJob, customerId: customer.id }); setShowAddJob(true); }} className="flex-1 bg-green-50 text-green-600 px-3 py-2 rounded text-sm">Uus Töö</button>
                    <button onClick={() => setDeleteModal({ type: 'customer', id: customer.id })} className="bg-red-50 text-red-600 px-3 py-2 rounded text-sm">Kustuta</button>
                  </div>
                </div>
              ))}
            </div>
            {customers.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400">Pole veel kliente lisatud</p>
              </div>
            )}
          </div>
        )}

        {/* Plans Tab */}
        {activeTab === 'plans' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Hoolduspaketid - Korduv Tulu 💰</h2>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-2">Miks hoolduspaketid on kuldsed?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-white bg-opacity-20 p-4 rounded-lg"><p className="text-2xl font-bold">55%</p><p className="text-sm">HVAC tööstuse tulust</p></div>
                <div className="bg-white bg-opacity-20 p-4 rounded-lg"><p className="text-2xl font-bold">8.3%</p><p className="text-sm">Aastane kasv</p></div>
                <div className="bg-white bg-opacity-20 p-4 rounded-lg"><p className="text-2xl font-bold">Stabiilne</p><p className="text-sm">Tulu aastaringselt</p></div>
              </div>
            </div>

            {maintenancePlans.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 font-semibold mb-2">Alusta hoolduspakettide müümisega!</p>
                <p className="text-gray-400 text-sm">Hoolduspaketid tagavad stabiilse tulu</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      {showAddCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">{editingCustomer ? 'Muuda Klienti' : 'Uus Klient'}</h3>
            <div className="space-y-3">
              <select value={newCustomer.customerType} onChange={(e) => setNewCustomer({...newCustomer, customerType: e.target.value})} className="w-full p-3 border rounded-lg">
                <option value="">Kliendi tüüp</option>
                <option value="Eraklient">Eraklient</option>
                <option value="Ettevõte">Ettevõte</option>
                <option value="Muu">Muu</option>
              </select>
              <input value={newCustomer.name} onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})} placeholder="Nimi" className="w-full p-3 border rounded-lg" />
              <input value={newCustomer.phone} onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})} placeholder="Telefon" className="w-full p-3 border rounded-lg" />
              <input value={newCustomer.address} onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})} placeholder="Aadress" className="w-full p-3 border rounded-lg" />
              <select value={newCustomer.propertyType} onChange={(e) => setNewCustomer({...newCustomer, propertyType: e.target.value})} className="w-full p-3 border rounded-lg">
                <option value="">Vara tüüp</option>
                <option value="Eramaja">Eramaja</option>
                <option value="Korter">Korter</option>
                <option value="Ärihoone">Ärihoone</option>
              </select>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => { setShowAddCustomer(false); setEditingCustomer(null); setNewCustomer({ name: '', phone: '', address: '', propertyType: '', customerType: '' }); }} className="flex-1 px-4 py-2 border rounded-lg">Tühista</button>
              <button onClick={handleAddCustomer} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg">{editingCustomer ? 'Salvesta' : 'Lisa'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Job Modal */}
      {showAddJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">{editingJob ? 'Muuda Tööd' : 'Uus Töö'}</h3>
            {customers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">Pole veel kliente!</p>
                <button onClick={() => { setShowAddJob(false); setShowAddCustomer(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Lisa Klient</button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <div className="relative" ref={dropdownRef}>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Klient</label>
                    <div onClick={() => setShowCustomerDropdown(true)} className="w-full p-3 border rounded-lg cursor-pointer flex justify-between items-center">
                      <span className={newJob.customerId ? 'text-gray-900' : 'text-gray-400'}>
                        {newJob.customerId ? customers.find(c => c.id === newJob.customerId)?.name : 'Vali klient'}
                      </span>
                      <Search className="w-4 h-4 text-gray-400" />
                    </div>
                    
                    {showCustomerDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-hidden">
                        <div className="p-2 border-b">
                          <input type="text" placeholder="Otsi..." value={customerSearch} onChange={(e) => setCustomerSearch(e.target.value)} className="w-full p-2 border rounded" autoFocus />
                        </div>
                        <button onClick={() => { setShowCustomerDropdown(false); setShowAddJob(false); setShowAddCustomer(true); }} className="w-full p-3 text-left text-blue-600 border-b flex items-center gap-2">
                          <Plus className="w-4 h-4" /> Lisa uus klient
                        </button>
                        <div className="max-h-40 overflow-y-auto">
                          {getFilteredCustomers().map(c => (
                            <div key={c.id} onClick={() => { setNewJob({...newJob, customerId: c.id}); setShowCustomerDropdown(false); setCustomerSearch(''); }} className="p-3 hover:bg-gray-50 cursor-pointer border-b">
                              <p className="font-semibold">{c.name}</p>
                              <p className="text-xs text-gray-500">{c.phone}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <select value={newJob.serviceType} onChange={(e) => setNewJob({...newJob, serviceType: e.target.value})} className="w-full p-3 border rounded-lg">
                    <option value="">Teenuse tüüp</option>
                    <option value="AC Hooldus">AC Hooldus</option>
                    <option value="Kütte Hooldus">Kütte Hooldus</option>
                    <option value="Paigaldus">Paigaldus</option>
                    <option value="Remont">Remont</option>
                    <option value="Hädaolukord">Hädaolukord</option>
                  </select>
                  <input type="date" value={newJob.scheduledDate} onChange={(e) => setNewJob({...newJob, scheduledDate: e.target.value})} className="w-full p-3 border rounded-lg" />
                  <input type="time" value={newJob.scheduledTime} onChange={(e) => setNewJob({...newJob, scheduledTime: e.target.value})} className="w-full p-3 border rounded-lg" />
                  <input type="number" value={newJob.amount} onChange={(e) => setNewJob({...newJob, amount: e.target.value})} placeholder="Summa (€)" className="w-full p-3 border rounded-lg" />
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={newJob.isEmergency} onChange={(e) => setNewJob({...newJob, isEmergency: e.target.checked})} className="w-4 h-4" />
                    <span className="text-sm">Kiireloomuline</span>
                  </label>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => { setShowAddJob(false); setEditingJob(null); setNewJob({ customerId: '', serviceType: '', scheduledDate: '', scheduledTime: '', amount: '', isEmergency: false }); }} className="flex-1 px-4 py-2 border rounded-lg">Tühista</button>
                  <button onClick={handleAddJob} disabled={!newJob.customerId || !newJob.serviceType || !newJob.scheduledDate || !newJob.scheduledTime || !newJob.amount} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300">{editingJob ? 'Salvesta' : 'Lisa'}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <DeleteModal
          text={`Kas oled kindel, et soovid selle ${deleteModal.type === 'customer' ? 'kliendi' : 'töö'} kustutada?`}
          onConfirm={deleteModal.type === 'customer' ? deleteCustomer : deleteJob}
          onCancel={() => setDeleteModal(null)}
        />
      )}
    </div>
  );
}

