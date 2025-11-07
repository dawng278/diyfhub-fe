import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Heart, TrendingUp, Zap } from 'lucide-react';

const mockData = {
  topComments: [
    { id: 1, user: 'Nguyễn Văn A', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', comment: 'Phim rất hay! Diễn viên đóng quá xuất sắc, kịch bản hấp dẫn từ đầu đến cuối.', movie: 'Bố Già', likes: 124, timeAgo: '2 giờ trước' },
    { id: 2, user: 'Trần Thị B', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', comment: 'Cảm động quá, mình đã khóc rất nhiều khi xem phim này. Tuyệt vời!', movie: 'Mắt Biếc', likes: 98, timeAgo: '3 giờ trước' },
    { id: 3, user: 'Lê Văn C', avatar: 'https://randomuser.me/api/portraits/men/3.jpg', comment: 'Xuất sắc! Đạo diễn đã làm rất tốt trong việc xây dựng tình tiết.', movie: 'Gái Già Lắm Chiêu', likes: 87, timeAgo: '5 giờ trước' },
    { id: 4, user: 'Phạm Thị D', avatar: 'https://randomuser.me/api/portraits/women/4.jpg', comment: 'Tuyệt vời, hình ảnh đẹp, âm thanh sống động. Đáng xem!', movie: 'Trạng Tí', likes: 76, timeAgo: '1 ngày trước' },
    { id: 5, user: 'Hoàng Văn E', avatar: 'https://randomuser.me/api/portraits/men/5.jpg', comment: 'Đỉnh cao của điện ảnh Việt Nam. Diễn xuất quá xuất sắc!', movie: 'Bí Mật Của Gió', likes: 143, timeAgo: '1 ngày trước' },
    { id: 6, user: 'Vũ Thị F', avatar: 'https://randomuser.me/api/portraits/women/6.jpg', comment: 'Quá hay, mình đã xem đi xem lại nhiều lần mà vẫn thấy thích.', movie: 'Lật Mặt', likes: 112, timeAgo: '2 ngày trước' },
    { id: 7, user: 'Nguyễn Thị G', avatar: 'https://randomuser.me/api/portraits/women/7.jpg', comment: 'Tuyệt vời! Diễn xuất quá đỉnh cao, âm nhạc hay.', movie: 'Bố Già', likes: 89, timeAgo: '2 ngày trước' },
    { id: 8, user: 'Trần Văn H', avatar: 'https://randomuser.me/api/portraits/men/8.jpg', comment: 'Rất cảm động, kịch bản chặt chẽ, diễn viên nhập vai tốt.', movie: 'Mắt Biếc', likes: 67, timeAgo: '3 ngày trước' },
    { id: 9, user: 'Lê Thị I', avatar: 'https://randomuser.me/api/portraits/women/9.jpg', comment: 'Hay lắm! Nội dung ý nghĩa, hình ảnh đẹp, đáng xem!', movie: 'Gái Già Lắm Chiêu', likes: 94, timeAgo: '3 ngày trước' },
    { id: 10, user: 'Phạm Văn J', avatar: 'https://randomuser.me/api/portraits/men/10.jpg', comment: 'Đỉnh cao, xứng đáng là phim hay nhất năm!', movie: 'Trạng Tí', likes: 78, timeAgo: '4 ngày trước' },
    { id: 11, user: 'Hoàng Thị K', avatar: 'https://randomuser.me/api/portraits/women/11.jpg', comment: 'Xuất sắc từ diễn xuất đến kịch bản, rất đáng xem!', movie: 'Bí Mật Của Gió', likes: 101, timeAgo: '4 ngày trước' },
    { id: 12, user: 'Vũ Văn L', avatar: 'https://randomuser.me/api/portraits/men/12.jpg', comment: 'Quá tuyệt, không thể chê vào đâu được!', movie: 'Lật Mặt', likes: 85, timeAgo: '5 ngày trước' }
  ],
  trending: [
    { id: 1, title: 'Bố Già', views: '1.2M', rating: 9.2 },
    { id: 2, title: 'Gái Già Lắm Chiêu', views: '980K', rating: 8.9 },
    { id: 3, title: 'Trạng Tí', views: '850K', rating: 8.7 },
    { id: 4, title: 'Bí Mật Của Gió', views: '790K', rating: 8.5 },
    { id: 5, title: 'Mắt Biếc', views: '750K', rating: 8.4 }
  ],
  popular: [
    { id: 1, title: 'Bố Già', likes: '500K' },
    { id: 2, title: 'Mắt Biếc', likes: '450K' },
    { id: 3, title: 'Gái Già Lắm Chiêu', likes: '420K' },
    { id: 4, title: 'Trạng Tí', likes: '380K' },
    { id: 5, title: 'Bí Mật Của Gió', likes: '350K' }
  ],
  hot: [
    { id: 1, title: 'Mai', comments: '15K' },
    { id: 2, title: 'Đào Phở và Piano', comments: '12K' },
    { id: 3, title: 'Cô Dâu Hào Môn', comments: '10K' },
    { id: 4, title: 'Quỷ Cẩu', comments: '8.5K' },
    { id: 5, title: 'Lật Mặt 7', comments: '7K' }
  ],
  newComments: [
    { id: 1, user: 'Mai Anh', time: '2 phút trước', movie: 'Mai' },
    { id: 2, user: 'Tuấn Kiệt', time: '5 phút trước', movie: 'Đào Phở' },
    { id: 3, user: 'Lan Hương', time: '10 phút trước', movie: 'Cô Dâu' },
    { id: 4, user: 'Minh Tuấn', time: '15 phút trước', movie: 'Quỷ Cẩu' },
    { id: 5, user: 'Thu Hà', time: '20 phút trước', movie: 'Lật Mặt' }
  ]
};

const LeaderboardDashboard = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Responsive items per slide
  const getItemsPerSlide = () => {
    if (typeof window === 'undefined') return 6;
    const width = window.innerWidth;
    if (width < 640) return 2; // mobile
    if (width < 768) return 3; // tablet
    if (width < 1024) return 4; // small laptop
    return 6; // desktop
  };

  const [itemsPerSlide, setItemsPerSlide] = useState(getItemsPerSlide());

  React.useEffect(() => {
    const handleResize = () => {
      setItemsPerSlide(getItemsPerSlide());
      setCurrentSlide(0); // Reset slide on resize
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = Math.ceil(mockData.topComments.length / itemsPerSlide);
  const minSwipeDistance = 50;

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && currentSlide < totalSlides - 1) {
      nextSlide();
    } else if (isRightSwipe && currentSlide > 0) {
      prevSlide();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  const visibleComments = mockData.topComments.slice(
    currentSlide * itemsPerSlide,
    (currentSlide + 1) * itemsPerSlide
  );

  const canGoBack = currentSlide > 0;
  const canGoNext = currentSlide < totalSlides - 1;

  return (
    <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-gray-950 text-[#ffffff]">
      <div className="mx-auto relative rounded-lg md:rounded-2xl overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" />
        
        <div className="relative p-4 sm:p-5 md:p-6 lg:p-8 space-y-6 md:space-y-8">
          {/* Top Comments Carousel */}
          <div className="bg-gray-900 rounded-xl p-4 sm:p-5 md:p-6 border border-gray-800">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <span className="text-xl sm:text-2xl">💬</span>
            <h2 className="text-lg sm:text-xl font-bold">TOP BÌNH LUẬN</h2>
          </div>
          
          <div className="relative">
            {/* Left Arrow */}
            {canGoBack && (
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-12 sm:w-10 sm:h-16 md:w-12 md:h-20 -translate-x-2 sm:-translate-x-3 md:-translate-x-4 bg-gradient-to-r pr-1 sm:pr-2 md:pr-3 flex items-center justify-start rounded-r-lg transition-all duration-200 ease-out active:scale-95"
                aria-label="Previous comments"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110">
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-900" />
                </div>
              </button>
            )}

            {/* Comments Grid */}
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-3 sm:gap-4"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {visibleComments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-gray-800 rounded-xl hover:bg-gray-750 transition-colors cursor-pointer h-full flex flex-col"
                >
                  <div className="flex items-center p-3 border-b border-gray-700">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
                      <img 
                        src={comment.avatar} 
                        alt={comment.user}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(comment.user) + '&background=4b5563&color=fff';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-medium text-white truncate">{comment.user}</h4>
                      <p className="text-[10px] text-gray-400">{comment.timeAgo}</p>
                    </div>
                  </div>
                  
                  <div className="p-3 flex-1">
                    <p className="text-xs text-gray-200 line-clamp-3 mb-3">{comment.comment}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400 font-medium">{comment.movie}</span>
                      <div className="flex items-center text-xs text-gray-400">
                        <span className="w-5 h-5 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </span>
                        <span className="ml-1">{comment.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            {canGoNext && (
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-12 sm:w-10 sm:h-16 md:w-12 md:h-20 translate-x-2 sm:translate-x-3 md:translate-x-4 bg-gradient-to-l pl-1 sm:pl-2 md:pl-3 flex items-center justify-end rounded-l-lg transition-all duration-200 ease-out active:scale-95"
                aria-label="Next comments"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110">
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-900" />
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Four Column Leaderboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Trending Column */}
          <div className="bg-gray-900 sm:rounded-bl-2xl p-4 sm:p-5 border border-gray-800 border-r-0 sm:border-r lg:border-r-0 border-t-0">
            <div className="flex items-center gap-2 mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-gray-800">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
              <h3 className="font-bold text-xs sm:text-sm">SÔI NỔI NHẤT</h3>
            </div>
            <div className="space-y-2">
              {mockData.trending.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                >
                  <span className={`text-sm sm:text-base font-bold w-5 ${index < 3 ? 'text-yellow-500' : 'text-gray-600'}`}>
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-sm font-medium truncate">{item.title}</div>
                    <div className="text-xs text-gray-500">{item.views}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 text-xs sm:text-sm text-gray-400 hover:text-gray-300 transition-colors">
              Xem thêm
            </button>
          </div>

          {/* Popular Column */}
          <div className="bg-gray-900 p-4 sm:p-5 border border-gray-800 border-r-0 border-t-0">
            <div className="flex items-center gap-2 mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-gray-800">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
              <h3 className="font-bold text-xs sm:text-sm">YÊU THÍCH NHẤT</h3>
            </div>
            <div className="space-y-2">
              {mockData.popular.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                >
                  <span className={`text-sm sm:text-base font-bold w-5 ${index < 3 ? 'text-yellow-500' : 'text-gray-600'}`}>
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-sm font-medium truncate">{item.title}</div>
                    <div className="text-xs text-gray-500">{item.likes}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 text-xs sm:text-sm text-gray-400 hover:text-gray-300 transition-colors">
              Xem thêm
            </button>
          </div>

          {/* Hot Column */}
          <div className="bg-gray-900 p-4 sm:p-5 border border-gray-800 border-r-0 sm:border-r lg:border-r-0 border-t-0">
            <div className="flex items-center gap-2 mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-gray-800">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
              <h3 className="font-bold text-xs sm:text-sm">THỂ LOẠI HOT</h3>
            </div>
            <div className="space-y-2">
              {mockData.hot.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                >
                  <span className={`text-sm sm:text-base font-bold w-5 ${index < 3 ? 'text-yellow-500' : 'text-gray-600'}`}>
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-sm font-medium truncate">{item.title}</div>
                    <div className="text-xs text-gray-500">{item.comments}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 text-xs sm:text-sm text-gray-400 hover:text-gray-300 transition-colors">
              Xem thêm
            </button>
          </div>

          {/* New Comments Column */}
          <div className="bg-gray-900 rounded-br-2xl p-4 sm:p-5 border border-gray-800 border-t-0">
            <div className="flex items-center gap-2 mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-gray-800">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
              <h3 className="font-bold text-xs sm:text-sm">BÌNH LUẬN MỚI</h3>
            </div>
            <div className="space-y-2">
              {mockData.newComments.map((item) => (
                <div
                  key={item.id}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer bg-gray-850"
                >
                  <div className="text-xs sm:text-sm font-medium mb-1 truncate">{item.user}</div>
                  <div className="text-xs text-gray-500">{item.time}</div>
                  <div className="text-xs text-gray-400 mt-1 truncate">{item.movie}</div>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 text-xs sm:text-sm text-gray-400 hover:text-gray-300 transition-colors">
              Xem thêm
            </button>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeaderboardDashboard;