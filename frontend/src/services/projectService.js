import API from './api';

export const projectService = {
  getProjects: async (params = {}) => {
    const response = await API.get('/projects', { params });
    return response.data;
  },

  getProjectById: async (id) => {
    const response = await API.get(`/projects/${id}`);
    return response.data;
  },

  createProject: async (projectData) => {
    const response = await API.post('/projects', projectData);
    return response.data;
  },

  updateProject: async (id, projectData) => {
    const response = await API.put(`/projects/${id}`, projectData);
    return response.data;
  },

  deleteProject: async (id) => {
    const response = await API.delete(`/projects/${id}`);
    return response.data;
  },

  getClientProjects: async () => {
    const response = await API.get('/projects/client/my-projects');
    return response.data;
  },

  getRecommendedProjects: async () => {
    const response = await API.get('/projects/recommended');
    return response.data;
  },
};
