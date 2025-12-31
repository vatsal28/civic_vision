import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareModalProps {
    originalImage: string;
    generatedImage: string;
    onClose: () => void;
    mode?: 'CITY' | 'HOME';
}

export const ShareModal: React.FC<ShareModalProps> = ({ originalImage, generatedImage, onClose, mode = 'CITY' }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [shareImageUrl, setShareImageUrl] = useState<string | null>(null);

    const generateShareImage = async (): Promise<string> => {
        return new Promise((resolve, reject) => {
            // Add timeout to prevent infinite hanging
            const timeout = setTimeout(() => {
                reject(new Error('Image generation timed out. Please try again.'));
            }, 30000); // 30 second timeout

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                clearTimeout(timeout);
                reject(new Error('Could not get canvas context'));
                return;
            }

            const img1 = new Image();
            const img2 = new Image();

            // Don't set crossOrigin for data URLs - it causes CORS issues
            if (!originalImage.startsWith('data:')) {
                img1.crossOrigin = 'anonymous';
            }
            if (!generatedImage.startsWith('data:')) {
                img2.crossOrigin = 'anonymous';
            }

            let loadedCount = 0;
            const onLoad = () => {
                loadedCount++;
                if (loadedCount === 2) {
                    clearTimeout(timeout);
                    // Calculate dimensions - side by side layout
                    const MAX_HEIGHT = 2048;
                    let width = img1.width;
                    let height = img1.height;

                    // Scale down if too large
                    if (height > MAX_HEIGHT) {
                        const ratio = MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                        width = Math.round(width * ratio);
                    }

                    // Canvas dimensions: side by side with extra space for branding
                    const spacing = 2; // Divider width
                    const brandingHeight = 80; // Space for branding text
                    canvas.width = width * 2 + spacing;
                    canvas.height = height + brandingHeight;

                    // Fill dark background
                    ctx.fillStyle = '#0a0f1a';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    // Draw images side by side
                    ctx.drawImage(img1, 0, 0, width, height);
                    ctx.drawImage(img2, width + spacing, 0, width, height);

                    // Add divider line
                    ctx.strokeStyle = '#252f3f';
                    ctx.lineWidth = spacing;
                    ctx.beginPath();
                    ctx.moveTo(width, 0);
                    ctx.lineTo(width, height);
                    ctx.stroke();

                    // Add gradient overlay at bottom for text readability
                    const gradientHeight = 100;
                    const gradient = ctx.createLinearGradient(0, height, 0, height + brandingHeight);
                    gradient.addColorStop(0, 'rgba(10, 15, 26, 0)');
                    gradient.addColorStop(1, 'rgba(10, 15, 26, 1)');
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, height, canvas.width, brandingHeight);

                    // Add "BEFORE" and "AFTER" labels at top
                    const labelFontSize = Math.max(24, width / 25);
                    ctx.font = `bold ${labelFontSize}px Inter, sans-serif`;
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
                    ctx.shadowBlur = 8;
                    ctx.textAlign = 'left';
                    ctx.fillText('BEFORE', 20, labelFontSize + 10);
                    ctx.textAlign = 'right';
                    ctx.fillText('AFTER', canvas.width - 20, labelFontSize + 10);

                    // Add branding text at bottom
                    ctx.shadowBlur = 0;
                    ctx.textAlign = 'center';
                    const brandingFontSize = Math.max(18, width / 30);
                    ctx.font = `600 ${brandingFontSize}px Inter, sans-serif`;
                    ctx.fillStyle = mode === 'HOME' ? '#ec4899' : '#4f7eff';
                    ctx.fillText('This image was created using Civic Vision AI', canvas.width / 2, height + brandingHeight - 25);

                    // Add website URL below
                    ctx.font = `${Math.max(14, width / 40)}px Inter, sans-serif`;
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                    ctx.fillText('civicvision.ai', canvas.width / 2, height + brandingHeight - 5);

                    resolve(canvas.toDataURL('image/jpeg', 0.92));
                }
            };

            img1.onerror = () => {
                clearTimeout(timeout);
                reject(new Error('Failed to load original image'));
            };
            img2.onerror = () => {
                clearTimeout(timeout);
                reject(new Error('Failed to load generated image'));
            };

            // Set up load handlers
            img1.onload = onLoad;
            img2.onload = onLoad;

            // Set src
            img1.src = originalImage;
            img2.src = generatedImage;

            // Check if images are already loaded (cached) - use setTimeout to ensure handlers are set
            setTimeout(() => {
                if (img1.complete && img2.complete && loadedCount < 2) {
                    // Both images already loaded, call onLoad directly
                    onLoad();
                }
            }, 10);
        });
    };

    const handleShare = async (platform: 'twitter' | 'facebook' | 'whatsapp' | 'instagram' | 'sms' | 'native') => {
        setIsGenerating(true);

        try {
            // Generate composite image if not already generated
            let imageDataUrl = shareImageUrl;
            if (!imageDataUrl) {
                imageDataUrl = await generateShareImage();
                setShareImageUrl(imageDataUrl);
            }

            const shareText = `Check out this transformation! Created with Civic Vision AI 🚀\n\n${mode === 'HOME' ? 'Reimagine your space' : 'Transform your city'} → civicvision.ai`;

            // Use native Web Share API if available (especially on mobile)
            if (platform === 'native' && navigator.share) {
                try {
                    // Convert data URL to blob for sharing
                    const response = await fetch(imageDataUrl);
                    const blob = await response.blob();
                    const file = new File([blob], 'civic-vision-transformation.jpg', { type: 'image/jpeg' });

                    await navigator.share({
                        title: 'Civic Vision Transformation',
                        text: shareText,
                        files: [file],
                    });
                    setIsGenerating(false);
                    return;
                } catch (err: any) {
                    // User cancelled or error - fall through to other methods
                    if (err.name !== 'AbortError') {
                        console.error('Native share failed:', err);
                    }
                }
            }

            // Convert image to blob for download
            const response = await fetch(imageDataUrl);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'civic-vision-transformation.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            // Open platform-specific share URLs
            const encodedText = encodeURIComponent(shareText);
            const encodedUrl = encodeURIComponent('https://civicvision.ai');

            let shareUrl = '';

            switch (platform) {
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
                    break;
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
                    break;
                case 'instagram':
                    // Instagram doesn't support direct sharing via URL
                    // User will need to upload the downloaded image manually
                    alert('Please upload the downloaded image to Instagram Stories or Feed');
                    setIsGenerating(false);
                    return;
                case 'sms':
                    shareUrl = `sms:?body=${encodedText}%20${encodedUrl}`;
                    break;
            }

            if (shareUrl) {
                setTimeout(() => {
                    window.open(shareUrl, '_blank');
                    setIsGenerating(false);
                }, 300);
            } else {
                setIsGenerating(false);
            }
        } catch (error) {
            console.error('Error sharing:', error);
            alert('Failed to share. Please try again.');
            setIsGenerating(false);
        }
    };

    const accentColor = mode === 'HOME' ? '#ec4899' : '#4f7eff';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-[#0a0f1a]/90 backdrop-blur-sm"
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-md bg-[#151c2c] rounded-2xl shadow-2xl border border-[#252f3f] overflow-hidden"
            >
                {/* Header */}
                <div
                    className="p-6 text-center border-b border-[#252f3f]"
                    style={{
                        background: `linear-gradient(135deg, ${accentColor}, ${mode === 'HOME' ? '#f472b6' : '#6366f1'})`,
                    }}
                >
                    <h2 className="text-2xl font-bold text-white mb-1">Share Your Transformation</h2>
                    <p className="text-white/80 text-sm">Show the world what's possible!</p>
                </div>

                <div className="p-6">
                    <p className="text-gray-400 text-sm mb-6 text-center">
                        Share your before/after transformation on social media
                    </p>

                    <div className="space-y-3">
                        {/* Native Share (Mobile) */}
                        {navigator.share && (
                            <button
                                onClick={() => handleShare('native')}
                                disabled={isGenerating}
                                className="w-full flex items-center gap-4 p-4 bg-[#1e2638] hover:bg-[#252f3f] border border-[#252f3f] rounded-xl transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="w-10 h-10 rounded-full bg-[#0f1520] flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="text-white font-semibold">Share</div>
                                    <div className="text-gray-400 text-xs">Use your device's share menu</div>
                                </div>
                                <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        )}

                        {/* WhatsApp */}
                        <button
                            onClick={() => handleShare('whatsapp')}
                            disabled={isGenerating}
                            className="w-full flex items-center gap-4 p-4 bg-[#1e2638] hover:bg-[#25D366]/20 border border-[#252f3f] hover:border-[#25D366] rounded-xl transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                            </div>
                            <div className="flex-1 text-left">
                                <div className="text-white font-semibold">Share on WhatsApp</div>
                                <div className="text-gray-400 text-xs">Send to contacts</div>
                            </div>
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* SMS */}
                        <button
                            onClick={() => handleShare('sms')}
                            disabled={isGenerating}
                            className="w-full flex items-center gap-4 p-4 bg-[#1e2638] hover:bg-[#252f3f] border border-[#252f3f] rounded-xl transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="w-10 h-10 rounded-full bg-[#0f1520] flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <div className="flex-1 text-left">
                                <div className="text-white font-semibold">Share via SMS</div>
                                <div className="text-gray-400 text-xs">Send as text message</div>
                            </div>
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* Twitter/X */}
                        <button
                            onClick={() => handleShare('twitter')}
                            disabled={isGenerating}
                            className="w-full flex items-center gap-4 p-4 bg-[#1e2638] hover:bg-[#1DA1F2]/20 border border-[#252f3f] hover:border-[#1DA1F2] rounded-xl transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="w-10 h-10 rounded-full bg-[#1DA1F2] flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </div>
                            <div className="flex-1 text-left">
                                <div className="text-white font-semibold">Share on X (Twitter)</div>
                                <div className="text-gray-400 text-xs">Post to your timeline</div>
                            </div>
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* Facebook */}
                        <button
                            onClick={() => handleShare('facebook')}
                            disabled={isGenerating}
                            className="w-full flex items-center gap-4 p-4 bg-[#1e2638] hover:bg-[#4267B2]/20 border border-[#252f3f] hover:border-[#4267B2] rounded-xl transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="w-10 h-10 rounded-full bg-[#4267B2] flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </div>
                            <div className="flex-1 text-left">
                                <div className="text-white font-semibold">Share on Facebook</div>
                                <div className="text-gray-400 text-xs">Post to your feed</div>
                            </div>
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* Instagram */}
                        <button
                            onClick={() => handleShare('instagram')}
                            disabled={isGenerating}
                            className="w-full flex items-center gap-4 p-4 bg-[#1e2638] hover:bg-[#E4405F]/20 border border-[#252f3f] hover:border-[#E4405F] rounded-xl transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </div>
                            <div className="flex-1 text-left">
                                <div className="text-white font-semibold">Share on Instagram</div>
                                <div className="text-gray-400 text-xs">Upload the downloaded image</div>
                            </div>
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {isGenerating && (
                        <div className="mt-6 p-4 bg-[#1e2638] border border-[#252f3f] rounded-xl">
                            <div className="flex items-center gap-3 mb-2">
                                <svg className="animate-spin h-5 w-5" style={{ color: accentColor }} viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="text-white text-sm font-medium">Preparing your image...</span>
                            </div>
                            <p className="text-gray-400 text-xs">Generating composite image with branding</p>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <button
                            onClick={onClose}
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
