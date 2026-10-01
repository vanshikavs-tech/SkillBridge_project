import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, IndianRupee, Check, X, MessageSquare } from 'lucide-react';
import { Button } from './Button';

export const ProposalCard = ({
  proposal,
  onAccept,
  onReject,
  onMessage,
  isClientView = true,
}) => {
  const freelancer = proposal.freelancerId;

  const statusStyles = {
    PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
    ACCEPTED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    REJECTED: 'bg-red-50 text-red-700 border-red-200',
    SHORTLISTED: 'bg-blue-50 text-blue-700 border-blue-200',
    WITHDRAWN: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        {/* Freelancer Header */}
        <div className="flex items-center gap-3">
          <img
            src={freelancer?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt={freelancer?.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100"
          />
          <div>
            <div className="flex items-center gap-2">
              <Link
                to={`/profile/${freelancer?._id}`}
                className="font-bold text-slate-900 hover:text-brand-600 transition"
              >
                {freelancer?.name}
              </Link>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                  statusStyles[proposal.status] || statusStyles.PENDING
                }`}
              >
                {proposal.status}
              </span>
            </div>
            <p className="text-xs text-slate-500">{freelancer?.title}</p>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span className="flex items-center text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                {freelancer?.rating?.toFixed(1) || '5.0'}
              </span>
              <span>•</span>
              <span>{freelancer?.completedProjectsCount || 0} completed jobs</span>
            </div>
          </div>
        </div>

        {/* Bid Terms */}
        <div className="flex items-center gap-6 text-right sm:text-right">
          <div>
            <span className="block text-xs text-slate-500 font-medium">Bid Amount</span>
            <span className="text-lg font-bold text-slate-900">
              ₹{proposal.bidAmount?.toLocaleString('en-IN')}
            </span>
          </div>
          <div>
            <span className="block text-xs text-slate-500 font-medium">Delivery</span>
            <span className="text-sm font-semibold text-slate-700 flex items-center justify-end gap-1">
              <Clock className="w-3.5 h-3.5" />
              {proposal.estimatedDays} days
            </span>
          </div>
        </div>
      </div>

      {/* Cover Letter */}
      <div className="mt-4">
        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
          Cover Letter
        </h5>
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded-lg border border-slate-100">
          {proposal.coverLetter}
        </p>
      </div>

      {/* Actions */}
      {isClientView && proposal.status === 'PENDING' && (
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          {onMessage && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMessage(freelancer)}
            >
              <MessageSquare className="w-4 h-4 mr-1.5" />
              Message
            </Button>
          )}
          {onReject && (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:bg-red-50"
              onClick={() => onReject(proposal._id)}
            >
              <X className="w-4 h-4 mr-1.5" />
              Decline
            </Button>
          )}
          {onAccept && (
            <Button
              variant="success"
              size="sm"
              onClick={() => onAccept(proposal._id)}
            >
              <Check className="w-4 h-4 mr-1.5" />
              Hire & Start Contract
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
