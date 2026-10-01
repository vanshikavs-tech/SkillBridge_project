import API from './api';

export const paymentService = {
  createCheckout: async (payload) => {
    const response = await API.post('/payments/create-checkout', payload);
    return response.data;
  },

  getTransactions: async (params = {}) => {
    const response = await API.get('/payments/history', { params });
    return response.data;
  },
};
