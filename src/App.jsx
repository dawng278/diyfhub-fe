import React from 'react'
import Header from './components/organisms/header.jsx'
import HeroBanner from './components/templates/HeroBanner.jsx'
import CategoriesSection from './components/templates/categoriesSection.jsx'
import MoviesByCountry from './components/templates/movies_by_country.jsx'
import LeaderboardSection from './components/templates/leaderboardSection.jsx'

function App() {


  // 6. Trả về JSX của bạn, gộp với nội dung
  return (
    <div className='min-h-screen overflow-y-auto bg-gray-950'>
      <Header />
      <HeroBanner /> {/* Hiển thị nội dung ở đây */}
      <CategoriesSection /> {/* Hiển thị thể loại phim */}
      <MoviesByCountry /> {/* Hiển thị phim theo quốc gia */}
      <LeaderboardSection /> {/* Hiển thị bảng xếp hạng */}
    </div>
  )
}

export default App