import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { JobRole } from '../../types/recruitment';
import './RoleModal.css';

interface RoleModalProps {
    role: JobRole;
    onClose: () => void;
    onApply?: (role: JobRole) => void;
}

export default function RoleModal({ role, onClose, onApply }: RoleModalProps) {
    // Lock scroll and handle Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        const originalBodyOverflow = document.body.style.overflow;
        const originalHtmlOverflow = document.documentElement.style.overflow;
        const originalTouchAction = document.body.style.touchAction;

        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = originalBodyOverflow;
            document.documentElement.style.overflow = originalHtmlOverflow;
            document.body.style.touchAction = originalTouchAction;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const handleApplyClick = () => {
        if (role.applyUrl) {
            window.open(role.applyUrl, '_blank', 'noopener,noreferrer');
        } else if (onApply) {
            onApply(role);
        } else {
            const subject = encodeURIComponent(`Application for ${role.title} - OrbitX`);
            const body = encodeURIComponent(
                `Hello OrbitX Team,\n\nI would like to apply for the ${role.title} position in the ${role.department} department.\n\nName:\nDepartment & Year:\nResume / Portfolio Link:\n\nThank you.`
            );
            window.location.href = `mailto:${role.contactEmail || 'orbitx@zcoer.in'}?subject=${subject}&body=${body}`;
        }
    };

    return createPortal(
        <div
            className="role-modal-overlay"
            onClick={onClose}
            onWheel={(e) => {
                if (e.target === e.currentTarget) e.preventDefault();
            }}
            onTouchMove={(e) => {
                if (e.target === e.currentTarget) e.preventDefault();
            }}
            role="dialog"
            aria-modal="true"
        >
            <div className="role-modal" onClick={(e) => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="role-modal__header">
                    <div className="role-modal__badges">
                        <span className="role-modal__tag">{role.department}</span>
                        <span className="role-modal__type">{role.type}</span>
                    </div>
                    <button
                        type="button"
                        className="role-modal__close-btn"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                {/* Role Title */}
                <h2 className="role-modal__title">{role.title}</h2>

                {/* Metadata strip */}
                <div className="role-modal__meta-grid">
                    <div className="role-modal__meta-cell">
                        <span className="role-modal__meta-label">Location</span>
                        <span className="role-modal__meta-value">{role.location}</span>
                    </div>
                    {role.commitment && (
                        <div className="role-modal__meta-cell">
                            <span className="role-modal__meta-label">Commitment</span>
                            <span className="role-modal__meta-value">{role.commitment}</span>
                        </div>
                    )}
                    {role.deadline && (
                        <div className="role-modal__meta-cell">
                            <span className="role-modal__meta-label">Deadline</span>
                            <span className="role-modal__meta-value">{role.deadline}</span>
                        </div>
                    )}
                    {role.openPositions && (
                        <div className="role-modal__meta-cell">
                            <span className="role-modal__meta-label">Openings</span>
                            <span className="role-modal__meta-value">
                                {role.openPositions} {role.openPositions > 1 ? 'positions' : 'position'}
                            </span>
                        </div>
                    )}
                </div>

                {/* Body Content */}
                <div className="role-modal__body">
                    {/* Role Description */}
                    <div className="role-modal__section">
                        <h4 className="role-modal__section-title">About the Role</h4>
                        <p className="role-modal__text">{role.description}</p>
                    </div>

                    {/* Responsibilities */}
                    {role.responsibilities && role.responsibilities.length > 0 && (
                        <div className="role-modal__section">
                            <h4 className="role-modal__section-title">Responsibilities</h4>
                            <ul className="role-modal__list">
                                {role.responsibilities.map((resp, idx) => (
                                    <li key={idx} className="role-modal__list-item">
                                        <span className="role-modal__bullet">•</span>
                                        <span>{resp}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Requirements */}
                    {role.requirements && role.requirements.length > 0 && (
                        <div className="role-modal__section">
                            <h4 className="role-modal__section-title">Requirements & Skills</h4>
                            <div className="role-modal__tags">
                                {role.requirements.map((req, idx) => (
                                    <span key={idx} className="role-modal__tag-pill">
                                        {req}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Action */}
                <div className="role-modal__footer">
                    <button
                        type="button"
                        className="role-modal__dismiss-btn"
                        onClick={onClose}
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        className="role-modal__apply-btn"
                        onClick={handleApplyClick}
                    >
                        {role.applyUrl ? 'Open Application Form ↗' : 'Apply Now'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
