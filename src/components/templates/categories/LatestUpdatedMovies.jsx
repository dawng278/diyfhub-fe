import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getNewMovies } from '../../../services/apiService';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

// Helper function to format duration in minutes to 'Xh Ym' format
const formatDuration = (minutes) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

// Add custom polygon shape styles
const styles = `
  .polygon-shape-1 {
    clip-path: polygon(5.761% 100%, 94.239% 100%, 94.239% 100%, 95.174% 99.95%, 96.06% 99.803%, 96.887% 99.569%, 97.642% 99.256%, 98.313% 98.87%, 98.889% 98.421%, 99.357% 97.915%, 99.706% 97.362%, 99.925% 96.768%, 100% 96.142%, 100% 3.858%, 100% 3.858%, 99.913% 3.185%, 99.662% 2.552%, 99.263% 1.968%, 98.731% 1.442%, 98.08% .984%, 97.328% .602%, 96.488% .306%, 95.577% .105%, 94.609% .008%, 93.6% .024%, 5.121% 6.625%, 5.121% 6.625%, 4.269% 6.732%, 3.468% 6.919%, 2.728% 7.178%, 2.058% 7.503%, 1.467% 7.887%, .962% 8.323%, .555% 8.805%, .253% 9.326%, .065% 9.88%, 0 10.459%, 0 96.142%, 0 96.142%, .075% 96.768%, .294% 97.362%, .643% 97.915%, 1.111% 98.421%, 1.687% 98.87%, 2.358% 99.256%, 3.113% 99.569%, 3.94% 99.803%, 4.826% 99.95%, 5.761% 100%);
  }
  
  .polygon-shape-2 {
    clip-path: polygon(94.239% 100%, 5.761% 100%, 5.761% 100%, 4.826% 99.95%, 3.94% 99.803%, 3.113% 99.569%, 2.358% 99.256%, 1.687% 98.87%, 1.111% 98.421%, .643% 97.915%, .294% 97.362%, .075% 96.768%, 0 96.142%, 0 3.858%, 0 3.858%, .087% 3.185%, .338% 2.552%, .737% 1.968%, 1.269% 1.442%, 1.92% .984%, 2.672% .602%, 3.512% .306%, 4.423% .105%, 5.391% .008%, 6.4% .024%, 94.879% 6.625%, 94.879% 6.625%, 95.731% 6.732%, 96.532% 6.919%, 97.272% 7.178%, 97.942% 7.503%, 98.533% 7.887%, 99.038% 8.323%, 99.445% 8.805%, 99.747% 9.326%, 99.935% 9.88%, 100% 10.459%, 100% 96.142%, 100% 96.142%, 99.925% 96.768%, 99.706% 97.362%, 99.357% 97.915%, 98.889% 98.421%, 98.313% 98.87%, 97.642% 99.256%, 96.887% 99.569%, 96.06% 99.803%, 95.174% 99.95%, 94.239% 100%);
  }

  .movie-card-container {
    position: relative;
    width: 100%;
    aspect-ratio: 2/3;
  }

  /* Outer mask - for border */
  .border-mask {
    position: absolute;
    inset: 0;
    background: transparent;
    transition: background 0.3s ease;
  }

  .group:hover .border-mask {
    background: linear-gradient(135deg, #FF1500 0%, #FF1500 100%);
  }

  /* Inner content mask */
  .content-mask {
    position: absolute;
    inset: 3px;
    background: #1a1a1a;
    overflow: hidden;
  }
  
  /* Image container */
  .image-container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  /* Hover overlay */
  .movie-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 2;
  }
  
  .group:hover .movie-overlay {
    opacity: 1;
  }
  
`;

