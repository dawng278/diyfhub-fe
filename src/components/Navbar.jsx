import React from 'react'
import logo from '../assets/logo.svg'
import searchNormal from '../assets/search-normal.svg'
import arrowDown from '../assets/arrow-down.svg'
import user from '../assets/user.svg'

function navbar() {
    const navigationItems = [
        { label: "Phim lẻ", hasDropdown: false },
        { label: "Phim bộ", hasDropdown: false },
        { label: "Thể loại", hasDropdown: true },
        { label: "Quốc gia", hasDropdown: true },
        { label: "Thêm", hasDropdown: true },
    ];

    return (
        <header className="w-[1440px] h-[50px] flex" role="banner">
            <div className="mt-[7px] w-[150px] h-[35px] relative ml-5">
                <a
                    href="/"
                    aria-label="DiYfHub - Trang chủ"
                    className="block w-full h-full"
                >
                    <img
                        className="absolute top-0 left-0 w-[38px] h-[34px] aspect-[1.12] object-cover"
                        alt="DiYfHub Logo"
                        src={logo}
                    />

                    <div className="absolute top-0.5 left-[41px] w-[98px] [font-family:'Inter-ExtraBold',Helvetica] font-extrabold text-white text-xl tracking-[1.00px] leading-[normal] whitespace-nowrap">
                        DiYfHub
                    </div>

                    <p className="absolute top-[23px] left-[42px] w-[108px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#b9b9b9] text-[10px] tracking-[0] leading-[normal] whitespace-nowrap">
                        đắm mình vào bộ phim
                    </p>
                </a>
            </div>

            <div className="mt-[13px] w-[352px] h-[29px] relative ml-[63px] bg-[#83838380] rounded-[3px] overflow-hidden">
                <label htmlFor="search-input" className="sr-only">
                    Tìm kiếm phim, diễn viên
                </label>
                <img
                    className="absolute w-[3.12%] h-[41.38%] top-[31.03%] left-[3.60%] pointer-events-none"
                    alt=""
                    src={searchNormal}
                    aria-hidden="true"
                />

                <input
                    id="search-input"
                    type="search"
                    placeholder="Tìm kiếm phim, diễn viên"
                    className="absolute top-[7px] left-10 w-[calc(100%-40px)] h-[15px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#c4c4c4] text-xs tracking-[0] leading-[normal] bg-transparent border-0 outline-none focus:text-white"
                    aria-label="Tìm kiếm phim, diễn viên"
                />
            </div>

            <nav
                className="mt-4 w-[378px] ml-[63px] flex gap-5"
                role="navigation"
                aria-label="Điều hướng chính"
            >
                {navigationItems.map((item, index) => {
                    if (!item.hasDropdown) {
                        return (
                            <a
                                key={index}
                                href={`/${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                                className={`${index === 0 ? "mt-[3px]" : index === 1 ? "mt-1" : ""} ${index === 0 ? "w-11" : index === 1 ? "w-[47px]" : "w-[69px]"} h-${index < 2 ? "3" : "6"} [font-family:'Inter-Regular',Helvetica] font-normal text-white text-xs tracking-[0] leading-[normal] whitespace-nowrap hover:opacity-80 transition-opacity`}
                            >
                                {item.label}
                            </a>
                        );
                    }

                    return (
                        // Giữ container bên ngoài để kiểm soát kích thước (69px x 24px)
                        <div key={index} className="w-[69px] h-6">
                            <button
                                // Biến button thành flex container
                                // - items-center: Căn giữa con theo chiều dọc
                                // - justify-between: Đẩy 2 con ra 2 phía (text bên trái, arrow bên phải)
                                // - w-full h-full: Lấp đầy div cha
                                // - px-1: Thêm một chút đệm ngang
                                className="flex items-center justify-between w-full h-full px-1 text-left [font-family:'Inter-Regular',Helvetica] font-normal text-white text-xs tracking-[0] leading-[normal] whitespace-nowrap hover:opacity-80 transition-opacity"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
                                {/* 1. Phần văn bản */}
                                <span>
                                    {item.label}
                                </span>

                                {/* 2. Hình ảnh mũi tên */}
                                <img
                                    // h-1.5 (6px) tương đương 25% của h-6 (24px)
                                    // w-auto để giữ đúng tỷ lệ
                                    className="w-auto h-1.5"
                                    alt=""
                                    src={arrowDown}
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
                    );
                })}
            </nav>

            <div className="mt-[13px] w-[100px] h-[29px] ml-[287px] flex rounded-[15px] overflow-hidden border border-solid border-[#ea2121]">
                <a
                    href="/membership"
                    className="mt-[9px] w-[62px] h-[11px] ml-[19px] relative flex items-center hover:opacity-80 transition-opacity"
                    aria-label="Đăng ký thành viên"
                >
                    <div
                        className="absolute w-[17.74%] h-full top-0 left-0"
                        aria-hidden="true"
                    >
                        <img
                            className="absolute w-[auto] h-[auto] top-0"
                            alt=""
                            src={user}
                        />
                    </div>

                    <span className="absolute top-px left-4 w-[46px] [font-family:'Inter-Regular',Helvetica] font-normal text-white text-[8px] tracking-[0.24px] leading-[normal]">
                        Thành viên
                    </span>
                </a>
            </div>
        </header>
    )
}

export default navbar