/**
 * Razorpay SDK Loader and Types
 * Dynamically loads the Razorpay checkout script
 */

declare global {
    interface Window {
        Razorpay: any;
    }
}

export interface RazorpayResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

export interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    order_id: string;
    name: string;
    description: string;
    image?: string;
    prefill?: {
        email?: string;
        name?: string;
        contact?: string;
    };
    theme?: {
        color?: string;
    };
    handler: (response: RazorpayResponse) => void;
    modal?: {
        ondismiss?: () => void;
        escape?: boolean;
        confirm_close?: boolean;
    };
}

/**
 * Load Razorpay SDK dynamically
 * Returns the Razorpay constructor when loaded
 */
export const loadRazorpay = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        // Already loaded
        if (window.Razorpay) {
            return resolve(window.Razorpay);
        }

        // Check if script is already loading
        const existingScript = document.querySelector('script[src*="razorpay"]');
        if (existingScript) {
            existingScript.addEventListener('load', () => resolve(window.Razorpay));
            existingScript.addEventListener('error', () => reject(new Error('Failed to load Razorpay')));
            return;
        }

        // Load script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
            if (window.Razorpay) {
                resolve(window.Razorpay);
            } else {
                reject(new Error('Razorpay not available after load'));
            }
        };
        script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
        document.body.appendChild(script);
    });
};

/**
 * Open Razorpay checkout modal
 */
export const openRazorpayCheckout = async (options: RazorpayOptions): Promise<void> => {
    const Razorpay = await loadRazorpay();
    const rzp = new Razorpay(options);
    rzp.open();
};

