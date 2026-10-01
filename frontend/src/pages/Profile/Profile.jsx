import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  MapPin,
  Mail,
  IndianRupee,
  Briefcase,
  ExternalLink,
  MessageSquare,
  Edit3,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { userService } from '../../services/userService';
import { messageService } from '../../services/messageService';
import { useAuth } from '../../store/authStore';
import { ReviewCard } from '../../components/ReviewCard';
import { Button } from '../../components/Button';
import { Loader } from '../../components/Loader';

export const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // If no ID param, view current user's profile
  const profileId = id || currentUser?._id;

  useEffect(() => {
    if (!profileId) return;

    const fetchUserProfile = async () => {
      try {
        const res = await userService.getProfile(profileId);
        setProfileUser(res.user);
        setReviews(res.reviews || []);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [profileId]);

  const handleMessage = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    try {
      const res = await messageService.getOrCreateConversation(profileUser._id);
      navigate('/messages', { state: { conversationId: res.conversation._id } });
    } catch (err) {
      alert('Failed to start chat conversation');
    }
  };

  if (loading) return <Loader fullScreen message="Loading user profile..." />;
  if (!profileUser) return <div className="p-8 text-center">User not found.</div>;

  const isOwnProfile = currentUser?._id === profileUser._id;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Profile Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-brand-600 to-indigo-700" />
        <div className="px-6 pb-6 pt-0 sm:px-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 gap-4">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <img
                src={profileUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                alt={profileUser.name}
                className="w-28 h-28 rounded-2xl object-cover ring-4 ring-white shadow-md bg-white shrink-0"
              />
              <div className="pt-2 sm:pt-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-900">{profileUser.name}</h1>
                  <span className="text-2xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-50 text-brand-700">
                    {profileUser.role}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-600 mt-0.5">{profileUser.title}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {profileUser.location || 'Remote'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {profileUser.rating?.toFixed(1) || '5.0'} ({profileUser.totalReviews || 0} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {isOwnProfile ? (
                <Link to="/profile/edit">
                  <Button variant="outline" size="sm">
                    <Edit3 className="w-3.5 h-3.5 mr-1.5" /> Edit Profile
                  </Button>
                </Link>
              ) : (
                <Button size="sm" variant="primary" onClick={handleMessage}>
                  <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Message
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Details + Portfolio + Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Bio & Skills */}
        <div className="space-y-6">
          {/* About / Bio */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              About Me
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {profileUser.bio || 'No bio provided yet.'}
            </p>
          </div>

          {/* Rates & Stats */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3 text-xs text-slate-600">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Overview
            </h3>
            {profileUser.role === 'FREELANCER' && (
              <div className="flex items-center justify-between">
                <span>Hourly Rate</span>
                <strong className="text-slate-900 text-sm">
                  ₹{profileUser.hourlyRate?.toLocaleString('en-IN') || 0} / hr
                </strong>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span>Experience Level</span>
              <strong className="text-slate-800">{profileUser.experienceLevel || 'Intermediate'}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Jobs Completed</span>
              <strong className="text-slate-800">{profileUser.completedProjectsCount || 0}</strong>
            </div>
          </div>

          {/* Skills */}
          {profileUser.skills?.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Skills & Technologies
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {profileUser.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-full font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Portfolio & Reviews */}
        <div className="lg:col-span-2 space-y-6">
          {/* Portfolio */}
          {profileUser.role === 'FREELANCER' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Portfolio Projects</h3>
                {isOwnProfile && (
                  <Link to="/profile/edit" className="text-xs font-semibold text-brand-600 hover:underline">
                    Manage Portfolio
                  </Link>
                )}
              </div>

              {profileUser.portfolio?.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No portfolio items added yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profileUser.portfolio?.map((item, idx) => (
                    <div
                      key={item._id || idx}
                      className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-sm transition"
                    >
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80'}
                        alt={item.title}
                        className="w-full h-36 object-cover"
                      />
                      <div className="p-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
                          {item.projectUrl && (
                            <a
                              href={item.projectUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-brand-600 hover:text-brand-800 p-0.5"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                        <p className="text-2xs text-slate-500 line-clamp-2">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Client Reviews */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Client Reviews & Testimonials ({reviews.length})
            </h3>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No reviews received yet.</p>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <ReviewCard key={rev._id} review={rev} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
