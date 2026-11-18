import { useEffect } from 'react';
import Footer from '../../components/layout/Footer';
import './Blog.css';

export default function Blog() {
    useEffect(() => {
        document.title = 'Blogs | OrbitX';
    }, []);

    return (
        <div className="blog-page">
            <main className="blog-coming-soon">
                <h1 className="blog-coming-soon__text">BLOGS COMING SOON...</h1>
            </main>
            <Footer />
        </div>
    );
}
