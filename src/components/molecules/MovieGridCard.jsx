import { Link } from 'react-router-dom';

const MovieGridCard = ({ movie }) => {
  // Handle missing movie prop
  if (!movie) {
    return null;
  }

  // Get image URL with fallback logic
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://phimapi.com';
    return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  };

  const imageUrl = getImageUrl(movie.poster_url || movie.poster_path || movie.poster);
  const movieSlug = movie.slug || movie._id || movie.id;
  const movieId = movie._id || movie.id;
  const movieTitle = movie.title || movie.name || 'Không có tiêu đề';
  const rating = movie.imdb_rating || movie.vote_average || 0;
  const year = movie.year || (movie.release_date ? new Date(movie.release_date).getFullYear() : '');

  return (
    <div className="movie-item group h-full">
      <Link to={`/phim/${movieId}/${movieSlug}`} className="block h-full">
        <div className="relative aspect-2/3 rounded-lg overflow-hidden mb-2 bg-[#111827] group-hover:bg-[#1f2937] transition-colors duration-300">
          <div className="relative w-full h-full flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={movieTitle}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  const fallbackDiv = document.createElement('div');
                  fallbackDiv.className = 'w-full h-full flex items-center justify-center text-gray-500';
                  fallbackDiv.textContent = 'Không có ảnh';
                  e.target.parentNode.appendChild(fallbackDiv);
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
              <div className="w-full">
                <div className="flex items-center justify-between">
                  {rating > 0 && (
                    <div className="flex items-center bg-black/70 px-2 py-1 rounded-full">
                      <svg className="w-3.5 h-3.5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs font-medium text-white">
                        {rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                  {(movie.episode_current || movie.episode_count) && (
                    <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                      {movie.episode_current || `${movie.episode_count} tập`}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quality & Language badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {movie.quality && (
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
                  {movie.quality}
                </span>
              )}
              {movie.lang && (
                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
                  {movie.lang}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <h3 className="text-sm font-medium text-white line-clamp-2 min-h-[40px] mt-2 group-hover:text-blue-400 transition-colors">
          {movieTitle}
        </h3>
        
        {year && (
          <p className="text-xs text-gray-400 mt-1">
            {year}
          </p>
        )}
      </Link>
    </div>
  );
};

export default MovieGridCard;
