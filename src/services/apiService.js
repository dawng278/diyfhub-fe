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
 * @param {string} [options.sortField=modified.time] - Field to sort by
 * @param {string} [options.sortType=desc] - Sort direction (asc/desc)
 * @param {string} [options.country] - Country filter
 * @param {string} [options.year] - Year filter
 * @param {number} [options.limit=24] - Number of items per page
 */
// Map of component names and Vietnamese names to their corresponding API slugs
const CATEGORY_SLUG_MAP = {
  // English component names
  'action': 'hanh-dong',
  'anime': 'hoat-hinh',
  'adventure': 'phieu-luu',
  'comedy': 'hai-huoc',
  'romance': 'tinh-cam',
  'drama': 'tam-ly',
  'horror': 'kinh-di',
  'scifi': 'khoa-hoc-vien-tuong',
  'thriller': 'gay-can',
  'war': 'chien-tranh',
  'western': 'cao-boi',
  'sports': 'the-thao',
  'music': 'am-nhac',
  'family': 'gia-dinh',
  'fantasy': 'than-thoai',
  'history': 'lich-su',
  'mystery': 'bi-an',
  'crime': 'hinh-su',
  'documentary': 'tai-lieu',
  'adult': '18+',
  'latest': 'phim-moi-cap-nhat',
  'children': 'thieu-nhi',
  'classic': 'co-trang',
  'school': 'hoc-duong',
  'martialarts': 'vo-thuat',
  'vietnam': 'viet-nam',
  'korea': 'han-quoc',
  'usuk': 'my',
  'hongkong': 'hong-kong',
  'japan': 'nhat-ban',
  'thailand': 'thai-lan',
  'europe': 'au-my',
  'india': 'an-do',
  
  // Vietnamese names
  'phim chien tranh': 'chien-tranh',
  'phim the thao': 'the-thao',
  'phim tinh cam': 'tinh-cam',
  'phim hai huoc': 'hai-huoc',
  'phim phieu luu': 'phieu-luu',
  'phim tre em': 'thieu-nhi',
  'phim kinh dien': 'co-trang',
  'phim hinh su': 'hinh-su',
  'phim tam ly': 'tam-ly',
  'phim vo thuat': 'vo-thuat',
  'phim co trang': 'co-trang',
  'phim than thoai': 'than-thoai',
  'phim hoat hinh': 'hoat-hinh',
  'phim khoa hoc vien tuong': 'khoa-hoc-vien-tuong',
  'phim am nhac': 'am-nhac',
  'phim gia dinh': 'gia-dinh',
  'phim lich su': 'lich-su',
  'phim bi an': 'bi-an',
  'phim tai lieu': 'tai-lieu',
  'phim 18+': '18+',
  'phim moi cap nhat': 'phim-moi-cap-nhat',
  'phim thieu nhi': 'thieu-nhi',
  'phim hoc duong': 'hoc-duong',
  'phim viet nam': 'viet-nam',
  'phim han quoc': 'han-quoc',
  'phim my': 'my',
  'phim hong kong': 'hong-kong',
  'phim nhat ban': 'nhat-ban',
  'phim thai lan': 'thai-lan',
  'phim au my': 'au-my',
  'phim an do': 'an-do',
  
  // Common misspellings and variations
  'chien-tranh': 'chien-tranh',
  'the-thao': 'the-thao',
  'tinh-cam': 'tinh-cam',
  'hai-huoc': 'hai-huoc',
  'phieu-luu': 'phieu-luu',
  'thieu-nhi': 'thieu-nhi',
  'co-trang': 'co-trang',
  'hinh-su': 'hinh-su',
  'tam-ly': 'tam-ly',
  'vo-thuat': 'vo-thuat',
  'than-thoai': 'than-thoai',
  'hoat-hinh': 'hoat-hinh',
  'khoa-hoc-vien-tuong': 'khoa-hoc-vien-tuong',
  'am-nhac': 'am-nhac',
  'gia-dinh': 'gia-dinh',
  'lich-su': 'lich-su',
  'bi-an': 'bi-an',
  'tai-lieu': 'tai-lieu',
  '18+': '18+',
  'phim-moi-cap-nhat': 'phim-moi-cap-nhat',
  'hoc-duong': 'hoc-duong',
  'viet-nam': 'viet-nam',
  'han-quoc': 'han-quoc',
  'my': 'my',
  'hong-kong': 'hong-kong',
  'nhat-ban': 'nhat-ban',
  'thai-lan': 'thai-lan',
  'au-my': 'au-my',
  'an-do': 'an-do'
};

