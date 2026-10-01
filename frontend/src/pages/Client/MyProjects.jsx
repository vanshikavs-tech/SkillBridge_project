import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, MessageSquare, Trash2, Edit3, ArrowRight } from 'lucide-react';
import { projectService } from '../../services/projectService';
import { Button } from '../../components/Button';
import { Loader } from '../../components/Loader';

export const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await projectService.getClientProjects();
        setProjects(res.projects || []);
      } catch (err) {
        console.error('Failed to load client projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project and all its proposals?')) {
      try {
        await projectService.deleteProject(id);
        setProjects(projects.filter((p) => p._id !== id));
      } catch (err) {
        alert('Failed to delete project');
      }
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesStatus = filterStatus === 'ALL' || p.status === filterStatus;
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Posted Projects</h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse and manage all projects you have posted on SkillBridge.
          </p>
        </div>

        <Link to="/client/post-project">
          <Button size="md" variant="primary">
            <PlusCircle className="w-4 h-4 mr-2" />
            Post New Project
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'OPEN', 'IN_PROGRESS', 'COMPLETED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search your projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Projects List */}
      {loading ? (
        <Loader />
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center">
          <p className="text-sm text-slate-500">No projects found matching the criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-brand-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xs font-semibold px-2 py-0.5 rounded bg-brand-50 text-brand-700">
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
                  <span className="text-2xs text-slate-400">
                    Posted on {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <Link
                  to={`/client/projects/${project._id}`}
                  className="text-lg font-bold text-slate-900 hover:text-brand-600 transition block"
                >
                  {project.title}
                </Link>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="font-bold text-slate-900">
                    ₹{project.budget?.min?.toLocaleString('en-IN')} - ₹{project.budget?.max?.toLocaleString('en-IN')}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-brand-600">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {project.proposalsCount || 0} Proposals
                  </span>
                  {project.hiredFreelancer && (
                    <span className="text-slate-700">
                      Hired: <span className="font-bold text-slate-900">{project.hiredFreelancer.name}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Link to={`/client/projects/${project._id}`}>
                  <Button variant="primary" size="sm">
                    View Proposals ({project.proposalsCount || 0})
                  </Button>
                </Link>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Delete Project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
