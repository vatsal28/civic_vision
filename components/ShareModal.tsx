import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ShareModalProps {
    originalImage: string;
    generatedImage: string;
    onClose: () => void;
    mode?: 'CITY' | 'HOME';
}

export const ShareModal: React.FC<ShareModalProps> = ({ originalImage, generatedImage, onClose, mode = 'CITY' }) => {
    const [isGenerating, setIsGenerating] = useState(true);
    const [shareImageUrl, setShareImageUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Auto-generate composite image when modal opens
    useEffect(() => {
        generateShareImage();
    }, []);

    const generateShareImage = async (): Promise<void> => {
        setIsGenerating(true);
        setError(null);

        try {
            const imageDataUrl = await new Promise<string>((resolve, reject) => {
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

            setShareImageUrl(imageDataUrl);
            setIsGenerating(false);
        } catch (err: any) {
            console.error('Error generating share image:', err);
            setError(err.message || 'Failed to generate image. Please try again.');
            setIsGenerating(false);
        }
    };

    const handleShare = async () => {
        if (!shareImageUrl) {
            setError('Image not ready yet. Please wait.');
            return;
        }

        if (!navigator.share) {
            setError('Sharing is not supported on this device. Please download the image instead.');
            return;
        }

        try {
            // Convert data URL to blob for sharing
            const response = await fetch(shareImageUrl);
            const blob = await response.blob();
            const file = new File([blob], 'civic-vision-transformation.jpg', { type: 'image/jpeg' });

            const shareText = mode === 'HOME' 
                ? 'I reimagined this space with civicvision AI'
                : 'I transformed this place with civicvision AI';

            await navigator.share({
                title: 'Civic Vision Transformation',
                text: shareText,
                files: [file],
            });

            // Close modal after successful share
            onClose();
        } catch (err: any) {
            // User cancelled or error
            if (err.name !== 'AbortError') {
                console.error('Share failed:', err);
                setError('Failed to share. Please try again.');
            }
        }
    };

    const handleDownload = () => {
        if (!shareImageUrl) {
            setError('Image not ready yet. Please wait.');
            return;
        }

        const link = document.createElement('a');
        link.href = shareImageUrl;
        link.download = 'civic-vision-transformation.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                    {isGenerating ? (
                        <div className="text-center py-8">
                            <div className="flex justify-center mb-4">
                                <svg className="animate-spin h-12 w-12" style={{ color: accentColor }} viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                            <p className="text-white text-sm font-medium mb-2">Preparing your image...</p>
                            <p className="text-gray-400 text-xs">Generating composite image with branding</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <p className="text-white text-sm font-medium mb-2">Error</p>
                            <p className="text-gray-400 text-xs mb-6">{error}</p>
                            <button
                                onClick={generateShareImage}
                                className="px-4 py-2 bg-[#1e2638] text-white text-sm font-medium rounded-lg border border-[#252f3f] hover:border-gray-500 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <>
                            <p className="text-gray-400 text-sm mb-6 text-center">
                                Share your before/after transformation
                            </p>

                            <div className="space-y-3">
                                {/* Share Button */}
                                {navigator.share ? (
                                    <button
                                        onClick={handleShare}
                                        className="w-full flex items-center justify-center gap-3 p-4 rounded-xl transition-all font-bold text-white shadow-lg"
                                        style={{
                                            background: `linear-gradient(135deg, ${accentColor}, ${mode === 'HOME' ? '#f472b6' : '#6366f1'})`,
                                            boxShadow: `0 4px 15px ${accentColor}40`
                                        }}
                                    >
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                        </svg>
                                        <span>Share</span>
                                    </button>
                                ) : (
                                    <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                                        <p className="text-amber-200 text-sm text-center">
                                            Sharing is not supported on this device. Please download the image instead.
                                        </p>
                                    </div>
                                )}

                                {/* Download Button */}
                                <button
                                    onClick={handleDownload}
                                    className="w-full flex items-center justify-center gap-3 p-4 bg-[#1e2638] hover:bg-[#252f3f] border border-[#252f3f] rounded-xl transition-all text-gray-300 hover:text-white font-medium"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    <span>Download Image</span>
                                </button>
                            </div>
                        </>
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
