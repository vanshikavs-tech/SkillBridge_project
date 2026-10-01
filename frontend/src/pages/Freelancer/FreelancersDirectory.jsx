import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Users } from 'lucide-react';
import { userService } from '../../services/userService';
import { messageService } from '../../services/messageService';
import { FreelancerCard } from '../../components/FreelancerCard';
import { Loader } from '../../components/Loader';
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/authStore';

export const FreelancersDirectory = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [skill, setSkill] = useState('');
  const [minRating, setMinRating] = useState('');
  const [minRate, setMinRate] = useState('');
  const [maxRate, setMaxRate] = useState('');

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const fetchFreelancers = async () => {
    setLoading(true);
    try {
      const params = {
        ...(search && { search }),
        ...(skill && { skill }),
        ...(minRating && { minRating }),
        ...(minRate && { minRate }),
        ...(maxRate && { maxRate }),
      };
      const res = await userService.getFreelancers(params);
      setFreelancers(res.freelancers || []);
    } catch (err) {
      console.error('Failed to load talent:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreelancers();
  }, [minRating]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFreelancers();
  };

  const handleContact = async (freelancer) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const res = await messageService.getOrCreateConversation(freelancer._id);
      navigate('/messages', { state: { conversationId: res.conversation._id } });
    } catch (err) {
      alert('Failed to start chat conversation');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Find Top Freelancers</h1>
        <p className="text-xs text-slate-500 mt-1">
          Hire certified software engineers, product designers, and AI specialists.
        </p>
      </div>

      {/* Search and Filter Form */}
      <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name, title, or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white text-slate-700 font-medium"
          >
            <option value="">Any Rating</option>
            <option value="4.8">⭐ 4.8 & Above</option>
            <option value="4.5">⭐ 4.5 & Above</option>
            <option value="4.0">⭐ 4.0 & Above</option>
          </select>

          <Button type="submit" size="sm" variant="primary">
            Find Talent
          </Button>
        </div>
      </form>

      {/* Freelancers Cards Grid */}
      {loading ? (
        <Loader />
      ) : freelancers.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500">No freelancers found matching criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {freelancers.map((f) => (
            <FreelancerCard
              key={f._id}
              freelancer={f}
              onContact={handleContact}
            />
          ))}
        </div>
      )}
    </div>
  );
};
