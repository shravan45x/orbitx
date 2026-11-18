import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { MerchProduct } from '../../types/merch';
import './MerchModal.css';

interface MerchModalProps {
    product: MerchProduct | null;
    onClose: () => void;
    onBuyNow?: (product: MerchProduct) => void;
}

export default function MerchModal({ product, onClose, onBuyNow }: MerchModalProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const [orderFeedback, setOrderFeedback] = useState<string | null>(null);

    // Sync initial size when product changes
    useEffect(() => {
        if (product && product.sizes && product.sizes.length > 0) {
            setSelectedSize(product.sizes[0]);
        } else {
            setSelectedSize('');
        }
        setSelectedImageIndex(0);
        setQuantity(1);
        setOrderFeedback(null);
    }, [product]);

    // Handle ESC key to close modal & lock body scroll
    useEffect(() => {
        if (!product) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
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
    }, [product, onClose]);

    if (!product) return null;

    const images = product.images && product.images.length > 0
        ? product.images
        : ['/merch/orbitx-tshirt-black.jpg'];

    const currentImage = images[selectedImageIndex] || images[0];
    const hasDiscount = Boolean(product.originalPrice && product.originalPrice > product.price);

    const handleIncrement = () => {
        setQuantity(prev => Math.min(prev + 1, 10));
    };

    const handleDecrement = () => {
        setQuantity(prev => Math.max(prev - 1, 1));
    };

    const handleActionClick = () => {
        if (product && onBuyNow) {
            onClose();
            onBuyNow(product);
        } else {
            setOrderFeedback('Order system is ready for backend integration.');
            setTimeout(() => setOrderFeedback(null), 3000);
        }
    };

    return createPortal(
        <div
            className="merch-modal-overlay"
            onClick={onClose}
            onWheel={(e) => {
                if (e.target === e.currentTarget) e.preventDefault();
            }}
            onTouchMove={(e) => {
                if (e.target === e.currentTarget) e.preventDefault();
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="merch-modal-title"
        >
            <div
                className="merch-modal"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="merch-modal__header">
                    <div className="merch-modal__meta">
                        <span className="merch-modal__category">{product.category}</span>
                        {product.productId && (
                            <span className="merch-modal__product-id">{product.productId}</span>
                        )}
                    </div>
                    <button
                        type="button"
                        className="merch-modal__close-btn"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                <div className="merch-modal__content-grid">
                    {/* Left Column: Visual Stage */}
                    <div className="merch-modal__gallery">
                        <div className="merch-modal__main-image-wrap">
                            <img
                                src={currentImage}
                                alt={product.name}
                                className="merch-modal__main-img"
                            />
                            {product.badge && (
                                <span className="merch-modal__badge-tag">
                                    {product.badge}
                                </span>
                            )}
                        </div>

                        {images.length > 1 && (
                            <div className="merch-modal__thumbs-row">
                                {images.map((imgUrl, index) => (
                                    <button
                                        key={imgUrl}
                                        type="button"
                                        className={`merch-modal__thumb-btn ${index === selectedImageIndex ? 'active' : ''}`}
                                        onClick={() => setSelectedImageIndex(index)}
                                        aria-label={`View image ${index + 1}`}
                                    >
                                        <img src={imgUrl} alt="" className="merch-modal__thumb-img" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Specifications & Actions */}
                    <div className="merch-modal__details">
                        <h2 id="merch-modal-title" className="merch-modal__title">
                            {product.name}
                        </h2>

                        {/* Price & Stock Strip */}
                        <div className="merch-modal__pricing-bar">
                            <div className="merch-modal__price-group">
                                <strong className="merch-modal__price">
                                    ₹{product.price.toLocaleString('en-IN')}
                                </strong>
                                {hasDiscount && (
                                    <span className="merch-modal__original-price">
                                        ₹{product.originalPrice?.toLocaleString('en-IN')}
                                    </span>
                                )}
                                <span className="merch-modal__tax-note">Taxes included</span>
                            </div>

                            <div className="merch-modal__stock-pill">
                                <span className={`merch-modal__stock-dot ${product.inStock ? 'is-in' : 'is-out'}`} />
                                <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                            </div>
                        </div>

                        <p className="merch-modal__description">
                            {product.description}
                        </p>

                        {/* Size Picker (If applicable) */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div className="merch-modal__section">
                                <div className="merch-modal__section-header">
                                    <span className="merch-modal__section-title">Select Size</span>
                                    <span className="merch-modal__size-guide-text">Regular Streetwear Fit</span>
                                </div>
                                <div className="merch-modal__size-selector">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            type="button"
                                            className={`merch-modal__size-btn ${selectedSize === size ? 'selected' : ''}`}
                                            onClick={() => setSelectedSize(size)}
                                            aria-pressed={selectedSize === size}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity Counter */}
                        <div className="merch-modal__section">
                            <span className="merch-modal__section-title">Quantity</span>
                            <div className="merch-modal__qty-selector">
                                <button
                                    type="button"
                                    className="merch-modal__qty-btn"
                                    onClick={handleDecrement}
                                    disabled={quantity <= 1}
                                    aria-label="Decrease quantity"
                                >
                                    −
                                </button>
                                <span className="merch-modal__qty-val" aria-live="polite">
                                    {quantity}
                                </span>
                                <button
                                    type="button"
                                    className="merch-modal__qty-btn"
                                    onClick={handleIncrement}
                                    disabled={quantity >= 10}
                                    aria-label="Increase quantity"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Material & Feature Specifications */}
                        {product.details && product.details.length > 0 && (
                            <div className="merch-modal__section">
                                <span className="merch-modal__section-title">Specifications</span>
                                <ul className="merch-modal__features-list">
                                    {product.details.map((detail, idx) => (
                                        <li key={idx} className="merch-modal__feature-item">
                                            <span className="merch-modal__feature-bullet">✦</span>
                                            <span>{detail}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Delivery Info Strip */}
                        <div className="merch-modal__delivery-strip">
                            <div className="merch-modal__delivery-item">
                                <span className="merch-modal__delivery-icon">🏛</span>
                                <div>
                                    <strong>Campus Pickup:</strong>
                                    <span>OrbitX Laboratory, Zeal Campus (Free)</span>
                                </div>
                            </div>
                            <div className="merch-modal__delivery-item">
                                <span className="merch-modal__delivery-icon">📦</span>
                                <div>
                                    <strong>Pan-India Delivery:</strong>
                                    <span>Dispatched within 3–5 working days</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="merch-modal__actions">
                            <button
                                type="button"
                                className="merch-modal__action-btn merch-modal__action-btn--primary"
                                onClick={handleActionClick}
                                disabled={!product.inStock}
                            >
                                {product.inStock ? `Buy Now (₹${(product.price * quantity).toLocaleString('en-IN')})` : 'Currently Unavailable'}
                            </button>
                            <button
                                type="button"
                                className="merch-modal__action-btn merch-modal__action-btn--secondary"
                                onClick={onClose}
                            >
                                Return to Catalog
                            </button>
                        </div>

                        {orderFeedback && (
                            <div className="merch-modal__feedback-notice" role="status">
                                {orderFeedback}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
