import React from 'react';
import type { EventCardProps } from './types';
import { parseEventDate } from './dateUtils';
import './EventCard.css';

export default function EventCard({
    event,
    onClick,
    onRegisterClick,
    isRegistered,
    onDownloadPass
}: EventCardProps) {
    const parsedDate = parseEventDate(event.date);
    const hasImage = event.images && event.images.length > 0;
    const isFree = !event.amount || event.amount === 0;
    const priceBadgeText = isFree ? 'FREE' : `₹${event.amount}`;
    const displayType = (event.type || 'Workshop').toUpperCase();
    const venueText = event.venue || 'Zeal College, Pune';

    // Format capacity display
    const capacityText = event.capacity
        ? (typeof event.capacity === 'number' ? `${event.capacity} spots` : String(event.capacity))
        : (event.mode === 'Online' ? 'Unlimited spots' : '120 spots');

    const handleClick = () => {
        onClick(event);
    };

    const handleRegisterClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (event.isPast || !event.registrationOpen) return;
        if (onRegisterClick) {
            onRegisterClick(event);
        }
    };

    const handleDownloadPass = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDownloadPass) {
            onDownloadPass(event);
        }
    };

    const renderActionBtn = () => {
        if (event.isPast) {
            return (
                <span className="event-card__action-label event-card__action-label--closed">
                    Completed
                </span>
            );
        }

        if (isRegistered) {
            return (
                <button
                    type="button"
                    className="event-card__cta-btn event-card__cta-btn--download"
                    onClick={handleDownloadPass}
                    title="Download entry pass"
                >
                    Pass →
                </button>
            );
        }

        if (event.registrationOpen) {
            return (
                <button
                    type="button"
                    className="event-card__cta-btn"
                    onClick={handleRegisterClick}
                >
                    Register →
                </button>
            );
        }

        return (
            <span className="event-card__action-label event-card__action-label--closed">
                Closed
            </span>
        );
    };

    return (
        <article
            className={`event-card ${event.isPast ? 'event-card--past' : ''}`}
            onClick={handleClick}
            tabIndex={0}
            role="button"
            aria-label={`${event.title} - ${displayType}`}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick();
                }
            }}
        >
            {/* Top Image with Floating Pill Badges */}
            <div className="event-card__media">
                {hasImage ? (
                    <img
                        src={event.images![0]}
                        alt={event.title}
                        className="event-card__img"
                        loading="lazy"
                    />
                ) : (
                    <div className="event-card__img-placeholder">
                        <span className="event-card__img-placeholder-icon">✦</span>
                    </div>
                )}

                <div className="event-card__badges-overlay">
                    <span className="event-card__badge-pill event-card__badge-pill--price">
                        {priceBadgeText}
                    </span>
                </div>
            </div>

            {/* Middle 2-Column: Date on Left, Title & Summary on Right */}
            <div className="event-card__body">
                <div className="event-card__date-col" aria-label={`Date: ${parsedDate.fullDate}`}>
                    <span className="event-card__date-month">{parsedDate.monthShort}</span>
                    <strong className="event-card__date-day">{parsedDate.day}</strong>
                    <span className="event-card__date-year">{parsedDate.year}</span>
                </div>

                <div className="event-card__info-col">
                    <h3 className="event-card__title" title={event.title}>{event.title}</h3>
                    <p className="event-card__summary">
                        {event.description}
                    </p>
                </div>
            </div>

            {/* Bottom Hairline Divider & Meta Bar */}
            <div className="event-card__footer">
                <div className="event-card__meta-group">
                    <div className="event-card__meta-item event-card__meta-item--venue" title={venueText}>
                        <svg className="event-card__meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span className="event-card__meta-text">{venueText}</span>
                    </div>

                    <div className="event-card__meta-item event-card__meta-item--capacity" title={capacityText}>
                        <svg className="event-card__meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        <span className="event-card__meta-text">{capacityText}</span>
                    </div>
                </div>

                <div className="event-card__action-wrap">
                    {renderActionBtn()}
                </div>
            </div>
        </article>
    );
}
