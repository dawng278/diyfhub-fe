import React, { useState, useEffect } from 'react' // Thêm useEffect
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.svg'
import searchNormal from '../../assets/search-normal.svg'
import arrowDown from '../../assets/arrow-down.svg'
import user from '../../assets/user.svg'
import { getCategories, getCountries } from '../../services/apiService';

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
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [genres, setGenres] = useState([]);
    const [countries, setCountries] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/tim-kiem?keyword=${encodeURIComponent(searchQuery.trim())}`);
            // Close mobile menu after search on mobile/tablet
            setIsMobileMenuOpen(false);
        }
    };

    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    };

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

    // Thêm hiệu ứng đổi màu header khi scroll
    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY > 10;
            if (scrolled !== isScrolled) {
                setIsScrolled(scrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isScrolled]);

    const navigationItems = [
        { label: "Phim lẻ", hasDropdown: false, path: "/phim-le" },
        { label: "Phim bộ", hasDropdown: false, path: "/phim-bo" },
        { label: "Thể loại", hasDropdown: true, items: genres, type: 'genre' },
        { label: "Quốc gia", hasDropdown: true, items: countries, type: 'country' },
        { label: "Phim Anime", hasDropdown: false, path: "/anime" },
    ];

    // Check if mobile/tablet
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 1024); // lg breakpoint
        };
        
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    // Close dropdown when clicking outside or on the same button
    useEffect(() => {
        const handleClickOutside = (event) => {
            const isDropdownButton = event.target.closest('button[aria-expanded]');
            const isInsideDropdown = event.target.closest('.dropdown-container') || 
                                  event.target.closest('[id^="mobile-dropdown-"]');
            
            if (activeDropdown && !isInsideDropdown && !isDropdownButton) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        document.addEventListener('click', handleClickOutside);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
            document.removeEventListener('click', handleClickOutside);
        };
    }, [activeDropdown]);

    // Fetch genres and countries from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Fetching categories...');
                const categoriesData = await getCategories();
                console.log('Categories response:', categoriesData);
                
                // Format categories data
                const formattedGenres = categoriesData.map(category => ({
                    id: category._id || category.id || Math.random().toString(36).substr(2, 9),
                    name: category.name || category.category_name || 'Unknown',
                    slug: (category.slug || category.slug_url || '').trim() || 
                          (category.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                })).filter(cat => cat.name !== 'Unknown');
                
                console.log('Formatted genres:', formattedGenres);
                setGenres(formattedGenres);

                console.log('Fetching countries...');
                const countriesData = await getCountries();
                console.log('Countries response:', countriesData);
                
                // Format countries data
                const formattedCountries = countriesData.map(country => ({
                    id: country._id || country.id || Math.random().toString(36).substr(2, 9),
                    name: country.name || country.country_name || 'Unknown',
                    slug: (country.slug || country.slug_url || '').trim() || 
                          (country.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                })).filter(country => country.name !== 'Unknown');
                
                console.log('Formatted countries:', formattedCountries);
                setCountries(formattedCountries);
            } catch (error) {
                console.error('Error fetching data:', error);
                // Set empty arrays on error
                setGenres([]);
                setCountries([]);
            }
        };

        fetchData();
    }, []);

    const toggleDropdown = (label, event) => {
        // Prevent default only for mobile to avoid closing the menu immediately
        if (isMobile) {
            event.preventDefault();
            event.stopPropagation();
        }
        setActiveDropdown(activeDropdown === label ? null : label);
    };

    return (
        // 2. (Gộp) Header dính (sticky) VÀ trong suốt (bg-transparent)
        // Thêm transition-colors để đổi màu nền mượt mà khi menu mở
        <header
            className={`w-full fixed top-0 z-50 transition-all duration-300 ${
                isMobileMenuOpen 
                    ? 'bg-[#0B0B0B]' 
                    : isScrolled 
                        ? 'bg-[#0B0B0B]/80 backdrop-blur-sm' 
                        : 'bg-transparent'
            }`}
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
                    <form onSubmit={handleSearch} className="w-full max-w-[352px]">
                        <div className="w-full h-[36px] relative bg-[#83838380] rounded-[3px]">
                            <label htmlFor="search-input-desktop" className="sr-only">Tìm kiếm</label>
                            <img
                                className="absolute w-3.5 h-3.5 top-1/2 left-3 -translate-y-1/2 pointer-events-none"
                                alt="" src={searchNormal} aria-hidden="true"
                            />
                            <input
                                id="search-input-desktop"
                                type="search"
                                placeholder="Tìm kiếm phim"
                                value={searchQuery}
                                onChange={handleSearchInputChange}
                                onKeyPress={handleSearchKeyPress}
                                className="w-full h-full text-sm [font-family:'Inter-Regular',Helvetica] font-normal text-[#c4c4c4] bg-transparent border-0 outline-none focus:text-white pl-10 pr-3"
                            />
                        </div>
                    </form>

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
                                        href={item.path}
                                        className="flex items-center [font-family:'Inter-Regular',Helvetica] font-normal text-white text-xs hover:opacity-80 transition-opacity"
                                    >
                                        {item.label}
                                    </a>
                                ) : (
                                    <div className="relative group">
                                        <button
                                            onClick={() => toggleDropdown(item.label)}
                                            className="flex items-center gap-1.5 text-left [font-family:'Inter-Regular',Helvetica] font-normal text-white text-xs hover:opacity-80 transition-opacity"
                                            aria-haspopup="true"
                                            aria-expanded={activeDropdown === item.label}
                                        >
                                            <span>{item.label}</span>
                                            <img 
                                                className={`w-auto h-1.5 transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} 
                                                alt="" 
                                                src={arrowDown} 
                                                aria-hidden="true" 
                                            />
                                        </button>
                                        {activeDropdown === item.label && (
                                            <div className={`dropdown-container absolute left-0 mt-2 w-full lg:w-auto lg:min-w-[300px] bg-[#1a1a1a] rounded shadow-lg p-3 z-50 ${isMobile ? 'fixed inset-x-4 top-1/2 -translate-y-1/2 max-h-[80vh] overflow-y-auto' : ''}`}>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {item.items && item.items.length > 0 ? (
                                                        item.items.map((subItem) => {
                                                            const href = item.type === 'country' 
                                                                ? `/quoc-gia/${subItem.slug}/${encodeURIComponent(subItem.name)}`
                                                                : `/the-loai/${subItem.id}/${subItem.slug}`;
                                                            return (
                                                                <a
                                                                    key={subItem.id}
                                                                    href={href}
                                                                    className="px-3 py-2 text-sm text-white hover:bg-[#333] rounded transition-colors whitespace-normal break-words"
                                                                    title={subItem.name}
                                                                    onClick={() => setActiveDropdown(null)}
                                                                >
                                                                    {subItem.name}
                                                                    {item.type === 'country' && subItem.movieCount && (
                                                                        <span className="ml-1 text-gray-400 text-xs">({subItem.movieCount})</span>
                                                                    )}
                                                                </a>
                                                            );
                                                        })
                                                    ) : (
                                                        <div className="col-span-2 px-3 py-2 text-sm text-gray-400">Đang tải...</div>
                                                    )}
                                                </div>
                                                {isMobile && (
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveDropdown(null);
                                                        }}
                                                        className="w-full mt-4 p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                                    >
                                                        Đóng
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
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
                <div className="lg:hidden flex items-center gap-4">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Mở menu"
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="mobile-menu"
                        className="text-white p-2"
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
                <form onSubmit={handleSearch} className="w-full mb-5">
                    <div className="w-full h-[36px] relative bg-[#83838380] rounded-[3px]">
                        <label htmlFor="search-input-mobile" className="sr-only">Tìm kiếm</label>
                        <img
                            className="absolute w-4 h-4 top-1/2 left-3 -translate-y-1/2 pointer-events-none"
                            alt="" src={searchNormal} aria-hidden="true"
                        />
                        <input
                            id="search-input-mobile"
                            type="search"
                            placeholder="Tìm kiếm phim"
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                            onKeyPress={handleSearchKeyPress}
                            className="w-full h-full text-sm [font-family:'Inter-Regular',Helvetica] font-normal text-[#c4c4c4] bg-transparent border-0 outline-none focus:text-white pl-10 pr-3"
                        />
                    </div>
                </form>

                {/* Navigation (Mobile) */}
                <nav className="flex flex-col space-y-2 mb-5" aria-label="Điều hướng di động">
                    {navigationItems.map((item) => (
                        <div key={item.label} className="w-full">
                            {!item.hasDropdown ? (
                                <a
                                    href={item.path}
                                    className="block text-white text-base [font-family:'Inter-Regular',Helvetica] hover:opacity-80 py-3 px-2"
                                    onClick={() => setActiveDropdown(null)}
                                >
                                    {item.label}
                                </a>
                            ) : (
                                <div className="w-full">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (activeDropdown === item.label) {
                                                setActiveDropdown(null);
                                            } else {
                                                setActiveDropdown(item.label);
                                            }
                                        }}
                                        className={`w-full flex items-center justify-between text-base [font-family:'Inter-Regular',Helvetica] py-3 px-4 rounded-md transition-colors ${
                                            activeDropdown === item.label 
                                                ? 'bg-[#ea2121] text-white font-medium' 
                                                : 'text-white hover:bg-[#2a2a2a] hover:text-white'
                                        }`}
                                        aria-expanded={activeDropdown === item.label}
                                        aria-controls={`mobile-dropdown-${item.label}`}
                                    >
                                        <span>{item.label}</span>
                                        <img 
                                            className={`w-3 h-3 transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} 
                                            alt="" 
                                            src={arrowDown} 
                                            aria-hidden="true" 
                                        />
                                    </button>
                                    {activeDropdown === item.label && (
                                        <div 
                                            id={`mobile-dropdown-${item.label}`}
                                            className="pl-4 mt-1 mb-2 border-l-2 border-[#ea2121] bg-[#1a1a1a] rounded-r-md py-2"
                                        >
                                            {item.items && item.items.length > 0 ? (
                                                <div className="grid grid-cols-2 gap-2 py-2">
                                                    {item.items.map((subItem) => {
                                                        const href = item.type === 'country' 
                                                            ? `/quoc-gia/${subItem.slug}/${encodeURIComponent(subItem.name)}`
                                                            : `/the-loai/${subItem.id}/${subItem.slug}`;
                                                        return (
                                                            <a
                                                                key={subItem.id}
                                                                href={href}
                                                                className="block text-sm text-gray-300 hover:text-white hover:bg-[#333] px-4 py-2 rounded transition-colors"
                                                                onClick={() => setActiveDropdown(null)}
                                                            >
                                                                {subItem.name}
                                                                {item.type === 'country' && subItem.movieCount && (
                                                                    <span className="ml-1 text-gray-400 text-xs">({subItem.movieCount})</span>
                                                                )}
                                                            </a>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="px-3 py-2 text-sm text-gray-400">Đang tải...</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
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