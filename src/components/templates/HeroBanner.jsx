import React from "react";
import { useNavigate } from 'react-router-dom';
import arrowRight from "../../assets/arrowRight.svg";
import heart from "../../assets/heart.svg";
import infoCircle from "../../assets/info-circle.svg";

import { useState, useEffect } from 'react';
import { getNewMovies, getMovieBySlug } from '../../services/apiService';

function HeroBanner({ movies: propMovies }) {
    const navigate = useNavigate();
    const [movies, setMovies] = useState(propMovies || []);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(!propMovies);
    const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    // Detect screen size
    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 1024); // < 1024px is mobile/tablet
      };
      
      checkMobile();
      window.addEventListener('resize', checkMobile);
      
      return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        // If movies are provided via props, don't fetch
        if (propMovies && propMovies.length > 0) {
          setMovies(propMovies);
          setLoading(false);
          return;
        }

        const fetchData = async () => {
          try {
            setLoading(true);
            // Call the API
            const response = await getNewMovies(1);
            
            // Log the response for debugging
            console.log('Full API Response:', response);
            
            // Handle the response structure - extract items array
            let movieData = [];
            if (response && response.items && Array.isArray(response.items)) {
              movieData = response.items;
            } else if (response && response.data && response.data.items && Array.isArray(response.data.items)) {
              movieData = response.data.items;
            } else if (Array.isArray(response)) {
              movieData = response;
            }
            
            console.log('Processed Movies Data:', movieData);
            
            // Fetch detailed info for first 4 movies (for display)
            const detailedMovies = await Promise.all(
              movieData.slice(0, 4).map(async (movie) => {
                try {
                  const detailResponse = await getMovieBySlug(movie.slug);
                  console.log(`=== Detail Response for ${movie.slug} ===`);
                  console.log('Full response:', detailResponse);
                  console.log('Response keys:', Object.keys(detailResponse || {}));
                  
                  // Check different possible structures
                  let detailData = null;
                  if (detailResponse?.movie) {
                    detailData = detailResponse.movie;
                    console.log('Found in detailResponse.movie');
                  } else if (detailResponse?.data?.item) {
                    detailData = detailResponse.data.item;
                    console.log('Found in detailResponse.data.item');
                  } else if (detailResponse?.data) {
                    detailData = detailResponse.data;
                    console.log('Found in detailResponse.data');
                  } else if (detailResponse?.item) {
                    detailData = detailResponse.item;
                    console.log('Found in detailResponse.item');
                  }
                  
                  if (detailData) {
                    console.log('Detail data keys:', Object.keys(detailData));
                    console.log('type:', detailData.type);
                    console.log('quality:', detailData.quality);
                    console.log('content:', detailData.content);
                    console.log('category:', detailData.category);
                    
                    return {
                      ...movie,
                      type: detailData.type || movie.type,
                      quality: detailData.quality || movie.quality,
                      content: detailData.content || movie.content,
                      genre: detailData.category?.map(cat => cat.name) || movie.genre,
                    };
                  }
                  
                  console.log('No detail data found, returning original movie');
                  return movie;
                } catch (err) {
                  console.error(`Error fetching detail for ${movie.slug}:`, err);
                  return movie;
                }
              })
            );
            
            // Combine detailed movies with the rest
            const finalMovies = [
              ...detailedMovies,
              ...movieData.slice(4)
            ];
            
            console.log('Final Movies with Details:', finalMovies);
            
            setMovies(finalMovies);
            setError(null);
          } catch (err) {
            console.error('Lỗi khi gọi API:', err);
            console.error('Error details:', err.message);
            setError(err);
          } finally {
            setLoading(false);
          }
        };
    
        fetchData();
      }, [propMovies]);

      // Debug logging
      console.log('=== DEBUG INFO ===');
      console.log('Loading:', loading);
      console.log('Error:', error);
      console.log('Movies array length:', movies.length);
      console.log('Current movie index:', currentMovieIndex);
      console.log('Movies array:', movies);
      if (movies.length > 0) {
        console.log('First movie object:', movies[0]);
        console.log('First movie keys:', Object.keys(movies[0]));
      }
      console.log('==================');

      let content;
      if (loading) {
        content = <p className="text-white text-center">Loading...</p>;
      } else if (error) {
        content = <p className="text-red-500 text-center">Lỗi: {error.message}. Vui lòng kiểm tra F12.</p>;
      } else if (movies.length === 0) {
        content = <p className="text-white text-center">No movies found.</p>;
      } else {
        // Hiển thị phim theo index hiện tại
        const movie = movies[currentMovieIndex];
        
        // Use poster_url for mobile/tablet, thumb_url for desktop
        const backgroundImage = isMobile ? movie.poster_url : movie.thumb_url;
        
        content = (
          <div className="relative w-full h-screen" style={{backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
            {/* Gradient Overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-linear-to-r from-black/90 via-black/50 to-transparent" />
            <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-transparent via-transparent to-[#030712]" />

            {/* Poster Image */}
            <div className="absolute left-1/2 -translate-x-1/2 top-24 md:left-12 md:translate-x-0 md:top-auto md:bottom-48 lg:left-16 z-10">
              <img 
                src={movie.poster_url} 
                alt={movie.name}
                className="w-[190px] h-[270px] md:w-60 md:h-[340px] lg:w-[280px] lg:h-[400px] object-cover rounded-xl shadow-2xl border-2 border-white/20"
              />
            </div>

            {/* Content Container */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[400px] md:left-80 md:translate-x-0 md:top-auto md:bottom-48 lg:left-[400px] w-[90%] md:max-w-xl lg:max-w-2xl z-10 text-center md:text-left space-y-3 md:space-y-4">
              {/* Movie Title */}
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl line-clamp-2">
                {movie.name}
              </h1>

              {/* Movie Info Row */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3">
                {/* IMDb Score */}
                {movie.tmdb?.vote_average > 0 && (
                  <div className="flex items-center gap-1 px-2 py-1 md:px-3 border border-[#eb3c2c]/90 rounded-md backdrop-blur-sm">
                    <span className="text-white font-semibold text-xs md:text-sm">IMDb</span>
                    <span className="text-white text-xs md:text-sm">{movie.tmdb.vote_average}</span>
                  </div>
                )}

                {/* Year */}
                {movie.year && (
                  <div className="px-2 py-1 md:px-3 bg-white/20 rounded-md backdrop-blur-sm border border-white/30">
                    <span className="text-white text-xs md:text-sm font-medium">{movie.year}</span>
                  </div>
                )}

                {/* Quality/Lang */}
                {movie.quality && (
                  <div className="px-2 py-1 md:px-3 bg-white/20 rounded-md backdrop-blur-sm border border-white/30">
                    <span className="text-white text-xs md:text-sm font-medium">{movie.quality}</span>
                  </div>
                )}

                {/* Type */}
                {movie.type && (
                  <div className="px-2 py-1 md:px-3 bg-white/20 rounded-md backdrop-blur-sm border border-white/30">
                    <span className="text-white text-xs md:text-sm font-medium">{movie.type}</span>
                  </div>
                )}
              </div>

              {/* Genres */}
              {movie.genre && movie.genre.length > 0 && (
                <div className="hidden md:flex items-center justify-center md:justify-start gap-2">
                  {movie.genre.slice(0, 3).map((g, i) => (
                    <span key={i} className="px-2 py-1 md:px-3 bg-white/10 rounded-full backdrop-blur-sm text-white text-xs md:text-sm">
                      {g}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              {movie.content && (
                <p className="hidden md:block text-white/90 text-sm md:text-base leading-relaxed line-clamp-2 md:line-clamp-3 drop-shadow-lg text-center md:text-left">
                  {movie.content}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-center md:justify-start gap-2 md:gap-4 pt-2">
                {/* Watch Now Button */}
                <button 
                  onClick={() => navigate(`/phim/${movie._id}/${movie.slug}`)}
                  className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-[#ff1500] hover:bg-[#cc1100] rounded-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  <span className="text-white font-bold text-xs md:text-sm">Xem ngay</span>
                  <img className="w-3 h-3 md:w-4 md:h-4" alt="Arrow" src={arrowRight} />
                </button>

                {/* Favorite & Info Buttons */}
                <div className="flex items-center gap-2 md:gap-3 px-3 py-2 md:px-4 md:py-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm border border-white/30 transition-all duration-300 cursor-pointer">
                  <img className="w-4 h-4 md:w-5 md:h-5" alt="Heart" src={heart} />
                  <div className="w-px h-4 md:h-5 bg-white/30" />
                  <img className="w-4 h-4 md:w-5 md:h-5" alt="Info" src={infoCircle} />
                </div>
              </div>
            </div>

            {/* 4 Thumbnail phim */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:bottom-20 md:left-auto md:translate-x-0 md:right-8 lg:bottom-24 lg:right-24 flex gap-2 md:gap-3 z-20">
              {movies.slice(0, 4).map((m, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentMovieIndex(index)}
                  className={`w-[60px] h-[36px] md:w-20 md:h-12 lg:w-[90px] lg:h-[55px] rounded-md md:rounded-lg cursor-pointer transition-all duration-300 overflow-hidden ${
                    currentMovieIndex === index 
                      ? 'border-2 border-[#ff1500] scale-110 shadow-2xl' 
                      : 'border border-white/50 opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                  style={{
                    backgroundImage: `url(${m.thumb_url || m.poster_url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="w-full h-full bg-black/20 hover:bg-black/0 transition-all" />
                </div>
              ))}
            </div>
          </div>
        );
      }

  return (
    <div>
      {content}
    </div>
  );
};

export default HeroBanner;