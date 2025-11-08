import axios from 'axios';

// Base URL from environment variable or fallback to development URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Create axios instance with base URL and common headers
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
        return {
          ...response,
          data: response.data.data || {}
        };
      }
    }
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
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