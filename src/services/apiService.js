import axios from 'axios';

// Base URL configuration
const getBaseUrl = () => {
  // Check if we're in production (Vercel)
  if (import.meta.env.PROD) {
    // In production, use the production API URL
    return import.meta.env.VITE_API_BASE_URL || 'https://your-production-api.com/api';
  }
  // In development, use localhost
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
};

const API_BASE_URL = getBaseUrl();
console.log('Using API Base URL:', API_BASE_URL); // Debug log

// Create axios instance with base URL and common headers
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Increased timeout to 15 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // If your API uses cookies/sessions
});

// Add a request interceptor to log requests
api.interceptors.request.use(
  (config) => {
    console.log(`[${config.method?.toUpperCase()}] ${config.url}`, config.params || '');
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add request interceptor for error handling
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    // config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling and data extraction
api.interceptors.response.use(
  (response) => {
    console.log(`[${response.status}] ${response.config.url}`, response.data);
    
    // Handle successful responses with the {status, msg, data} format
    if (response.data && typeof response.data === 'object') {
      // If the response has a status field, it's using the custom format
      if (response.data.status !== undefined) {
        // If status is false, treat it as an error
        if (response.data.status === false) {
          const error = new Error(response.data.msg || 'API request failed');
          error.response = response;
          return Promise.reject(error);
        }
        // Return the data part of the response
        const result = {
          ...response,
          data: response.data.data || {}
        };
        return result;
      }
    }
    return response;
  },
  (error) => {
    const errorMessage = {
      message: error.message,
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    };
    
    console.error('API Error:', errorMessage);
    
    // Handle specific error statuses
    if (error.response) {
      // Server responded with a status code outside 2xx
      if (error.response.status === 401) {
        // Handle unauthorized (e.g., redirect to login)
        console.error('Unauthorized - redirecting to login');
        // window.location.href = '/login';
      } else if (error.response.status === 404) {
        console.error('API endpoint not found:', error.config.url);
      } else if (error.response.status >= 500) {
        console.error('Server error:', error.response.status);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// ==================== COMMON ====================

export const categories = [
  { slug: 'hanh-dong', name: 'Hành Động' },
  { slug: 'tinh-cam', name: 'Tình Cảm' },
  { slug: 'hai-huoc', name: 'Hài Hước' },
  { slug: 'kinh-di', name: 'Kinh Dịch' },
  { slug: 'hoat-hinh', name: 'Hoạt Hình' },
  { slug: 'phieu-luu', name: 'Phiêu Lưu' },
  { slug: 'vien-tuong', name: 'Viễn Tưởng' },
  { slug: 'co-trang', name: 'Cổ Trang' },
  { slug: 'than-thoai', name: 'Thần Thoại' },
  { slug: 'tai-lieu', name: 'Tài Liệu' },
];

// ==================== MOVIES ====================

export const getNewMovies = (page = 1, limit = 24) => {
  return api.get('/phim-moi', { params: { page, limit } });
};

export const getSingleMovies = (params = {}) => {
  return api.get('/phim-le', { params });
};

export const getSeriesMovies = (params = {}) => {
  return api.get('/phim-bo', { params });
};

export const getMovieList = (type, params = {}) => {
  return api.get(`/danh-sach/${type}`, { params });
};

// ==================== MOVIE DETAILS ====================

export const getMovieDetail = (slug) => {
  return api.get('/phim', { params: { slug } });
};

export const getMovieBySlug = (slug) => {
  return api.get(`/phim/${slug}`);
};

export const getMovieByTMDB = (type, id) => {
  return api.get(`/tmdb/${type}/${id}`);
};

// ==================== CATEGORIES ====================

export const getCategories = () => {
  return api.get('/the-loai');
};

export const getMoviesByCategory = (slug, params = {}) => {
  return api.get(`/the-loai/${slug}`, { params });
};

// ==================== COUNTRIES ====================

export const getCountries = () => {
  return api.get('/quoc-gia');
};

export const getMoviesByCountry = (slug, params = {}) => {
  return api.get(`/quoc-gia/${slug}`, { params });
};

// ==================== YEARS ====================

export const getMoviesByYear = (year, params = {}) => {
  return api.get(`/nam/${year}`, { params });
};

// ==================== SEARCH ====================

export const searchMovie = (params = {}) => {
  return api.get('/tim-kiem', { params });
};

// ==================== UTILS ====================

export const convertImageToWebP = (url) => {
  return `${API_BASE_URL}/image?url=${encodeURIComponent(url)}`;
};