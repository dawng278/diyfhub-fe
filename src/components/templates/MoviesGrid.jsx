import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../atoms/LoadingSpinner';
import { getMovieBySlug } from '../../services/apiService';
import { FaHome, FaPlay, FaArrowLeft } from 'react-icons/fa';

const WatchMovie = () => {
  const { movieSlug, episodeSlug } = useParams();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [currentEpisodeUrl, setCurrentEpisodeUrl] = useState('');
  const [episodes, setEpisodes] = useState([]);
  const [sources, setSources] = useState([
    { id: 1, name: 'Server 1', active: true },
    { id: 2, name: 'Server 2', active: false },
  ]);
  const [selectedSource, setSelectedSource] = useState(1);
  const [showDebug, setShowDebug] = useState(false);

  // Parse episode data from string
  const parseEpisodes = (episodeData) => {
    if (!episodeData) return [];
    
    console.log('Raw episode data:', episodeData);
    
    const parsed = episodeData
      .split('\n')
      .filter(line => line.trim()) // Remove empty lines
      .map(ep => {
        const parts = ep.split('|').map(part => part.trim());
        console.log('Parsed parts:', parts);
        
        if (parts.length >= 3) {
          const [name, slug, embedUrl] = parts;
          return { 
            name: name || 'Unknown', 
            slug: slug || '', 
            embedUrl: embedUrl || '' 
          };
        }
        return null;
      })
      .filter(Boolean);
    
    console.log('Parsed episodes:', parsed);
    return parsed;
  };

  // Load movie data
  const loadMovie = async () => {
    if (!movieSlug) {
      console.error('No movieSlug provided');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading movie with slug:', movieSlug);
      const response = await getMovieBySlug(movieSlug);
      console.log('Full API Response:', response);
      console.log('Episodes in response:', response?.episodes);
      
      if (response?.movie) {
        setMovie(response.movie);
        console.log('Movie data:', response.movie);
        
        let parsedEpisodes = [];
        
        // Try multiple sources for episodes
        // 1. Check episodes array (PhimAPI format)
        if (response.episodes && Array.isArray(response.episodes) && response.episodes.length > 0) {
          console.log('Found episodes array:', response.episodes);
          console.log('First episode structure:', response.episodes[0]);
          
          // PhimAPI returns episodes in server_data format
          response.episodes.forEach((server, serverIndex) => {
            console.log(`Processing server ${serverIndex}:`, server);
            
            if (server.server_data && Array.isArray(server.server_data)) {
              console.log(`Server ${serverIndex} has ${server.server_data.length} episodes`);
              
              server.server_data.forEach((ep, epIndex) => {
                console.log(`Episode ${epIndex}:`, ep);
                parsedEpisodes.push({
                  name: ep.name || `Tập ${ep.slug || epIndex + 1}`,
                  slug: ep.slug || ep.filename || `tap-${epIndex + 1}`,
                  embedUrl: ep.link_embed || ep.link_m3u8 || ''
                });
              });
            } else {
              console.warn(`Server ${serverIndex} has no server_data or invalid format`);
            }
          });
          
          console.log('Parsed episodes from API:', parsedEpisodes);
        }
        
        // 2. Check episode_data string format (custom format)
        if (parsedEpisodes.length === 0 && response.movie.episode_data) {
          console.log('Trying episode_data string:', response.movie.episode_data);
          parsedEpisodes = parseEpisodes(response.movie.episode_data);
        }
        
        // 3. Single movie fallback
        if (parsedEpisodes.length === 0) {
          console.log('No episodes found, checking if single movie');
          console.log('Movie type:', response.movie.type);
          console.log('Episode current:', response.movie.episode_current);
          console.log('Episode total:', response.movie.episode_total);
          
          if (response.movie.type === 'single' || 
              response.movie.episode_total === '1' || 
              response.movie.episode_current === 'Full' ||
              response.movie.episode_current === 'Hoàn tất') {
            console.log('Creating single episode');
            parsedEpisodes = [{
              name: 'Full',
              slug: 'full',
              embedUrl: response.movie.trailer_url || ''
            }];
          }
        }
        
        console.log('Final parsed episodes:', parsedEpisodes);
        setEpisodes(parsedEpisodes);
        
        if (parsedEpisodes.length > 0) {
          // Find and set current episode if episodeSlug is provided
          if (episodeSlug) {
            console.log('Looking for episode with slug:', episodeSlug);
            const foundEpisode = parsedEpisodes.find(ep => ep.slug === episodeSlug);
            
            if (foundEpisode) {
              console.log('Found episode:', foundEpisode);
              setCurrentEpisode(foundEpisode);
              setCurrentEpisodeUrl(foundEpisode.embedUrl);
            } else {
              console.warn('Episode not found, using first episode');
              const firstEpisode = parsedEpisodes[0];
              setCurrentEpisode(firstEpisode);
              setCurrentEpisodeUrl(firstEpisode.embedUrl);
              navigate(`/xem-phim/${movieSlug}/${firstEpisode.slug}`, { replace: true });
            }
          } else {
            // Default to first episode if no episode is selected
            console.log('No episode selected, using first episode');
            const firstEpisode = parsedEpisodes[0];
            setCurrentEpisode(firstEpisode);
            setCurrentEpisodeUrl(firstEpisode.embedUrl);
            navigate(`/xem-phim/${movieSlug}/${firstEpisode.slug}`, { replace: true });
          }
        } else {
          console.warn('No episodes found');
          setError('Phim chưa có tập nào để xem');
        }
      } else {
        setError('Không tìm thấy thông tin phim');
      }
    } catch (err) {
      console.error('Error loading movie:', err);
      setError('Có lỗi xảy ra khi tải thông tin phim: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load movie on mount
  useEffect(() => {
    console.log('useEffect triggered with:', { movieSlug, episodeSlug });
    loadMovie();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [movieSlug, episodeSlug]);
  
  // Handle episode change
  const handleEpisodeChange = (episode) => {
    console.log('Changing to episode:', episode);
    setCurrentEpisode(episode);
    setCurrentEpisodeUrl(episode.embedUrl);
    navigate(`/xem-phim/${movieSlug}/${episode.slug}`, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle source change
  const handleSourceChange = (sourceId) => {
    console.log('Changing source to:', sourceId);
    setSelectedSource(sourceId);
    setSources(sources.map(source => ({
      ...source,
      active: source.id === sourceId
    })));
  };

  // Get episode number from name - format display
  const getEpisodeNumber = (name) => {
    if (!name) return '';
    
    // Try to extract number from various formats
    // "Tập 01", "Tập 1", "01", "Episode 1", etc.
    const numberMatch = name.match(/(\d+)/);
    if (numberMatch) {
      return numberMatch[1];
    }
    
    // If no number found, return the name as is
    return name;
  };

  // Debug: Log current state
  useEffect(() => {
    console.log('Current State:', {
      movie,
      episodes,
      currentEpisode,
      currentEpisodeUrl
    });
  }, [movie, episodes, currentEpisode, currentEpisodeUrl]);

  // Loading state
  if (loading) {
    return (
      <div className="loading-section">
        <div className="container text-center py-5">
          <LoadingSpinner />
          <p className="loading-text">Đang tải video...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="error-section">
        <div className="container py-5">
          <div className="alert alert-danger" role="alert">
            {error}
            <button onClick={loadMovie} className="btn btn-sm btn-outline-danger ms-2">
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No movie found
  if (!movie) {
    return (
      <div className="no-data-section">
        <div className="container text-center py-5">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-light mb-2">Không tìm thấy phim</h3>
          <p className="text-muted mb-4">
            Phim bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <button 
            onClick={() => navigate('/')} 
            className="btn-retry"
          >
            <FaHome className="inline mr-2" />
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="watch-page">
      <main className="main-content">
        <div className="container mx-auto px-4">
          {/* Video Player Section */}
          <div className="video-section">
            <div className="video-container">
              <div className="flex flex-col space-y-4 mb-4">
                <div className="flex items-center">
                  <button 
                    onClick={() => navigate(-1)}
                    className="mr-4 p-2 rounded-full hover:bg-gray-800 transition-colors"
                    aria-label="Quay lại"
                  >
                    <FaArrowLeft />
                  </button>
                  <div>
                    <h2 className="video-title">{movie.name}</h2>
                    {currentEpisode && (
                      <div className="flex items-center mt-2">
                        <span className="bg-red-600 text-white text-xs px-2 py-1 rounded mr-2">
                          {movie.episode_current || 'Đang cập nhật'}
                        </span>
                        <p className="video-episode">
                          <FaPlay className="inline mr-2 text-red-500" />
                          {currentEpisode.name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Server Selection */}
                {sources.length > 0 && (
                  <div className="server-selection">
                    <div className="text-sm font-medium text-gray-300 mb-2">Chọn server:</div>
                    <div className="flex flex-wrap gap-2">
                      {sources.map((source) => (
                        <button
                          key={source.id}
                          onClick={() => handleSourceChange(source.id)}
                          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                            selectedSource === source.id
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {source.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="video-player">
                {currentEpisodeUrl ? (
                  <div className="relative w-full pb-[56.25%] bg-black rounded-lg overflow-hidden shadow-xl">
                    <iframe
                      key={currentEpisodeUrl}
                      src={currentEpisodeUrl}
                      className="absolute top-0 left-0 w-full h-full"
                      frameBorder="0"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                      title={currentEpisode?.name || 'Video player'}
                      sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
                      referrerPolicy="origin"
                    />
                  </div>
                ) : (
                  <div className="video-placeholder">
                    <FaPlay className="text-6xl text-gray-400 mb-4" />
                    <p className="text-gray-400">
                      {episodes.length > 0 ? 'Chọn tập để bắt đầu xem' : 'Không có tập phim nào để phát'}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Debug Info - Toggle button */}
              <div className="mt-4">
                <button 
                  onClick={() => setShowDebug(!showDebug)}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300"
                >
                  {showDebug ? 'Ẩn' : 'Hiện'} Debug Info
                </button>
                
                {showDebug && (
                  <div className="mt-2 p-4 bg-gray-800 rounded text-xs text-gray-300 overflow-auto max-h-96">
                    <p><strong>Debug Info:</strong></p>
                    <p className="mt-2"><strong>Episodes count:</strong> {episodes.length}</p>
                    <p><strong>Current Episode:</strong> {currentEpisode?.name || 'None'}</p>
                    <p><strong>Current URL:</strong> {currentEpisodeUrl || 'None'}</p>
                    <p className="mt-2"><strong>Movie Type:</strong> {movie.type}</p>
                    <p><strong>Episode Current:</strong> {movie.episode_current}</p>
                    <p><strong>Episode Total:</strong> {movie.episode_total}</p>
                    
                    <div className="mt-3 p-2 bg-gray-900 rounded">
                      <p className="font-bold mb-2">All Episodes:</p>
                      {episodes.length > 0 ? (
                        <pre className="text-xs overflow-auto">
                          {JSON.stringify(episodes, null, 2)}
                        </pre>
                      ) : (
                        <p className="text-yellow-400">No episodes found</p>
                      )}
                    </div>
                    
                    <div className="mt-3 p-2 bg-gray-900 rounded">
                      <p className="font-bold mb-2">Console Logs:</p>
                      <p className="text-xs text-blue-400">✓ Open browser console (F12)</p>
                      <p className="text-xs text-blue-400">✓ Look for "Full API Response"</p>
                      <p className="text-xs text-blue-400">✓ Look for "Episodes in response"</p>
                      <p className="text-xs text-blue-400">✓ Look for "Parsed episodes from API"</p>
                    </div>
                    
                    <button 
                      onClick={() => {
                        console.log('=== MANUAL DEBUG ===');
                        console.log('Movie:', movie);
                        console.log('Episodes:', episodes);
                        console.log('Current Episode:', currentEpisode);
                        console.log('Current URL:', currentEpisodeUrl);
                      }}
                      className="mt-3 px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-white"
                    >
                      Print to Console
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Episodes Section */}
          <div className="episodes-section">
            <div className="container mx-auto">
              <div className="flex justify-between items-center mb-4 px-4">
                <h3 className="episodes-title">Danh sách tập phim</h3>
                <div className="text-sm text-gray-400">
                  {episodes.length} / {movie.episode_total || 'N/A'} tập
                </div>
              </div>
              
              {episodes.length > 0 ? (
                <div className="episodes-grid">
                  {episodes.map((episode, index) => {
                    const isCurrent = currentEpisode?.slug === episode.slug;
                    const episodeNum = getEpisodeNumber(episode.name);
                    
                    return (
                      <button
                        key={`${episode.slug}-${index}`}
                        onClick={() => handleEpisodeChange(episode)}
                        className={`episode-btn ${isCurrent ? 'current-episode' : ''}`}
                        title={episode.name}
                      >
                        <span className="episode-label">Tập</span>
                        <span className="episode-number">{episodeNum}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="no-episodes">
                  <p>Chưa có tập phim nào được cập nhật.</p>
                  <p className="text-sm mt-2 text-gray-500">Vui lòng quay lại sau.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <style dangerouslySetInnerHTML={{ __html: `
.watch-page {
  min-height: 100vh;
  background: #0f172a;
  color: white;
  padding-top: 1rem;
}

.main-content {
  min-height: calc(100vh - 140px);
  padding: 1rem 0 3rem;
}

/* Loading & Error States */
.loading-section,
.error-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  text-align: center;
}

.loading-text {
  margin-top: 1rem;
  color: #a0a0a0;
  font-size: 1.1rem;
}

.alert {
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.375rem;
}

.alert-danger {
  color: #fecaca;
  background-color: #7f1d1d;
  border-color: #fecaca;
}

.btn {
  display: inline-block;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, 
              border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  line-height: 1.5;
  border-radius: 0.2rem;
}

.btn-outline-danger {
  color: #fecaca;
  border-color: #fecaca;
  background-color: transparent;
}

.btn-outline-danger:hover {
  color: #0f172a;
  background-color: #fecaca;
  border-color: #fecaca;
}

/* Video Section */
.video-section {
  margin-bottom: 3rem;
}

.video-container {
  max-width: 1200px;
  margin: 0 auto;
}

.video-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(45deg, #f43f5e, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
}

.video-episode {
  font-size: 1rem;
  color: #94a3b8;
  margin: 0;
  display: flex;
  align-items: center;
}

.video-player {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%;
  background: #000;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.video-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #64748b;
  width: 100%;
  padding: 2rem;
}

/* Episodes Section */
.episodes-section {
  background: rgba(15, 23, 42, 0.8);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding: 2rem 0;
  border-radius: 0.75rem;
  margin-top: 2rem;
}

.episodes-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: #fff;
}

.episodes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: 0.75rem;
  padding: 0 1rem;
  max-width: 100%;
}

.episode-btn {
  min-width: 70px;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background-color: #1e293b;
  color: #e2e8f0;
  border: 2px solid transparent;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0.5rem;
  position: relative;
}

.episode-label {
  font-size: 0.7rem;
  opacity: 0.7;
  font-weight: 500;
}

.episode-number {
  font-size: 1rem;
  font-weight: 700;
}

.episode-btn:hover {
  background-color: #334155;
  transform: translateY(-2px);
  border-color: #475569;
}

.episode-btn.current-episode {
  background: linear-gradient(45deg, #f43f5e, #f59e0b);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
  border-color: transparent;
}

.episode-btn.current-episode .episode-label {
  opacity: 0.9;
}

.no-episodes {
  text-align: center;
  padding: 3rem 2rem;
  color: #94a3b8;
}

/* No Data State */
.no-data-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  text-align: center;
  padding: 2rem;
}

.btn-retry {
  background: linear-gradient(45deg, #f43f5e, #f59e0b);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  text-decoration: none;
  margin-top: 1rem;
}

.btn-retry:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Responsive */
@media (max-width: 768px) {
  .video-title {
    font-size: 1.5rem;
  }
  
  .video-episode {
    font-size: 0.95rem;
  }
  
  .episodes-grid {
    grid-template-columns: repeat(auto-fill, minmax(65px, 1fr));
    gap: 0.6rem;
  }
  
  .episode-btn {
    min-width: 65px;
    height: 45px;
  }
  
  .episode-label {
    font-size: 0.65rem;
  }
  
  .episode-number {
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .video-title {
    font-size: 1.3rem;
  }
  
  .episodes-grid {
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
    gap: 0.5rem;
  }
  
  .episode-btn {
    min-width: 60px;
    height: 42px;
    border-radius: 0.375rem;
  }
  
  .episode-label {
    font-size: 0.6rem;
  }
  
  .episode-number {
    font-size: 0.9rem;
  }
  
  .episodes-title {
    font-size: 1.3rem;
  }
}
      ` }} />
    </div>
  );
};

export default WatchMovie;