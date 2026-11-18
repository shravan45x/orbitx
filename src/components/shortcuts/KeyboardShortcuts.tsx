import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './KeyboardShortcuts.css';

type KeyboardShortcutsProps = {
    isOpen: boolean;
    onClose: () => void;
};

const SHORTCUTS = [
    { key: 'T / Alt+T', description: 'Toggle theme (Dark / Light)' },
    { key: 'Esc', description: 'Close any open overlay' },
    { key: '?', description: 'Show this help' }
];

export default function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        const originalBodyOverflow = document.body.style.overflow;
        const originalHtmlOverflow = document.documentElement.style.overflow;
        const originalTouchAction = document.body.style.touchAction;

        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = originalBodyOverflow;
            document.documentElement.style.overflow = originalHtmlOverflow;
            document.body.style.touchAction = originalTouchAction;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 200);
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div
            className={`shortcuts-overlay ${isClosing ? 'shortcuts-overlay--closing' : ''}`}
            onClick={handleBackdropClick}
            onWheel={(e) => {
                if (e.target === e.currentTarget) e.preventDefault();
            }}
            onTouchMove={(e) => {
                if (e.target === e.currentTarget) e.preventDefault();
            }}
            role="dialog"
            aria-modal="true"
        >
            <div className="shortcuts-modal">
                <div className="shortcuts-header">
                    <h2 className="shortcuts-title">Keyboard Shortcuts</h2>
                    <button className="shortcuts-close" onClick={handleClose} aria-label="Close shortcuts">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div className="shortcuts-list">
                    {SHORTCUTS.map((shortcut, index) => (
                        <div key={index} className="shortcuts-item">
                            <kbd className="shortcuts-key">{shortcut.key}</kbd>
                            <span className="shortcuts-desc">{shortcut.description}</span>
                        </div>
                    ))}
                </div>
                <p className="shortcuts-hint">Press <kbd>?</kbd> anytime to see shortcuts</p>
            </div>
        </div>,
        document.body
    );
}
