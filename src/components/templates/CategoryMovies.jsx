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

function CategoryMovies() {
  const { categoryId, categoryName } = useParams();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);

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
    const fetchMoviesByCategory = async () => {
      try {
        setLoading(true);
        console.log('Fetching category with ID/Slug:', categoryId);
        
        // First, get all categories to find the category details
        console.log('Fetching all categories...');
        const categoriesResponse = await axios.get('/api/the-loai');
        console.log('Categories response:', categoriesResponse.data);
        
        // Find the category by ID or slug
        const category = categoriesResponse.data.data?.find(cat => 
          String(cat.id) === String(categoryId) || cat.slug === categoryId
        );
        
        console.log('Found category:', category);
        
        if (!category) {
          throw new Error(`Không tìm thấy thể loại với ID/Slug: ${categoryId}`);
        }
        
        // Update the category name in the URL if it's different
        if (categoryName !== category.name) {
          navigate(`/category/${category.id}/${encodeURIComponent(category.name)}`, { replace: true });
        }
        
        // Then get movies by category slug
        const apiUrl = `/api/the-loai/${category.slug || category.id}`;
        console.log('Fetching movies from:', apiUrl);
        
        const response = await axios.get(apiUrl, {
          params: { 
            limit: 20,
            page: 1
          }
        });
        
        console.log('Movies API Response:', response.data);
        
        // Handle the response structure from the API
        let moviesData = [];
        const responseData = response.data;
        
        console.log('Raw response data:', responseData);
        
        // The API returns data in responseData.data.data
        if (responseData?.data?.data) {
          moviesData = responseData.data.data;
        } 
        // Fallback to other possible structures
        else if (responseData?.data?.items) {
          moviesData = responseData.data.items;
        } 
        else if (responseData?.data) {
          moviesData = Array.isArray(responseData.data) ? responseData.data : [];
        } 
        else if (Array.isArray(responseData)) {
          moviesData = responseData;
        } 
        else if (responseData?.items) {
          moviesData = responseData.items;
        }
        
        if (moviesData.length === 0) {
          console.warn('No movies found in the response');
        } else {
          console.log(`Found ${moviesData.length} movies`);
        }
        
        setMovies(moviesData || []);
        setError(null);
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
        setError(`Lỗi: ${err.message || 'Không thể tải danh sách phim. Vui lòng thử lại sau.'}`);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchMoviesByCategory();
    } else {
      // If no categoryId, try to fetch from props or context
      // You can add additional logic here if needed
      setLoading(false);
    }
  }, [categoryId]);

  if (loading) {
    return (
      <div className="bg-gray-900 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">
              Đang tải {categoryName || 'thể loại'}...
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
    return (
      <div className="bg-gray-900 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-4">
            <h3 className="text-xl font-bold text-red-400 mb-2">Đã xảy ra lỗi</h3>
            <p className="text-red-300 mb-4">{error}</p>
            <div className="bg-black/50 p-3 rounded text-sm text-gray-300 mb-4 overflow-x-auto">
              <pre>{JSON.stringify({
                categoryId,
                categoryName,
                timestamp: new Date().toISOString()
              }, null, 2)}</pre>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
            >
              Thử lại
            </button>
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
}

export default CategoryMovies;
