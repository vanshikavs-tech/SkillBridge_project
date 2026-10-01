import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Heart, Github, Shield, Terminal } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-auto bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Skill<span className="text-brand-400">Bridge</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full-stack MERN freelance marketplace connecting top clients with exceptional freelancers worldwide. Built with modern architecture, real-time WebSockets, and smart talent matching.
            </p>
          </div>

          {/* For Clients */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              For Clients
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/freelancers" className="hover:text-white transition">
                  Find Freelancers
                </Link>
              </li>
              <li>
                <Link to="/client/post-project" className="hover:text-white transition">
                  Post a Project
                </Link>
              </li>
              <li>
                <Link to="/client/dashboard" className="hover:text-white transition">
                  Client Dashboard
                </Link>
              </li>
              <li>
                <Link to="/payments/transactions" className="hover:text-white transition">
                  Escrow & Milestone Payments
                </Link>
              </li>
            </ul>
          </div>

          {/* For Freelancers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              For Freelancers
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/browse" className="hover:text-white transition">
                  Browse All Projects
                </Link>
              </li>
              <li>
                <Link to="/freelancer/dashboard" className="hover:text-white transition">
                  Freelancer Hub & Matches
                </Link>
              </li>
              <li>
                <Link to="/freelancer/earnings" className="hover:text-white transition">
                  Earnings & Payouts
                </Link>
              </li>
              <li>
                <Link to="/profile/edit" className="hover:text-white transition">
                  Profile & Portfolio Setup
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology & Portfolio */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Architecture & Stack
            </h4>
            <div className="flex flex-wrap gap-1.5 text-[11px] mb-3">
              <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded">React 18</span>
              <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded">Node.js</span>
              <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded">Express</span>
              <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded">MongoDB</span>
              <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded">Socket.IO</span>
              <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded">Stripe API</span>
              <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded">Tailwind CSS</span>
            </div>
            <p className="text-2xs text-slate-500">
              Run <code className="text-brand-300 bg-slate-800 px-1 py-0.5 rounded">CONCEPTS.cmd</code> in terminal for interactive architecture review.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SkillBridge Marketplace. Built for high-performance portfolio.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <Shield className="w-3.5 h-3.5 text-brand-400" />
              Role-Based Access Protected
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
