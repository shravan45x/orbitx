import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/layout/Footer';
import ScrollReveal from '../../components/scroll/ScrollReveal';
import './About.css';

export default function About() {
    useEffect(() => {
        document.title = 'About | OrbitX — Astrophysics & Astronomy Consortium, ZCOER Pune';
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute(
            'content',
            'OrbitX is the official astrophysics & astronomy consortium of Zeal College of Engineering and Research, Pune — a student-led community that observes, researches and builds.'
        );
    }, []);

    return (
        <main className="about-page">
            {/* ───── SECTION A: HERO ───── */}
            <section className="about-section about-hero" aria-labelledby="about-hero-title">
                <div className="about-container about-hero__container">
                    <div className="about-hero__left-col">
                        <ScrollReveal direction="up" delay={0} duration={0.7}>
                            <div className="about-hero__headline-block">
                                <h1 id="about-hero-title" className="about-hero__title">
                                    WHERE CURIOSITY<br />
                                    MEETS THE COSMOS.
                                </h1>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal direction="up" delay={0.22} duration={0.6}>
                            <div className="about-hero__sub-block">
                                <p className="about-body about-hero__lead">
                                    OrbitX is the official astrophysics &amp; astronomy consortium of Zeal College of Engineering and Research, Pune — a student-led community that observes the sky, researches what it finds, and builds the tools to go further.
                                </p>
                                <div className="about-ctas">
                                    <Link to="/join" className="about-btn about-btn--primary">
                                        Join OrbitX
                                    </Link>
                                    <Link to="/events" className="about-btn about-btn--secondary">
                                        View Events
                                    </Link>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>

                    <div className="about-hero__right-col">
                        <ScrollReveal direction="up" delay={0.15} duration={0.8}>
                            <div className="about-hero__triptych-frame">
                                <img
                                    src="/about-hero-img.png"
                                    alt="OrbitX astrophysical exploration"
                                    className="about-hero__triptych-img"
                                    loading="eager"
                                />
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* ───── SECTION B: WHO WE ARE ───── */}
            <section className="about-section about-story" aria-labelledby="about-story-title">
                <div className="about-story__bg" aria-hidden="true">
                    <img
                        src="/about/about-story.webp"
                        alt=""
                        className="about-image about-story__bg-img"
                        loading="lazy"
                    />
                </div>

                <div className="about-container">
                    <div className="about-two-col">
                        <div className="about-two-col__text">
                            <ScrollReveal direction="up" delay={0} duration={0.5}>
                                <span className="about-eyebrow">WHO WE ARE</span>
                            </ScrollReveal>

                            <ScrollReveal direction="up" delay={0.08} duration={0.5}>
                                <h2 id="about-story-title" className="about-heading-2">
                                    “EVERY OBSERVATORY STARTS WITH ONE CURIOUS STUDENT.”
                                </h2>
                            </ScrollReveal>

                            <ScrollReveal direction="up" delay={0.16} duration={0.5}>
                                <div className="about-story__prose">
                                    <p className="about-body">
                                        OrbitX brings together students from across Zeal College of Engineering and Research who share one habit: looking up and asking why. We are a consortium that spans departments, disciplines and experience levels, from first-time stargazers to students building flight hardware.
                                    </p>
                                    <p className="about-body">
                                        We run telescope collimation workshops, astrophotography nights and dark-sky excursions. We study solar flares through radio astronomy and test and recover high-altitude CanSat payloads. Everything we do is hands-on and built around one belief: access to world-class observational tools should not be a privilege.
                                    </p>
                                </div>
                            </ScrollReveal>

                            <ScrollReveal direction="up" delay={0.24} duration={0.5}>
                                <div className="about-story__action">
                                    <Link to="/members" className="about-text-link">
                                        MEET THE TEAM →
                                    </Link>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </div>
            </section>

            {/* ───── SECTION C: PURPOSE ───── */}
            <section className="about-section about-purpose" aria-labelledby="about-purpose-title">
                <div className="about-container">
                    <ScrollReveal direction="up" delay={0} duration={0.5}>
                        <div className="spanned-wire-header about-purpose__header" id="about-purpose-title">
                            <span className="spanned-wire-word">OUR</span>
                            <div className="spanned-wire-line" aria-hidden="true" />
                            <span className="spanned-wire-word">PURPOSE</span>
                        </div>
                    </ScrollReveal>

                    <div className="about-purpose__grid">
                        <ScrollReveal direction="up" delay={0.08} duration={0.5}>
                            <article className="about-card">
                                <span className="about-card__meta">MISSION</span>
                                <h3 className="about-card__title">DEMOCRATIZE THE UNIVERSE.</h3>
                                <p className="about-body about-card__body">
                                    To make observational astronomy, astrophysics research and space technology accessible to every student through shared instruments, open data and hands-on learning.
                                </p>
                            </article>
                        </ScrollReveal>

                        <ScrollReveal direction="up" delay={0.16} duration={0.5}>
                            <article className="about-card">
                                <span className="about-card__meta">VISION</span>
                                <h3 className="about-card__title">A CAMPUS THAT NEVER STOPS LOOKING UP.</h3>
                                <p className="about-body about-card__body">
                                    A college where any curious student can observe, research and build, and where student-led discovery contributes to the wider scientific community across India.
                                </p>
                            </article>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* ───── SECTION D: THE NAME ───── */}
            <section className="about-section about-decoded" aria-labelledby="about-decoded-title">
                <div className="about-container">
                    <ScrollReveal direction="up" delay={0} duration={0.5}>
                        <div className="spanned-wire-header about-decoded__header" id="about-decoded-title">
                            <span className="spanned-wire-word">ORBITX</span>
                            <div className="spanned-wire-line" aria-hidden="true" />
                            <span className="spanned-wire-word">DECODED</span>
                        </div>
                        <p className="about-body about-decoded__intro">
                            Our name is our method. Six words that describe how we work.
                        </p>
                    </ScrollReveal>

                    <div className="about-decoded__rows">
                        {/* O */}
                        <ScrollReveal direction="up" delay={0.04} duration={0.5}>
                            <div className="about-decoded__row">
                                <div className="about-decoded__primary">
                                    <span className="about-decoded__letter">O</span>
                                    <span className="about-decoded__word">OBSERVATION</span>
                                </div>
                                <p className="about-decoded__desc">
                                    Stargazing nights, astrophotography and planetary tracking from observatory grounds.
                                </p>
                            </div>
                        </ScrollReveal>

                        {/* R */}
                        <ScrollReveal direction="up" delay={0.08} duration={0.5}>
                            <div className="about-decoded__row">
                                <div className="about-decoded__primary">
                                    <span className="about-decoded__letter">R</span>
                                    <span className="about-decoded__word">RESEARCH</span>
                                </div>
                                <p className="about-decoded__desc">
                                    Astrophysics research and radio astronomy, from VLF receiver measurements to solar flare analysis.
                                </p>
                            </div>
                        </ScrollReveal>

                        {/* B */}
                        <ScrollReveal direction="up" delay={0.12} duration={0.5}>
                            <div className="about-decoded__row">
                                <div className="about-decoded__primary">
                                    <span className="about-decoded__letter">B</span>
                                    <span className="about-decoded__word">BUILDING</span>
                                </div>
                                <p className="about-decoded__desc">
                                    Hands-on instrumentation: telescope collimation, radio receivers and high-altitude CanSat payloads.
                                </p>
                            </div>
                        </ScrollReveal>

                        {/* I */}
                        <ScrollReveal direction="up" delay={0.16} duration={0.5}>
                            <div className="about-decoded__row">
                                <div className="about-decoded__primary">
                                    <span className="about-decoded__letter">I</span>
                                    <span className="about-decoded__word">INNOVATION</span>
                                </div>
                                <p className="about-decoded__desc">
                                    Open astronomical data and low-cost tools that put world-class observation within reach of every student.
                                </p>
                            </div>
                        </ScrollReveal>

                        {/* T */}
                        <ScrollReveal direction="up" delay={0.20} duration={0.5}>
                            <div className="about-decoded__row">
                                <div className="about-decoded__primary">
                                    <span className="about-decoded__letter">T</span>
                                    <span className="about-decoded__word">TECHNOLOGY</span>
                                </div>
                                <p className="about-decoded__desc">
                                    Where engineering meets astronomy: sensors, software and instruments built by students, for science.
                                </p>
                            </div>
                        </ScrollReveal>

                        {/* X */}
                        <ScrollReveal direction="up" delay={0.24} duration={0.5}>
                            <div className="about-decoded__row">
                                <div className="about-decoded__primary">
                                    <span className="about-decoded__letter">X</span>
                                    <span className="about-decoded__word">eXPLORATION</span>
                                </div>
                                <p className="about-decoded__desc">
                                    Dark-sky excursions, shared journeys and the curiosity to go beyond the horizon.
                                </p>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* ───── SECTION E: BY THE NUMBERS ───── */}
            <section className="about-section about-numbers" aria-label="By the numbers">
                <div className="about-container">
                    <ScrollReveal direction="up" delay={0} duration={0.5}>
                        <div className="about-stats-bar">
                            <div className="about-stat-unit">
                                <strong>1000+</strong>
                                <span>EXPLORERS</span>
                            </div>
                            <span className="about-stat-dot" aria-hidden="true">·</span>
                            <div className="about-stat-unit">
                                <strong>10+</strong>
                                <span>DEPARTMENTS</span>
                            </div>
                            <span className="about-stat-dot" aria-hidden="true">·</span>
                            <div className="about-stat-unit">
                                <strong>50+</strong>
                                <span>MEMBERS</span>
                            </div>
                            <span className="about-stat-dot" aria-hidden="true">·</span>
                            <div className="about-stat-unit">
                                <strong>40+</strong>
                                <span>EVENTS</span>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* ───── SECTION F: JOIN (CLOSING CTA) ───── */}
            <section className="about-section about-cta" aria-labelledby="about-cta-title">
                <div className="about-cta__bg" aria-hidden="true">
                    <img
                        src="/about/about-cta.webp"
                        alt=""
                        className="about-image about-cta__bg-img"
                        loading="lazy"
                    />
                </div>

                <div className="about-container">
                    <div className="about-two-col about-cta__layout">
                        <div className="about-two-col__text about-cta__text">
                            <ScrollReveal direction="up" delay={0} duration={0.5}>
                                <span className="about-eyebrow">JOIN THE CONSORTIUM</span>
                            </ScrollReveal>

                            <ScrollReveal direction="up" delay={0.08} duration={0.5}>
                                <h2 id="about-cta-title" className="about-heading-2">
                                    “THE SKY IS BIG ENOUGH FOR EVERYONE.”
                                </h2>
                            </ScrollReveal>

                            <ScrollReveal direction="up" delay={0.16} duration={0.5}>
                                <p className="about-body">
                                    Whether you have never touched a telescope or have already built a receiver, there is a place for you at OrbitX.
                                </p>
                            </ScrollReveal>

                            <ScrollReveal direction="up" delay={0.24} duration={0.5}>
                                <div className="about-ctas">
                                    <Link to="/join" className="about-btn about-btn--primary">
                                        Join OrbitX
                                    </Link>
                                    <a
                                        href="mailto:contact.orbitx@zealeducation.com"
                                        className="about-btn about-btn--secondary"
                                    >
                                        Contact Us
                                    </a>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
