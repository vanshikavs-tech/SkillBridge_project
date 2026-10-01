import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  Clock,
  IndianRupee,
  Star,
  ExternalLink,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { contractService } from '../../services/contractService';
import { paymentService } from '../../services/paymentService';
import API from '../../services/api';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Loader } from '../../components/Loader';

export const Contracts = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const res = await contractService.getContracts();
      setContracts(res.contracts || []);
    } catch (err) {
      console.error('Failed to fetch contracts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayMilestone = async (contract, milestone) => {
    if (window.confirm(`Release ₹${milestone.amount?.toLocaleString('en-IN')} for "${milestone.title}"?`)) {
      try {
        await paymentService.createCheckout({
          contractId: contract._id,
          milestoneId: milestone._id,
          amount: milestone.amount,
        });
        alert('Milestone payment successfully processed and released!');
        fetchContracts();
      } catch (err) {
        alert('Payment failed. ' + (err.response?.data?.message || ''));
      }
    }
  };

  const handleCompleteContract = async (contractId) => {
    if (window.confirm('Mark this entire contract as completed and leave a final review?')) {
      try {
        await contractService.completeContract(contractId);
        const contract = contracts.find((c) => c._id === contractId);
        setSelectedContract(contract);
        setReviewModalOpen(true);
        fetchContracts();
      } catch (err) {
        alert('Failed to complete contract');
      }
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewSubmitting(true);
    try {
      await API.post('/reviews', {
        contractId: selectedContract._id,
        rating,
        comment,
      });
      alert('Review published! Thank you for the feedback.');
      setReviewModalOpen(false);
      setComment('');
      fetchContracts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const getMilestoneBadge = (status) => {
    switch (status) {
      case 'PAID':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'APPROVED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SUBMITTED':
        return 'bg-purple-100 text-purple-800 border-purple-200 animate-pulse';
      case 'IN_PROGRESS':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  if (loading) return <Loader fullScreen message="Loading contracts and milestones..." />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Contracts & Milestones</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review deliverables, approve milestone funds, and manage completed engagements.
        </p>
      </div>

      {contracts.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-800">No active contracts</h4>
          <p className="text-xs text-slate-500 mt-1">
            Accept a freelancer's proposal from your projects to launch a milestone contract.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {contracts.map((contract) => (
            <div
              key={contract._id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden"
            >
              {/* Contract Top Header */}
              <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-2xs font-bold px-2 py-0.5 rounded ${
                        contract.status === 'ACTIVE'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {contract.status}
                    </span>
                    <span className="text-2xs text-slate-400">
                      Contract #{contract._id.slice(-6).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {contract.projectId?.title || 'Contract Agreement'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Hired Freelancer: <strong className="text-slate-800">{contract.freelancerId?.name}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-6 text-right">
                  <div>
                    <span className="block text-xs text-slate-500 font-medium">Total Contract</span>
                    <span className="text-xl font-black text-slate-900">
                      ₹{contract.amount?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500 font-medium">Released to Date</span>
                    <span className="text-xl font-black text-emerald-600">
                      ₹{(contract.totalPaid || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Milestones Breakdown */}
              <div className="p-6 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Project Milestones
                </h4>

                <div className="space-y-3">
                  {contract.milestones?.map((milestone, idx) => (
                    <div
                      key={milestone._id || idx}
                      className="p-4 rounded-xl border border-slate-200/80 hover:border-slate-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">
                            {milestone.title}
                          </span>
                          <span
                            className={`text-2xs font-bold px-2 py-0.5 rounded-full border ${getMilestoneBadge(
                              milestone.status
                            )}`}
                          >
                            {milestone.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">{milestone.description}</p>
                        {milestone.deliverables?.length > 0 && (
                          <div className="mt-2 text-2xs bg-purple-50 text-purple-900 p-2 rounded-md border border-purple-100">
                            <strong>Deliverable Submitted:</strong> "{milestone.deliverables[milestone.deliverables.length - 1].notes}"
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <span className="text-base font-bold text-slate-900">
                          ₹{milestone.amount?.toLocaleString('en-IN')}
                        </span>

                        {milestone.status === 'SUBMITTED' && (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handlePayMilestone(contract, milestone)}
                          >
                            Approve & Pay ₹{milestone.amount}
                          </Button>
                        )}

                        {milestone.status === 'PAID' && (
                          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Paid
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Contract Completion Bar */}
                {contract.status === 'ACTIVE' && (
                  <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Finished all milestones? Finalize project to leave a review.
                    </span>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleCompleteContract(contract._id)}
                    >
                      Complete Contract & Review
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Leave a Review for Freelancer"
      >
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Rating (1 to 5 Stars)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-sm font-bold text-slate-800 ml-2">{rating}.0 / 5.0</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Feedback Commentary *
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe freelancer communication, code quality, speed, and overall satisfaction..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setReviewModalOpen(false)}
            >
              Skip for Now
            </Button>
            <Button type="submit" disabled={reviewSubmitting}>
              {reviewSubmitting ? 'Posting...' : 'Submit Feedback'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
