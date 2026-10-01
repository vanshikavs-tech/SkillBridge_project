import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  IndianRupee,
  PlusCircle,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import { projectService } from '../../services/projectService';
import { useAuth } from '../../store/authStore';
import { Button } from '../../components/Button';
import { Loader } from '../../components/Loader';

export const ClientDashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientProjects = async () => {
      try {
        const res = await projectService.getClientProjects();
        setProjects(res.projects || []);
      } catch (err) {
        console.error('Failed to fetch client projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClientProjects();
  }, []);

  const activeProjects = projects.filter((p) => p.status === 'IN_PROGRESS');
  const completedProjects = projects.filter((p) => p.status === 'COMPLETED');
  const openProjects = projects.filter((p) => p.status === 'OPEN');
  const totalBids = projects.reduce((acc, p) => acc + (p.proposalsCount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Client Control Center
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Welcome back, {user?.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor your project postings, incoming proposals, and milestone disbursements.
          </p>
        </div>

        <Link to="/client/post-project">
          <Button size="md" variant="primary" className="shadow-md">
            <PlusCircle className="w-4 h-4 mr-2" />
            Post New Project
          </Button>
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Contracts</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <span className="block text-2xl font-black text-slate-900 mt-2">
            {activeProjects.length}
          </span>
          <span className="text-2xs text-slate-400 mt-1 block">In development</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Open for Bids</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <span className="block text-2xl font-black text-slate-900 mt-2">
            {openProjects.length}
          </span>
          <span className="text-2xs text-slate-400 mt-1 block">{totalBids} total proposals</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Completed Projects</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <span className="block text-2xl font-black text-slate-900 mt-2">
            {completedProjects.length + (user?.completedProjectsCount || 0)}
          </span>
          <span className="text-2xs text-slate-400 mt-1 block">Successfully closed</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Spent</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <span className="block text-2xl font-black text-brand-600 mt-2">
            ₹{(user?.totalSpent || 145000).toLocaleString('en-IN')}
          </span>
          <span className="text-2xs text-slate-400 mt-1 block">Milestones & contracts</span>
        </div>
      </div>

      {/* Recent Projects Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Your Posted Projects</h3>
            <p className="text-xs text-slate-500">Inspect proposals and hire freelancers</p>
          </div>
          <Link
            to="/client/my-projects"
            className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1"
          >
            Manage All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <Loader />
        ) : projects.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-slate-500">You haven't posted any projects yet.</p>
            <Link to="/client/post-project" className="mt-4 inline-block">
              <Button size="sm">Post Your First Project</Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {projects.slice(0, 5).map((project) => (
              <div
                key={project._id}
                className="p-5 hover:bg-slate-50/80 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {project.category}
                    </span>
                    <span
                      className={`text-2xs font-bold px-2 py-0.5 rounded ${
                        project.status === 'OPEN'
                          ? 'bg-amber-100 text-amber-800'
                          : project.status === 'IN_PROGRESS'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>

                  <Link
                    to={`/client/projects/${project._id}`}
                    className="text-base font-bold text-slate-900 hover:text-brand-600 transition"
                  >
                    {project.title}
                  </Link>

                  <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                    <span className="font-semibold text-slate-700">
                      ₹{project.budget?.min?.toLocaleString('en-IN')} - ₹{project.budget?.max?.toLocaleString('en-IN')}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-brand-600">
                      <MessageSquare className="w-3.5 h-3.5" />
                      {project.proposalsCount || 0} Proposals
                    </span>
                    {project.hiredFreelancer && (
                      <span className="text-slate-600">
                        Hired: <span className="font-semibold text-slate-900">{project.hiredFreelancer.name}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <Link to={`/client/projects/${project._id}`}>
                    <Button variant="outline" size="sm">
                      View Proposals ({project.proposalsCount || 0})
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
