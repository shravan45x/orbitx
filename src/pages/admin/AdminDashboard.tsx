import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/toast/Toast';
import { ADMIN_PERMISSIONS } from '../../types/user';
import EventManager from '../../components/admin/EventManager';
import ApplicationsManager from '../../components/admin/ApplicationsManager';
import ManageQueries from '../../components/admin/ManageQueries';
import MerchManager from '../../components/admin/MerchManager';
import MerchOrdersManager from '../../components/admin/MerchOrdersManager';
import PromoManager from '../../components/admin/PromoManager';
import AdminProfileCustomization from '../../components/admin/AdminProfileCustomization';
import Footer from '../../components/layout/Footer';
import './AdminDashboard.css';

type AdminTab = 'overview' | 'events' | 'applications' | 'queries' | 'merch' | 'merch-orders' | 'members';

interface TelemetryMetrics {
    totalUsers: number;
    pendingApplications: number;
    unreadQueries: number;
    activeEvents: number;
    merchOrders: number;
}

interface UserDirectoryRecord {
    id: string;
    orbitId?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    isAdmin?: boolean;
    isSuperAdmin?: boolean;
    courseName?: string;
    stream?: string;
    createdAt?: string;
}

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { profile, isSuperAdmin, hasPermission } = useAuth();
    const { showToast } = useToast();

    const [activeTab, setActiveTab] = useState<AdminTab>('overview');
    const [metrics, setMetrics] = useState<TelemetryMetrics>({
        totalUsers: 0,
        pendingApplications: 0,
        unreadQueries: 0,
        activeEvents: 0,
        merchOrders: 0
    });

    // Modals
    const [isEventManagerOpen, setIsEventManagerOpen] = useState(false);
    const [isPromoManagerOpen, setIsPromoManagerOpen] = useState(false);
    const [isAdminProfileOpen, setIsAdminProfileOpen] = useState(false);

    // Members Directory & Role Management (Super Admin view)
    const [usersList, setUsersList] = useState<UserDirectoryRecord[]>([]);
    const [searchUserQuery, setSearchUserQuery] = useState('');
    const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

    const orbitId = profile?.orbitId || 'ORB-ADMIN';

    // 1. Fetch live metrics from collections
    useEffect(() => {
        // Users count
        const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
            const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserDirectoryRecord));
            setUsersList(users);
            setMetrics(prev => ({ ...prev, totalUsers: snapshot.size }));
        }, (err) => console.warn('Users metric error:', err));

        // Applications count
        const unsubApps = onSnapshot(collection(db, 'applications'), (snapshot) => {
            const pending = snapshot.docs.filter(d => d.data().status === 'pending').length;
            setMetrics(prev => ({ ...prev, pendingApplications: pending }));
        }, (err) => console.warn('Apps metric error:', err));

        // Queries count
        const unsubQueries = onSnapshot(collection(db, 'contactMessages'), (snapshot) => {
            const unread = snapshot.docs.filter(d => d.data().status === 'unread').length;
            setMetrics(prev => ({ ...prev, unreadQueries: unread }));
        }, (err) => console.warn('Queries metric error:', err));

        // Events count
        const unsubEvents = onSnapshot(collection(db, 'events'), (snapshot) => {
            setMetrics(prev => ({ ...prev, activeEvents: snapshot.size }));
        }, (err) => console.warn('Events metric error:', err));

        // Merch orders
        const unsubOrders = onSnapshot(collection(db, 'merchOrders'), (snapshot) => {
            setMetrics(prev => ({ ...prev, merchOrders: snapshot.size }));
        }, (err) => console.warn('Orders metric error:', err));

        return () => {
            unsubUsers();
            unsubApps();
            unsubQueries();
            unsubEvents();
            unsubOrders();
        };
    }, []);

    // Handle toggling admin status directly on a user record (Super Admin only)
    const handleToggleAdminRole = async (targetUser: UserDirectoryRecord, roleKey: 'isAdmin' | 'isSuperAdmin') => {
        if (!isSuperAdmin) {
            showToast('Only Super Administrators can modify role assignments.', 'error');
            return;
        }

        const newStatus = !targetUser[roleKey];
        setUpdatingUserId(targetUser.id);

        try {
            const userRef = doc(db, 'users', targetUser.id);
            const updatePayload: Record<string, any> = {
                [roleKey]: newStatus,
                updatedAt: new Date().toISOString()
            };

            // If promoting to super admin, ensure isAdmin is also true
            if (roleKey === 'isSuperAdmin' && newStatus) {
                updatePayload.isAdmin = true;
            }

            await updateDoc(userRef, updatePayload);
            showToast(`Role updated for ${targetUser.firstName || targetUser.email || targetUser.id}`, 'success');
        } catch (error: any) {
            console.error('Failed to update role:', error);
            showToast('Failed to update role in Firestore: ' + (error?.message || 'Access denied'), 'error');
        } finally {
            setUpdatingUserId(null);
        }
    };

    const filteredUsers = usersList.filter(u => {
        if (!searchUserQuery) return true;
        const q = searchUserQuery.toLowerCase();
        return (
            (u.firstName && u.firstName.toLowerCase().includes(q)) ||
            (u.lastName && u.lastName.toLowerCase().includes(q)) ||
            (u.email && u.email.toLowerCase().includes(q)) ||
            (u.orbitId && u.orbitId.toLowerCase().includes(q))
        );
    });

    return (
        <main className="admin-page page-transition">
            {/* Top Telemetry Strip */}
            <div className="admin-telemetry-strip">
                <div className="admin-container admin-telemetry-inner">
                    <div className="admin-telemetry-status">
                        <span className="admin-telemetry-dot" aria-hidden="true" />
                        <span className="admin-telemetry-label">CONSORTIUM CONTROL DECK</span>
                        <span className="admin-telemetry-divider">//</span>
                        <span className="admin-telemetry-badge">
                            {isSuperAdmin ? 'SUPER ADMIN ACCESS' : 'ADMINISTRATOR ACCESS'}
                        </span>
                    </div>

                    <div className="admin-telemetry-actions">
                        {/* Member View Switcher */}
                        <button
                            type="button"
                            className="admin-switch-btn"
                            onClick={() => navigate('/user-dashboard')}
                            title="Switch to regular member dashboard view"
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                <line x1="19" y1="12" x2="5" y2="12" />
                                <polyline points="12 19 5 12 12 5" />
                            </svg>
                            <span>Member View</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Header Block */}
            <header className="admin-header">
                <div className="admin-container">
                    <div className="admin-header-flex">
                        <div className="admin-header-info">
                            <span className="admin-header-eyebrow">ORBITX ARCHIVAL OPERATIONS</span>
                            <h1 className="admin-header-title">Command Center</h1>
                            <p className="admin-header-desc">
                                Central operations console for managing observatory sessions, applicant pipelines, public queries, and consortium members.
                            </p>
                        </div>

                        <div className="admin-header-meta">
                            <div className="admin-meta-card">
                                <span className="admin-meta-label">ADMIN ORBIT ID</span>
                                <span className="admin-meta-value">{orbitId}</span>
                            </div>
                            <button
                                type="button"
                                className="admin-btn admin-btn--secondary"
                                onClick={() => setIsAdminProfileOpen(true)}
                            >
                                Customize Public Card
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Module Sub-Navigation */}
            <nav className="admin-nav" aria-label="Admin Navigation Tabs">
                <div className="admin-container">
                    <div className="admin-nav-tabs" role="tablist">
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === 'overview'}
                            className={`admin-nav-tab ${activeTab === 'overview' ? 'admin-nav-tab--active' : ''}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            Overview
                        </button>

                        {(isSuperAdmin || hasPermission(ADMIN_PERMISSIONS.MANAGE_EVENTS)) && (
                            <button
                                type="button"
                                role="tab"
                                aria-selected={activeTab === 'events'}
                                className={`admin-nav-tab ${activeTab === 'events' ? 'admin-nav-tab--active' : ''}`}
                                onClick={() => setActiveTab('events')}
                            >
                                Events ({metrics.activeEvents})
                            </button>
                        )}

                        {(isSuperAdmin || hasPermission(ADMIN_PERMISSIONS.MANAGE_APPLICATIONS)) && (
                            <button
                                type="button"
                                role="tab"
                                aria-selected={activeTab === 'applications'}
                                className={`admin-nav-tab ${activeTab === 'applications' ? 'admin-nav-tab--active' : ''}`}
                                onClick={() => setActiveTab('applications')}
                            >
                                Applications
                                {metrics.pendingApplications > 0 && (
                                    <span className="admin-tab-chip">{metrics.pendingApplications}</span>
                                )}
                            </button>
                        )}

                        {(isSuperAdmin || hasPermission(ADMIN_PERMISSIONS.MANAGE_QUERIES)) && (
                            <button
                                type="button"
                                role="tab"
                                aria-selected={activeTab === 'queries'}
                                className={`admin-nav-tab ${activeTab === 'queries' ? 'admin-nav-tab--active' : ''}`}
                                onClick={() => setActiveTab('queries')}
                            >
                                Queries
                                {metrics.unreadQueries > 0 && (
                                    <span className="admin-tab-chip">{metrics.unreadQueries}</span>
                                )}
                            </button>
                        )}

                        {(isSuperAdmin || hasPermission(ADMIN_PERMISSIONS.MANAGE_MERCH)) && (
                            <button
                                type="button"
                                role="tab"
                                aria-selected={activeTab === 'merch'}
                                className={`admin-nav-tab ${activeTab === 'merch' ? 'admin-nav-tab--active' : ''}`}
                                onClick={() => setActiveTab('merch')}
                            >
                                Merchandise
                            </button>
                        )}

                        {(isSuperAdmin || hasPermission(ADMIN_PERMISSIONS.MANAGE_MERCH_ORDERS)) && (
                            <button
                                type="button"
                                role="tab"
                                aria-selected={activeTab === 'merch-orders'}
                                className={`admin-nav-tab ${activeTab === 'merch-orders' ? 'admin-nav-tab--active' : ''}`}
                                onClick={() => setActiveTab('merch-orders')}
                            >
                                Merch Orders ({metrics.merchOrders})
                            </button>
                        )}

                        {isSuperAdmin && (
                            <button
                                type="button"
                                role="tab"
                                aria-selected={activeTab === 'members'}
                                className={`admin-nav-tab ${activeTab === 'members' ? 'admin-nav-tab--active' : ''}`}
                                onClick={() => setActiveTab('members')}
                            >
                                Members & Roles ({metrics.totalUsers})
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Tab Views Content */}
            <div className="admin-container admin-content">
                {/* 1. OVERVIEW VIEW */}
                {activeTab === 'overview' && (
                    <div className="admin-view">
                        <div className="admin-metrics-grid">
                            <div className="admin-metric-card">
                                <span className="admin-metric-card__label">TOTAL REGISTERED MEMBERS</span>
                                <span className="admin-metric-card__value">{metrics.totalUsers}</span>
                                <span className="admin-metric-card__hint">Single `users` collection in Firestore</span>
                            </div>

                            <div className="admin-metric-card">
                                <span className="admin-metric-card__label">PENDING APPLICATIONS</span>
                                <span className="admin-metric-card__value">{metrics.pendingApplications}</span>
                                <span className="admin-metric-card__hint">Join consortium submissions</span>
                            </div>

                            <div className="admin-metric-card">
                                <span className="admin-metric-card__label">UNREAD QUERIES</span>
                                <span className="admin-metric-card__value">{metrics.unreadQueries}</span>
                                <span className="admin-metric-card__hint">Public messages from contact form</span>
                            </div>

                            <div className="admin-metric-card">
                                <span className="admin-metric-card__label">ACTIVE EVENTS & TALKS</span>
                                <span className="admin-metric-card__value">{metrics.activeEvents}</span>
                                <span className="admin-metric-card__hint">Workshops, stargazing & talks</span>
                            </div>
                        </div>

                        {/* Quick Command Panels */}
                        <div className="admin-section-block">
                            <h2 className="admin-section-heading">OPERATIONAL ACTIONS</h2>
                            <div className="admin-actions-grid">
                                {(isSuperAdmin || hasPermission(ADMIN_PERMISSIONS.MANAGE_EVENTS)) && (
                                    <div className="admin-action-box">
                                        <h3>Observatory Event Dispatcher</h3>
                                        <p>Create upcoming workshops, competitions, stargazing expeditions, or manage existing entry passes.</p>
                                        <button
                                            type="button"
                                            className="admin-btn admin-btn--primary"
                                            onClick={() => setIsEventManagerOpen(true)}
                                        >
                                            Launch Event Manager
                                        </button>
                                    </div>
                                )}

                                {(isSuperAdmin || hasPermission(ADMIN_PERMISSIONS.MANAGE_PROMOS)) && (
                                    <div className="admin-action-box">
                                        <h3>Promotional Announcement Screen</h3>
                                        <p>Upload or update full-screen modal announcements, promotional graphics, or video broadcasts.</p>
                                        <button
                                            type="button"
                                            className="admin-btn admin-btn--secondary"
                                            onClick={() => setIsPromoManagerOpen(true)}
                                        >
                                            Configure Promotions
                                        </button>
                                    </div>
                                )}

                                {(isSuperAdmin || hasPermission(ADMIN_PERMISSIONS.MANAGE_APPLICATIONS)) && (
                                    <div className="admin-action-box">
                                        <h3>Applicant Triage</h3>
                                        <p>Review candidate responses for consortium roles, export spreadsheets, and record acceptance status.</p>
                                        <button
                                            type="button"
                                            className="admin-btn admin-btn--secondary"
                                            onClick={() => setActiveTab('applications')}
                                        >
                                            View Applications ({metrics.pendingApplications} pending)
                                        </button>
                                    </div>
                                )}

                                {isSuperAdmin && (
                                    <div className="admin-action-box">
                                        <h3>Role & Privileges Directory</h3>
                                        <p>Inspect the single users collection in Firestore and grant isAdmin or isSuperAdmin flags directly.</p>
                                        <button
                                            type="button"
                                            className="admin-btn admin-btn--secondary"
                                            onClick={() => setActiveTab('members')}
                                        >
                                            Manage Users & Privileges
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. EVENTS VIEW */}
                {activeTab === 'events' && (
                    <div className="admin-view">
                        <div className="admin-view-header">
                            <div>
                                <h2 className="admin-view-title">Consortium Events & Sessions</h2>
                                <p className="admin-view-desc">Create events, set registration deadlines, manage guest speakers, and export attendee rosters.</p>
                            </div>
                            <button
                                type="button"
                                className="admin-btn admin-btn--primary"
                                onClick={() => setIsEventManagerOpen(true)}
                            >
                                Open Event Manager Modal
                            </button>
                        </div>
                        <div className="admin-placeholder-box">
                            <p>Event Manager dialog is ready. Click the button above to create or edit events.</p>
                        </div>
                    </div>
                )}

                {/* 3. APPLICATIONS VIEW */}
                {activeTab === 'applications' && (
                    <div className="admin-view">
                        <ApplicationsManager />
                    </div>
                )}

                {/* 4. QUERIES VIEW */}
                {activeTab === 'queries' && (
                    <div className="admin-view">
                        <ManageQueries />
                    </div>
                )}

                {/* 5. MERCHANDISE VIEW */}
                {activeTab === 'merch' && (
                    <div className="admin-view">
                        <MerchManager />
                    </div>
                )}

                {/* 6. MERCH ORDERS VIEW */}
                {activeTab === 'merch-orders' && (
                    <div className="admin-view">
                        <MerchOrdersManager />
                    </div>
                )}

                {/* 7. MEMBERS & ROLES (SUPER ADMIN ONLY) */}
                {activeTab === 'members' && isSuperAdmin && (
                    <div className="admin-view">
                        <div className="admin-view-header">
                            <div>
                                <h2 className="admin-view-title">Member Privileges & Role Control</h2>
                                <p className="admin-view-desc">
                                    Manage individual records directly inside the single Firestore <code>users</code> collection. Toggle <code>isAdmin</code> and <code>isSuperAdmin</code> flags safely.
                                </p>
                            </div>
                            <div className="admin-search-wrapper">
                                <input
                                    type="text"
                                    className="admin-search-input"
                                    placeholder="Search by name, email, or Orbit ID..."
                                    value={searchUserQuery}
                                    onChange={(e) => setSearchUserQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="admin-table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Orbit ID</th>
                                        <th>Name & Email</th>
                                        <th>Course / Stream</th>
                                        <th>Admin Privileges</th>
                                        <th>Super Admin Privileges</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="admin-table-empty">
                                                No users matching query.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((u) => (
                                            <tr key={u.id}>
                                                <td className="admin-mono-cell">{u.orbitId || 'Pending'}</td>
                                                <td>
                                                    <div className="admin-user-name">
                                                        {u.firstName ? `${u.firstName} ${u.lastName || ''}` : 'Unnamed User'}
                                                    </div>
                                                    <div className="admin-user-email">{u.email || u.id}</div>
                                                </td>
                                                <td>{u.courseName || u.stream || 'Member'}</td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className={`admin-toggle-chip ${u.isAdmin ? 'admin-toggle-chip--active' : ''}`}
                                                        disabled={updatingUserId === u.id}
                                                        onClick={() => handleToggleAdminRole(u, 'isAdmin')}
                                                    >
                                                        {u.isAdmin ? 'ACTIVE ADMIN' : 'USER ONLY'}
                                                    </button>
                                                </td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className={`admin-toggle-chip admin-toggle-chip--super ${u.isSuperAdmin ? 'admin-toggle-chip--active-super' : ''}`}
                                                        disabled={updatingUserId === u.id}
                                                        onClick={() => handleToggleAdminRole(u, 'isSuperAdmin')}
                                                    >
                                                        {u.isSuperAdmin ? 'SUPER ADMIN' : 'REGULAR'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Event Manager Modal Dialog */}
            <EventManager
                isOpen={isEventManagerOpen}
                onClose={() => setIsEventManagerOpen(false)}
                adminOrbitId={orbitId}
            />

            {/* Promo Manager Modal Dialog */}
            <PromoManager
                isOpen={isPromoManagerOpen}
                onClose={() => setIsPromoManagerOpen(false)}
                adminOrbitId={orbitId}
            />

            {/* Admin Profile Customization Modal */}
            <AdminProfileCustomization
                isOpen={isAdminProfileOpen}
                onClose={() => setIsAdminProfileOpen(false)}
            />

            <Footer />
        </main>
    );
}
