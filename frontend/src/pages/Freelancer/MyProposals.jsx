import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, Clock, Trash2, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { proposalService } from '../../services/proposalService';
import { Button } from '../../components/Button';
import { Loader } from '../../components/Loader';

export const MyProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyProposals();
  }, []);

  const fetchMyProposals = async () => {
    try {
      const res = await proposalService.getMyProposals();
      setProposals(res.proposals || []);
    } catch (err) {
      console.error('Failed to load freelancer proposals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (proposalId) => {
    if (window.confirm('Withdraw this proposal?')) {
      try {
        await proposalService.withdrawProposal(proposalId);
        setProposals(proposals.filter((p) => p._id !== proposalId));
      } catch (err) {
        alert('Failed to withdraw proposal');
      }
    }
  };

  const statusStyles = {
    PENDING: 'bg-amber-100 text-amber-800',
    ACCEPTED: 'bg-emerald-100 text-emerald-800',
    REJECTED: 'bg-red-100 text-red-800',
    SHORTLISTED: 'bg-blue-100 text-blue-800',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">My Submitted Proposals</h1>
        <p className="text-xs text-slate-500 mt-1">
          Track the status of all your bids across active client projects.
        </p>
      </div>

      {loading ? (
        <Loader />
      ) : proposals.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
          <Send className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-800">No proposals submitted yet</h4>
          <p className="text-xs text-slate-500 mt-1">
            Browse through open client projects and submit your first bid.
          </p>
          <Link to="/browse" className="mt-4 inline-block">
            <Button size="sm">Browse Projects</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <div
              key={proposal._id}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-50 text-brand-700">
                      {proposal.projectId?.category || 'Project'}
                    </span>
                    <span
                      className={`text-2xs font-bold px-2 py-0.5 rounded ${
                        statusStyles[proposal.status] || 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {proposal.status}
                    </span>
                  </div>
                  <Link
                    to={`/projects/${proposal.projectId?._id}`}
                    className="text-base font-bold text-slate-900 hover:text-brand-600 transition"
                  >
                    {proposal.projectId?.title}
                  </Link>
                </div>

                <div className="flex items-center gap-6 text-right">
                  <div>
                    <span className="block text-2xs text-slate-400">Your Bid</span>
                    <span className="text-base font-bold text-slate-900">
                      ₹{proposal.bidAmount?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="block text-2xs text-slate-400">Delivery</span>
                    <span className="text-xs font-semibold text-slate-700">
                      {proposal.estimatedDays} days
                    </span>
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <h5 className="text-2xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Submitted Pitch
                </h5>
                <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {proposal.coverLetter}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-2xs text-slate-400">
                  Submitted on {new Date(proposal.createdAt).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-2">
                  {proposal.status === 'ACCEPTED' && (
                    <Link to="/freelancer/contracts">
                      <Button size="sm" variant="success">
                        Go to Contract & Milestones &rarr;
                      </Button>
                    </Link>
                  )}

                  {proposal.status === 'PENDING' && (
                    <button
                      onClick={() => handleWithdraw(proposal._id)}
                      className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 p-1 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Withdraw
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
