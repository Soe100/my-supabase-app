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
          if (error.message.includes('Invalid login')) throw new Error('Invalid email or password');
          throw error;
        }
        if (data.user) onLogin(data.user);
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.user && !data.session) {
          setError('Account created! Check your email for confirmation.');
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
              <p className="text-sm text-blue-100">Simple. Powerful. Useful.</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white p-6 rounded-b-xl shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
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
                  {isLogin ? 'Sign In' : 'Register'}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-blue-600 hover:underline text-sm"
            >
              {isLogin ? "Don't have an account? Register" : 'Already have an account? Sign In'}
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
        <h3 className="text-lg font-bold mb-2">Confirm Delete</h3>
        <p className="text-gray-600 mb-4">{text}</p>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
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
          <p className="text-gray-600">Loading...</p>
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
            <span className="hidden sm:inline text-sm">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-sm border-b sticky top-16 sm:top-auto z-30">
        <div className="max-w-7xl mx-auto flex gap-1 p-2 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
            { id: 'jobs', label: 'Jobs', icon: Calendar },
            { id: 'customers', label: 'Customers', icon: Users },
            { id: 'plans', label: 'Plans', icon: FileText }
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
            <h2 className="text-2xl font-bold text-gray-800">Welcome back! 👋</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div onClick={() => { setJobFilter('today'); setActiveTab('jobs'); }} className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500 cursor-pointer hover:shadow-lg transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-base font-medium">Today's Jobs</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.todayJobs}</p>
                  </div>
                  <Calendar className="w-12 h-12 text-blue-500 opacity-50" />
                </div>
                <p className="text-sm text-blue-600 mt-3 font-medium">Click to view →</p>
              </div>

              <div onClick={() => { setJobFilter('urgent'); setActiveTab('jobs'); }} className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500 cursor-pointer hover:shadow-lg transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-base font-medium">Urgent</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.urgentJobs}</p>
                  </div>
                  <AlertCircle className="w-12 h-12 text-red-500 opacity-50" />
                </div>
                <p className="text-sm text-red-600 mt-3 font-medium">Click to view →</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-base font-medium">Monthly Revenue</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">${stats.monthlyRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-12 h-12 text-green-500 opacity-50" />
                </div>
              </div>

              <div onClick={() => setActiveTab('plans')} className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500 cursor-pointer hover:shadow-lg transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-base font-medium">Active Plans</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.activePlans}</p>
                  </div>
                  <FileText className="w-12 h-12 text-purple-500 opacity-50" />
                </div>
                <p className="text-sm text-purple-600 mt-3 font-medium">Click to view →</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button onClick={() => setShowAddJob(true)} className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                  <Calendar className="w-5 h-5" /> New Job
                </button>
                <button onClick={() => setShowAddCustomer(true)} className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                  <Users className="w-5 h-5" /> New Customer
                </button>
                <button className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2">
                  <FileText className="w-5 h-5" /> Maintenance Plan
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Today's Schedule</h3>
              <div className="space-y-3">
                {jobs.filter(j => j.scheduled_date === new Date().toISOString().split('T')[0]).map(job => {
                  const customer = customers.find(c => c.id === job.customer_id);
                  return (
                    <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-12 rounded ${job.is_emergency ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                        <div>
                          <p className="font-semibold">{customer?.name || 'Unknown'}</p>
                          <p className="text-sm text-gray-500">{job.service_type}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" /> {job.scheduled_time}
                          </p>
                        </div>
                      </div>
                      {job.status !== 'completed' && (
                        <button onClick={() => updateJobStatus(job.id, 'completed')} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Done</button>
                      )}
                    </div>
                  );
                })}
                {jobs.filter(j => j.scheduled_date === new Date().toISOString().split('T')[0]).length === 0 && (
                  <p className="text-gray-400 text-center py-8">No jobs scheduled for today</p>
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
                <h2 className="text-2xl font-bold">Jobs</h2>
                {jobFilter !== 'all' && (
                  <p className="text-sm text-gray-500 mt-1">
                    Filter: {jobFilter === 'today' ? 'Today' : 'Urgent'}
                    <button onClick={() => setJobFilter('all')} className="ml-2 text-blue-600 hover:underline">Remove</button>
                  </p>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                {['all', 'today', 'urgent'].map(f => (
                  <button key={f} onClick={() => setJobFilter(f)} className={`px-4 py-2 rounded-lg ${jobFilter === f ? (f === 'urgent' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white') : 'bg-gray-100 text-gray-700'}`}>
                    {f === 'all' ? 'All' : f === 'today' ? 'Today' : 'Urgent'}
                  </button>
                ))}
                <button onClick={() => setShowAddJob(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg">+ New</button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-gray-600">Customer</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-600">Service</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-600">Date</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-600">Amount</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-600">Status</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-600">Actions</th>
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
                        <td className="p-4">${job.amount}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            job.status === 'completed' ? 'bg-green-100 text-green-700' :
                            job.status === 'urgent' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {job.status === 'completed' ? 'Done' : job.status === 'urgent' ? 'Urgent' : 'Scheduled'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button onClick={() => editJob(job)} className="bg-blue-50 text-blue-600 px-3 py-1 rounded text-sm">Edit</button>
                            <button onClick={() => setDeleteModal({ type: 'job', id: job.id })} className="bg-red-50 text-red-600 px-3 py-1 rounded text-sm">Delete</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {getFilteredJobs().length === 0 && <p className="text-center py-12 text-gray-400">No jobs found</p>}
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Customers</h2>
              <button onClick={() => setShowAddCustomer(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">+ New Customer</button>
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
                      <p className="text-xs text-gray-400">Total Revenue</p>
                      <p className="text-lg font-bold text-green-600">${customer.total_revenue || 0}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600"><Phone className="w-4 h-4" />{customer.phone}</div>
                    <div className="flex items-center gap-2 text-gray-600"><MapPin className="w-4 h-4" />{customer.address}</div>
                    {customer.last_service && <div className="flex items-center gap-2 text-gray-600"><Clock className="w-4 h-4" />Last service: {customer.last_service}</div>}
                  </div>

                  <div className="mt-4 pt-4 border-t flex gap-2">
                    <button onClick={() => editCustomer(customer)} className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded text-sm">Edit</button>
                    <button onClick={() => { setNewJob({ ...newJob, customerId: customer.id }); setShowAddJob(true); }} className="flex-1 bg-green-50 text-green-600 px-3 py-2 rounded text-sm">New Job</button>
                    <button onClick={() => setDeleteModal({ type: 'customer', id: customer.id })} className="bg-red-50 text-red-600 px-3 py-2 rounded text-sm">Delete</button>
                  </div>
                </div>
              ))}
            </div>
            {customers.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400">No customers added yet</p>
              </div>
            )}
          </div>
        )}

        {/* Plans Tab */}
        {activeTab === 'plans' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Maintenance Plans - Recurring Revenue 💰</h2>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-2">Why maintenance plans are golden?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-white bg-opacity-20 p-4 rounded-lg"><p className="text-2xl font-bold">55%</p><p className="text-sm">of HVAC industry revenue</p></div>
                <div className="bg-white bg-opacity-20 p-4 rounded-lg"><p className="text-2xl font-bold">8.3%</p><p className="text-sm">Annual growth</p></div>
                <div className="bg-white bg-opacity-20 p-4 rounded-lg"><p className="text-2xl font-bold">Stable</p><p className="text-sm">Year-round income</p></div>
              </div>
            </div>

            {maintenancePlans.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 font-semibold mb-2">Start selling maintenance plans!</p>
                <p className="text-gray-400 text-sm">Maintenance plans ensure stable revenue</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      {showAddCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">{editingCustomer ? 'Edit Customer' : 'New Customer'}</h3>
            <div className="space-y-3">
              <select value={newCustomer.customerType} onChange={(e) => setNewCustomer({...newCustomer, customerType: e.target.value})} className="w-full p-3 border rounded-lg">
                <option value="">Customer Type</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Other">Other</option>
              </select>
              <input value={newCustomer.name} onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})} placeholder="Name" className="w-full p-3 border rounded-lg" />
              <input value={newCustomer.phone} onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})} placeholder="Phone" className="w-full p-3 border rounded-lg" />
              <input value={newCustomer.address} onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})} placeholder="Address" className="w-full p-3 border rounded-lg" />
              <select value={newCustomer.propertyType} onChange={(e) => setNewCustomer({...newCustomer, propertyType: e.target.value})} className="w-full p-3 border rounded-lg">
                <option value="">Property Type</option>
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Office">Office</option>
              </select>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => { setShowAddCustomer(false); setEditingCustomer(null); setNewCustomer({ name: '', phone: '', address: '', propertyType: '', customerType: '' }); }} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={handleAddCustomer} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg">{editingCustomer ? 'Save' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Job Modal */}
      {showAddJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">{editingJob ? 'Edit Job' : 'New Job'}</h3>
            {customers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No customers yet!</p>
                <button onClick={() => { setShowAddJob(false); setShowAddCustomer(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Add Customer</button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <div className="relative" ref={dropdownRef}>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Customer</label>
                    <div onClick={() => setShowCustomerDropdown(true)} className="w-full p-3 border rounded-lg cursor-pointer flex justify-between items-center">
                      <span className={newJob.customerId ? 'text-gray-900' : 'text-gray-400'}>
                        {newJob.customerId ? customers.find(c => c.id === newJob.customerId)?.name : 'Select customer'}
                      </span>
                      <Search className="w-4 h-4 text-gray-400" />
                    </div>
                    
                    {showCustomerDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-hidden">
                        <div className="p-2 border-b">
                          <input type="text" placeholder="Search..." value={customerSearch} onChange={(e) => setCustomerSearch(e.target.value)} className="w-full p-2 border rounded" autoFocus />
                        </div>
                        <button onClick={() => { setShowCustomerDropdown(false); setShowAddJob(false); setShowAddCustomer(true); }} className="w-full p-3 text-left text-blue-600 border-b flex items-center gap-2">
                          <Plus className="w-4 h-4" /> Add new customer
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
                    <option value="">Service Type</option>
                    <option value="AC Maintenance">AC Maintenance</option>
                    <option value="Heating Maintenance">Heating Maintenance</option>
                    <option value="Installation">Installation</option>
                    <option value="Repair">Repair</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                  <input type="date" value={newJob.scheduledDate} onChange={(e) => setNewJob({...newJob, scheduledDate: e.target.value})} className="w-full p-3 border rounded-lg" />
                  <input type="time" value={newJob.scheduledTime} onChange={(e) => setNewJob({...newJob, scheduledTime: e.target.value})} className="w-full p-3 border rounded-lg" />
                  <input type="number" value={newJob.amount} onChange={(e) => setNewJob({...newJob, amount: e.target.value})} placeholder="Amount ($)" className="w-full p-3 border rounded-lg" />
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={newJob.isEmergency} onChange={(e) => setNewJob({...newJob, isEmergency: e.target.checked})} className="w-4 h-4" />
                    <span className="text-sm">Emergency</span>
                  </label>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => { setShowAddJob(false); setEditingJob(null); setNewJob({ customerId: '', serviceType: '', scheduledDate: '', scheduledTime: '', amount: '', isEmergency: false }); }} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                  <button onClick={handleAddJob} disabled={!newJob.customerId || !newJob.serviceType || !newJob.scheduledDate || !newJob.scheduledTime || !newJob.amount} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300">{editingJob ? 'Save' : 'Add'}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <DeleteModal
          text={`Are you sure you want to delete this ${deleteModal.type === 'customer' ? 'customer' : 'job'}?`}
          onConfirm={deleteModal.type === 'customer' ? deleteCustomer : deleteJob}
          onCancel={() => setDeleteModal(null)}
        />
      )}
    </div>
  );
}