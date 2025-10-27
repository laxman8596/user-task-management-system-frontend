import axios from 'axios';

// Dynamic API URL detection
const getApiUrl = () => {
  // Check if running locally (localhost or 127.0.0.1)
  const isLocal = window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1' ||
                  window.location.hostname === '';
  
  if (isLocal) {
    return 'http://localhost:5000';
  } else {
    return 'https://user-task-management-system-backend-njx9.onrender.com';
  }
};

// Set base URL dynamically
axios.defaults.baseURL = getApiUrl();
axios.defaults.withCredentials = true;

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh')) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axios(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post('/api/auth/refresh', {}, { 
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        });
        const { accessToken } = response.data;
        
        if (accessToken) {
          const auth = JSON.parse(localStorage.getItem('auth') || '{}');
          auth.accessToken = accessToken;
          localStorage.setItem('auth', JSON.stringify(auth));
          
          processQueue(null, accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          
          return axios(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        processQueue(refreshError, null);
        localStorage.removeItem('auth');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Add request interceptor to include auth token
axios.interceptors.request.use(
  (config) => {
    const auth = JSON.parse(localStorage.getItem('auth') || '{}');
    if (auth.accessToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${auth.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;