import React from 'react';
import type { MerchProduct } from '../../types/merch';
import './MerchCard.css';

interface MerchCardProps {
    product: MerchProduct;
    onSelect: (product: MerchProduct) => void;
    onBuyNow?: (product: MerchProduct) => void;
}

export default function MerchCard({ product, onSelect, onBuyNow }: MerchCardProps) {
    const mainImage = product.images?.[0] || '/merch/orbitx-tshirt-black.jpg';
    const hasDiscount = Boolean(product.originalPrice && product.originalPrice > product.price);

    const handleClick = () => {
        onSelect(product);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(product);
        }
    };

    return (
        <article
            className={`merch-card ${!product.inStock ? 'merch-card--out-of-stock' : ''}`}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-label={`${product.name} - ₹${product.price}`}
        >
            {/* Image Stage */}
            <div className="merch-card__media">
                <img
                    src={mainImage}
                    alt={product.name}
                    className="merch-card__img"
                    loading="lazy"
                />

                <div className="merch-card__badges-overlay">
                    <span className="merch-card__badge-pill merch-card__badge-pill--category">
                        {product.category}
                    </span>
                    {product.badge && (
                        <span className="merch-card__badge-pill merch-card__badge-pill--special">
                            {product.badge}
                        </span>
                    )}
                    {!product.inStock && (
                        <span className="merch-card__badge-pill merch-card__badge-pill--out">
                            Sold Out
                        </span>
                    )}
                </div>
            </div>

            {/* Product Info */}
            <div className="merch-card__body">
                <div className="merch-card__title-row">
                    <h3 className="merch-card__title" title={product.name}>
                        {product.name}
                    </h3>
                </div>

                <p className="merch-card__description">
                    {product.description}
                </p>

                {/* Available Sizes Strip */}
                {product.sizes && product.sizes.length > 0 ? (
                    <div className="merch-card__sizes" aria-label="Available sizes">
                        <span className="merch-card__sizes-label">Sizes:</span>
                        <div className="merch-card__sizes-list">
                            {product.sizes.map((size) => (
                                <span key={size} className="merch-card__size-chip">
                                    {size}
                                </span>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="merch-card__sizes">
                        <span className="merch-card__sizes-label">Format:</span>
                        <span className="merch-card__size-chip">Standard</span>
                    </div>
                )}
            </div>

            {/* Footer Bar */}
            <div className="merch-card__footer">
                <div className="merch-card__price-wrap">
                    <strong className="merch-card__price">
                        ₹{product.price.toLocaleString('en-IN')}
                    </strong>
                    {hasDiscount && (
                        <span className="merch-card__original-price">
                            ₹{product.originalPrice?.toLocaleString('en-IN')}
                        </span>
                    )}
                </div>

                <button
                    type="button"
                    className="merch-card__btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onBuyNow) {
                            onBuyNow(product);
                        } else {
                            onSelect(product);
                        }
                    }}
                    aria-label={`Buy ${product.name}`}
                >
                    Buy Now
                </button>
            </div>
        </article>
    );
}
