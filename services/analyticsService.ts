// Local/no-op analytics adapter.
// The public portfolio build should not require Firebase Analytics or any backend setup.

const safeLogEvent = (eventName: string, params?: Record<string, any>) => {
    if (import.meta.env.DEV) {
        console.debug(`[analytics] ${eventName}`, params || '');
    }
};

export const trackSignUp = (method: 'google' | 'byok') => safeLogEvent('sign_up', { method });
export const trackLogin = (method: 'google' | 'byok') => safeLogEvent('login', { method });
export const trackAuthModeSelected = (mode: 'guest' | 'byok') => safeLogEvent('select_auth_mode', { mode });
export const trackImageUploaded = () => safeLogEvent('image_uploaded');
export const trackFiltersSelected = (filters: string[], count: number) => safeLogEvent('filters_selected', { filters: filters.join(','), filter_count: count });
export const trackGenerateStarted = (filterCount: number, authMode: string) => safeLogEvent('generate_started', { filter_count: filterCount, auth_mode: authMode });
export const trackGenerateSuccess = (filterCount: number, authMode: string) => safeLogEvent('generate_success', { filter_count: filterCount, auth_mode: authMode });
export const trackGenerateError = (errorType: string, authMode: string) => safeLogEvent('generate_error', { error_type: errorType, auth_mode: authMode });
export const trackImageDownloaded = () => safeLogEvent('image_downloaded');
export const trackPageView = (pageName: string) => safeLogEvent('page_view', { page_name: pageName });
export const trackShareClicked = () => safeLogEvent('share_clicked');
export const trackShareModalOpened = () => safeLogEvent('share_modal_opened');
export const trackOnboardingCompleted = () => safeLogEvent('onboarding_completed');
export const trackOnboardingSkipped = () => safeLogEvent('onboarding_skipped');
export const trackValidationStarted = (mode: string) => safeLogEvent('validation_started', { mode });
export const trackValidationResult = (isValid: boolean, confidence: number, issues: string[]) => safeLogEvent('validation_result', { is_valid: isValid, confidence, issues_count: issues.length, issues: issues.join(', ') });
export const trackValidationRetry = (originalIssues: string[]) => safeLogEvent('validation_retry', { original_issues: originalIssues.join(', ') });
export const trackValidationDismissed = (confidence: number) => safeLogEvent('validation_dismissed', { confidence });
export const trackUserFeedback = (params: { rating: 'good' | 'bad'; mode: string; filterCount: number; timestamp: string; }) => safeLogEvent('user_feedback', params);
export const trackFeedbackRetryOffered = () => safeLogEvent('feedback_retry_offered');
export const trackFeedbackRetryAccepted = () => safeLogEvent('feedback_retry_accepted');
export const trackFunnelStep = (step: string, metadata?: Record<string, any>) => safeLogEvent('funnel_step', { step, ...metadata, timestamp: new Date().toISOString() });

export const FUNNEL_STEPS = {
    LANDING_VIEW: 'landing_view',
    AUTH_SHOWN: 'auth_shown',
    SIGNUP_COMPLETED: 'signup_completed',
    ONBOARDING_STARTED: 'onboarding_started',
    ONBOARDING_COMPLETED: 'onboarding_completed',
    FIRST_IMAGE_UPLOADED: 'first_image_uploaded',
    FILTERS_SELECTED: 'filters_selected',
    GENERATION_STARTED: 'generation_started',
    GENERATION_COMPLETED: 'generation_completed',
    RESULT_VIEWED: 'result_viewed',
    SHARE_CLICKED: 'share_clicked',
    DOWNLOAD_CLICKED: 'download_clicked',
    SECOND_GENERATION: 'second_generation',
};
