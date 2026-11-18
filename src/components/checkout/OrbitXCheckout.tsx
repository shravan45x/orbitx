import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { MerchProduct } from '../../types/merch';
import './OrbitXCheckout.css';

interface OrbitXCheckoutProps {
    isOpen: boolean;
    onClose: () => void;
    product?: MerchProduct | null;
}

export default function OrbitXCheckout({ isOpen, onClose, product }: OrbitXCheckoutProps) {
    // ESC key close & lock all background scrolling
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        // Strict background scroll locking
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
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const productImage = product?.images?.[0] || '';

    const modalContent = (
        <div
            className="orbitx-checkout-overlay"
            onClick={onClose}
            onWheel={(e) => {
                if (e.target === e.currentTarget) {
                    e.preventDefault();
                }
            }}
            onTouchMove={(e) => {
                if (e.target === e.currentTarget) {
                    e.preventDefault();
                }
            }}
            role="dialog"
            aria-modal="true"
            aria-label="OrbitX Checkout"
        >
            <div
                className="orbitx-checkout-modal"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Borderless Close Button */}
                <button
                    type="button"
                    className="orbitx-checkout-modal__close-btn"
                    onClick={onClose}
                    aria-label="Close checkout"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {/* Right-Side Product Visual (25% Area) with Left & Stronger Bottom Fade */}
                {productImage && (
                    <div className="orbitx-checkout-modal__visual-pane" aria-hidden="true">
                        <div className="orbitx-checkout-modal__visual-wrap">
                            <img
                                src={productImage}
                                alt={product?.name || 'Product'}
                                className="orbitx-checkout-modal__visual-img"
                            />
                            <div className="orbitx-checkout-modal__visual-fade" />
                        </div>
                    </div>
                )}

                <div className="orbitx-checkout-modal__body">
                    {/* Content will go here; internal scrolling supported */}
                </div>
            </div>
        </div>
    );

    // Portaled directly to document.body to break free from transformed page wrappers
    return createPortal(modalContent, document.body);
}
