import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  IndianRupee,
  Briefcase,
  Star,
  Sparkles,
  Send,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import { projectService } from '../../services/projectService';
import { contractService } from '../../services/contractService';
import { useAuth } from '../../store/authStore';
import { ProjectCard } from '../../components/ProjectCard';
import { Button } from '../../components/Button';
import { Loader } from '../../components/Loader';

export const FreelancerDashboard = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recRes, contRes] = await Promise.all([
          projectService.getRecommendedProjects(),
          contractService.getContracts(),
        ]);
        setRecommendations(recRes.recommendations || []);
        setContracts(contRes.contracts || []);
      } catch (err) {
        console.error('Failed to load freelancer dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const activeContracts = contracts.filter((c) => c.status === 'ACTIVE');

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Freelancer Hub
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Welcome, {user?.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Here are projects matched to your skills, active contracts, and lifetime earnings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/browse">
            <Button size="md" variant="primary">
              <Send className="w-4 h-4 mr-2" />
              Browse Open Jobs
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Earnings</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <span className="block text-2xl font-black text-emerald-600 mt-2">
            ₹{(user?.totalEarnings || 215000).toLocaleString('en-IN')}
          </span>
          <span className="text-2xs text-slate-400 mt-1 block">Paid to bank / wallet</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Contracts</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <span className="block text-2xl font-black text-slate-900 mt-2">
            {activeContracts.length}
          </span>
          <span className="text-2xs text-slate-400 mt-1 block">In progress</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Client Rating</span>
            <div className="p-2 bg-amber-50 text-amber-500 rounded-lg">
              <Star className="w-4 h-4 fill-current" />
            </div>
          </div>
          <span className="block text-2xl font-black text-slate-900 mt-2">
            ⭐ {user?.rating?.toFixed(1) || '4.9'}
          </span>
          <span className="text-2xs text-slate-400 mt-1 block">
            {user?.totalReviews || 24} reviews
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Hourly Rate</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="block text-2xl font-black text-slate-900 mt-2">
            ₹{user?.hourlyRate || 1500}/hr
          </span>
          <span className="text-2xs text-slate-400 mt-1 block">Base consulting rate</span>
        </div>
      </div>

      {/* AI Recommended Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-200">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recommended Projects For You</h3>
              <p className="text-xs text-slate-500">
                Ranked with the SkillBridge Compatibility Algorithm based on your skills & hourly rate
              </p>
            </div>
          </div>

          <Link
            to="/browse"
            className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1"
          >
            All jobs <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <Loader />
        ) : recommendations.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
            No matching projects found. Check out <Link to="/browse" className="text-brand-600 underline">Browse Projects</Link> to explore all opportunities.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((item) => (
              <ProjectCard
                key={item.project._id}
                project={item.project}
                matchScore={item.matchScore}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
