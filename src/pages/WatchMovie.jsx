import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/atoms/LoadingSpinner';
import { getMovieBySlug } from '../services/apiService';
import { FaHome, FaPlay, FaArrowLeft, FaServer, FaList, FaClock, FaStar, FaEye } from 'react-icons/fa';

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

  // Parse episode data from string and ensure no duplicates
  const parseEpisodes = (episodeData) => {
    if (!episodeData) return [];
    
    console.log('Raw episode data:', episodeData);
    
    const episodeMap = new Map();
    
    episodeData
      .split('\n')
      .filter(line => line.trim())
      .forEach(ep => {
        const parts = ep.split('|').map(part => part.trim());
        console.log('Parsed parts:', parts);
        
        if (parts.length >= 3) {
          const [name, slug, embedUrl] = parts;
          const episodeNum = getEpisodeNumber(name);
          const cleanName = (name || '').trim().toLowerCase();
          const cleanSlug = (slug || `tap-${episodeNum}`).trim().toLowerCase();
          
          const episodeKey = `${episodeNum}-${cleanName || cleanSlug}`;
          
          if (!episodeMap.has(episodeKey)) {
            episodeMap.set(episodeKey, { 
              name: name || `Tập ${episodeNum}`, 
              slug: cleanSlug, 
              embedUrl: embedUrl || '' 
            });
          }
        }
      });
    
    const parsed = Array.from(episodeMap.values()).sort((a, b) => {
      const numA = parseInt(getEpisodeNumber(a.name)) || 0;
      const numB = parseInt(getEpisodeNumber(b.name)) || 0;
      return numA - numB;
    });
    
    console.log('Parsed and deduplicated episodes:', parsed);
    return parsed;
  };

  // Load movie data
  const loadMovie = useCallback(async () => {
    if (!movieSlug) {
      console.error('No movieSlug provided');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading movie with slug:', movieSlug);
      const response = await getMovieBySlug(movieSlug);
      console.log('API Response:', response);
      
      if (response?.movie) {
        setMovie(response.movie);
        console.log('Movie data:', response.movie);
        
        let parsedEpisodes = [];
        
        if (response.episodes && Array.isArray(response.episodes)) {
          console.log('Found episodes array in response:', response.episodes);
          
          const episodeMap = new Map();
          
          response.episodes.forEach(server => {
            if (server.server_data && Array.isArray(server.server_data)) {
              server.server_data.forEach(ep => {
                const episodeNum = getEpisodeNumber(ep.name || '');
                const slug = (ep.slug || `tap-${episodeNum || parsedEpisodes.length + 1}`).toLowerCase().trim();
                const name = ep.name || `Tập ${episodeNum || parsedEpisodes.length + 1}`;
                
                if (!episodeMap.has(slug)) {
                  episodeMap.set(slug, {
                    name: name,
                    slug: slug,
                    embedUrl: ep.link_embed || ep.link_m3u8 || ''
                  });
                }
              });
            }
          });
          
          parsedEpisodes = Array.from(episodeMap.values());
        }
        else if (response.movie.episode_data) {
          console.log('Using episode_data from movie');
          parsedEpisodes = parseEpisodes(response.movie.episode_data);
        }
        else if (response.movie.type === 'single' || response.movie.episode_total === '1') {
          console.log('Single movie detected, creating default episode');
          parsedEpisodes = [{
            name: 'Full',
            slug: 'full',
            embedUrl: response.movie.trailer_url || response.movie.thumb_url || ''
          }];
        }
        
        console.log('Parsed episodes:', parsedEpisodes);
        setEpisodes(parsedEpisodes);
        
        if (parsedEpisodes.length > 0) {
          let episodeToSet = parsedEpisodes[0];
          
          if (episodeSlug) {
            const foundEpisode = parsedEpisodes.find(
              ep => ep.slug === episodeSlug || 
              ep.slug.toLowerCase() === episodeSlug.toLowerCase()
            );
            if (foundEpisode) {
              episodeToSet = foundEpisode;
            }
          }
          
          setCurrentEpisode(episodeToSet);
          setCurrentEpisodeUrl(episodeToSet.embedUrl);
          
          if (!episodeSlug || episodeToSet.slug !== episodeSlug) {
            navigate(`/xem-phim/${movieSlug}/${episodeToSet.slug}`, { replace: true });
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
      setError('Có lỗi xảy ra khi tải thông tin phim: ' + (err.message || 'Lỗi không xác định'));
    } finally {
      setLoading(false);
    }
  }, [movieSlug, episodeSlug, navigate]);

  useEffect(() => {
    console.log('useEffect triggered with:', { movieSlug, episodeSlug });
    loadMovie();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [movieSlug, episodeSlug, loadMovie]);
  
  const handleEpisodeChange = (episode) => {
    console.log('Changing to episode:', episode);
    setCurrentEpisode(episode);
    setCurrentEpisodeUrl(episode.embedUrl);
    navigate(`/xem-phim/${movieSlug}/${episode.slug}`, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSourceChange = (sourceId) => {
    console.log('Changing source to:', sourceId);
    setSelectedSource(sourceId);
    setSources(sources.map(source => ({
      ...source,
      active: source.id === sourceId
    })));
  };

  const getEpisodeNumber = (name) => {
    if (!name) return '0';
    
    const numberMatch = name.match(/(?:Tập|tập|Ep|ep|EP|Tập)\s*(\d+)|^(\d+)/i);
    
    if (numberMatch) {
      return numberMatch[1] || numberMatch[2] || '0';
    }
    
    const anyNumberMatch = name.match(/\d+/);
    if (anyNumberMatch) {
      return anyNumberMatch[0];
    }
    
    return name.substring(0, 3) || '0';
  };

  useEffect(() => {
    console.log('Current State:', {
      movie,
      episodes,
      currentEpisode,
      currentEpisodeUrl
    });
  }, [movie, episodes, currentEpisode, currentEpisodeUrl]);

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
    <div className="watch-page pt-12">
      <main className="main-content">
        <div className="container-fluid px-0">
          {/* Video Player Section */}
          <div className="video-wrapper">
            <div className="video-container-main">
              {/* Header Section */}
              <div className="video-header">
                <div className="movie-info-header">
                  <h1 className="movie-title-main">{movie.name}</h1>
                  <div className="movie-meta">
                    {movie.year && (
                      <span className="meta-item">
                        <FaClock className="meta-icon" />
                        {movie.year}
                      </span>
                    )}
                    {movie.episode_current && (
                      <span className="meta-badge">
                        {movie.episode_current}
                      </span>
                    )}
                    {movie.quality && (
                      <span className="meta-badge quality">
                        {movie.quality}
                      </span>
                    )}
                    {movie.lang && (
                      <span className="meta-badge">
                        {movie.lang}
                      </span>
                    )}
                  </div>
                  {currentEpisode && (
                    <div className="current-episode-info">
                      <FaPlay className="play-icon" />
                      <span>Đang xem: {currentEpisode.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Server Selection */}
              {sources.length > 0 && (
                <div className="server-section">
                  <div className="server-header">
                    <FaServer className="server-icon" />
                    <span>Chọn Server</span>
                  </div>
                  <div className="server-buttons">
                    {sources.map((source) => (
                      <button
                        key={source.id}
                        onClick={() => handleSourceChange(source.id)}
                        className={`server-btn ${selectedSource === source.id ? 'active' : ''}`}
                      >
                        {source.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Video Player */}
              <div className="video-player-wrapper">
                {currentEpisodeUrl ? (
                  <div className="player-container">
                    {currentEpisodeUrl.includes('player.phimapi.com') ? (
                      <iframe
                        key={currentEpisodeUrl}
                        src={currentEpisodeUrl}
                        className="video-iframe"
                        frameBorder="0"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                        title={currentEpisode?.name || 'Video player'}
                        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
                        referrerPolicy="strict-origin-when-cross-origin"
                      />
                    ) : (
                      <video
                        key={currentEpisodeUrl}
                        className="video-element"
                        controls
                        autoPlay
                        playsInline
                      >
                        <source src={currentEpisodeUrl} type="application/x-mpegURL" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                ) : (
                  <div className="video-placeholder">
                    <div className="placeholder-content">
                      <FaPlay className="placeholder-icon" />
                      <p className="placeholder-text">
                        {episodes.length > 0 ? 'Chọn tập để bắt đầu xem' : 'Không có tập phim nào để phát'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Episodes Section */}
          <div className="episodes-wrapper">
            <div className="episodes-container">
              <div className="episodes-header">
                <div className="episodes-title-section">
                  <FaList className="list-icon" />
                  <h2 className="episodes-title">Danh sách tập</h2>
                </div>
                <div className="episodes-count">
                  <span className="count-current">{episodes.length}</span>
                  <span className="count-separator">/</span>
                  <span className="count-total">{movie.episode_total || 'N/A'}</span>
                  <span className="count-label">tập</span>
                </div>
              </div>
              
              {episodes.length > 0 ? (
                <div className="episodes-grid">
                  {episodes.map((episode, index) => {
                    const isCurrent = currentEpisode?.slug === episode.slug;
                    const episodeNum = getEpisodeNumber(episode.name);
                    
                    if (!episodeNum) {
                      console.warn('Skipping episode with invalid number:', episode);
                      return null;
                    }
                    
                    return (
                      <button
                        key={`ep-${episode.slug || index}`}
                        onClick={() => handleEpisodeChange(episode)}
                        className={`episode-btn ${isCurrent ? 'active' : ''}`}
                        title={episode.name}
                      >
                        {episodeNum}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="no-episodes">
                  <FaEye className="no-episodes-icon" />
                  <p className="no-episodes-text">Chưa có tập phim nào được cập nhật.</p>
                  <p className="no-episodes-subtext">Vui lòng quay lại sau.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <style dangerouslySetInnerHTML={{ __html: `
/* ===== Base Styles ===== */
.watch-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #fff;
}

.main-content {
  min-height: calc(100vh - 80px);
  padding: 0;
}

/* ===== Video Wrapper ===== */
.video-wrapper {
  background: #101828;
  padding: 2rem 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
}

.video-container-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* ===== Video Header ===== */
.video-header {
  margin-bottom: 1.5rem;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 0.625rem 1.25rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateX(-4px);
}

.back-text {
  display: inline;
}

.movie-info-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.movie-title-main {
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #f43f5e 0%, #f59e0b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.movie-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #94a3b8;
  font-size: 0.9rem;
}

.meta-icon {
  font-size: 0.85rem;
}

.meta-badge {
  background: rgba(248, 113, 113, 0.15);
  color: #fca5a5;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid rgba(248, 113, 113, 0.3);
}

.meta-badge.quality {
  background: rgba(59, 130, 246, 0.15);
  color: #93c5fd;
  border-color: rgba(59, 130, 246, 0.3);
}

.current-episode-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #fbbf24;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.5rem 0;
}

.play-icon {
  font-size: 0.85rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* ===== Server Section ===== */
.server-section {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
}

.server-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #cbd5e1;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.server-icon {
  color: #f59e0b;
}

.server-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.server-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #e2e8f0;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.server-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s ease;
}

.server-btn:hover::before {
  left: 100%;
}

.server-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.server-btn.active {
  background: linear-gradient(135deg, #f43f5e 0%, #f59e0b 100%);
  border-color: transparent;
  color: #fff;
  box-shadow: 0 4px 12px rgba(244, 63, 94, 0.4);
}

/* ===== Video Player ===== */
.video-player-wrapper {
  position: relative;
  width: 100%;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.player-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  background: #000;
}

.video-iframe,
.video-element {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.video-placeholder {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 100%;
  padding: 2rem;
}

.placeholder-icon {
  font-size: 4rem;
  color: #475569;
  margin-bottom: 1rem;
  opacity: 0.6;
}

.placeholder-text {
  color: #94a3b8;
  font-size: 1.1rem;
  margin: 0;
}

/* ===== Episodes Section ===== */
.episodes-wrapper {
  background: #101828;
  padding: 3rem 0;
  border-radius: 1rem;
}

.episodes-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.episodes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.episodes-title-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.list-icon {
  font-size: 1.5rem;
  color: #f59e0b;
}

.episodes-title {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0;
  color: #fff;
  letter-spacing: -0.02em;
}

.episodes-count {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  border-radius: 50px;
}

.count-current {
  font-size: 1.5rem;
  font-weight: 800;
  color: #f43f5e;
}

.count-separator {
  font-size: 1.25rem;
  color: #475569;
  margin: 0 0.25rem;
}

.count-total {
  font-size: 1.25rem;
  font-weight: 600;
  color: #94a3b8;
}

.count-label {
  font-size: 0.85rem;
  color: #64748b;
  margin-left: 0.25rem;
}

/* ===== Episodes Grid ===== */
.episodes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 0.75rem;
  padding: 0.5rem 0;
}

.episode-btn {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  color: #e2e8f0;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0.5rem;
}

.episode-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.episode-btn.active {
  background: #f43f5e;
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(244, 63, 94, 0.4);
  transform: translateY(-2px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .episodes-grid {
    grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
    gap: 0.6rem;
  }
  
  .episode-btn {
    font-size: 0.9rem;
    padding: 0.4rem;
  }
}

@media (max-width: 480px) {
  .episodes-grid {
    grid-template-columns: repeat(auto-fill, minmax(45px, 1fr));
    gap: 0.5rem;
  }
  
  .episode-btn {
    font-size: 0.85rem;
  }
}

/* ===== No Episodes ===== */
.no-episodes {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 1rem;
  border: 1px dashed rgba(255, 255, 255, 0.1);
}

.no-episodes-icon {
  font-size: 3rem;
  color: #475569;
  margin-bottom: 1rem;
  opacity: 0.6;
}

.no-episodes-text {
  font-size: 1.1rem;
  color: #cbd5e1;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.no-episodes-subtext {
  font-size: 0.9rem;
  color: #64748b;
}

/* ===== Loading & Error States ===== */
.loading-section,
.error-section,
.no-data-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  text-align: center;
  padding: 2rem;
}

.loading-text {
  margin-top: 1.5rem;
  color: #94a3b8;
  font-size: 1.1rem;
  font-weight: 500;
}

.alert {
  padding: 1.25rem;
  margin-bottom: 1rem;
  border-radius: 0.75rem;
  backdrop-filter: blur(10px);
}

.alert-danger {
  color: #fecaca;
  background: rgba(127, 29, 29, 0.8);
  border: 1px solid rgba(254, 202, 202, 0.3);
}

.btn {
  display: inline-block;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  border: 1px solid transparent;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  line-height: 1.5;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.8rem;
  border-radius: 0.375rem;
}

.btn-outline-danger {
  color: #fecaca;
  border-color: #fecaca;
  background-color: transparent;
}

.btn-outline-danger:hover {
  color: #fff;
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
}

.btn-retry {
  background: linear-gradient(135deg, #f43f5e 0%, #f59e0b 100%);
  border: none;
  color: white;
  padding: 0.875rem 2rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(244, 63, 94, 0.4);
}

.btn-retry:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(244, 63, 94, 0.5);
}

/* ===== Responsive Design ===== */
@media (max-width: 1024px) {
  .movie-title-main {
    font-size: 1.75rem;
  }
  
  .episodes-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 0.875rem;
  }
  
  .episode-card {
    min-height: 75px;
    padding: 0.875rem;
  }
  
  .episode-number-display {
    font-size: 1.5rem;
  }
}

@media (max-width: 768px) {
  .video-wrapper {
    padding: 1.5rem 0;
  }
  
  .video-container-main,
  .episodes-container {
    padding: 0 1rem;
  }
  
  .movie-title-main {
    font-size: 1.5rem;
  }
  
  .movie-meta {
    gap: 0.5rem;
  }
  
  .meta-badge {
    font-size: 0.75rem;
    padding: 0.2rem 0.6rem;
  }
  
  .server-section {
    padding: 0.875rem 1rem;
  }
  
  .episodes-title {
    font-size: 1.5rem;
  }
  
  .episodes-grid {
    grid-template-columns: repeat(auto-fill, minmax(75px, 1fr));
    gap: 0.75rem;
  }
  
  .episode-card {
    min-height: 70px;
    padding: 0.75rem;
  }
  
  .episode-number-display {
    font-size: 1.375rem;
  }
  
  .episode-label-display {
    font-size: 0.7rem;
  }
  
  .back-text {
    display: none;
  }
  
  .back-button {
    padding: 0.625rem;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .video-wrapper {
    padding: 1rem 0;
  }
  
  .video-container-main,
  .episodes-container {
    padding: 0 0.75rem;
  }
  
  .movie-title-main {
    font-size: 1.25rem;
  }
  
  .current-episode-info {
    font-size: 0.85rem;
  }
  
  .server-buttons {
    gap: 0.5rem;
  }
  
  .server-btn {
    padding: 0.45rem 1.25rem;
    font-size: 0.85rem;
  }
  
  .episodes-wrapper {
    padding: 2rem 0;
  }
  
  .episodes-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .episodes-title {
    font-size: 1.25rem;
  }
  
  .list-icon {
    font-size: 1.25rem;
  }
  
  .episodes-count {
    padding: 0.375rem 0.875rem;
  }
  
  .count-current {
    font-size: 1.25rem;
  }
  
  .count-total {
    font-size: 1rem;
  }
  
  .episodes-grid {
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    gap: 0.625rem;
  }
  
  .episode-card {
    min-height: 65px;
    padding: 0.625rem;
    border-radius: 0.625rem;
  }
  
  .episode-number-display {
    font-size: 1.25rem;
  }
  
  .episode-label-display {
    font-size: 0.65rem;
  }
  
  .episode-playing {
    width: 20px;
    height: 20px;
  }
  
  .playing-icon {
    font-size: 0.6rem;
  }
}

/* ===== Utility Classes ===== */
.container-fluid {
  width: 100%;
  padding: 0;
  margin: 0;
}

.text-center {
  text-align: center;
}

.py-5 {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.ms-2 {
  margin-left: 0.5rem;
}

.inline {
  display: inline;
}

.mr-2 {
  margin-right: 0.5rem;
}

.text-light {
  color: #f8fafc;
}

.text-muted {
  color: #94a3b8;
}

.text-6xl {
  font-size: 3.75rem;
  line-height: 1;
}

/* ===== Smooth Animations ===== */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.video-container-main,
.episodes-container {
  animation: fadeIn 0.6s ease-out;
}

/* ===== Scrollbar Styling ===== */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

::-webkit-scrollbar-thumb {
  background: rgb(60, 60, 60, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgb(60, 60, 60, 0.8);
}
      ` }} />
    </div>
  );
};

export default WatchMovie;