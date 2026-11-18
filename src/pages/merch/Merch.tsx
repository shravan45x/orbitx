import { useEffect } from 'react';
import Footer from '../../components/layout/Footer';
import './Merch.css';

export default function Merch() {
    useEffect(() => {
        document.title = 'Merchandise | OrbitX';
    }, []);

    return (
        <div className="merch-page">
            <main className="merch-coming-soon">
                <h1 className="merch-coming-soon__text">MERCH COMING SOON...</h1>
            </main>
            <Footer />
        </div>
    );
}
