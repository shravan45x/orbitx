// Razorpay Payment Gateway Service (Client-side integration)
// Note: Secret Key must NEVER be exposed to the client. Only the Key ID is used here.

export interface RazorpaySuccessResponse {
    razorpay_payment_id: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
}

export interface RazorpayFailureResponse {
    error: {
        code: string;
        description: string;
        source?: string;
        step?: string;
        reason?: string;
        metadata?: {
            order_id?: string;
            payment_id?: string;
        };
    };
}

export interface RazorpayCheckoutConfig {
    key: string;
    amountInPaise: number;
    currency?: string;
    name?: string;
    description?: string;
    image?: string;
    orderId?: string;
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
    notes?: Record<string, string>;
    onSuccess: (response: RazorpaySuccessResponse) => void;
    onFailure?: (response: RazorpayFailureResponse) => void;
    onDismiss?: () => void;
}

/**
 * Dynamically loads the Razorpay checkout script if not present
 */
export const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
        if (typeof window === 'undefined') {
            resolve(false);
            return;
        }

        if (window.Razorpay) {
            resolve(true);
            return;
        }

        const existingScript = document.querySelector<HTMLScriptElement>(
            'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
        );

        if (existingScript) {
            existingScript.addEventListener('load', () => resolve(true));
            existingScript.addEventListener('error', () => resolve(false));
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => {
            console.error('Failed to load Razorpay checkout script');
            resolve(false);
        };
        document.body.appendChild(script);
    });
};

/**
 * Returns the configured Razorpay Key ID from environment
 */
export const getEnvRazorpayKeyId = (): string => {
    const key = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
    return key.trim();
};

/**
 * Opens the Razorpay modal with custom OrbitX configuration
 */
export const openRazorpayCheckout = async (config: RazorpayCheckoutConfig): Promise<boolean> => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded || !window.Razorpay) {
        throw new Error('Razorpay SDK could not be loaded. Check your internet connection.');
    }

    if (!config.key || config.key.includes('your_key_id_here')) {
        throw new Error('Please configure a valid Razorpay Key ID in your .env or the checkout window.');
    }

    const options: RazorpayOptions = {
        key: config.key,
        amount: config.amountInPaise,
        currency: config.currency || 'INR',
        name: config.name || 'OrbitX Space & Astronomy Club',
        description: config.description || 'OrbitX Order Checkout',
        image: config.image || '/orbitx-logo.svg',
        order_id: config.orderId,
        handler: (response) => {
            config.onSuccess(response);
        },
        prefill: config.prefill,
        notes: config.notes,
        theme: {
            color: '#0a0a0f',
            backdrop_color: 'rgba(0, 0, 0, 0.85)'
        },
        modal: {
            ondismiss: () => {
                if (config.onDismiss) {
                    config.onDismiss();
                }
            },
            escape: true,
            backdropclose: false
        }
    };

    const rzp = new window.Razorpay(options);

    if (config.onFailure) {
        rzp.on('payment.failed', (response: RazorpayFailureResponse) => {
            config.onFailure!(response);
        });
    }

    rzp.open();
    return true;
};
