import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getMoviesByCategory } from '../../services/apiService';

const ITEMS_PER_PAGE = 24;

const MoviesGridByCategory = () => {
  const { categoryId, categoryName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Mapping các thể loại phổ biến
  const categoryMapping = {
    'hanh-dong': 'hành động',
    'tinh-cam': 'tình cảm',
    'hai-huoc': 'hài hước',
    'kinh-di': 'kinh dị',
    'vien-tuong': 'viễn tưởng',
    'phieu-luu': 'phiêu lưu',
    'hoat-hinh': 'hoạt hình',
    'chinh-kich': 'chính kịch',
    'tai-lieu': 'tài liệu',
    'gia-dinh': 'gia đình',
    'mien-tay': 'miền tây tếu',
    'tre-em': 'trẻ em',
    'lich-su': 'lịch sử',
    'co-trang': 'cổ trang',
    'chien-tranh': 'chiến tranh',
    'bi-an': 'bí ẩn',
    'phim-18': 'người lớn',
    'tam-ly': 'tâm lý',
    'the-thao': 'thể thao',
    'am-nhac': 'âm nhạc',
    'hoc-duong': 'học đường',
    'hinh-su': 'hình sự',
    'vo-thuat': 'võ thuật',
    'khoa-hoc': 'khoa học',
    'than-thoai': 'thần thoại',
    'kinh-dien': 'kinh điển'
  };

  // Chuyển đổi tên thể loại có dấu
  const decodedCategoryName = categoryName 
    ? `Phim ${categoryMapping[categoryName] || categoryName.replace(/-/g, ' ')}`
    : 'Phim theo thể loại';

  console.log('🎬 MoviesGrid Component Rendered!');
  console.log('  - categoryId:', categoryId);
  console.log('  - categoryName:', categoryName);
  console.log('  - decodedCategoryName:', decodedCategoryName);
  console.log('  - loading:', loading);
  console.log('  - movies.length:', movies.length);
  console.log('  - error:', error);

  const fetchMovies = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!categoryName) {
        console.error('No categoryName provided!');
        navigate('/');
        return;
      }

      console.log(`Fetching movies for category: ${categoryName}, page: ${page}`);
      
      const response = await getMoviesByCategory(categoryName, { 
        page, 
        limit: ITEMS_PER_PAGE,
        sortField: 'modified.time',
        sortType: 'desc'
      });
      
      console.log('✅ Full API Response:', response);
      
      let moviesData = [];
      let paginationData = null;
      
      if (response?.data?.items) {
        moviesData = response.data.items;
        paginationData = response.data.pagination || response.data.params?.pagination;
      } 
      else if (response?.items) {
        moviesData = response.items;
        paginationData = response.pagination || response.params?.pagination;
      }
      else if (Array.isArray(response)) {
        moviesData = response;
      }
      else if (response?.data) {
        moviesData = Array.isArray(response.data) ? response.data : [];
        paginationData = response.pagination || response.params?.pagination || 
                        (response.data.pagination || response.data.params?.pagination);
      }
      
      console.log('Extracted movies data:', moviesData);
      console.log('Pagination data:', paginationData);
      
      if (!moviesData || !Array.isArray(moviesData) || moviesData.length === 0) {
        setError('Không tìm thấy phim nào trong thể loại này');
        setMovies([]);
        return;
      }
      
      const processedMovies = moviesData.map(movie => {
        let imageUrl = movie.poster_url || movie.poster_path || movie.poster || null;
        if (imageUrl && !imageUrl.startsWith('http')) {
          imageUrl = `https://img.phimapi.com/${imageUrl.replace(/^\//, '')}`;
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
          year: movie.year || (movie.release_date ? movie.release_date.substring(0, 4) : ''),
          quality: movie.quality || 'HD',
          lang: movie.lang || 'Vietsub',
          type: movie.type || 'series'
        };
      });
      
      setMovies(processedMovies);
      
      if (paginationData) {
        const totalPages = paginationData.totalPages || 
                          paginationData.total_pages || 
                          (paginationData.totalItems ? Math.ceil(paginationData.totalItems / ITEMS_PER_PAGE) : 1);
        
        const currentPage = paginationData.currentPage || 
                           paginationData.current_page || 
                           page || 
                           1;
        
        console.log('Setting pagination:', { totalPages, currentPage });
        
        setTotalPages(totalPages);
        setCurrentPage(Number(currentPage));
      } else {
        const hasMoreItems = moviesData.length === ITEMS_PER_PAGE;
        const calculatedTotalPages = hasMoreItems ? (page + 1) : page;
        console.log('No pagination data, calculated totalPages:', calculatedTotalPages);
        
        setTotalPages(calculatedTotalPages);
        setCurrentPage(Number(page));
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
    fetchMovies(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMovieClick = (movie) => {
    navigate(`/phim/${movie._id}/${movie.slug}`);
  };

  useEffect(() => {
    if (currentPage > 1) {
      const newPath = `/the-loai/${categoryId}/${categoryName}?page=${currentPage}`;
      window.history.pushState({}, '', newPath);
    }
  }, [currentPage, categoryId, categoryName]);

  useEffect(() => {
    console.log('=== 🔄 MoviesGrid useEffect TRIGGERED ===');
    console.log('categoryId:', categoryId);
    console.log('categoryName:', categoryName);
    
    const searchParams = new URLSearchParams(location.search);
    const pageFromUrl = parseInt(searchParams.get('page')) || 1;
    
    if (categoryId || categoryName) {
      console.log('✅ Calling fetchMovies with page:', pageFromUrl);
      fetchMovies(pageFromUrl);
    } else {
      console.warn('❌ No categoryId or categoryName found!');
    }
  }, [categoryId, categoryName, location.search]);

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
            <button
              onClick={() => fetchMovies(currentPage)}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
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
      <div className="min-h-screen bg-[#030712] py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-gray-900 rounded-xl shadow-2xl p-8 text-center border border-gray-800">
            <div className="mb-4">
              <svg className="w-16 h-16 text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-200 mb-4">Không tìm thấy phim</h2>
            <p className="text-gray-400 mb-6">Không có phim nào trong thể loại này.</p>
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
            {decodedCategoryName}
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
      </div>
    </div>
  );
};

export default MoviesGridByCategory;