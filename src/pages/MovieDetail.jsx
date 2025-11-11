import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getMovieBySlug, getRelatedMovies, getMovieByTmdbId } from '../services/apiService';
import LoadingSpinner from '../components/atoms/LoadingSpinner';
import MovieCard from '../components/molecules/MovieCard';
import { FaPlay, FaStar, FaCalendarAlt, FaClock, FaFlag, FaFilm, FaEye, FaHeart, FaShareAlt, FaFacebook, FaTwitter, FaLink, FaPlayCircle } from 'react-icons/fa';
import { SiImdb } from 'react-icons/si';

const MovieDetail = () => {
  const { movieId, movieSlug } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('episodes');
  const [episodeList, setEpisodeList] = useState([]);

  // Fetch movie details
  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;

      // Try to get movie by slug first (since we're using slug in the URL)
      if (movieSlug) {
        try {
          console.log('Fetching movie by slug:', movieSlug);
          response = await getMovieBySlug(movieSlug);
          console.log('API Response by slug:', response);
          
          // Check if we have valid movie data
          if (response && response.movie) {
            // Process movie data to include calculated fields and defaults
            const processedMovie = {
              ...response.movie,
              // Rating information
              imdb_rating: response.movie.tmdb?.vote_average || 
                          response.movie.imdb?.rating || 
                          response.movie.vote_average || 
                          response.movie.rating || 
                          0,
              
              // Episode information
              episode_current: response.movie.episode_current || '',
              episode_total: response.movie.episode_total || response.movie.total_episodes || 0,
              
              // Localization and type
              lang: response.movie.lang || 'Vietsub',
              type: response.movie.type || 'series',
              
              // Title with fallbacks
              title: response.movie.name || response.movie.title || response.movie.origin_name || 'Không có tiêu đề',
              name: response.movie.name || response.movie.title || response.movie.origin_name || 'Không có tiêu đề',
              
              // Ensure we have an empty array for episodes if not provided
              episodes: response.movie.episodes || []
            };
            console.log('Processed movie data:', processedMovie);
            setMovie(processedMovie);
            
            // If there are categories, fetch related movies
            if (response.movie.category && response.movie.category.length > 0) {
              try {
                const related = await getRelatedMovies(
                  response.movie.category[0]._id,
                  response.movie._id,
                  6
                );
                setRelatedMovies(related.data?.items || []);
              } catch (err) {
                console.error('Error fetching related movies:', err);
                setRelatedMovies([]);
              }
            }
            
            setLoading(false);
            return; // Exit if successful
          }
          console.log('API Response by slug:', response); // Debug log

          // Check if we got valid movie data
          if (response?.data) {
            setMovie(response.data);

            // If we have categories, try to fetch related movies
            if (response.data.category?.length > 0) {
              try {
                const relatedResponse = await getRelatedMovies(
                  response.data.category[0]._id,
                  response.data._id,
                  6
                );
                setRelatedMovies(relatedResponse?.data?.items || []);
              } catch (err) {
                console.error('Error fetching related movies:', err);
                setRelatedMovies([]);
              }
            }

            setLoading(false);
            return; // Exit if successful
          }
        } catch (err) {
          console.error('Error fetching by slug:', err);
          // Continue to try with ID if slug fails
        }
      }

      // If we have a movieId and slug didn't work, try with ID
      if (movieId && movieId !== 'undefined') {
        try {
          response = await getMovieByTmdbId('movie', movieId);
          console.log('API Response by ID:', response); // Debug log

          if (response?.data) {
            setMovie(response.data);

            // If we have categories, try to fetch related movies
            if (response.data.category?.length > 0) {
              try {
                const relatedResponse = await getRelatedMovies(
                  response.data.category[0]._id,
                  response.data._id,
                  6
                );
                setRelatedMovies(relatedResponse?.data?.items || []);
              } catch (err) {
                console.error('Error fetching related movies:', err);
                setRelatedMovies([]);
              }
            }

            setLoading(false);
            return; // Exit if successful
          }
        } catch (err) {
          console.error('Error fetching by ID:', err);
        }
      }

      // If we get here, both methods failed
      console.error('No valid movie data found');
      setError('Không tìm thấy thông tin phim');
    } catch (err) {
      console.error('Error in fetchMovieDetails:', err);
      setError(err.message || 'Có lỗi xảy ra khi tải thông tin phim');
    } finally {
      setLoading(false);
    }
  };

  // Parse episode data from string
  const parseEpisodes = (episodeString) => {
    if (!episodeString) return [];
    
    return episodeString.split('\n').map(line => {
      const [name, slug, url] = line.split('|');
      return { name, slug, url };
    });
  };

  // Navigate to watch page
  const handleWatchEpisode = (episodeSlug) => {
    navigate(`/xem-phim/${movie.slug}/${episodeSlug}`);
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    // Reset states when URL parameters change
    setMovie(null);
    setRelatedMovies([]);
    setError(null);

    if (movieSlug) {
      fetchMovieDetails();
    } else if (movieId && movieId !== 'undefined') {
      fetchMovieDetails();
    } else {
      // If no valid ID or slug is provided, redirect to home
      navigate('/');
    }

    // Cleanup function to prevent memory leaks
    return () => {
      // You can add cleanup code here if needed
    };
  }, [movieId, movieSlug, navigate]);

  // Update episode list when movie data changes
  useEffect(() => {
    if (movie?.episode_data) {
      setEpisodeList(parseEpisodes(movie.episode_data));
    } else if (movie?.episode_total) {
      // Fallback to numeric episodes if no episode data
      setEpisodeList(Array.from({ length: movie.episode_total }, (_, i) => ({
        name: `Tập ${i + 1}`,
        slug: `tap-${String(i + 1).padStart(2, '0')}`,
        url: `#`
      })));
    }
  }, [movie]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Đang cập nhật';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  // Handle share
  const handleShare = (platform) => {
    const url = window.location.href;
    const title = movie?.name || '';

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        // You might want to show a toast notification here
        alert('Đã sao chép liên kết vào bộ nhớ tạm');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
            <span className="ml-3 text-white">Đang tải thông tin phim...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Đã xảy ra lỗi</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-white mb-4">Không tìm thấy phim</h2>
            <p className="text-gray-400 mb-6">Phim bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            <Link
              to="/"
              className="inline-block px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Movie Header with Backdrop */}
        <div
          className="relative h-64 md:h-96 flex items-end rounded-lg overflow-hidden mb-8"
        >
          {/* Video Trailer Background */}
          {movie.trailer_url || movie.trailer ? (
            <div className="absolute inset-0 w-full h-full">
              <video
                key={movie.trailer_url || movie.trailer} // Force re-render when URL changes
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
                poster={movie.backdrop_path || movie.poster_path}
                onEnded={(e) => {
                  // Force restart the video to ensure smooth looping
                  e.target.currentTime = 0;
                  e.target.play().catch(error => {
                    console.log('Video play error:', error);
                  });
                }}
                onError={(e) => {
                  console.error('Video playback error:', {
                    error: e,
                    src: movie.trailer_url || movie.trailer,
                    type: 'video/mp4'
                  });
                }}
                onCanPlay={(e) => {
                  console.log('Video can play', e);
                  e.target.play().catch(error => {
                    console.log('Auto-play failed:', error);
                  });
                }}
              >
                <source 
                  src={movie.trailer_url || movie.trailer} 
                  type="video/mp4" 
                />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90" />
            </div>
          ) : (
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${movie.backdrop_path || movie.poster_path})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90" />
            </div>
          )}
        <div/>
          <div className="container mx-auto px-4 relative z-10 pb-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Movie Poster */}
              <div className="w-40 h-56 md:w-56 md:h-80 rounded-lg overflow-hidden shadow-xl flex-shrink-0">
                <img
                  src={movie.poster_url}
                  alt={movie.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-movie.jpg'; // Fallback image
                  }}
                />
              </div>

              {/* Movie Info */}
              <div className="text-white flex-1 relative z-10">
                {/* Play Trailer Button */}
                {movie.trailer_url && (
                  <button 
                    className="absolute -top-12 right-0 bg-red-600 hover:bg-red-700 text-white rounded-full p-3 shadow-lg transform transition-transform hover:scale-105"
                    onClick={() => {
                      // You can add a modal or fullscreen player here
                      window.open(movie.trailer_url, '_blank');
                    }}
                    aria-label="Play trailer"
                  >
                    <FaPlayCircle className="w-8 h-8" />
                  </button>
                )}
                <div className="flex items-center flex-wrap gap-2 mb-2">
                  <h1 className="text-2xl md:text-4xl font-bold">{movie.name}</h1>
                  <span className="bg-red-600 text-xs px-2 py-1 rounded">
                    {movie.quality || 'HD'}
                  </span>
                  {movie.episode_count && (
                    <span className="bg-blue-600 text-xs px-2 py-1 rounded">
                      {movie.episode_count} tập
                    </span>
                  )}
                </div>

                <div className="flex items-center flex-wrap gap-4 text-sm text-gray-300 mb-4">
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span>{movie.imdb_rating?.toFixed(1) || 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-1" />
                    <span>{movie.year || 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="mr-1" />
                    <span>{movie.runtime || 'N/A'} phút</span>
                  </div>
                  <div className="flex items-center">
                    <FaEye className="mr-1" />
                    <span>{movie.views?.toLocaleString() || '0'} lượt xem</span>
                  </div>
                </div>

                {/* Categories */}
                {movie.category && (movie.category.length > 0 || movie.category_id) && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {Array.isArray(movie.category) ? (
                      movie.category.map((cat) => {
                        const categoryId = cat._id || cat.id;
                        const categoryName = cat.name || cat.category_name;
                        // Use slug if available, otherwise generate from name
                        const categorySlug = cat.slug || cat.slug_url || 
                          categoryName.toLowerCase()
                            .replace(/[^\w\s-]/g, '') // Remove special chars
                            .replace(/\s+/g, '-')      // Replace spaces with -
                            .replace(/-+/g, '-');       // Replace multiple - with single -
                        
                        return (
                          <Link
                            key={categoryId}
                            to={`/the-loai/${categoryId}/${categorySlug}`}
                            className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-full text-sm transition-colors"
                          >
                            {categoryName}
                          </Link>
                        );
                      })
                    ) : movie.category_id ? (
                      <Link
                        key={movie.category_id._id || movie.category_id.id}
                        to={`/the-loai/${movie.category_id._id || movie.category_id.id}/${encodeURIComponent(
                          movie.category_id.name || movie.category_id.category_name
                        )}`}
                        className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-full text-sm transition-colors"
                      >
                        {movie.category_id.name || movie.category_id.category_name}
                      </Link>
                    ) : null}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-6">
                  <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium flex items-center">
                    <FaPlay className="mr-2" /> Xem phim
                  </button>
                  <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center">
                    <FaHeart className="mr-2" /> Yêu thích
                  </button>
                  <div className="relative group">
                    <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center">
                      <FaShareAlt className="mr-2" /> Chia sẻ
                    </button>
                    <div className="absolute left-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg p-2 hidden group-hover:block z-50">
                      <button
                        onClick={() => handleShare('facebook')}
                        className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 rounded flex items-center"
                      >
                        <FaFacebook className="mr-2 text-blue-500" /> Facebook
                      </button>
                      <button
                        onClick={() => handleShare('twitter')}
                        className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 rounded flex items-center"
                      >
                        <FaTwitter className="mr-2 text-blue-400" /> Twitter
                      </button>
                      <button
                        onClick={() => handleShare('copy')}
                        className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 rounded flex items-center"
                      >
                        <FaLink className="mr-2" /> Sao chép liên kết
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 mt-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - 2/3 width on large screens */}
            <div className="lg:w-2/3">
              {/* Tabs */}
              <div className="bg-gray-800 rounded-lg overflow-hidden mb-6">
                <div className="flex border-b border-gray-700">
                  <button
                    onClick={() => handleTabChange('episodes')}
                    className={`px-6 py-3 font-medium ${activeTab === 'episodes' ? 'text-white border-b-2 border-red-600' : 'text-gray-400'}`}
                  >
                    Tập phim
                  </button>
                  <button
                    onClick={() => handleTabChange('info')}
                    className={`px-6 py-3 font-medium ${activeTab === 'info' ? 'text-white border-b-2 border-red-600' : 'text-gray-400'}`}
                  >
                    Thông tin
                  </button>
                  <button
                    onClick={() => handleTabChange('reviews')}
                    className={`px-6 py-3 font-medium ${activeTab === 'reviews' ? 'text-white border-b-2 border-red-600' : 'text-gray-400'}`}
                  >
                    Đánh giá
                  </button>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'episodes' && (
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">Danh sách tập</h3>
                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                        {episodeList.map((episode, index) => {
                          const episodeNumber = index + 1;
                          return (
                            <button
                              key={episode.slug || index}
                              onClick={() => handleWatchEpisode(episode.slug || `tap-${String(episodeNumber).padStart(2, '0')}`)}
                              className="py-2 px-3 rounded-md text-center block bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                            >
                              {episode.name || `Tập ${episodeNumber}`}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {activeTab === 'info' && (
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">Nội dung phim</h3>
                      <p className="text-gray-300 mb-6">
                        {movie.content || 'Đang cập nhật nội dung...'}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-lg font-medium text-white mb-2">Thông tin</h4>
                          <ul className="space-y-2">
                            <li className="flex">
                              <span className="text-gray-400 w-32">Số tập:</span>
                              <span className="text-gray-300">
                                {movie.episode_total || 'Đang cập nhật'}
                              </span>
                            </li>
                            <li className="flex">
                              <span className="text-gray-400 w-32">Đạo diễn:</span>
                              <span className="text-gray-300">
                                {movie.director?.join(', ') || 'Đang cập nhật'}
                              </span>
                            </li>
                            <li className="flex">
                              <span className="text-gray-400 w-32">Diễn viên:</span>
                              <span className="text-gray-300">
                                {movie.actor?.join(', ') || 'Đang cập nhật'}
                              </span>
                            </li>
                            <li className="flex">
                              <span className="text-gray-400 w-32">Quốc gia:</span>
                              <div className="flex flex-wrap gap-1">
                                {movie.country ? (
                                  Array.isArray(movie.country) ? (
                                    movie.country.map((c) => (
                                      <span key={c._id || c.id} className="text-gray-300">
                                        {c.name || c.country_name}
                                      </span>
                                    ))
                                  ) : movie.country.name || movie.country.country_name ? (
                                    <span className="text-gray-300">
                                      {movie.country.name || movie.country.country_name}
                                    </span>
                                  ) : (
                                    'Đang cập nhật'
                                  )
                                ) : movie.country_id ? (
                                  <span className="text-gray-300">
                                    {movie.country_id.name || movie.country_id.country_name || 'Đang cập nhật'}
                                  </span>
                                ) : (
                                  'Đang cập nhật'
                                )}
                              </div>
                            </li>
                            <li className="flex">
                              <span className="text-gray-400 w-32">Năm phát hành:</span>
                              <span className="text-gray-300">
                                {movie.year}
                              </span>
                            </li>
                            <li className="flex">
                              <span className="text-gray-400 w-32">Thời lượng:</span>
                              <span className="text-gray-300">
                                {movie.time}
                              </span>
                            </li>
                            <li className="flex">
                              <span className="text-gray-400 w-32">Chất lượng:</span>
                              <span className="text-gray-300">
                                {movie.quality || 'HD'}
                              </span>
                            </li>
                            <li className="flex">
                              <span className="text-gray-400 w-32">Ngôn ngữ:</span>
                              <span className="text-gray-300">
                                {movie.lang || 'Đang Cập Nhật'}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">Đánh giá phim</h3>
                      <div className="bg-gray-800 rounded-lg p-4">
                        <p className="text-gray-400 text-center py-8">
                          Tính năng đánh giá đang được phát triển. Vui lòng quay lại sau!
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - 1/3 width on large screens */}
          <div className="lg:w-1/3">
            {/* Related Movies */}
            {relatedMovies.length > 0 && (
              <div className="bg-gray-800 rounded-lg overflow-hidden mb-6">
                <div className="p-4 border-b border-gray-700">
                  <h3 className="text-lg font-semibold text-white">Phim liên quan</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    {relatedMovies.map((item) => (
                      <Link
                        key={item._id}
                        to={`/phim/${item._id}/${item.slug}`}
                        className="flex gap-3 group"
                      >
                        <div className="w-24 h-16 flex-shrink-0 rounded overflow-hidden">
                          <img
                            src={item.thumb_url || item.poster_path}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-medium group-hover:text-red-500 transition-colors line-clamp-2">
                            {item.name}
                          </h4>
                          <div className="flex items-center text-sm text-gray-400 mt-1">
                            <span>{item.year}</span>
                            <span className="mx-2">•</span>
                            <span className="flex items-center">
                              <FaStar className="text-yellow-400 mr-1" />
                              {item.vote_average?.toFixed(1) || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Movie Info Box */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white">Thông tin khác</h3>
              </div>
              <div className="p-4">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <FaFilm className="text-red-500 mr-3 w-5" />
                    <span className="text-gray-300">
                      <span className="text-gray-400">Tình trạng: </span>
                      {movie.status || 'Đang chiếu'}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <FaEye className="text-red-500 mr-3 w-5" />
                    <span className="text-gray-300">
                      <span className="text-gray-400">Lượt xem: </span>
                      {(movie.views || 0).toLocaleString()}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <FaCalendarAlt className="text-red-500 mr-3 w-5" />
                    <span className="text-gray-300">
                      <span className="text-gray-400">Ngày cập nhật: </span>
                      {formatDate(movie.created || movie.modified)}
                    </span>
                  </li>
                  {movie.imdb_id && (
                    <li className="flex items-center">
                      <SiImdb className="text-yellow-500 mr-3 w-5 h-5" />
                      <a
                        href={`https://www.imdb.com/title/${movie.imdb_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        Xem trên IMDB
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 w-full">
          {/* Related Movies Section */}
          <h3 className="text-xl font-semibold text-white mb-4">Phim liên quan</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-4">
            {relatedMovies.length > 0 ? (
              relatedMovies.map(movie => (
                <MovieCard key={movie._id} movie={movie} />
              ))
            ) : (
              <p className="text-gray-400">Không có phim liên quan</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
