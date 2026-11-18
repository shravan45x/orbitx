import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import Footer from '../../components/layout/Footer';
import ProfileOverlay from '../../components/profile/ProfileOverlay';
import SettingsOverlay from '../../components/settings/SettingsOverlay';
import KeyboardShortcuts from '../../components/shortcuts/KeyboardShortcuts';
import PromoManager from '../../components/admin/PromoManager';
import EventManager from '../../components/admin/EventManager';
import AdminProfileCustomization from '../../components/admin/AdminProfileCustomization';
import { EventModal, type EventData } from '../../components/events';
import { useToast } from '../../components/toast/Toast';
import { SkeletonEventList } from '../../components/skeleton/Skeleton';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useAuth } from '../../contexts/AuthContext';
import { useRecruitment } from '../../contexts/RecruitmentContext';
import { ADMIN_PERMISSIONS } from '../../types/user';
import type { Promotion } from '../../types/user';
import { getUserRegistrations, generatePassPdfForRegistration, downloadPass, type RegistrationRecord } from '../../services/firebase/eventPass';
import { INITIAL_BLOG_POSTS } from '../../data/blogData';
import './Dashboard.css';

type DashboardTab = 'overview' | 'events' | 'merch' | 'admin';

export default function Dashboard() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { logout, profile, isAdmin, hasPermission } = useAuth();

    // User profile data
    const firstName = profile?.firstName || 'Researcher';
    const lastName = profile?.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim() || 'OrbitX Member';
    const orbitId = profile?.orbitId || 'ORB-XXX-0000';
    const userEmail = profile?.email || '';
    const userAvatar = profile?.avatar || (isAdmin ? '/members/Shravan.png' : '');
    const username = (profile as any)?.username || (userEmail ? userEmail.split('@')[0] : 'researcher');
    const userBio = (profile as any)?.bio || (profile as any)?.tagline || (isAdmin ? 'Everything is RELATIVE..' : 'Where curiosity meets the cosmos.');
    const branchOrRole = isAdmin
        ? ((profile as any)?.position || (profile as any)?.team || 'Tech Lead')
        : (profile?.courseName || profile?.stream || 'Member');
    const coverImage = (profile as any)?.coverImage || '/dashboard_cover.jpg';

    // Initials fallback for avatar
    const getInitials = () => {
        const first = firstName.charAt(0).toUpperCase();
        const last = lastName ? lastName.charAt(0).toUpperCase() : '';
        return `${first}${last}` || 'OX';
    };

    // Copy Orbit ID handler
    const [orbitIdCopied, setOrbitIdCopied] = useState(false);
    const handleCopyOrbitId = async () => {
        try {
            await navigator.clipboard.writeText(orbitId);
            setOrbitIdCopied(true);
            showToast('Orbit ID copied to clipboard', 'success');
            setTimeout(() => setOrbitIdCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy Orbit ID:', err);
        }
    };

    // Navigation and Tab State
    const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
    const [eventFilter, setEventFilter] = useState<'all' | 'upcoming' | 'past'>('all');

    // Overlays state
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [showShortcuts, setShowShortcuts] = useState(false);

    // Admin modals state
    const [isPromoManagerOpen, setIsPromoManagerOpen] = useState(false);
    const [isEventManagerOpen, setIsEventManagerOpen] = useState(false);
    const [isAdminProfileOpen, setIsAdminProfileOpen] = useState(false);

    // Event registrations & passes
    const [userRegistrations, setUserRegistrations] = useState<RegistrationRecord[]>([]);
    const [isEventsLoading, setIsEventsLoading] = useState(false);
    const [downloadingPassId, setDownloadingPassId] = useState<string | null>(null);

    // Event Modal state
    const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
    const [isEventModalClosing, setIsEventModalClosing] = useState(false);
    const [highlightEventImage, setHighlightEventImage] = useState<string | null>(null);

    // Promotional Screen Banners
    const [promos, setPromos] = useState<Promotion[]>([]);
    const [promoIndex, setPromoIndex] = useState(0);
    const promoTimerRef = useRef<NodeJS.Timeout | null>(null);
    const touchStartRef = useRef<number | null>(null);
    const touchEndRef = useRef<number | null>(null);

    // Recruitment context
    const { isRecruitmentOpen, toggleRecruitment } = useRecruitment();
    const [isTogglingRecruitment, setIsTogglingRecruitment] = useState(false);

    // Permissions check
    const canManagePromos = isAdmin && hasPermission(ADMIN_PERMISSIONS.MANAGE_PROMOS);
    const canManageEvents = isAdmin && hasPermission(ADMIN_PERMISSIONS.MANAGE_EVENTS);
    const canManageJoin = isAdmin && hasPermission(ADMIN_PERMISSIONS.MANAGE_JOIN);
    const canManageApplications = isAdmin && hasPermission(ADMIN_PERMISSIONS.MANAGE_APPLICATIONS);
    const canManageQueries = isAdmin && hasPermission(ADMIN_PERMISSIONS.MANAGE_QUERIES);
    const canManageMerchOrders = isAdmin && hasPermission(ADMIN_PERMISSIONS.MANAGE_MERCH_ORDERS);
    const canManageMerch = isAdmin && hasPermission(ADMIN_PERMISSIONS.MANAGE_MERCH);
    const canManageMembers = isAdmin && hasPermission(ADMIN_PERMISSIONS.MANAGE_MEMBERS);

    // Fetch promotions from Firestore
    useEffect(() => {
        const q = query(collection(db, 'promotions'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedPromos: Promotion[] = [];
            snapshot.forEach((docSnap) => {
                const data = docSnap.data() as Promotion;
                if (data.isActive) {
                    fetchedPromos.push({ ...data, id: docSnap.id });
                }
            });
            fetchedPromos.sort((a, b) => (a.priority || 0) - (b.priority || 0));
            setPromos(fetchedPromos);
        }, (error) => {
            console.warn('Notice fetching promotions:', error);
        });
        return () => unsubscribe();
    }, []);

    // Promo carousel timer & touch controls
    const nextPromo = useCallback(() => {
        if (promos.length > 1) {
            setPromoIndex(prev => (prev + 1) % promos.length);
        }
    }, [promos.length]);

    const prevPromo = useCallback(() => {
        if (promos.length > 1) {
            setPromoIndex(prev => (prev - 1 + promos.length) % promos.length);
        }
    }, [promos.length]);

    useEffect(() => {
        if (promos.length <= 1) return;
        if (promoTimerRef.current) {
            clearInterval(promoTimerRef.current);
            promoTimerRef.current = null;
        }

        const currentPromo = promos[promoIndex];
        if (currentPromo?.mediaType !== 'video') {
            promoTimerRef.current = setInterval(() => {
                nextPromo();
            }, 6000);
        }

        return () => {
            if (promoTimerRef.current) clearInterval(promoTimerRef.current);
        };
    }, [promos, promoIndex, nextPromo]);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartRef.current = e.targetTouches[0].clientX;
    };
    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndRef.current = e.targetTouches[0].clientX;
    };
    const handleTouchEnd = () => {
        if (!touchStartRef.current || !touchEndRef.current) return;
        const diff = touchStartRef.current - touchEndRef.current;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextPromo();
            else prevPromo();
        }
        touchStartRef.current = null;
        touchEndRef.current = null;
    };

    // Fetch user registrations for passes and highlight
    useEffect(() => {
        if (orbitId && orbitId !== 'ORB-XXX-0000') {
            setIsEventsLoading(true);
            getUserRegistrations(orbitId)
                .then(registrations => {
                    setUserRegistrations(registrations);
                })
                .catch(error => {
                    console.error('Error fetching registrations:', error);
                })
                .finally(() => {
                    setIsEventsLoading(false);
                });
        }
    }, [orbitId]);

    // Helpers for dates
    const isEventUpcoming = (dateStr: string): boolean => {
        if (!dateStr) return false;
        const eventDate = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return eventDate >= today;
    };

    const formatEventDate = (dateStr: string): string => {
        if (!dateStr) return '';
        try {
            const [year, month, day] = dateStr.split('-').map(Number);
            const date = new Date(year, month - 1, day);
            return date.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    const upcomingRegistrations = userRegistrations.filter(r => isEventUpcoming(r.eventDate));
    const pastRegistrations = userRegistrations.filter(r => !isEventUpcoming(r.eventDate));

    // Next upcoming event for highlight section
    const nextUpcomingEvent = upcomingRegistrations
        .slice()
        .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())[0] || null;

    // Fetch image for next upcoming event
    useEffect(() => {
        const fetchHighlightImage = async () => {
            if (nextUpcomingEvent) {
                try {
                    const eventDoc = await getDoc(doc(db, 'events', nextUpcomingEvent.eventId));
                    if (eventDoc.exists()) {
                        const data = eventDoc.data();
                        if (data.images && data.images.length > 0) {
                            setHighlightEventImage(data.images[0]);
                        } else {
                            setHighlightEventImage(null);
                        }
                    }
                } catch (error) {
                    console.warn('Notice fetching highlight image:', error);
                    setHighlightEventImage(null);
                }
            } else {
                setHighlightEventImage(null);
            }
        };
        fetchHighlightImage();
    }, [nextUpcomingEvent?.eventId]);

    // Download pass PDF
    const handleDownloadEventPass = async (registration: RegistrationRecord) => {
        if (!registration) return;
        try {
            setDownloadingPassId(registration.registrationId);
            const pdfBlob = await generatePassPdfForRegistration(registration);
            downloadPass(pdfBlob, registration.eventName, orbitId);
            showToast('Pass downloaded successfully', 'success');
        } catch (error) {
            console.error('Error downloading pass:', error);
            showToast('Failed to download pass', 'error');
        } finally {
            setDownloadingPassId(null);
        }
    };

    const handleDownloadFromModal = (event: EventData) => {
        const registration = userRegistrations.find(r => r.eventId === event.id);
        if (registration) {
            handleDownloadEventPass(registration);
        } else {
            showToast('Registration details not found', 'error');
        }
    };

    // Click event card to open details modal
    const handleEventCardClick = async (registration: RegistrationRecord) => {
        try {
            const eventDoc = await getDoc(doc(db, 'events', registration.eventId));
            if (eventDoc.exists()) {
                const data = eventDoc.data();
                const eventData: EventData = {
                    id: eventDoc.id,
                    title: data.title || registration.eventName,
                    description: data.description || '',
                    date: data.date || registration.eventDate,
                    time: data.time || '',
                    venue: data.venue || '',
                    type: data.type || 'workshop',
                    isPast: !isEventUpcoming(data.date || registration.eventDate),
                    registrationOpen: data.registrationOpen ?? false,
                    images: data.images || [],
                    amount: data.amount
                };
                setSelectedEvent(eventData);
            } else {
                setSelectedEvent({
                    id: registration.eventId,
                    title: registration.eventName,
                    description: '',
                    date: registration.eventDate,
                    time: '',
                    venue: '',
                    type: 'workshop',
                    isPast: !isEventUpcoming(registration.eventDate),
                    registrationOpen: false,
                    images: []
                });
            }
        } catch (error) {
            console.error('Error opening event modal:', error);
            showToast('Could not load event details', 'error');
        }
    };

    const closeEventModal = () => {
        setIsEventModalClosing(true);
        setTimeout(() => {
            setSelectedEvent(null);
            setIsEventModalClosing(false);
        }, 200);
    };

    const handleLogout = async () => {
        try {
            await logout();
            showToast('Logged out successfully', 'info');
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            showToast('Failed to logout', 'error');
        }
    };

    // Keyboard Shortcuts hook
    useKeyboardShortcuts({
        onEscape: () => {
            if (showShortcuts) setShowShortcuts(false);
            else if (isProfileOpen) setIsProfileOpen(false);
            else if (isSettingsOpen) setIsSettingsOpen(false);
            else if (isPromoManagerOpen) setIsPromoManagerOpen(false);
            else if (isEventManagerOpen) setIsEventManagerOpen(false);
            else if (isAdminProfileOpen) setIsAdminProfileOpen(false);
            else if (selectedEvent) closeEventModal();
        },
        onShowHelp: () => setShowShortcuts(true)
    });

    // Filtered registrations for My Events tab
    const filteredRegistrations = 
        eventFilter === 'upcoming' ? upcomingRegistrations :
        eventFilter === 'past' ? pastRegistrations :
        userRegistrations;

    return (
        <>
            <main className="dashboard-page page-transition" role="main" aria-label="OrbitX User Dashboard">
                
                {/* 1. TOP PANORAMIC HERO & PROFILE SECTION */}
                <header 
                    className="dashboard-hero"
                    style={{ backgroundImage: `url(${coverImage})` }}
                >
                    <div className="dashboard-hero__overlay" aria-hidden="true" />
                    
                    <div className="dashboard-hero__content">
                        <div className="dashboard-hero__profile-row">
                            <div className="dashboard-hero__avatar-wrap">
                                {userAvatar ? (
                                    <img src={userAvatar} alt={fullName} className="dashboard-hero__avatar-img" />
                                ) : (
                                    <div className="dashboard-hero__avatar-fallback">{getInitials()}</div>
                                )}
                            </div>

                            <div className="dashboard-hero__details">
                                <div className="dashboard-hero__username-row">
                                    <span className="dashboard-hero__username">{username}</span>
                                    <span className="dashboard-verified-badge" title="Verified Member" aria-label="Verified Member">
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                        </svg>
                                    </span>
                                </div>
                                <h1 className="dashboard-hero__fullname">{fullName}</h1>
                                <p className="dashboard-hero__position">{branchOrRole}</p>
                                <p className="dashboard-hero__bio">{userBio}</p>
                            </div>
                        </div>

                        {/* Profile Action Buttons */}
                        <div className="dashboard-hero__actions">
                            <button
                                type="button"
                                className="dashboard-hero-btn dashboard-hero-btn--primary"
                                onClick={() => setIsProfileOpen(true)}
                                title="Edit your OrbitX profile"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                <span>Edit Profile</span>
                            </button>
                            <button
                                type="button"
                                className="dashboard-hero-btn dashboard-hero-btn--secondary"
                                onClick={() => setIsSettingsOpen(true)}
                                title="Open terminal preferences and account settings"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="3" />
                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                                </svg>
                                <span>Settings</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* 2. HORIZONTAL SUB-NAVIGATION BAR (REPLACING DASHBOARD SIDEBAR) */}
                <nav className="dashboard-subnav" aria-label="Dashboard View Navigation">
                    <div className="dashboard-subnav__inner">
                        <div className="dashboard-subnav__tabs" role="tablist">
                            <button
                                type="button"
                                role="tab"
                                aria-selected={activeTab === 'overview'}
                                className={`dashboard-subnav-tab ${activeTab === 'overview' ? 'dashboard-subnav-tab--active' : ''}`}
                                onClick={() => setActiveTab('overview')}
                            >
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <rect x="3" y="3" width="7" height="7" />
                                    <rect x="14" y="3" width="7" height="7" />
                                    <rect x="14" y="14" width="7" height="7" />
                                    <rect x="3" y="14" width="7" height="7" />
                                </svg>
                                <span>Overview</span>
                            </button>

                            <button
                                type="button"
                                role="tab"
                                aria-selected={activeTab === 'events'}
                                className={`dashboard-subnav-tab ${activeTab === 'events' ? 'dashboard-subnav-tab--active' : ''}`}
                                onClick={() => setActiveTab('events')}
                            >
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                <span>My Events</span>
                                {upcomingRegistrations.length > 0 && (
                                    <span className="dashboard-subnav-chip">{upcomingRegistrations.length}</span>
                                )}
                            </button>

                            <button
                                type="button"
                                role="tab"
                                aria-selected={activeTab === 'merch'}
                                className={`dashboard-subnav-tab ${activeTab === 'merch' ? 'dashboard-subnav-tab--active' : ''}`}
                                onClick={() => setActiveTab('merch')}
                            >
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <circle cx="9" cy="21" r="1" />
                                    <circle cx="20" cy="21" r="1" />
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                </svg>
                                <span>Merchandise</span>
                            </button>

                            {/* Admin Console Switcher — accessible in dev mode & for admins */}
                            <button
                                type="button"
                                className="dashboard-subnav-tab dashboard-subnav-tab--admin-portal"
                                onClick={() => navigate('/admin')}
                                title="Open OrbitX Admin Operations Console"
                            >
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                                <span>Admin Console →</span>
                            </button>
                        </div>

                        <div className="dashboard-subnav__actions">
                            <button
                                type="button"
                                className="dashboard-subnav-action-btn"
                                onClick={() => setShowShortcuts(true)}
                                title="Keyboard Shortcuts (Press ?)"
                                aria-label="Keyboard Shortcuts"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <line x1="3" y1="12" x2="21" y2="12" />
                                    <line x1="3" y1="18" x2="21" y2="18" />
                                </svg>
                                <span>Shortcuts</span>
                            </button>

                            <button
                                type="button"
                                className="dashboard-subnav-action-btn dashboard-subnav-action-btn--danger"
                                onClick={handleLogout}
                                title="Sign Out"
                                aria-label="Sign Out"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                </nav>

                {/* 3. MAIN DASHBOARD CONTENT WRAPPER */}
                <div className="dashboard-content-container">

                    {/* Horizontal Meta Strip */}
                    <div className="dashboard-meta-strip">
                        <a href={`mailto:${userEmail}`} className="dashboard-meta-email">
                            <span>{userEmail}</span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                        </a>
                        <div className="dashboard-meta-orbitid">
                            <span className="dashboard-meta-orbitid__label">{orbitId}</span>
                            <button
                                type="button"
                                className={`dashboard-meta-copy-btn ${orbitIdCopied ? 'dashboard-meta-copy-btn--copied' : ''}`}
                                onClick={handleCopyOrbitId}
                                title="Copy Orbit ID"
                                aria-label="Copy Orbit ID"
                            >
                                {orbitIdCopied ? (
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" aria-hidden="true">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                ) : (
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* =========================================================================
                        TAB 1: OVERVIEW
                       ========================================================================= */}
                    {activeTab === 'overview' && (
                        <div className="dashboard-tab-view">
                            
                            {/* Metrics Strip & Consortium Bulletin Row */}
                            <div className="dashboard-overview-top-row">
                                
                                {/* Metrics Card */}
                                <div className="dashboard-metrics-box" aria-label="Observational Metrics">
                                    <div className="dashboard-metric-col">
                                        <span className="dashboard-metric-col__tag">ACTIVE PASSES</span>
                                        <strong className="dashboard-metric-col__val">{upcomingRegistrations.length}</strong>
                                        <span className="dashboard-metric-col__desc">Upcoming Sessions</span>
                                    </div>

                                    <div className="dashboard-metric-col">
                                        <span className="dashboard-metric-col__tag">TOTAL ATTENDED</span>
                                        <strong className="dashboard-metric-col__val">{pastRegistrations.length}</strong>
                                        <span className="dashboard-metric-col__desc">Observation Logs</span>
                                    </div>

                                    <div className="dashboard-metric-col">
                                        <span className="dashboard-metric-col__tag">CONSORTIUM NODE</span>
                                        <strong className="dashboard-metric-col__val">ZCOER</strong>
                                        <span className="dashboard-metric-col__desc">Pune Observatory</span>
                                    </div>

                                    <div className="dashboard-metric-col">
                                        <span className="dashboard-metric-col__tag">PUBLICATIONS</span>
                                        <strong className="dashboard-metric-col__val">{INITIAL_BLOG_POSTS.length}</strong>
                                        <span className="dashboard-metric-col__desc">Dispatches Live</span>
                                    </div>
                                </div>

                                {/* Consortium Bulletin Card */}
                                <div className="dashboard-bulletin-box" aria-label="Consortium Bulletin">
                                    <div className="dashboard-bulletin-box__header">
                                        <div className="dashboard-bulletin-box__title-wrap">
                                            <span className="dashboard-bulletin-box__dot" aria-hidden="true" />
                                            <span className="dashboard-bulletin-box__title">CONSORTIUM BULLETIN</span>
                                        </div>
                                        {promos.length > 1 && (
                                            <div className="dashboard-bulletin-box__dots">
                                                {promos.map((_, idx) => (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        className={`dashboard-bulletin-box__dot-btn ${idx === promoIndex ? 'dashboard-bulletin-box__dot-btn--active' : ''}`}
                                                        onClick={() => setPromoIndex(idx)}
                                                        aria-label={`Show bulletin slide ${idx + 1}`}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div 
                                        className="dashboard-bulletin-box__frame"
                                        onTouchStart={handleTouchStart}
                                        onTouchMove={handleTouchMove}
                                        onTouchEnd={handleTouchEnd}
                                    >
                                        {promos.length > 0 ? (
                                            promos.map((promo, idx) => (
                                                <div
                                                    key={promo.id}
                                                    className={`dashboard-bulletin-box__slide ${idx === promoIndex ? 'dashboard-bulletin-box__slide--active' : ''}`}
                                                    onClick={() => promo.linkUrl && window.open(promo.linkUrl, '_blank')}
                                                    style={{ cursor: promo.linkUrl ? 'pointer' : 'default' }}
                                                >
                                                    {promo.mediaType === 'video' ? (
                                                        <video
                                                            src={promo.mediaUrl}
                                                            autoPlay
                                                            muted
                                                            playsInline
                                                            onEnded={nextPromo}
                                                            loop={false}
                                                        />
                                                    ) : (
                                                        <img src={promo.mediaUrl} alt={promo.title} />
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="dashboard-bulletin-box__empty">
                                                <img src="/dashboard_cover.jpg" alt="OrbitX Bulletin" className="dashboard-bulletin-box__fallback" />
                                                <span className="dashboard-bulletin-box__tagline">All systems nominal</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Section: Upcoming Observation Pass */}
                            <section className="dashboard-section-block" aria-label="Upcoming Observation Pass">
                                <div className="dashboard-section-title-row">
                                    <h2 className="dashboard-section-heading">Upcoming Observation Pass</h2>
                                    <span className="dashboard-section-line" aria-hidden="true" />
                                    {upcomingRegistrations.length > 0 ? (
                                        <button 
                                            type="button" 
                                            className="dashboard-inline-link"
                                            onClick={() => setActiveTab('events')}
                                        >
                                            View All Passes &rarr;
                                        </button>
                                    ) : (
                                        <span className="dashboard-section-tag">RESERVATION STATUS</span>
                                    )}
                                </div>

                                {nextUpcomingEvent ? (
                                    <div className="dashboard-spotlight-card">
                                        <div className="dashboard-spotlight-card__media">
                                            {highlightEventImage ? (
                                                <img 
                                                    src={highlightEventImage} 
                                                    alt={nextUpcomingEvent.eventName}
                                                    className="dashboard-spotlight-card__img" 
                                                />
                                            ) : (
                                                <div className="dashboard-spotlight-card__placeholder">
                                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                                                        <path d="M2 12h20" />
                                                    </svg>
                                                </div>
                                            )}
                                            <span className="dashboard-spotlight-card__badge">UP NEXT</span>
                                        </div>

                                        <div className="dashboard-spotlight-card__body">
                                            <div className="dashboard-spotlight-card__meta">
                                                <span className="dashboard-badge-registered">✓ Registered</span>
                                                <span className="dashboard-date-chip">📅 {formatEventDate(nextUpcomingEvent.eventDate)}</span>
                                            </div>

                                            <h3 className="dashboard-spotlight-card__title">{nextUpcomingEvent.eventName}</h3>
                                            <p className="dashboard-spotlight-card__desc">
                                                Your seat and event pass have been reserved. Please bring your digital or printed QR pass to the campus observatory checkpoint.
                                            </p>

                                            <div className="dashboard-spotlight-card__actions">
                                                <button
                                                    type="button"
                                                    className="dashboard-btn dashboard-btn--primary"
                                                    onClick={() => handleEventCardClick(nextUpcomingEvent)}
                                                >
                                                    View Session Details
                                                </button>
                                                <button
                                                    type="button"
                                                    className="dashboard-btn dashboard-btn--secondary"
                                                    onClick={() => handleDownloadEventPass(nextUpcomingEvent)}
                                                    disabled={downloadingPassId === nextUpcomingEvent.registrationId}
                                                >
                                                    {downloadingPassId === nextUpcomingEvent.registrationId ? 'Generating...' : 'Download Pass (PDF)'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="dashboard-empty-pass-box">
                                        <div className="dashboard-empty-pass-box__icon" aria-hidden="true">
                                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                <line x1="16" y1="2" x2="16" y2="6" />
                                                <line x1="8" y1="2" x2="8" y2="6" />
                                                <line x1="3" y1="10" x2="21" y2="10" />
                                            </svg>
                                        </div>
                                        <h3 className="dashboard-empty-pass-box__title">No Active Event Registrations</h3>
                                        <p className="dashboard-empty-pass-box__desc">
                                            You haven't reserved an entry pass for any upcoming campus stargazing sessions or workshops yet.
                                        </p>
                                        <button
                                            type="button"
                                            className="dashboard-btn dashboard-btn--white"
                                            onClick={() => navigate('/events')}
                                        >
                                            EXPLORE OBSERVATION CALENDAR
                                        </button>
                                    </div>
                                )}
                            </section>

                            {/* Section: Consortium Launchpad */}
                            <section className="dashboard-section-block" aria-label="Consortium Launchpad">
                                <div className="dashboard-section-title-row">
                                    <h2 className="dashboard-section-heading">Consortium Launchpad</h2>
                                    <span className="dashboard-section-line" aria-hidden="true" />
                                    <span className="dashboard-section-tag">SERVICES &amp; ACCESS</span>
                                </div>
                                <div className="dashboard-launchpad-grid">
                                    <div className="dashboard-launchpad-card" onClick={() => navigate('/events')} role="button" tabIndex={0}>
                                        <div className="dashboard-launchpad-card__icon">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                <line x1="16" y1="2" x2="16" y2="6" />
                                                <line x1="8" y1="2" x2="8" y2="6" />
                                            </svg>
                                        </div>
                                        <h3 className="dashboard-launchpad-card__title">Observation Calendar</h3>
                                        <p className="dashboard-launchpad-card__desc">Browse upcoming dark-sky camps, workshops, and rooftop telescope sessions.</p>
                                        <span className="dashboard-launchpad-card__link">BROWSE SESSIONS &rarr;</span>
                                    </div>

                                    <div className="dashboard-launchpad-card" onClick={() => navigate('/blogs')} role="button" tabIndex={0}>
                                        <div className="dashboard-launchpad-card__icon">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="dashboard-launchpad-card__title">Research Dispatches</h3>
                                        <p className="dashboard-launchpad-card__desc">Read peer-reviewed observation papers, CCD photometry, and optics guides.</p>
                                        <span className="dashboard-launchpad-card__link">READ DISPATCHES &rarr;</span>
                                    </div>

                                    <div className="dashboard-launchpad-card" onClick={() => navigate('/merch')} role="button" tabIndex={0}>
                                        <div className="dashboard-launchpad-card__icon">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="9" cy="21" r="1" />
                                                <circle cx="20" cy="21" r="1" />
                                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                            </svg>
                                        </div>
                                        <h3 className="dashboard-launchpad-card__title">Official Merchandise</h3>
                                        <p className="dashboard-launchpad-card__desc">Fabric university astronomy club hoodies, mission T-shirts, and space stickers.</p>
                                        <span className="dashboard-launchpad-card__link">SHOP GEAR &rarr;</span>
                                    </div>

                                    <div className="dashboard-launchpad-card" onClick={() => navigate('/members')} role="button" tabIndex={0}>
                                        <div className="dashboard-launchpad-card__icon">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                <circle cx="9" cy="7" r="4" />
                                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                            </svg>
                                        </div>
                                        <h3 className="dashboard-launchpad-card__title">Team Directory</h3>
                                        <p className="dashboard-launchpad-card__desc">Connect with researchers, observation wing engineers, and core student leads.</p>
                                        <span className="dashboard-launchpad-card__link">MEET THE TEAM &rarr;</span>
                                    </div>
                                </div>
                            </section>

                        </div>
                    )}

                    {/* =========================================================================
                        TAB 2: MY EVENTS & PASSES
                       ========================================================================= */}
                    {activeTab === 'events' && (
                        <div className="dashboard-tab-view">
                            <div className="dashboard-header-block">
                                <span className="dashboard-header-tag">EVENT ACCREDITATIONS</span>
                                <h1 className="dashboard-header-title">My Registered Events</h1>
                                <p className="dashboard-header-subtitle">
                                    View your session registrations, verify QR check-in status, and download PDF entry passes.
                                </p>
                            </div>

                            {/* Filter Controls */}
                            <div className="dashboard-events-filter-bar">
                                <div className="dashboard-filter-pills">
                                    <button
                                        type="button"
                                        className={`dashboard-filter-pill ${eventFilter === 'all' ? 'dashboard-filter-pill--active' : ''}`}
                                        onClick={() => setEventFilter('all')}
                                    >
                                        All ({userRegistrations.length})
                                    </button>
                                    <button
                                        type="button"
                                        className={`dashboard-filter-pill ${eventFilter === 'upcoming' ? 'dashboard-filter-pill--active' : ''}`}
                                        onClick={() => setEventFilter('upcoming')}
                                    >
                                        Upcoming ({upcomingRegistrations.length})
                                    </button>
                                    <button
                                        type="button"
                                        className={`dashboard-filter-pill ${eventFilter === 'past' ? 'dashboard-filter-pill--active' : ''}`}
                                        onClick={() => setEventFilter('past')}
                                    >
                                        Past ({pastRegistrations.length})
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    className="dashboard-btn dashboard-btn--secondary"
                                    onClick={() => navigate('/events')}
                                >
                                    Browse New Events
                                </button>
                            </div>

                            {/* Event Cards List */}
                            {isEventsLoading ? (
                                <SkeletonEventList />
                            ) : filteredRegistrations.length > 0 ? (
                                <div className="dashboard-passes-grid">
                                    {filteredRegistrations.map((registration) => {
                                        const upcoming = isEventUpcoming(registration.eventDate);
                                        return (
                                            <article key={registration.registrationId} className="dashboard-pass-card">
                                                <div className="dashboard-pass-card__header">
                                                    <span className="dashboard-pass-card__id">
                                                        REF: {registration.registrationId.slice(0, 10).toUpperCase()}
                                                    </span>
                                                    <span className={`dashboard-status-tag ${upcoming ? 'dashboard-status-tag--upcoming' : 'dashboard-status-tag--past'}`}>
                                                        {upcoming ? 'Active Pass' : 'Completed Session'}
                                                    </span>
                                                </div>

                                                <h3 
                                                    className="dashboard-pass-card__title"
                                                    onClick={() => handleEventCardClick(registration)}
                                                    title="Click to view full event details"
                                                >
                                                    {registration.eventName}
                                                </h3>

                                                <div className="dashboard-pass-card__meta">
                                                    <span>📅 {formatEventDate(registration.eventDate)}</span>
                                                    {registration.attendanceStatus && (
                                                        <span className="dashboard-pass-card__attended">✓ Check-in Verified</span>
                                                    )}
                                                </div>

                                                <div className="dashboard-pass-card__actions">
                                                    <button
                                                        type="button"
                                                        className="dashboard-btn dashboard-btn--secondary dashboard-btn--sm"
                                                        onClick={() => handleEventCardClick(registration)}
                                                    >
                                                        Session Info
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="dashboard-btn dashboard-btn--primary dashboard-btn--sm"
                                                        onClick={() => handleDownloadEventPass(registration)}
                                                        disabled={downloadingPassId === registration.registrationId}
                                                    >
                                                        {downloadingPassId === registration.registrationId ? (
                                                            'Downloading...'
                                                        ) : (
                                                            <>
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                                    <polyline points="7 10 12 15 17 10" />
                                                                    <line x1="12" y1="15" x2="12" y2="3" />
                                                                </svg>
                                                                Download Pass
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="dashboard-empty-pass-box">
                                    <h3 className="dashboard-empty-pass-box__title">No Registrations In This View</h3>
                                    <p className="dashboard-empty-pass-box__desc">You do not have any registered events matching the selected filter.</p>
                                    <button
                                        type="button"
                                        className="dashboard-btn dashboard-btn--white"
                                        onClick={() => navigate('/events')}
                                    >
                                        Browse Campus Events
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* =========================================================================
                        TAB 3: MERCHANDISE
                       ========================================================================= */}
                    {activeTab === 'merch' && (
                        <div className="dashboard-tab-view">
                            <div className="dashboard-header-block">
                                <span className="dashboard-header-tag">ASTRONOMY CONSORTIUM APPAREL</span>
                                <h1 className="dashboard-header-title">Merchandise Hub</h1>
                                <p className="dashboard-header-subtitle">
                                    Track your orders, campus pickup status, and browse limited-edition OrbitX astronomy gear.
                                </p>
                            </div>

                            <div className="dashboard-empty-pass-box">
                                <div className="dashboard-empty-pass-box__icon" aria-hidden="true">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <circle cx="9" cy="21" r="1" />
                                        <circle cx="20" cy="21" r="1" />
                                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                    </svg>
                                </div>
                                <h3 className="dashboard-empty-pass-box__title">Order &amp; Inventory Center</h3>
                                <p className="dashboard-empty-pass-box__desc">Official OrbitX hoodies, collegiate tees, and embroidered astronomy patches are distributed during campus observation sessions.</p>
                                <button
                                    type="button"
                                    className="dashboard-btn dashboard-btn--white"
                                    onClick={() => navigate('/merch')}
                                >
                                    Explore Merchandise Catalog
                                </button>
                            </div>
                        </div>
                    )}

                    {/* =========================================================================
                        TAB 4: ADMIN CONSOLE (Admin only)
                       ========================================================================= */}
                    {activeTab === 'admin' && isAdmin && (
                        <div className="dashboard-tab-view">
                            <div className="dashboard-header-block">
                                <span className="dashboard-header-tag">ADMINISTRATIVE ACCESS</span>
                                <h1 className="dashboard-header-title">Consortium Control Deck</h1>
                                <p className="dashboard-header-subtitle">
                                    Manage campus observation events, announcements, recruitment drives, and member credentials.
                                </p>
                            </div>

                            <div className="dashboard-admin-tools-grid">
                                {canManagePromos && (
                                    <div className="dashboard-admin-card" onClick={() => setIsPromoManagerOpen(true)} role="button" tabIndex={0}>
                                        <div className="dashboard-admin-card__icon">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                <circle cx="8.5" cy="8.5" r="1.5" />
                                                <polyline points="21 15 16 10 5 21" />
                                            </svg>
                                        </div>
                                        <h3>Promotional Screen</h3>
                                        <p>Upload and arrange banner graphics and videos displayed on the mission control bulletin.</p>
                                        <span className="dashboard-admin-card__cta">Open Manager &rarr;</span>
                                    </div>
                                )}

                                {canManageEvents && (
                                    <div className="dashboard-admin-card" onClick={() => setIsEventManagerOpen(true)} role="button" tabIndex={0}>
                                        <div className="dashboard-admin-card__icon">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                <line x1="16" y1="2" x2="16" y2="6" />
                                                <line x1="8" y1="2" x2="8" y2="6" />
                                                <line x1="3" y1="10" x2="21" y2="10" />
                                            </svg>
                                        </div>
                                        <h3>Events Manager</h3>
                                        <p>Create new stargazing camps, update workshop schedules, and manage registration limits.</p>
                                        <span className="dashboard-admin-card__cta">Open Schedule &rarr;</span>
                                    </div>
                                )}

                                {canManageJoin && (
                                    <div 
                                        className={`dashboard-admin-card dashboard-admin-card--toggle ${isRecruitmentOpen ? 'dashboard-admin-card--recruitment-open' : ''}`}
                                        onClick={async () => {
                                            if (isTogglingRecruitment) return;
                                            setIsTogglingRecruitment(true);
                                            try {
                                                await toggleRecruitment();
                                                showToast(isRecruitmentOpen ? 'Recruitment closed' : 'Recruitment opened', 'success');
                                            } catch {
                                                showToast('Failed to toggle recruitment status', 'error');
                                            } finally {
                                                setIsTogglingRecruitment(false);
                                            }
                                        }}
                                        role="button"
                                        tabIndex={0}
                                    >
                                        <div className="dashboard-admin-card__icon">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                <circle cx="8.5" cy="7" r="4" />
                                                <line x1="20" y1="8" x2="20" y2="14" />
                                                <line x1="23" y1="11" x2="17" y2="11" />
                                            </svg>
                                        </div>
                                        <div className="dashboard-admin-card__toggle-head">
                                            <h3>Recruitment Gateway</h3>
                                            <span className={`dashboard-toggle-pill ${isRecruitmentOpen ? 'dashboard-toggle-pill--open' : 'dashboard-toggle-pill--closed'}`}>
                                                {isRecruitmentOpen ? 'ACTIVE (OPEN)' : 'CLOSED'}
                                            </span>
                                        </div>
                                        <p>Toggle applications for new student inductees across technical and astronomical wings.</p>
                                        <span className="dashboard-admin-card__cta">
                                            {isTogglingRecruitment ? 'Updating...' : `Click to ${isRecruitmentOpen ? 'Close' : 'Open'}`}
                                        </span>
                                    </div>
                                )}

                                {canManageApplications && (
                                    <div className="dashboard-admin-card" onClick={() => navigate('/manage-user-applications')} role="button" tabIndex={0}>
                                        <div className="dashboard-admin-card__icon">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                <polyline points="14 2 14 8 20 8" />
                                                <line x1="16" y1="13" x2="8" y2="13" />
                                                <line x1="16" y1="17" x2="8" y2="17" />
                                            </svg>
                                        </div>
                                        <h3>Candidate Applications</h3>
                                        <p>Review submitted candidate statements, engineering projects, and interview statuses.</p>
                                        <span className="dashboard-admin-card__cta">Review Applications &rarr;</span>
                                    </div>
                                )}

                                {canManageQueries && (
                                    <div className="dashboard-admin-card" onClick={() => navigate('/manage-user-queries')} role="button" tabIndex={0}>
                                        <div className="dashboard-admin-card__icon">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                            </svg>
                                        </div>
                                        <h3>Inquiries &amp; Queries</h3>
                                        <p>Triage institutional questions, outreach requests, and sponsorship proposals.</p>
                                        <span className="dashboard-admin-card__cta">View Inquiries &rarr;</span>
                                    </div>
                                )}

                                {canManageMerchOrders && (
                                    <div className="dashboard-admin-card" onClick={() => navigate('/manage-merch-orders')} role="button" tabIndex={0}>
                                        <div className="dashboard-admin-card__icon">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6l-3-4Z" />
                                                <path d="M3 6h18" />
                                            </svg>
                                        </div>
                                        <h3>Merch Orders</h3>
                                        <p>Review student purchase orders, verify UPI transaction IDs, and mark items fulfilled.</p>
                                        <span className="dashboard-admin-card__cta">Dispatch Orders &rarr;</span>
                                    </div>
                                )}

                                {canManageMerch && (
                                    <div className="dashboard-admin-card" onClick={() => navigate('/manage-merch')} role="button" tabIndex={0}>
                                        <div className="dashboard-admin-card__icon">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                                            </svg>
                                        </div>
                                        <h3>Merch Catalog</h3>
                                        <p>Add new products, adjust stock availability, and update official apparel pricing.</p>
                                        <span className="dashboard-admin-card__cta">Manage Catalog &rarr;</span>
                                    </div>
                                )}

                                {canManageMembers && (
                                    <div className="dashboard-admin-card" onClick={() => navigate('/manage-members')} role="button" tabIndex={0}>
                                        <div className="dashboard-admin-card__icon">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                <circle cx="9" cy="7" r="4" />
                                            </svg>
                                        </div>
                                        <h3>Member Verification</h3>
                                        <p>Verify newly registered OrbitX accounts, approve membership tier upgrades, and manage roles.</p>
                                        <span className="dashboard-admin-card__cta">Manage Members &rarr;</span>
                                    </div>
                                )}

                                <div className="dashboard-admin-card" onClick={() => setIsAdminProfileOpen(true)} role="button" tabIndex={0}>
                                    <div className="dashboard-admin-card__icon">
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                            <line x1="8" y1="21" x2="16" y2="21" />
                                            <line x1="12" y1="17" x2="12" y2="21" />
                                        </svg>
                                    </div>
                                    <h3>My Public Member Card</h3>
                                    <p>Update your research specialization, LinkedIn profile, and photo shown on the Members page.</p>
                                    <span className="dashboard-admin-card__cta">Edit Card &rarr;</span>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </main>

            <Footer />

            {/* Overlays */}
            <ProfileOverlay isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
            <SettingsOverlay isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
            <KeyboardShortcuts isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />

            {/* Admin Overlays */}
            {canManagePromos && (
                <PromoManager
                    isOpen={isPromoManagerOpen}
                    onClose={() => setIsPromoManagerOpen(false)}
                    adminOrbitId={orbitId}
                />
            )}
            {canManageEvents && (
                <EventManager
                    isOpen={isEventManagerOpen}
                    onClose={() => setIsEventManagerOpen(false)}
                    adminOrbitId={orbitId}
                />
            )}
            {selectedEvent && (
                <EventModal
                    event={selectedEvent}
                    isClosing={isEventModalClosing}
                    onClose={closeEventModal}
                    isRegistered={true}
                    onDownloadPass={handleDownloadFromModal}
                />
            )}
            {isAdmin && (
                <AdminProfileCustomization
                    isOpen={isAdminProfileOpen}
                    onClose={() => setIsAdminProfileOpen(false)}
                />
            )}
        </>
    );
}
