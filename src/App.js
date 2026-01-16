import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Calendar, MapPin, Phone, DollarSign, Clock, AlertCircle,
  Users, FileText, TrendingUp, Wrench, Search, Plus,
  LogIn, LogOut, Mail, Lock, Eye, EyeOff
} from 'lucide-react';

/* ================= SUPABASE ================= */
const SUPABASE_URL = 'https://xqelbfpgfmvqijgojszk.supabase.co';
const SUPABASE_KEY = 'sb_publishable_qk8WuaN1x4EqzNacL5_J3w_7aDW2paF';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/* ================= AUTH SCREEN ================= */
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
        if (error) throw error;
        if (data.user) onLogin(data.user);
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setError('Account created. Please confirm your email.');
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-blue-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-center gap-3">
            <Wrench className="w-10 h-10" />
            <div className="text-center">
              <h1 className="text-2xl font-bold">HVAC Pro CRM</h1>
              <p className="text-sm text-blue-100">Simple. Powerful. Useful.</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-b-xl shadow">
          <h2 className="text-xl font-bold text-center mb-6">
            {isLogin ? 'Sign in' : 'Create account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 p-3 border rounded-lg"
                  placeholder="you@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 p-3 border rounded-lg"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400">
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded flex gap-2 text-sm">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}

            <button className="w-full bg-blue-600 text-white p-3 rounded-lg">
              {loading ? 'Please wait…' : isLogin ? 'Sign in' : 'Register'}
            </button>
          </form>

          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="mt-4 text-blue-600 text-sm block text-center"
          >
            {isLogin ? 'No account? Register' : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= MAIN APP ================= */
export default function HVACSimpleCRM() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [customers, setCustomers] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
  }, []);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    const { data: c } = await supabase.from('customers').select('*');
    const { data: j } = await supabase.from('jobs').select('*');
    setCustomers(c || []);
    setJobs(j || []);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  }

  if (!user) return <AuthScreen onLogin={setUser} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4 flex justify-between">
        <div className="flex items-center gap-2">
          <Wrench />
          <div>
            <h1 className="font-bold">HVAC Pro CRM</h1>
            <p className="text-xs">{user.email}</p>
          </div>
        </div>
        <button onClick={logout} className="flex items-center gap-2">
          <LogOut /> Logout
        </button>
      </header>

      <main className="p-4">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-500">Total customers</p>
            <p className="text-3xl font-bold">{customers.length}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-500">Total jobs</p>
            <p className="text-3xl font-bold">{jobs.length}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-500">Monthly revenue</p>
            <p className="text-3xl font-bold">
              €{jobs.reduce((s, j) => s + (j.amount || 0), 0)}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}


