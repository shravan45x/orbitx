import { Link } from 'react-router-dom';
import './JoinCTA.css';

export default function JoinCTA() {

    return (
        <section className="join-cta">
            <div className="join-cta__glow"></div>
            <div className="join-cta__content">
                <h2 className="join-cta__heading">Ready to Explore the Cosmos?</h2>
                <p className="join-cta__subheading">
                    Join OrbitX and become part of a community passionate about space, science, and discovery.
                </p>
                <div className="join-cta__buttons">
                    <Link to="/recruitment" className="join-cta__btn join-cta__btn--primary">
                        Join OrbitX
                        <span className="join-cta__btn-arrow">→</span>
                    </Link>
                    <Link to="/about" className="join-cta__btn join-cta__btn--secondary">
                        Learn More
                    </Link>
                </div>
            </div>
        </section>
    );
}
