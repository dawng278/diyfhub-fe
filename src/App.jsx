import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/organisms/header';
import HeroBanner from './components/templates/HeroBanner';
import CategoriesSection from './components/templates/categoriesSection';
import ActionMovies from './components/templates/categories/ActionMovies';
import MoviesByCountry from './components/templates/movies_by_country';
import LeaderboardSection from './components/templates/leaderboardSection';
import CategoryMovies from './components/templates/CategoryMovies';
import WesternMovies from './components/templates/categories/WesternMovies';
import WarMovies from './components/templates/categories/WarMovies';
import SportsMovies from './components/templates/categories/SportsMovies';
import RomanceMovies from './components/templates/categories/RomanceMovies';
import ComedyMovies from './components/templates/categories/ComedyMovies';
import AdventureMovies from './components/templates/categories/AdventureMovies';
import AdultMovies from './components/templates/categories/AdultMovies';
import ChildrenMovies from './components/templates/categories/ChildrenMovies';
import ClassicMovies from './components/templates/categories/ClassicMovies';
import CrimeMovies from './components/templates/categories/CrimeMovies';
import DocumentaryMovies from './components/templates/categories/DocumentaryMovies';
import LatestUpdatedMovies from './components/templates/categories/LatestUpdatedMovies';
import AnimeMovies from './components/templates/categories/AnimeMovies';

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
                <ActionMovies />
                <MoviesByCountry />
                <LeaderboardSection />
                <AdultMovies />
                <LatestUpdatedMovies />
                <WesternMovies />
                <AnimeMovies />
                <WarMovies />
                <SportsMovies />
                <RomanceMovies />
                <ComedyMovies />
                <AdventureMovies />
                <ChildrenMovies />
                <ClassicMovies />
                <CrimeMovies />
                <DocumentaryMovies />
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