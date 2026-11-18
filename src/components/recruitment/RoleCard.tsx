import type { JobRole } from '../../types/recruitment';
import './RoleCard.css';

interface RoleCardProps {
    role: JobRole;
    onSelectRole: (role: JobRole) => void;
}

export default function RoleCard({ role, onSelectRole }: RoleCardProps) {
    return (
        <article className="role-card">
            <div className="role-card__header">
                <span className="role-card__dept">{role.department}</span>
                <span className="role-card__type">{role.type}</span>
            </div>

            <h3 className="role-card__title">{role.title}</h3>

            <div className="role-card__meta">
                <div className="role-card__meta-item">
                    <svg className="role-card__meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{role.location}</span>
                </div>
                {role.commitment && (
                    <div className="role-card__meta-item">
                        <svg className="role-card__meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>{role.commitment}</span>
                    </div>
                )}
                {role.deadline && (
                    <div className="role-card__meta-item role-card__meta-item--deadline">
                        <svg className="role-card__meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span>Deadline: {role.deadline}</span>
                    </div>
                )}
            </div>

            <p className="role-card__desc">{role.description}</p>

            {role.requirements && role.requirements.length > 0 && (
                <div className="role-card__tags">
                    {role.requirements.slice(0, 4).map((req, idx) => (
                        <span key={idx} className="role-card__tag">
                            {req}
                        </span>
                    ))}
                    {role.requirements.length > 4 && (
                        <span className="role-card__tag role-card__tag--more">
                            +{role.requirements.length - 4} more
                        </span>
                    )}
                </div>
            )}

            <div className="role-card__footer">
                <button
                    type="button"
                    className="role-card__action-btn"
                    onClick={() => onSelectRole(role)}
                >
                    View Details & Apply
                </button>
            </div>
        </article>
    );
}
