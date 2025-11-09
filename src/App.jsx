import React, { lazy, Suspense, useRef, useEffect, useState } from 'react';
import { 
  getNewMovies, 
  getCategories, 
  getMoviesByCategory 
} from './services/apiService';
import LoadingScreen from './components/templates/LoadingScreen';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/organisms/header';
import HeroBanner from './components/templates/HeroBanner';
import CategoriesSection from './components/templates/categoriesSection';
import MoviesByCountry from './components/templates/movies_by_country';
import LeaderboardSection from './components/templates/leaderboardSection';
import CategoryMovies from './components/templates/CategoryMovies';

// Lazy load movie components
const ActionMovies = lazy(() => import('./components/templates/categories/ActionMovies'));
const WesternMovies = lazy(() => import('./components/templates/categories/WesternMovies'));
const WarMovies = lazy(() => import('./components/templates/categories/WarMovies'));
const SportsMovies = lazy(() => import('./components/templates/categories/SportsMovies'));
const RomanceMovies = lazy(() => import('./components/templates/categories/RomanceMovies'));
const ComedyMovies = lazy(() => import('./components/templates/categories/ComedyMovies'));
const AdventureMovies = lazy(() => import('./components/templates/categories/AdventureMovies'));
const AdultMovies = lazy(() => import('./components/templates/categories/AdultMovies'));
const ChildrenMovies = lazy(() => import('./components/templates/categories/ChildrenMovies'));
const ClassicMovies = lazy(() => import('./components/templates/categories/ClassicMovies'));
const CrimeMovies = lazy(() => import('./components/templates/categories/CrimeMovies'));
const DocumentaryMovies = lazy(() => import('./components/templates/categories/DocumentaryMovies'));
const LatestUpdatedMovies = lazy(() => import('./components/templates/categories/LatestUpdatedMovies'));
const AnimeMovies = lazy(() => import('./components/templates/categories/AnimeMovies'));
const DramaMovies = lazy(() => import('./components/templates/categories/DramaMovies'));
const FamilyMovies = lazy(() => import('./components/templates/categories/FamilyMovies'));
const HistoricalMovies = lazy(() => import('./components/templates/categories/HistoricalMovies'));
const HistoryMovies = lazy(() => import('./components/templates/categories/HistoryMovies'));
const HorrorMovies = lazy(() => import('./components/templates/categories/HorrorMovies'));
const MartialArtsMovies = lazy(() => import('./components/templates/categories/MartialArtsMovies'));
const MusicMovies = lazy(() => import('./components/templates/categories/MusicMovies'));
const MysteryMovies = lazy(() => import('./components/templates/categories/MysteryMovies'));
const MythologyMovies = lazy(() => import('./components/templates/categories/MythologyMovies'));
const PoliticalDramaMovies = lazy(() => import('./components/templates/categories/PoliticalDramaMovies'));
const SchoolMovies = lazy(() => import('./components/templates/categories/SchoolMovies'));
const ScienceFictionMovies = lazy(() => import('./components/templates/categories/ScienceFictionMovies'));

// Lazy loaded component with intersection observer
const LazyLoadComponent = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: '200px', // Load earlier for smoother experience
        threshold: 0.01
      }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [hasLoaded]);

  return (
    <div ref={ref}>
      {isVisible ? (
        <Suspense fallback={<LoadingFallback />}>
          {children}
        </Suspense>
      ) : (
        <div className="h-4" /> // Small placeholder to maintain scroll position
      )}
    </div>
  );
};

const LoadingFallback = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      <div className="text-gray-400 text-sm">Đang tải...</div>
    </div>
  </div>
);

// Main app loading state
const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialData, setInitialData] = useState({
    heroBanner: null,
    categories: [],
    actionMovies: []
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch initial data in parallel
        const [heroBannerRes, categoriesRes, actionMoviesRes] = await Promise.all([
          // Fetch latest movies for banner (first page, 5 items)
          getNewMovies(1).then(res => res.data.data || []),
          // Fetch all categories
          getCategories().then(res => res.data || []),
          // Fetch action movies (first page, 10 items)
          getMoviesByCategory('hanh-dong', { limit: 10 }).then(res => res.data?.data?.items || [])
        ]);

        setInitialData({
          heroBanner: heroBannerRes,
          categories: categoriesRes,
          actionMovies: actionMoviesRes
        });
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading initial data:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Đã xảy ra lỗi</h2>
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header categories={initialData.categories} />
      <Routes>
          <Route 
            path="/" 
            element={
              <>
                <HeroBanner movies={initialData.heroBanner} />
                <CategoriesSection categories={initialData.categories} />
                
                {/* Always visible sections */}
                <Suspense fallback={<LoadingFallback />}>
                  <ActionMovies initialMovies={initialData.actionMovies} />
                </Suspense>
                
                <MoviesByCountry />
                <LeaderboardSection />
                
                {/* Lazy loaded sections */}
                <LazyLoadComponent><AdultMovies /></LazyLoadComponent>
                <LazyLoadComponent><LatestUpdatedMovies /></LazyLoadComponent>
                <LazyLoadComponent><WesternMovies /></LazyLoadComponent>
                <LazyLoadComponent><AnimeMovies /></LazyLoadComponent>
                <LazyLoadComponent><WarMovies /></LazyLoadComponent>
                <LazyLoadComponent><SportsMovies /></LazyLoadComponent>
                <LazyLoadComponent><RomanceMovies /></LazyLoadComponent>
                <LazyLoadComponent><ComedyMovies /></LazyLoadComponent>
                <LazyLoadComponent><AdventureMovies /></LazyLoadComponent>
                <LazyLoadComponent><ChildrenMovies /></LazyLoadComponent>
                <LazyLoadComponent><ClassicMovies /></LazyLoadComponent>
                <LazyLoadComponent><CrimeMovies /></LazyLoadComponent>
                <LazyLoadComponent><DocumentaryMovies /></LazyLoadComponent>
                <LazyLoadComponent><DramaMovies /></LazyLoadComponent>
                <LazyLoadComponent><FamilyMovies /></LazyLoadComponent>
                <LazyLoadComponent><HistoricalMovies /></LazyLoadComponent>
                <LazyLoadComponent><HistoryMovies /></LazyLoadComponent>
                <LazyLoadComponent><HorrorMovies /></LazyLoadComponent>
                <LazyLoadComponent><MartialArtsMovies /></LazyLoadComponent>
                <LazyLoadComponent><MusicMovies /></LazyLoadComponent>
                <LazyLoadComponent><MysteryMovies /></LazyLoadComponent>
                <LazyLoadComponent><MythologyMovies /></LazyLoadComponent>
                <LazyLoadComponent><PoliticalDramaMovies /></LazyLoadComponent>
                <LazyLoadComponent><SchoolMovies /></LazyLoadComponent>
                <LazyLoadComponent><ScienceFictionMovies /></LazyLoadComponent>
              </>
            } 
          />
          <Route path="/category/:categoryId/:categoryName" element={<CategoryMovies />} />
        </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <div className='min-h-screen overflow-y-auto bg-gray-950'>
        <Suspense fallback={<LoadingScreen />}>
          <AppContent />
        </Suspense>
      </div>
    </Router>
  );
}

export default App;