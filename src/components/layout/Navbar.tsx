import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import StaggeredMenu, { type StaggeredMenuItem, type StaggeredMenuSocialItem } from '../menu/StaggeredMenu';
import './Navbar.css';

interface NavbarProps {
    currentPath?: string;
    currentSearch?: string;
}

export default function Navbar({ currentPath: propPath }: NavbarProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownActive, setDropdownActive] = useState(false);

    const location = useLocation();
    const { isAuthenticated } = useAuth();
    const { theme } = useTheme();

    // Close dropdown when clicking outside of the dropdown container
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (dropdownActive && !target.closest('.navbar-item-with-dropdown')) {
                setDropdownActive(false);
            }
        };
        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [dropdownActive]);

    // Close menu when route changes
    useEffect(() => {
        setMenuOpen(false);
        setDropdownActive(false);
        document.body.style.overflow = '';
    }, [location.pathname, propPath]);

    const handleMouseEnter = () => {
        if (window.innerWidth > 1280) {
            setDropdownActive(true);
        }
    };

    const handleMouseLeave = () => {
        if (window.innerWidth > 1280) {
            setDropdownActive(false);
        }
    };

    const handleDropdownClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setDropdownActive(!dropdownActive);
    };

    const toggleMenu = () => {
        setMenuOpen((prev) => {
            const nextState = !prev;
            if (nextState) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
                setDropdownActive(false);
            }
            return nextState;
        });
    };

    const closeMenu = () => {
        setMenuOpen(false);
        setDropdownActive(false);
        document.body.style.overflow = '';
    };

    const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (location.pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        closeMenu();
    };

    const mobileMenuItems: StaggeredMenuItem[] = [
        { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
        { label: 'About', ariaLabel: 'About OrbitX', link: '/about' },
        { label: 'Events', ariaLabel: 'OrbitX Events', link: '/events' },
        { label: 'Members', ariaLabel: 'Our Team', link: '/members' },
        { label: 'Recruitment', ariaLabel: 'Join OrbitX', link: '/recruitment' },
        { label: 'Merchandise', ariaLabel: 'OrbitX Merch', link: '/merch' },
        { label: 'Blog & News', ariaLabel: 'Blog & Dispatches', link: '/blogs' },
        { label: 'Contact', ariaLabel: 'Contact Us', link: '/contact' },
        isAuthenticated
            ? { label: 'Dashboard', ariaLabel: 'User Dashboard', link: '/user-dashboard' }
            : { label: 'Log In', ariaLabel: 'Log In to OrbitX', link: '/login' },
    ];

    const mobileSocialItems: StaggeredMenuSocialItem[] = [
        { label: 'Instagram', link: 'https://www.instagram.com/orbitx_zcoer/' },
        { label: 'LinkedIn', link: 'https://www.linkedin.com/company/orbitx-zcoer/' },
    ];

    return (
        <nav className="navbar" role="navigation" aria-label="Main Navigation">
            {/* SpaceX-style dimming backdrop overlay */}
            <div className={`navbar-backdrop-overlay ${dropdownActive ? 'visible' : ''}`} />

            <div className="navbar-container">
                {/* Left Side: Logo */}
                <Link to="/" className="navbar-logo-wrapper" onClick={handleLogoClick} aria-label="OrbitX Home">
                    <img
                        src={theme === 'light' ? '/favicon/Logo-Black.png' : '/favicon/Logo-White.png'}
                        alt="OrbitX"
                        className="navbar-logo-img"
                    />
                </Link>

                {/* Hamburger Toggle Button (Visible below 1280px) */}
                        <button
                            className={`navbar-hamburger ${menuOpen ? 'open' : ''}`}
                            onClick={toggleMenu}
                            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                            aria-expanded={menuOpen}
                            type="button"
                        >
                            <span className="hamburger-line" />
                            <span className="hamburger-line" />
                            <span className="hamburger-line" />
                        </button>

                        {/* Desktop Navigation Links */}
                        <div className="navbar-links">
                    <div className="navbar-links-main">
                        <Link to="/" className="navbar-link" onClick={closeMenu}>
                            Home
                        </Link>
                        <Link to="/about" className="navbar-link" onClick={closeMenu}>
                            About
                        </Link>
                        <Link to="/events" className="navbar-link" onClick={closeMenu}>
                            Events
                        </Link>
                        <Link to="/members" className="navbar-link" onClick={closeMenu}>
                            Members
                        </Link>

                        {/* Explore Item with Dropdown */}
                        <div
                            className={`navbar-item-with-dropdown ${dropdownActive ? 'active' : ''}`}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <a
                                href="#explore"
                                className="navbar-link navbar-dropdown-trigger"
                                onClick={handleDropdownClick}
                            >
                                Explore <span className="mobile-only-caret" aria-hidden="true">▼</span>
                            </a>

                            <div className={`navbar-dropdown-menu ${dropdownActive ? 'open' : ''}`}>
                                <Link
                                    to="/recruitment"
                                    className="dropdown-item"
                                    onClick={closeMenu}
                                >
                                    Recruitment
                                </Link>
                                <Link to="/merch" className="dropdown-item" onClick={closeMenu}>
                                    Merchandise
                                </Link>
                                <Link to="/blogs" className="dropdown-item" onClick={closeMenu}>
                                    Blog &amp; Dispatches
                                </Link>
                                <Link to="/contact" className="dropdown-item" onClick={closeMenu}>
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Auth / Dashboard section */}
                    <div className="navbar-auth-section">
                        {isAuthenticated ? (
                            <Link to="/user-dashboard" className="navbar-link" onClick={closeMenu}>
                                Dashboard
                            </Link>
                        ) : (
                            <Link to="/login" className="navbar-link navbar-login-link" onClick={closeMenu}>
                                Log In
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Staggered Menu Component */}
            <StaggeredMenu
                isOpen={menuOpen}
                onClose={closeMenu}
                showToggle={false}
                position="right"
                items={mobileMenuItems}
                socialItems={mobileSocialItems}
                displaySocials={true}
                displayItemNumbering={true}
                colors={['#1c1033', '#3b1d7d', '#5227FF']}
                accentColor="#7c3aed"
                isFixed={true}
                className="navbar-staggered-menu"
            />
        </nav>
    );
}

