import React from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaTiktok, FaFacebook, FaDiscord, FaQuestionCircle, FaUserShield, FaHeadset, FaLightbulb, FaArrowRight } from "react-icons/fa";

function Lienhe() {
  const email = "BinN63342@gmail.com";
  const subject = "Yêu cầu hỗ trợ về thông tin khách hàng";
  const subject2 = "Yêu cầu hỗ trợ về chính sách và riêng tư";
  const body = "Xin chào, \n\n Tôi cần giúp đỡ về";

  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const mailtoLink2 = `mailto:${email}?subject=${encodeURIComponent(subject2)}&body=${encodeURIComponent(body)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-blue-600/20"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center">
                <FaEnvelope className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Liên Hệ
              <span className="block text-red-500">DiYfHub</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn để mang lại trải nghiệm tốt nhất khi sử dụng dịch vụ.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <FaUserShield className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Vấn đề tài khoản</h3>
            <p className="text-gray-400 text-sm mb-4">
              Quên mật khẩu, không thể truy cập, và các vấn đề liên quan đến tài khoản.
            </p>
            <a href={mailtoLink} className="inline-flex items-center text-cyan-400 hover:text-cyan-300 text-sm font-medium">
              Liên hệ ngay <FaArrowRight className="w-3 h-3 ml-1" />
            </a>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-green-500/50 transition-all duration-300 hover:transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
              <FaHeadset className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Hỗ trợ kỹ thuật</h3>
            <p className="text-gray-400 text-sm mb-4">
              Sự cố khi xem phim, chất lượng video hoặc các lỗi khác khi sử dụng trang web.
            </p>
            <a href={mailtoLink} className="inline-flex items-center text-cyan-400 hover:text-cyan-300 text-sm font-medium">
              Liên hệ ngay <FaArrowRight className="w-3 h-3 ml-1" />
            </a>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <FaLightbulb className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Đóng góp ý kiến</h3>
            <p className="text-gray-400 text-sm mb-4">
              Chúng tôi trân trọng mọi ý kiến đóng góp để nâng cao chất lượng dịch vụ.
            </p>
            <a href={mailtoLink} className="inline-flex items-center text-cyan-400 hover:text-cyan-300 text-sm font-medium">
              Góp ý ngay <FaArrowRight className="w-3 h-3 ml-1" />
            </a>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-red-500/50 transition-all duration-300 hover:transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
              <FaEnvelope className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Chính sách riêng tư</h3>
            <p className="text-gray-400 text-sm mb-4">
              Mọi thắc mắc liên quan đến bảo mật thông tin và chính sách riêng tư.
            </p>
            <a href={mailtoLink2} className="inline-flex items-center text-cyan-400 hover:text-cyan-300 text-sm font-medium">
              Liên hệ ngay <FaArrowRight className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>

        {/* Email Contact Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-2xl p-8 border border-blue-500/20">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Thông Tin Liên Hệ Chính</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-lg font-semibold text-white mb-2">Email hỗ trợ khách hàng</h3>
                <a 
                  href={mailtoLink} 
                  className="inline-flex items-center justify-center md:justify-start text-cyan-400 hover:text-cyan-300 font-medium text-lg transition-colors duration-200"
                >
                  <FaEnvelope className="w-5 h-5 mr-2" />
                  lienhe@DiYfHub.com
                </a>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-lg font-semibold text-white mb-2">Email Chính sách riêng tư</h3>
                <a 
                  href={mailtoLink2} 
                  className="inline-flex items-center justify-center md:justify-start text-cyan-400 hover:text-cyan-300 font-medium text-lg transition-colors duration-200"
                >
                  <FaEnvelope className="w-5 h-5 mr-2" />
                  lienhe@DiYfHub.com
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Social Media Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Kết Nối Qua Mạng Xã Hội</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <a 
              href="#" 
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:transform hover:-translate-y-1 group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FaTiktok className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">TikTok</h3>
                  <p className="text-gray-400 text-sm">@diyfhub</p>
                </div>
              </div>
            </a>

            <a 
              href="#" 
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-600/50 transition-all duration-300 hover:transform hover:-translate-y-1 group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FaFacebook className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Facebook</h3>
                  <p className="text-gray-400 text-sm">DiYfHub Official</p>
                </div>
              </div>
            </a>

            <a 
              href="#" 
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-indigo-600/50 transition-all duration-300 hover:transform hover:-translate-y-1 group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FaDiscord className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Discord</h3>
                  <p className="text-gray-400 text-sm">DiYfHub Community</p>
                </div>
              </div>
            </a>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-2xl p-8 border border-purple-500/20">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaQuestionCircle className="w-8 h-8 text-purple-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Câu Hỏi Thường Gặp (F.A.Q)</h2>
              <p className="text-gray-300 mb-6">
                Trước khi gửi yêu cầu hỗ trợ, bạn có thể tham khảo trang F.A.Q để tìm câu trả lời nhanh cho các vấn đề phổ biến nhất.
              </p>
              <Link 
                to="/hoi-dap" 
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                <FaQuestionCircle className="w-5 h-5 mr-2" />
                Xem F.A.Q
              </Link>
            </div>
          </div>
        </section>

        {/* Footer Message */}
        <div className="text-center">
          <p className="text-gray-400 mb-4">
            Chúng tôi rất vui khi được hỗ trợ bạn và mong muốn mang đến trải nghiệm xem phim trực tuyến tốt nhất!
          </p>
          <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            DiYfHub - Cùng bạn khám phá thế giới giải trí đa dạng, an toàn và miễn phí!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Lienhe;
