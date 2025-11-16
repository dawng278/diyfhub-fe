import React, { useRef } from 'react';
import { FaQuestionCircle, FaPlayCircle, FaMoneyBillWave, FaFilm, FaTachometerAlt, FaTv, FaClosedCaptioning, FaAd, FaGlobe, FaTheaterMasks, FaSync, FaVideo, FaPalette, FaSearch, FaDesktop, FaMicrophone, FaStar, FaCheckCircle, FaUserShield, FaEnvelope, FaArrowRight, FaChevronDown } from 'react-icons/fa';

function Hoidap() {
  const q1Ref = useRef(null);
  const q2Ref = useRef(null);
  const q3Ref = useRef(null);
  const q4Ref = useRef(null);
  const q5Ref = useRef(null);
  const q6Ref = useRef(null);
  const q7Ref = useRef(null);
  const q8Ref = useRef(null);
  const q9Ref = useRef(null);
  const q10Ref = useRef(null);
  const q11Ref = useRef(null);
  const q12Ref = useRef(null);
  const q13Ref = useRef(null);
  const q14Ref = useRef(null);
  const q15Ref = useRef(null);
  const q16Ref = useRef(null);
  const q17Ref = useRef(null);
  const q18Ref = useRef(null);
  const q19Ref = useRef(null);
  const q20Ref = useRef(null);

  const handleScrollTo = (ref) => {
    ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const faqCategories = [
    {
      icon: FaPlayCircle,
      color: 'red',
      questions: [
        { ref: q1Ref, text: 'DiYfHub là gì và có những đặc điểm nổi bật nào?' },
        { ref: q2Ref, text: 'DiYfHub có miễn phí hoàn toàn không?' },
        { ref: q3Ref, text: 'DiYfHub có bao gồm các bộ phim chiếu rạp không?' },
      ]
    },
    {
      icon: FaTachometerAlt,
      color: 'blue',
      questions: [
        { ref: q4Ref, text: 'Tốc độ tải phim trên DiYfHub như thế nào?' },
        { ref: q5Ref, text: 'Chất lượng phim trên DiYfHub có tốt không?' },
        { ref: q6Ref, text: 'DiYfHub có thể xem trên các thiết bị nào?' },
      ]
    },
    {
      icon: FaClosedCaptioning,
      color: 'green',
      questions: [
        { ref: q7Ref, text: 'DiYfHub có hỗ trợ thuyết minh và phụ đề không?' },
        { ref: q8Ref, text: 'DiYfHub có quảng cáo trong quá trình xem phim không?' },
        { ref: q9Ref, text: 'Có thể tìm thấy phim của những quốc gia nào trên DiYfHub?' },
      ]
    },
    {
      icon: FaTheaterMasks,
      color: 'purple',
      questions: [
        { ref: q10Ref, text: 'Những thể loại phim nào phổ biến nhất trên DiYfHub?' },
        { ref: q11Ref, text: 'DiYfHub có cập nhật phim mới không?' },
        { ref: q12Ref, text: 'DiYfHub có phim lẻ và phim bộ không?' },
      ]
    },
    {
      icon: FaPalette,
      color: 'yellow',
      questions: [
        { ref: q13Ref, text: 'DiYfHub có hỗ trợ phim hoạt hình không?' },
        { ref: q14Ref, text: 'Có thể tìm kiếm phim dễ dàng trên DiYfHub không?' },
        { ref: q15Ref, text: 'DiYfHub có cung cấp phim 4K không?' },
      ]
    },
    {
      icon: FaMicrophone,
      color: 'indigo',
      questions: [
        { ref: q16Ref, text: 'DiYfHub có hỗ trợ lồng tiếng giọng địa phương không?' },
        { ref: q17Ref, text: 'DiYfHub có các bộ phim được xem nhiều nhất không?' },
        { ref: q18Ref, text: 'Tại sao nên chọn DiYfHub thay vì các trang web khác?' },
      ]
    },
    {
      icon: FaUserShield,
      color: 'pink',
      questions: [
        { ref: q19Ref, text: 'Có cần đăng ký tài khoản để xem phim trên DiYfHub không?' },
        { ref: q20Ref, text: 'DiYfHub có bảo vệ quyền riêng tư cho người dùng không?' },
      ]
    }
  ];

  const answers = [
    {
      ref: q1Ref,
      question: 'DiYfHub là gì và có những đặc điểm nổi bật nào?',
      answer: 'DiYfHub là một trang web xem phim online miễn phí tại Việt Nam, cung cấp kho phim chất lượng HD và 4K, không quảng cáo và có tốc độ tải mượt mà. Trang web này có giao diện thân thiện với người dùng và thường xuyên cập nhật các bộ phim mới nhất từ nhiều quốc gia.',
      icon: FaPlayCircle,
      color: 'red'
    },
    {
      ref: q2Ref,
      question: 'DiYfHub có miễn phí hoàn toàn không?',
      answer: 'DiYfHub hoàn toàn miễn phí. Người dùng không cần trả phí hay đăng ký tài khoản để xem phim, giúp khán giả thoải mái lựa chọn và trải nghiệm hàng ngàn bộ phim chất lượng cao mà không tốn bất kỳ khoản phí nào.',
      icon: FaMoneyBillWave,
      color: 'green'
    },
    {
      ref: q3Ref,
      question: 'DiYfHub có bao gồm các bộ phim chiếu rạp không?',
      answer: 'DiYfHub cung cấp nhiều bộ phim chiếu rạp đình đám từ Việt Nam và quốc tế. Các bộ phim này được cập nhật nhanh chóng để đáp ứng nhu cầu xem phim của khán giả.',
      icon: FaFilm,
      color: 'blue'
    },
    {
      ref: q4Ref,
      question: 'Tốc độ tải phim trên DiYfHub như thế nào?',
      answer: 'DiYfHub có tốc độ tải nhanh, ổn định nhờ hệ thống máy chủ hiện đại, giúp người xem trải nghiệm phim online mà không bị gián đoạn bởi tình trạng chậm hoặc lag.',
      icon: FaTachometerAlt,
      color: 'yellow'
    },
    {
      ref: q5Ref,
      question: 'Chất lượng phim trên DiYfHub có tốt không?',
      answer: 'DiYfHub cung cấp chất lượng phim từ HD đến 4K, giúp người dùng thưởng thức hình ảnh sắc nét, sống động và chân thực nhất có thể.',
      icon: FaDesktop,
      color: 'purple'
    },
    {
      ref: q6Ref,
      question: 'DiYfHub có thể xem trên các thiết bị nào?',
      answer: 'DiYfHub có thể được truy cập trên các thiết bị như máy tính, điện thoại di động và máy tính bảng, giúp người dùng xem phim mọi lúc, mọi nơi.',
      icon: FaTv,
      color: 'indigo'
    },
    {
      ref: q7Ref,
      question: 'DiYfHub có hỗ trợ thuyết minh và phụ đề không?',
      answer: 'Có, DiYfHub hỗ trợ nhiều tùy chọn thuyết minh và phụ đề đa ngôn ngữ, phù hợp với nhu cầu của đa dạng người xem và giúp cải thiện khả năng học ngoại ngữ.',
      icon: FaClosedCaptioning,
      color: 'green'
    },
    {
      ref: q8Ref,
      question: 'DiYfHub có quảng cáo trong quá trình xem phim không?',
      answer: 'DiYfHub hoàn toàn không có quảng cáo trong quá trình xem phim, giúp khán giả tận hưởng phim liền mạch mà không bị gián đoạn.',
      icon: FaAd,
      color: 'red'
    },
    {
      ref: q9Ref,
      question: 'Có thể tìm thấy phim của những quốc gia nào trên DiYfHub?',
      answer: 'DiYfHub cung cấp phim từ nhiều quốc gia, bao gồm Việt Nam, Hàn Quốc, Trung Quốc, Nhật Bản, Thái Lan, Âu Mỹ và nhiều quốc gia khác, với đa dạng thể loại cho người xem lựa chọn.',
      icon: FaGlobe,
      color: 'blue'
    },
    {
      ref: q10Ref,
      question: 'Những thể loại phim nào phổ biến nhất trên DiYfHub?',
      answer: 'Các thể loại phim được yêu thích trên DiYfHub gồm: hành động, tình cảm, khoa học viễn tưởng, cổ trang, hoạt hình, kinh dị, võ thuật và tâm lý. DiYfHub có kho phim phong phú đáp ứng sở thích của mọi đối tượng khán giả.',
      icon: FaTheaterMasks,
      color: 'purple'
    },
    {
      ref: q11Ref,
      question: 'DiYfHub có cập nhật phim mới không?',
      answer: 'Có, DiYfHub cập nhật các bộ phim mới liên tục 24/24, đảm bảo người dùng không bỏ lỡ các bộ phim hot nhất từ các rạp chiếu hay trên truyền hình.',
      icon: FaSync,
      color: 'green'
    },
    {
      ref: q12Ref,
      question: 'DiYfHub có phim lẻ và phim bộ không?',
      answer: 'Đúng vậy, DiYfHub cung cấp cả phim lẻ và phim bộ, bao gồm các bộ phim truyền hình dài tập và phim điện ảnh nổi tiếng từ nhiều quốc gia.',
      icon: FaVideo,
      color: 'yellow'
    },
    {
      ref: q13Ref,
      question: 'DiYfHub có hỗ trợ phim hoạt hình không?',
      answer: 'Có, DiYfHub có một kho phim hoạt hình phong phú, bao gồm các phim hoạt hình nổi tiếng từ Âu Mỹ và phim anime Nhật Bản, phục vụ cả trẻ em lẫn người lớn.',
      icon: FaPalette,
      color: 'pink'
    },
    {
      ref: q14Ref,
      question: 'Có thể tìm kiếm phim dễ dàng trên DiYfHub không?',
      answer: 'Giao diện của DiYfHub được thiết kế thân thiện và tối ưu, giúp người dùng dễ dàng tìm kiếm phim theo tên phim, thể loại, quốc gia và các danh mục khác.',
      icon: FaSearch,
      color: 'indigo'
    },
    {
      ref: q15Ref,
      question: 'DiYfHub có cung cấp phim 4K không?',
      answer: 'DiYfHub là một trong số ít trang web tại Việt Nam cung cấp các bộ phim chất lượng 4K, giúp người xem trải nghiệm hình ảnh sắc nét như tại rạp chiếu phim.',
      icon: FaDesktop,
      color: 'blue'
    },
    {
      ref: q16Ref,
      question: 'DiYfHub có hỗ trợ lồng tiếng giọng địa phương không?',
      answer: 'DiYfHub cung cấp tùy chọn lồng tiếng giọng miền Bắc, Trung và Nam, giúp người xem dễ dàng lựa chọn theo sở thích cá nhân.',
      icon: FaMicrophone,
      color: 'green'
    },
    {
      ref: q17Ref,
      question: 'DiYfHub có các bộ phim được xem nhiều nhất không?',
      answer: 'DiYfHub thường xuyên cập nhật danh sách những bộ phim được xem nhiều nhất, bao gồm cả phim hot trong nước và phim nổi tiếng quốc tế, giúp người xem dễ dàng lựa chọn những bộ phim thịnh hành.',
      icon: FaStar,
      color: 'yellow'
    },
    {
      ref: q18Ref,
      question: 'Tại sao nên chọn DiYfHub thay vì các trang web khác?',
      answer: 'DiYfHub không chỉ miễn phí, không quảng cáo, mà còn có kho phim phong phú với chất lượng HD và 4K. Tốc độ tải nhanh và giao diện dễ sử dụng là những ưu điểm khiến DiYfHub trở thành lựa chọn hàng đầu cho người yêu thích phim online.',
      icon: FaCheckCircle,
      color: 'purple'
    },
    {
      ref: q19Ref,
      question: 'Có cần đăng ký tài khoản để xem phim trên DiYfHub không?',
      answer: 'Người dùng không cần đăng ký tài khoản mà vẫn có thể xem phim thoải mái. DiYfHub giúp tối ưu hóa trải nghiệm người dùng, không cần thông tin đăng nhập.',
      icon: FaUserShield,
      color: 'indigo'
    },
    {
      ref: q20Ref,
      question: 'DiYfHub có bảo vệ quyền riêng tư cho người dùng không?',
      answer: 'DiYfHub đảm bảo quyền riêng tư của người dùng, không yêu cầu cung cấp thông tin cá nhân và không sử dụng dữ liệu của người dùng cho các mục đích quảng cáo.',
      icon: FaUserShield,
      color: 'red'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-blue-600/20"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center">
                <FaQuestionCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Câu Hỏi Thường Gặp
              <span className="block text-red-500">DiYfHub</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Tìm câu trả lời cho mọi thắc mắc của bạn về DiYfHub. 
              Khám phá các câu hỏi được người dùng quan tâm nhất và tìm hiểu thêm về nền tảng xem phim miễn phí hàng đầu.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* FAQ Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {faqCategories.map((category, index) => (
            <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 hover:border-gray-600/50 transition-colors duration-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-12 h-12 bg-${category.color}-500/20 rounded-lg flex items-center justify-center`}>
                  <category.icon className={`w-6 h-6 text-${category.color}-500`} />
                </div>
                <h3 className="text-lg font-semibold text-white">Danh mục {index + 1}</h3>
              </div>
              <ul className="space-y-2">
                {category.questions.map((q, qIndex) => (
                  <li key={qIndex}>
                    <button
                      onClick={() => handleScrollTo(q.ref)}
                      className="text-left text-gray-300 hover:text-red-400 transition-colors duration-200 text-sm flex items-center group"
                    >
                      <FaChevronDown className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {q.text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="relative mb-16">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center">
          </div>
        </div>

        {/* Answers Section */}
        <div className="space-y-8">
          {answers.map((answer, index) => (
            <section key={index} ref={answer.ref} className="scroll-mt-24">
              <div className="bg-gradient-to-r from-gray-800/30 to-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 hover:border-gray-600/50 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className={`w-14 h-14 bg-${answer.color}-500/20 rounded-xl flex items-center justify-center shrink-0`}>
                    <answer.icon className={`w-7 h-7 text-${answer.color}-500`} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-4">
                      {index + 1}. {answer.question}
                    </h2>
                    <p className="text-gray-300 leading-relaxed">
                      {answer.answer}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Contact Section */}
        <section className="mt-20 mb-16">
          <div className="bg-gradient-to-r from-red-600/10 to-blue-600/10 rounded-2xl p-8 border border-red-500/20 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaEnvelope className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Không tìm thấy câu trả lời?</h2>
            <p className="text-gray-300 mb-6">
              Nếu bạn có câu hỏi nào khác chưa được trả lời, đừng ngần ngại liên hệ với chúng tôi!
            </p>
            <a
              href="mailto:support@diyfhub.com"
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              <FaEnvelope className="w-5 h-5 mr-2" />
              Liên hệ hỗ trợ
              <FaArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </section>

        {/* Footer Message */}
        <div className="text-center">
          <p className="text-gray-400 mb-4">
            Cảm ơn bạn đã quan tâm đến DiYfHub. Chúng tôi luôn sẵn sàng hỗ trợ bạn!
          </p>
          <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-blue-500">
            DiYfHub - Nền tảng xem phim miễn phí và an toàn cho mọi người!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Hoidap;