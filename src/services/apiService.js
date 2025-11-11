const PHIM_API_URL = 'https://phimapi.com';

/**
 * Helper function to handle API requests
 * @private
 */
const fetchApi = async (url, options = {}) => {
  const isGetRequest = !options.method || options.method.toUpperCase() === 'GET';
  
  try {
    const headers = {
      // Only include Content-Type for non-GET requests
      ...(!isGetRequest && { 'Content-Type': 'application/json' }),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
      // Important for CORS
      mode: 'cors',
      credentials: 'omit',
    });

    if (!response.ok) {
      // Try to parse error response as JSON, fallback to text if it fails
      let error;
      try {
        const errorData = await response.json();
        error = new Error(errorData.message || 'Something went wrong');
      } catch {
        const errorText = await response.text();
        error = new Error(errorText || 'Something went wrong');
      }
      error.status = response.status;
      throw error;
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    // Enhance the error with more context
    if (!error.status) {
      error.message = `Network error: ${error.message}`;
    }
    throw error;
  }
};

/**
 * Movies API
 */

/**
 * Get new movies (same as getLatestMovies for backward compatibility)
 * @param {number} [page=1] - Page number
 * @param {string} [version=v1] - API version
 * @returns {Promise<Object>} - List of new movies
 */
export const getNewMovies = async (page = 1, version = 'v1') => {
  return getLatestMovies(version, page);
};

export const getLatestMovies = async (version = 'v1', page = 1) => {
  const url = version === 'v1' 
    ? `${PHIM_API_URL}/danh-sach/phim-moi-cap-nhat?page=${page}`
    : `${PHIM_API_URL}/danh-sach/phim-moi-cap-nhat-${version}?page=${page}`;
  
  return fetchApi(url);
};

export const getMovieBySlug = async (slug) => {
  return fetchApi(`${PHIM_API_URL}/phim/${slug}`);
};

export const getMovieByTmdbId = async (type, id) => {
  return fetchApi(`${PHIM_API_URL}/tmdb/${type}/${id}`);
};

/**
 * Get a list of movies with filters
 * @param {Object} options - Filter options
 * @param {string} [options.type=phim-bo] - Type of movies (phim-bo, phim-le, etc.)
 * @param {number} [options.page=1] - Page number
 * @param {string} [options.sortField=_id] - Field to sort by
 * @param {string} [options.sortType=desc] - Sort direction (asc/desc)
 * @param {string} [options.sortLang=vietsub] - Language filter
 * @param {string} [options.category] - Category filter
 * @param {string} [options.country] - Country filter
 * @param {string} [options.year] - Year filter
 * @param {number} [options.limit=24] - Number of items per page
 */
export const getMovieList = async ({
  type = 'phim-bo',
  page = 1,
  sortField = '_id',
  sortType = 'desc',
  sortLang = 'vietsub',
  category = '',
  country = '',
  year = '',
  limit = 24,
} = {}) => {
  const params = new URLSearchParams({
    page,
    sort_field: sortField,
    sort_type: sortType,
    sort_lang: sortLang,
    ...(category && { category }),
    ...(country && { country }),
    ...(year && { year }),
    limit,
  }).toString();

  return fetchApi(`${PHIM_API_URL}/v1/api/danh-sach/${type}?${params}`);
};

/**
 * Search for movies
 * @param {Object} options - Search options
 * @param {string} options.keyword - Search keyword
 * @param {number} [options.page=1] - Page number
 * @param {string} [options.sortField=_id] - Field to sort by
 * @param {string} [options.sortType=desc] - Sort direction (asc/desc)
 * @param {string} [options.sortLang=vietsub] - Language filter
 * @param {string} [options.category] - Category filter
 * @param {string} [options.country] - Country filter
 * @param {string} [options.year] - Year filter
 * @param {number} [options.limit=24] - Number of items per page
 */
export const searchMovies = async ({
  keyword,
  page = 1,
  sortField = '_id',
  sortType = 'desc',
  sortLang = 'vietsub',
  category = '',
  country = '',
  year = '',
  limit = 24,
}) => {
  const params = new URLSearchParams({
    keyword,
    page,
    sort_field: sortField,
    sort_type: sortType,
    sort_lang: sortLang,
    ...(category && { category }),
    ...(country && { country }),
    ...(year && { year }),
    limit,
  }).toString();

  return fetchApi(`${PHIM_API_URL}/v1/api/tim-kiem?${params}`);
};

/**
 * Get all categories
 * @returns {Promise<Array>} List of categories
 */
