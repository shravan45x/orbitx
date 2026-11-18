import { useState, useEffect, type FormEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../toast/Toast';
import { subscribeRecruitmentAlert } from '../../services/firebase/recruitment';
import './AlertSubscriptionBox.css';

interface AlertSubscriptionBoxProps {
    title?: string;
    description?: string;
    compact?: boolean;
}

export default function AlertSubscriptionBox({
    title = 'Receive Job & Role Alerts',
    description = 'Enter your email address to get notified whenever new roles or positions are posted.',
    compact = false
}: AlertSubscriptionBoxProps) {
    const { user } = useAuth();
    const { showToast } = useToast();

    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [confirmedEmail, setConfirmedEmail] = useState('');

    // Pre-fill with authenticated user email if available
    useEffect(() => {
        if (user?.email && !email && !isSuccess) {
            setEmail(user.email);
        }
    }, [user?.email, isSuccess]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            showToast('Please enter a valid email address', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await subscribeRecruitmentAlert(trimmedEmail);
            if (res.success) {
                setConfirmedEmail(trimmedEmail);
                setIsSuccess(true);
                showToast(res.message, res.alreadySubscribed ? 'info' : 'success');
            } else {
                showToast(res.message, 'error');
            }
        } catch (err: any) {
            showToast(err?.message || 'Failed to subscribe for alerts', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setIsSuccess(false);
        setEmail('');
    };

    return (
        <div className={`alert-sub-box ${compact ? 'alert-sub-box--compact' : ''}`}>
            <div className="alert-sub-box__header">
                <span className="alert-sub-box__tag">Job Alerts</span>
            </div>

            <h3 className="alert-sub-box__title">{title}</h3>
            <p className="alert-sub-box__desc">{description}</p>

            {isSuccess ? (
                <div className="alert-sub-box__success">
                    <div className="alert-sub-box__success-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <div className="alert-sub-box__success-info">
                        <span className="alert-sub-box__success-title">Subscribed Successfully</span>
                        <p className="alert-sub-box__success-text">
                            We will email <strong>{confirmedEmail}</strong> as soon as new positions open.
                        </p>
                    </div>
                    <button
                        type="button"
                        className="alert-sub-box__reset-btn"
                        onClick={handleReset}
                    >
                        Subscribe Another Email
                    </button>
                </div>
            ) : (
                <form className="alert-sub-box__form" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        className="alert-sub-box__input"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSubmitting}
                        required
                        aria-label="Email for job alerts"
                    />
                    <button
                        type="submit"
                        className="alert-sub-box__btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                    </button>
                </form>
            )}

            <div className="alert-sub-box__footer">
                <span className="alert-sub-box__note">
                    We will only email you when new openings or recruitment drives are announced.
                </span>
            </div>
        </div>
    );
}