// Helper function to clean and normalize category names
const cleanCategoryName = (name) => {
  if (!name) return '';
  // Convert to lowercase and trim
  let cleaned = name.toString().toLowerCase().trim();
  // Remove 'phim' prefix if present
  cleaned = cleaned.replace(/^phim\s+/, '');
  // Remove diacritics (accents)
  cleaned = cleaned.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  // Replace multiple spaces with single dash
  cleaned = cleaned.replace(/\s+/g, '-');
  // Remove any remaining special characters
  cleaned = cleaned.replace(/[^a-z0-9-]/g, '');
  return cleaned;
};

export const getMoviesByCategory = async (category, options = {}) => {
  try {
    console.log('Original category:', category);
    
    // Clean and normalize the category name
    const cleanedCategory = cleanCategoryName(category);
    
    // Try to find a matching slug in our mapping
    let categorySlug = CATEGORY_SLUG_MAP[cleanedCategory] || 
                      CATEGORY_SLUG_MAP[category.toLowerCase()] || 
                      cleanedCategory;
    
    // If we still don't have a match, try to find a partial match
    if (!CATEGORY_SLUG_MAP[cleanedCategory]) {
      const matchingKey = Object.keys(CATEGORY_SLUG_MAP).find(key => 
        cleanedCategory.includes(key) || key.includes(cleanedCategory)
      );
      if (matchingKey) {
        categorySlug = CATEGORY_SLUG_MAP[matchingKey];
      }
    }
    
    console.log('Cleaned category:', cleanedCategory);
    console.log('Mapped category slug:', categorySlug);
    
    const params = new URLSearchParams({
      page: options.page || 1,
      limit: options.limit || 24,
      sort_field: options.sortField || 'modified.time',
      sort_type: options.sortType || 'desc',
      ...(options.country && { country: options.country }),
      ...(options.year && { year: options.year }),
    }).toString();

    // Try different endpoint variations
    const endpoints = [
      // Try with the mapped slug first
      `${PHIM_API_URL}/v1/api/the-loai/${categorySlug}?${params}`,
      // Try with the original category name
      `${PHIM_API_URL}/v1/api/the-loai/${category}?${params}`,
      // Try with 'phim-' prefix
      `${PHIM_API_URL}/v1/api/danh-sach/phim-${categorySlug}?${params}`,
      // Try with 'the-loai-' prefix
      `${PHIM_API_URL}/v1/api/danh-sach/${categorySlug}?${params}`,
    ];

    let lastError = null;
    
    for (const url of endpoints) {
      try {
        console.log('Trying endpoint:', url);
        const response = await fetchApi(url);
        console.log('API Response from', url, ':', response);

        let items = [];
        let pagination = {};
        
        // Handle different response formats
        if (response?.data?.items) {
          items = response.data.items;
          pagination = response.data.params?.pagination || {};
        } else if (Array.isArray(response)) {
          items = response;
        } else if (response?.items) {
          items = response.items;
          pagination = response.pagination || {};
        } else if (response?.data && Array.isArray(response.data)) {
          items = response.data;
          pagination = response.pagination || {};
        }

        if (items && items.length > 0) {
          console.log(`Found ${items.length} items for category ${categorySlug}`);
          return {
            data: items,
            pagination: {
              totalItems: pagination.totalItems || items.length,
              totalPages: pagination.totalPages || 1,
              currentPage: pagination.currentPage || (options.page || 1),
              totalItemsPerPage: pagination.totalItemsPerPage || (options.limit || 24)
            }
          };
        }
      } catch (error) {
        console.warn(`Attempt failed for ${url}:`, error.message);
        lastError = error;
        continue;
      }
    }
    
    // If we get here, all endpoints failed
    throw lastError || new Error(`No data found for category: ${category}`);
    
  } catch (error) {
    console.error('Error in getMoviesByCategory:', error);
    return { 
      data: [], 
      pagination: { 
        totalItems: 0, 
        totalPages: 1, 
        currentPage: options.page || 1, 
        totalItemsPerPage: options.limit || 24 
      } 
    };
  }
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
    return { data: [], pagination: { totalItems: 0, totalPages: 1 } };
  }

  try {
    const response = await getMoviesByCategory(categoryId, {
      limit,
      exclude: excludeMovieId,
      sortField: 'modified.time',
      sortType: 'desc'
    });

    return response || { data: [], pagination: { totalItems: 0, totalPages: 1 } };
  } catch (error) {
    console.error('Error fetching related movies:', error);
    return { data: [], pagination: { totalItems: 0, totalPages: 1 } };
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
 * @param {string} country - Country slug (e.g., 'trung-quoc')
 * @param {Object} [options={}] - Additional options
 * @param {number} [options.page=1] - Page number
 * @param {string} [options.sortField=modified.time] - Field to sort by
 * @param {string} [options.sortType=desc] - Sort direction (asc/desc)
 * @param {number} [options.limit=24] - Number of items per page
 */
export const getMoviesByCountry = async (country, options = {}) => {
  try {
    console.log('Fetching movies for country:', country);
    
    const params = new URLSearchParams({
      page: options.page || 1,
      limit: options.limit || 24,
      sort_field: options.sortField || 'modified.time',
      sort_type: options.sortType === 'asc' ? 'asc' : 'desc',
    }).toString();

    // Correct endpoint: /v1/api/quoc-gia/{country-slug}
    const url = `${PHIM_API_URL}/v1/api/quoc-gia/${country}?${params}`;
    console.log('API Request URL:', url);
    
    const response = await fetchApi(url);
    console.log('Raw API Response:', response);
    
    // API structure: { status: "success", data: { items: [...], params: { pagination: {...} } } }
    if (response && response.status === 'success' && response.data) {
      const items = response.data.items || [];
      const pagination = response.data.params?.pagination || {};
      
      console.log('Parsed items:', items.length);
      console.log('Parsed pagination:', pagination);
      
      return {
        data: items,
        pagination: {
          totalItems: pagination.totalItems || 0,
          totalPages: pagination.totalPages || 1,
          currentPage: pagination.currentPage || (options.page || 1),
          totalItemsPerPage: pagination.totalItemsPerPage || (options.limit || 24)
        }
      };
    }
    
    console.error('Unexpected API response structure:', response);
    return { data: [], pagination: { totalItems: 0, totalPages: 1, currentPage: 1 } };
  } catch (error) {
    console.error('Error in getMoviesByCountry:', error);
    return { data: [], pagination: { totalItems: 0, totalPages: 1, currentPage: 1 } };
  }
};

/**
 * Get movies by year
 * @param {string|number} year - Release year
 * @param {Object} [options={}] - Additional options
 * @param {number} [options.page=1] - Page number
 * @param {string} [options.sortField=modified.time] - Field to sort by
 * @param {string} [options.sortType=desc] - Sort direction (asc/desc)
 * @param {string} [options.category] - Category filter
 * @param {string} [options.country] - Country filter
 * @param {number} [options.limit=24] - Number of items per page
 */
export const getMoviesByYear = async (year, options = {}) => {
  const params = new URLSearchParams({
    page: options.page || 1,
    sort_field: options.sortField || 'modified.time',
    sort_type: options.sortType || 'desc',
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
  return `https://img.phimapi.com/${imageUrl}`;
};

// Backward compatibility
export const constructImageUrl = getImageUrl;