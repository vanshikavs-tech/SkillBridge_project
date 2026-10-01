import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { BarChart3, Users, FolderCheck, CreditCard, Shield } from 'lucide-react';

export const AdminLayout = () => {
  const links = [
    { to: '/admin/dashboard', label: 'Platform Analytics', icon: BarChart3 },
    { to: '/admin/users', label: 'Manage Users', icon: Users },
    { to: '/admin/projects', label: 'Moderate Projects', icon: FolderCheck },
    { to: '/payments/transactions', label: 'Transaction Audit', icon: CreditCard },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Admin header */}
      <div className="flex items-center gap-3 mb-6 bg-purple-900 text-white p-4 rounded-2xl shadow-md">
        <div className="p-2.5 bg-purple-800 rounded-xl">
          <Shield className="w-6 h-6 text-purple-200" />
        </div>
        <div>
          <h2 className="text-lg font-bold">SkillBridge Administrator Portal</h2>
          <p className="text-xs text-purple-200">
            System moderation, user compliance status, platform revenues, and performance analytics.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-8 overflow-x-auto">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-purple-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {link.label}
            </NavLink>
          );
        })}
      </div>

      <Outlet />
    </div>
  );
};
