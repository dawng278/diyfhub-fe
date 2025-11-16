import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/solid';

// Default poster SVG as a data URL
const DEFAULT_POSTER_SVG = `data:image/svg+xml,%3Csvg width='400' height='600' viewBox='0 0 400 600' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='600' fill='%23E5E7EB'/%3E%3Cpath d='M100 250L150 200L200 250L250 200L300 250V350H100V250Z' fill='%239CA3AF'/%3E%3Ccircle cx='200' cy='150' r='50' fill='%239CA3AF'/%3E%3Ctext x='200' y='500' text-anchor='middle' font-family='Arial' font-size='20' fill='%236B7280'%3ENo image%3C/text%3E%3C/svg%3E`;

// In-memory cache for loaded images
const imageCache = new Map();

function MovieCard({ id, title, posterPath, releaseDate, rating, loading = false, linkPath = null }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [lowResImage, setLowResImage] = useState('');
  const [highResImage, setHighResImage] = useState('');
  const imgRef = useRef(null);
  const observerRef = useRef(null);
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

  // Generate low and high resolution image URLs
  const processImageUrl = useCallback((path) => {
    if (!path) return { lowRes: DEFAULT_POSTER_SVG, highRes: DEFAULT_POSTER_SVG };

    try {
      // If it's an object, try to get the URL from common properties
      if (typeof path === 'object' && path !== null) {
        path = path.original || path.large || path.medium || path.small || path.full || (Array.isArray(path) ? path[0] : null);
        if (!path) return { lowRes: DEFAULT_POSTER_SVG, highRes: DEFAULT_POSTER_SVG };
      }

      // If it's a string, handle different URL formats
      if (typeof path === 'string') {
        // If it's already a full URL (starts with http or //)
        if (path.match(/^https?:\/\//) || path.startsWith('//')) {
          const baseUrl = path.replace(/^http:\/\//, 'https://')
                            .replace(/^\/\//, 'https://')
                            .split('?')[0];
          
          // For img.phimapi.com, we can generate a lower quality version
          if (baseUrl.includes('img.phimapi.com')) {
            // For high res, use original or add quality parameter if not present
            let highRes = baseUrl;
            if (!highRes.includes('quality=')) {
              highRes += (highRes.includes('?') ? '&' : '?') + 'quality=80';
            }
            
            // For low res, use a lower quality and smaller size
            let lowRes = baseUrl;
            // Add or replace quality parameter
            lowRes = lowRes.replace(/[?&]quality=[^&]*/, '');
            lowRes += (lowRes.includes('?') ? '&' : '?') + 'quality=30&width=200';
            
            return { lowRes, highRes };
          }
          
          // For other image hosts, use the same URL for both
          return { lowRes: baseUrl, highRes: baseUrl };
        }

        // For paths that start with upload/ or /upload/
        if (path.startsWith('upload/') || path.startsWith('/upload/')) {
          const cleanPath = path.startsWith('/') ? path : `/${path}`;
          const baseUrl = `https://img.phimapi.com${cleanPath}`;
          return {
            lowRes: `${baseUrl}?quality=30&width=200`,
            highRes: `${baseUrl}?quality=80`
          };
        }

        // For other relative paths, assume they're from the API
        const baseUrl = `https://img.phimapi.com/${path.replace(/^\//, '')}`;
        return {
          lowRes: `${baseUrl}?quality=30&width=200`,
          highRes: `${baseUrl}?quality=80`
        };
      }
    } catch (error) {
      console.error('Error processing image URL:', error);
    }

    return { lowRes: DEFAULT_POSTER_SVG, highRes: DEFAULT_POSTER_SVG };
  }, []);

  // // Handle image error
  // const handleImageError = useCallback(() => {
  //   setLowResImage(DEFAULT_POSTER_SVG);
  //   setHighResImage(DEFAULT_POSTER_SVG);
  //   setImageLoaded(true);
  //   setImageError(true);
  // }, []);

  // // Handle image load
  // const handleImageLoad = useCallback(() => {
  //   setImageLoaded(true);
  //   setImageError(false);
    
  //   // Cache the loaded image (only if it's not the default image)
  //   if (lowResImage && lowResImage !== DEFAULT_POSTER_SVG) imageCache.set(lowResImage, true);
  //   if (highResImage && highResImage !== DEFAULT_POSTER_SVG) imageCache.set(highResImage, true);
  // }, [lowResImage, highResImage]);

  // Process image URLs when posterPath changes
  useEffect(() => {
    if (!posterPath) {
      setLowResImage(DEFAULT_POSTER_SVG);
      setHighResImage(DEFAULT_POSTER_SVG);
      setImageLoaded(true);
      setImageError(false);
      return;
    }

    const { lowRes, highRes } = processImageUrl(posterPath);
    
    if (!lowRes && !highRes) {
      setLowResImage(DEFAULT_POSTER_SVG);
      setHighResImage(DEFAULT_POSTER_SVG);
      setImageLoaded(true);
      setImageError(false);
      return;
    }
    
    setLowResImage(lowRes || DEFAULT_POSTER_SVG);
    setHighResImage(highRes || lowRes || DEFAULT_POSTER_SVG);
    setImageLoaded(false);
    setImageError(false);
    
    // Check if image is already in cache
    if ((lowRes && imageCache.has(lowRes)) || (highRes && imageCache.has(highRes))) {
      setImageLoaded(true);
      setImageError(false);
    }
  }, [posterPath, processImageUrl]);
  
  // Set up Intersection Observer for lazy loading
  useEffect(() => {
    if (!imgRef.current || !lowResImage) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Load the image
          const img = new Image();
          img.src = lowResImage;
          img.onload = () => {
            // Preload high res image in the background
            if (highResImage && highResImage !== lowResImage) {
              const hiResImg = new Image();
              hiResImg.src = highResImage;
              // Cache the high res image for future use
              hiResImg.onload = () => {
                imageCache.set(highResImage, true);
              };
            }
            setImageLoaded(true);
            imageCache.set(lowResImage, true);
          };
          img.onerror = () => {
            setImageError(true);
            console.error('Failed to load image:', lowResImage);
          };
          
          // Disconnect observer after loading
          if (observerRef.current) {
            observerRef.current.disconnect();
          }
        }
      },
      {
        rootMargin: '200px', // Start loading when within 200px of viewport
        threshold: 0.01
      }
    );
    
    observer.observe(imgRef.current);
    observerRef.current = observer;
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [lowResImage, highResImage]);
  
  // Show loading skeleton if loading prop is true
  if (loading) {
    return (
      <div className="w-full">
        <div className="aspect-2/3 w-full rounded-lg bg-gray-800 animate-pulse" />
        <div className="mt-2 h-4 bg-gray-800 rounded animate-pulse w-3/4" />
        <div className="mt-1 h-3 bg-gray-800 rounded animate-pulse w-1/2" />
      </div>
    );
  }
  
  // Don't render if no valid image URL
  if ((!lowResImage && !highResImage) || imageError) {
    console.log('No valid image URL found for movie:', { id, title, posterPath });
    return null;
  }
  
  return (
    <div className="group">
      <Link 
        to={linkPath}
        className="block rounded-lg overflow-hidden transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#CC1100] focus:ring-offset-2 focus:ring-offset-gray-900"
        aria-label={`${title} (${releaseYear})`}
      >
        <div className="relative aspect-2/3 w-full overflow-hidden rounded-lg bg-gray-800">
          {/* Low resolution image (blurred placeholder) */}
          {lowResImage && (
            <img
              ref={imgRef}
              src={lowResImage}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-0' : 'opacity-100'
              }`}
              style={{
                filter: 'blur(10px)',
                transform: 'scale(1.05)', // Prevent white edges on blur
              }}
              aria-hidden="true"
            />
          )}
          
          {/* High resolution image */}
          {imageLoaded && highResImage && (
            <img
              src={highResImage}
              alt={`${title} poster`}
              className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-90"
              loading="lazy"
              onError={(e) => {
                // If high-res fails, try to fallback to low-res
                if (e.target.src !== lowResImage && lowResImage) {
                  e.target.src = lowResImage;
                } else {
                  setImageError(true);
                }
              }}
            />
          )}
          
          {/* Rating Badge */}
          <div className="absolute bottom-2 left-2 flex items-center rounded-full bg-black/70 px-2 py-1 text-xs font-medium text-yellow-400 backdrop-blur-sm">
            <StarIcon className="mr-1 h-3 w-3" />
            <span>{formattedRating}</span>
          </div>
          
          {/* Loading indicator (only shows if image is not yet loaded) */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
            </div>
          )}
        </div>
        
        {/* Movie Info */}
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
    </div>
  );
}

export default MovieCard;
