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
        const response = await getCategories()
        console.log('Categories Response:', response.data)
        console.log('Full Response:', response)
        
        // Lấy danh sách thể loại từ response - thử nhiều cấu trúc khác nhau
        const categoriesData = response.data.data?.items || 
                              response.data.items || 
                              response.data.data || 
                              response.data || 
                              []
        
        console.log('Categories Data:', categoriesData)
        console.log('Categories Length:', categoriesData.length)
        
        setCategories(categoriesData)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching categories:', err)
        setError(err)
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <section className="py-12 px-4 md:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <p className="text-white text-center">Đang tải thể loại...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12 px-4 md:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <p className="text-red-500 text-center">Lỗi khi tải thể loại: {error.message}</p>
        </div>
      </section>
    )
  }

  console.log('Rendering CategoriesSection, categories:', categories)

  return (
    <section className="py-12 px-4 md:px-8 bg-gray-900 relative z-0">
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