import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchMovies } from '../services/apiService';
import { constructImageUrl } from '../services/apiService';
import LoadingSpinner from '../components/atoms/LoadingSpinner';

const ITEMS_PER_PAGE = 24;

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const keyword = searchParams.get('keyword') || '';
  
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const fetchSearchResults = useCallback(async (page = 1) => {
    if (!keyword.trim()) {
      setMovies([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await searchMovies({
        keyword: keyword.trim(),
        page,
        limit: ITEMS_PER_PAGE
      });

      if (response && response.data) {
        const processedMovies = (response.data.items || []).map(movie => ({
          ...movie,
          poster_url: constructImageUrl(
            movie.poster_url || 
            movie.thumb_url ||
            movie.poster_path || 
            movie.poster
          ),
          _id: movie._id || movie.id,
          title: movie.name || movie.title || movie.origin_name || 'Không có tiêu đề',
          name: movie.name || movie.title || movie.origin_name || 'Không có tiêu đề',
          slug: movie.slug || movie._id || movie.id
        }));
        setMovies(processedMovies);
        setTotalPages(response.data.totalPages || 0);
        setTotalItems(response.data.totalItems || 0);
      } else {
        setMovies([]);
        setTotalPages(0);
        setTotalItems(0);
      }
    } catch (err) {
      console.error('Error searching movies:', err);
      setError('Không thể tải kết quả tìm kiếm. Vui lòng thử lại.');
      setMovies([]);
      setTotalPages(0);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  const handleMovieClick = (movie) => {
    navigate(`/phim/${movie._id}/${movie.slug}`);
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchSearchResults(1);
  }, [keyword, fetchSearchResults]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchSearchResults(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };



  if (loading && currentPage === 1) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 pt-20">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {keyword ? `Kết quả tìm kiếm: "${keyword}"` : 'Tìm kiếm phim'}
          </h1>
          {totalItems > 0 && (
            <p className="text-gray-400">
              Tìm thấy {totalItems} kết quả
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-600 bg-opacity-20 border border-red-600 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!keyword.trim() && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">Vui lòng nhập từ khóa để tìm kiếm phim</p>
          </div>
        )}

        {keyword.trim() && movies.length === 0 && !loading && !error && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">Không tìm thấy phim nào phù hợp với "{keyword}"</p>
            <p className="text-gray-500 mt-2">Thử tìm với từ khóa khác nhé!</p>
          </div>
        )}

        {movies.length > 0 && (
          <>
            {loading && (
              <div className="flex justify-center py-4">
                <LoadingSpinner />
              </div>
            )}
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
          {movies.map((movie) => (
            <div 
              key={movie._id || movie.slug}
              className="bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:shadow-red-900/20 transition-all duration-300 cursor-pointer group border border-gray-800 hover:border-red-900/50"
              onClick={() => handleMovieClick(movie)}
            >
              {/* Movie Poster */}
              <div className="aspect-[2/3] relative overflow-hidden">
                <div className="relative w-full h-full bg-gray-800 flex items-center justify-center">
                  {movie.poster_url ? (
                    <img
                      src={movie.poster_url}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        console.warn('Failed to load image:', e.target.src, 'for movie:', movie.title);
                        e.target.style.display = 'none';
                        const parent = e.target.parentNode;
                        if (parent && !parent.querySelector('.fallback-text')) {
                          const fallbackDiv = document.createElement('div');
                          fallbackDiv.className = 'fallback-text w-full h-full flex items-center justify-center text-gray-600 text-sm px-4 text-center';
                          fallbackDiv.textContent = 'Không tải được ảnh';
                          parent.appendChild(fallbackDiv);
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm px-4 text-center">
                      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Overlay với Play Button */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Episode Info Overlay */}
                  {movie.episode_current && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                      <p className="text-white text-xs font-semibold">
                        {movie.episode_current}
                        {movie.episode_total > 0 && ` / ${movie.episode_total}`}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Quality & Language Badge */}
                <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                  {movie.quality && (
                    <span className="bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-lg backdrop-blur-sm">
                      {movie.quality}
                    </span>
                  )}
                  {movie.lang && (
                    <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-lg backdrop-blur-sm">
                      {movie.lang}
                    </span>
                  )}
                </div>
                
                {/* IMDB Rating */}
                {movie.imdb_rating > 0 && (
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center shadow-lg backdrop-blur-sm">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {movie.imdb_rating.toFixed(1)}
                  </div>
                )}
              </div>
              
              {/* Movie Info */}
              <div className="p-3">
                <h3 
                  className="font-semibold text-sm text-gray-100 mb-1.5 line-clamp-2 min-h-[40px] group-hover:text-red-500 transition-colors" 
                  title={movie.title}
                >
                  {movie.title}
                </h3>
                
                {/* Origin Name */}
                {movie.origin_name && movie.origin_name !== movie.title && (
                  <p className="text-xs text-gray-500 mb-2 line-clamp-1" title={movie.origin_name}>
                    {movie.origin_name}
                  </p>
                )}
                
                {/* Year and Type */}
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-gray-400">{movie.year || 'N/A'}</span>
                  <span className="bg-gray-800 px-2 py-1 rounded-md text-gray-300 capitalize border border-gray-700">
                    {movie.type === 'series' ? 'Phim bộ' : 'Phim lẻ'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination - Dark Theme */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center mt-12 space-y-6">
            <div className="flex space-x-2">
              {/* First Page */}
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="px-3 sm:px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-800 hover:border-red-900/50 transition-all duration-300 text-gray-300 hover:text-red-500 text-sm sm:text-base"
                title="Trang đầu"
              >
                &laquo;
              </button>
              
              {/* Previous Page */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 sm:px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-800 hover:border-red-900/50 transition-all duration-300 text-gray-300 hover:text-red-500 text-sm sm:text-base"
                title="Trang trước"
              >
                &lsaquo;
              </button>
              
              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base ${
                      currentPage === pageNum 
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-900/50 border border-red-500' 
                        : 'bg-gray-900 border border-gray-800 hover:bg-gray-800 hover:border-red-900/50 text-gray-300 hover:text-red-500'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {/* Next Page */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 sm:px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-800 hover:border-red-900/50 transition-all duration-300 text-gray-300 hover:text-red-500 text-sm sm:text-base"
                title="Trang sau"
              >
                &rsaquo;
              </button>
              
              {/* Last Page */}
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 sm:px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-800 hover:border-red-900/50 transition-all duration-300 text-gray-300 hover:text-red-500 text-sm sm:text-base"
                title="Trang cuối"
              >
                &raquo;
              </button>
            </div>
            
            {/* Page Info */}
            <div className="flex items-center space-x-3 text-sm text-gray-400">
              <span className="bg-gray-900 px-4 py-2 rounded-lg border border-gray-800">
                Trang <span className="text-red-500 font-semibold">{currentPage}</span> / {totalPages}
              </span>
            </div>
          </div>
        )}
      </>
      )}
    </div>
  </div>
  );
};

export default SearchPage;
