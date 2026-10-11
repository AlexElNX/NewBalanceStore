import './MainHeader.css'
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { createPortal } from 'react-dom';
import { useCart } from "../../context/useCart.js";

function MainHeader({
                        theme = "dark",
                        containerRef,
                        autoHide = true
                    }) {
    const headerRef = useRef(null);
    const { cart } = useCart();
    const cartCount = cart.getProductCount();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [menuStack, setMenuStack] = useState(['main']);

    const currentMenu = menuStack[menuStack.length - 1];

    const pushMenu = (menuKey) => {
        setMenuStack(prev => [...prev, menuKey]);
    };

    const popMenu = () => {
        if (menuStack.length > 1) {
            setMenuStack(prev => prev.slice(0, -1));
        }
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setMenuStack(['main']);
    };

    // Close menu when switching to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                closeMobileMenu();
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

// Blocking background page scrolling
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.classList.add('menu-open');
            document.documentElement.classList.add('menu-open');
        }
        else {
            document.body.classList.remove('menu-open');
            document.documentElement.classList.remove('menu-open');
        }

        return () => {
            document.body.classList.remove('menu-open');
            document.documentElement.classList.remove('menu-open');
        };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        const header = headerRef.current;
        const container = containerRef?.current;

        if (!autoHide || !header || !container) return;

        let lastScroll = 0;

        const handleScroll = () => {
            if (isMobileMenuOpen) return;

            const currentScroll = window.scrollY;

            if (currentScroll <= 70) {
                header.style.position = "absolute";
                header.style.width = "100%";
                header.style.left = "0";

                header.classList.remove("fixed", "hidden", "scrolled");
                lastScroll = 0;
                return;
            }

            header.style.position = "fixed";
            header.style.width = `${container.offsetWidth}px`;
            header.style.left = `${container.getBoundingClientRect().left}px`;

            header.classList.add("fixed", "scrolled");

            if (currentScroll > lastScroll) {
                header.classList.add("hidden");
            }
            else {
                header.classList.remove("hidden");
            }

            lastScroll = currentScroll;
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleScroll);

        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, [autoHide, containerRef, isMobileMenuOpen]);

    // Subheading for the menu header
    const getMenuTitle = () => {
        switch (currentMenu) {
            case 'new': return 'New';
            case 'men': return 'Men';
            case 'men-shoes': return 'Shoes';
            case 'men-clothing': return 'Clothing';
            case 'men-sports': return 'Sports';
            case 'men-acc': return 'Accessories';
            case 'women': return 'Women';
            case 'women-shoes': return 'Shoes';
            case 'women-clothing': return 'Clothing';
            case 'women-sports': return 'Sports';
            case 'women-acc': return 'Accessories';
            case 'kids': return 'Kids';
            case 'kids-shoes': return 'Shoes';
            case 'kids-clothing': return 'Clothing';
            case 'sale': return 'Sale';
            default: return '';
        }
    };

    return (
        <>
            <header ref={headerRef} className={`main-header ${theme}`}>

                {/* LEFT SIDE OF MOBILE HEADER: Burger + Account */}
                <div className="mobile-left-group">
                    <button
                        className="burger-btn"
                        onClick={() => setIsMobileMenuOpen(true)}
                        aria-label="Open Menu"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <line x1="3" y1="12" x2="21" y2="12"/>
                            <line x1="3" y1="18" x2="21" y2="18"/>
                        </svg>
                    </button>

                    <Link to={"/login"} className="mobile-account-link" onClick={closeMobileMenu}>
                        <img className="account-icon" src="../src/assets/icons/header/account-icon.svg" alt="Account"/>
                    </Link>
                </div>

                {/* CENTER: Logo */}
                <div className="header-left">
                    <Link to="/" onClick={closeMobileMenu}>
                        <img className="logo" src="../src/assets/icons/header/logo.svg" alt="New Balance"/>
                    </Link>

                    {/* DESKTOP NAVIGATION */}
                    <nav className="nav-menu desktop-nav">
                        <div className="nav-item has-dropdown">
                            <Link to={"/products?new=true"}>New</Link>

                            <div className="new-dropdown">

                                <Link to={"/products?gender=men&new=true"} className="new-card">
                                    <img src="../src/assets/images/new/mens-arrivals.jpg" alt=""/>
                                    <span>Men's new arrivals</span>
                                </Link>

                                <Link to={"/products?gender=women&new=true"} className="new-card">
                                    <img src="../src/assets/images/new/womens-arrivals.jpg" alt=""/>
                                    <span>Women's new arrivals</span>
                                </Link>

                                <Link to={"/products?gender=kids&new=true"} className="new-card">
                                    <img src="../src/assets/images/new/kids-arrivals.jpg" alt=""/>
                                    <span>Kids' new arrivals</span>
                                </Link>

                                <Link to={"#"} className="new-card">
                                    <img src="../src/assets/images/new/launch-calendar.jpg" alt=""/>
                                    <span>Launch calendar</span>
                                </Link>

                                <Link to={"#"} className="new-card">
                                    <img src="../src/assets/images/new/football-collection.jpg" alt=""/>
                                    <span>The international football collection</span>
                                </Link>
                            </div>
                        </div>

                        <div className="nav-item has-dropdown">
                            <Link to={"/products?gender=men"}>Men</Link>

                            <div className="mega-menu">

                                <div className="mega-column featured">
                                    <Link to={"/products?gender=men&activity=soccer"}>Soccer</Link>
                                    <Link to={"/products?gender=men&new=true"}>New Arrivals</Link>
                                    <Link to={"#"}>Top Styles</Link>
                                    <Link to={"#"}>NB Lifestyle</Link>
                                    <Link to={"#"}>Made in USA</Link>
                                    <Link to={"#"}>Made in UK</Link>
                                    <Link to={"#"}>Launch Calendar</Link>
                                    <Link to={"#"}>Color Edit</Link>
                                    <Link to={"#"}>Klutch Athletics</Link>
                                    <Link to={"#"}>Reconsidered</Link>
                                    <Link to={"/products?sale=true"}>Sale</Link>
                                </div>

                                <div className="mega-column">
                                    <h4>SHOES</h4>
                                    <Link to={"/products?gender=men&type=footwear&category=shoes"}>All Shoes</Link>
                                    <Link to={"/products?gender=men&type=footwear&activity=running"}>Running</Link>
                                    <Link to={"/products?gender=men&type=footwear&activity=lifestyle"}>Lifestyle</Link>
                                    <Link to={"/products?gender=men&type=footwear&activity=basketball"}>Basketball</Link>
                                    <Link to={"/products?gender=men&type=footwear&activity=football"}>Football</Link>
                                    <Link to={"/products?gender=men&type=footwear&activity=soccer"}>Soccer</Link>
                                    <Link to={"/products?gender=men&type=footwear&activity=tennis"}>Tennis</Link>
                                    <Link to={"/products?gender=men&type=footwear&activity=golf"}>Golf</Link>
                                </div>

                                <div className="mega-column">
                                    <h4>CLOTHING</h4>
                                    <Link to={"/products?gender=men&type=clothing"}>All Clothing</Link>
                                    <Link to={"/products?gender=men&type=clothing&category=shirts"}>Shirts</Link>
                                    <Link to={"/products?gender=men&type=clothing&category=shorts"}>Shorts</Link>
                                    <Link to={"/products?gender=men&type=clothing&category=pants"}>Pants</Link>
                                    <Link to={"/products?gender=men&type=clothing&category=hoodies%20%26%20sweatshirts"}>Hoodies & Sweatshirts</Link>
                                    <Link to={"/products?gender=men&type=clothing&category=jackets%20%26%20vests"}>Jackets & Vests</Link>
                                </div>

                                <div className="mega-column">
                                    <h4>SPORTS</h4>
                                    <Link to={"/products?gender=men&activity=soccer"}>Soccer</Link>
                                    <Link to={"/products?gender=men&activity=tennis"}>Tennis</Link>
                                    <Link to={"/products?gender=men&activity=running"}>Running</Link>
                                    <Link to={"/products?gender=men&activity=basketball"}>Basketball</Link>
                                    <Link to={"/products?gender=men&activity=football"}>Football</Link>
                                </div>

                                <div className="mega-column">
                                    <h4>ACCESSORIES</h4>
                                    <Link to={"/products?gender=men&type=accessories"}>All Accessories</Link>
                                    <Link to={"/products?gender=men&type=accessories&category=hats%20%26%20gloves"}>Hats & Gloves</Link>
                                    <Link to={"/products?gender=men&type=accessories&category=socks"}>Socks</Link>
                                    <Link to={"/products?gender=men&type=accessories&category=bags"}>Bags</Link>
                                </div>
                            </div>
                        </div>

                        <div className="nav-item has-dropdown">
                            <Link to={"/products?gender=women"}>Women</Link>

                            <div className="mega-menu">

                                <div className="mega-column featured">
                                    <Link to={"/products?gender=women&activity=soccer"}>All Accessories</Link>
                                    <Link to={"/products?gender=women&new=true"}>New Arrivals</Link>
                                    <Link to={"#"}>Top Styles</Link>
                                    <Link to={"#"}>NB Lifestyle</Link>
                                    <Link to={"#"}>Made in USA</Link>
                                    <Link to={"#"}>Made in UK</Link>
                                    <Link to={"#"}>Launch Calendar</Link>
                                    <Link to={"#"}>Color Edit</Link>
                                    <Link to={"#"}>Klutch Athletics</Link>
                                    <Link to={"#"}>Reconsidered</Link>
                                    <Link to={"/products?sale=true"}>Sale</Link>
                                </div>

                                <div className="mega-column">
                                    <h4>SHOES</h4>
                                    <Link to={"/products?gender=women&type=footwear&category=shoes"}>All Shoes</Link>
                                    <Link to={"/products?gender=women&type=footwear&activity=running"}>Running</Link>
                                    <Link to={"/products?gender=women&type=footwear&activity=lifestyle"}>Lifestyle</Link>
                                    <Link to={"/products?gender=women&type=footwear&activity=basketball"}>Basketball</Link>
                                    <Link to={"/products?gender=women&type=footwear&activity=football"}>Football</Link>
                                    <Link to={"/products?gender=women&type=footwear&activity=soccer"}>Soccer</Link>
                                    <Link to={"/products?gender=women&type=footwear&activity=tennis"}>Tennis</Link>
                                    <Link to={"/products?gender=women&type=footwear&activity=golf"}>Golf</Link>
                                </div>

                                <div className="mega-column">
                                    <h4>CLOTHING</h4>
                                    <Link to={"/products?gender=women&type=clothing"}>All Clothing</Link>
                                    <Link to={"/products?gender=women&type=clothing&category=shirts"}>Shirts</Link>
                                    <Link to={"/products?gender=women&type=clothing&category=shorts"}>Shorts</Link>
                                    <Link to={"/products?gender=women&type=clothing&category=pants"}>Pants</Link>
                                    <Link to={"/products?gender=women&type=clothing&category=hoodies%20%26%20sweatshirts"}>Hoodies & Sweatshirts</Link>
                                    <Link to={"/products?gender=women&type=clothing&category=jackets%20%26%20vests"}>Jackets & Vests</Link>
                                </div>

                                <div className="mega-column">
                                    <h4>SPORTS</h4>
                                    <Link to={"/products?gender=women&activity=soccer"}>Soccer</Link>
                                    <Link to={"/products?gender=women&activity=tennis"}>Tennis</Link>
                                    <Link to={"/products?gender=women&activity=running"}>Running</Link>
                                    <Link to={"/products?gender=women&activity=basketball"}>Basketball</Link>
                                    <Link to={"/products?gender=women&activity=football"}>Football</Link>
                                </div>

                                <div className="mega-column">
                                    <h4>ACCESSORIES</h4>
                                    <Link to={"/products?gender=women&type=accessories"}>All Accessories</Link>
                                    <Link to={"/products?gender=women&type=accessories&category=hats%20%26%20gloves"}>Hats & Gloves</Link>
                                    <Link to={"/products?gender=women&type=accessories&category=socks"}>Socks</Link>
                                    <Link to={"/products?gender=women&type=accessories&category=bags"}>Bags</Link>
                                </div>

                            </div>
                        </div>

                        <div className="nav-item has-dropdown">
                            <Link to={"/products?gender=kids"}>Kids</Link>

                            <div className="mega-menu">

                                <div className="mega-column featured">
                                    <Link to={"#"}>Soccer</Link>
                                    <Link to={"#"}>New Arrivals</Link>
                                    <Link to={"#"}>School Uniform Shoes</Link>
                                    <Link to={"#"}>Top Styles</Link>
                                    <Link to={"#"}>Sibling Shop</Link>
                                    <Link to={"#"}>Wide Shoes</Link>
                                    <Link to={"#"}>Kid-friendly Closures</Link>
                                    <Link to={"#"}>Shoes under $75</Link>
                                    <Link to={"#"}>Sale</Link>
                                </div>

                                <div className="mega-column">
                                    <h4>SHOES</h4>
                                    <Link to={"#"}>All Shoes</Link>
                                    <Link to={"#"}>Big Kids (Size 3.5 - 7)</Link>
                                    <Link to={"#"}>Little Kids (Size 10.5 - 3)</Link>
                                    <Link to={"#"}>Babies & Toddlers (Size 0 - 10)</Link>
                                </div>

                                <div className="mega-column">
                                    <h4>CLOTHING</h4>
                                    <Link to={"#"}>All Clothing</Link>
                                    <Link to={"#"}>Big Kids (Size 7Y - 16Y)</Link>
                                    <Link to={"#"}>Little Kids (Size 3Y - 6Y)</Link>
                                    <Link to={"#"}>Babies & Toddlers (Size 12M - 3T)</Link>
                                </div>

                                <div className="mega-column">
                                    <h4>SPORTS</h4>
                                    <Link to={"#"}>All Sports</Link>
                                    <Link to={"/products?gender=kids&activity=soccer"}>Soccer</Link>
                                    <Link to={"/products?gender=kids&activity=tennis"}>Tennis</Link>
                                    <Link to={"/products?gender=kids&activity=running"}>Running</Link>
                                    <Link to={"/products?gender=kids&activity=basketball"}>Basketball</Link>
                                    <Link to={"/products?gender=kids&activity=football"}>Football</Link>
                                </div>

                                <div className="mega-column">
                                    <h4>ACCESSORIES</h4>
                                    <Link to={"/products?gender=kids&type=accessories"}>All Accessories</Link>
                                    <Link to={"/products?gender=kids&type=accessories&category=hats%20%26%20gloves"}>Hats & Gloves</Link>
                                    <Link to={"/products?gender=kids&type=accessories&category=socks"}>Socks</Link>
                                    <Link to={"/products?gender=kids&type=accessories&category=bags"}>Bags</Link>
                                </div>
                            </div>
                        </div>

                        <div className="nav-item has-dropdown">
                            <Link to={"/products?sale=true"}>Sale</Link>

                            <div className="mega-menu">

                                <div className="mega-column featured">
                                    <h4>All Sale</h4>
                                    <Link to={"#"}>Under $50</Link>
                                    <Link to={"#"}>Under $100</Link>
                                </div>

                                <div className="mega-column">
                                    <h4>MEN</h4>

                                    <Link to={"#"}>Shoes</Link>
                                    <Link to={"#"}>Clothing</Link>
                                    <Link to={"#"}>Accessories</Link>
                                </div>

                                <div className="mega-column">
                                    <h4>WOMEN</h4>

                                    <Link to={"#"}>Shoes</Link>
                                    <Link to={"#"}>Clothing</Link>
                                    <Link to={"#"}>Accessories</Link>
                                </div>

                                <div className="mega-column">
                                    <h4>KIDS</h4>

                                    <Link to={"#"}>Shoes</Link>
                                    <Link to={"#"}>Clothing</Link>
                                    <Link to={"#"}>Accessories</Link>
                                </div>

                            </div>
                        </div>
                    </nav>
                </div>

                {/* RIGHT SIDE OF MOBILE HEADER: Search + Cart */}
                <div className="header-icons">
                    <img className="search-icon" src="../src/assets/icons/header/search-icon.svg" alt="Search"/>

                    <Link to={"/login"} className="desktop-account-link">
                        <img className="account-icon" src="../src/assets/icons/header/account-icon.svg" alt="Account"/>
                    </Link>

                    <Link to={"/cart"} className="cart-link" onClick={closeMobileMenu}>
                        <img className="bag-icon" src="../src/assets/icons/header/bag-icon.svg" alt="Cart"/>
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </Link>
                </div>

                {/* FULL-SCREEN MOBILE MENU (OVERLAY) */}
                {createPortal(
                    <div className={`mobile-full-menu ${isMobileMenuOpen ? 'active' : ''}`}>

                        {/* Full-screen menu header */}
                        <div className="mobile-menu-header">
                            {menuStack.length > 1 ? (
                                <button className="menu-back-btn" onClick={popMenu} aria-label="Back">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="19" y1="12" x2="5" y2="12"></line>
                                        <polyline points="12 19 5 12 12 5"></polyline>
                                    </svg>
                                </button>
                            ) : (
                                <Link to="/" onClick={closeMobileMenu}>
                                    <img className="logo" src="../src/assets/icons/header/logo.svg" alt="New Balance"/>
                                </Link>
                            )}

                            <div className="menu-title-text">
                                {getMenuTitle()}
                            </div>

                            <button className="menu-close-btn" onClick={closeMobileMenu} aria-label="Close">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <line x1="18" y1="6" x2="6" y2="18"/>
                                    <line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                            </button>
                        </div>

                        {/* Content depending on the current step in the stack */}
                        <div className="mobile-menu-body">

                            {/* 1. MAIN SCREEN */}
                            {currentMenu === 'main' && (
                                <div className="menu-page">
                                    <div className="menu-nav-row" onClick={() => pushMenu('new')}>
                                        <span>New</span>
                                        <span className="arrow-icon">→</span>
                                    </div>
                                    <div className="menu-nav-row" onClick={() => pushMenu('men')}>
                                        <span>Men</span>
                                        <span className="arrow-icon">→</span>
                                    </div>
                                    <div className="menu-nav-row" onClick={() => pushMenu('women')}>
                                        <span>Women</span>
                                        <span className="arrow-icon">→</span>
                                    </div>
                                    <div className="menu-nav-row" onClick={() => pushMenu('kids')}>
                                        <span>Kids</span>
                                        <span className="arrow-icon">→</span>
                                    </div>
                                    <div className="menu-nav-row" onClick={() => pushMenu('sale')}>
                                        <span>Sale</span>
                                        <span className="arrow-icon">→</span>
                                    </div>
                                </div>
                            )}

                            {/* 2. NEW SCREEN */}
                            {currentMenu === 'new' && (
                                <div className="menu-page">
                                    <Link to="/products?new=true" className="menu-link" onClick={closeMobileMenu}>All New</Link>
                                    <Link to="/products?gender=men&new=true" className="menu-nav-row-link" onClick={closeMobileMenu}>Men's new arrivals</Link>
                                    <Link to="/products?gender=women&new=true" className="menu-nav-row-link" onClick={closeMobileMenu}>Women's new arrivals</Link>
                                    <Link to="/products?gender=kids&new=true" className="menu-nav-row-link" onClick={closeMobileMenu}>Kids' new arrivals</Link>
                                    <Link to="#" className="menu-nav-row-link" onClick={closeMobileMenu}>Launch calendar</Link>
                                    <Link to="#" className="menu-nav-row-link" onClick={closeMobileMenu}>The international football collection</Link>
                                </div>
                            )}

                            {/* 3. MEN'S SCREEN */}
                            {currentMenu === 'men' && (
                                <div className="menu-page">
                                    <Link to="/products?gender=men" className="menu-link" onClick={closeMobileMenu}>Shop All Men</Link>
                                    <div className="menu-nav-row" onClick={() => pushMenu('men-shoes')}>
                                        <span>Shoes</span>
                                        <span className="arrow-icon">→</span>
                                    </div>
                                    <div className="menu-nav-row" onClick={() => pushMenu('men-clothing')}>
                                        <span>Clothing</span>
                                        <span className="arrow-icon">→</span>
                                    </div>
                                    <div className="menu-nav-row" onClick={() => pushMenu('men-sports')}>
                                        <span>Sports</span>
                                        <span className="arrow-icon">→</span>
                                    </div>
                                    <div className="menu-nav-row" onClick={() => pushMenu('men-acc')}>
                                        <span>Accessories</span>
                                        <span className="arrow-icon">→</span>
                                    </div>
                                    <Link to="/products?gender=men&new=true" className="menu-nav-row-link" onClick={closeMobileMenu}>New Arrivals</Link>
                                    <Link to="/products?sale=true" className="menu-nav-row-link" onClick={closeMobileMenu}>Sale</Link>
                                </div>
                            )}

                            {/* MEN -> SHOES */}
                            {currentMenu === 'men-shoes' && (
                                <div className="menu-page">
                                    <Link to="/products?gender=men&type=footwear&category=shoes" className="menu-nav-row-link" onClick={closeMobileMenu}>All Shoes</Link>
                                    <Link to="/products?gender=men&type=footwear&activity=running" className="menu-nav-row-link" onClick={closeMobileMenu}>Running</Link>
                                    <Link to="/products?gender=men&type=footwear&activity=lifestyle" className="menu-nav-row-link" onClick={closeMobileMenu}>Lifestyle</Link>
                                    <Link to="/products?gender=men&type=footwear&activity=basketball" className="menu-nav-row-link" onClick={closeMobileMenu}>Basketball</Link>
                                    <Link to="/products?gender=men&type=footwear&activity=football" className="menu-nav-row-link" onClick={closeMobileMenu}>Football</Link>
                                    <Link to="/products?gender=men&type=footwear&activity=soccer" className="menu-nav-row-link" onClick={closeMobileMenu}>Soccer</Link>
                                    <Link to="/products?gender=men&type=footwear&activity=tennis" className="menu-nav-row-link" onClick={closeMobileMenu}>Tennis</Link>
                                    <Link to="/products?gender=men&type=footwear&activity=golf" className="menu-nav-row-link" onClick={closeMobileMenu}>Golf</Link>
                                </div>
                            )}

                            {/* MEN -> CLOTHING */}
                            {currentMenu === 'men-clothing' && (
                                <div className="menu-page">
                                    <Link to="/products?gender=men&type=clothing" className="menu-nav-row-link" onClick={closeMobileMenu}>All Clothing</Link>
                                    <Link to="/products?gender=men&type=clothing&category=shirts" className="menu-nav-row-link" onClick={closeMobileMenu}>Shirts</Link>
                                    <Link to="/products?gender=men&type=clothing&category=shorts" className="menu-nav-row-link" onClick={closeMobileMenu}>Shorts</Link>
                                    <Link to="/products?gender=men&type=clothing&category=pants" className="menu-nav-row-link" onClick={closeMobileMenu}>Pants</Link>
                                    <Link to="/products?gender=men&type=clothing&category=hoodies%20%26%20sweatshirts" className="menu-nav-row-link" onClick={closeMobileMenu}>Hoodies & Sweatshirts</Link>
                                    <Link to="/products?gender=men&type=clothing&category=jackets%20%26%20vests" className="menu-nav-row-link" onClick={closeMobileMenu}>Jackets & Vests</Link>
                                </div>
                            )}

                            {/* MEN -> SPORTS */}
                            {currentMenu === 'men-sports' && (
                                <div className="menu-page">
                                    <Link to="/products?gender=men&activity=soccer" className="menu-nav-row-link" onClick={closeMobileMenu}>Soccer</Link>
                                    <Link to="/products?gender=men&activity=tennis" className="menu-nav-row-link" onClick={closeMobileMenu}>Tennis</Link>
                                    <Link to="/products?gender=men&activity=running" className="menu-nav-row-link" onClick={closeMobileMenu}>Running</Link>
                                    <Link to="/products?gender=men&activity=basketball" className="menu-nav-row-link" onClick={closeMobileMenu}>Basketball</Link>
                                    <Link to="/products?gender=men&activity=football" className="menu-nav-row-link" onClick={closeMobileMenu}>Football</Link>
                                </div>
                            )}

                            {/* MEN -> ACCESSORIES */}
                            {currentMenu === 'men-acc' && (
                                <div className="menu-page">
                                    <Link to="/products?gender=men&type=accessories" className="menu-nav-row-link" onClick={closeMobileMenu}>All Accessories</Link>
                                    <Link to="/products?gender=men&type=accessories&category=hats%20%26%20gloves" className="menu-nav-row-link" onClick={closeMobileMenu}>Hats & Gloves</Link>
                                    <Link to="/products?gender=men&type=accessories&category=socks" className="menu-nav-row-link" onClick={closeMobileMenu}>Socks</Link>
                                    <Link to="/products?gender=men&type=accessories&category=bags" className="menu-nav-row-link" onClick={closeMobileMenu}>Bags</Link>
                                </div>
                            )}

                            {/* 4. WOMEN'S SCREEN */}
                            {currentMenu === 'women' && (
                                <div className="menu-page">
                                    <Link to="/products?gender=women" className="menu-link" onClick={closeMobileMenu}>Shop All Women</Link>
                                    <div className="menu-nav-row" onClick={() => pushMenu('women-shoes')}>
                                        <span>Shoes</span>
                                        <span className="arrow-icon">→</span>
                                    </div>
                                    <div className="menu-nav-row" onClick={() => pushMenu('women-clothing')}>
                                        <span>Clothing</span>
                                        <span className="arrow-icon">→</span>
                                    </div>
                                    <div className="menu-nav-row" onClick={() => pushMenu('women-sports')}>
                                        <span>Sports</span>
                                        <span className="arrow-icon">→</span>
                                    </div>
                                    <div className="menu-nav-row" onClick={() => pushMenu('women-acc')}>
                                        <span>Accessories</span>
                                        <span className="arrow-icon">→</span>
                                    </div>
                                    <Link to="/products?gender=women&new=true" className="menu-nav-row-link" onClick={closeMobileMenu}>New Arrivals</Link>
                                    <Link to="/products?sale=true" className="menu-nav-row-link" onClick={closeMobileMenu}>Sale</Link>
                                </div>
                            )}

                            {/* WOMEN -> SHOES */}
                            {currentMenu === 'women-shoes' && (
                                <div className="menu-page">
                                    <Link to="/products?gender=women&type=footwear&category=shoes" className="menu-nav-row-link" onClick={closeMobileMenu}>All Shoes</Link>
                                    <Link to="/products?gender=women&type=footwear&activity=running" className="menu-nav-row-link" onClick={closeMobileMenu}>Running</Link>
                                    <Link to="/products?gender=women&type=footwear&activity=lifestyle" className="menu-nav-row-link" onClick={closeMobileMenu}>Lifestyle</Link>
                                    <Link to="/products?gender=women&type=footwear&activity=basketball" className="menu-nav-row-link" onClick={closeMobileMenu}>Basketball</Link>
                                    <Link to="/products?gender=women&type=footwear&activity=football" className="menu-nav-row-link" onClick={closeMobileMenu}>Football</Link>
                                    <Link to="/products?gender=women&type=footwear&activity=soccer" className="menu-nav-row-link" onClick={closeMobileMenu}>Soccer</Link>
                                    <Link to="/products?gender=women&type=footwear&activity=tennis" className="menu-nav-row-link" onClick={closeMobileMenu}>Tennis</Link>
                                    <Link to="/products?gender=women&type=footwear&activity=golf" className="menu-nav-row-link" onClick={closeMobileMenu}>Golf</Link>
                                </div>
                            )}

                            {/* WOMEN -> CLOTHING */}
                            {currentMenu === 'women-clothing' && (
                                <div className="menu-page">
                                    <Link to="/products?gender=women&type=clothing" className="menu-nav-row-link" onClick={closeMobileMenu}>All Clothing</Link>
                                    <Link to="/products?gender=women&type=clothing&category=shirts" className="menu-nav-row-link" onClick={closeMobileMenu}>Shirts</Link>
                                    <Link to="/products?gender=women&type=clothing&category=shorts" className="menu-nav-row-link" onClick={closeMobileMenu}>Shorts</Link>
                                    <Link to="/products?gender=women&type=clothing&category=pants" className="menu-nav-row-link" onClick={closeMobileMenu}>Pants</Link>
                                    <Link to="/products?gender=women&type=clothing&category=hoodies%20%26%20sweatshirts" className="menu-nav-row-link" onClick={closeMobileMenu}>Hoodies & Sweatshirts</Link>
                                    <Link to="/products?gender=women&type=clothing&category=jackets%20%26%20vests" className="menu-nav-row-link" onClick={closeMobileMenu}>Jackets & Vests</Link>
                                </div>
                            )}

                            {/* WOMEN -> SPORTS */}
                            {currentMenu === 'women-sports' && (
                                <div className="menu-page">
                                    <Link to="/products?gender=women&activity=soccer" className="menu-nav-row-link" onClick={closeMobileMenu}>Soccer</Link>
                                    <Link to="/products?gender=women&activity=tennis" className="menu-nav-row-link" onClick={closeMobileMenu}>Tennis</Link>
                                    <Link to="/products?gender=women&activity=running" className="menu-nav-row-link" onClick={closeMobileMenu}>Running</Link>
                                    <Link to="/products?gender=women&activity=basketball" className="menu-nav-row-link" onClick={closeMobileMenu}>Basketball</Link>
                                    <Link to="/products?gender=women&activity=football" className="menu-nav-row-link" onClick={closeMobileMenu}>Football</Link>
                                </div>
                            )}

                            {/* WOMEN -> ACCESSORIES */}
                            {currentMenu === 'women-acc' && (
                                <div className="menu-page">
                                    <Link to="/products?gender=women&type=accessories" className="menu-nav-row-link" onClick={closeMobileMenu}>All Accessories</Link>
                                    <Link to="/products?gender=women&type=accessories&category=hats%20%26%20gloves" className="menu-nav-row-link" onClick={closeMobileMenu}>Hats & Gloves</Link>
                                    <Link to="/products?gender=women&type=accessories&category=socks" className="menu-nav-row-link" onClick={closeMobileMenu}>Socks</Link>
                                    <Link to="/products?gender=women&type=accessories&category=bags" className="menu-nav-row-link" onClick={closeMobileMenu}>Bags</Link>
                                </div>
                            )}

                            {/* 5. KIDS SCREEN */}
                            {currentMenu === 'kids' && (
                                <div className="menu-page">
                                    <Link to="/products?gender=kids" className="menu-link" onClick={closeMobileMenu}>Shop All Kids</Link>
                                    <div className="menu-nav-row" onClick={() => pushMenu('kids-shoes')}>
                                        <span>Shoes</span>
                                        <span className="arrow-icon">→</span>
                                    </div>
                                    <div className="menu-nav-row" onClick={() => pushMenu('kids-clothing')}>
                                        <span>Clothing</span>
                                        <span className="arrow-icon">→</span>
                                    </div>
                                </div>
                            )}

                            {/* KIDS -> SHOES */}
                            {currentMenu === 'kids-shoes' && (
                                <div className="menu-page">
                                    <Link to="/products?gender=kids&type=footwear" className="menu-nav-row-link" onClick={closeMobileMenu}>All Shoes</Link>
                                    <Link to="#" className="menu-nav-row-link" onClick={closeMobileMenu}>Big Kids (Size 3.5 - 7)</Link>
                                    <Link to="#" className="menu-nav-row-link" onClick={closeMobileMenu}>Little Kids (Size 10.5 - 3)</Link>
                                    <Link to="#" className="menu-nav-row-link" onClick={closeMobileMenu}>Babies & Toddlers (Size 0 - 10)</Link>
                                </div>
                            )}

                            {/* KIDS -> CLOTHING */}
                            {currentMenu === 'kids-clothing' && (
                                <div className="menu-page">
                                    <Link to="/products?gender=kids&type=clothing" className="menu-nav-row-link" onClick={closeMobileMenu}>All Clothing</Link>
                                    <Link to="#" className="menu-nav-row-link" onClick={closeMobileMenu}>Big Kids (Size 7Y - 16Y)</Link>
                                    <Link to="#" className="menu-nav-row-link" onClick={closeMobileMenu}>Little Kids (Size 3Y - 6Y)</Link>
                                    <Link to="#" className="menu-nav-row-link" onClick={closeMobileMenu}>Babies & Toddlers (Size 12M - 3T)</Link>
                                </div>
                            )}

                            {/* 6. ЭКРАН SALE */}
                            {currentMenu === 'sale' && (
                                <div className="menu-page">
                                    <Link to="/products?sale=true" className="menu-link" onClick={closeMobileMenu}>All Sale</Link>
                                    <Link to="/products?gender=men&sale=true" className="menu-nav-row-link" onClick={closeMobileMenu}>Men's Sale</Link>
                                    <Link to="/products?gender=women&sale=true" className="menu-nav-row-link" onClick={closeMobileMenu}>Women's Sale</Link>
                                    <Link to="/products?gender=kids&sale=true" className="menu-nav-row-link" onClick={closeMobileMenu}>Kids' Sale</Link>
                                </div>
                            )}

                        </div>
                    </div>,
                    document.body
                )}

            </header>
        </>
    );
}

export default MainHeader;