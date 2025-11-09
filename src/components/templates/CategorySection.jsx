import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMoviesByCategory, getMoviesByCountry } from '../../services/apiService';
import MovieCard from '../molecules/MovieCard';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// Cache configuration
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
const getCacheKey = (categoryId, apiPath) => `cache_${apiPath}_${categoryId}`;

const CategorySection = ({ categoryId, categoryName, apiPath = 'the-loai' }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();
  const isMounted = useRef(true);
  const scrollTimeout = useRef(null);

  // Debounced scroll function
  const scroll = useCallback((direction) => {
    if (!scrollContainerRef.current) return;
    
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    scrollTimeout.current = setTimeout(() => {
      if (!scrollContainerRef.current) return;
      
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = Math.floor(clientWidth * 0.8);
      const scrollTo = direction === 'left' 
        ? Math.max(0, scrollLeft - scrollAmount)
        : scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }, 100);
  }, []);

  const fetchMovies = useCallback(async () => {
    if (!categoryId) return;
    
    const cacheKey = getCacheKey(categoryId, apiPath);
    
    try {
      // Check cache first
      const cachedData = localStorage.getItem(cacheKey);
      const now = Date.now();
      
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        if (now - timestamp < CACHE_DURATION) {
          if (isMounted.current) {
            setMovies(data);
            setLoading(false);
            setError(null);
            return; // Use cached data
          }
        }
      }

      setLoading(true);
      
      // Fetch from API
      const response = apiPath === 'quoc-gia'
        ? await getMoviesByCountry(categoryId, { limit: 20, page: 1 })
        : await getMoviesByCategory(categoryId, { limit: 20, page: 1 });
      
      // Process response data
      let moviesData = [];
      const responseData = response?.data || {};
      
      // Handle different response structures
      if (Array.isArray(responseData)) {
        moviesData = responseData;
      } else if (responseData.data) {
        if (Array.isArray(responseData.data)) {
          moviesData = responseData.data;
        } else if (responseData.data.data && Array.isArray(responseData.data.data)) {
          moviesData = responseData.data.data;
        } else if (responseData.data.items) {
          moviesData = responseData.data.items;
        } else if (responseData.data.results) {
          moviesData = responseData.data.results;
        }
      } else if (responseData.items) {
        moviesData = responseData.items;
      } else if (responseData.results) {
        moviesData = responseData.results;
      }

      if (!Array.isArray(moviesData)) {
        throw new Error('Invalid data format received from API');
      }

      // Update cache
      const cacheData = {
        data: moviesData,
        timestamp: now
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));

      if (isMounted.current) {
        setMovies(moviesData);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching movies:', err);
      if (isMounted.current) {
        setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra khi tải dữ liệu');
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [categoryId, apiPath]);

  useEffect(() => {
    isMounted.current = true;
    fetchMovies();
    
    return () => {
      isMounted.current = false;
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [fetchMovies]);

  if (loading) {
    return (
      <div className="bg-gray-900 text-white py-6">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Đang tải {categoryName}...</h2>
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-4">
            <h3 className="text-xl font-bold text-red-400 mb-2">Đã xảy ra lỗi</h3>
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 w-full">
      <div className="mx-auto relative">
        <div className="flex items-center justify-between mb-4 sm:mb-6 px-1">
          <h2 className="text-xl sm:text-2xl font-bold truncate max-w-[70%]">{categoryName}</h2>
          <button 
            onClick={() => navigate(`/category/${categoryId}/${encodeURIComponent(categoryName)}`)}
            className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm whitespace-nowrap ml-2 px-2 py-1 sm:px-3 sm:py-1.5 bg-gray-800/50 rounded-md hover:bg-gray-700/50 transition-colors"
          >
            Xem thêm
          </button>
        </div>

        <div className="relative">
          <div className="absolute left-0 top-[40%] -translate-y-1/2 z-10 group/left">
            <button
              onClick={() => scroll('left')}
              className="ml-2 p-2 bg-black/60 rounded-full text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#CC1100] focus:ring-offset-2 focus:ring-offset-gray-900 hidden md:flex items-center justify-center hover:bg-black/80 group-hover/left:bg-black/80"
              aria-label="Trước"
              style={{ height: '48px', width: '48px' }}
            >
              <ChevronLeftIcon className="h-6 w-6 sm:h-8 sm:w-8" />
            </button>
          </div>
          
          <div className="absolute right-0 top-[40%] -translate-y-1/2 z-10 group/right">
            <button
              onClick={() => scroll('right')}
              className="mr-2 p-2 bg-black/60 rounded-full text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#CC1100] focus:ring-offset-2 focus:ring-offset-gray-900 hidden md:flex items-center justify-center hover:bg-black/80 group-hover/right:bg-black/80"
              style={{ height: '48px', width: '48px' }}
              aria-label="Tiếp"
            >
              <ChevronRightIcon className="h-6 w-6 sm:h-8 sm:w-8" />
            </button>
          </div>
          
          <div 
            ref={scrollContainerRef}
            className="flex space-x-3 sm:space-x-4 pb-2 sm:pb-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-1"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={`loading-${index}`} className="shrink-0 w-32 sm:w-50">
                  <div className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse" />
                  <div className="mt-2 h-4 bg-gray-800 rounded animate-pulse" />
                  <div className="mt-1 h-3 w-3/4 bg-gray-800 rounded animate-pulse" />
                </div>
              ))
            ) : error ? (
              <div className="w-full text-center py-8 text-red-400">
                {error}
                <button 
                  onClick={fetchMovies}
                  className="ml-2 px-3 py-1 bg-blue-600 rounded hover:bg-blue-700 text-sm"
                >
                  Thử lại
                </button>
              </div>
            ) : Array.isArray(movies) && movies.length > 0 ? (
              movies.map((movie, index) => {
                const posterPath = movie.poster_url || movie.thumb_url || movie.poster_path ||
                  (movie.thumb?.medium || movie.thumb?.large || movie.thumb) ||
                  movie.thumbnail || movie.thumbnail_medium || movie.thumbnail_large;
                
                if (!posterPath) return null;
                
                const imdbRating = movie.tmdb?.vote_average || movie.quality || 
                  movie.rating || movie.vote_average || (movie.vote?.average) || 0;
                
                return (
                  <div key={`${movie.id || movie._id || index}`} className="shrink-0 w-32 sm:w-50 snap-start">
                    <MovieCard
                      id={movie.id || movie._id}
                      title={movie.title || movie.name || 'Không có tiêu đề'}
                      posterPath={posterPath}
                      releaseDate={movie.year || ''}
                      rating={imdbRating}
                      mediaType={movie.media_type || 'movie'}
                      loading={loading}
                    />
                  </div>
                );
              })
            ) : (
              <div className="w-full text-center py-8 text-gray-400">
                Không có phim nào được tìm thấy
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySection;
