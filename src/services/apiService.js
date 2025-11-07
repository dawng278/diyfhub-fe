// File: src/services/apiService.js
import axios from 'axios';

// Lấy URL cơ sở từ biến môi trường
// - Ở Local: Nó sẽ là '/api' (và Vite Proxy sẽ chuyển nó đến port 3001)
// - Trên Vercel: Nó sẽ là 'https://diyfhub-be.onrender.com/api' (do bạn cài đặt)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ==================== PHIM MỚI ====================

// Lấy phim mới cập nhật (V1)
export const getNewMovies = (page = 1) => {
    return axios.get(`${API_BASE_URL}/phim-moi`, {
        params: { page }
    });
};

// Lấy phim mới cập nhật V2
export const getNewMoviesV2 = (page = 1) => {
    return axios.get(`${API_BASE_URL}/phim-moi-v2`, {
        params: { page }
    });
};

// Lấy phim mới cập nhật V3
export const getNewMoviesV3 = (page = 1) => {
    return axios.get(`${API_BASE_URL}/phim-moi-v3`, {
        params: { page }
    });
};

// ==================== CHI TIẾT PHIM ====================

// Lấy chi tiết phim theo slug (query param)
export const getMovieDetail = (slug) => {
    return axios.get(`${API_BASE_URL}/phim`, {
        params: { slug }
    });
};

// Lấy chi tiết phim theo slug (path param)
export const getMovieBySlug = (slug) => {
    return axios.get(`${API_BASE_URL}/phim/${slug}`);
};

// Lấy thông tin phim theo TMDB ID
// type: 'tv' hoặc 'movie'
export const getMovieByTMDB = (type, id) => {
    return axios.get(`${API_BASE_URL}/tmdb/${type}/${id}`);
};

// ==================== DANH SÁCH TỔNG HỢP ====================

// Lấy danh sách phim theo loại
// type: 'phim-bo', 'phim-le', 'tv-shows', 'hoat-hinh', 'phim-vietsub', 'phim-thuyet-minh', 'phim-long-tieng'
// params: { page, sort_field, sort_type, sort_lang, category, country, year, limit }
export const getMovieList = (type, params = {}) => {
    return axios.get(`${API_BASE_URL}/danh-sach/${type}`, {
        params
    });
};

// ==================== TÌM KIẾM ====================

// Tìm kiếm phim
// params: { keyword, page, sort_field, sort_type, sort_lang, category, country, year, limit }
export const searchMovie = (params = {}) => {
    return axios.get(`${API_BASE_URL}/tim-kiem`, {
        params
    });
};

// ==================== THỂ LOẠI ====================

// Lấy danh sách thể loại
export const getCategories = () => {
    return axios.get(`${API_BASE_URL}/the-loai`);
};

// Lấy phim theo thể loại
// slug: slug của thể loại (vd: 'hanh-dong')
// params: { page, sort_field, sort_type, sort_lang, country, year, limit }
export const getMoviesByCategory = (slug, params = {}) => {
    return axios.get(`${API_BASE_URL}/the-loai/${slug}`, {
        params
    });
};

// ==================== QUỐC GIA ====================

// Lấy danh sách quốc gia
export const getCountries = () => {
    return axios.get(`${API_BASE_URL}/quoc-gia`);
};

// Lấy phim theo quốc gia
// slug: slug của quốc gia (vd: 'trung-quoc')
// params: { page, sort_field, sort_type, sort_lang, category, year, limit }
export const getMoviesByCountry = (slug, params = {}) => {
    return axios.get(`${API_BASE_URL}/quoc-gia/${slug}`, {
        params
    });
};

// ==================== NĂM ====================

// Lấy phim theo năm
// year: năm phát hành (vd: 2024)
// params: { page, sort_field, sort_type, sort_lang, category, country, limit }
export const getMoviesByYear = (year, params = {}) => {
    return axios.get(`${API_BASE_URL}/nam/${year}`, {
        params
    });
};

// ==================== CHUYỂN ĐỔI ẢNH ====================

// Chuyển đổi ảnh sang WEBP
// url: URL ảnh gốc từ PhimAPI
export const convertImageToWebP = (url) => {
    return `${API_BASE_URL}/image?url=${encodeURIComponent(url)}`;
};