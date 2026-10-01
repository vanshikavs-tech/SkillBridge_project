import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';

export const FreelancerCard = ({ freelancer, matchScore, onContact }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 hover:shadow-md hover:border-brand-300 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Top Profile Header */}
        <div className="flex items-start gap-3.5 mb-3">
          <img
            src={freelancer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt={freelancer.name}
            className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-100 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <Link to={`/profile/${freelancer._id}`}>
                <h4 className="font-bold text-slate-900 hover:text-brand-600 transition truncate text-base">
                  {freelancer.name}
                </h4>
              </Link>
              {matchScore !== undefined && matchScore !== null && (
                <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  {matchScore}%
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 truncate font-medium">{freelancer.title}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
              <span className="flex items-center text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                {freelancer.rating?.toFixed(1) || '5.0'}
                <span className="text-slate-400 font-normal ml-0.5">({freelancer.totalReviews || 0})</span>
              </span>
              <span className="flex items-center gap-0.5 text-slate-400">
                <MapPin className="w-3 h-3" />
                {freelancer.location || 'Remote'}
              </span>
            </div>
          </div>
        </div>

        {/* Bio preview */}
        {freelancer.bio && (
          <p className="text-slate-600 text-xs line-clamp-2 mb-3 leading-relaxed">
            {freelancer.bio}
          </p>
        )}

        {/* Skills */}
        <div className="flex flex-wrap gap-1 mb-4">
          {freelancer.skills?.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-medium"
            >
              {skill}
            </span>
          ))}
          {freelancer.skills?.length > 4 && (
            <span className="text-xs text-slate-400 self-center">
              +{freelancer.skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Footer / Rates */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-base font-bold text-slate-900">
            ₹{freelancer.hourlyRate?.toLocaleString('en-IN') || 0}
          </span>
          <span className="text-xs text-slate-500"> / hr</span>
        </div>

        <div className="flex items-center gap-2">
          <Link to={`/profile/${freelancer._id}`}>
            <Button variant="outline" size="sm">
              Profile
            </Button>
          </Link>
          {onContact && (
            <Button size="sm" onClick={() => onContact(freelancer)}>
              Message
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
