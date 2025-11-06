import React, { useState, useEffect } from 'react' // Thêm useEffect
import logo from '/diyfhub-project/diyfhub-fe/src/assets/logo.svg'
import searchNormal from '/diyfhub-project/diyfhub-fe/src/assets/search-normal.svg'
import arrowDown from '/diyfhub-project/diyfhub-fe/src/assets/arrow-down.svg'
import user from '/diyfhub-project/diyfhub-fe/src/assets/user.svg'

// --- Icons cho menu Mobile (Hamburger và Close) ---
const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
// ---------------------------------------------------

function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // 1. (Từ bản "chuẩn") Tự động khóa scroll của trang khi menu mobile mở
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMobileMenuOpen]);

    const navigationItems = [
        { label: "Phim lẻ", hasDropdown: false },
        { label: "Phim bộ", hasDropdown: false },
        { label: "Thể loại", hasDropdown: true },
        { label: "Quốc gia", hasDropdown: true },
        { label: "Thêm", hasDropdown: true },
    ];

    return (
        // 2. (Gộp) Header dính (sticky) VÀ trong suốt (bg-transparent)
        // Thêm transition-colors để đổi màu nền mượt mà khi menu mở
        <header
            className={`w-full sticky top-0 z-50 border-b border-gray-800 transition-colors duration-300
                ${isMobileMenuOpen ? 'bg-[#0B0B0B]' : 'bg-transparent'}
            `}
            role="banner"
        >
            {/* 3. (Từ bản "chuẩn") Dùng h-[50px] mobile, lg:h-[60px] desktop */}
            <div className="w-full max-w-[1440px] h-[50px] lg:h-[60px] flex items-center justify-between mx-auto px-4 lg:px-6">

                {/* ======================================= */}
                {/* === GIAO DIỆN DESKTOP (lg:) === */}
                {/* ======================================= */}
                {/* 4. (Từ bản "chuẩn") Dùng `lg:` breakpoint */}
                <div className="hidden lg:flex items-center gap-10 flex-1">
                    {/* Logo (Desktop) */}
                    <div className="w-[150px] h-[35px] relative flex-shrink-0">
                        <a href="/" aria-label="DiYfHub - Trang chủ" className="block w-full h-full">
                            <img
                                className="absolute top-0 left-0 w-[38px] h-[34px] object-cover"
                                alt="DiYfHub Logo"
                                src={logo}
                            />
                            <div className="absolute top-0.5 left-[41px] [font-family:'Inter-ExtraBold',Helvetica] font-extrabold text-white text-xl">
                                DiYfHub
                            </div>
                            <p className="absolute top-[23px] left-[42px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#b9b9b9] text-[10px]">
                                đắm mình vào bộ phim
                            </p>
                        </a>
                    </div>

                    {/* Search (Desktop) */}
                    {/* 5. (Gộp) Dùng h-[36px] cho đồng bộ với nút "Thành viên" mới của bạn */}
                    <div className="w-full max-w-[352px] h-[36px] relative bg-[#83838380] rounded-[3px]">
                        <label htmlFor="search-input-desktop" className="sr-only">Tìm kiếm</label>
                        <img
                            className="absolute w-3.5 h-3.5 top-1/2 left-3 -translate-y-1/2 pointer-events-none"
                            alt="" src={searchNormal} aria-hidden="true"
                        />
                        <input
                            id="search-input-desktop"
                            type="search"
                            placeholder="Tìm kiếm phim, diễn viên"
                            className="w-full h-full text-sm [font-family:'Inter-Regular',Helvetica] font-normal text-[#c4c4c4] bg-transparent border-0 outline-none focus:text-white pl-10 pr-3"
                        />
                    </div>

                    {/* Navigation (Desktop) - Giữ nguyên text-xs từ code của bạn */}
                    <nav
                        className="flex flex-1 items-center gap-6"
                        role="navigation"
                        aria-label="Điều hướng chính"
                    >
                        {navigationItems.map((item) => (
                            <div key={item.label} className="flex-shrink-0">
                                {!item.hasDropdown ? (
                                    <a
                                        href={`/${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                                        className="[font-family:'Inter-Regular',Helvetica] font-normal text-white text-xs hover:opacity-80 transition-opacity"
                                    >
                                        {item.label}
                                    </a>
                                ) : (
                                    <button
                                        className="flex items-center gap-1.5 text-left [font-family:'Inter-Regular',Helvetica] font-normal text-white text-xs hover:opacity-80 transition-opacity"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                    >
                                        <span>{item.label}</span>
                                        <img className="w-auto h-1.5" alt="" src={arrowDown} aria-hidden="true" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>

                {/* 6. (Gộp) "Thành viên" (Desktop) - Dùng style mới của bạn */}
                <div className="hidden lg:flex w-[116px] h-[36px] rounded-[15px] border border-solid border-[#ea2121]">
                    <a
                        href="/membership"
                        className="flex items-center justify-center w-full h-full gap-1.5 hover:opacity-80 transition-opacity"
                        aria-label="Đăng ký thành viên"
                    >
                        {/* Dùng h-[11px] từ code của bạn */}
                        <img className="w-auto h-[11px]" alt="" src={user} aria-hidden="true" />
                        {/* Dùng font-bold text-[10px] từ code của bạn */}
                        <span className="[font-family:'Inter-Regular',Helvetica] font-bold text-white text-[10px] tracking-[0.24px] leading-[normal]">
                            Thành viên
                        </span>
                    </a>
                </div>

                {/* ======================================= */}
                {/* === GIAO DIỆN MOBILE (Base) === */}
                {/* ======================================= */}
                {/* 7. (Từ bản "chuẩn") Chỉ hiện trên mobile (flex), ẩn trên desktop (lg:hidden) */}

                {/* Logo (Mobile) */}
                <div className="flex-1 lg:hidden">
                    <a href="/" aria-label="DiYfHub - Trang chủ" className="block w-[120px] h-[35px] relative">
                        <img
                            className="absolute top-0 left-0 w-[38px] h-[34px] object-cover"
                            alt="DiYfHub Logo"
                            src={logo}
                        />
                        <div className="absolute top-0.5 left-[41px] [font-family:'Inter-ExtraBold',Helvetica] font-extrabold text-white text-xl">
                            DiYfHub
                        </div>
                    </a>
                </div>

                {/* Nút Hamburger (Mobile) */}
                <div className="lg:hidden text-white">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Mở menu"
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="mobile-menu"
                    >
                        {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                    </button>
                </div>
            </div>

            {/* ======================================= */}
            {/* === MENU MOBILE DROPDOWN (CHUẨN) === */}
            {/* ======================================= */}
            {/* 8. (Từ bản "chuẩn") Menu mobile đầy đủ, chiếm hết phần còn lại màn hình */}
            <div
                id="mobile-menu"
                className={`lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} w-full bg-[#0B0B0B]
                            absolute left-0 top-[50px] h-[calc(100vh-50px)] overflow-y-auto
                            border-t border-gray-800 p-5
                        `}
            >
                {/* Search (Mobile) */}
                <div className="w-full h-[36px] mb-5 relative bg-[#83838380] rounded-[3px]">
                    <label htmlFor="search-input-mobile" className="sr-only">Tìm kiếm</label>
                    <img
                        className="absolute w-4 h-4 top-1/2 left-3 -translate-y-1/2 pointer-events-none"
                        alt="" src={searchNormal} aria-hidden="true"
                    />
                    <input
                        id="search-input-mobile"
                        type="search"
                        placeholder="Tìm kiếm phim, diễn viên"
                        className="w-full h-full text-sm [font-family:'Inter-Regular',Helvetica] font-normal text-[#c4c4c4] bg-transparent border-0 outline-none focus:text-white pl-10 pr-3"
                    />
                </div>

                {/* Navigation (Mobile) */}
                <nav className="flex flex-col space-y-2 mb-5" aria-label="Điều hướng di động">
                    {navigationItems.map((item) => (
                        <a
                            key={item.label}
                            href={`/${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                            className="text-white text-base [font-family:'Inter-Regular',Helvetica] hover:opacity-80 py-3"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                {/* 9. (Gộp) "Thành viên" (Mobile) - Dùng style h-[36px] và font-bold của bạn */}
                {/* Giữ text-sm cho dễ đọc trên mobile */}
                <div className="w-full h-[36px] rounded-[15px] border border-solid border-[#ea2121]">
                    <a
                        href="/membership"
                        className="flex items-center justify-center w-full h-full gap-2 hover:opacity-80 transition-opacity"
                        aria-label="Đăng ký thành viên"
                    >
                        <img className="w-auto h-3.5" alt="" src={user} aria-hidden="true" />
                        <span className="[font-family:'Inter-Regular',Helvetica] font-bold text-white text-sm">
                            Thành viên
                        </span>
                    </a>
                </div>
            </div>
        </header>
    )
}

export default Navbar