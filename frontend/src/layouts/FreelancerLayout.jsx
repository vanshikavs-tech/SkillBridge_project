import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Compass, Send, Briefcase, IndianRupee } from 'lucide-react';

export const FreelancerLayout = () => {
  const links = [
    { to: '/freelancer/dashboard', label: 'My Hub', icon: LayoutDashboard },
    { to: '/browse', label: 'Browse Jobs', icon: Compass },
    { to: '/freelancer/my-proposals', label: 'My Proposals', icon: Send },
    { to: '/freelancer/contracts', label: 'Active Contracts', icon: Briefcase },
    { to: '/freelancer/earnings', label: 'Earnings & Payouts', icon: IndianRupee },
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
              end={link.to === '/freelancer/dashboard'}
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
