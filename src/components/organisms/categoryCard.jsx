import React from 'react';
import { useNavigate } from 'react-router-dom';

// Màu sắc cho các thể loại
const categoryColors = [
  'bg-blue-500 hover:bg-blue-600',
  'bg-purple-500 hover:bg-purple-600',
  'bg-teal-500 hover:bg-teal-600',
  'bg-indigo-500 hover:bg-indigo-600',
  'bg-orange-400 hover:bg-orange-500',
  'bg-rose-500 hover:bg-rose-600',
  'bg-gray-600 hover:bg-gray-700',
]

function CategoryCard({ category, index }) {
  // Chọn màu dựa trên index
  const colorClass = categoryColors[index % categoryColors.length];
  
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (category) { 
      // Ensure we have both id and slug
      const categoryId = category.id; // Always use the ID for the ID parameter
      const categorySlug = category.slug || category.name?.toLowerCase().replace(/\s+/g, '-');
      const categoryName = category.name || 'Unknown Category';
      
      if (!categoryId) {
        console.error('Category ID is missing!', category);
        return;
      }
      
      console.log('Navigating to category:', { 
        id: categoryId, 
        slug: categorySlug, 
        name: categoryName 
      });
      
      // Navigate to the category page with both ID and slug
      navigate(`/the-loai/${categoryId}/${categorySlug}`, {
        state: { 
          categoryName: categoryName
        }
      });
    } else {
      console.warn('Invalid category data:', category);
    }
  };
  
  return (
    <div 
      onClick={handleClick}
      className={`${colorClass} rounded-xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer group`}
    >
      <div className="flex flex-col justify-between h-full">
        {/* Tên thể loại */}
        <h3 className="text-white font-bold text-lg mb-2 group-hover:translate-x-1 transition-transform">
          {category.name}
        </h3>
        
        {/* Link "Xem chi tiết" */}
        <div className="flex items-center gap-1 text-white/80 text-sm group-hover:text-white transition-colors">
          <span>Xem chi tiết</span>
          <svg 
            className="w-4 h-4 group-hover:translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default CategoryCard