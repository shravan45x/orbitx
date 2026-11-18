import { Link } from 'react-router-dom';
import './Home.css';
import Footer from '../../components/layout/Footer';
import ScrollReveal from '../../components/scroll/ScrollReveal';

// Authentic OrbitX Archival Assets (High-contrast graphite scientific lithographs)
import orbitxObservatoryStation from '../../assets/images/archival/orbitx-observatory-station.png';
import orbitxOpticsBlueprint from '../../assets/images/archival/orbitx-optics-blueprint.png';
import orbitxPlatePhotometry from '../../assets/images/archival/orbitx-plate-photometry.png';
import orbitxPlateCorona from '../../assets/images/archival/orbitx-plate-corona.png';
import orbitxFivePlatesStrip from '../../assets/images/archival/orbitx-five-plates-strip.png';

export default function Home() {
    return (
        <main className="home-page">
            {/* ===== Archival Hero Section (3-Panel Triptych Layout) ===== */}
            <section className="hero" aria-label="Hero Section">
                <div className="hero__container">
                    <div className="hero__left-col">
                        <ScrollReveal direction="up" duration={0.6}>
                            <p className="hero__micro-quote">
                                Our synergy’s dedication to the cosmic expanse reflects a deep reverence for observational science, uniting student observatories and astrophysicists across India.
                            </p>
                        </ScrollReveal>

                        <ScrollReveal direction="up" delay={0.15} duration={0.7}>
                            <div className="hero__headline-block">
                                <h1 className="hero__title">
                                    WE ARE MADE OF QUESTIONS.<br />
                                    THE UNIVERSE IS FULL OF THEM.
                                </h1>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal direction="up" delay={0.25} duration={0.6}>
                            <div className="hero__sub-block">
                                <p className="hero__description">
                                    OrbitX exists somewhere between the two. Every generation looks beyond the horizon. Ours gets to look beyond the sky.
                                </p>
                                <div className="hero__ctas">
                                    <Link to="/about" className="hero__cta hero__cta--primary">
                                        Know More
                                    </Link>
                                    <Link to="/login" className="hero__cta hero__cta--secondary">
                                        Sign In
                                    </Link>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>

                    <div className="hero__right-col">
                        <ScrollReveal direction="up" delay={0.12} duration={0.8}>
                            <div className="hero__triptych-frame">
                                <img
                                    src="/hero_section.png"
                                    alt="OrbitX deep space exploration"
                                    className="hero__triptych-img"
                                    loading="eager"
                                />
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* ===== Inquiry Section (Segmented Optics Blueprint Background + Dual Plates) ===== */}
            <section className="inquiry" aria-label="Questions Section">
                <div className="inquiry__bg" aria-hidden="true">
                    <img
                        src={orbitxOpticsBlueprint}
                        alt=""
                        className="inquiry__bg-img"
                        loading="lazy"
                    />
                </div>

                <div className="inquiry__container">
                    <div className="inquiry__content-col">
                        <ScrollReveal direction="up" delay={0.1} duration={0.6}>
                            <div className="inquiry__header">
                                <span className="inquiry__tag">DISPERSION OF KNOWLEDGE</span>
                                <h2 className="inquiry__title">
                                    “SO, WHAT DO WE DO WITH THE QUESTIONS?”
                                </h2>
                                <p className="inquiry__text">
                                    By democratizing telescope instrumentation, astrophysics radio receivers, and open astronomical data, we empower collegiate observers with world-class observational tools.
                                </p>
                            </div>
                        </ScrollReveal>

                        <div className="inquiry__plates-row">
                            <ScrollReveal direction="up" delay={0.18} duration={0.6}>
                                <div className="inquiry__sub-plate">
                                    <img
                                        src={orbitxPlatePhotometry}
                                        alt="High-energy synchrotron core spectral photometry"
                                        className="inquiry__sub-plate-img"
                                    />
                                </div>
                            </ScrollReveal>

                            <ScrollReveal direction="up" delay={0.26} duration={0.6}>
                                <div className="inquiry__sub-plate">
                                    <img
                                        src={orbitxPlateCorona}
                                        alt="Solar corona occultation"
                                        className="inquiry__sub-plate-img"
                                        loading="lazy"
                                    />
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== Dedicated Community Stellar Wire Header Section ===== */}
            <section className="wire-divider" aria-label="Community Stellar Transition">
                <div className="wire-divider__container">
                    <ScrollReveal direction="up" duration={0.6}>
                        <div className="spanned-wire-header">
                            <span className="spanned-wire-word">COMMUNITY</span>
                            <div className="spanned-wire-line" aria-hidden="true" />
                            <span className="spanned-wire-word">STELLAR</span>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* ===== Community Section (Field Station Background) ===== */}
            <section className="synergy" aria-label="Community Section">
                <div className="synergy__bg" aria-hidden="true">
                    <img
                        src={orbitxObservatoryStation}
                        alt=""
                        className="synergy__bg-img"
                        loading="lazy"
                    />
                </div>

                <div className="synergy__container">
                    <div className="synergy__body">
                        <div className="synergy__left">
                            <ScrollReveal direction="up" delay={0.1} duration={0.6}>
                                <span className="synergy__subtag">COMMITTED TO RESEARCH &amp; OUTREACH</span>
                                <h3 className="synergy__heading">
                                    “YOU DON'T EXPLORE ALONE.”
                                </h3>
                                <p className="synergy__description">
                                    At OrbitX, research excellence is woven into every chapter of our collective network. We recognize the intrinsic value of student-led discovery and foster it with telescope collimation workshops, astrophysics research, and shared dark-sky excursions.
                                </p>
                                <div className="synergy__actions">
                                    <Link to="/members" className="synergy__link">
                                        MEET THE TEAM <span>→</span>
                                    </Link>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== What's Happening / Currently in Orbit (Cassini Saturn Monument) ===== */}
            <section className="happening" aria-label="What's Happening in Orbit">
                <div className="happening__container">
                    <ScrollReveal direction="up" duration={0.6}>
                        <div className="happening__header-block">
                            <span className="happening__top-badge">ESTABLISHED FOR THE STARS</span>
                            <h2 className="happening__headline">
                                WE HAVE BEEN BUILDING THE HORIZONS OF STUDENT ASTRONOMY FOR <span className="happening__highlight">EVERY GENERATION</span>
                            </h2>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal direction="up" delay={0.12} duration={0.8}>
                        <div className="happening__monument-wrap">
                            <video
                                src="/moon_timelaps.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                                disablePictureInPicture
                                tabIndex={-1}
                                aria-hidden="true"
                                className="happening__monument-video"
                            />
                        </div>
                    </ScrollReveal>

                    <div className="happening__events-strip">
                        <ScrollReveal direction="up" delay={0.16} duration={0.6}>
                            <article className="happening__mini-card">
                                <span className="happening__mini-tag">UPCOMING EVENT · APR 18</span>
                                <h3 className="happening__mini-title">Stargazing Night &amp; Astrophotography Workshop</h3>
                                <p className="happening__mini-desc">Planetary tracking, telescope collimation, and deep-sky imaging from observatory grounds.</p>
                            </article>
                        </ScrollReveal>

                        <ScrollReveal direction="up" delay={0.22} duration={0.6}>
                            <article className="happening__mini-card">
                                <span className="happening__mini-tag">FEATURED PROJECT · MARCH 2026</span>
                                <h3 className="happening__mini-title">Project Antariksh: High-Altitude CanSat</h3>
                                <p className="happening__mini-desc">Atmospheric sensor payload testing and recovery in coordination with student clubs.</p>
                            </article>
                        </ScrollReveal>

                        <ScrollReveal direction="up" delay={0.28} duration={0.6}>
                            <article className="happening__mini-card">
                                <span className="happening__mini-tag">RECENT RECAP · VLF RECEIVER</span>
                                <h3 className="happening__mini-title">Solar Flare Radio Astronomy Session</h3>
                                <p className="happening__mini-desc">Sudden ionospheric disturbance measurements capturing M-class solar flares.</p>
                            </article>
                        </ScrollReveal>
                    </div>

                    <ScrollReveal direction="up" delay={0.2} duration={0.6}>
                        <div className="happening__actions">
                            <Link to="/events" className="happening__cta">
                                VIEW ALL EVENTS →
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* ===== Credibility & Reach / Our Alliance (5-Plate Archival Strip) ===== */}
            <section className="alliance" aria-label="Our Alliance Section">
                <div className="alliance__container">
                    <div className="alliance__top-row">
                        <ScrollReveal direction="up" duration={0.6}>
                            <p className="alliance__subtext">
                                Their collective passion transforms every campus rooftop into a cosmic window, cultivating timeless fascination and rigorous scientific literacy.
                            </p>
                        </ScrollReveal>
                        <ScrollReveal direction="up" delay={0.1} duration={0.6}>
                            <Link to="/events" className="alliance__archive-link">
                                SEE ARCHIVE ↗
                            </Link>
                        </ScrollReveal>
                    </div>

                    <ScrollReveal direction="up" delay={0.15} duration={0.8}>
                        <div className="alliance__strip-frame">
                            <img
                                src={orbitxFivePlatesStrip}
                                alt="Five authentic archival astronomical plates: Hubble, Saturn, Black Hole Accretion, Emission Nebula, JWST Mirror"
                                className="alliance__strip-img"
                                loading="lazy"
                            />
                        </div>
                    </ScrollReveal>

                    <ScrollReveal direction="up" delay={0.2} duration={0.6}>
                        <div className="alliance__stats-bar">
                            <div className="alliance__stat-unit">
                                <strong>1000+</strong>
                                <span>Explorers</span>
                            </div>
                            <span className="alliance__stat-dot">·</span>
                            <div className="alliance__stat-unit">
                                <strong>10+</strong>
                                <span>Departments</span>
                            </div>
                            <span className="alliance__stat-dot">·</span>
                            <div className="alliance__stat-unit">
                                <strong>50+</strong>
                                <span>Members</span>
                            </div>
                            <span className="alliance__stat-dot">·</span>
                            <div className="alliance__stat-unit">
                                <strong>40+</strong>
                                <span>Events</span>
                            </div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal direction="up" delay={0.25} duration={0.7}>
                        <div className="spanned-wire-header alliance__footer-wire">
                            <span className="spanned-wire-word">OUR</span>
                            <div className="spanned-wire-line" aria-hidden="true" />
                            <span className="spanned-wire-word">ALLIANCE</span>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <Footer />
        </main>
    );
}
