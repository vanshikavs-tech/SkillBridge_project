import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { projectService } from '../../services/projectService';
import { ProjectCard } from '../../components/ProjectCard';
import { Loader } from '../../components/Loader';
import { Button } from '../../components/Button';

export const BrowseProjects = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [experience, setExperience] = useState('All');
  const [sort, setSort] = useState('newest');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [page, setPage] = useState(1);

  const categories = [
    'All',
    'Web Development',
    'UI/UX Design',
    'Data Science & AI',
    'Mobile Apps',
    'DevOps & Cloud',
    'Content & Writing',
  ];

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 8,
        ...(search && { search }),
        ...(category !== 'All' && { category }),
        ...(experience !== 'All' && { experience }),
        ...(sort !== 'newest' && { sort }),
        ...(minBudget && { minBudget }),
        ...(maxBudget && { maxBudget }),
      };

      const res = await projectService.getProjects(params);
      setProjects(res.projects || []);
      setPagination(res.pagination || null);
    } catch (err) {
      console.error('Failed to browse projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [category, experience, sort, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProjects();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setExperience('All');
    setMinBudget('');
    setMaxBudget('');
    setSort('newest');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900">Browse Projects</h1>
        <p className="text-xs text-slate-500 mt-1">
          Explore high-quality client contracts and submit bids.
        </p>
      </div>

      {/* Search & Sort Bar */}
      <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search projects by title, description, or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white text-slate-700 font-medium"
          >
            <option value="newest">Newest First</option>
            <option value="budget_high">Budget: High to Low</option>
            <option value="budget_low">Budget: Low to High</option>
            <option value="proposals">Most Proposals</option>
          </select>

          <Button type="submit" size="sm" variant="primary">
            Search
          </Button>
        </div>
      </form>

      {/* Main Grid: Filters Sidebar + Project Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Filter Sidebar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-brand-600" />
              Filter Jobs
            </h4>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-2xs text-brand-600 hover:underline font-semibold"
            >
              Reset All
            </button>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Category</label>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setCategory(cat);
                    setPage(1);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition font-medium ${
                    category === cat
                      ? 'bg-brand-50 text-brand-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Experience</label>
            <div className="space-y-1">
              {['All', 'ENTRY', 'INTERMEDIATE', 'EXPERT'].map((exp) => (
                <button
                  key={exp}
                  type="button"
                  onClick={() => {
                    setExperience(exp);
                    setPage(1);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition font-medium ${
                    experience === exp
                      ? 'bg-brand-50 text-brand-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {exp === 'All' ? 'All Experience Levels' : exp}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Range */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Budget Range (₹)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minBudget}
                onChange={(e) => setMinBudget(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={fetchProjects}
              className="w-full mt-2 text-2xs"
            >
              Apply Budget
            </Button>
          </div>
        </div>

        {/* Right Project List */}
        <div className="lg:col-span-3 space-y-4">
          {loading ? (
            <Loader />
          ) : projects.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
              <p className="text-sm text-slate-500">No projects found matching the filters.</p>
              <button
                onClick={handleResetFilters}
                className="mt-2 text-xs font-bold text-brand-600 underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {projects.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>

              {/* Pagination controls */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs">
                  <span className="text-slate-500">
                    Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalItems} jobs)
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!pagination.hasPrevPage}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!pagination.hasNextPage}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
