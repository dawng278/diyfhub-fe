import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMoviesByCategory } from '../../services/apiService';

const ITEMS_PER_PAGE = 24;

const MoviesGrid = () => {
  const { categoryId, categoryName } = useParams();
  const navigate = useNavigate();
  
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const decodedCategoryName = categoryName ? decodeURIComponent(categoryName) : 'Thể loại';

  // 🐛 DEBUG: Log component mount và params
  console.log('🎬 MoviesGrid Component Rendered!');
  console.log('  - categoryId:', categoryId);
  console.log('  - categoryName:', categoryName);
  console.log('  - decodedCategoryName:', decodedCategoryName);
  console.log('  - loading:', loading);
  console.log('  - movies.length:', movies.length);
  console.log('  - error:', error);

  // Helper function to construct image URL
  const constructImageUrl = (path) => {
    if (!path) return null;
    
    // If it's already a full URL, return as is
    if (path.startsWith('http')) return path;
    
    // Clean up the path
    const cleanPath = path.replace(/^\/+/, '');
    
    // Construct full URL with img.phimapi.com (the CDN for images)
    return `https://img.phimapi.com/${cleanPath}`;
  };

  const fetchMovies = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!categoryName) {
        console.error('No categoryName provided!');
        navigate('/');
        return;
      }

      console.log(`Fetching movies for category slug: ${categoryName}`);
      
      // Use the category slug with getMoviesByCategory
      const response = await getMoviesByCategory(categoryName, { 
        page, 
        limit: ITEMS_PER_PAGE 
      });
      
      console.log('✅ Full API Response:', response);
      
      let moviesData = [];
      let paginationData = null;
      
      if (response) {
        if (response.data?.data?.items) {
          moviesData = response.data.data.items;
          paginationData = response.data.data.params?.pagination;
        }
        else if (response.data?.items) {
          moviesData = response.data.items;
          paginationData = response.data.params?.pagination || response.data.pagination;
        }
        else if (Array.isArray(response.data)) {
          moviesData = response.data;
        }
        else if (response.items) {
          moviesData = response.items;
          paginationData = response.params?.pagination || response.pagination;
        }
        else if (Array.isArray(response)) {
          moviesData = response;
        }
      }
      
      console.log('Extracted movies data:', moviesData);
      console.log('Pagination data:', paginationData);
      
      if (!moviesData || !Array.isArray(moviesData) || moviesData.length === 0) {
        setError('Không tìm thấy phim nào trong thể loại này');
        setMovies([]);
        return;
      }
      
      const processedMovies = moviesData.map(movie => {
        console.log('Processing movie:', movie);
        
        // Try to get the best available image - prioritize thumb_url
        let imageUrl = constructImageUrl( 
          movie.poster_url || 
          movie.poster_path || 
          movie.poster
        );
        
        console.log('Image URL constructed:', imageUrl);
        
        // If we still don't have a valid URL, use a placeholder
        if (!imageUrl) {
          console.warn('No valid image URL found for movie:', movie._id || movie.id);
          imageUrl = null;
        }

        return {
          ...movie,
          _id: movie._id || movie.id,
          title: movie.name || movie.title || movie.origin_name || 'Không có tiêu đề',
          origin_name: movie.origin_name || movie.original_name || '',
          poster_url: imageUrl,
          slug: movie.slug || movie._id || movie.id,
          imdb_rating: movie.tmdb?.vote_average || movie.imdb?.rating || movie.vote_average || movie.rating || 0,
          episode_current: movie.episode_current || '',
          episode_total: movie.episode_total || movie.total_episodes || 0,
          year: movie.year || movie.release_date?.substring(0, 4) || '',
          quality: movie.quality || 'HD',
          lang: movie.lang || 'Vietsub',
          type: movie.type || 'series'
        };
      });
      
      console.log('Processed movies:', processedMovies);
      setMovies(processedMovies);
      
      if (paginationData) {
        setTotalPages(paginationData.totalPages || paginationData.total_pages || 1);
        setCurrentPage(paginationData.currentPage || paginationData.current_page || page);
      } else {
        setTotalPages(1);
        setCurrentPage(1);
      }
      
    } catch (err) {
      console.error('Error in fetchMovies:', err);
      console.error('Error details:', err.response || err.message);
      setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra khi tải dữ liệu');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, [categoryId, categoryName, decodedCategoryName, navigate]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMovieClick = (movie) => {
    navigate(`/phim/${movie._id}/${movie.slug}`);
  };

  useEffect(() => {
    console.log('=== 🔄 MoviesGrid useEffect TRIGGERED ===');
    console.log('categoryId:', categoryId);
    console.log('categoryName:', categoryName);
    console.log('decodedCategoryName:', decodedCategoryName);
    console.log('currentPage:', currentPage);
    console.log('loading:', loading);
    console.log('movies.length:', movies.length);
    
    if (categoryId || categoryName) {
      console.log('✅ Calling fetchMovies...');
      fetchMovies(currentPage);
    } else {
      console.warn('❌ No categoryId or categoryName found!');
    }
  }, [currentPage, fetchMovies, categoryId, categoryName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="container mx-auto px-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg aspect-[2/3] mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-3">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Lỗi</h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <button
              onClick={() => fetchMovies(currentPage)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-3">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy phim</h2>
            <p className="text-gray-600 mb-4">Không có phim nào trong thể loại này.</p>
            <div className="text-left bg-gray-100 p-4 rounded text-xs">
              <p><strong>Debug Info:</strong></p>
              <p>Category ID: {categoryId}</p>
              <p>Category Name: {categoryName}</p>
              <p>Decoded: {decodedCategoryName}</p>
              <p>Movies Length: {movies.length}</p>
              <p>Loading: {loading.toString()}</p>
              <p>Error: {error || 'None'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-3">
        {/* Debug Info - XÓA SAU KHI FIX */}
        {/* <div className="bg-yellow-100 border-2 border-yellow-400 p-4 mb-4 rounded">
          <h3 className="font-bold text-yellow-800 mb-2">🐛 DEBUG INFO (Xóa sau khi fix)</h3>
          <div className="text-sm text-yellow-800">
            <p>Loading: {loading.toString()}</p>
            <p>Error: {error || 'None'}</p>
            <p>Movies count: {movies.length}</p>
            <p>Category ID: {categoryId}</p>
            <p>Category Name: {categoryName}</p>
            <p>Current Page: {currentPage}</p>
            <p>Total Pages: {totalPages}</p>
          </div>
        </div> */}
        
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          {decodedCategoryName}
        </h1>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {movies.map((movie) => (
            <div 
              key={movie._id || movie.slug}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => handleMovieClick(movie)}
            >
              {/* Movie Poster */}
              <div className="aspect-[2/3] relative overflow-hidden">
                <div className="relative w-full h-full bg-gray-100 flex items-center justify-center">
                  {movie.poster_url ? (
                    <img
                      src={movie.poster_url}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        console.warn('Failed to load image:', e.target.src, 'for movie:', movie.title);
                        e.target.style.display = 'none';
                        const parent = e.target.parentNode;
                        if (parent && !parent.querySelector('.fallback-text')) {
                          const fallbackDiv = document.createElement('div');
                          fallbackDiv.className = 'fallback-text w-full h-full flex items-center justify-center text-gray-400 text-sm px-4 text-center';
                          fallbackDiv.textContent = 'Không tải được ảnh';
                          parent.appendChild(fallbackDiv);
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm px-4 text-center">
                      Không có ảnh
                    </div>
                  )}
                </div>
                
                {/* Overlay with Play Button */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-red-600 rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Episode Info Overlay */}
                  {movie.episode_current && (
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                      <p className="text-white text-xs font-semibold">
                        {movie.episode_current}
                        {movie.episode_total > 0 && ` / ${movie.episode_total}`}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Quality & Language Badge */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {movie.quality && (
                    <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
                      {movie.quality}
                    </span>
                  )}
                  {movie.lang && (
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
                      {movie.lang}
                    </span>
                  )}
                </div>
                
                {/* IMDB Rating */}
                {movie.imdb_rating > 0 && (
                  <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center shadow-lg">
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
                  className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2 min-h-[40px] group-hover:text-red-600 transition-colors" 
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
                <div className="flex justify-between items-center text-xs text-gray-600">
                  <span className="font-medium">{movie.year || 'N/A'}</span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 capitalize">
                    {movie.type === 'series' ? 'Phim bộ' : 'Phim lẻ'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2 bg-white rounded-lg shadow p-2">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                title="Trang đầu"
              >
                &laquo;
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                title="Trang trước"
              >
                &lsaquo;
              </button>
              
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
                    className={`px-4 py-2 rounded font-medium transition-all ${
                      currentPage === pageNum 
                        ? 'bg-red-600 text-white shadow-md' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                title="Trang sau"
              >
                &rsaquo;
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                title="Trang cuối"
              >
                &raquo;
              </button>
            </div>
          </div>
        )}
        
        {/* Page Info */}
        <div className="text-center mt-4 text-sm text-gray-600">
          Trang {currentPage} / {totalPages} - Tổng {movies.length} phim
        </div>
      </div>
    </div>
  );
};

export default MoviesGrid;