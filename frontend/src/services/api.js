import axios from 'axios';

/**
 * Centralized Axios API Client
 * 
 * Concept:
 * Uses Axios request interceptors to automatically attach the stored JWT token
 * to the `Authorization` header of every outgoing HTTP request.
 * Response interceptor handles expired sessions gracefully.
 */
const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization Bearer token if present
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('skillbridge_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for session expiration
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, clean up token if invalid
      if (
        error.response.data?.message?.includes('expired') ||
        error.response.data?.message?.includes('invalid')
      ) {
        localStorage.removeItem('skillbridge_token');
        localStorage.removeItem('skillbridge_user');
      }
    }
    return Promise.reject(error);
  }
);

export default API;
