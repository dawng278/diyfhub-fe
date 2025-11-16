import React from 'react';
import { Link } from 'react-router-dom';

function Chinhsach() {
  const email = "BinN63342@gmail.com";
  const subject = "Yêu cầu hỗ trợ về chính sách và quyền riêng tư";
  const body = "Xin chào, \n\n Tôi cần giúp đỡ về";

  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-blue-600/20"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Bảo Mật &
              <span className="block text-red-500">Chính Sách Riêng Tư</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Tại DiYfHub, chúng tôi cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn khi bạn truy cập và sử dụng trang web của chúng tôi.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Information Collection */}
        <section className="mb-16">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Thông Tin Chúng Tôi Thu Thập</h2>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Để cung cấp và cải thiện dịch vụ, DiYfHub thu thập thông tin từ người dùng thông qua nhiều hình thức:
            </p>
            <div className="bg-blue-900/20 rounded-lg p-6 border border-blue-700/50">
              <h3 className="text-lg font-semibold text-blue-400 mb-3">Thông Tin Cá Nhân</h3>
              <p className="text-gray-300">
                Khi bạn đăng ký tài khoản, nhận bản tin, hoặc liên hệ với chúng tôi, chúng tôi có thể thu thập các thông tin như tên, địa chỉ email, số điện thoại và các thông tin khác mà bạn cung cấp.
              </p>
            </div>
          </div>
        </section>

        {/* Purpose of Use */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Mục Đích Sử Dụng Thông Tin</h2>
            <p className="text-gray-400 text-lg">Thông tin được thu thập được sử dụng để:</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-900/30 to-green-800/30 rounded-xl p-6 border border-green-700/50">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-green-400">Cung Cấp Dịch Vụ</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Sử dụng thông tin để cung cấp và duy trì các dịch vụ của DiYfHub, xử lý các yêu cầu và nâng cao trải nghiệm người dùng.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 rounded-xl p-6 border border-blue-700/50">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-blue-400">Giao Tiếp với Người Dùng</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Gửi các thông báo, bản tin, cập nhật liên quan đến dịch vụ của chúng tôi. Người dùng có thể từ chối nhận các thông tin này bất kỳ lúc nào.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 rounded-xl p-6 border border-purple-700/50">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-purple-400">Phân Tích và Cải Thiện</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Sử dụng thông tin phi cá nhân để hiểu rõ hơn về hành vi của người dùng và nâng cao chất lượng trang web, sản phẩm, và dịch vụ.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-red-900/30 to-red-800/30 rounded-xl p-6 border border-red-700/50">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-400">Bảo Mật</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Áp dụng các biện pháp để bảo vệ trang web và người dùng khỏi các hành vi gian lận, đảm bảo an toàn thông tin và tuân thủ các yêu cầu pháp lý.
              </p>
            </div>
          </div>
        </section>

        {/* Information Sharing */}
        <section className="mb-16">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m0 0A9.001 9.001 0 0012 21c4.474 0 8.268-3.12 9.032-7.326" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Chia Sẻ Thông Tin</h2>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              DiYfHub cam kết không bán, trao đổi hoặc chia sẻ thông tin cá nhân của bạn với bất kỳ bên thứ ba nào, ngoại trừ trong các trường hợp sau:
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-3 h-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Với Sự Đồng Ý Của Bạn</h4>
                  <p className="text-gray-400 text-sm">Chúng tôi chỉ chia sẻ thông tin cá nhân khi có sự đồng ý rõ ràng của bạn.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-3 h-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Đối Tác và Nhà Cung Cấp Dịch Vụ</h4>
                  <p className="text-gray-400 text-sm">Chia sẻ thông tin với các đối tác và nhà cung cấp dịch vụ tin cậy để hỗ trợ trong việc cung cấp dịch vụ, xử lý thanh toán, và phân tích dữ liệu.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-3 h-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Tuân Thủ Pháp Luật</h4>
                  <p className="text-gray-400 text-sm">DiYfHub có thể tiết lộ thông tin cá nhân nếu được yêu cầu theo quy định pháp luật hoặc để bảo vệ quyền lợi, tài sản và an toàn của công ty và người dùng.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Measures */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-2xl p-8 lg:p-12 border border-gray-700">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Bảo Mật Thông Tin Cá Nhân</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức để bảo vệ thông tin cá nhân của bạn khỏi việc mất mát, lạm dụng, truy cập trái phép, tiết lộ và thay đổi. DiYfHub cam kết liên tục cải tiến các biện pháp bảo mật để bảo vệ thông tin của bạn.
              </p>
            </div>
          </div>
        </section>

        {/* User Rights */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Quyền Riêng Tư của Người Dùng</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">
                      <span className="font-semibold text-white">Truy cập và chỉnh sửa:</span> Truy cập, chỉnh sửa và xóa thông tin cá nhân của mình mà chúng tôi lưu giữ.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">
                      <span className="font-semibold text-white">Từ chối thông báo:</span> Từ chối nhận thông báo từ DiYfHub bất kỳ lúc nào.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Cookies và Công Nghệ Tương Tự</h3>
              <p className="text-gray-300 text-sm mb-4">
                DiYfHub sử dụng cookies và các công nghệ tương tự để thu thập thông tin phi cá nhân về cách bạn sử dụng trang web.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="text-gray-400 text-sm">Cải thiện trải nghiệm người dùng</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="text-gray-400 text-sm">Phân tích lưu lượng truy cập</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="text-gray-400 text-sm">Cung cấp quảng cáo phù hợp</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Policy Changes */}
        <section className="mb-16">
          <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-yellow-400">Thay Đổi Chính Sách Riêng Tư</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              DiYfHub có thể cập nhật Chính Sách Riêng Tư này để phù hợp với các quy định và chính sách nội bộ mới. Mọi thay đổi sẽ được thông báo trên trang web và có hiệu lực ngay khi được đăng tải.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="text-center">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-6">Liên Hệ Với Chúng Tôi</h2>
            <p className="text-gray-300 mb-8 text-lg">
              Nếu có bất kỳ câu hỏi hoặc yêu cầu nào liên quan đến Chính Sách Riêng Tư này, vui lòng liên hệ với chúng tôi:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href={mailtoLink}
                className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors duration-200"
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

export default Chinhsach
