import React, { lazy, Suspense, useRef, useEffect, useState } from 'react';
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

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
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


function App() {
  return (
    <Router>
      <div className='min-h-screen overflow-y-auto bg-gray-950'>
        <Header />
        <Routes>
          <Route 
            path="/" 
            element={
              <>
                <HeroBanner />
                <CategoriesSection />
                
                {/* Always visible sections */}
                <Suspense fallback={<LoadingFallback />}>
                  <ActionMovies />
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
      </div>
    </Router>
  );
}

export default App;