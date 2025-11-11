import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MovieCard from '../molecules/MovieCard';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// Add axios response interceptor to log all responses
axios.interceptors.response.use(
  response => {
    console.log('Response:', response.config.url, response.data);
    return response;
  },
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const CategoryMovies = () => {
  const { categoryId, categoryName: categoryNameParam } = useParams();
  const [categoryName] = useState(() => {
    return decodeURIComponent(categoryNameParam || 'Thể loại');
  });
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const scrollContainerRef = useRef(null);
  
  // Function to retry fetching movies
  const retryFetch = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
    setLoading(true);
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth * 0.7 
        : scrollLeft + clientWidth * 0.7;
      
      scrollContainerRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchMoviesByCategory = async () => {
      if (!isMounted) return;
      try {
        setLoading(true);
        console.log('Fetching category with ID/Slug:', categoryId, 'Name:', categoryName);
        
        if (!categoryId) {
          throw new Error('Không tìm thấy ID thể loại');
        }
        
        // Try different API endpoints and parameters
        const endpoints = [
          // Try with ID first
          `/api/the-loai/${categoryId}`,
          // Try with category name if available
          categoryName && `/api/the-loai/${encodeURIComponent(categoryName.toLowerCase())}`,
          // Try with different pagination
          `/api/the-loai/${categoryId}?page=1&limit=50`
        ].filter(Boolean); // Remove any undefined endpoints

        let lastError = null;
        
        // Try each endpoint until we get movies or run out of endpoints
        for (const endpoint of endpoints) {
          try {
            console.log('Trying endpoint:', endpoint);
            const response = await axios.get(endpoint, {
              params: { 
                _t: Date.now() // Cache buster
              },
              timeout: 8000, // 8 second timeout
              validateStatus: (status) => status < 500 // Don't reject on 404
            });
            
            if (!isMounted) return;
            
            console.log('API Response from', endpoint, ':', response.data);
            
            // Try different response structures
            const responseData = response.data;
            let moviesData = [];
            
            // Check different possible response structures
            if (responseData?.data?.data) {
              moviesData = responseData.data.data;
            } else if (responseData?.data?.items) {
              moviesData = responseData.data.items;
            } else if (responseData?.data) {
              moviesData = Array.isArray(responseData.data) ? responseData.data : [];
            } else if (Array.isArray(responseData)) {
              moviesData = responseData;
            } else if (responseData?.items) {
              moviesData = responseData.items;
            } else if (responseData?.data?.movies) {
              moviesData = responseData.data.movies;
            }
            
            if (moviesData?.length > 0) {
              console.log(`Found ${moviesData.length} movies for category:`, categoryName);
              setMovies(moviesData);
              setError(null);
              return; // Exit if we found movies
            }
            
          } catch (err) {
            console.error('Error with endpoint', endpoint, ':', err.message);
            lastError = err;
            // Continue to next endpoint
          }
        }
        
        // If we get here, no endpoint worked
        const errorMessage = lastError?.response?.data?.message || 
                           `Không tìm thấy phim nào trong thể loại "${categoryName}"`;
        
        console.warn('No movies found after trying all endpoints:', {
          categoryId,
          categoryName,
          lastError: lastError?.message,
          response: lastError?.response?.data,
          endpointsTried: endpoints
        });
        
        if (retryCount < 2) {
          console.log(`Retrying... Attempt ${retryCount + 1}/2`);
          setTimeout(() => retryFetch(), 1500);
          return;
        }
        
        setError({
          message: errorMessage,
          canRetry: true,
          details: lastError?.response?.data || lastError?.message
        });
      } catch (err) {
        console.error('Error fetching movies by category:', {
          message: err.message,
          response: err.response?.data,
          config: {
            url: err.config?.url,
            method: err.config?.method,
            params: err.config?.params
          }
        });
        const errorMessage = `Lỗi: ${err.message || 'Không thể tải danh sách phim'}`;
        console.error('API Error:', {
          message: err.message,
          code: err.code,
          status: err.response?.status,
          url: err.config?.url
        });
        
        if (retryCount < 2 && !err.response) {
          console.log(`Retrying... Attempt ${retryCount + 1}/2`);
          setTimeout(() => retryFetch(), 1000);
          return;
        }
        
        setError({
          message: errorMessage,
          canRetry: true,
          details: err.response?.data || err.message
        });
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchMoviesByCategory();
    } else {
      setError({
        message: 'Không tìm thấy ID thể loại',
        canRetry: false
      });
      setLoading(false);
    }
    
    return () => {
      isMounted = false;
    };
  }, [categoryId, categoryName, navigate, retryCount]);

  if (loading) {
    return (
      <div className="bg-gray-900 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">
              {categoryName ? `Đang tải phim thể loại ${categoryName}...` : 'Đang tải danh sách phim...'}
            </h1>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    const isNotFound = error.includes('Không tìm thấy');
    const isNetworkError = error.includes('Network Error') || error.includes('timeout');
    
    return (
      <div className="bg-gray-900 text-white py-6 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-6 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-500 mb-4">
              {isNotFound ? 'Không tìm thấy thể loại' : 'Đã xảy ra lỗi'}
            </h2>
            <div className="text-gray-300 max-w-2xl mx-auto mb-8 space-y-4">
              <p>
                {isNotFound 
                  ? `Không tìm thấy thể loại với ID/Slug: ${categoryId}`
                  : isNetworkError
                    ? 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.'
                    : error}
              </p>
              
              {(isNotFound || isNetworkError) && (
                <div className="mt-4 text-sm bg-gray-800/50 p-4 rounded-lg">
                  <p className="mb-2">Bạn có thể thử:</p>
                  <ul className="list-disc list-inside space-y-1 text-left max-w-md mx-auto">
                    <li>Kiểm tra lại đường dẫn URL</li>
                    <li>Quay lại trang danh sách thể loại để chọn thể loại khác</li>
                    {isNetworkError && (
                      <li>Kiểm tra kết nối mạng và thử lại</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition-colors"
              >
                Thử lại
              </button>
              <button 
                onClick={() => navigate('/the-loai')}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-md text-white transition-colors"
              >
                Xem tất cả thể loại
              </button>
              <button 
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-800 rounded-md text-white transition-colors"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white py-6">
      <div className="container mx-auto px-4">
        {categoryName && (
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 rounded-full hover:bg-gray-800 transition-colors"
              aria-label="Quay lại"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold">
              {decodeURIComponent(categoryName || 'Thể loại')}
            </h1>
          </div>
        )}

        {movies.length > 0 ? (
          <div className="relative group">
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors hidden md:block"
              aria-label="Trước"
            >
              <ChevronLeftIcon className="h-8 w-8" />
            </button>
            
            <div 
              ref={scrollContainerRef}
              className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide"
            >
              {movies.map((movie, index) => {
                // Debug log for each movie
                console.log(`Movie ${index}:`, movie);
                
                // Handle different movie object structures
                const movieData = {
                  id: movie.id || movie._id,
                  title: movie.title || movie.name || movie.slug,
                  poster_path: movie.poster_path || movie.thumb_url || movie.poster_url,
                  release_date: movie.release_date || movie.year,
                  vote_average: movie.vote_average || movie.rating,
                  media_type: movie.media_type || 'movie'
                };
                
                return (
                  <div key={movieData.id || index} className="shrink-0 w-40">
                    <MovieCard
                      id={movieData.id}
                      title={movieData.title}
                      posterPath={movieData.poster_url}
                      releaseDate={movieData.release_date}
                      rating={movieData.vote_average}
                      mediaType={movieData.media_type}
                    />
                  </div>
                );
              })}
            </div>
            
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors hidden md:block"
              aria-label="Tiếp theo"
            >
              <ChevronRightIcon className="h-8 w-8" />
            </button>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-400 text-lg">Không tìm thấy phim nào trong thể loại này.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryMovies;
