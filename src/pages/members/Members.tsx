import { useState, useEffect } from 'react';
import './Members.css';
import ResponsiveGallery from '../../components/gallery/ResponsiveGallery';
import Footer from '../../components/layout/Footer';
import ScrollReveal from '../../components/scroll/ScrollReveal';
import { SearchInput, FilterDropdown } from '../../components/ui';

const TEAM_OPTIONS = [
    { value: 'All Teams', label: 'All Teams' },
    { value: 'President', label: 'President' },
    { value: 'Chairman', label: 'Chairman' },
    { value: 'Secretary', label: 'Secretary' },
    { value: 'Treasurer', label: 'Treasurer' },
    { value: 'Co-Treasurer', label: 'Co-Treasurer' },
    { value: 'Technical Team', label: 'Technical Team' },
    { value: 'Public Outreach Team', label: 'Public Outreach Team' },
    { value: 'Documentation Team', label: 'Documentation Team' },
    { value: 'Social Media & Editing Team', label: 'Social Media & Editing' },
    { value: 'Design & Innovation Team', label: 'Design & Innovation' },
    { value: 'Management & Operations Team', label: 'Management & Operations' }
];

export default function Members() {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [selectedTeam, setSelectedTeam] = useState('All Teams');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery.trim().toLowerCase());
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    return (
        <>
            <main className="members-page">
                {/* ===== Archival Members Hero ===== */}
                <section className="members-hero" aria-label="Members Hero">
                    <div className="members-hero__container">
                        {/* Left Column: 60% Mirrored Hero Image Grounded to Bottom Border */}
                        <div className="members-hero__left-col">
                            <ScrollReveal direction="up" delay={0.1} duration={0.7} className="members-hero__reveal-wrap">
                                <img
                                    src="/members-hero-img.png"
                                    alt="OrbitX Team Members and Researchers"
                                    className="members-hero__img"
                                    loading="eager"
                                />
                            </ScrollReveal>
                        </div>

                        {/* Right Column: Narrative & Identity */}
                        <div className="members-hero__right-col">
                            <ScrollReveal direction="up" duration={0.6}>
                                <span className="members-hero__tag">OUR TEAM &amp; RESEARCHERS</span>
                            </ScrollReveal>

                            <ScrollReveal direction="up" delay={0.15} duration={0.7}>
                                <div className="members-hero__headline-block">
                                    <h1 className="members-hero__title">
                                        TEAM MEMBERS<br />
                                        &amp; RESEARCHERS
                                    </h1>
                                </div>
                            </ScrollReveal>

                            <ScrollReveal direction="up" delay={0.25} duration={0.6}>
                                <div className="members-hero__sub-block">
                                    <p className="members-hero__subtitle">
                                        The students, engineers, and observational astronomers driving OrbitX projects, telemetry builds, and research across Zeal College of Engineering and Research, Pune.
                                    </p>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </section>

                {/* ===== Edge-to-Edge Console Bar (Docked Controls) ===== */}
                <section className="members-console-bar" aria-label="Member Search and Team Filter">
                    <div className="members-console-bar__container">
                        <div className="members-console-bar__left">
                            <SearchInput
                                value={searchQuery}
                                onChange={setSearchQuery}
                                placeholder="Search member by name..."
                            />
                        </div>

                        <div className="members-console-bar__right">
                            <div className="members-filter-group">
                                <span className="members-filter-label">TEAM:</span>
                                <FilterDropdown
                                    options={TEAM_OPTIONS}
                                    value={selectedTeam}
                                    onChange={setSelectedTeam}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== Dome Gallery Stage ===== */}
                <section className="members-gallery" data-theme="dark" aria-label="Member Gallery">
                    <ResponsiveGallery
                        autoRotate={true}
                        autoRotateSpeed={0.05}
                        grayscale={false}
                        maxVerticalRotationDeg={0}
                        searchQuery={debouncedQuery}
                        teamFilter={selectedTeam === 'All Teams' ? '' : selectedTeam}
                    />
                </section>
            </main>
            <Footer />
        </>
    );
}
