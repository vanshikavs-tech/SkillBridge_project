import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, FolderKanban, FileText, CreditCard } from 'lucide-react';

export const ClientLayout = () => {
  const links = [
    { to: '/client/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/client/post-project', label: 'Post Project', icon: PlusCircle },
    { to: '/client/my-projects', label: 'My Projects', icon: FolderKanban },
    { to: '/client/contracts', label: 'Contracts & Milestones', icon: FileText },
    { to: '/payments/transactions', label: 'Billing & Escrow', icon: CreditCard },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Sub-header navigation tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-8 overflow-x-auto">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/client/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20'
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
