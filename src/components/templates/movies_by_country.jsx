import React, { useState, useEffect } from 'react'
import { getMoviesByCountry } from '../../services/apiService'
import arrowCircleLeft from '../../assets/arrow-circle-left.svg'
import arrowCircleRight from '../../assets/arrow-circle-right.svg'

function MoviesByCountry() {
  const [moviesByCountry, setMoviesByCountry] = useState({
    'han-quoc': [],
    'trung-quoc': [],
    'au-my': []
  })
  const [loading, setLoading] = useState(true)
  const [currentIndexes, setCurrentIndexes] = useState({
    'han-quoc': 0,
    'trung-quoc': 0,
    'au-my': 0
  })

  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // Minimum swipe distance to trigger navigation (in pixels)
  const minSwipeDistance = 50

  const countries = [
    { slug: 'han-quoc', name: 'Phim Hàn Quốc mới', gradient: 'bg-gradient-to-r from-purple-400 to-pink-400' },
    { slug: 'trung-quoc', name: 'Phim Trung Quốc mới', gradient: 'bg-gradient-to-r from-yellow-400 to-orange-400' },
    { slug: 'au-my', name: 'Phim US-UK mới', gradient: 'bg-gradient-to-r from-pink-400 to-red-400' }
  ]

  const ITEMS_PER_PAGE = 5

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const promises = countries.map(country => 
          getMoviesByCountry(country.slug, { limit: 20 })
        )
        
        const responses = await Promise.all(promises)
        
        console.log('Movies by country responses:', responses)
        
        const moviesData = {}
        responses.forEach((response, index) => {
          const slug = countries[index].slug
          const items = response.data.data?.items || response.data.items || []
          console.log(`${slug} movies:`, items)
          moviesData[slug] = items
        })
        
        setMoviesByCountry(moviesData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching movies by country:', error)
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  const handleNext = (countrySlug) => {
    setCurrentIndexes(prev => ({
      ...prev,
      [countrySlug]: Math.min(
        prev[countrySlug] + 1,
        moviesByCountry[countrySlug]?.length - ITEMS_PER_PAGE
      )
    }))
  }

  const handlePrev = (countrySlug) => {
    setCurrentIndexes(prev => ({
      ...prev,
      [countrySlug]: Math.max(prev[countrySlug] - 1, 0)
    }))
  }

  // Touch event handlers for swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX)
    setDragStartX(e.targetTouches[0].clientX)
    setScrollLeft(e.currentTarget.scrollLeft)
    setIsDragging(true)
  }

  const handleTouchMove = (e) => {
    if (!isDragging) return
    
    const touchX = e.targetTouches[0].clientX
    const walk = (touchX - dragStartX) * 2 // Multiply for better feel
    e.currentTarget.scrollLeft = scrollLeft - walk
  }

  const handleTouchEnd = (e, countrySlug) => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    
    if (isLeftSwipe) {
      handleNext(countrySlug)
    } else if (isRightSwipe) {
      handlePrev(countrySlug)
    }
    
    // Reset states
    setTouchStart(null)
    setTouchEnd(null)
    setIsDragging(false)
  }

  if (loading) {
    return (
      <section className="py-12 px-4 md:px-8 bg-gray-950">
        <div className="mx-auto">
          <p className="text-white text-center">Đang tải phim...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-gray-950">
      <div className="mx-auto relative rounded-lg md:rounded-2xl overflow-hidden">
        {/* Gradient Background - Chung cho cả 3 bảng */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 via-gray-850/10 to-gray-950 pointer-events-none" />
        
        <div className="relative p-4 sm:p-5 md:p-6 lg:p-8 space-y-6 md:space-y-8">
          {countries.map((country) => {
            const movies = moviesByCountry[country.slug]
            const currentIndex = currentIndexes[country.slug]
            const visibleMovies = movies.slice(currentIndex, currentIndex + ITEMS_PER_PAGE)
            const canGoBack = currentIndex > 0
            const canGoNext = currentIndex < movies.length - ITEMS_PER_PAGE

            return (
              <div key={country.slug} className="relative">
                {/* Header and Movies in same row */}
                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 md:gap-6">
                  {/* Left Section: Title */}
                  <div className="w-full sm:w-auto sm:shrink-0 sm:w-32 md:w-36 lg:w-44 pt-0 sm:pt-1">
                    <h2 className={`${country.gradient} bg-clip-text text-transparent text-xl sm:text-2xl md:text-3xl font-bold sm:font-extrabold mb-1 sm:mb-1.5 leading-tight`}>
                      {country.name}
                    </h2>
                    <a 
                      href={`/quoc-gia/${country.slug}`}
                      className="group inline-flex items-center text-xs sm:text-sm text-gray-400 hover:text-white transition-colors font-medium"
                    >
                      Xem toàn bộ
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-1.5 transform group-hover:translate-x-0.5 sm:group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>

                  {/* Movies Carousel */}
                  <div className="flex-1 relative min-w-0">
                    {/* Left Arrow - Only show on desktop and when scrolled */}
                    {canGoBack && (
                      <button
                        onClick={() => handlePrev(country.slug)}
                        className="hidden md:flex absolute left-0 top-[40%] -translate-y-1/2 -translate-x-3 z-10 w-10 h-10 bg-white rounded-full items-center justify-center transition-all shadow-lg hover:scale-110"
                        aria-label="Previous movies"
                      >
                        <img src={arrowCircleLeft} alt="" className="w-6 h-6" />
                      </button>
                    )}

                    {/* Movies Grid */}
                    <div 
                      className="flex justify-between gap-2 overflow-x-auto transition-all duration-300 ease-in-out"
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={(e) => handleTouchEnd(e, country.slug)}
                      style={{
                        WebkitOverflowScrolling: 'touch',
                        scrollbarWidth: 'none', /* Firefox */
                        msOverflowStyle: 'none', /* IE and Edge */
                      }}
                    >
                      {/* Inline style for WebKit browsers */}
                      <style jsx>{`
                        div::-webkit-scrollbar {
                          display: none; /* Chrome, Safari, Opera */
                        }
                      `}</style>
                      {visibleMovies.map((movie, index) => {
                        // Use thumb_url (banner) instead of poster_url
                        let posterUrl = movie.thumb_url || movie.poster_url || movie.image || (movie.poster && movie.poster.url)
                        
                        if (posterUrl && !posterUrl.startsWith('http')) {
                          posterUrl = `https://phimimg.com/${posterUrl}`
                        }
                        
                        if (!posterUrl) {
                          posterUrl = 'https://placehold.co/300x450/1f2937/ffffff?text=No+Poster'
                        }
                        
                        return (
                          <div key={movie.slug || index} className="group cursor-pointer shrink-0">
                            {/* Movie Poster - Landscape */}
                            <div className="relative w-28 xs:w-32 sm:w-36 md:w-44 lg:w-52 xl:w-72 aspect-[3/2] rounded-lg overflow-hidden bg-gray-900 mb-2 shadow-lg">
                              <img
                                src={posterUrl}
                                alt={movie.name || 'Movie poster'}
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-300 ease-out"
                                loading="lazy"
                                decoding="async"
                                onError={(e) => {
                                  e.target.src = 'https://placehold.co/300x450/1f2937/ffffff?text=Error'
                                }}
                              />
                              {/* Overlay on hover */}
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <span className="text-white text-xs font-semibold">Xem ngay</span>
                              </div>
                            </div>
                            
                            {/* Movie Title */}
                            <div className="space-y-0.5 sm:space-y-1 w-28 xs:w-32 sm:w-36 md:w-44 lg:w-52 xl:w-72">
                              <h3 className="text-white text-xs sm:text-sm font-medium line-clamp-2 group-hover:text-purple-400 transition-colors duration-200">
                                {movie.name}
                              </h3>
                              <p className="text-gray-400 text-[10px] sm:text-xs">
                                {movie.year || 'N/A'}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Right Arrow - Only show on desktop when more movies available */}
                    {canGoNext && (
                      <button
                        onClick={() => handleNext(country.slug)}
                        className="hidden md:flex absolute right-0 top-[40%] -translate-y-1/2 translate-x-3 z-10 w-10 h-10 bg-white rounded-full items-center justify-center transition-all shadow-lg hover:scale-110"
                        aria-label="Next movies"
                      >
                        <img src={arrowCircleRight} alt="" className="w-6 h-6" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default MoviesByCountry