// File: src/services/apiService.js
import axios from 'axios';

// 1. Lấy URL cơ sở từ biến môi trường
// - Ở Local: Nó sẽ là '/api' (và Vite Proxy sẽ chuyển nó đến port 3001)
// - Trên Vercel: Nó sẽ là 'https://diyfhub-be.onrender.com/api' (do bạn cài đặt)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 2. Hàm lấy phim mới
export const getNewMovies = (page = 1) => {
    // Sẽ gọi: [API_BASE_URL]/phim-moi?page=1
    return axios.get(`${API_BASE_URL}/phim-moi`, {
        params: { page: page }
    });
};

// 3. Hàm lấy chi tiết phim
export const getMovieDetail = (slug) => {
    // Sẽ gọi: [API_BASE_URL]/phim?slug=ten-phim
    return axios.get(`${API_BASE_URL}/phim`, {
        params: { slug: slug }
    });
};

// 4. (Ví dụ) Hàm tìm kiếm
export const searchMovie = (keyword) => {
    return axios.get(`${API_BASE_URL}/api/tim-kiem`, { // Giả sử BE của bạn có endpoint này
         params: { keyword: keyword }
    });
};