export const getCategories = async () => {
  const response = await fetchApi(`${PHIM_API_URL}/the-loai`);
  // The API returns the categories directly as an array
  return response || [];
};

/**
 * Get movies by category
 * @param {string} category - Category slug
 * @param {Object} [options={}] - Additional options
 * @param {number} [options.page=1] - Page number
 * @param {string} [options.sortField=_id] - Field to sort by
 * @param {string} [options.sortType=desc] - Sort direction (asc/desc)
 * @param {string} [options.sortLang=vietsub] - Language filter
 * @param {string} [options.country] - Country filter
 * @param {string} [options.year] - Year filter
 * @param {number} [options.limit=24] - Number of items per page
 */
export const getMoviesByCategory = async (category, options = {}) => {
  const params = new URLSearchParams({
    page: options.page || 1,
    sort_field: options.sortField || '_id',
    sort_type: options.sortType || 'desc',
    sort_lang: options.sortLang || 'vietsub',
    ...(options.country && { country: options.country }),
    ...(options.year && { year: options.year }),
    limit: options.limit || 24,
  }).toString();

  return fetchApi(`${PHIM_API_URL}/v1/api/the-loai/${category}?${params}`);
};

/**
 * Get related movies by category
 * @param {string} categoryId - ID of the category
 * @param {string} excludeMovieId - ID of the movie to exclude
 * @param {number} [limit=6] - Maximum number of related movies to return
 * @returns {Promise<Object>} - List of related movies
 */
export const getRelatedMovies = async (categoryId, excludeMovieId, limit = 6) => {
  if (!categoryId) {
    return { data: { items: [] } };
  }

  try {
    const response = await getMoviesByCategory(categoryId, {
      limit,
      exclude: excludeMovieId,
      sortField: 'updatedAt',
      sortType: 'desc'
    });

    return response || { data: { items: [] } };
  } catch (error) {
    console.error('Error fetching related movies:', error);
    return { data: { items: [] } };
  }
};

/**
 * Get all countries
 * @returns {Promise<Array>} List of countries
 */
export const getCountries = async () => {
  const response = await fetchApi(`${PHIM_API_URL}/quoc-gia`);
  // The API returns the countries directly as an array
  return response || [];
};

/**
 * Get movies by country
 * @param {string} country - Country slug
 * @param {Object} [options={}] - Additional options
 * @param {number} [options.page=1] - Page number
 * @param {string} [options.sortField=_id] - Field to sort by
 * @param {string} [options.sortType=desc] - Sort direction (asc/desc)
 * @param {string} [options.sortLang=vietsub] - Language filter
 * @param {string} [options.category] - Category filter
 * @param {string} [options.year] - Year filter
 * @param {number} [options.limit=24] - Number of items per page
 */
export const getMoviesByCountry = async (country, options = {}) => {
  const params = new URLSearchParams({
    page: options.page || 1,
    sort_field: options.sortField || '_id',
    sort_type: options.sortType || 'desc',
    sort_lang: options.sortLang || 'vietsub',
    ...(options.category && { category: options.category }),
    ...(options.year && { year: options.year }),
    limit: options.limit || 24,
  }).toString();

  return fetchApi(`${PHIM_API_URL}/v1/api/quoc-gia/${country}?${params}`);
};

/**
 * Get movies by year
 * @param {string|number} year - Release year
 * @param {Object} [options={}] - Additional options
 * @param {number} [options.page=1] - Page number
 * @param {string} [options.sortField=_id] - Field to sort by
 * @param {string} [options.sortType=desc] - Sort direction (asc/desc)
 * @param {string} [options.sortLang=vietsub] - Language filter
 * @param {string} [options.category] - Category filter
 * @param {string} [options.country] - Country filter
 * @param {number} [options.limit=24] - Number of items per page
 */
export const getMoviesByYear = async (year, options = {}) => {
  const params = new URLSearchParams({
    page: options.page || 1,
    sort_field: options.sortField || '_id',
    sort_type: options.sortType || 'desc',
    sort_lang: options.sortLang || 'vietsub',
    ...(options.category && { category: options.category }),
    ...(options.country && { country: options.country }),
    limit: options.limit || 24,
  }).toString();

  return fetchApi(`${PHIM_API_URL}/v1/api/nam/${year}?${params}`);
};

/**
 * Get image URL with proper formatting
 * @param {string} imageUrl - Original image URL
 * @returns {string|null} Formatted image URL or null if no URL provided
 */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  return `https://phimapi.com/image.php?url=${encodeURIComponent(imageUrl)}`;
};

// Backward compatibility
export const constructImageUrl = getImageUrl;
