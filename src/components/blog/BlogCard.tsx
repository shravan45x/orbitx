import React from 'react';
import type { BlogPost } from '../../types/blog';
import './BlogCard.css';

interface BlogCardProps {
    post: BlogPost;
    onSelect: (post: BlogPost) => void;
}

export default function BlogCard({ post, onSelect }: BlogCardProps) {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(post);
        }
    };

    return (
        <article 
            className="blog-card"
            onClick={() => onSelect(post)}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-label={`Read article: ${post.title}`}
        >
            <div className="blog-card__media">
                <img 
                    src={post.coverImage} 
                    alt={post.title} 
                    className="blog-card__image"
                    loading="lazy" 
                />
                <div className="blog-card__meta-bar">
                    <span className="blog-card__category">{post.category}</span>
                    <span className="blog-card__read-time">{post.readTime}</span>
                </div>
            </div>

            <div className="blog-card__body">
                <div className="blog-card__timestamp">
                    <span className="blog-card__date">{post.publishedAt}</span>
                    {post.featured && <span className="blog-card__featured-badge">Featured</span>}
                </div>

                <h3 className="blog-card__title">{post.title}</h3>
                
                <p className="blog-card__summary">{post.summary}</p>

                <div className="blog-card__tags">
                    {post.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="blog-card__tag">
                            #{tag}
                        </span>
                    ))}
                </div>

                <div className="blog-card__footer">
                    <div className="blog-card__author">
                        <div className="blog-card__author-avatar" aria-hidden="true">
                            {post.author.name.charAt(0)}
                        </div>
                        <div className="blog-card__author-info">
                            <span className="blog-card__author-name">{post.author.name}</span>
                            <span className="blog-card__author-role">{post.author.team}</span>
                        </div>
                    </div>

                    <span className="blog-card__action" aria-hidden="true">
                        Read
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </span>
                </div>
            </div>
        </article>
    );
}
