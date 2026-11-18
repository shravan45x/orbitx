import './ComingSoon.css';

export default function ComingSoon() {
    return (
        <main className="coming-soon-container">
            {/* Subtle space grid overlay */}
            <div className="coming-soon-grid-bg" aria-hidden="true" />

            <div className="coming-soon-content">
                <div className="coming-soon-badge">
                    <span className="coming-soon-pulse" />
                    MISSION STATUS: PRE-FLIGHT
                </div>

                <h1 className="coming-soon-title">
                    ORBITX OBSERVATORY
                </h1>

                <p className="coming-soon-subtitle">
                    The flagship digital headquarters for the OrbitX Aerospace & Astronomy Club at Zeal College of Engineering is currently under construction.
                </p>

                <div className="coming-soon-highlight-box">
                    <div className="coming-soon-highlight-header">
                        <span className="coming-soon-tag">PUBLIC ACCESS ACTIVE</span>
                        <span className="coming-soon-event">WED & SAT @ 07:00 PM IST</span>
                    </div>
                    <h2 className="coming-soon-highlight-title">
                        OrbitX Live Space Quiz Arena
                    </h2>
                    <p className="coming-soon-highlight-desc">
                        Our bi-weekly competitive space quiz is currently live and open to all students, astronomers, and space enthusiasts.
                    </p>
                    <a href="https://quiz.orbitx.zcoer.in" target="_blank" rel="noopener noreferrer" className="coming-soon-quiz-btn">
                        ENTER LIVE QUIZ ARENA →
                    </a>
                </div>

                <div className="coming-soon-footer-info">
                    <span>Zeal College of Engineering and Research, Pune</span>
                    <span>•</span>
                    <span>Official Club Portal</span>
                </div>
            </div>
        </main>
    );
}
