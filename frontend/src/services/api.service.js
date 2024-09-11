import axios from 'axios';
import authHeader from './auth.header'; // Import the authHeader function

// Create an instance of axios
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/',  
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set token in request headers for authorization
apiClient.interceptors.request.use((config) => {
  const headers = authHeader(); // Get authorization headers dynamically
  config.headers = { ...config.headers, ...headers }; // Merge headers
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Common API service with CRUD methods
const apiService = {
  // GET request
  get: async (url, params = {}) => {
    try {
      const response = await apiClient.get(url, { params });
      return response.data;
    } catch (error) {
      console.error(`GET ${url} failed: `, error);
      throw error;
    }
  },

  // POST request
  post: async (url, data) => {
    try {
      const response = await apiClient.post(url, data);
      return response.data;
    } catch (error) {
      console.error(`POST ${url} failed: `, error);
      throw error;
    }
  },

  // PUT request (for updates)
  put: async (url, data) => {
    try {
      const response = await apiClient.put(url, data);
      return response.data;
    } catch (error) {
      console.error(`PUT ${url} failed: `, error);
      throw error;
    }
  },

  // DELETE request
  delete: async (url) => {
    try {
      const response = await apiClient.delete(url);
      return response.data;
    } catch (error) {
      console.error(`DELETE ${url} failed: `, error);
      throw error;
    }
  },

  // File upload (e.g., for profile pictures)
  upload: async (url, formData) => {
    try {
      const response = await apiClient.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`File upload ${url} failed: `, error);
      throw error;
    }
  },
};

export default apiService;
