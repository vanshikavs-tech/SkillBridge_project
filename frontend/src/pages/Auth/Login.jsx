import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../store/authStore';
import { Button } from '../../components/Button';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login({ email, password });
      // Redirect based on role
      const role = res.user?.role;
      if (role === 'CLIENT') navigate('/client/dashboard');
      else if (role === 'FREELANCER') navigate('/freelancer/dashboard');
      else if (role === 'ADMIN') navigate('/admin/dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Demo auto-fill helper
  const handleQuickLogin = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-200/80">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center text-white mx-auto shadow-md shadow-brand-500/20 mb-3">
            <Briefcase className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Sign in to SkillBridge
          </h2>
          <p className="mt-2 text-xs text-slate-500">
            Welcome back! Select a 1-click demo role or enter your credentials.
          </p>
        </div>

        {/* 1-Click Demo Logins for Instant Testing */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 text-center">
            ⚡ 1-Click Demo Profiles (Prefilled)
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('client@skillbridge.com', 'Client')}
              className="text-2xs font-semibold py-1.5 px-2 rounded-lg bg-white border border-slate-200 hover:border-brand-500 hover:text-brand-600 transition shadow-2xs text-center"
            >
              👔 Client
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('freelancer@skillbridge.com', 'Freelancer')}
              className="text-2xs font-semibold py-1.5 px-2 rounded-lg bg-white border border-slate-200 hover:border-brand-500 hover:text-brand-600 transition shadow-2xs text-center"
            >
              💻 Freelancer
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@skillbridge.com', 'Admin')}
              className="text-2xs font-semibold py-1.5 px-2 rounded-lg bg-white border border-slate-200 hover:border-purple-500 hover:text-purple-600 transition shadow-2xs text-center"
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-brand-600 hover:text-brand-800 font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="md"
            disabled={loading}
            className="w-full font-bold shadow-md"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-brand-600 hover:text-brand-800">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};
