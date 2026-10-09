import axios from 'axios';

// CRA uses REACT_APP_ prefix. Fall back to localhost for local dev.
const BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:5002';

const api = axios.create({
  baseURL: BASE_URL,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jobtrackr_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, clear token and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jobtrackr_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