const LatestUpdatedMovies = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef(null);
    const itemRef = useRef(null);
    const [visibleItems, setVisibleItems] = useState(6);
    
    // Update visible items count based on screen size
    useEffect(() => {
        const updateVisibleItems = () => {
            const width = window.innerWidth;
            if (width >= 1280) setVisibleItems(6);
            else if (width >= 1024) setVisibleItems(5);
            else if (width >= 768) setVisibleItems(4);
            else if (width >= 640) setVisibleItems(3);
            else setVisibleItems(2);
        };
        
        window.addEventListener('resize', updateVisibleItems);
        updateVisibleItems();
        
        return () => window.removeEventListener('resize', updateVisibleItems);
    }, []);
    
    const scrollToIndex = (index) => {
        if (containerRef.current && itemRef.current) {
            const container = containerRef.current;
            const itemWidth = itemRef.current.offsetWidth + 16; // 16px for padding
            const maxScroll = container.scrollWidth - container.clientWidth;
            const scrollPosition = Math.min(index * itemWidth, maxScroll);
            
            container.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
            setCurrentIndex(index);
        }
    };
    
    const scrollPrev = () => {
        if (currentIndex > 0) {
            scrollToIndex(currentIndex - 1);
        }
    };
    
    const scrollNext = () => {
        if (containerRef.current && currentIndex < movies.length - visibleItems) {
            scrollToIndex(currentIndex + 1);
        }
    };

    useEffect(() => {
        const fetchLatestMovies = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log('Fetching latest movies...');

                // Use the getNewMovies function from apiService
                const response = await getNewMovies(1);
                console.log('API Response:', response);

                let moviesData = [];

                // Handle different response structures
                if (Array.isArray(response)) {
                    // Case 1: Response is already an array
                    moviesData = response;
                } else if (response && typeof response === 'object') {
                    // Case 2: Response is an object with possible data/items properties
                    if (Array.isArray(response.items)) {
                        moviesData = response.items;
                    } else if (response.data) {
                        if (Array.isArray(response.data)) {
                            moviesData = response.data;
                        } else if (response.data.items && Array.isArray(response.data.items)) {
                            moviesData = response.data.items;
                        }
                    }
                }

                console.log('Processed movies data:', moviesData);

                if (!moviesData || moviesData.length === 0) {
                    console.warn('No movies found in the response');
                    // Instead of throwing an error, set an empty array and show a message
                    setMovies([]);
                    setError({
                        message: 'Hiện chưa có phim nào',
                        details: 'Vui lòng quay lại sau'
                    });
                    return;
                }

                setMovies(moviesData);
                setError(null);

            } catch (err) {
                console.error('Error fetching latest movies:', err);
                setError({
                    message: 'Không thể tải danh sách phim',
                    details: err.message || 'Vui lòng thử lại sau.'
                });
                setMovies([]);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestMovies();
    }, []);

    const getImageUrl = (movie) => {
        if (!movie) return 'https://via.placeholder.com/500x750?text=No+Image';

        const imagePath =
            movie.poster_url ||
            movie.thumb_url ||
            movie.poster_path ||
            movie.thumbnail ||
            movie.thumb ||
            movie.poster ||
            '';

        if (!imagePath) return 'https://via.placeholder.com/500x750?text=No+Image';

        if (imagePath.startsWith('http')) {
            return imagePath.replace('http://', 'https://');
        }

        const baseUrl = 'https://img.phimapi.com';
        return `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                const year = parseInt(dateString);
                if (!isNaN(year) && year > 1900 && year <= new Date().getFullYear() + 1) {
                    return year.toString();
                }
                return '';
            }
            return date.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (e) {
            console.error('Error formatting date:', e);
            return '';
        }
    };

    if (loading) {
        return (
            <div className="py-8">
                <div className="container mx-auto px-4">
                    <div className="h-8 bg-gray-800 rounded w-1/4 mb-6"></div>
                    <div className="flex flex-wrap -mx-2">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 px-2 mb-6">
                                <div className="bg-gray-800 rounded-lg aspect-[2/3] animate-pulse"></div>
                                <div className="mt-2 h-4 bg-gray-800 rounded w-3/4"></div>
                                <div className="mt-1 h-3 bg-gray-800 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="text-white py-8 sm:py-10 md:py-12 w-full">
            <style>{styles}</style>
            <div className="w-full max-w-full overflow-hidden sm:px-8 px-6 md:px-14">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold truncate max-w-[70%]">Phim mới cập nhật</h2>
                    <button 
                        onClick={() => window.scrollTo(0, 0)}
                        className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm whitespace-nowrap ml-2 px-2 py-1 sm:px-3 sm:py-1.5 bg-gray-800/50 rounded-md hover:bg-gray-700/50 transition-colors"
                    >
                        Xem thêm
                    </button>
                </div>
                
                {error ? (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
                        <p>Không thể tải danh sách phim. Vui lòng thử lại sau.</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="mt-2 text-sm bg-red-700 hover:bg-red-600 px-3 py-1 rounded"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : (
                    <div className="relative">
                        <button
                            onClick={scrollPrev}
                            disabled={currentIndex === 0}
                            className="absolute left-0 top-[40%] -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors hidden md:block"
                            aria-label="Trước"
                        >
                            <ChevronLeftIcon className="h-8 w-8" />
                        </button>
                        
                        <div 
                            ref={containerRef}
                            className="flex space-x-3 sm:space-x-4 pb-2 sm:pb-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-1"
                            style={{ scrollBehavior: 'smooth' }}
                        >
                            {movies.map((movie, index) => {
                                const isEven = index % 2 === 0;
                                const polygonClass = isEven ? 'polygon-shape-1' : 'polygon-shape-2';

                                return (
                                    <div 
                                        key={movie._id} 
                                        ref={index === 0 ? itemRef : null}
                                        className="flex-shrink-0 w-[calc(50%-0.375rem)] sm:w-[calc(33.333%-0.5rem)] md:w-[calc(25%-0.75rem)] lg:w-[calc(20%-0.8rem)] xl:w-[calc(16.666%-0.833rem)] snap-start group"
                                    >
                                        <Link to={`/phim/${movie._id}/${movie.slug || 'movie'}`} className="block">
                                            <div className="movie-card-container">
                                                <div className={`border-mask ${polygonClass}`}>
                                                    <div className={`content-mask ${polygonClass}`}>
                                                        <div className="image-container">
                                                            <img
                                                                src={getImageUrl(movie)}
                                                                alt={movie.name || movie.title || movie.origin_name || 'Movie Poster'}
                                                                className="w-full h-full object-cover transition-transform duration-500"
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = 'https://via.placeholder.com/500x750?text=No+Image';
                                                                }}
                                                                loading="lazy"
                                                            />
                                                        </div>

                                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-3 pt-6 z-10">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-xs font-medium text-white bg-red-600 px-1.5 py-0.5 rounded">
                                                                    {movie.episode_current ||
                                                                        movie.episode?.current ||
                                                                        movie.latest_episode ||
                                                                        (movie.episode ? `Tập ${movie.episode}` : 'Mới')}
                                                                </span>
                                                                <span className="text-xs text-gray-300">
                                                                    {formatDate(movie.updatedAt || movie.updated_at || movie.modified?.time || movie.modifiedAt || movie.year)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-2">
                                                <h3 className="text-sm font-medium text-white line-clamp-2 h-10 leading-tight">
                                                    {movie.name || movie.title || movie.origin_name || 'Không có tiêu đề'}
                                                </h3>
                                                <div className="flex flex-wrap items-center text-xs text-gray-400 mt-1 gap-y-1">
                                                    {/* IMDB Rating */}
                                                    {(movie.vote_average || movie.rating) && (
                                                        <div className="flex items-center mr-2">
                                                            <span className="text-yellow-400 font-bold mr-1">IMDb</span>
                                                            <span>{(movie.vote_average || movie.rating).toFixed(1)}</span>
                                                        </div>
                                                    )}
                                                    
                                                    {/* Year */}
                                                    {movie.year && (
                                                        <div className="flex items-center mr-2">
                                                            <span>{movie.year}</span>
                                                        </div>
                                                    )}
                                                    
                                                    {/* Episode Count */}
                                                    {(movie.episode_current || movie.episode_total) && (
                                                        <div className="flex items-center mr-2">
                                                            <span className="text-gray-500 mx-1">•</span>
                                                            <span>{movie.episode_current ? `Tập ${movie.episode_current}` : ''}</span>
                                                            {movie.episode_total && (
                                                                <span>/{movie.episode_total}</span>
                                                            )}
                                                        </div>
                                                    )}
                                                    
                                                    {/* Duration */}
                                                    {movie.duration && (
                                                        <div className="flex items-center mr-2">
                                                            <span className="text-gray-500 mx-1">•</span>
                                                            <span>{formatDuration(movie.duration)}</span>
                                                        </div>
                                                    )}
                                                    
                                                    {/* Quality Badge */}
                                                    {movie.quality && (
                                                        <span className="ml-auto px-1.5 py-0.5 bg-gray-800/80 rounded text-gray-300 text-[11px] font-medium">
                                                            {movie.quality}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                        
                        <button
                            onClick={scrollNext}
                            disabled={currentIndex >= movies.length - visibleItems}
                            className="absolute right-0 top-[40%] -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors hidden md:block"
                            aria-label="Tiếp theo"
                        >
                            <ChevronRightIcon className="h-8 w-8" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LatestUpdatedMovies;