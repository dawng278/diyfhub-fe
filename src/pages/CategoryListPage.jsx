import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMoviesByCategory, getCategories, searchMovie } from '../services/apiService';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/outline';
import MovieGridCard from '../components/molecules/MovieGridCard';

const ITEMS_PER_PAGE = 24;

// Loading State Component
const LoadingState = ({ category }) => (
  <div className="min-h-screen bg-gray-50 py-6">
    <div className="container mx-auto px-3">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Đang tải {category.name}...</h1>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-2/3 bg-gray-200 rounded-lg mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Error State Component
const ErrorState = ({ error, category, onRetry }) => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="container mx-auto px-3">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{category.name}</h1>
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p className="font-medium">{error}</p>
          <p className="text-sm mt-1">Vui lòng thử lại sau.</p>
        </div>
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    </div>
  </div>
);

// Main Content Component
const MainContent = ({ movies, category }) => {
  // Limit to 24 movies
  const displayedMovies = movies.slice(0, 24);

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-3">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{category.name}</h1>
          {movies.length > 24 && (
            <p className="text-sm text-gray-500 mt-1">
              Hiển thị 24/{movies.length} phim. Để xem thêm, vui lòng sử dụng tìm kiếm hoặc lọc.
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {displayedMovies.map((movie) => (
            <MovieGridCard key={movie._id || movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};

const CategoryListPage = () => {
  const { categoryId, categoryName } = useParams();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [category, setCategory] = useState({ name: categoryName || 'Thể loại' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const findCategory = useCallback(async (id, name) => {
    try {
      const response = await getCategories();
      const categories = response.data?.data || [];
      
      let category = categories.find(cat => cat._id === id || cat.id === id);
      
      if (!category && name) {
        const formattedName = name.toLowerCase().replace(/\s+/g, '-');
        category = categories.find(cat => 
          cat.slug === formattedName || 
          cat.slug?.toLowerCase() === formattedName.toLowerCase()
        );
      }

      if (category) {
        setCategory(category);
        return category;
      }
      return null;
    } catch (err) {
      console.error('Error finding category:', err);
      return null;
    }
  }, []);

  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      
      if (categoryId) {
        // Nếu có categoryId, tìm category trước
        const foundCategory = await findCategory(categoryId, categoryName);
        if (foundCategory) {
          response = await getMoviesByCategory(foundCategory.slug || foundCategory._id, {
            limit: 100 // Fetch more to have enough for the 24-item limit
          });
        } else {
          throw new Error('Không tìm thấy thể loại này');
        }
      } else if (categoryName) {
        // Nếu chỉ có categoryName, thử tìm kiếm theo slug
        const foundCategory = await findCategory(null, categoryName);
        if (foundCategory) {
          response = await getMoviesByCategory(foundCategory.slug || foundCategory._id, {
            limit: 100 // Fetch more to have enough for the 24-item limit
          });
        } else {
          // Nếu không tìm thấy category, thử tìm kiếm phim trực tiếp
          response = await searchMovie({
            keyword: categoryName,
            limit: 100 // Fetch more to have enough for the 24-item limit
          });
        }
      } else {
        // Nếu không có gì, chuyển về trang chủ
        navigate('/');
        return;
      }

      const { data } = response;
      setMovies(data.data || []);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, [categoryId, categoryName, findCategory, navigate]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  if (loading) {
    return <LoadingState category={category} />;
  }

  if (error) {
    return <ErrorState error={error} category={category} onRetry={() => fetchMovies()} />;
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-3">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">{category.name}</h1>
            <p className="text-gray-600 mb-6">Không tìm thấy phim nào trong thể loại này.</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <MainContent movies={movies} category={category} />;
};

export default CategoryListPage;
