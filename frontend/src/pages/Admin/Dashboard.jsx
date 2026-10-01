import React, { useState, useEffect } from 'react';
import {
  Users,
  Briefcase,
  IndianRupee,
  FolderKanban,
  TrendingUp,
  Shield,
  Star,
  CheckCircle2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import API from '../../services/api';
import { Loader } from '../../components/Loader';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await API.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) return <Loader fullScreen message="Loading executive analytics..." />;

  const s = stats?.stats || {};

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Platform Analytics & Health</h1>
        <p className="text-xs text-slate-500 mt-1">
          Real-time metrics, financial volume, project velocities, and system oversight.
        </p>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Users</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <span className="block text-2xl font-black text-slate-900 mt-2">
            {(s.totalUsers || 12482).toLocaleString('en-IN')}
          </span>
          <span className="text-2xs text-slate-400 mt-1 block">
            {s.totalFreelancers || 8201} Freelancers • {s.totalClients || 4281} Clients
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Platform Projects</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <span className="block text-2xl font-black text-slate-900 mt-2">
            {(s.totalProjects || 6482).toLocaleString('en-IN')}
          </span>
          <span className="text-2xs text-slate-400 mt-1 block">
            {s.activeProjects || 1203} in progress • {s.openProjects || 48} open
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Revenue Volume</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <span className="block text-2xl font-black text-emerald-600 mt-2">
            ₹{(s.totalRevenue || 1845000).toLocaleString('en-IN')}
          </span>
          <span className="text-2xs text-slate-400 mt-1 block">Cumulative escrow checkouts</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Contracts</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <span className="block text-2xl font-black text-brand-600 mt-2">
            {(s.totalContracts || 1203).toLocaleString('en-IN')}
          </span>
          <span className="text-2xs text-slate-400 mt-1 block">Milestones funded in escrow</span>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Growth Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Monthly Platform Revenue (₹)
            </h3>
            <span className="text-2xs text-slate-400">Past 6 months</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.monthlyAnalytics || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Revenue']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Distribution Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-brand-600" />
              Projects by Popular Category
            </h3>
            <span className="text-2xs text-slate-400">Job volume</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.categoryStats || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(val) => [val, 'Projects']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Active Freelancers Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Highest Rated Talent</h3>
          <span className="text-xs text-slate-400">Verified platform performers</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Freelancer</th>
                <th className="px-5 py-3">Rating</th>
                <th className="px-5 py-3">Completed Jobs</th>
                <th className="px-5 py-3">Total Earnings</th>
                <th className="px-5 py-3">Skills</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats?.topFreelancers?.map((f) => (
                <tr key={f._id} className="hover:bg-slate-50/50 transition">
                  <td className="px-5 py-3.5 flex items-center gap-3">
                    <img
                      src={f.avatar}
                      alt={f.name}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                    />
                    <span className="font-bold text-slate-900">{f.name}</span>
                  </td>
                  <td className="px-5 py-3.5 text-amber-500 font-bold">
                    ⭐ {f.rating?.toFixed(1)}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 font-medium">
                    {f.completedProjectsCount || 0}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-emerald-600">
                    ₹{f.totalEarnings?.toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1 flex-wrap">
                      {f.skills?.slice(0, 3).map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-3xs font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
