export interface MerchProduct {
    id: string;
    productId?: string;
    name: string;
    price: number;
    originalPrice?: number;
    category: 'T-Shirts' | 'Hoodies' | 'Stickers' | 'Accessories' | string;
    description: string;
    details?: string[];
    images: string[];
    inStock: boolean;
    badge?: string;
    sizes?: string[];
    createdAt?: string;
}

export type MerchCategory = 'All' | 'T-Shirts' | 'Hoodies' | 'Stickers' | 'Accessories';
