import { logEvent, Analytics, setAnalyticsCollectionEnabled } from 'firebase/analytics';
import { analytics } from '../firebase';

// Helper to safely log events (handles SSR and unsupported browsers)
const safeLogEvent = async (eventName: string, params?: Record<string, any>) => {
    try {
        const analyticsInstance = await analytics;
        if (analyticsInstance) {
            logEvent(analyticsInstance as Analytics, eventName, params);
            console.log(`📊 Analytics: ${eventName}`, params || '');
        } else {
            console.warn('📊 Analytics not available');
        }
    } catch (error) {
        console.warn('Analytics event failed:', eventName, error);
    }
};

// ============================================
// CORE USER JOURNEY EVENTS
// ============================================

export const trackSignUp = (method: 'google' | 'byok') => {
    safeLogEvent('sign_up', { method });
};

export const trackLogin = (method: 'google' | 'byok') => {
    safeLogEvent('login', { method });
};

export const trackAuthModeSelected = (mode: 'guest' | 'byok') => {
    safeLogEvent('select_auth_mode', { mode });
};

// ============================================
// FEATURE USAGE EVENTS
// ============================================

export const trackImageUploaded = () => {
    safeLogEvent('image_uploaded');
};

export const trackFiltersSelected = (filters: string[], count: number) => {
    safeLogEvent('filters_selected', {
        filters: filters.join(','),
        filter_count: count,
    });
};

export const trackGenerateStarted = (filterCount: number, authMode: string) => {
    safeLogEvent('generate_started', {
        filter_count: filterCount,
        auth_mode: authMode,
    });
};

export const trackGenerateSuccess = (filterCount: number, authMode: string) => {
    safeLogEvent('generate_success', {
        filter_count: filterCount,
        auth_mode: authMode,
    });
};

export const trackGenerateError = (errorType: string, authMode: string) => {
    safeLogEvent('generate_error', {
        error_type: errorType,
        auth_mode: authMode,
    });
};

export const trackImageDownloaded = () => {
    safeLogEvent('image_downloaded');
};

// ============================================
// MONETIZATION EVENTS  
// ============================================

export const trackPricingModalOpened = (currentCredits: number) => {
    safeLogEvent('pricing_modal_opened', {
        current_credits: currentCredits,
    });
};

export const trackCreditsExhausted = () => {
    safeLogEvent('credits_exhausted');
};

export const trackPurchaseInitiated = (packageId: string, amount: number) => {
    safeLogEvent('purchase_initiated', {
        package_id: packageId,
        amount: amount,
    });
};

// ============================================
// ENGAGEMENT EVENTS
// ============================================

export const trackPageView = (pageName: string) => {
    safeLogEvent('page_view', { page_name: pageName });
};

export const trackShareClicked = () => {
    safeLogEvent('share_clicked');
};

// ============================================
// ONBOARDING EVENTS
// ============================================

export const trackOnboardingCompleted = () => {
    safeLogEvent('onboarding_completed');
};

export const trackOnboardingSkipped = () => {
    safeLogEvent('onboarding_skipped');
};
