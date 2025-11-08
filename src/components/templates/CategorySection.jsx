import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MovieCard from '../molecules/MovieCard';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const CategorySection = ({ categoryId, categoryName, apiPath = 'the-loai' }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const scrollTo = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        
        const response = await axios.get(`/api/${apiPath}/${categoryId}`, {
          params: { 
            limit: 20,
            page: 1
          }
        });
        
        let moviesData = [];
        const responseData = response.data;
        
        if (responseData?.data?.data) {
          moviesData = responseData.data.data;
        } else if (responseData?.data?.items) {
          moviesData = responseData.data.items;
        } else if (responseData?.data) {
          moviesData = Array.isArray(responseData.data) ? responseData.data : [];
        } else if (Array.isArray(responseData)) {
          moviesData = responseData;
        }
        
        // Debug log to see the structure of the first movie
        console.log('First movie data:', moviesData[0]);
        
        setMovies(moviesData || []);
        setError(null);
      } catch (err) {
        console.error(`Error fetching ${categoryName} movies:`, err);
        setError(`Không thể tải danh sách ${categoryName.toLowerCase()}. Vui lòng thử lại sau.`);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchMovies();
    }
  }, [categoryId, apiPath, categoryName]);

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
          >
            {movies.map((movie, index) => {
              // Get the most appropriate poster path
              const posterPath = 
                movie.poster_url || 
                movie.thumb_url || 
                movie.poster_path ||
                (movie.thumb && (movie.thumb.medium || movie.thumb.large || movie.thumb)) ||
                movie.thumbnail ||
                movie.thumbnail_medium ||
                movie.thumbnail_large;
              
              // Skip if no poster path is available
              if (!posterPath) return null;
              
              // Debug log for the current movie
              console.log('Processing movie:', { 
                id: movie.id || movie._id, 
                title: movie.title || movie.name,
                movieData: movie 
              });
              
              // Get IMDB rating (try different possible fields)
              const imdbRating = movie.tmdb?.vote_average || movie.quality || movie.rating || movie.vote_average || (movie.vote && movie.vote.average) || 0;
              

              
              
              return (
                <div key={movie.id || movie._id || index} className="group shrink-0 w-32 sm:w-50 snap-start">
                  <MovieCard
                    id={movie.id || movie._id}
                    title={movie.title || movie.name || 'Không có tiêu đề'}
                    posterPath={posterPath}
                    releaseDate={movie.year || ''}
                    rating={imdbRating}
                    mediaType={movie.media_type || 'movie'}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySection;
