import axios from 'axios';

// Create a centralized axios instance
const axiosClient = axios.create({
  // ✨ FIX: 'import meta.env' ko badal kar 'import.meta.env' kiya aur Vite format kiya
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api', 
  timeout: 10000, // 10 seconds timeout limit
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/* ==========================================================================
   1. REQUEST INTERCEPTOR (Automating Token Injection)
   ========================================================================== */
axiosClient.interceptors.request.use(
  (config) => {
    // Local storage se active token fetch karein
    const token = localStorage.getItem('glowbtech_token');
    
    // Agar token maujood hai, toh usey headers mein merge karein
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/* ==========================================================================
   2. RESPONSE INTERCEPTOR (Global Error Handling & Session Expiry Checks)
   ========================================================================== */
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Agar server se 401 Unauthorized ya 403 Forbidden error aata hai (Expired Token)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn('Session expired or unauthorized node access. Purging token...');
      
      localStorage.removeItem('glowbtech_token');
      
      // Infinite loops se bachne ke liye check ki user pehle se login page par toh nahi hai
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;