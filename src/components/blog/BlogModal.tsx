import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { BlogPost } from '../../types/blog';
import { useToast } from '../toast/Toast';
import './BlogModal.css';

interface BlogModalProps {
    post: BlogPost | null;
    onClose: () => void;
}

export default function BlogModal({ post, onClose }: BlogModalProps) {
    const { showToast } = useToast();

    // Lock body and html scroll and register escape key listener
    useEffect(() => {
        if (!post) return;

        const originalBodyOverflow = document.body.style.overflow;
        const originalHtmlOverflow = document.documentElement.style.overflow;
        const originalTouchAction = document.body.style.touchAction;

        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = originalBodyOverflow;
            document.documentElement.style.overflow = originalHtmlOverflow;
            document.body.style.touchAction = originalTouchAction;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [post, onClose]);

    if (!post) return null;

    const handleCopyLink = () => {
        const url = `${window.location.origin}/blogs?article=${post.slug}`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url)
                .then(() => showToast('Article link copied to clipboard', 'info'))
                .catch(() => showToast('Could not copy link', 'error'));
        }
    };

    return createPortal(
        <div 
            className="blog-modal-backdrop" 
            onClick={onClose}
            onWheel={(e) => {
                if (e.target === e.currentTarget) e.preventDefault();
            }}
            onTouchMove={(e) => {
                if (e.target === e.currentTarget) e.preventDefault();
            }}
            role="presentation"
        >
            <div 
                className="blog-modal-container"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="blog-modal-title"
            >
                {/* Modal Top Bar */}
                <div className="blog-modal-topbar">
                    <div className="blog-modal-topbar__meta">
                        <span className="blog-modal-badge">{post.category}</span>
                        <span className="blog-modal-date">{post.publishedAt}</span>
                        <span className="blog-modal-readtime">{post.readTime}</span>
                    </div>

                    <div className="blog-modal-topbar__actions">
                        <button 
                            type="button" 
                            className="blog-modal-share-btn"
                            onClick={handleCopyLink}
                            aria-label="Share article link"
                            title="Copy link"
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                            </svg>
                            <span>Share</span>
                        </button>

                        <button 
                            type="button" 
                            className="blog-modal-close-btn" 
                            onClick={onClose}
                            aria-label="Close article reader"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Scrollable Reader Body */}
                <div className="blog-modal-scrollable">
                    <header className="blog-modal-header">
                        <h2 id="blog-modal-title" className="blog-modal-title">
                            {post.title}
                        </h2>

                        <p className="blog-modal-subtitle">{post.subtitle}</p>

                        <div className="blog-modal-author-strip">
                            <div className="blog-modal-author-avatar" aria-hidden="true">
                                {post.author.name.charAt(0)}
                            </div>
                            <div className="blog-modal-author-details">
                                <strong className="blog-modal-author-name">{post.author.name}</strong>
                                <span className="blog-modal-author-role">
                                    {post.author.role} • {post.author.team}
                                </span>
                            </div>
                        </div>
                    </header>

                    {/* Featured Image */}
                    <div className="blog-modal-cover">
                        <img 
                            src={post.coverImage} 
                            alt={post.title} 
                            className="blog-modal-cover-img"
                        />
                    </div>

                    {/* Article Content */}
                    <article className="blog-modal-content">
                        <div className="blog-modal-intro">
                            <p>{post.content.intro}</p>
                        </div>

                        {post.content.sections.map((section, idx) => (
                            <section key={idx} className="blog-modal-section">
                                <h3 className="blog-modal-section-heading">{section.heading}</h3>
                                <p className="blog-modal-section-body">{section.body}</p>
                                
                                {section.highlight && (
                                    <blockquote className="blog-modal-quote">
                                        <div className="blog-modal-quote-accent" aria-hidden="true" />
                                        <p>{section.highlight}</p>
                                    </blockquote>
                                )}
                            </section>
                        ))}

                        <div className="blog-modal-conclusion">
                            <h3 className="blog-modal-section-heading">Consortium Summary</h3>
                            <p>{post.content.conclusion}</p>
                        </div>

                        {/* Tags */}
                        <div className="blog-modal-tags-container">
                            <span className="blog-modal-tags-label">Topics:</span>
                            <div className="blog-modal-tags">
                                {post.tags.map(t => (
                                    <span key={t} className="blog-modal-tag">#{t}</span>
                                ))}
                            </div>
                        </div>
                    </article>

                    {/* Modal Footer */}
                    <footer className="blog-modal-footer">
                        <div className="blog-modal-footer-attribution">
                            Published by <strong>OrbitX Consortium</strong>, Zeal College of Engineering and Research, Pune.
                        </div>
                        <button 
                            type="button" 
                            className="blog-modal-footer-close"
                            onClick={onClose}
                        >
                            Return to Dispatches
                        </button>
                    </footer>
                </div>
            </div>
        </div>,
        document.body
    );
}
