import type { MerchProduct } from '../types/merch';

export const DEFAULT_MERCH_PRODUCTS: MerchProduct[] = [
    {
        id: 'orbitx-mission-shirt-2inr',
        productId: 'PRD-2026-0001',
        name: 'OrbitX Mission Shirt',
        price: 2,
        originalPrice: 2,
        category: 'T-Shirts',
        description: 'Official OrbitX aerospace club cotton shirt.',
        details: [
            '100% Combed Terry Cotton',
            'High-density Screen Printed Graphics',
            'Relaxed Drop-Shoulder Fit',
            'Bio-washed for long wear'
        ],
        images: ['/merch/orbitx-tshirt-black.jpg'],
        inStock: true,
        badge: 'SPECIAL DROP',
        sizes: ['S', 'M', 'L', 'XL', 'XXL']
    }
];
