import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/Button';
import API from '../../services/api';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ success: false, message: '', resetToken: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ success: false, message: '', resetToken: '' });

    try {
      const res = await API.post('/auth/forgot-password', { email });
      setStatus({
        success: true,
        message: res.data.message || 'Reset instructions sent to your email.',
        resetToken: res.data.resetToken,
      });
    } catch (err) {
      setStatus({
        success: false,
        message: err.response?.data?.message || 'Error requesting password reset.',
        resetToken: '',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-200/80 space-y-6">
        <div>
          <Link
            to="/login"
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-medium mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
          </Link>
          <h2 className="text-2xl font-black text-slate-900">Reset your password</h2>
          <p className="mt-1 text-xs text-slate-500">
            Enter your account email to receive reset code instructions.
          </p>
        </div>

        {status.message && (
          <div
            className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
              status.success
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {status.success ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            )}
            <div>
              <p>{status.message}</p>
              {status.resetToken && (
                <p className="mt-1 font-mono font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded">
                  Demo Code: {status.resetToken}
                </p>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Account Email
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

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Sending code...' : 'Send Reset Instructions'}
          </Button>
        </form>
      </div>
    </div>
  );
};
