import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";
import tiktok from "../../assets/tiktok.svg";
import facebook from "../../assets/facebook.svg";
import youtube from "../../assets/Youtube.svg";
import discord from "../../assets/discord.svg";

function footer() {

  return (
    <footer className="bg-[#121212] px-5 pb-6 pt-8 text-center md:text-left border-t border-gray-600">
      {/* Logo + tiêu đề + mạng xã hội*/}
      <div className="flex flex-col md:justify-start md:flex-row md:items-center mb-8 text-center md:text-left gap-6 justify-center">
        {/* logo + tiêu đề */}
        <a href="/">
          <div className="flex items-center justify-center md:justify-start">
            <img className="w-[60px]" src={logo} alt="Logo" />
            <div>
              <p className="font-['Inter-ExtraBold',Helvetica] font-extrabold text-white text-xl tracking-[1.00px]">
                DiYfHub
              </p>

              <p className="font-['Inter-Regular',Helvetica] font-normal text-[#b9b9b9] text-[10px] tracking-[0]">
                đắm mình vào bộ phim
              </p>
            </div>
          </div>
        </a>

        {/* Đường kẻ dọc */}
        <div className="hidden md:block h-10 border-l border-gray-600"></div>

        {/* Icon + mạng xã hội */}
        <div className="flex justify-center items-center space-x-3">
          <a
            href="https://www.tiktok.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-gray-600 rounded-full items-center justify-center flex"
          >
            <img className="w-6 invert" src={tiktok} alt="Tiktok" />
          </a>
          <a
            href="https://www.facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-gray-600 rounded-full items-center justify-center flex"
          >
            <img
              className="w-6 invert"
              src={facebook}
              alt="Facebook"
            />
          </a>
          <a
            href="https://www.youtube.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-gray-600 rounded-full items-center justify-center flex"
          >
            <img className="w-6 invert" src={youtube} alt="Youtube" />
          </a>
          <a
            href="https://discord.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-gray-600 rounded-full items-center justify-center flex"
          >
            <img className="w-6 invert" src={discord} alt="Discord" />
          </a>
        </div>
      </div>

      {/* Liên kết */}
      <div className="flex flex-wrap justify-center md:justify-start mb-4 text-white">
        <Link to="/hoi-dap" className="mr-6 text-[14px] hover:text-red-400">
          Hỏi đáp
        </Link>
        <Link to="/chinh-sach" className="mr-6 text-[14px] hover:text-red-400">
          Chính sách bảo mật
        </Link>
        <Link to="/dieu-khoan" className="mr-6 text-[14px] hover:text-red-400">
          Điều khoản sử dụng
        </Link>
        <Link to="/gioi-thieu" className="mr-6 text-[14px] hover:text-red-400">
          Giới thiệu
        </Link>
        <Link to="/lien-he" className="mr-6 text-[14px] hover:text-red-400">
          Liên hệ
        </Link>
      </div>

      {/* Mô tả */}
      <div className="leading-relaxed mb-2 max-w-[750px] w-full text-[#AAAA] text-[14px] mx-auto md:mx-0">
        <p>
          DiYfHub – Đắm mình vào bộ phim - Trang xem phim online chất lượng cao
          miễn phí Vietsub, thuyết minh, lồng tiếng full HD. Kho phim mới khổng
          lồ, phim chiếu rạp, phim bộ, phim lẻ từ nhiều quốc gia như Việt Nam,
          Hàn Quốc, Trung Quốc, Thái Lan, Nhật Bản, Âu Mỹ… đa dạng thể loại.
          Khám phá nền tảng phim trực tuyến hay nhất 2025 chất lượng 4K!
        </p>
      </div>

      {/* Bản quyền */}
      <div className="text-[#AAAA] text-[14px]">© 2025 DiYfhub</div>
    </footer>
  );
}

export default footer;
