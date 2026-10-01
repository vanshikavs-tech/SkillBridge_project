import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  Users,
  Code,
  Palette,
  Brain,
  Smartphone,
  Server,
  FileText,
} from 'lucide-react';
import { projectService } from '../../services/projectService';
import { userService } from '../../services/userService';
import { ProjectCard } from '../../components/ProjectCard';
import { FreelancerCard } from '../../components/FreelancerCard';
import { Button } from '../../components/Button';
import { Loader } from '../../components/Loader';

export const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [featuredFreelancers, setFeaturedFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, freeRes] = await Promise.all([
          projectService.getProjects({ limit: 4 }),
          userService.getFreelancers({ limit: 4 }),
        ]);
        setFeaturedProjects(projRes.projects || []);
        setFeaturedFreelancers(freeRes.freelancers || []);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/browse');
    }
  };

  const categories = [
    { name: 'Web Development', icon: Code, count: '1,420+ jobs' },
    { name: 'UI/UX Design', icon: Palette, count: '890+ jobs' },
    { name: 'Data Science & AI', icon: Brain, count: '650+ jobs' },
    { name: 'Mobile Apps', icon: Smartphone, count: '740+ jobs' },
    { name: 'DevOps & Cloud', icon: Server, count: '410+ jobs' },
    { name: 'Content & Writing', icon: FileText, count: '520+ jobs' },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/60 via-white to-slate-50 pt-16 pb-20 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-700 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Driven Freelancer Matching & Milestone Escrow</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            Find the right freelancer for your next big project.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            SkillBridge bridges visionary clients with expert freelancers. Post projects, receive competitive proposals, collaborate in real time, and release milestone payments safely.
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-8 max-w-2xl mx-auto flex items-center gap-2 bg-white p-2 rounded-2xl shadow-xl shadow-brand-500/10 border border-slate-200"
          >
            <div className="flex-1 flex items-center pl-3 gap-2">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by skill (e.g. React, Node.js, UI/UX, Python)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
              />
            </div>
            <Button type="submit" size="md">
              Search Jobs
            </Button>
          </form>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/freelancers">
              <Button size="lg" variant="primary">
                Find Talent
              </Button>
            </Link>
            <Link to="/browse">
              <Button size="lg" variant="outline">
                Find Work
              </Button>
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="bg-white/80 p-4 rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="block text-2xl font-black text-slate-900">12,400+</span>
              <span className="text-xs text-slate-500 font-medium">Verified Freelancers</span>
            </div>
            <div className="bg-white/80 p-4 rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="block text-2xl font-black text-slate-900">6,480+</span>
              <span className="text-xs text-slate-500 font-medium">Projects Delivered</span>
            </div>
            <div className="bg-white/80 p-4 rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="block text-2xl font-black text-emerald-600">99.4%</span>
              <span className="text-xs text-slate-500 font-medium">Milestone Satisfaction</span>
            </div>
            <div className="bg-white/80 p-4 rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="block text-2xl font-black text-brand-600">₹18.4L+</span>
              <span className="text-xs text-slate-500 font-medium">Contract Payouts</span>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Popular Categories</h2>
            <p className="text-sm text-slate-500">Explore in-demand tech and creative disciplines</p>
          </div>
          <Link to="/browse" className="text-sm font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1">
            All categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link
                key={idx}
                to={`/browse?category=${encodeURIComponent(cat.name)}`}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-brand-400 hover:shadow-md transition text-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{cat.name}</h4>
                <p className="text-2xs text-slate-400">{cat.count}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Latest Open Projects</h2>
            <p className="text-sm text-slate-500">High-priority client contracts ready for bids</p>
          </div>
          <Link to="/browse" className="text-sm font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1">
            Browse all jobs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </section>

      {/* Top Rated Freelancers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Featured Freelancers</h2>
            <p className="text-sm text-slate-500">Top-rated engineers, designers, and AI architects</p>
          </div>
          <Link to="/freelancers" className="text-sm font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1">
            View all talent <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredFreelancers.map((freelancer) => (
              <FreelancerCard key={freelancer._id} freelancer={freelancer} />
            ))}
          </div>
        )}
      </section>

      {/* Trust & Guarantee Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-900 to-indigo-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-brand-300 font-bold uppercase tracking-wider text-xs">
              Safe & Secure Marketplace
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold">
              Build your next milestone with complete peace of mind.
            </h3>
            <p className="text-sm text-indigo-100 leading-relaxed">
              Funds are held in secure escrow per milestone and only released when you approve the deliverables. Chat in real-time, inspect code commits, and leave transparent reviews.
            </p>
          </div>
          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <Link to="/register">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-bold">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
