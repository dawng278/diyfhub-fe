import React, { useState, useEffect } from 'react'
import { getCategories } from '../../services/apiService'
import CategoryCard from '../organisms/categoryCard'

function CategoriesSection() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getCategories();
        
        // Log the full response for debugging
        console.log('Categories API Response:', response);
        
        // Handle different possible response structures
        let categoriesData = [];
        
        if (Array.isArray(response)) {
          // If the response is already an array
          categoriesData = response;
        } else if (response && response.data) {
          // Handle nested data structure
          if (Array.isArray(response.data)) {
            categoriesData = response.data;
          } else if (response.data.items && Array.isArray(response.data.items)) {
            categoriesData = response.data.items;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            categoriesData = response.data.data;
          }
        } else if (response && response.items && Array.isArray(response.items)) {
          categoriesData = response.items;
        }
        
        console.log('Processed Categories Data:', categoriesData);
        setCategories(categoriesData || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        console.error('Error details:', err.message);
        setError(err);
        setCategories([]); // Ensure we have an empty array on error
      } finally {
        setLoading(false);
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <section className="py-12 px-12 md:px-16 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <p className="text-white text-center">Đang tải thể loại...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12 px-12 md:px-16 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <p className="text-red-500 text-center">Lỗi khi tải thể loại: {error.message}</p>
        </div>
      </section>
    )
  }

  console.log('Rendering CategoriesSection, categories:', categories)

  return (
    <section className="py-12 px-12 md:px-16 bg-[#030712] relative z-0">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">
            Bạn đang quan tâm gì?
          </h2>
          <div className="w-20 h-1 bg-red-600 rounded"></div>
        </div>

        {/* Debug Info */}
        {/* <p className="text-white mb-4">Categories count: {categories.length}</p> */}

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
          {categories.slice(0, 6).map((category, index) => (
            <CategoryCard 
              key={category.slug || index} 
              category={category} 
              index={index}
            />
          ))}
          
          {/* "+4 chủ đề" Card */}
          {categories.length > 6 && (
            <div className="bg-gray-600 hover:bg-gray-700 rounded-xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer group flex items-center justify-center">
              <div className="text-center">
                <p className="text-white font-bold text-lg">
                  +{categories.length - 6} chủ đề
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default CategoriesSection