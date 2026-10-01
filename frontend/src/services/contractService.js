import API from './api';

export const contractService = {
  getContracts: async () => {
    const response = await API.get('/contracts');
    return response.data;
  },

  getContractById: async (id) => {
    const response = await API.get(`/contracts/${id}`);
    return response.data;
  },

  updateMilestone: async (contractId, milestoneId, data) => {
    const response = await API.put(`/contracts/${contractId}/milestones/${milestoneId}`, data);
    return response.data;
  },

  completeContract: async (id) => {
    const response = await API.post(`/contracts/${id}/complete`);
    return response.data;
  },
};
