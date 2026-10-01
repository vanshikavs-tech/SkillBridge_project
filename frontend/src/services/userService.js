import API from './api';

export const userService = {
  getFreelancers: async (params = {}) => {
    const response = await API.get('/users/freelancers', { params });
    return response.data;
  },

  getProfile: async (id) => {
    const response = await API.get(`/users/${id}`);
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await API.put('/users/profile', profileData);
    return response.data;
  },

  addPortfolioItem: async (portfolioData) => {
    const response = await API.post('/users/portfolio', portfolioData);
    return response.data;
  },

  deletePortfolioItem: async (itemId) => {
    const response = await API.delete(`/users/portfolio/${itemId}`);
    return response.data;
  },
};
