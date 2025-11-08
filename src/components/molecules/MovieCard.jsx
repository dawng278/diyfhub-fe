import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/solid';

function MovieCard({ id, title, posterPath, releaseDate, rating, mediaType = 'movie' }) {
  // Get release year from releaseDate
  let releaseYear = '';
  if (releaseDate) {
    try {
      // If it's already a 4-digit year
      if (/^\d{4}$/.test(releaseDate)) {
        releaseYear = releaseDate;
      } 
      // If it's a date string in YYYY-MM-DD format
      else if (/^\d{4}-\d{2}-\d{2}/.test(releaseDate)) {
        releaseYear = releaseDate.split('-')[0];
      }
      // If it's a timestamp (number or string of numbers)
      else if (/^\d+$/.test(releaseDate)) {
        const timestamp = parseInt(releaseDate, 10);
        // Check if it's a reasonable year (between 1900 and current year + 5)
        if (timestamp > 1900 && timestamp < (new Date().getFullYear() + 5)) {
          releaseYear = timestamp.toString();
        } else {
          // If it's a Unix timestamp (in seconds)
          const date = new Date(timestamp * 1000);
          if (!isNaN(date.getTime())) {
            releaseYear = date.getFullYear().toString();
          }
        }
      }
      // If it's a date object or other format
      else {
        const date = new Date(releaseDate);
        if (!isNaN(date.getTime())) {
          releaseYear = date.getFullYear().toString();
        }
      }
    } catch (e) {
      console.error('Error parsing date:', releaseDate, e);
    }
  }
  
  // Format IMDB rating (handle different rating formats)
  let formattedRating = 'N/A';
  if (rating !== undefined && rating !== null) {
    const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    if (!isNaN(numRating)) {
      formattedRating = `${numRating.toFixed(1)}/10`;
    }
  }

  // Function to get the correct image URL from API data
  const getImageUrl = (path) => {
    if (!path) return null;

    // If it's an object, try to get the URL from common properties
    if (typeof path === 'object' && path !== null) {
      path = path.original || path.large || path.medium || path.small || path.full || (Array.isArray(path) ? path[0] : null);
      if (!path) return null;
    }

    // If it's a string, handle different URL formats
    if (typeof path === 'string') {
      // If it's already a full URL (starts with http or //)
      if (path.match(/^https?:\/\//) || path.startsWith('//')) {
        // Ensure it uses HTTPS and remove any query parameters
        return path.replace(/^http:\/\//, 'https://')
                  .replace(/^\/\//, 'https://')
                  .split('?')[0];
      }

      // For paths that start with upload/ or /upload/
      if (path.startsWith('upload/') || path.startsWith('/upload/')) {
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `https://img.phimapi.com${cleanPath}`;
      }

      // For other relative paths, assume they're from the API
      return `https://img.phimapi.com/${path.replace(/^\//, '')}`;
    }

    return null;
  };

  const imageUrl = getImageUrl(posterPath);
  
  // Only render the card if we have an image URL
  if (!imageUrl) {
    console.log('No valid image URL found for movie:', { id, title, posterPath });
    return null; // Skip rendering this movie card if no image is available
  }
  
  return (
    <Link 
      to={`/${mediaType}/${id}`}
      className="block rounded-lg overflow-hidden transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#CC1100] focus:ring-offset-2 focus:ring-offset-gray-900"
      aria-label={`${title} (${releaseYear})`}
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-800">
        <img
          src={imageUrl}
          alt={`${title} poster`}
          className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-80"
          onError={(e) => {
            // If image fails to load, we'll let the parent component handle it
            e.target.style.display = 'none';
            console.error('Failed to load image:', imageUrl);
          }}
        />
        
        {/* Rating Badge */}
        <div className="absolute bottom-2 left-2 flex items-center rounded-full bg-black/70 px-2 py-1 text-xs font-medium text-yellow-400 backdrop-blur-sm">
          <StarIcon className="mr-1 h-3 w-3" />
          <span>{formattedRating}</span>
        </div>
      </div>
      
      <div className="mt-2 transition-colors duration-300 group-hover:text-blue-400">
        <h3 className="line-clamp-2 text-sm font-medium text-white group-hover:text-blue-400 transition-colors duration-300">
          {title}
        </h3>
        <div className="flex items-center text-xs text-gray-300 group-hover:text-blue-300 transition-colors duration-300">
          <span className="text-yellow-400 font-medium">IMDb</span>
          <span className="mx-1">•</span>
          <span>{formattedRating}</span>
          {releaseYear && (
            <>
              <span className="mx-1">•</span>
              <span>{releaseYear}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;
