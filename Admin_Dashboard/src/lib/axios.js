import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_URL,
  withCredentials: true,
});

// Add auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage (where zustand persist stores it)
    try {
      const authData = JSON.parse(localStorage.getItem('auth-storage') || '{}');
      const token = authData?.state?.token;
      
      if (token) {
        config.headers['auth-token'] = token;
      }
    } catch (e) {
      // Ignore parsing errors
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token expired or invalid - try to logout
      try {
        const authData = JSON.parse(localStorage.getItem('auth-storage') || '{}');
        if (authData?.state?.isAuthenticated) {
          localStorage.removeItem('auth-storage');
          window.location.href = '/login';
        }
      } catch (e) {
        // Ignore
      }
    }
    return Promise.reject(error);
  }
);
