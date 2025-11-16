import React from 'react';
import { FaFileContract, FaUserShield, FaBan, FaLock, FaTools, FaExclamationTriangle, FaSync, FaEnvelope, FaArrowRight } from 'react-icons/fa';

function Dieukhoan() {
  const email = "BinN63342@gmail.com";
  const subject = "Yêu cầu hỗ trợ về điều khoản";
  const body = "Xin chào, \n\n Tôi cần giúp đỡ về";

  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-blue-600/20"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center">
                <FaFileContract className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Điều Khoản Sử Dụng
              <span className="block text-red-500">DiYfHub</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Chào mừng bạn đến với DiYfHub – nền tảng xem phim trực tuyến miễn phí hàng đầu. 
              Vui lòng đọc kỹ các điều khoản để hiểu rõ quyền và nghĩa vụ của bạn.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Terms Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Section 1: Chấp Nhận Điều Khoản */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-red-500/50 transition-all duration-300">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaUserShield className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-3">1. Chấp Nhận Điều Khoản Sử Dụng</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Khi sử dụng dịch vụ của DiYfHub, bạn chấp nhận rằng bạn đã đọc, hiểu và đồng ý với các điều khoản sử dụng này. 
                  Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không tiếp tục truy cập hoặc sử dụng DiYfHub.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Đăng Ký Tài Khoản */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-green-500/50 transition-all duration-300">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaUserShield className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-3">2. Đăng Ký Tài Khoản</h2>
                <p className="text-gray-400 text-sm mb-3">Khi đăng ký tài khoản tại DiYfHub, bạn cam kết:</p>
                <ul className="text-gray-400 text-sm space-y-2 list-disc pl-5">
                  <li>Cung cấp thông tin chính xác, đầy đủ và luôn cập nhật</li>
                  <li>Bảo mật thông tin đăng nhập của mình</li>
                  <li>Không sử dụng tài khoản để vi phạm pháp luật</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3: Hành Vi Bị Cấm */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-yellow-500/50 transition-all duration-300">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaBan className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-3">3. Hành Vi Bị Cấm</h2>
                <p className="text-gray-400 text-sm mb-3">Khi sử dụng DiYfHub, bạn đồng ý không:</p>
                <ul className="text-gray-400 text-sm space-y-2 list-disc pl-5">
                  <li>Đăng tải nội dung vi phạm quyền sở hữ trí tuệ</li>
                  <li>Gây hại cho hệ thống hoặc truy cập trái phép</li>
                  <li>Sử dụng với mục đích thương mại không có sự đồng ý</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 4: Bảo Mật Thông Tin */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaLock className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-3">4. Bảo Mật Thông Tin</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  DiYfHub cam kết bảo vệ thông tin cá nhân của bạn. 
                  Vui lòng tham khảo Chính Sách Riêng Tư của chúng tôi để hiểu rõ cách chúng tôi thu thập, 
                  sử dụng và bảo mật thông tin cá nhân của bạn.
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: Quyền Thay Đổi Dịch Vụ */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaTools className="w-6 h-6 text-cyan-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-3">5. Quyền Thay Đổi Dịch Vụ</h2>
                <p className="text-gray-400 text-sm mb-3">DiYfHub có quyền:</p>
                <ul className="text-gray-400 text-sm space-y-2 list-disc pl-5">
                  <li>Thay đổi, cập nhật hoặc ngừng cung cấp dịch vụ</li>
                  <li>Xóa bỏ hoặc tạm ngừng tài khoản vi phạm</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 6: Miễn Trừ Trách Nhiệm */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-orange-500/50 transition-all duration-300">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaExclamationTriangle className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-3">6. Miễn Trừ Trách Nhiệm</h2>
                <p className="text-gray-400 text-sm mb-3">Chúng tôi không chịu trách nhiệm về:</p>
                <ul className="text-gray-400 text-sm space-y-2 list-disc pl-5">
                  <li>Bất kỳ gián đoạn nào trong quá trình truy cập</li>
                  <li>Nội dung do bên thứ ba cung cấp</li>
                  <li>Các thiệt hại gián tiếp hoặc hậu quả</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Section 7: Thay Đổi Điều Khoản */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-2xl p-8 border border-indigo-500/20">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaSync className="w-6 h-6 text-indigo-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">7. Thay Đổi Điều Khoản Sử Dụng</h2>
                <p className="text-gray-300 text-sm leading-relaxed">
                  DiYfHub có quyền thay đổi, cập nhật hoặc sửa đổi các điều khoản sử dụng này bất cứ lúc nào. 
                  Mọi thay đổi sẽ có hiệu lực ngay khi được đăng tải trên nền tảng. 
                  Việc bạn tiếp tục sử dụng dịch vụ sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận các điều khoản đã được cập nhật.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-red-600/10 to-blue-600/10 rounded-2xl p-8 border border-red-500/20">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaEnvelope className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">8. Liên Hệ</h2>
              <p className="text-gray-300 mb-6">
                Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào liên quan đến các điều khoản sử dụng, 
                vui lòng liên hệ với chúng tôi qua email:
              </p>
              <a
                href={mailtoLink}
                className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                <FaEnvelope className="w-5 h-5 mr-2" />
                lienhe@DiYfHub.com
                <FaArrowRight className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>
        </section>

        {/* Footer Message */}
        <div className="text-center">
          <p className="text-gray-400 mb-4">
            Cảm ơn bạn đã đọc kỹ các điều khoản sử dụng của DiYfHub.
          </p>
          <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-blue-500">
            DiYfHub - Nền tảng xem phim miễn phí và an toàn cho mọi người!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dieukhoan;
