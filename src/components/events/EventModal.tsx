import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { EventModalProps } from './types';
import { parseEventDate } from './dateUtils';
import './EventModal.css';

export default function EventModal({
    event,
    isClosing,
    onClose,
    onRegisterClick,
    isRegistered,
    onDownloadPass
}: EventModalProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showCalendarMenu, setShowCalendarMenu] = useState(false);

    useEffect(() => {
        const originalBodyOverflow = document.body.style.overflow;
        const originalHtmlOverflow = document.documentElement.style.overflow;
        const originalTouchAction = document.body.style.touchAction;

        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = originalBodyOverflow;
            document.documentElement.style.overflow = originalHtmlOverflow;
            document.body.style.touchAction = originalTouchAction;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const parsedDate = parseEventDate(event.date);
    const isFree = !event.amount || event.amount === 0;
    const priceText = isFree ? 'FREE' : `₹${event.amount}`;
    const displayType = (event.type || 'Workshop').toUpperCase();
    const typeModifier = event.type?.toLowerCase().replace(/\s+/g, '-') || 'workshop';
    const venueMain = event.venue || 'Zeal College, Pune';
    const venueSub = event.mode === 'Online'
        ? 'Online / Virtual Session'
        : (event.venueUrl ? 'Campus Facility (Maps ↗)' : 'Seminar Hall, Building A');

    const capacityMain = event.capacity
        ? (typeof event.capacity === 'number' ? `${event.capacity} spots` : String(event.capacity))
        : (event.mode === 'Online' ? 'Unlimited spots' : '120 spots');
    const capacitySub = event.isPast
        ? 'Session Concluded'
        : (event.registrationOpen ? 'Limited seats' : 'Full capacity');

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Parse time string to get hours/minutes
    const parseEventTime = (timeStr: string): { startHour: number; startMin: number; endHour: number; endMin: number } => {
        const parseTime = (t: string): { hour: number; min: number } => {
            const match = t.trim().match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
            if (!match) return { hour: 0, min: 0 };
            let hours = parseInt(match[1], 10);
            const minutes = parseInt(match[2], 10);
            const period = match[3].toUpperCase();
            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;
            return { hour: hours, min: minutes };
        };

        const parts = timeStr.split(' - ');
        const start = parseTime(parts[0] || '');
        const end = parts[1] ? parseTime(parts[1]) : { hour: start.hour + 2, min: start.min };
        return { startHour: start.hour, startMin: start.min, endHour: end.hour, endMin: end.min };
    };

    // Generate Google Calendar URL
    const openGoogleCalendar = () => {
        const dateStr = event.date.replace(/[^0-9]/g, '');
        let startTime = '000000';
        let endTime = '235959';

        if (event.time) {
            const times = parseEventTime(event.time);
            startTime = `${String(times.startHour).padStart(2, '0')}${String(times.startMin).padStart(2, '0')}00`;
            endTime = `${String(times.endHour).padStart(2, '0')}${String(times.endMin).padStart(2, '0')}00`;
        }

        const calendarUrl = new URL('https://calendar.google.com/calendar/render');
        calendarUrl.searchParams.set('action', 'TEMPLATE');
        calendarUrl.searchParams.set('text', event.title);
        calendarUrl.searchParams.set('dates', `${dateStr}T${startTime}/${dateStr}T${endTime}`);
        calendarUrl.searchParams.set('details', event.description);
        if (event.venue) calendarUrl.searchParams.set('location', event.venue);

        window.open(calendarUrl.toString(), '_blank');
        setShowCalendarMenu(false);
    };

    // Generate and download .ics file
    const downloadIcsFile = () => {
        let year = parseInt(parsedDate.year, 10) || new Date().getFullYear();
        let month = 1;
        let day = parseInt(parsedDate.day, 10) || 1;

        if (event.date && event.date.includes('-')) {
            const parts = event.date.split('-').map(Number);
            year = parts[0];
            month = parts[1];
            day = parts[2];
        }

        let startHour = 0, startMin = 0, endHour = 23, endMin = 59;
        if (event.time) {
            const times = parseEventTime(event.time);
            startHour = times.startHour;
            startMin = times.startMin;
            endHour = times.endHour;
            endMin = times.endMin;
        }

        const formatIcsDate = (y: number, m: number, d: number, h: number, min: number): string => {
            return `${y}${String(m).padStart(2, '0')}${String(d).padStart(2, '0')}T${String(h).padStart(2, '0')}${String(min).padStart(2, '0')}00`;
        };

        const startDate = formatIcsDate(year, month, day, startHour, startMin);
        const endDate = formatIcsDate(year, month, day, endHour, endMin);

        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//OrbitX//Event//EN',
            'BEGIN:VEVENT',
            `DTSTART:${startDate}`,
            `DTEND:${endDate}`,
            `SUMMARY:${event.title}`,
            `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
            `LOCATION:${event.venue || ''}`,
            `UID:${event.id}@orbitx`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${event.title.replace(/[^a-z0-9]/gi, '_')}.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setShowCalendarMenu(false);
    };

    const hasImages = event.images && event.images.length > 0;
    const hasMultipleImages = event.images && event.images.length > 1;

    const nextImage = () => {
        if (event.images) {
            setCurrentImageIndex((prev) =>
                prev === event.images!.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevImage = () => {
        if (event.images) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? event.images!.length - 1 : prev - 1
            );
        }
    };

    return createPortal(
        <div
            className={`event-modal-overlay ${isClosing ? 'event-modal-overlay--closing' : ''}`}
            onClick={handleOverlayClick}
            onWheel={(e) => {
                if (e.target === e.currentTarget) e.preventDefault();
            }}
            onTouchMove={(e) => {
                if (e.target === e.currentTarget) e.preventDefault();
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-modal-title"
        >
            <div className={`event-modal ${isClosing ? 'event-modal--closing' : ''}`}>
                {/* Top Panoramic Header Image */}
                <div className="event-modal__cover">
                    <button
                        className="event-modal__close-btn"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>

                    {hasImages ? (
                        <>
                            {hasMultipleImages && (
                                <button
                                    className="event-modal__carousel-btn event-modal__carousel-btn--prev"
                                    onClick={prevImage}
                                    aria-label="Previous image"
                                >
                                    ‹
                                </button>
                            )}
                            <img
                                src={event.images![currentImageIndex]}
                                alt={event.title}
                                className="event-modal__cover-img"
                            />
                            {hasMultipleImages && (
                                <button
                                    className="event-modal__carousel-btn event-modal__carousel-btn--next"
                                    onClick={nextImage}
                                    aria-label="Next image"
                                >
                                    ›
                                </button>
                            )}
                            {hasMultipleImages && (
                                <div className="event-modal__dots">
                                    {event.images!.map((_, idx) => (
                                        <span
                                            key={idx}
                                            className={`event-modal__dot ${idx === currentImageIndex ? 'event-modal__dot--active' : ''}`}
                                            onClick={() => setCurrentImageIndex(idx)}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="event-modal__cover-placeholder">
                            <span>✦</span>
                        </div>
                    )}
                </div>

                {/* Modal Body Content */}
                <div className="event-modal__body">
                    {/* Badges Row */}
                    <div className="event-modal__badges-row">
                        <span className={`event-modal__badge-pill event-modal__badge-pill--type event-modal__badge-pill--${typeModifier}`}>
                            <span>{displayType}</span>
                        </span>
                        <span className="event-modal__badge-pill event-modal__badge-pill--price">
                            {priceText}
                        </span>
                    </div>

                    {/* Event Title */}
                    <h2 id="event-modal-title" className="event-modal__title">{event.title}</h2>

                    {/* Excerpt / Summary (only shown if distinct shortDescription exists) */}
                    {event.shortDescription && event.shortDescription !== event.description && (
                        <p className="event-modal__summary">
                            {event.shortDescription}
                        </p>
                    )}

                    {/* 3-Column Stats Grid */}
                    <div className="event-modal__stats-grid">
                        {/* Col 1: Date */}
                        <div className="event-modal__stat-col">
                            <svg className="event-modal__stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            <div className="event-modal__stat-content">
                                <span className="event-modal__stat-label">DATE</span>
                                <strong className="event-modal__stat-primary">{parsedDate.fullDate}</strong>
                                <span className="event-modal__stat-secondary">{event.time || 'Schedule TBA'}</span>
                            </div>
                        </div>

                        {/* Col 2: Location */}
                        <div className="event-modal__stat-col">
                            <svg className="event-modal__stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            <div className="event-modal__stat-content">
                                <span className="event-modal__stat-label">LOCATION</span>
                                {event.venueUrl ? (
                                    <a
                                        href={event.venueUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="event-modal__stat-link"
                                        title="Open in Google Maps"
                                    >
                                        <strong className="event-modal__stat-primary">{venueMain}</strong>
                                    </a>
                                ) : (
                                    <strong className="event-modal__stat-primary">{venueMain}</strong>
                                )}
                                <span className="event-modal__stat-secondary">{venueSub}</span>
                            </div>
                        </div>

                        {/* Col 3: Capacity */}
                        <div className="event-modal__stat-col">
                            <svg className="event-modal__stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            <div className="event-modal__stat-content">
                                <span className="event-modal__stat-label">CAPACITY</span>
                                <strong className="event-modal__stat-primary">{capacityMain}</strong>
                                <span className="event-modal__stat-secondary">{capacitySub}</span>
                            </div>
                        </div>
                    </div>

                    {/* Hairline Divider */}
                    <div className="event-modal__divider" />

                    {/* About the Event Section */}
                    <div className="event-modal__about-section">
                        <h3 className="event-modal__about-heading">About the Event</h3>
                        <p className="event-modal__about-text">
                            {event.description}
                        </p>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="event-modal__actions-bar">
                        {event.isPast ? (
                            <span className="event-modal__past-tag">Event Concluded</span>
                        ) : isRegistered ? (
                            <button
                                type="button"
                                className="event-modal__cta-primary event-modal__cta-primary--download"
                                onClick={() => onDownloadPass?.(event)}
                            >
                                Download Pass →
                            </button>
                        ) : (
                            <button
                                type="button"
                                className={`event-modal__cta-primary ${!event.registrationOpen ? 'event-modal__cta-primary--disabled' : ''}`}
                                disabled={!event.registrationOpen}
                                onClick={() => event.registrationOpen && onRegisterClick?.(event)}
                            >
                                {event.registrationOpen ? 'Register Now →' : 'Registration Closed'}
                            </button>
                        )}

                        <div className="event-modal__calendar-container">
                            <button
                                type="button"
                                className="event-modal__calendar-trigger"
                                onClick={() => setShowCalendarMenu(!showCalendarMenu)}
                                aria-expanded={showCalendarMenu}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                <span>Add to Calendar</span>
                                <svg className="event-modal__calendar-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>

                            {showCalendarMenu && (
                                <div className="event-modal__calendar-dropdown">
                                    <button onClick={openGoogleCalendar} className="event-modal__calendar-item">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                                        </svg>
                                        Google Calendar
                                    </button>
                                    <button onClick={downloadIcsFile} className="event-modal__calendar-item">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="7 10 12 15 17 10" />
                                            <line x1="12" y1="15" x2="12" y2="3" />
                                        </svg>
                                        Download (.ics)
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
