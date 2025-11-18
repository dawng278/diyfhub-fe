import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';

// Cache key for localStorage
const CACHE_KEY = 'chieurap_data_cache';
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

const ChieuRapMovies = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [chieurapData, setChieurapData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const ITEMS_PER_PAGE = 24;

    // Helper function to construct image URL
    const constructImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const cleanPath = path.replace(/^\/+/, '');
        return `https://img.phimapi.com/${cleanPath}`;
    };

    // Fetch chiếu rạp data
    const fetchChieurap = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await axios.get('https://phimapi.com/v1/api/danh-sach/phim-chieu-rap', {
                params: {
                    page,
                    limit: ITEMS_PER_PAGE
                },
                timeout: 10000
            });

            let moviesData = [];
            let paginationData = null;

            if (response?.data?.data?.items) {
                moviesData = response.data.data.items;
                paginationData = response.data.data.params?.pagination;
            }

            if (!moviesData || !Array.isArray(moviesData) || moviesData.length === 0) {
                setError('Không tìm thấy phim chiếu rạp nào');
                setChieurapData([]);
                setTotalPages(1);
                setTotalItems(0);
                return;
            }

            // Process movies data
            const processedMovies = moviesData.map(movie => {
                let imageUrl = constructImageUrl(
                    movie.poster_url || 
                    movie.thumb_url ||
                    movie.poster_path || 
                    movie.poster
                );

                return {
                    ...movie,
                    _id: movie._id || movie.id,
                    title: movie.name || movie.title || movie.origin_name || 'Không có tiêu đề',
                    name: movie.name || movie.title || movie.origin_name || 'Không có tiêu đề',
                    origin_name: movie.origin_name || movie.original_name || '',
                    poster_url: imageUrl,
                    slug: movie.slug || movie._id || movie.id,
                    imdb_rating: movie.tmdb?.vote_average || movie.imdb?.rating || movie.vote_average || movie.rating || 0,
                    episode_current: movie.episode_current || 'Full',
                    episode_total: movie.episode_total || movie.total_episodes || 0,
                    year: movie.year || movie.release_date?.substring(0, 4) || '',
                    time: movie.time || '',
                    quality: movie.quality || 'HD',
                    lang: movie.lang || 'Vietsub',
                    type: movie.type || 'single',
                    chieurap: true
                };
            });

            setChieurapData(processedMovies);

            // Set pagination
            if (paginationData) {
                setTotalPages(paginationData.totalPages || paginationData.total_pages || 1);
                setTotalItems(paginationData.totalItems || paginationData.total_items || processedMovies.length);
                setCurrentPage(paginationData.currentPage || paginationData.current_page || page);
            } else {
                setTotalPages(1);
                setTotalItems(processedMovies.length);
                setCurrentPage(1);
            }

        } catch (err) {
            console.error('Error fetching chieurap movies:', err);
            setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra khi tải dữ liệu');
            setChieurapData([]);
        } finally {
            setLoading(false);
        }
    }, [ITEMS_PER_PAGE]);

    // Handle page change
    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setCurrentPage(newPage);
        fetchChieurap(newPage);
        
        // Update URL with page parameter
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('page', newPage.toString());
        setSearchParams(newSearchParams);
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle movie click
    const handleMovieClick = (movie) => {
        navigate(`/phim/${movie._id}/${movie.slug}`);
    };

    // Initial fetch
    useEffect(() => {
        // Get page from URL parameters, default to 1
        const pageParam = searchParams.get('page');
        const page = pageParam ? parseInt(pageParam, 10) : 1;
        
        if (page >= 1) {
            setCurrentPage(page);
            fetchChieurap(page);
        } else {
            fetchChieurap(1);
        }
    }, [fetchChieurap, searchParams]);

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
                                onClick={() => fetchChieurap(currentPage)}
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

    if (chieurapData.length === 0) {
        return (
            <div className="min-h-screen bg-[#030712] py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto bg-gray-900 rounded-xl shadow-2xl p-8 text-center border border-gray-800">
                        <div className="mb-4">
                            <svg className="w-16 h-16 text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-200 mb-4">Không tìm thấy phim</h2>
                        <p className="text-gray-400 mb-6">Không có phim chiếu rạp nào.</p>
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
        <div className="min-h-screen bg-[#030712] py-8 pt-20">
            <div className="container mx-auto px-4">
                {/* Header với gradient */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-500 via-red-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        Phim Chiếu Rạp
                        {totalItems > 0 && <span className="text-gray-500 ml-2">({totalItems} phim)</span>}
                    </h1>
                    <div className="h-1 w-24 bg-gradient-to-r from-red-500 to-pink-600 rounded-full"></div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
                    {chieurapData.map((movie) => (
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
                                            <Play className="w-8 h-8 text-white ml-1" />
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Quality Badge */}
                                {movie.quality && (
                                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md font-semibold shadow-lg">
                                        {movie.quality}
                                    </div>
                                )}
                                
                                {/* Episode Badge */}
                                {movie.episode_current && (
                                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md font-semibold shadow-lg backdrop-blur-sm">
                                        {movie.episode_current}
                                    </div>
                                )}
                            </div>
                            
                            {/* Movie Info */}
                            <div className="p-3">
                                <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2 leading-tight min-h-[2.5rem] group-hover:text-red-400 transition-colors duration-200">
                                    {movie.title}
                                </h3>
                                
                                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                                    <span className="flex items-center">
                                        <svg className="w-3 h-3 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        {movie.imdb_rating ? movie.imdb_rating.toFixed(1) : 'N/A'}
                                    </span>
                                    {movie.year && <span>{movie.year}</span>}
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500 truncate flex-1 mr-2">
                                        {movie.time || movie.lang}
                                    </span>
                                    {movie.type && (
                                        <span className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded-full whitespace-nowrap">
                                            {movie.type === 'single' ? 'Phim Lẻ' : movie.type === 'series' ? 'Phim Bộ' : movie.type}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-12 flex flex-col items-center gap-4">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                    currentPage === 1 
                                        ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                                        : 'bg-gray-800 hover:bg-red-600 text-white'
                                }`}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            
                            <div className="flex items-center gap-1">
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
                                            className={`w-10 h-10 flex items-center justify-center rounded-lg font-semibold transition-all duration-300 ${
                                                currentPage === pageNum 
                                                    ? 'bg-red-600 text-white' 
                                                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>
                            
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                    currentPage === totalPages 
                                        ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                                        : 'bg-gray-800 hover:bg-red-600 text-white'
                                }`}
                            >
                                <ChevronRight className="w-5 h-5" />
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

export default ChieuRapMovies;
