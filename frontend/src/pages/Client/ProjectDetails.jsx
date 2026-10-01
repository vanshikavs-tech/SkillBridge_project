import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Clock,
  Sparkles,
  ArrowLeft,
  Users,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { projectService } from '../../services/projectService';
import { proposalService } from '../../services/proposalService';
import { messageService } from '../../services/messageService';
import { ProposalCard } from '../../components/ProposalCard';
import { FreelancerCard } from '../../components/FreelancerCard';
import { Button } from '../../components/Button';
import { Loader } from '../../components/Loader';

export const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [recommendedTalent, setRecommendedTalent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState({ text: '', type: '' });
  const [activeTab, setActiveTab] = useState('proposals'); // 'proposals' | 'recommendations'

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const [projRes, propRes] = await Promise.all([
          projectService.getProjectById(id),
          proposalService.getProjectProposals(id),
        ]);
        setProject(projRes.project);
        setRecommendedTalent(projRes.recommendedFreelancers || []);
        setProposals(propRes.proposals || []);
      } catch (err) {
        console.error('Failed to load project details:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [id]);

  const handleAcceptProposal = async (proposalId) => {
    if (window.confirm('Accept this proposal and initialize the contract?')) {
      try {
        const res = await proposalService.acceptProposal(proposalId);
        setActionMessage({
          text: 'Proposal accepted! A new contract with milestones has been created.',
          type: 'success',
        });
        // Update local state
        setProject((prev) => ({ ...prev, status: 'IN_PROGRESS' }));
        setProposals((prev) =>
          prev.map((p) =>
            p._id === proposalId
              ? { ...p, status: 'ACCEPTED' }
              : { ...p, status: 'REJECTED' }
          )
        );
        // Navigate to contract after 1.5 seconds
        setTimeout(() => {
          navigate(`/client/contracts`);
        }, 1500);
      } catch (err) {
        setActionMessage({
          text: err.response?.data?.message || 'Failed to accept proposal.',
          type: 'error',
        });
      }
    }
  };

  const handleRejectProposal = async (proposalId) => {
    try {
      await proposalService.rejectProposal(proposalId);
      setProposals((prev) =>
        prev.map((p) => (p._id === proposalId ? { ...p, status: 'REJECTED' } : p))
      );
    } catch (err) {
      alert('Failed to decline proposal.');
    }
  };

  const handleMessageFreelancer = async (freelancer) => {
    try {
      const res = await messageService.getOrCreateConversation(freelancer._id, project._id);
      navigate('/messages', { state: { conversationId: res.conversation._id } });
    } catch (err) {
      alert('Failed to start chat conversation');
    }
  };

  if (loading) return <Loader fullScreen message="Loading project and proposals..." />;
  if (!project) return <div className="p-8 text-center">Project not found.</div>;

  return (
    <div className="space-y-8">
      {/* Back button */}
      <Link
        to="/client/my-projects"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to My Projects
      </Link>

      {/* Action Notification Banner */}
      {actionMessage.text && (
        <div
          className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2 ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {actionMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Project Overview Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700">
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
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{project.title}</h1>
          </div>

          <div className="text-left sm:text-right bg-slate-50 p-4 rounded-xl border border-slate-100">
            <span className="block text-xs text-slate-500 font-medium">Budget Scope</span>
            <span className="text-xl font-bold text-slate-900">
              ₹{project.budget?.min?.toLocaleString('en-IN')} - ₹{project.budget?.max?.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Project Scope & Instructions
          </h4>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            {project.description}
          </p>
        </div>

        {/* Skills & Meta */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="flex flex-wrap gap-1.5">
            {project.skills?.map((s, idx) => (
              <span
                key={idx}
                className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500">
            <span>
              Experience: <strong className="text-slate-800">{project.experienceLevel}</strong>
            </span>
            <span>
              Deadline: <strong className="text-slate-800">{new Date(project.deadline).toLocaleDateString()}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Tabs: Proposals vs Recommendations */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('proposals')}
            className={`pb-2 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'proposals'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            Submitted Proposals ({proposals.length})
          </button>

          <button
            onClick={() => setActiveTab('recommendations')}
            className={`pb-2 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'recommendations'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            AI Recommended Talent ({recommendedTalent.length})
          </button>
        </div>

        {/* Tab Content: Proposals */}
        {activeTab === 'proposals' && (
          <div className="space-y-4">
            {proposals.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-800">No proposals received yet</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Freelancers are currently reviewing your project posting. Check back soon!
                </p>
              </div>
            ) : (
              proposals.map((proposal) => (
                <ProposalCard
                  key={proposal._id}
                  proposal={proposal}
                  onAccept={handleAcceptProposal}
                  onReject={handleRejectProposal}
                  onMessage={handleMessageFreelancer}
                  isClientView={true}
                />
              ))
            )}
          </div>
        )}

        {/* Tab Content: Recommended Freelancers */}
        {activeTab === 'recommendations' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Ranked using the SkillBridge AI Matching Score (Skill Match × 40% + Experience × 20% + Rating × 20% + Budget × 10% + Reliability × 10%):
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedTalent.map((rec) => (
                <FreelancerCard
                  key={rec.freelancer._id}
                  freelancer={rec.freelancer}
                  matchScore={rec.matchScore}
                  onContact={handleMessageFreelancer}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
