import React from "react";
import { Link } from "react-router-dom";

function Gioithieu() {
  const email = "BinN63342@gmail.com";
  const subject = "Yêu cầu hỗ trợ về dịch vụ";
  const body = "Xin chào, \n\n Tôi cần giúp đỡ về";

  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-blue-600/20"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Nền tảng xem phim
              <span className="block text-red-500">trực tuyến miễn phí</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              DiYfHub là nền tảng xem phim trực tuyến miễn phí, cung cấp không gian giải trí đỉnh cao cho hàng triệu người dùng với tiêu chí chất lượng, tiện lợi và phong phú.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Features Grid */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: Giao diện thân thiện */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-red-500 transition-all duration-300">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Giao Diện Thân Thiện</h3>
              <p className="text-gray-400 leading-relaxed">
                Thiết kế tối giản, trực quan giúp bạn dễ dàng khám phá và tìm kiếm những bộ phim yêu thích chỉ với vài thao tác đơn giản.
              </p>
            </div>

            {/* Feature 2: Kho phim phong phú */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-red-500 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Kho Phim Phong Phú</h3>
              <p className="text-gray-400 leading-relaxed">
                Hàng ngàn bộ phim thuộc nhiều thể loại: hành động, lãng mạn, khoa học viễn tưởng, hoạt hình, kinh dị và phiêu lưu.
              </p>
            </div>

            {/* Feature 3: Chất lượng cao */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-red-500 transition-all duration-300">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Chất Lượng Đỉnh Cao</h3>
              <p className="text-gray-400 leading-relaxed">
                Video sắc nét từ HD đến 4K với âm thanh sống động, mang lại trải nghiệm chân thực như đang xem phim tại rạp.
              </p>
            </div>
          </div>
        </section>

        {/* Movie Categories */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Kho Phim Đa Dạng</h2>
            <p className="text-gray-400 text-lg">Khám phá thế giới giải trí vô tận với nhiều thể loại phim</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-red-900/30 to-red-800/30 rounded-xl p-6 border border-red-700/50">
              <h4 className="text-xl font-bold text-red-400 mb-3">Phim Bộ</h4>
              <p className="text-gray-300">Từ các series kinh điển đến bộ phim truyền hình mới nhất, thưởng thức liên tục những tập phim hay.</p>
            </div>
            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 rounded-xl p-6 border border-blue-700/50">
              <h4 className="text-xl font-bold text-blue-400 mb-3">Phim Lẻ</h4>
              <p className="text-gray-300">Những bộ phim điện ảnh đình đám từ Hollywood, châu Á đến các bộ phim độc lập hấp dẫn.</p>
            </div>
            <div className="bg-gradient-to-br from-green-900/30 to-green-800/30 rounded-xl p-6 border border-green-700/50">
              <h4 className="text-xl font-bold text-green-400 mb-3">Phim Việt Nam</h4>
              <p className="text-gray-300">Luôn cập nhật các bộ phim Việt Nam mới và nổi tiếng, đáp ứng nhu cầu của người yêu phim Việt.</p>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Tính Năng Nổi Bật</h2>
            <p className="text-gray-400 text-lg">Trải nghiệm xem phim tốt nhất với các tính năng ưu việt</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Xem Phim Miễn Phí Hoàn Toàn</h4>
                  <p className="text-gray-400">Phục vụ cộng đồng với phương châm miễn phí, không cần chi trả bất kỳ khoản phí nào để truy cập và xem phim.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Cập Nhật Phim Nhanh Chóng</h4>
                  <p className="text-gray-400">Đội ngũ làm việc không ngừng nghỉ để cập nhật những bộ phim mới nhất, giúp bạn luôn đón đầu xu hướng.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Xem Phim Mọi Lúc, Mọi Nơi</h4>
                  <p className="text-gray-400">Hỗ trợ đa nền tảng từ máy tính, điện thoại đến các thiết bị thông minh khác.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Bảo Mật & An Toàn</h4>
                  <p className="text-gray-400">Thông tin cá nhân của bạn luôn được bảo mật tuyệt đối, an toàn và bảo mật là ưu tiên hàng đầu.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Commitment Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-red-900/20 to-blue-900/20 rounded-2xl p-8 lg:p-12 border border-gray-700">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Cam Kết Của DiYfHub</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Chúng tôi cam kết bảo vệ quyền lợi người dùng với chất lượng dịch vụ tốt nhất. DiYfHub không ngừng phát triển và cải thiện để đem lại trải nghiệm xem phim hoàn hảo.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="text-center">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-6">Liên Hệ Với DiYfHub</h2>
            <p className="text-gray-300 mb-8 text-lg">
              Để biết thêm chi tiết hoặc có thắc mắc về dịch vụ, vui lòng liên hệ với chúng tôi:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href={mailtoLink}
                className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                lienhe@DiYfHub.com
              </a>
              <Link 
                to="/lien-he"
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Trang Liên Hệ
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Gioithieu;
