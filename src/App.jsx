import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/organisms/header';

// Lazy load pages
const HomePage = lazy(() => import('./pages/homePage'));
const CategoryListPage = lazy(() => import('./pages/CategoryListPage'));
const CategoryMovies = lazy(() => import('./components/templates/CategoryMovies.jsx'));
const MoviesGridByCountry = lazy(() => import('./components/templates/MoviesGridByCountry.jsx'));
const MovieDetailPage = lazy(() => import('./pages/MovieDetail'));
const SingleMoviesPage = lazy(() => import('./pages/SingleMoviesPage'));
const SeriesMoviesPage = lazy(() => import('./pages/SeriesMoviesPage'));
const AnimePage = lazy(() => import('./pages/AnimePage'));
import WatchMovie from './pages/WatchMovie';
import MoviesGridByCategory from './components/templates/MoviesGridByCategory.jsx';

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-900">
    <div className="flex flex-col items-center gap-3">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
      <div className="text-white text-lg">Đang tải ứng dụng...</div>
    </div>
  </div>
);

// 404 Not Found page
const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
    <div className="text-center">
      <h2 className="text-4xl font-bold mb-4">404</h2>
      <p className="text-xl mb-6">Trang không tìm thấy</p>
      <a 
        href="/" 
        className="px-6 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors inline-block"
      >
        Về trang chủ
      </a>
    </div>
  </div>
);

// Main App component with routing
function App() {
  return (
    <Router>
      <Navbar />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          {/* Category routes */}
          <Route path="/the-loai" element={<CategoryListPage />} />
          <Route path="/the-loai/:categoryId/:categoryName" element={<MoviesGridByCategory />} />
          
          {/* Country routes */}
          <Route path="/quoc-gia/:countrySlug/:countryName" element={<MoviesGridByCountry />} />
          
          {/* Movie detail routes */}
          <Route path="/phim/:movieId/:movieSlug" element={<MovieDetailPage />} />
          <Route path="/xem-phim/:movieSlug/:episodeSlug" element={<WatchMovie />} />
          
          {/* Movie type routes */}
          <Route path="/phim-le" element={<SingleMoviesPage />} />
          <Route path="/phim-bo" element={<SeriesMoviesPage />} />
          <Route path="/anime" element={<AnimePage />} />
          
          {/* Search route */}
          {/* <Route path="/tim-kiem" element={<SearchPage />} /> */}
          
          {/* 404 - Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
