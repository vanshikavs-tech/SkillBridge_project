import React from 'react';
import { Star } from 'lucide-react';

export const ReviewCard = ({ review }) => {
  return (
    <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <img
            src={review.reviewerId?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt={review.reviewerId?.name}
            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
          />
          <div>
            <h5 className="text-sm font-bold text-slate-900">{review.reviewerId?.name}</h5>
            <span className="text-2xs text-slate-400 capitalize">{review.reviewerId?.role?.toLowerCase()}</span>
          </div>
        </div>

        <div className="flex items-center text-amber-500">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < review.rating ? 'fill-current' : 'text-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed italic">
        "{review.comment}"
      </p>

      <span className="block mt-2 text-2xs text-slate-400">
        {new Date(review.createdAt).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </span>
    </div>
  );
};
