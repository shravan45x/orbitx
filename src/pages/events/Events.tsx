import { useEffect } from 'react';
import Footer from '../../components/layout/Footer';
import './Events.css';

export default function Events() {
    useEffect(() => {
        document.title = 'Events | OrbitX';
    }, []);

    return (
        <div className="events-page">
            <main className="events-coming-soon">
                <h1 className="events-coming-soon__text">EVENTS WILL BE COMING SOON</h1>
            </main>
            <Footer />
        </div>
    );
}
