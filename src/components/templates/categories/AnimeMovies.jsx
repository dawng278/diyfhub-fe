import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Play, Heart, Info, ChevronLeft, ChevronRight } from 'lucide-react';

// Cache key for localStorage
const CACHE_KEY = 'anime_data_cache';
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

const AnimeMovies = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [animeData, setAnimeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const autoSlideTimer = useRef(null);
    const lastRequestTime = useRef(0);
    const retryCount = useRef(0);
    const maxRetries = 3;

    // Get limit based on screen size
    const getLimit = useCallback(() => {
        if (typeof window === 'undefined') return 8;
        if (window.innerWidth < 640) return 5;
        if (window.innerWidth < 1024) return 6;
        return 8;
    }, []);

    // Get cached data if available
    const getCachedData = () => {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (!cached) return null;
            
            const { data, timestamp } = JSON.parse(cached);
            const isExpired = Date.now() - timestamp > CACHE_DURATION;
            
            return isExpired ? null : data;
        } catch (error) {
            console.error('Error reading cache:', error);
            return null;
        }
    };

    // Save data to cache
    const saveToCache = (data) => {
        try {
            const cacheData = {
                data,
                timestamp: Date.now()
            };
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        } catch (error) {
            console.error('Error saving to cache:', error);
        }
    };

    // Fetch anime data with retry logic
    const fetchAnime = useCallback(async () => {
        // Check if we need to wait due to rate limiting
        const now = Date.now();
        const timeSinceLastRequest = now - lastRequestTime.current;
        const minRequestInterval = 1000; // 1 second between requests
        
        if (timeSinceLastRequest < minRequestInterval) {
            await new Promise(resolve => 
                setTimeout(resolve, minRequestInterval - timeSinceLastRequest)
            );
        }
        
        lastRequestTime.current = Date.now();

        // Try to get cached data first
        const cachedData = getCachedData();
        if (cachedData) {
            setAnimeData(cachedData);
            setLoading(false);
            setError(null);
            return;
        }

        try {
            setLoading(true);
            
            const response = await axios.get('https://api.jikan.moe/v4/top/anime', {
                params: {
                    filter: 'airing',
                    limit: getLimit()
                },
                timeout: 10000 // 10 second timeout
            });

            if (!response?.data?.data) {
                throw new Error('No data received from Jikan API');
            }

            const formattedData = response.data.data.map(anime => {
                const thumbUrl = anime.images?.jpg?.large_image_url || 
                               anime.images?.jpg?.image_url || 
                               'https://via.placeholder.com/300x450?text=No+Image';
                
                const posterUrl = anime.images?.jpg?.image_url || thumbUrl;
                
                return {
                    id: anime.mal_id,
                    name: anime.title,
                    title: anime.title,
                    titleEng: anime.title_english || anime.title,
                    thumb_url: thumbUrl,
                    poster_url: posterUrl,
                    score: anime.score || 0,
                    year: anime.year || (anime.aired?.from ? new Date(anime.aired.from).getFullYear() : 'N/A'),
                    season: `Phần ${anime.season || '1'}`,
                    episodes: `Tập ${anime.episodes || '?'}`,
                    genres: anime.genres?.slice(0, 3).map(g => g.name).join(' • ') || 'Đang cập nhật',
                    synopsis: anime.synopsis || 'Đang cập nhật thông tin...',
                    type: anime.type || 'TV',
                    episode_current: anime.episodes || 'Đang cập nhật'
                };
            });
            
            // Save to cache
            saveToCache(formattedData);
            retryCount.current = 0; // Reset retry counter on success

            setAnimeData(formattedData);
            setError(null);
        } catch (err) {
            console.error('Error fetching anime:', {
                error: err,
                message: err.message,
                response: err.response?.data
            });
            
            // Try to use cached data if available
            const cachedData = getCachedData();
            if (cachedData) {
                setAnimeData(cachedData);
                setError('Using cached data');
                return;
            }
            
            // If we have retries left and it's a rate limit error, retry with backoff
            if (err.response?.status === 429 && retryCount.current < maxRetries) {
                const backoffTime = Math.pow(2, retryCount.current) * 1000; // Exponential backoff
                retryCount.current++;
                
                console.log(`Rate limited. Retrying in ${backoffTime}ms...`);
                await new Promise(resolve => setTimeout(resolve, backoffTime));
                return fetchAnime();
            }
            
            // Fallback to default data if all retries fail
            const fallbackData = [
                {
                    id: 1,
                    title: 'One Piece',
                    titleEng: 'One Piece',
                    thumb_url: 'https://cdn.myanimelist.net/images/anime/6/73245.jpg',
                    poster_url: 'https://cdn.myanimelist.net/images/anime/6/73245.jpg',
                    score: 8.58,
                    year: 1999,
                    season: 'Phần 1',
                    episodes: 'Tập 1080+',
                    genres: 'Hành động • Phiêu lưu • Hài hước',
                    synopsis: 'Câu chuyện về Luffy và nhóm Mũ Rơm trên hành trình tìm kiếm kho báu One Piece và trở thành Vua Hải Tặc.',
                    type: 'TV',
                    episode_current: 'Đang phát'
                }
            ];
            
            setAnimeData(fallbackData);
            saveToCache(fallbackData); // Save fallback to cache
            setError('Không thể tải danh sách anime. Đang hiển thị dữ liệu mẫu.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Handle window resize with debounce
    useEffect(() => {
        let resizeTimer;
        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const newLimit = getLimit();
                if (animeData.length > 0 && animeData.length !== newLimit) {
                    fetchAnime();
                }
            }, 500); // 500ms debounce
        };

        window.addEventListener('resize', handleResize);
        return () => {
            clearTimeout(resizeTimer);
            window.removeEventListener('resize', handleResize);
        };
    }, [animeData.length, fetchAnime, getLimit]);

    // Navigation functions
    const nextSlide = useCallback(() => {
        clearInterval(autoSlideTimer.current);
        setCurrentSlide(prev => (prev + 1) % animeData.length);
    }, [animeData.length]);

    const prevSlide = useCallback(() => {
        clearInterval(autoSlideTimer.current);
        setCurrentSlide(prev => (prev - 1 + animeData.length) % animeData.length);
    }, [animeData.length]);

    // Auto slide effect
    useEffect(() => {
        if (animeData.length > 1) {
            autoSlideTimer.current = setInterval(nextSlide, 5000);
            return () => clearInterval(autoSlideTimer.current);
        }
    }, [animeData.length, nextSlide]);

    // Initial fetch
    useEffect(() => {
        fetchAnime();
    }, [fetchAnime]);

    if (loading) {
        return (
            <div className="w-full h-[600px] bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-[400px] bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
                <div className="text-center p-4">
                    <h3 className="text-xl font-bold text-red-500 mb-2">Error Loading Content</h3>
                    <p className="text-gray-300">{error}</p>
                    <p className="text-gray-400 text-sm mt-2">Showing sample data instead.</p>
                </div>
            </div>
        );
    }

    const currentAnime = animeData[currentSlide] || animeData[0];

    return (
        <div className="w-full px-4 sm:px-8">
            {/* Header */}
            <div className="px-4 sm:px-8 pt-6 pb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Kho Tàng Anime Mới Nhất</h1>
            </div>

            {/* Main Carousel */}
            <div className="relative px-2 sm:px-4 md:px-8 pb-4">
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-gray-900">
                    {/* Main Thumbnail Image with Overlay */}
                    <div className="absolute inset-0 w-full h-full overflow-hidden">
                        <div className="relative w-full h-full">
                            <div 
                                className="absolute inset-0 w-full h-full bg-cover bg-center"
                                style={{
                                    backgroundImage: `url(${currentAnime.thumb_url})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                    imageRendering: 'auto',
                                    willChange: 'transform',
                                    transform: 'translateZ(0)',
                                    backfaceVisibility: 'hidden'
                                }}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/1920x1080?text=No+Image';
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
                        </div>
                    </div>

                    {/* Content Container */}
                    <div className="relative flex flex-col md:flex-row items-center min-h-[500px] md:min-h-[600px]">
                        {/* Left Content */}
                        <div className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 py-8 md:py-16 max-w-2xl">
                            <div className="space-y-3 sm:space-y-4 md:space-y-6">
                                {/* Title */}
                                <div>
                                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2 leading-tight truncate" title={currentAnime.title}>
                                        {currentAnime.title}
                                    </h2>
                                    <p className="text-sm sm:text-base md:text-lg text-red-400 font-medium truncate" title={currentAnime.titleEng}>
                                        {currentAnime.titleEng}
                                    </p>
                                </div>

                                {/* Meta Info */}
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                                    {currentAnime.score && (
                                        <span className="px-2 sm:px-3 py-1 bg-red-600 text-white font-bold rounded">
                                            IMDb {currentAnime.score.toFixed(1)}
                                        </span>
                                    )}
                                    {currentAnime.year && (
                                        <span className="text-white font-medium">{currentAnime.year}</span>
                                    )}
                                    <span className="text-white font-medium">{currentAnime.season}</span>
                                    <span className="text-white font-medium">{currentAnime.episodes}</span>
                                </div>

                                {/* Genres */}
                                <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-gray-300">
                                    {currentAnime.genres.split(' • ').map((genre, idx) => (
                                        <span key={idx} className="bg-white/10 px-2 py-1 rounded">
                                            {genre}
                                        </span>
                                    ))}
                                </div>

                                {/* Synopsis */}
                                <p className="text-gray-300 leading-relaxed line-clamp-3 text-sm sm:text-base" title={currentAnime.synopsis}>
                                    {currentAnime.synopsis}
                                </p>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-2 sm:pt-4">
                                    <Link 
                                        to={`/phim/${currentAnime.id}`}
                                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all transform shadow-lg text-sm sm:text-base"
                                    >
                                        <Play className="w-4 h-4 sm:w-5 sm:h-5" fill="white" />
                                        Xem ngay
                                    </Link>
                                    <button className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg transition-all">
                                        <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                    <button className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg transition-all">
                                        <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all z-10"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all z-10"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>

                    {/* Thumbnail Navigation - Fixed 8 items */}
                    <div className="absolute bottom-2 sm:bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 w-full px-2 sm:px-4 z-10">
                        <div className="flex justify-center gap-1 sm:gap-2 md:gap-3 mx-auto max-w-4xl overflow-x-auto pb-2">
                        {animeData.map((anime, index) => (
                            <button
                                key={anime.id}
                                onClick={() => {
                                    clearInterval(autoSlideTimer.current);
                                    setCurrentSlide(index);
                                }}
                                className={`flex-shrink-0 w-10 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16 lg:w-18 lg:h-20 rounded-lg overflow-hidden transition-all ${
                                    index === currentSlide 
                                        ? 'ring-2 sm:ring-3 ring-red-600' 
                                        : 'opacity-60 hover:opacity-100'
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            >
                                <div 
                                    className="w-full h-full bg-cover bg-center"
                                    style={{
                                        backgroundImage: `url(${anime.poster_url})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                />
                            </button>
                        ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnimeMovies;