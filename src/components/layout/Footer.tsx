import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import './Footer.css';

export default function Footer() {
    const { theme } = useTheme();
    const [networkSpeed, setNetworkSpeed] = useState<string>('ONLINE');

    useEffect(() => {
        const updateConnection = () => {
            if (!navigator.onLine) {
                setNetworkSpeed('OFFLINE');
                return;
            }
            const nav = navigator as unknown as {
                connection?: {
                    downlink?: number;
                    addEventListener?: (type: string, listener: () => void) => void;
                    removeEventListener?: (type: string, listener: () => void) => void;
                };
            };
            const conn = nav.connection;
            if (conn && typeof conn.downlink === 'number') {
                setNetworkSpeed(`${conn.downlink} MBPS`);
            } else {
                setNetworkSpeed('ONLINE');
            }
        };

        updateConnection();
        window.addEventListener('online', updateConnection);
        window.addEventListener('offline', updateConnection);
        const nav = navigator as unknown as {
            connection?: {
                addEventListener?: (type: string, listener: () => void) => void;
                removeEventListener?: (type: string, listener: () => void) => void;
            };
        };
        nav.connection?.addEventListener?.('change', updateConnection);

        return () => {
            window.removeEventListener('online', updateConnection);
            window.removeEventListener('offline', updateConnection);
            nav.connection?.removeEventListener?.('change', updateConnection);
        };
    }, []);

    const handleScrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="orbitx-footer" role="contentinfo" aria-label="Site Footer">
            <div className="orbitx-footer__container">
                <div className="orbitx-footer__grid">
                    {/* Column 1: Brand */}
                    <div className="orbitx-footer__brand-col">
                        <Link to="/" className="orbitx-footer__logo-link" onClick={handleScrollTop} aria-label="Return to OrbitX Home">
                            <img
                                src={theme === 'light' ? '/favicon/Logo-Black.png' : '/favicon/Logo-White.png'}
                                alt="OrbitX"
                                className="orbitx-footer__logo-img"
                            />
                        </Link>
                        <p className="orbitx-footer__philosophy">
                            WHERE CURIOSITY MEETS THE COSMOS
                        </p>
                        <p className="orbitx-footer__subtext">
                            The official astrophysics &amp; astronomy consortium of Zeal College of Engineering and Research, Pune.
                        </p>
                    </div>

                    {/* Column 2: Pages */}
                    <nav className="orbitx-footer__nav-col" aria-label="Footer Navigation">
                        <h3 className="orbitx-footer__heading">PAGES</h3>
                        <ul className="orbitx-footer__list">
                            <li><Link to="/" className="orbitx-footer__link">HOME</Link></li>
                            <li><Link to="/about" className="orbitx-footer__link">ABOUT</Link></li>
                            <li><Link to="/events" className="orbitx-footer__link">EVENTS</Link></li>
                            <li><Link to="/blogs" className="orbitx-footer__link">BLOG</Link></li>
                            <li><Link to="/merch" className="orbitx-footer__link">MERCH</Link></li>
                        </ul>
                    </nav>

                    {/* Column 3: Community */}
                    <nav className="orbitx-footer__nav-col" aria-label="Footer Community">
                        <h3 className="orbitx-footer__heading">COMMUNITY</h3>
                        <ul className="orbitx-footer__list">
                            <li><Link to="/members" className="orbitx-footer__link">MEMBERS</Link></li>
                            <li><Link to="/join" className="orbitx-footer__link">JOIN US</Link></li>
                            <li><Link to="/dashboard" className="orbitx-footer__link">DASHBOARD</Link></li>
                            <li><Link to="/login" className="orbitx-footer__link">LOGIN</Link></li>
                        </ul>
                    </nav>

                    {/* Column 4: Connect */}
                    <div className="orbitx-footer__nav-col">
                        <h3 className="orbitx-footer__heading">CONNECT</h3>
                        <ul className="orbitx-footer__list">
                            <li>
                                <Link to="/contact" className="orbitx-footer__link">
                                    CONTACT US
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="mailto:contact.orbitx@zealeducation.com"
                                    className="orbitx-footer__link"
                                >
                                    contact.orbitx@zealeducation.com
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.instagram.com/orbitx_zcoer/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="orbitx-footer__link"
                                >
                                    INSTAGRAM ↗
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.linkedin.com/company/orbitx-zcoer/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="orbitx-footer__link"
                                >
                                    LINKEDIN ↗
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://maps.app.goo.gl/zr4Yg3uhrYabnjH49"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="orbitx-footer__link"
                                >
                                    ZEAL CAMPUS, PUNE ↗
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="orbitx-footer__bottom">
                    <div className="orbitx-footer__copyright">
                        © {new Date().getFullYear()} ORBITX ZCOER. ALL RIGHTS RESERVED.
                    </div>
                    <div className="orbitx-footer__network-status" aria-label={`Network: ${networkSpeed}`}>
                        <span>{networkSpeed}</span>
                    </div>
                </div>
            </div>

            {/* Bottom Full Form Banner */}
            <div className="footer-fullform-wrap">
                <div className="footer-fullform-text" aria-label="Observation Research Building Innovation &amp; Technology eXploration">
                    <span className="footer-word">OBSERVATION</span>
                    <span className="footer-word">RESEARCH</span>
                    <span className="footer-word">BUILDING</span>
                    <span className="footer-word">INNOVATION</span>
                    <span className="footer-word">&amp;</span>
                    <span className="footer-word">TECHNOLOGY</span>
                    <span className="footer-word"><span className="footer-word-lowercase">e</span>XPLORATION</span>
                </div>
            </div>
        </footer>
    );
}
