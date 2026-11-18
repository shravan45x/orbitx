import { useState, useEffect, useMemo } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { subscribeActiveRoles } from '../../services/firebase/recruitment';
import type { JobRole } from '../../types/recruitment';
import { AlertSubscriptionBox, RoleCard, RoleModal } from '../../components/recruitment';
import { Toolbar, SearchInput, FilterDropdown } from '../../components/ui';
import Footer from '../../components/layout/Footer';
import './Recruitment.css';

interface Application {
    id: string;
    applicationId: string;
    firstName: string;
    lastName: string;
    email: string;
    course: string;
    interests: string[];
    status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
    remark?: string;
    submittedAt: string;
}

export default function Recruitment() {
    const { user } = useAuth();

    const [roles, setRoles] = useState<JobRole[]>([]);
    const [isLoadingRoles, setIsLoadingRoles] = useState(true);
    const [selectedRole, setSelectedRole] = useState<JobRole | null>(null);

    // Search and filters for active roles
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDept, setSelectedDept] = useState('ALL');

    // User's own application history if logged in
    const [userApplications, setUserApplications] = useState<Application[]>([]);

    // 1. Subscribe to active roles from Firestore
    useEffect(() => {
        const unsubscribe = subscribeActiveRoles((fetchedRoles) => {
            setRoles(fetchedRoles);
            setIsLoadingRoles(false);
        });

        return () => unsubscribe();
    }, []);

    // 2. Listen to user's application history if authenticated
    useEffect(() => {
        if (!user?.email) {
            setUserApplications([]);
            return;
        }

        const q = query(
            collection(db, 'applications'),
            where('email', '==', user.email.toLowerCase())
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const apps = snapshot.docs.map((docSnap) => ({
                    id: docSnap.id,
                    ...docSnap.data()
                })) as Application[];

                apps.sort(
                    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
                );
                setUserApplications(apps);
            },
            (err) => {
                console.warn('Error fetching user applications:', err);
            }
        );

        return () => unsubscribe();
    }, [user?.email]);

    // Unique departments list for filter
    const departmentOptions = useMemo(() => {
        const depts = Array.from(new Set(roles.map((r) => r.department))).filter(Boolean);
        return [
            { value: 'ALL', label: 'All Departments' },
            ...depts.map((d) => ({ value: d, label: d }))
        ];
    }, [roles]);

    // Filtered roles
    const filteredRoles = useMemo(() => {
        return roles.filter((role) => {
            const matchesDept = selectedDept === 'ALL' || role.department === selectedDept;
            const matchesQuery =
                !searchQuery.trim() ||
                role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                role.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                role.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                role.requirements.some((req) => req.toLowerCase().includes(searchQuery.toLowerCase()));

            return matchesDept && matchesQuery;
        });
    }, [roles, selectedDept, searchQuery]);

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'pending':
            case 'reviewed':
                return 'recruitment-history__status--pending';
            case 'accepted':
                return 'recruitment-history__status--accepted';
            case 'rejected':
                return 'recruitment-history__status--rejected';
            default:
                return '';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending':
            case 'reviewed':
                return 'Under Review';
            case 'accepted':
                return 'Accepted';
            case 'rejected':
                return 'Not Selected';
            default:
                return status;
        }
    };

    return (
        <>
            <main className="recruitment-page">
                {/* Main Content Area */}
                <section className="recruitment-content">
                    <div className="recruitment-container">
                        {isLoadingRoles ? (
                            <div className="recruitment-loading">
                                <div className="recruitment-loading__spinner" aria-hidden="true" />
                                <span className="recruitment-loading__text">
                                    Loading open positions...
                                </span>
                            </div>
                        ) : roles.length > 0 ? (
                            /* State A: When active roles exist */
                            <div className="recruitment-roles-view">
                                <div className="recruitment-toolbar-wrap">
                                    <Toolbar>
                                        <SearchInput
                                            value={searchQuery}
                                            onChange={setSearchQuery}
                                            placeholder="Search roles by title, department, or skill..."
                                        />
                                        {departmentOptions.length > 2 && (
                                            <FilterDropdown
                                                value={selectedDept}
                                                options={departmentOptions}
                                                onChange={setSelectedDept}
                                            />
                                        )}
                                    </Toolbar>
                                </div>

                                {filteredRoles.length > 0 ? (
                                    <div className="recruitment-grid">
                                        {filteredRoles.map((role) => (
                                            <RoleCard
                                                key={role.id}
                                                role={role}
                                                onSelectRole={setSelectedRole}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="recruitment-no-match">
                                        <h3 className="recruitment-no-match__title">No matching roles found</h3>
                                        <p className="recruitment-no-match__text">
                                            No positions match your search criteria. Try choosing another department or clearing the search text.
                                        </p>
                                    </div>
                                )}

                                {/* Bottom Alert Box */}
                                <div className="recruitment-bottom-alert">
                                    <AlertSubscriptionBox
                                        compact
                                        title="Looking for a different role?"
                                        description="Subscribe to receive alerts when new positions in other departments are announced."
                                    />
                                </div>
                            </div>
                        ) : (
                            /* State B: When NO roles exist */
                            <div className="recruitment-standby">
                                <div className="recruitment-standby__icon-box">
                                    {/* Clean Briefcase Icon */}
                                    <div className="recruitment-standby__icon" aria-hidden="true">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="recruitment-icon-svg">
                                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                                            <line x1="12" y1="12" x2="12" y2="12.01" strokeWidth="3" />
                                        </svg>
                                    </div>

                                    <div className="recruitment-standby__info">
                                        <h2 className="recruitment-standby__heading">
                                            Currently No Open Positions
                                        </h2>
                                        <p className="recruitment-standby__desc">
                                            There are currently no job or role openings available at this time. Subscribe below to be the first to receive alerts when new openings are posted.
                                        </p>
                                    </div>
                                </div>

                                {/* Subscription Box */}
                                <div className="recruitment-standby__sub-wrap">
                                    <AlertSubscriptionBox
                                        title="Be the First to Receive Job Alerts"
                                        description="Enter your email address below. When new roles or recruitment drives are announced, you'll receive an alert directly in your inbox."
                                    />
                                </div>

                                {/* Information Cards */}
                                <div className="recruitment-info-grid">
                                    <div className="recruitment-info-card">
                                        <h3 className="recruitment-info-card__title">Regular Intakes</h3>
                                        <p className="recruitment-info-card__desc">
                                            OrbitX opens team recruitment drives ahead of new semesters and major space technology initiatives.
                                        </p>
                                    </div>

                                    <div className="recruitment-info-card">
                                        <h3 className="recruitment-info-card__title">Open to All Students</h3>
                                        <p className="recruitment-info-card__desc">
                                            Open to college students from all engineering, IT, and design branches. Motivation, willingness to learn, and teamwork matter most.
                                        </p>
                                    </div>

                                    <div className="recruitment-info-card">
                                        <h3 className="recruitment-info-card__title">Diverse Departments</h3>
                                        <p className="recruitment-info-card__desc">
                                            Roles span Hardware & Embedded, Mechanical, Software & Web, Research, Creative Media, and Management.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Past Applications Table for Logged-In Users */}
                        {userApplications.length > 0 && (
                            <section className="recruitment-history">
                                <div className="recruitment-history__header">
                                    <h2 className="recruitment-history__title">
                                        Your Applications
                                    </h2>
                                </div>

                                <div className="recruitment-history__table-wrapper">
                                    <table className="recruitment-history__table">
                                        <thead>
                                            <tr>
                                                <th>Sr. No.</th>
                                                <th>Application ID</th>
                                                <th>Department / Track</th>
                                                <th>Date Submitted</th>
                                                <th>Status</th>
                                                <th>Remarks</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {userApplications.map((app, index) => (
                                                <tr key={app.id}>
                                                    <td>{index + 1}</td>
                                                    <td className="recruitment-history__app-id">
                                                        {app.applicationId || 'N/A'}
                                                    </td>
                                                    <td>{app.course || 'OrbitX Member'}</td>
                                                    <td>
                                                        {new Date(app.submittedAt).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </td>
                                                    <td>
                                                        <span
                                                            className={`recruitment-history__status ${getStatusClass(
                                                                app.status
                                                            )}`}
                                                        >
                                                            {getStatusLabel(app.status)}
                                                        </span>
                                                    </td>
                                                    <td className="recruitment-history__remark">
                                                        {app.remark || '—'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        )}
                    </div>
                </section>
            </main>

            {/* Role Modal */}
            {selectedRole && (
                <RoleModal
                    role={selectedRole}
                    onClose={() => setSelectedRole(null)}
                />
            )}

            <Footer />
        </>
    );
}
