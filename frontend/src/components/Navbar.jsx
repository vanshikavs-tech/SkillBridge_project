import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Briefcase,
  Search,
  Bell,
  MessageSquare,
  User,
  LogOut,
  PlusCircle,
  Menu,
  X,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../store/authStore';
import { useNotification } from '../store/notificationStore';
import { Button } from './Button';

export const Navbar = () => {
  const { user, isAuthenticated, logout, isClient, isFreelancer, isAdmin } = useAuth();
  const { notifications, unreadCount, markAllAsRead } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-brand-600 transition">
                Skill<span className="text-brand-600">Bridge</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {/* Public Links */}
              <Link
                to="/browse"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  isActive('/browse')
                    ? 'text-brand-600 bg-brand-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Browse Projects
              </Link>
              <Link
                to="/freelancers"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  isActive('/freelancers')
                    ? 'text-brand-600 bg-brand-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Find Talent
              </Link>

              {/* Role-Specific Shortcuts */}
              {isClient && (
                <>
                  <Link
                    to="/client/dashboard"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      isActive('/client/dashboard')
                        ? 'text-brand-600 bg-brand-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/client/my-projects"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      isActive('/client/my-projects')
                        ? 'text-brand-600 bg-brand-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    My Projects
                  </Link>
                  <Link
                    to="/client/contracts"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      isActive('/client/contracts')
                        ? 'text-brand-600 bg-brand-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Contracts
                  </Link>
                </>
              )}

              {isFreelancer && (
                <>
                  <Link
                    to="/freelancer/dashboard"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      isActive('/freelancer/dashboard')
                        ? 'text-brand-600 bg-brand-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    My Dashboard
                  </Link>
                  <Link
                    to="/freelancer/my-proposals"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      isActive('/freelancer/my-proposals')
                        ? 'text-brand-600 bg-brand-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    My Proposals
                  </Link>
                  <Link
                    to="/freelancer/earnings"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      isActive('/freelancer/earnings')
                        ? 'text-brand-600 bg-brand-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Earnings
                  </Link>
                </>
              )}

              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 ${
                    isActive('/admin/dashboard')
                      ? 'text-purple-600 bg-purple-50'
                      : 'text-purple-700 hover:bg-purple-50'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Admin Panel
                </Link>
              )}
            </nav>
          </div>

          {/* Right Action Icons & User Menu */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Client Quick Post Button */}
                {isClient && (
                  <Link to="/client/post-project" className="hidden sm:inline-flex">
                    <Button size="sm" variant="primary">
                      <PlusCircle className="w-4 h-4 mr-1.5" />
                      Post Project
                    </Button>
                  </Link>
                )}

                {/* Messages Link */}
                <Link
                  to="/messages"
                  className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition relative"
                  title="Messages"
                >
                  <MessageSquare className="w-5 h-5" />
                </Link>

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotificationsOpen(!notificationsOpen);
                      if (!notificationsOpen) markAllAsRead();
                    }}
                    className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition relative"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Popover */}
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                        <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
                        <span className="text-xs text-slate-400">Real-time alerts</span>
                      </div>
                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-xs text-slate-400">
                            No notifications yet.
                          </div>
                        ) : (
                          notifications.slice(0, 8).map((notif, i) => (
                            <div key={i} className="p-3 hover:bg-slate-50 transition text-xs">
                              <p className="font-semibold text-slate-800">{notif.title}</p>
                              <p className="text-slate-600 mt-0.5">{notif.message}</p>
                              <span className="text-2xs text-slate-400 mt-1 block">Just now</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Avatar & Menu */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-slate-100 transition border border-transparent hover:border-slate-200"
                  >
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/30"
                    />
                    <span className="hidden lg:block text-xs font-semibold text-slate-700">
                      {user?.name?.split(' ')[0]}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-50 text-brand-700">
                          {user?.role}
                        </span>
                      </div>

                      <div className="py-1">
                        <Link
                          to={`/profile/${user?._id}`}
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          View Profile
                        </Link>
                        <Link
                          to="/profile/edit"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <Layers className="w-4 h-4 text-slate-400" />
                          Edit Profile & Skills
                        </Link>
                        <Link
                          to="/payments/transactions"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <Sparkles className="w-4 h-4 text-slate-400" />
                          Transactions & Billing
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/browse"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Browse Projects
          </Link>
          <Link
            to="/freelancers"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Find Talent
          </Link>
          {isClient && (
            <>
              <Link
                to="/client/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Client Dashboard
              </Link>
              <Link
                to="/client/post-project"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-brand-600 hover:bg-brand-50"
              >
                + Post a Project
              </Link>
            </>
          )}
          {isFreelancer && (
            <>
              <Link
                to="/freelancer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Freelancer Dashboard
              </Link>
              <Link
                to="/freelancer/my-proposals"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                My Proposals
              </Link>
            </>
          )}
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-bold text-purple-700 bg-purple-50"
            >
              Admin Control Panel
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
