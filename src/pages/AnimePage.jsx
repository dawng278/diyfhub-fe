import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMoviesByCategory } from '../services/apiService';

const AnimePage = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const ITEMS_PER_PAGE = 24;

  const constructImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    if (url.startsWith('/')) {
      return `https://phimimg.com${url}`;
    }
    return `https://phimimg.com/${url}`;
  };

  const fetchMovies = useCallback(async (page = 1) => {
    console.log('=== fetchMovies called with page:', page, '===');
    setLoading(true);
    setError(null);
    
    try {
      console.log('Calling getMoviesByCategory for hoat-hinh...');
      // Try with 'hoathinh' (no dash) as the API might expect this format
      const response = await getMoviesByCategory('hoat-hinh', {
        page: page,
        limit: ITEMS_PER_PAGE,
        sortField: 'modified.time',
        sortType: 'desc'
      });
      
      console.log('API response received:', response);
      
      if (response && response.data) {
        const moviesData = response.data || [];
        const paginationData = response.pagination || {};
        
        console.log('Total anime movies from API:', moviesData.length);
        console.log('Sample movies:', moviesData.slice(0, 3));
        
        // Process movies data
        const processedMovies = moviesData.map(movie => ({
          ...movie,
          poster_url: constructImageUrl(movie.poster_url || movie.thumb_url || movie.poster),
          _id: movie._id || movie.id,
          slug: movie.slug,
          title: movie.name || movie.title,
          imdb_rating: movie.tmdb?.vote_average || 0,
          quality: movie.quality || movie.lang || 'HD',
          episode_current: movie.episode_current || '',
          episode_total: movie.episode_total || 0,
          year: movie.year || '',
          time: movie.time || '',
          lang: movie.lang || 'Vietsub'
        }));
        
        console.log('Setting movies:', processedMovies.length);
        setMovies(processedMovies);
        
        // Set pagination from API response
        setTotalItems(paginationData.totalItems || 0);
        setTotalPages(paginationData.totalPages || 1);
        setCurrentPage(paginationData.currentPage || page);
        
        console.log('Pagination set - Total:', paginationData.totalItems, 'Pages:', paginationData.totalPages);
      } else {
        console.log('No data in response');
        setMovies([]);
      }
    } catch (err) {
      console.error('Error fetching anime movies:', err);
      setError('Không thể tải danh sách phim anime. Vui lòng thử lại sau.');
    } finally {
      console.log('fetchMovies completed, setting loading to false');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('=== AnimePage useEffect triggered ===');
    fetchMovies(1);
  }, [fetchMovies]);

  const handleMovieClick = (movie) => {
    navigate(`/phim/${movie._id}/${movie.slug}`);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchMovies(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-800 rounded-xl aspect-[2/3] mb-3"></div>
                <div className="h-4 bg-gray-800 rounded-lg w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-800 rounded-lg w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#030712] py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-gray-900 rounded-xl shadow-2xl p-8 text-center border border-gray-800">
            <div className="mb-4">
              <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-500 mb-4">Có lỗi xảy ra</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => fetchMovies(currentPage)}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
              >
                Thử lại
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 font-semibold border border-gray-700"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="min-h-screen bg-[#030712] py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-gray-900 rounded-xl shadow-2xl p-8 text-center border border-gray-800">
            <div className="mb-4">
              <svg className="w-16 h-16 text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-200 mb-4">Không tìm thấy phim anime</h2>
            <p className="text-gray-400 mb-6">Không có phim anime nào được tìm thấy.</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] py-8">
      <div className="container mx-auto px-4">
        {/* Header với gradient */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-500 via-red-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Phim Anime
            {totalItems > 0 && <span className="text-gray-500 ml-2">({totalItems} phim)</span>}
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-red-500 to-pink-600 rounded-full"></div>
        </div>
        
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
                
                {/* Quality Badge */}
                {movie.quality && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">
                    {movie.quality}
                  </div>
                )}
                
                {/* IMDB Rating */}
                {movie.imdb_rating > 0 && (
                  <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {movie.imdb_rating.toFixed(1)}
                  </div>
                )}
              </div>
              
              {/* Movie Info */}
              <div className="p-4">
                <h3 className="font-bold text-white mb-2 line-clamp-2 min-h-[3rem] text-sm">
                  {movie.title}
                </h3>
                
                <div className="space-y-1 text-xs text-gray-400">
                  {movie.year && (
                    <div className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {movie.year}
                    </div>
                  )}
                  
                  {movie.time && (
                    <div className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {movie.time}
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4" />
                    </svg>
                    {movie.lang || 'Vietsub'}
                  </div>
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
      </div>
    </div>
  );
};

export default AnimePage;