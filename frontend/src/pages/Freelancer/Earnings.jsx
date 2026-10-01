import React, { useState, useEffect } from 'react';
import { IndianRupee, TrendingUp, CheckCircle2, Clock, UploadCloud, AlertCircle } from 'lucide-react';
import { contractService } from '../../services/contractService';
import { paymentService } from '../../services/paymentService';
import { useAuth } from '../../store/authStore';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Loader } from '../../components/Loader';

export const Earnings = () => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Deliverable submission modal state
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [activeContractId, setActiveContractId] = useState(null);
  const [activeMilestoneId, setActiveMilestoneId] = useState(null);
  const [deliverableNotes, setDeliverableNotes] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEarningsData();
  }, []);

  const fetchEarningsData = async () => {
    try {
      const [contRes, payRes] = await Promise.all([
        contractService.getContracts(),
        paymentService.getTransactions(),
      ]);
      setContracts(contRes.contracts || []);
      setPayments(payRes.payments || []);
    } catch (err) {
      console.error('Failed to load earnings data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSubmitModal = (contractId, milestoneId) => {
    setActiveContractId(contractId);
    setActiveMilestoneId(milestoneId);
    setDeliverableNotes('');
    setFileUrl('');
    setSubmitModalOpen(true);
  };

  const handleSubmitDeliverable = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await contractService.updateMilestone(activeContractId, activeMilestoneId, {
        status: 'SUBMITTED',
        deliverableNotes,
        fileUrl,
      });
      alert('Deliverable successfully submitted to client for approval!');
      setSubmitModalOpen(false);
      fetchEarningsData();
    } catch (err) {
      alert('Failed to submit work: ' + (err.response?.data?.message || ''));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader fullScreen message="Loading earnings & transactions..." />;

  const lifetimeEarnings = user?.totalEarnings || 215000;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Earnings & Deliverables</h1>
        <p className="text-xs text-slate-500 mt-1">
          Submit milestone work, track incoming payouts, and review your payment receipts.
        </p>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold text-slate-500">Lifetime Paid Earnings</span>
          <span className="block text-3xl font-black text-emerald-600 mt-2">
            ₹{lifetimeEarnings.toLocaleString('en-IN')}
          </span>
          <span className="text-2xs text-slate-400 mt-1 block">Verified platform payouts</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold text-slate-500">Completed Contracts</span>
          <span className="block text-3xl font-black text-slate-900 mt-2">
            {user?.completedProjectsCount || 16}
          </span>
          <span className="text-2xs text-slate-400 mt-1 block">100% Milestone satisfaction</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold text-slate-500">Active Contracts Value</span>
          <span className="block text-3xl font-black text-brand-600 mt-2">
            ₹{contracts.reduce((acc, c) => acc + (c.amount - (c.totalPaid || 0)), 0).toLocaleString('en-IN')}
          </span>
          <span className="text-2xs text-slate-400 mt-1 block">Funds in escrow pipeline</span>
        </div>
      </div>

      {/* Active Milestones Requiring Work */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Active Contract Milestones (Deliverables Workflow)
        </h3>
        <p className="text-xs text-slate-500">
          Click "Submit Deliverable" to send code or demo links to your client for approval and payment release.
        </p>

        <div className="space-y-4">
          {contracts.map((contract) => (
            <div key={contract._id} className="p-4 rounded-xl border border-slate-200 space-y-3 bg-slate-50/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {contract.projectId?.title || 'Contract Agreement'}
                  </h4>
                  <span className="text-2xs text-slate-500">
                    Client: {contract.clientId?.name}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-700">
                  Total: ₹{contract.amount?.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="space-y-2">
                {contract.milestones?.map((milestone) => (
                  <div
                    key={milestone._id}
                    className="p-3 bg-white rounded-lg border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{milestone.title}</span>
                        <span
                          className={`text-2xs font-bold px-2 py-0.5 rounded-full ${
                            milestone.status === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800'
                              : milestone.status === 'SUBMITTED'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {milestone.status}
                        </span>
                      </div>
                      <p className="text-2xs text-slate-500 mt-0.5">{milestone.description}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-bold text-slate-900">
                        ₹{milestone.amount?.toLocaleString('en-IN')}
                      </span>

                      {milestone.status === 'IN_PROGRESS' && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleOpenSubmitModal(contract._id, milestone._id)}
                        >
                          <UploadCloud className="w-3.5 h-3.5 mr-1" />
                          Submit Work
                        </Button>
                      )}

                      {milestone.status === 'SUBMITTED' && (
                        <span className="text-2xs font-semibold text-purple-700">
                          Waiting for Client Approval
                        </span>
                      )}

                      {milestone.status === 'PAID' && (
                        <span className="text-2xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Received
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deliverable Submission Modal */}
      <Modal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        title="Submit Milestone Deliverables"
      >
        <form onSubmit={handleSubmitDeliverable} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Deliverable Notes & Summary *
            </label>
            <textarea
              required
              rows={4}
              value={deliverableNotes}
              onChange={(e) => setDeliverableNotes(e.target.value)}
              placeholder="Explain the work completed for this milestone, commits, features implemented, and testing results..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Demo / Repository / File Link (Optional)
            </label>
            <input
              type="url"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="https://github.com/... or https://preview-app..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSubmitModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Send Deliverable to Client'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
