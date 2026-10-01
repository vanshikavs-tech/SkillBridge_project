import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Briefcase, IndianRupee, MessageSquare, Sparkles } from 'lucide-react';

export const ProjectCard = ({ project, matchScore }) => {
  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 hover:shadow-md hover:border-brand-300 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-1 rounded-md mb-2">
              {project.category}
            </span>
            <Link to={`/projects/${project._id}`}>
              <h3 className="text-lg font-bold text-slate-900 hover:text-brand-600 transition line-clamp-1">
                {project.title}
              </h3>
            </Link>
          </div>

          {matchScore !== undefined && matchScore !== null && (
            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{matchScore}% Match</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-slate-600 text-sm line-clamp-2 mb-4 leading-relaxed">
          {project.description}
        </p>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.skills?.map((skill, index) => (
            <span
              key={index}
              className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-900 text-sm flex items-center">
            {formatCurrency(project.budget?.min)} - {formatCurrency(project.budget?.max)}
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
            {project.experienceLevel}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-slate-500 font-medium">
            <MessageSquare className="w-3.5 h-3.5" />
            {project.proposalsCount || 0} bids
          </span>
          <Link
            to={`/projects/${project._id}`}
            className="font-semibold text-brand-600 hover:text-brand-800 transition text-xs"
          >
            View Details &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};
