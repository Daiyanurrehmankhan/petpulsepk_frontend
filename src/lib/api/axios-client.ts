import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add a request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // If sending FormData, remove Content-Type header to let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
      
      // Debug logging for FormData requests
      if (config.url?.includes('/vaccinations')) {
        console.log('=== AXIOS REQUEST (FormData) ===');
        console.log('URL:', config.url);
        console.log('Method:', config.method);
        console.log('Headers:', config.headers);
        console.log('FormData entries:');
        for (const [key, value] of config.data.entries()) {
          if (value instanceof File) {
            console.log(`  ${key}: File(${value.name}, ${value.size} bytes, type: ${value.type})`);
          } else {
            console.log(`  ${key}: ${value}`);
          }
        }
        console.log('================================');
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    // Debug logging for vaccination responses
    if (response.config.url?.includes('/vaccinations')) {
      console.log('=== AXIOS RESPONSE ===');
      console.log('URL:', response.config.url);
      console.log('Status:', response.status);
      console.log('Data:', response.data);
      console.log('=====================');
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;