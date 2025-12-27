const Razorpay = require('razorpay');
const crypto = require('crypto');

/**
 * Initialize Razorpay instance with API keys
 * @param {string} keyId - Razorpay Key ID
 * @param {string} keySecret - Razorpay Key Secret
 * @returns {Razorpay} Razorpay instance
 */
function initializeRazorpay(keyId, keySecret) {
    return new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
    });
}

/**
 * Verify Razorpay webhook signature
 * @param {object} payload - Webhook payload
 * @param {string} signature - Signature from webhook header
 * @param {string} webhookSecret - Webhook secret from Razorpay dashboard
 * @returns {boolean} True if signature is valid
 */
function verifyWebhookSignature(payload, signature, webhookSecret) {
    const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(payload))
        .digest('hex');

    return expectedSignature === signature;
}

/**
 * Verify payment signature from client
 * @param {string} orderId - Razorpay order ID
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} signature - Signature from client
 * @param {string} keySecret - Razorpay Key Secret
 * @returns {boolean} True if signature is valid
 */
function verifyPaymentSignature(orderId, paymentId, signature, keySecret) {
    const text = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(text)
        .digest('hex');

    return expectedSignature === signature;
}

module.exports = {
    initializeRazorpay,
    verifyWebhookSignature,
    verifyPaymentSignature,
};
