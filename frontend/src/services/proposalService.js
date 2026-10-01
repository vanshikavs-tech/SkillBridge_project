import API from './api';

export const proposalService = {
  submitProposal: async (projectId, proposalData) => {
    const response = await API.post(`/projects/${projectId}/proposals`, proposalData);
    return response.data;
  },

  getProjectProposals: async (projectId) => {
    const response = await API.get(`/projects/${projectId}/proposals`);
    return response.data;
  },

  getMyProposals: async () => {
    const response = await API.get('/proposals/my-proposals');
    return response.data;
  },

  acceptProposal: async (proposalId) => {
    const response = await API.post(`/proposals/${proposalId}/accept`);
    return response.data;
  },

  rejectProposal: async (proposalId) => {
    const response = await API.post(`/proposals/${proposalId}/reject`);
    return response.data;
  },

  withdrawProposal: async (proposalId) => {
    const response = await API.delete(`/proposals/${proposalId}`);
    return response.data;
  },
};
