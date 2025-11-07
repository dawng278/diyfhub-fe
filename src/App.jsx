import React from 'react'
import Header from './components/layout/header.jsx'
// 1. Imports cho State và Effect
import { useState, useEffect } from 'react';
// 2. Import hàm gọi API từ service
import { getNewMovies } from './services/apiService';

function App() {
  // 3. Tạo state để lưu trữ dữ liệu
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 4. useEffect sẽ chạy 1 lần khi component tải
  useEffect(() => {
    // Định nghĩa 1 hàm async để gọi API
    const fetchData = async () => {
      try {
        setLoading(true);
        // Gọi API
        const response = await getNewMovies(1);
        
        // Dùng console.log để kiểm tra cấu trúc dữ liệu trả về
        console.log('API Response:', response.data);

        // Lưu dữ liệu vào state (giả sử dữ liệu nằm trong .items)
        setMovies(response.data.items || []);

      } catch (err) {
        console.error('Lỗi khi gọi API:', err);
        setError(err); // Lưu lỗi nếu có
      } finally {
        setLoading(false); // Dừng loading
      }
    };

    fetchData(); // Chạy hàm
  }, []); // [] = chỉ chạy 1 lần

  // 5. Quyết định nội dung sẽ hiển thị
  let content;
  if (loading) {
    content = <p className="text-white text-center">Đang tải phim...</p>;
  } else if (error) {
    content = <p className="text-red-500 text-center">Lỗi: {error.message}. Vui lòng kiểm tra F12.</p>;
  } else {
    // Hiển thị danh sách phim
    content = (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {movies.map(movie => (
          // Giả sử key là _id và có poster_url
          <div key={movie._id} className="text-white">
            <img src={movie.poster_url} alt={movie.name} className="rounded-md" />
            <h3 className="mt-2 truncate">{movie.name}</h3>
          </div>
        ))}
      </div>
    );
  }

  // 6. Trả về JSX của bạn, gộp với nội dung
  return (
    <div className='min-h-screen bg-blue-950'>
      <Header />
      <main className="container mx-auto p-4">
        {content} {/* Hiển thị nội dung ở đây */}
      </main>
    </div>
  )
}

export default App