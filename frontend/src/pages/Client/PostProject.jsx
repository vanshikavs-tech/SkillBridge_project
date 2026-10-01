import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { projectService } from '../../services/projectService';
import { Button } from '../../components/Button';

export const PostProject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: 'Web Development',
    description: '',
    skills: '',
    minBudget: '20000',
    maxBudget: '40000',
    deadlineDays: '30',
    experienceLevel: 'INTERMEDIATE',
  });

  const categories = [
    'Web Development',
    'UI/UX Design',
    'Data Science & AI',
    'Mobile Apps',
    'DevOps & Cloud',
    'Content & Writing',
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (Number(formData.maxBudget) < Number(formData.minBudget)) {
      setError('Maximum budget must be equal or greater than minimum budget');
      return;
    }

    setLoading(true);

    try {
      const deadlineDate = new Date();
      deadlineDate.setDate(deadlineDate.getDate() + Number(formData.deadlineDays || 30));

      const payload = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
        budget: {
          min: Number(formData.minBudget),
          max: Number(formData.maxBudget),
        },
        deadline: deadlineDate,
        experienceLevel: formData.experienceLevel,
      };

      const res = await projectService.createProject(payload);
      navigate(`/client/projects/${res.project._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post project. Please verify all fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Project Creation
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Post a New Project & Hire Talent
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Describe your project goals, required skills, and budget to receive bids from top freelancers.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Project Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Build an E-commerce Website with React and Stripe"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          {/* Category & Experience Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Experience Level *
              </label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
              >
                <option value="ENTRY">Entry Level</option>
                <option value="INTERMEDIATE">Intermediate (Recommended)</option>
                <option value="EXPERT">Expert Specialist</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Project Description *
            </label>
            <textarea
              name="description"
              required
              rows={5}
              value={formData.description}
              onChange={handleChange}
              placeholder="Detail the deliverables, workflow, architecture, technical requirements, and acceptance criteria..."
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Skills Required */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Required Skills (comma-separated) *
            </label>
            <input
              type="text"
              name="skills"
              required
              value={formData.skills}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB, Stripe, Tailwind CSS"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
            <span className="text-2xs text-slate-400 mt-1 block">
              Used by the SkillBridge recommendation algorithm to match matching talent.
            </span>
          </div>

          {/* Budget Range & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Min Budget (₹) *
              </label>
              <input
                type="number"
                name="minBudget"
                required
                min={100}
                value={formData.minBudget}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Max Budget (₹) *
              </label>
              <input
                type="number"
                name="maxBudget"
                required
                min={100}
                value={formData.maxBudget}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Estimated Days *
              </label>
              <input
                type="number"
                name="deadlineDays"
                required
                min={1}
                value={formData.deadlineDays}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => navigate('/client/dashboard')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={loading}
              className="shadow-md"
            >
              {loading ? 'Publishing Project...' : 'Publish Project Now'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
