import React, { useState, useEffect } from 'react';
import { FolderKanban, Search, Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { Loader } from '../../components/Loader';

export const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/projects', {
        params: { ...(search && { search }) },
      });
      setProjects(res.data.projects || []);
    } catch (err) {
      console.error('Failed to load admin projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (projectId) => {
    if (window.confirm('Delete this project as an administrator? This action is permanent.')) {
      try {
        await API.delete(`/admin/projects/${projectId}`);
        setProjects(projects.filter((p) => p._id !== projectId));
      } catch (err) {
        alert('Failed to delete project');
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Project Moderation</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review job postings for policy compliance, inappropriate content, or spam.
        </p>
      </div>

      {/* Search Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchProjects();
        }}
        className="relative max-w-md"
      >
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Search by title or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
        />
      </form>

      {/* Projects Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <Loader />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3">Project Title</th>
                  <th className="px-5 py-3">Client</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Budget</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Bids</th>
                  <th className="px-5 py-3 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/50 transition">
                    <td className="px-5 py-4 font-bold text-slate-900 max-w-xs truncate">
                      <Link to={`/projects/${p._id}`} className="hover:text-purple-600 transition">
                        {p.title}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{p.clientId?.name}</td>
                    <td className="px-5 py-4">{p.category}</td>
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      ₹{p.budget?.min} - ₹{p.budget?.max}
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded text-3xs font-bold uppercase bg-slate-100 text-slate-700">
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-600">
                      {p.proposalsCount || 0}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition"
                        title="Remove project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
