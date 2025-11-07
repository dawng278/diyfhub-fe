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
  const [touchStart, setTouchStart] = useState({})
  const [touchEnd, setTouchEnd] = useState({})

  const minSwipeDistance = 50

  const countries = [
    { slug: 'han-quoc', name: 'Phim Hàn Quốc mới', gradient: 'bg-gradient-to-r from-purple-400 to-pink-400' },
    { slug: 'trung-quoc', name: 'Phim Trung Quốc mới', gradient: 'bg-gradient-to-r from-yellow-400 to-orange-400' },
    { slug: 'au-my', name: 'Phim US-UK mới', gradient: 'bg-gradient-to-r from-pink-400 to-red-400' }
  ]

  // Responsive items per page
  const getItemsPerPage = () => {
    if (typeof window === 'undefined') return 5
    const width = window.innerWidth
    if (width < 640) return 2 // mobile
    if (width < 768) return 3 // tablet
    if (width < 1024) return 4 // small laptop
    return 5 // desktop
  }

  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage())

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(getItemsPerPage())
      // Reset indexes on resize to prevent out of bounds
      setCurrentIndexes({
        'han-quoc': 0,
        'trung-quoc': 0,
        'au-my': 0
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const promises = countries.map(country => 
          getMoviesByCountry(country.slug, { limit: 20 })
        )
        
        const responses = await Promise.all(promises)
        
        const moviesData = {}
        responses.forEach((response, index) => {
          const slug = countries[index].slug
          const items = response.data.data?.items || response.data.items || []
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
        moviesByCountry[countrySlug]?.length - itemsPerPage
      )
    }))
  }

  const handlePrev = (countrySlug) => {
    setCurrentIndexes(prev => ({
      ...prev,
      [countrySlug]: Math.max(prev[countrySlug] - 1, 0)
    }))
  }

  const handleTouchStart = (e, countrySlug) => {
    setTouchStart(prev => ({
      ...prev,
      [countrySlug]: e.targetTouches[0].clientX
    }))
  }

  const handleTouchMove = (e, countrySlug) => {
    setTouchEnd(prev => ({
      ...prev,
      [countrySlug]: e.targetTouches[0].clientX
    }))
  }

  const handleTouchEnd = (countrySlug) => {
    if (!touchStart[countrySlug] || !touchEnd[countrySlug]) return
    
    const distance = touchStart[countrySlug] - touchEnd[countrySlug]
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    
    if (isLeftSwipe) {
      handleNext(countrySlug)
    } else if (isRightSwipe) {
      handlePrev(countrySlug)
    }
    
    setTouchStart(prev => ({ ...prev, [countrySlug]: null }))
    setTouchEnd(prev => ({ ...prev, [countrySlug]: null }))
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
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 via-gray-850/10 to-gray-950 pointer-events-none" />
        
        <div className="relative p-4 sm:p-5 md:p-6 lg:p-8 space-y-6 md:space-y-8">
          {countries.map((country) => {
            const movies = moviesByCountry[country.slug]
            const currentIndex = currentIndexes[country.slug]
            const visibleMovies = movies.slice(currentIndex, currentIndex + itemsPerPage)
            const canGoBack = currentIndex > 0
            const canGoNext = currentIndex < movies.length - itemsPerPage

            return (
              <div key={country.slug} className="relative">
                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 md:gap-6">
                  {/* Title Section */}
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
                    {/* Left Arrow */}
                    {canGoBack && (
                      <button
                        onClick={() => handlePrev(country.slug)}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-12 sm:w-10 sm:h-16 md:w-12 md:h-20 -translate-x-2 sm:-translate-x-3 md:-translate-x-4 bg-gradient-to-r from-black/40 to-transparent pr-1 sm:pr-2 md:pr-3 flex items-center justify-start rounded-r-lg transition-all duration-200 ease-out hover:from-black/60 active:scale-95"
                        aria-label="Previous movies"
                      >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110">
                          <img 
                            src={arrowCircleLeft} 
                            alt="" 
                            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" 
                          />
                        </div>
                      </button>
                    )}

                    {/* Movies Grid */}
                    <div 
                      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4"
                      onTouchStart={(e) => handleTouchStart(e, country.slug)}
                      onTouchMove={(e) => handleTouchMove(e, country.slug)}
                      onTouchEnd={() => handleTouchEnd(country.slug)}
                    >
                      {visibleMovies.map((movie, index) => {
                        let posterUrl = movie.thumb_url || movie.poster_url || movie.image || (movie.poster && movie.poster.url)
                        
                        if (posterUrl && !posterUrl.startsWith('http')) {
                          posterUrl = `https://phimimg.com/${posterUrl}`
                        }
                        
                        if (!posterUrl) {
                          posterUrl = 'https://placehold.co/300x450/1f2937/ffffff?text=No+Poster'
                        }
                        
                        return (
                          <div key={movie.slug || index} className="group cursor-pointer">
                            {/* Movie Poster */}
                            <div className="relative w-full aspect-[3/2] rounded-lg overflow-hidden bg-gray-900 mb-2 shadow-lg">
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
                                <span className="text-white text-xs sm:text-sm font-semibold">Xem ngay</span>
                              </div>
                            </div>
                            
                            {/* Movie Title */}
                            <div className="space-y-0.5 sm:space-y-1">
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

                    {/* Right Arrow */}
                    {canGoNext && (
                      <button
                        onClick={() => handleNext(country.slug)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-12 sm:w-10 sm:h-16 md:w-12 md:h-20 translate-x-2 sm:translate-x-3 md:translate-x-4 bg-gradient-to-l from-black/40 to-transparent pl-1 sm:pl-2 md:pl-3 flex items-center justify-end rounded-l-lg transition-all duration-200 ease-out hover:from-black/60 active:scale-95"
                        aria-label="Next movies"
                      >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110">
                          <img 
                            src={arrowCircleRight} 
                            alt="" 
                            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" 
                          />
                        </div>
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