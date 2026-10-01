import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowLeft,
  IndianRupee,
  Clock,
  Briefcase,
  Star,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Send,
  MessageSquare,
} from 'lucide-react';
import { projectService } from '../../services/projectService';
import { proposalService } from '../../services/proposalService';
import { messageService } from '../../services/messageService';
import { useAuth } from '../../store/authStore';
import { Button } from '../../components/Button';
import { Loader } from '../../components/Loader';

export const SubmitProposal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isFreelancer, isClient, isAuthenticated } = useAuth();

  const [project, setProject] = useState(null);
  const [matchScore, setMatchScore] = useState(null);
  const [loading, setLoading] = useState(true);

  // Proposal form state
  const [bidAmount, setBidAmount] = useState('');
  const [estimatedDays, setEstimatedDays] = useState('14');
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await projectService.getProjectById(id);
        setProject(res.project);
        setMatchScore(res.matchScore);
        if (res.project.budget) {
          setBidAmount(res.project.budget.min || '');
        }
      } catch (err) {
        console.error('Failed to load project:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await proposalService.submitProposal(id, {
        bidAmount: Number(bidAmount),
        estimatedDays: Number(estimatedDays),
        coverLetter,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/freelancer/my-proposals');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit proposal.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMessageClient = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const res = await messageService.getOrCreateConversation(project.clientId._id, project._id);
      navigate('/messages', { state: { conversationId: res.conversation._id } });
    } catch (err) {
      alert('Failed to start chat conversation');
    }
  };

  if (loading) return <Loader fullScreen message="Loading project details..." />;
  if (!project) return <div className="p-8 text-center">Project not found.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Back button */}
      <Link
        to="/browse"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Project Listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Project Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-2xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700">
                  {project.category}
                </span>

                {matchScore !== null && (
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    {matchScore}% Compatibility Match
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {project.title}
              </h1>
              <span className="block text-2xs text-slate-400 mt-1">
                Posted on {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Scope */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Job Description & Scope
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/60 p-4 rounded-xl border border-slate-100">
                {project.description}
              </p>
            </div>

            {/* Required Skills */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Required Technical Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {project.skills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-slate-100 text-slate-800 px-3 py-1 rounded-full font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Proposal Submission Form (Visible to Freelancers) */}
          {isFreelancer && project.status === 'OPEN' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-200/80 shadow-md shadow-brand-500/5 space-y-6">
              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Send className="w-5 h-5 text-brand-600" />
                  Submit Your Proposal
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Specify your bid amount in INR, estimated delivery duration, and introduce your approach.
                </p>
              </div>

              {error && (
                <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Proposal submitted successfully! Redirecting to your bids...</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Bid Amount (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder="e.g. 35000"
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                    <span className="text-2xs text-slate-400 mt-1 block">
                      Client budget: ₹{project.budget?.min} - ₹{project.budget?.max}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Estimated Delivery (Days) *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={estimatedDays}
                      onChange={(e) => setEstimatedDays(e.target.value)}
                      placeholder="14"
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cover Letter & Pitch *
                  </label>
                  <textarea
                    required
                    rows={6}
                    minLength={30}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Explain why you are the best fit for this project. Reference relevant past work, architecture decisions, and when you can get started..."
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={submitting}
                    className="w-full sm:w-auto font-bold shadow-md"
                  >
                    {submitting ? 'Submitting Bid...' : 'Submit Proposal Now'}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {!isAuthenticated && (
            <div className="bg-brand-50 border border-brand-200 p-6 rounded-2xl text-center space-y-3">
              <h4 className="text-base font-bold text-brand-900">Want to bid on this job?</h4>
              <p className="text-xs text-brand-700">
                Create a freelancer account or log in to submit a proposal and connect with the client.
              </p>
              <Link to="/login">
                <Button size="sm">Sign In to Apply</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Client & Project Meta Card */}
        <div className="space-y-6">
          {/* Budget Overview */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Project Budget
            </h4>
            <div>
              <span className="block text-2xl font-black text-slate-900">
                ₹{project.budget?.min?.toLocaleString('en-IN')} - ₹{project.budget?.max?.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-500">Fixed-price milestone engagement</span>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>Experience Level</span>
                <strong className="text-slate-800">{project.experienceLevel}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Target Deadline</span>
                <strong className="text-slate-800">{new Date(project.deadline).toLocaleDateString()}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Current Bids</span>
                <strong className="text-slate-800">{project.proposalsCount || 0} submitted</strong>
              </div>
            </div>
          </div>

          {/* Client Profile Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              About the Client
            </h4>

            <div className="flex items-center gap-3">
              <img
                src={project.clientId?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'}
                alt={project.clientId?.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100"
              />
              <div>
                <h5 className="font-bold text-slate-900">{project.clientId?.name}</h5>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  {project.clientId?.location || 'Bengaluru, India'}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span>Client Rating</span>
                <span className="font-bold text-amber-500 flex items-center">
                  <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                  {project.clientId?.rating?.toFixed(1) || '4.9'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total Spent</span>
                <strong className="text-slate-800">
                  ₹{(project.clientId?.totalSpent || 145000).toLocaleString('en-IN')}
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Payment Verification</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
            </div>

            {project.clientId && (
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2"
                onClick={handleMessageClient}
              >
                <MessageSquare className="w-4 h-4 mr-1.5" />
                Contact Client
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
